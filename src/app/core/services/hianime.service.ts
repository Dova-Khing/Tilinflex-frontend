import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HianimeService {
  private readonly api = `${environment.apiUrl}/stream`;

  constructor(private http: HttpClient) {}

  home(): Observable<any> {
    return this.http.get(`${this.api}/home`);
  }

  search(keyword: string, page = 1): Observable<any> {
    return this.http.get(`${this.api}/search`, { params: { keyword, page } });
  }

  suggest(keyword: string): Observable<any> {
    return this.http.get(`${this.api}/suggest`, { params: { keyword } });
  }

  filter(filters: Record<string, any>): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v != null) params = params.set(k, v); });
    return this.http.get(`${this.api}/filter`, { params });
  }

  info(id: string): Observable<any> {
    return this.http.get(`${this.api}/info`, { params: { id } });
  }

  episodes(animeId: string): Observable<any> {
    return this.http.get(`${this.api}/episodes/${animeId}`);
  }

  servers(episodeId: string): Observable<any> {
    return this.http.get(`${this.api}/servers/${episodeId}`);
  }

  play(id: string, server = 'hd-1', type = 'sub'): Observable<any> {
    return this.http.get(`${this.api}/play`, { params: { id, server, type } });
  }

  topTen(): Observable<any> {
    return this.http.get(`${this.api}/top`);
  }

  category(name: string, page = 1): Observable<any> {
    return this.http.get(`${this.api}/category/${name}`, { params: { page } });
  }
}
