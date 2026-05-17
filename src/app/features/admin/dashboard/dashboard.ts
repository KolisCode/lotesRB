import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminLotesService, LoteAdmin } from '../../../core/services/admin-lotes.service';
import { AdminContactoService, ContactoAdmin } from '../../../core/services/admin-contacto.service';

interface Resumen { total: number; disponibles: number; reservados: number; vendidos: number; }

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private lotesSvc    = inject(AdminLotesService);
  private contactoSvc = inject(AdminContactoService);

  cargando  = signal(true);
  resumen   = signal<Resumen | null>(null);
  noLeidos  = signal<ContactoAdmin[]>([]);

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.lotesSvc.getAll().subscribe({
      next: lotes => {
        this.resumen.set({
          total:       lotes.length,
          disponibles: lotes.filter(l => l.estado === 'disponible').length,
          reservados:  lotes.filter(l => l.estado === 'reservado').length,
          vendidos:    lotes.filter(l => l.estado === 'vendido').length,
        });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
    this.contactoSvc.getAll(true).subscribe({
      next: msgs => this.noLeidos.set(msgs.slice(0, 5)),
      error: () => {},
    });
  }

  formatFecha(iso: string) {
    return new Date(iso).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
