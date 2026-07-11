import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ContactoService } from '../../core/services/contacto.service';
import { LotesService } from '../../core/services/lotes.service';
import { SiteConfigService } from '../../core/services/site-config.service';

interface FormData {
  nombre: string;
  telefono: string;
  email: string;
  loteId: number | null;
  mensaje: string;
}

@Component({
  selector: 'app-contacto',
  imports: [FormsModule, RouterLink],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto {
  private contactoSvc = inject(ContactoService);
  private lotesSvc    = inject(LotesService);
  private siteConfig  = inject(SiteConfigService);
  private destroyRef  = inject(DestroyRef);

  readonly cfg = this.siteConfig.config;

  /** Lotes reales para el select "¿Qué lote te interesa?". */
  readonly lotes = toSignal(
    this.lotesSvc.getAll().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  enviado    = signal(false);
  enviando   = signal(false);
  errorEnvio = signal(false);

  get whatsappUrl() { return this.siteConfig.whatsappUrl('Hola, me interesa un lote'); }

  form: FormData = {
    nombre: '', telefono: '', email: '', loteId: null, mensaje: '',
  };

  onSubmit() {
    this.enviando.set(true);
    this.errorEnvio.set(false);

    this.contactoSvc.enviar({
      nombre:   this.form.nombre.trim(),
      email:    this.form.email.trim() || undefined,
      telefono: this.form.telefono.trim() || undefined,
      mensaje:  this.form.mensaje.trim() || 'Sin mensaje adicional.',
      loteId:   this.form.loteId ?? undefined,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        this.enviando.set(false);
        this.errorEnvio.set(true);
      },
    });
  }

  resetForm() {
    this.enviado.set(false);
    this.errorEnvio.set(false);
    this.form = { nombre: '', telefono: '', email: '', loteId: null, mensaje: '' };
  }
}
