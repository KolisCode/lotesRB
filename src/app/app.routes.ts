import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ── Sitio público ──────────────────────────────────────────────────────────
  {
    path: 'home',
    title: 'TuLote — Tu terreno, tu futuro',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'proyecto',
    title: 'El Proyecto · TuLote',
    loadComponent: () => import('./features/proyecto/proyecto').then(m => m.Proyecto),
  },
  {
    path: 'lotes',
    title: 'Lotes disponibles · TuLote',
    loadComponent: () => import('./features/lotes/lista/lista').then(m => m.Lista),
  },
  {
    path: 'lotes/:slug',
    title: 'Detalle del lote · TuLote',
    loadComponent: () => import('./features/lotes/detalle/detalle').then(m => m.Detalle),
  },
  {
    path: 'contacto',
    title: 'Contacto · TuLote',
    loadComponent: () => import('./features/contacto/contacto').then(m => m.Contacto),
  },

  // ── Panel de administración ────────────────────────────────────────────────
  {
    path: 'admin/login',
    title: 'Admin · TuLote',
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
      {
        path: 'configuracion',
        loadComponent: () => import('./features/admin/configuracion/configuracion').then(m => m.AdminConfiguracion),
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: '**',
    title: 'Página no encontrada · TuLote',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
  },
];
