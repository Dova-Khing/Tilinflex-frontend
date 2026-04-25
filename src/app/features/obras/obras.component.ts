import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObrasService } from '../../core/services/obras.service';

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './obras.component.html',
  styleUrl: './obras.component.scss',   // ← agregado
})
export class ObrasComponent implements OnInit {
  obras: any[] = [];
  cargando = true;
  error = '';
  mostrarModal = false;
  editando = false;
  form: any = this.formVacio();

  constructor(private service: ObrasService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.obras = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar obras'; this.cargando = false; }
    });
  }

  formVacio() {
    return { nombre: '', descripcion: '', episodios: 1, anio: 2024, id_categoria: '', id_genero: '' };
  }

  abrirCrear() {
    this.form = this.formVacio();
    this.editando = false;
    this.mostrarModal = true;
  }

  abrirEditar(obra: any) {
    this.form = { ...obra };
    this.editando = true;
    this.mostrarModal = true;
  }

  guardar() {
    if (this.editando) {
      this.service.update(this.form.id_obra, this.form).subscribe({ next: () => { this.cerrar(); this.cargar(); } });
    } else {
      this.service.create(this.form).subscribe({ next: () => { this.cerrar(); this.cargar(); } });
    }
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar esta obra?')) return;
    this.service.delete(id).subscribe({ next: () => this.cargar() });
  }

  cerrar() { this.mostrarModal = false; }
}