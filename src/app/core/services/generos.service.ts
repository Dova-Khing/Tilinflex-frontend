import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GenerosService {
  private readonly api = `${environment.apiUrl}/generos`;

  constructor(private http: HttpClient) {}

  getAll()             { return this.http.get<any[]>(this.api); }
  getById(id: string)  { return this.http.get<any>(`${this.api}/${id}`); }
  create(data: any)    { return this.http.post<any>(this.api, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.api}/${id}`, data); }
  delete(id: string)   { return this.http.delete<any>(`${this.api}/${id}`); }
}