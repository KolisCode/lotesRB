import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
  },
];
