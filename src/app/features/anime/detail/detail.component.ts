import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { AnimeService } from '../../../core/services/anime.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit, OnDestroy {
  info: any       = null;
  episodes: any[] = [];
  servers: any[]  = [];

  selectedEp: any    = null;
  selectedServer     = 'hd-1';
  selectedType       = 'sub';
  streamSources: any = null;
  embedUrl: SafeResourceUrl | null = null;

  cargandoInfo   = true;
  cargandoStream = false;
  errorInfo      = '';
  errorStream    = '';

  private destroy$ = new Subject<void>();
  private hls: any  = null;

  constructor(
    private anime: AnimeService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(p => {
      this.resetState();
      this.cargarInfo(p['id']);
    });
  }

  ngOnDestroy() {
    this.destroyHls();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resetState() {
    this.destroyHls();
    this.info = null; this.episodes = []; this.servers = [];
    this.selectedEp = null; this.streamSources = null; this.embedUrl = null;
    this.cargandoInfo = true; this.errorInfo = ''; this.errorStream = '';
  }

  private cargarInfo(animeId: string) {
    this.anime.info(animeId).subscribe({
      next: (r: any) => {
        this.info = r?.data?.anime ?? r?.data ?? r;
        this.cargandoInfo = false;
        this.cargarEpisodios(animeId);
      },
      error: () => { this.errorInfo = 'No se pudo cargar la información.'; this.cargandoInfo = false; },
    });
  }

  private cargarEpisodios(animeId: string) {
    this.anime.episodes(animeId).subscribe({
      next: (r: any) => {
        this.episodes = r?.data?.episodes ?? r?.episodes ?? [];
        if (this.episodes.length) this.seleccionarEp(this.episodes[0]);
      },
    });
  }

  seleccionarEp(ep: any) {
    this.selectedEp    = ep;
    this.streamSources = null;
    this.errorStream   = '';
    this.cargarServers(ep.episodeId ?? ep.id);
  }

  private cargarServers(epId: string) {
    this.anime.servers(epId).subscribe({
      next: (r: any) => {
        const d = r?.data ?? r;
        this.servers = d?.sub ?? d?.servers ?? [];
        if (this.servers.length) {
          this.selectedServer = this.servers[0].serverName ?? this.servers[0];
        }
        this.cargarStream(epId);
      },
    });
  }

  cargarStream(epId?: string) {
    const id = epId ?? (this.selectedEp?.episodeId ?? this.selectedEp?.id);
    if (!id) return;
    this.cargandoStream = true;
    this.errorStream    = '';
    this.embedUrl       = null;
    this.destroyHls();
    this.anime.play(id, this.selectedServer, this.selectedType).subscribe({
      next: (r: any) => {
        this.streamSources = r?.data ?? r;
        this.cargandoStream = false;
        const rawEmbed = this.streamSources?.embedUrl;
        if (rawEmbed) {
          this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawEmbed);
        } else if (this.streamSources?.message) {
          this.errorStream = this.streamSources.message;
        }
      },
      error: () => { this.errorStream = 'No se pudo cargar el stream.'; this.cargandoStream = false; },
    });
  }

  private destroyHls() {
    if (this.hls) { this.hls.destroy(); this.hls = null; }
  }

  cambiarTipo(tipo: string) {
    this.selectedType = tipo;
    this.cargarStream();
  }

  cambiarServer(server: string) {
    this.selectedServer = server;
    this.cargarStream();
  }

  get infoInfo() { return this.info?.info ?? this.info; }
  get moreInfo() { return this.info?.moreInfo ?? null; }
  get relations() {
    const all: any[] = this.info?.relations ?? [];
    const order = ['PREQUEL','PARENT','SEQUEL','SIDE_STORY','ALTERNATIVE','SPIN_OFF','OTHER'];
    return all
      .filter((r: any) => ['TV','MOVIE','OVA','ONA','SPECIAL'].includes(r.format))
      .sort((a: any, b: any) => order.indexOf(a.relation) - order.indexOf(b.relation));
  }
}
