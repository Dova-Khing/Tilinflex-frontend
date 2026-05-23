import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObrasService } from '../../core/services/obras.service';

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.scss'],
})
export class ObrasComponent implements OnInit {
  obras: any[] = [];
  cargando = true;
  importando = false;
  error = '';
  errorImport = '';
  anilistIdInput: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private service: ObrasService,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { this.cargando = false; return; }
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.obras = data?.data ?? data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar el catálogo'; this.cargando = false; },
    });
  }

  importar() {
    if (!this.anilistIdInput) return;
    this.importando = true;
    this.errorImport = '';
    this.service.importar(this.anilistIdInput).subscribe({
      next: () => { this.anilistIdInput = null; this.importando = false; this.cargar(); },
      error: (e: any) => {
        this.errorImport = e?.error?.detail ?? 'Error al importar el anime';
        this.importando = false;
      },
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Quitar este anime del catálogo?')) return;
    this.service.delete(id).subscribe({ next: () => this.cargar() });
  }

  generos(obra: any): string {
    try { return JSON.parse(obra.generos_externos ?? '[]').join(', ') || '—'; }
    catch { return '—'; }
  }
}
