import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  login(email: string, contrasena: string) {
    return this.http.post(`${this.api}/login`, { email, contrasena });
  }

  registro(datos: { nombre: string; apellido: string; email: string; contrasena: string; edad: number | null; pais: string }) {
    return this.http.post(`${environment.apiUrl}/usuarios/`, datos);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getPayload(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getPayload()?.['rol'] === 'admin';
  }
}
