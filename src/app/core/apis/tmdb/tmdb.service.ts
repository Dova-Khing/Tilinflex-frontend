import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly base = environment.tmdbBaseUrl;
  private readonly key = environment.tmdbApiKey;
  readonly imageUrl = environment.tmdbImageUrl;
  readonly vidsrc = environment.vidsrcBaseUrl;

  constructor(private http: HttpClient) {}

  getTrending() {
    return this.http.get(`${this.base}/trending/all/week?api_key=${this.key}&language=es-ES`);
  }

  getPopularMovies() {
    return this.http.get(`${this.base}/movie/popular?api_key=${this.key}&language=es-ES`);
  }

  getPopularSeries() {
    return this.http.get(`${this.base}/tv/popular?api_key=${this.key}&language=es-ES`);
  }

  search(query: string) {
    return this.http.get(`${this.base}/search/multi?api_key=${this.key}&language=es-ES&query=${query}`);
  }

  getMovieById(id: number) {
    return this.http.get(`${this.base}/movie/${id}?api_key=${this.key}&language=es-ES`);
  }

  getTvById(id: number) {
    return this.http.get(`${this.base}/tv/${id}?api_key=${this.key}&language=es-ES`);
  }

  getStreamUrl(type: 'movie' | 'tv', id: number, season?: number, episode?: number): string {
    if (type === 'tv' && season && episode) {
      return `${this.vidsrc}/${type}/${id}/${season}-${episode}`;
    }
    return `${this.vidsrc}/${type}/${id}`;
  }
}
