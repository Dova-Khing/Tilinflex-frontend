import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

const normalizeAnime = (a: any) => ({
  ...a,
  name:   a.name   ?? a.title  ?? a.jname ?? '',
  poster: a.poster ?? a.image  ?? a.cover ?? '',
  id:     a.id     ?? a.animeId ?? '',
});

const normalizeList = (r: any): any => {
  const d = r?.data ?? r;
  const normalizeSection = (arr: any[]) => (arr ?? []).map(normalizeAnime);
  return {
    ...d,
    spotlightAnimes:    normalizeSection(d?.spotlightAnimes    ?? d?.results ?? []),
    trendingAnimes:     normalizeSection(d?.trendingAnimes     ?? d?.results ?? []),
    latestEpisodeAnimes:normalizeSection(d?.latestEpisodeAnimes ?? []),
    topUpcomingAnimes:  normalizeSection(d?.topUpcomingAnimes  ?? []),
    animes:             normalizeSection(d?.animes ?? d?.results ?? []),
    genres:             d?.genres ?? [],
    totalPages:         d?.totalPages ?? d?.hasNextPage ? 999 : 1,
  };
};

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly api = `${environment.apiUrl}/stream`;

  constructor(private http: HttpClient) {}

  home(): Observable<any> {
    return this.http.get(`${this.api}/home`).pipe(map(normalizeList));
  }

  search(keyword: string, page = 1): Observable<any> {
    return this.http.get(`${this.api}/search`, { params: { keyword, page } }).pipe(map(normalizeList));
  }

  suggest(keyword: string): Observable<any> {
    return this.http.get(`${this.api}/suggest`, { params: { keyword } }).pipe(
      map((r: any) => {
        const d = r?.data ?? r;
        const suggestions = (d?.suggestions ?? d?.results ?? []).map(normalizeAnime);
        return { data: { suggestions } };
      })
    );
  }

  filter(filters: Record<string, any>): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v != null) params = params.set(k, v); });
    return this.http.get(`${this.api}/filter`, { params }).pipe(map(normalizeList));
  }

  info(id: string): Observable<any> {
    return this.http.get(`${this.api}/info`, { params: { id } });
  }

  episodes(animeId: string): Observable<any> {
    return this.http.get(`${this.api}/episodes/${animeId}`).pipe(
      map((r: any) => {
        const eps = r?.data?.episodes ?? r?.episodes ?? r?.data ?? [];
        return { data: { episodes: (Array.isArray(eps) ? eps : []).map((e: any) => ({
          ...e,
          episodeId: e.episodeId ?? e.id ?? '',
          number:    e.number    ?? e.episodeNo ?? e.num ?? 0,
          title:     e.title     ?? e.name ?? '',
        })) } };
      })
    );
  }

  servers(episodeId: string): Observable<any> {
    return this.http.get(`${this.api}/servers/${episodeId}`);
  }

  play(id: string, server = 'hd-1', type = 'sub'): Observable<any> {
    return this.http.get(`${this.api}/play`, { params: { id, server, type } }).pipe(
      map((r: any) => {
        const d = r?.data ?? r;
        return {
          data: {
            sources:   d?.sources   ?? [],
            subtitles: d?.subtitles ?? [],
          },
        };
      })
    );
  }

  topTen(): Observable<any> {
    return this.http.get(`${this.api}/top`).pipe(map(normalizeList));
  }

  category(name: string, page = 1): Observable<any> {
    return this.http.get(`${this.api}/category/${name}`, { params: { page } }).pipe(map(normalizeList));
  }
}
