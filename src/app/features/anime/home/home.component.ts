import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimeService } from '../../../core/services/anime.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  spotlight: any[] = [];
  trending: any[] = [];
  latestEpisodes: any[] = [];
  topUpcoming: any[] = [];
  genres: { name: string; id: number }[] = [];


  heroIndex = 0;
  cargando = true;
  error = '';

  constructor(
    private anime: AnimeService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.anime.home().subscribe({
      next: (res: any) => {
        const d = res?.data ?? res;
        this.spotlight      = d?.spotlightAnimes ?? [];
        this.trending       = d?.trendingAnimes ?? [];
        this.latestEpisodes = d?.latestEpisodeAnimes ?? [];
        this.topUpcoming    = d?.topUpcomingAnimes ?? [];
        this.genres = d?.genres ?? [];
        this.cargando = false;
      },
      error: () => { this.error = 'No se pudo conectar al servidor de streaming.'; this.cargando = false; },
    });
  }

  get hero() { return this.spotlight[this.heroIndex] ?? null; }

  prevHero() { this.heroIndex = (this.heroIndex - 1 + this.spotlight.length) % this.spotlight.length; }
  nextHero() { this.heroIndex = (this.heroIndex + 1) % this.spotlight.length; }
  setHero(i: number) { this.heroIndex = i; }

  episodeLabel(anime: any): string {
    const ep = anime?.episodes;
    if (!ep) return '';
    const parts = [];
    if (ep.sub) parts.push(`SUB ${ep.sub}`);
    if (ep.dub) parts.push(`DUB ${ep.dub}`);
    return parts.join(' Â· ');
  }
}
