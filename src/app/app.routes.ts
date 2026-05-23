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

  // SELECCIÓN DE PERFIL
  {
    path: 'perfiles',
    loadComponent: () =>
      import('./features/perfiles/perfiles.component').then((m) => m.PerfilesComponent),
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
        path: 'catalogo',
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
          import('./features/categorias/categorias.component').then((m) => m.CategoriasComponent),
      },
      {
        path: 'generos',
        loadComponent: () =>
          import('./features/generos/generos.component').then((m) => m.GenerosComponent),
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
