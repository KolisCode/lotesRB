import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLotesService, LoteAdmin, LotePayload } from '../../../core/services/admin-lotes.service';
import { UploadService } from '../../../core/services/upload.service';

export const SERVICIOS_OPCIONES = [
  { nombre: 'Agua potable',      icono: 'water' },
  { nombre: 'Energía eléctrica', icono: 'bolt'  },
  { nombre: 'Gas natural',       icono: 'gas'   },
  { nombre: 'Alcantarillado',    icono: 'drain' },
  { nombre: 'Vía pavimentada',   icono: 'road'  },
  { nombre: 'Internet',          icono: 'wifi'  },
];

interface LoteForm {
  numero: string;
  manzana: string;
  area: number | null;
  precio: number | null;
  ubicacion: string;
  estado: 'disponible' | 'reservado' | 'vendido';
  descripcion: string;
  imagen: string;
  latitud: number | null;
  longitud: number | null;
  serviciosSeleccionados: string[];
}

@Component({
  selector: 'app-admin-lotes',
  imports: [FormsModule],
  templateUrl: './lotes.html',
  styleUrl: './lotes.scss',
})
export class AdminLotes implements OnInit {
  private svc = inject(AdminLotesService);
  private uploadSvc = inject(UploadService);

  readonly SERVICIOS = SERVICIOS_OPCIONES;

  lotes            = signal<LoteAdmin[]>([]);
  cargando         = signal(true);
  error            = signal('');
  panelAbierto     = signal(false);
  guardando        = signal(false);
  errorGuardar     = signal('');
  subiendoImg      = signal(false);
  loteEditando     = signal<LoteAdmin | null>(null);
  loteParaEliminar = signal<number | null>(null);

  form: LoteForm = this.formVacio();

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.svc.getAll().subscribe({
      next: lotes => { this.lotes.set(lotes); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar los lotes.'); this.cargando.set(false); },
    });
  }

  abrirCrear() {
    this.loteEditando.set(null);
    this.form = this.formVacio();
    this.errorGuardar.set('');
    this.panelAbierto.set(true);
  }

  abrirEditar(lote: LoteAdmin) {
    this.loteEditando.set(lote);
    this.form = {
      numero:    lote.numero,
      manzana:   lote.manzana,
      area:      lote.area,
      precio:    lote.precio,
      ubicacion: lote.ubicacion,
      estado:    lote.estado,
      descripcion: lote.descripcion ?? '',
      imagen:    lote.imagen ?? '',
      latitud:   lote.latitud,
      longitud:  lote.longitud,
      serviciosSeleccionados: lote.servicios.map(s => s.icono),
    };
    this.errorGuardar.set('');
    this.panelAbierto.set(true);
  }

  cerrarPanel() { this.panelAbierto.set(false); }

  onArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.subiendoImg.set(true);
    this.errorGuardar.set('');
    this.uploadSvc.uploadImagen(file).subscribe({
      next: ({ url }) => { this.form.imagen = url; this.subiendoImg.set(false); },
      error: (err) => {
        this.subiendoImg.set(false);
        this.errorGuardar.set(err?.error?.message ?? 'No se pudo subir la imagen.');
      },
    });
    input.value = '';
  }

  toggleServicio(icono: string) {
    const arr = this.form.serviciosSeleccionados;
    const idx = arr.indexOf(icono);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(icono);
  }

  isServicioSeleccionado(icono: string) {
    return this.form.serviciosSeleccionados.includes(icono);
  }

  guardar() {
    if (this.form.area == null || this.form.precio == null) return;
    this.guardando.set(true);
    this.errorGuardar.set('');

    const payload: LotePayload = {
      numero:    this.form.numero.trim(),
      manzana:   this.form.manzana.trim(),
      area:      this.form.area,
      precio:    this.form.precio,
      ubicacion: this.form.ubicacion.trim(),
      estado:    this.form.estado,
      descripcion: this.form.descripcion.trim() || undefined,
      imagen:    this.form.imagen.trim() || undefined,
      latitud:   this.form.latitud ?? undefined,
      longitud:  this.form.longitud ?? undefined,
      servicios: SERVICIOS_OPCIONES.filter(s =>
        this.form.serviciosSeleccionados.includes(s.icono)
      ),
    };

    const op = this.loteEditando()
      ? this.svc.update(this.loteEditando()!.id, payload)
      : this.svc.create(payload);

    op.subscribe({
      next: () => { this.guardando.set(false); this.panelAbierto.set(false); this.cargar(); },
      error: (err) => {
        this.guardando.set(false);
        const msg = err?.error?.message;
        this.errorGuardar.set(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.'));
      },
    });
  }

  confirmarEliminar(id: number) { this.loteParaEliminar.set(id); }
  cancelarEliminar()            { this.loteParaEliminar.set(null); }

  eliminar() {
    const id = this.loteParaEliminar();
    if (!id) return;
    this.svc.remove(id).subscribe({
      next: () => { this.loteParaEliminar.set(null); this.cargar(); },
      error: () => this.error.set('No se pudo eliminar el lote.'),
    });
  }

  formatPrecio(p: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p);
  }

  private formVacio(): LoteForm {
    return {
      numero: '', manzana: '', area: null, precio: null,
      ubicacion: '', estado: 'disponible', descripcion: '', imagen: '',
      latitud: null, longitud: null, serviciosSeleccionados: [],
    };
  }
}
