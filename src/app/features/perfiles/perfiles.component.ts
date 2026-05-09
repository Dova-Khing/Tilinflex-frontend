import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilService, Perfil } from '../../core/services/perfil.service';

@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.scss',
})
export class PerfilesComponent implements OnInit {
  perfiles: Perfil[] = [];
  cargando = true;
  modoEdicion = false;
  mostrarModal = false;
  editando: Perfil | null = null;

  form = { nombre_usuario: '', avatar_url: 'av1', es_infantil: false };
  error = '';

  readonly MAX = 4;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public perfilSvc: PerfilService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.perfilSvc.getMisPerfiles().subscribe({
      next: (data) => { this.perfiles = data; this.cargando = false; },
      error: () => { this.cargando = false; },
    });
  }

  seleccionar(perfil: Perfil) {
    if (this.modoEdicion) return;
    this.perfilSvc.seleccionar(perfil);
    this.router.navigate(['/']);
  }

  abrirCrear() {
    this.editando = null;
    this.form = { nombre_usuario: '', avatar_url: 'av1', es_infantil: false };
    this.error = '';
    this.mostrarModal = true;
  }

  abrirEditar(perfil: Perfil, event: Event) {
    event.stopPropagation();
    this.editando = perfil;
    this.form = { nombre_usuario: perfil.nombre_usuario, avatar_url: perfil.avatar_url, es_infantil: perfil.es_infantil };
    this.error = '';
    this.mostrarModal = true;
  }

  onFotoSeleccionada(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { this.error = 'La imagen no puede superar 2 MB'; return; }
    const reader = new FileReader();
    reader.onload = () => { this.form.avatar_url = reader.result as string; };
    reader.readAsDataURL(file);
  }

  guardar() {
    if (!this.form.nombre_usuario.trim()) { this.error = 'El nombre es obligatorio'; return; }
    if (this.editando) {
      this.perfilSvc.update(this.editando.id_perfil, this.form).subscribe({
        next: () => { this.cerrar(); this.cargar(); },
        error: (e) => { this.error = e?.error?.detail ?? 'Error al guardar'; },
      });
    } else {
      this.perfilSvc.create(this.form).subscribe({
        next: () => { this.cerrar(); this.cargar(); },
        error: (e) => { this.error = e?.error?.detail ?? 'Error al crear perfil'; },
      });
    }
  }

  eliminar(perfil: Perfil, event: Event) {
    event.stopPropagation();
    if (!confirm(`¿Eliminar el perfil "${perfil.nombre_usuario}"?`)) return;
    this.perfilSvc.delete(perfil.id_perfil).subscribe({ next: () => this.cargar() });
  }

  cerrar() { this.mostrarModal = false; this.editando = null; }

  avatarUrl(id: string) { return this.perfilSvc.getAvatarUrl(id); }
  avatarOptions() { return this.perfilSvc.getAvatarOptions(); }
}
