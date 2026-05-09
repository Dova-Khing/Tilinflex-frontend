import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ObrasService } from '../../core/services/obras.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { CategoriasService } from '../../core/services/categorias.service';
import { GenerosService } from '../../core/services/generos.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;

  today = new Date();

  stats = { obras: 0, usuarios: 0, categorias: 0, generos: 0 };
  usuariosRecientes: { nombre: string; email: string; rol: string }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private obrasService: ObrasService,
    private usuariosService: UsuariosService,
    private categoriasService: CategoriasService,
    private generosService: GenerosService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.obrasService.getAll().subscribe({
      next: (d: any) => this.stats.obras = (d?.data ?? d)?.length ?? 0,
    });

    this.usuariosService.getAll().subscribe({
      next: (d: any) => {
        const list = d?.data ?? d ?? [];
        this.stats.usuarios = list.length;
        this.usuariosRecientes = list.slice(0, 5).map((u: any) => ({
          nombre: `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim() || u.username || '—',
          email:  u.email ?? '—',
          rol:    u.admin ? 'Admin' : 'Usuario',
        }));
      },
    });

    this.categoriasService.getAll().subscribe({
      next: (d: any) => this.stats.categorias = (d?.data ?? d)?.length ?? 0,
    });

    this.generosService.getAll().subscribe({
      next: (d: any) => this.stats.generos = (d?.data ?? d)?.length ?? 0,
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    new Chart(this.salesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Este año',
            data: [12, 19, 8, 15, 22, 18, 25, 30, 20, 17, 24, 28],
            backgroundColor: '#2563eb',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Año anterior',
            data: [8, 14, 10, 12, 17, 14, 20, 22, 15, 13, 18, 20],
            backgroundColor: '#bfdbfe',
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#94a3b8', font: { size: 12 } },
          },
          y: {
            grid: { color: '#f1f5f9' },
            border: { display: false },
            ticks: { color: '#94a3b8', font: { size: 12 } },
          },
        },
      },
    });
  }
}
