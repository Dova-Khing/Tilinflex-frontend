import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TmdbService } from '../../../core/apis/tmdb/tmdb.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
})
export class CatalogoComponent implements OnInit {
  trending: any[] = [];
  peliculas: any[] = [];
  series: any[] = [];

  constructor(private tmdb: TmdbService) {}

  ngOnInit() {
    this.tmdb.getTrending().subscribe((res: any) => {
      this.trending = res.results.slice(0, 10);
    });

    this.tmdb.getPopularMovies().subscribe((res: any) => {
      this.peliculas = res.results.slice(0, 12);
    });

    this.tmdb.getPopularSeries().subscribe((res: any) => {
      this.series = res.results.slice(0, 12);
    });
  }

  getImage(path: string): string {
    return path ? `${this.tmdb.imageUrl}${path}` : 'https://via.placeholder.com/500x750?text=Sin+imagen';
  }

  getType(item: any): string {
    return item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
  }
}
