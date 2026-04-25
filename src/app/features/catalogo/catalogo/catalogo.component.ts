import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriasService } from '../../../core/services/categorias.service';
import { GenerosService } from '../../../core/services/generos.service';

interface CatalogoConfig {
  titulo: string;
  subtitulo: string;
  entidad: string;
  idCampo: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
})
export class CatalogoComponent implements OnInit {

  items: any[] = [];
  cargando = true;
  error = '';
  mostrarModal = false;
  editando = false;
  form: any = this.formVacio();

  // Configuración dinámica según la ruta activa
  config: CatalogoConfig = {
    titulo: 'Categorías',
    subtitulo: 'Gestión de categorías',
    entidad: 'categoría',
    idCampo: 'id_categoria',
  };

  private esGeneros = false;

  constructor(
    private router: Router,
    private categoriasService: CategoriasService,
    private generosService: GenerosService,
  ) {}

  ngOnInit(): void {
    // Detecta si la URL activa es /generos o /categorias
    this.esGeneros = this.router.url.includes('generos');

    if (this.esGeneros) {
      this.config = {
        titulo: 'Géneros',
        subtitulo: 'Gestión de géneros',
        entidad: 'género',
        idCampo: 'id_genero',
      };
    }

    this.cargar();
  }

  private get service() {
    return this.esGeneros ? this.generosService : this.categoriasService;
  }

  cargar(): void {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = `Error al cargar ${this.config.titulo.toLowerCase()}`; this.cargando = false; },
    });
  }

  formVacio() {
    return { nombre: '', descripcion: '' };
  }

  abrirCrear(): void {
    this.form = this.formVacio();
    this.editando = false;
    this.mostrarModal = true;
  }

  abrirEditar(item: any): void {
    this.form = { ...item };
    this.editando = true;
    this.mostrarModal = true;
  }

  guardar(): void {
    if (this.editando) {
      this.service.update(this.form[this.config.idCampo], this.form).subscribe({
        next: () => { this.cerrar(); this.cargar(); },
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.cerrar(); this.cargar(); },
      });
    }
  }

  eliminar(id: string): void {
    if (!confirm(`¿Eliminar este ${this.config.entidad}?`)) return;
    this.service.delete(id).subscribe({ next: () => this.cargar() });
  }

  cerrar(): void { this.mostrarModal = false; }
}