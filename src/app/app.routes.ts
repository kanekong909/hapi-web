import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/movimientos', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login').then(m => m.LoginComponent),
      },
      {
        path: 'registro',
        loadComponent: () => import('./features/auth/registro').then(m => m.RegistroComponent),
      },
    ]
  },
  {
    path: 'movimientos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lista/lista').then(m => m.ListaComponent),
  },
  {
    path: 'movimientos/nuevo',
    canActivate: [authGuard],
    loadComponent: () => import('./features/form/form').then(m => m.FormComponent),
  },
  {
    path: 'movimientos/editar/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/form/form').then(m => m.FormComponent),
  },
  {
    path: 'pnl',
    canActivate: [authGuard],
    loadComponent: () => import('./features/pnl/pnl').then(m => m.PnlComponent),
  },
];
