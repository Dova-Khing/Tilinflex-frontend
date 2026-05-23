import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  cargando = true;
  error = '';
  mostrarModal = false;
  editando = false;
  form: any = this.formVacio();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: UsuariosService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.usuarios = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar usuarios'; this.cargando = false; },
    });
  }

  formVacio() {
    return { nombre: '', apellido: '', email: '', contrasena: '', edad: 18, pais: '', admin: false };
  }

  abrirCrear() {
    this.form = this.formVacio();
    this.editando = false;
    this.mostrarModal = true;
  }

  abrirEditar(usuario: any) {
    this.form = { ...usuario, contrasena: '' };
    this.editando = true;
    this.mostrarModal = true;
  }

  guardar() {
    if (this.editando) {
      this.service.update(this.form.id_usuario, this.form).subscribe({
        next: () => { this.cerrar(); this.cargar(); },
        error: (e: any) => { this.error = e?.error?.detail ?? 'Error al actualizar usuario'; },
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.cerrar(); this.cargar(); },
        error: (e: any) => { this.error = e?.error?.detail ?? 'Error al crear usuario'; },
      });
    }
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.service.delete(id).subscribe({
      next: () => this.cargar(),
      error: (e: any) => { this.error = e?.error?.detail ?? 'Error al eliminar usuario'; },
    });
  }

  cerrar() { this.mostrarModal = false; this.error = ''; }
}
