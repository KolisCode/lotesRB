import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, EMPTY, forkJoin, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LotesService } from '../../../core/services/lotes.service';
import { PrecioPipe } from '../../../shared/pipes/precio-pipe';
import { Lote } from '../../../core/models/lote.model';
import { SiteConfigService } from '../../../core/services/site-config.service';
import { MapaLote } from '../../../shared/components/mapa-lote/mapa-lote';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink, PrecioPipe, MapaLote],
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss',
})
export class Detalle {
  private route = inject(ActivatedRoute);
  private svc   = inject(LotesService);
  private siteConfig = inject(SiteConfigService);

  cargando   = signal(true);
  errorCarga = signal(false);
  private _lote         = signal<Lote | undefined>(undefined);
  private _relacionados = signal<Lote[]>([]);

  imgActiva = signal(0);

  get lote()        { return this._lote(); }
  get relacionados() { return this._relacionados(); }

  imagenes = computed(() => {
    const l = this._lote();
    return l?.imagen ? [l.imagen] : [];
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      lote: this.svc.getById(id),
      todos: this.svc.getAll().pipe(catchError(() => of([]))),
    }).pipe(
      catchError(() => {
        this.cargando.set(false);
        this.errorCarga.set(true);
        return EMPTY;
      }),
      takeUntilDestroyed(),
    ).subscribe(({ lote, todos }) => {
      this._lote.set(lote);
      this._relacionados.set(
        todos
          .filter(l => l.manzana === lote.manzana && l.id !== id && l.estado === 'disponible')
          .slice(0, 3),
      );
      this.cargando.set(false);
    });
  }

  get whatsappUrl(): string {
    const l = this._lote();
    const mensaje = `Hola, me interesa el Lote ${l?.numero} (Manzana ${l?.manzana}). ¿Podría darme más información?`;
    return this.siteConfig.whatsappUrl(mensaje);
  }

  servicioIconos: Record<string, string> = {
    water: '💧', bolt: '⚡', gas: '🔥', drain: '🚿', road: '🛣️', wifi: '📶',
  };

  iconoServicio(icono: string): string {
    return this.servicioIconos[icono] ?? '✓';
  }
}
