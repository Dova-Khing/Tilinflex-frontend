import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbService } from '../../../core/apis/tmdb/tmdb.service';

@Component({
  selector: 'app-obra-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './obra-detalle.component.html',
  styleUrl: './obra-detalle.component.scss',
})
export class ObraDetalleComponent implements OnInit {
  obra: any = null;
  streamUrl: SafeResourceUrl | null = null;
  type: 'movie' | 'tv' = 'movie';

  constructor(
    private route: ActivatedRoute,
    private tmdb: TmdbService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.type = (this.route.snapshot.queryParamMap.get('type') as 'movie' | 'tv') || 'movie';

    const request$ = this.type === 'tv' ? this.tmdb.getTvById(id) : this.tmdb.getMovieById(id);

    request$.subscribe((res: any) => {
      this.obra = res;
      const url = this.tmdb.getStreamUrl(this.type, id);
      this.streamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  getImage(path: string): string {
    return path ? `https://image.tmdb.org/t/p/original${path}` : '';
  }
}
