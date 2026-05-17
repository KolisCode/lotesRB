import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { LoteCard } from '../../shared/components/lote-card/lote-card';
import { LotesService } from '../../core/services/lotes.service';
import { whatsappUrl } from '../../core/config/project.constants';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LoteCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private svc = inject(LotesService);

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

  readonly whatsappUrl = whatsappUrl('Hola, me interesa un lote');

  ventajas = [
    { icono: '📄', titulo: 'Escrituración garantizada',
      desc: 'Todos los lotes cuentan con escritura pública y registro en Instrumentos Públicos.' },
    { icono: '💧', titulo: 'Servicios disponibles',
      desc: 'Agua potable, energía, alcantarillado y vías de acceso en cada sector.' },
    { icono: '📍', titulo: 'Excelente ubicación',
      desc: 'Zona de alta valorización, conectada a vías principales y centros urbanos.' },
    { icono: '💰', titulo: 'Financiación directa',
      desc: 'Cuota inicial y saldo en cómodas cuotas. Sin banco, sin trámites complicados.' },
  ];
}
