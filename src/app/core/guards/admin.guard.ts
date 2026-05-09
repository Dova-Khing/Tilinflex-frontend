/**
 * @module admin.guard.ts
 * @description
 * Este módulo es responsable de la protección de rutas privadas.
 * Si el usuario no está autenticado, se redirige a la página de inicio de sesión.
 * @param {AuthService} auth - Servicio de autenticación.
 * @param {Router} router - Servicio de enrutamiento.
 * @returns {boolean} - True si el usuario está autenticado, false en caso contrario.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return router.createUrlTree(['/']);
};
