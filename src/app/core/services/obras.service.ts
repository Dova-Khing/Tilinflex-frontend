import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ObrasService {
  private readonly api = `${environment.apiUrl}/obras`;

  constructor(private http: HttpClient) {}

  getObras() {
    return this.http.get(this.api);
  }

  getObraById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }
}
