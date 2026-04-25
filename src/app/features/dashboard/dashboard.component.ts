import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
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

  stats = {
    obras: 0,
    usuarios: 0,
    categorias: 0,
    generos: 0,
    suscripciones: 0,
    perfiles: 0,
  };

  obrasRecientes: { nombre: string; categoria: string; genero: string; anio: number }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private obrasService: ObrasService,
    private usuariosService: UsuariosService,
    private categoriasService: CategoriasService,
    private generosService: GenerosService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    forkJoin({
      obras: this.obrasService.getAll(),
      usuarios: this.usuariosService.getAll(),
      categorias: this.categoriasService.getAll(),
      generos: this.generosService.getAll(),
    }).subscribe({
      next: ({ obras, usuarios, categorias, generos }) => {
        const catMap: Record<string, string> = Object.fromEntries(
          categorias.map((c: any) => [c.id_categoria, c.nombre_categoria])
        );
        const genMap: Record<string, string> = Object.fromEntries(
          generos.map((g: any) => [g.id_genero, g.nombre_genero])
        );

        this.stats.obras = obras.length;
        this.stats.usuarios = usuarios.length;
        this.stats.categorias = categorias.length;
        this.stats.generos = generos.length;

        this.obrasRecientes = obras.slice(0, 5).map((o: any) => ({
          nombre: o.nombre,
          categoria: catMap[o.id_categoria] ?? '—',
          genero: genMap[o.id_genero] ?? '—',
          anio: o.anio,
        }));
      },
      error: (err) => console.error('Dashboard: error cargando datos', err),
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
