import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriasService } from '../../core/services/categorias.service';
import { GenerosService } from '../../core/services/generos.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
})
export class CatalogoComponent implements OnInit {
  items: any[] = [];
  cargando = true;
  error = '';
  titulo = 'Categorías';
  private esGeneros = false;

  constructor(
    private router: Router,
    private categoriasService: CategoriasService,
    private generosService: GenerosService,
  ) {}

  ngOnInit(): void {
    this.esGeneros = this.router.url.includes('generos');
    if (this.esGeneros) this.titulo = 'Géneros';
    this.cargar();
  }

  private get service() {
    return this.esGeneros ? this.generosService : this.categoriasService;
  }

  cargar(): void {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = `Error al cargar ${this.titulo.toLowerCase()}`; this.cargando = false; },
    });
  }
}
