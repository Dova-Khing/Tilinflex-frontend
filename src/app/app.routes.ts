import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
       {
        path: '',
        redirectTo: 'dashboard',   // ← ahora redirige al dashboard
        pathMatch: 'full',
      },
      {
        path: 'dashboard',         // ← ruta nueva
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: '',
        redirectTo: 'obras',
        pathMatch: 'full',
      },
      {
        path: 'obras',
        loadComponent: () =>
          import('./features/obras/obras.component').then((m) => m.ObrasComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/catalogo/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
      },
      {
        path: 'generos',
        loadComponent: () =>
          import('./features/catalogo/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
      },
      {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/perfil/perfil/perfil.component').then((m) => m.PerfilComponent),
      },
      {
        path: 'suscripciones',
        loadComponent: () =>
          import('./features/suscripcion/suscripcion/suscripcion.component').then((m) => m.SuscripcionComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
