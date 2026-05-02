import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/movimientos', pathMatch: 'full' },
  {
    path: 'movimientos',
    loadComponent: () => import('./features/lista/lista').then(m => m.ListaComponent),
  },
  {
    path: 'movimientos/nuevo',
    loadComponent: () => import('./features/form/form').then(m => m.FormComponent),
  },
  {
    path: 'movimientos/editar/:id',
    loadComponent: () => import('./features/form/form').then(m => m.FormComponent),
  },
];
