/**
 * @module token.interceptor.ts
 * @description
 * Este módulo es responsable de la interceptación de peticiones HTTP.
 * Si el usuario está autenticado, se añade el token de autenticación a la petición.
 * @param {AuthService} auth - Servicio de autenticación.
 * @returns {boolean} - True si el usuario está autenticado, false en caso contrario.
 */


import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};
