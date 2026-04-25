import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuscripcionesService } from '../../../core/services/suscripciones.service';

@Component({
  selector: 'app-suscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.scss'],
})
export class SuscripcionComponent implements OnInit {
  suscripciones: any[] = [];
  cargando = true;
  error = '';
  mostrarModal = false;
  editando = false;
  form: any = this.formVacio();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: SuscripcionesService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.suscripciones = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar suscripciones'; this.cargando = false; },
    });
  }

  formVacio() {
    return { tipo_suscripcion: 'mensual', fecha_inicio: '', fecha_fin: '', id_usuario: '' };
  }

  abrirCrear() { this.form = this.formVacio(); this.editando = false; this.mostrarModal = true; }

  abrirEditar(s: any) {
    this.form = {
      ...s,
      fecha_inicio: s.fecha_inicio?.slice(0, 10) ?? '',
      fecha_fin: s.fecha_fin?.slice(0, 10) ?? '',
    };
    this.editando = true;
    this.mostrarModal = true;
  }

  guardar() {
    if (this.editando) {
      this.service.update(this.form.id_suscripcion, this.form).subscribe({ next: () => { this.cerrar(); this.cargar(); } });
    } else {
      this.service.create(this.form).subscribe({ next: () => { this.cerrar(); this.cargar(); } });
    }
  }

  cerrar() { this.mostrarModal = false; }
}
