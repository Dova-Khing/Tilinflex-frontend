import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GenerosService } from '../../../core/services/generos.service';

@Component({
  selector: 'app-generos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generos.component.html',
  styleUrls: ['./generos.component.scss'],
})
export class GenerosComponent implements OnInit {
  generos: any[] = [];
  cargando = true;
  error = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: GenerosService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.service.getAll().subscribe({
      next: (data) => { this.generos = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar géneros'; this.cargando = false; },
    });
  }
}
