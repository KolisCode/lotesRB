import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { LoteCard } from '../../../shared/components/lote-card/lote-card';
import { LotesService } from '../../../core/services/lotes.service';
import { EstadoLote } from '../../../core/models/lote.model';

type OrdenKey = 'precio-asc' | 'precio-desc' | 'area-asc' | 'area-desc';

@Component({
  selector: 'app-lista',
  imports: [FormsModule, LoteCard],
  templateUrl: './lista.html',
  styleUrl: './lista.scss',
})
export class Lista {
  private svc = inject(LotesService);

  cargando = signal(true);
  errorCarga = signal(false);

  private todosLotes = toSignal(
    this.svc.getAll().pipe(
      tap(() => this.cargando.set(false)),
      catchError(() => { this.cargando.set(false); this.errorCarga.set(true); return of([]); }),
    ),
    { initialValue: [] },
  );

  // ── Filtros ──────────────────────────────────────────────────────────────
  filtroEstado  = signal<EstadoLote | 'todos'>('todos');
  filtroAreaMin = signal<number | null>(null);
  filtroAreaMax = signal<number | null>(null);
  filtroPrecio  = signal<number | null>(null);
  orden         = signal<OrdenKey>('precio-asc');
  panelAbierto  = signal(false);

  readonly estadoOpciones: { valor: EstadoLote | 'todos'; label: string }[] = [
    { valor: 'todos',      label: 'Todos'       },
    { valor: 'disponible', label: 'Disponibles' },
    { valor: 'reservado',  label: 'Reservados'  },
    { valor: 'vendido',    label: 'Vendidos'    },
  ];

  readonly ordenOpciones: { valor: OrdenKey; label: string }[] = [
    { valor: 'precio-asc',  label: 'Precio: menor a mayor' },
    { valor: 'precio-desc', label: 'Precio: mayor a menor' },
    { valor: 'area-asc',    label: 'Área: menor a mayor'   },
    { valor: 'area-desc',   label: 'Área: mayor a menor'   },
  ];

  readonly precioOpciones = [
    { label: 'Sin límite',    valor: null       },
    { label: '≤ $35.000.000', valor: 35_000_000 },
    { label: '≤ $45.000.000', valor: 45_000_000 },
    { label: '≤ $55.000.000', valor: 55_000_000 },
  ];

  // ── Resultados reactivos ─────────────────────────────────────────────────
  lotesFiltrados = computed(() => {
    const estado   = this.filtroEstado();
    const areaMin  = this.filtroAreaMin();
    const areaMax  = this.filtroAreaMax();
    const precioMx = this.filtroPrecio();
    const ord      = this.orden();

    let lista = this.svc.filtrar(
      this.todosLotes(),
      estado === 'todos' ? undefined : estado,
      areaMin  ?? undefined,
      areaMax  ?? undefined,
      precioMx ?? undefined,
    );

    return [...lista].sort((a, b) => {
      switch (ord) {
        case 'precio-asc':  return a.precio - b.precio;
        case 'precio-desc': return b.precio - a.precio;
        case 'area-asc':    return a.area - b.area;
        case 'area-desc':   return b.area - a.area;
      }
    });
  });

  resumen = computed(() => this.svc.calcResumen(this.todosLotes()));

  hayFiltrosActivos = computed(() =>
    this.filtroEstado() !== 'todos' ||
    this.filtroAreaMin() !== null   ||
    this.filtroAreaMax() !== null   ||
    this.filtroPrecio() !== null
  );

  // ── Acciones ─────────────────────────────────────────────────────────────
  limpiarFiltros() {
    this.filtroEstado.set('todos');
    this.filtroAreaMin.set(null);
    this.filtroAreaMax.set(null);
    this.filtroPrecio.set(null);
    this.orden.set('precio-asc');
  }

  setEstado(v: EstadoLote | 'todos') { this.filtroEstado.set(v); }
  setOrden(v: OrdenKey)              { this.orden.set(v); }
  setPrecio(v: number | null)        { this.filtroPrecio.set(v); }
  onAreaMin(v: string)               { this.filtroAreaMin.set(v ? +v : null); }
  onAreaMax(v: string)               { this.filtroAreaMax.set(v ? +v : null); }
}
