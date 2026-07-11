import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { AdminContactoService } from '../../../core/services/admin-contacto.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  private auth       = inject(AdminAuthService);
  private contactoSvc = inject(AdminContactoService);
  private router     = inject(Router);

  sidebarOpen   = signal(false);
  /** Signal compartido con la pantalla de contactos: se refresca al marcar leído / eliminar. */
  readonly noLeidosCount = this.contactoSvc.noLeidos;

  get adminNombre() { return this.auth.admin()?.nombre ?? 'Admin'; }

  ngOnInit() { this.contactoSvc.refreshNoLeidos(); }

  cerrarSidebar() { this.sidebarOpen.set(false); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
