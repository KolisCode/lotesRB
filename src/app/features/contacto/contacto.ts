import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { whatsappUrl } from '../../core/config/project.constants';
import { ContactoService } from '../../core/services/contacto.service';

interface FormData {
  nombre: string;
  telefono: string;
  email: string;
  interes: string;
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

  enviado  = signal(false);
  enviando = signal(false);
  errorEnvio = signal(false);

  readonly whatsappUrl = whatsappUrl('Hola, me interesa un lote');

  form: FormData = {
    nombre: '', telefono: '', email: '', interes: '', mensaje: '',
  };

  onSubmit() {
    this.enviando.set(true);
    this.errorEnvio.set(false);

    const mensajeCompleto = [
      this.form.interes ? `Interés: ${this.form.interes}` : '',
      this.form.mensaje,
    ].filter(Boolean).join('\n') || 'Sin mensaje adicional.';

    this.contactoSvc.enviar({
      nombre:   this.form.nombre.trim(),
      email:    this.form.email.trim(),
      telefono: this.form.telefono.trim() || undefined,
      mensaje:  mensajeCompleto,
    }).subscribe({
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
    this.form = { nombre: '', telefono: '', email: '', interes: '', mensaje: '' };
  }
}
