import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // PUBLICO - streaming anime
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/anime/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'browse',
        loadComponent: () =>
          import('./features/anime/browse/browse.component').then((m) => m.BrowseComponent),
      },
      {
        path: 'anime/:id',
        loadComponent: () =>
          import('./features/anime/detail/detail.component').then((m) => m.DetailComponent),
      },
    ],
  },

  // AUTH
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

  // ADMIN
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
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
          import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
      },
      {
        path: 'generos',
        loadComponent: () =>
          import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/perfil.component').then((m) => m.PerfilComponent),
      },
      {
        path: 'suscripciones',
        loadComponent: () =>
          import('./features/suscripcion/suscripcion.component').then((m) => m.SuscripcionComponent),
      },
    ],
  },

  { path: '**', redirectTo: '/' },
];
