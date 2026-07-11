import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminSiteConfigService, SiteConfigPayload } from '../../../core/services/admin-site-config.service';
import { Ventaja, Distancia, InfraItem, Paso } from '../../../core/models/site-config.model';

interface ConfigForm {
  whatsappNumber: string;
  telefono: string;
  email: string;
  direccion: string;
  horario: string;
  marca: string;
  tagline: string;
  heroEyebrow: string;
  heroTitulo: string;
  heroSubtitulo: string;
  heroImagen: string;
  ventajas: Ventaja[];
  proyectoMunicipio: string;
  proyectoNombre: string;
  proyectoDescripcion: string;
  distancias: Distancia[];
  infraestructura: InfraItem[];
  pasos: Paso[];
  financiacionTitulo: string;
  financiacionTexto: string;
}

@Component({
  selector: 'app-admin-configuracion',
  imports: [FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
})
export class AdminConfiguracion implements OnInit {
  private svc = inject(AdminSiteConfigService);

  cargando  = signal(true);
  guardando = signal(false);
  subiendo  = signal(false);
  error     = signal('');
  mensajeOk = signal('');

  form: ConfigForm = this.formVacio();

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.svc.get().subscribe({
      next: cfg => {
        this.form = {
          whatsappNumber: cfg.whatsappNumber,
          telefono:      cfg.telefono,
          email:         cfg.email,
          direccion:     cfg.direccion,
          horario:       cfg.horario,
          marca:         cfg.marca,
          tagline:       cfg.tagline,
          heroEyebrow:   cfg.heroEyebrow,
          heroTitulo:    cfg.heroTitulo,
          heroSubtitulo: cfg.heroSubtitulo,
          heroImagen:    cfg.heroImagen ?? '',
          ventajas:      cfg.ventajas.map(v => ({ ...v })),
          proyectoMunicipio:   cfg.proyectoMunicipio,
          proyectoNombre:      cfg.proyectoNombre,
          proyectoDescripcion: cfg.proyectoDescripcion,
          distancias:      cfg.distancias.map(d => ({ ...d })),
          infraestructura: cfg.infraestructura.map(s => ({ ...s })),
          pasos:           cfg.pasos.map(p => ({ ...p })),
          financiacionTitulo: cfg.financiacionTitulo,
          financiacionTexto:  cfg.financiacionTexto,
        };
        this.cargando.set(false);
      },
      error: () => { this.error.set('No se pudo cargar la configuración.'); this.cargando.set(false); },
    });
  }

  agregarVentaja() { this.form.ventajas.push({ icono: '⭐', titulo: '', desc: '' }); }
  eliminarVentaja(i: number) { this.form.ventajas.splice(i, 1); }

  agregarDistancia() { this.form.distancias.push({ icono: '📍', lugar: '', detalle: '' }); }
  eliminarDistancia(i: number) { this.form.distancias.splice(i, 1); }

  agregarInfra() { this.form.infraestructura.push({ icono: '✅', nombre: '' }); }
  eliminarInfra(i: number) { this.form.infraestructura.splice(i, 1); }

  agregarPaso() { this.form.pasos.push({ icono: '🔹', titulo: '', desc: '' }); }
  eliminarPaso(i: number) { this.form.pasos.splice(i, 1); }

  onArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.subiendo.set(true);
    this.error.set('');
    this.svc.uploadImagen(file).subscribe({
      next: ({ url }) => { this.form.heroImagen = url; this.subiendo.set(false); },
      error: (err) => {
        this.subiendo.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo subir la imagen.');
      },
    });
    input.value = '';
  }

  guardar() {
    this.guardando.set(true);
    this.error.set('');
    this.mensajeOk.set('');

    const payload: SiteConfigPayload = {
      whatsappNumber: this.form.whatsappNumber.trim(),
      telefono:  this.form.telefono.trim(),
      email:     this.form.email.trim(),
      direccion: this.form.direccion.trim(),
      horario:   this.form.horario.trim(),
      marca:     this.form.marca.trim(),
      tagline:   this.form.tagline.trim(),
      heroEyebrow:   this.form.heroEyebrow.trim(),
      heroTitulo:    this.form.heroTitulo.trim(),
      heroSubtitulo: this.form.heroSubtitulo.trim(),
      ventajas: this.form.ventajas
        .filter(v => v.titulo.trim() || v.desc.trim())
        .map(v => ({ icono: v.icono.trim() || '⭐', titulo: v.titulo.trim(), desc: v.desc.trim() })),
      proyectoMunicipio:   this.form.proyectoMunicipio.trim(),
      proyectoNombre:      this.form.proyectoNombre.trim(),
      proyectoDescripcion: this.form.proyectoDescripcion.trim(),
      distancias: this.form.distancias
        .filter(d => d.lugar.trim() || d.detalle.trim())
        .map(d => ({ icono: d.icono.trim() || '📍', lugar: d.lugar.trim(), detalle: d.detalle.trim() })),
      infraestructura: this.form.infraestructura
        .filter(s => s.nombre.trim())
        .map(s => ({ icono: s.icono.trim() || '✅', nombre: s.nombre.trim() })),
      pasos: this.form.pasos
        .filter(p => p.titulo.trim() || p.desc.trim())
        .map(p => ({ icono: p.icono.trim() || '🔹', titulo: p.titulo.trim(), desc: p.desc.trim() })),
      financiacionTitulo: this.form.financiacionTitulo.trim(),
      financiacionTexto:  this.form.financiacionTexto.trim(),
    };
    // Enviar null explícito permite borrar la imagen de portada.
    payload.heroImagen = this.form.heroImagen.trim() || null;

    this.svc.update(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensajeOk.set('Cambios guardados. Ya se ven en el sitio público.');
      },
      error: (err) => {
        this.guardando.set(false);
        const msg = err?.error?.message;
        this.error.set(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error al guardar.'));
      },
    });
  }

  private formVacio(): ConfigForm {
    return {
      whatsappNumber: '', telefono: '', email: '', direccion: '', horario: '',
      marca: '', tagline: '', heroEyebrow: '', heroTitulo: '', heroSubtitulo: '',
      heroImagen: '', ventajas: [],
      proyectoMunicipio: '', proyectoNombre: '', proyectoDescripcion: '',
      distancias: [], infraestructura: [], pasos: [],
      financiacionTitulo: '', financiacionTexto: '',
    };
  }
}
