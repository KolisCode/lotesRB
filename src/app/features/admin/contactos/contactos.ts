import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminContactoService, ContactoAdmin } from '../../../core/services/admin-contacto.service';

@Component({
  selector: 'app-admin-contactos',
  templateUrl: './contactos.html',
  styleUrl: './contactos.scss',
})
export class AdminContactos implements OnInit {
  private svc = inject(AdminContactoService);

  mensajes    = signal<ContactoAdmin[]>([]);
  cargando    = signal(true);
  error       = signal('');
  soloNoLeidos = signal(false);
  msgParaEliminar = signal<number | null>(null);

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.svc.getAll(this.soloNoLeidos()).subscribe({
      next: msgs => { this.mensajes.set(msgs); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar los mensajes.'); this.cargando.set(false); },
    });
  }

  toggleFiltro() {
    this.soloNoLeidos.update(v => !v);
    this.cargar();
  }

  marcarLeido(id: number) {
    this.svc.marcarLeido(id).subscribe({
      next: () => {
        this.mensajes.update(msgs =>
          msgs.map(m => m.id === id ? { ...m, leido: true } : m)
        );
      },
      error: () => {},
    });
  }

  confirmarEliminar(id: number) { this.msgParaEliminar.set(id); }
  cancelarEliminar()            { this.msgParaEliminar.set(null); }

  eliminar() {
    const id = this.msgParaEliminar();
    if (id == null) return;
    this.svc.remove(id).subscribe({
      next: () => {
        this.mensajes.update(msgs => msgs.filter(m => m.id !== id));
        this.msgParaEliminar.set(null);
      },
      error: () => { this.error.set('No se pudo eliminar el mensaje.'); this.msgParaEliminar.set(null); },
    });
  }

  formatFecha(iso: string) {
    return new Date(iso).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  noLeidosCount() {
    return this.mensajes().filter(m => !m.leido).length;
  }
}
