import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ObrasService {
  private readonly api = `${environment.apiUrl}/obras`;
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<any[]>(this.api); }
  importar(anilistId: number) { return this.http.post<any>(`${this.api}/importar/${anilistId}`, {}); }
  delete(id: string) { return this.http.delete<any>(`${this.api}/${id}`); }
}
