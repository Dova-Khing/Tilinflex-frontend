import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly api = `${environment.apiUrl}/perfil`;
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<any[]>(this.api); }
  getById(id: string) { return this.http.get<any>(`${this.api}/${id}`); }
}
