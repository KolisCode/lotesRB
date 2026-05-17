import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ── Sitio público ──────────────────────────────────────────────────────────
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'proyecto',
    loadComponent: () => import('./features/proyecto/proyecto').then(m => m.Proyecto),
  },
  {
    path: 'lotes',
    loadComponent: () => import('./features/lotes/lista/lista').then(m => m.Lista),
  },
  {
    path: 'lotes/:id',
    loadComponent: () => import('./features/lotes/detalle/detalle').then(m => m.Detalle),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/contacto/contacto').then(m => m.Contacto),
  },

  // ── Panel de administración ────────────────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login').then(m => m.AdminLogin),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboard),
      },
      {
        path: 'lotes',
        loadComponent: () => import('./features/admin/lotes/lotes').then(m => m.AdminLotes),
      },
      {
        path: 'contactos',
        loadComponent: () => import('./features/admin/contactos/contactos').then(m => m.AdminContactos),
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
  },
];
