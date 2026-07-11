import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { LoteCard } from '../../shared/components/lote-card/lote-card';
import { LotesService } from '../../core/services/lotes.service';
import { SiteConfigService } from '../../core/services/site-config.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LoteCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private svc = inject(LotesService);
  private siteConfig = inject(SiteConfigService);

  readonly cfg = this.siteConfig.config;

  cargando   = signal(true);
  errorLotes = signal(false);

  private lotes = toSignal(
    this.svc.getAll().pipe(
      tap(() => this.cargando.set(false)),
      catchError(() => { this.cargando.set(false); this.errorLotes.set(true); return of([]); }),
    ),
    { initialValue: [] },
  );

  resumen    = computed(() => this.svc.calcResumen(this.lotes()));
  destacados = computed(() => this.lotes().filter(l => l.estado === 'disponible').slice(0, 3));

  get whatsappUrl() { return this.siteConfig.whatsappUrl('Hola, me interesa un lote'); }
}
