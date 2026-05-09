import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CategoriasService } from '../../core/services/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  cargando = true;
  error = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: CategoriasService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.service.getAll().subscribe({
      next: (data) => { this.categorias = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar categorÃ­as'; this.cargando = false; },
    });
  }
}
