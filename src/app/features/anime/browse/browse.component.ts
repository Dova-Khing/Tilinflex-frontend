import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AnimeService } from '../../../core/services/anime.service';

const TIPOS   = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];
const ESTADOS = ['airing', 'complete', 'upcoming'];
const SORTS   = [
  { label: 'Predeterminado',      value: 'default' },
  { label: 'Recién actualizados', value: 'recently-updated' },
  { label: 'Más valorados',       value: 'score' },
  { label: 'Título A-Z',          value: 'name-az' },
];

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit, OnDestroy {
  animes: any[]    = [];
  genres: { name: string; id: number }[] = [];
  totalPages = 1;
  cargando   = true;
  error      = '';

  tipos   = TIPOS;
  estados = ESTADOS;
  sorts   = SORTS;

  filtros = { keyword: '', tipo: '', estado: '', genres: '', sort: 'default', page: 1 };

  private destroy$ = new Subject<void>();

  constructor(
    private anime: AnimeService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(p => {
      this.filtros = {
        keyword: p['q']      ?? '',
        tipo:    p['tipo']   ?? '',
        estado:  p['estado'] ?? '',
        genres:  p['genres'] ?? '',
        sort:    p['sort']   ?? 'default',
        page:    +(p['page'] ?? 1),
      };
      this.cargar();
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  cargar() {
    this.cargando = true;
    this.error    = '';
    const params: any = { page: this.filtros.page };
    if (this.filtros.keyword) params['keyword'] = this.filtros.keyword;
    if (this.filtros.tipo)    params['tipo']    = this.filtros.tipo;
    if (this.filtros.estado)  params['estado']  = this.filtros.estado;
    if (this.filtros.genres)  params['genres']  = this.filtros.genres;
    if (this.filtros.sort !== 'default') params['sort'] = this.filtros.sort;

    this.anime.filter(params).subscribe({
      next: (r: any) => {
        const d        = r?.data ?? r;
        this.animes     = d?.animes ?? d?.results ?? [];
        this.totalPages = d?.totalPages ?? 1;
        if (d?.genres?.length) this.genres = d.genres;
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar el catÃ¡logo.'; this.cargando = false; },
    });
  }

  aplicar() {
    const q: any = {};
    if (this.filtros.keyword) q['q']      = this.filtros.keyword;
    if (this.filtros.tipo)    q['tipo']   = this.filtros.tipo;
    if (this.filtros.estado)  q['estado'] = this.filtros.estado;
    if (this.filtros.genres)  q['genres'] = this.filtros.genres;
    if (this.filtros.sort !== 'default') q['sort'] = this.filtros.sort;
    q['page'] = 1;
    this.router.navigate([], { queryParams: q });
  }

  limpiar() {
    this.filtros = { keyword: '', tipo: '', estado: '', genres: '', sort: 'default', page: 1 };
    this.router.navigate([], { queryParams: {} });
  }

  cambiarPagina(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.router.navigate([], { queryParams: { ...this.route.snapshot.queryParams, page: p } });
  }

  get genreNombre(): string {
    const g = this.genres.find(g => String(g.id) === String(this.filtros.genres));
    return g?.name ?? this.filtros.genres;
  }

  get pages(): number[] {
    const cur = this.filtros.page;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, cur - delta); i <= Math.min(this.totalPages, cur + delta); i++) range.push(i);
    return range;
  }

  episodeLabel(a: any): string {
    const ep = a?.episodes;
    if (!ep) return '';
    const parts: string[] = [];
    if (ep.sub) parts.push(`SUB ${ep.sub}`);
    if (ep.dub) parts.push(`DUB ${ep.dub}`);
    return parts.join(' Â· ');
  }
}
