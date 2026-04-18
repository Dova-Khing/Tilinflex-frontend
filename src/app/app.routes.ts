import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/catalogo/catalogo/catalogo.component').then(
        (m) => m.CatalogoComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./features/catalogo/catalogo/catalogo.component').then(
        (m) => m.CatalogoComponent
      ),
  },
  {
    path: 'obra/:id',
    loadComponent: () =>
      import('./features/obra/obra-detalle/obra-detalle.component').then(
        (m) => m.ObraDetalleComponent
      ),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/perfil/perfil/perfil.component').then(
        (m) => m.PerfilComponent
      ),
  },
  {
    path: 'suscripcion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/suscripcion/suscripcion/suscripcion.component').then(
        (m) => m.SuscripcionComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
