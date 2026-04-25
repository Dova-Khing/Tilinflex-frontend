import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { PerfilService } from '../../../core/services/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  perfiles: any[] = [];
  cargando = true;
  error = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: PerfilService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.service.getAll().subscribe({
      next: (data: any) => { this.perfiles = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar perfiles'; this.cargando = false; },
    });
  }
}
