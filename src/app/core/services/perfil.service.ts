import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Perfil {
  id_perfil: string;
  nombre_usuario: string;
  avatar_url: string;
  idioma: string;
  es_infantil: boolean;
  id_usuario: string;
}

const STORAGE_KEY = 'selectedProfile';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly api = `${environment.apiUrl}/perfil`;
  private readonly platformId = inject(PLATFORM_ID);

  private perfilActivo$ = new BehaviorSubject<Perfil | null>(null);
  perfilActivo = this.perfilActivo$.asObservable();

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) this.perfilActivo$.next(JSON.parse(stored));
    }
  }

  getAll() {
    return this.http.get<Perfil[]>(this.api);
  }

  getMisPerfiles() {
    return this.http.get<Perfil[]>(`${this.api}/mis-perfiles`);
  }

  getByUsuario(idUsuario: string) {
    return this.http.get<Perfil[]>(`${this.api}/usuario/${idUsuario}`);
  }

  create(datos: { nombre_usuario: string; avatar_url: string; idioma?: string; es_infantil?: boolean }) {
    return this.http.post<Perfil>(this.api, datos);
  }

  update(id: string, datos: Partial<{ nombre_usuario: string; avatar_url: string; idioma: string; es_infantil: boolean }>) {
    return this.http.put<Perfil>(`${this.api}/${id}`, datos);
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }

  seleccionar(perfil: Perfil) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil));
    }
    this.perfilActivo$.next(perfil);
  }

  limpiar() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.perfilActivo$.next(null);
  }

  getAvatarUrl(avatarId: string): string {
    if (!avatarId) return this.getAvatarUrl('av1');
    if (avatarId.startsWith('data:') || avatarId.startsWith('http')) return avatarId;
    return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  }

  getAvatarOptions(): string[] {
    return ['av1','av2','av3','av4','av5','av6','av7','av8','av9','av10','av11','av12'];
  }
}
