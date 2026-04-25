import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;

  today = new Date();

  // ── Reemplaza estos valores con llamadas reales a tus servicios ──
  stats = {
    obras: 0,
    usuarios: 0,
    categorias: 0,
    generos: 0,
    suscripciones: 0,
    perfiles: 0,
  };

  // ── Reemplaza con datos reales desde ObrasService ──
  obrasRecientes: { titulo: string; categoria: string; genero: string; estado: string }[] = [];

  // ── Ejemplo con datos reales: inyecta tus servicios y carga aquí ──
  // constructor(
  //   private obrasService: ObrasService,
  //   private usuariosService: UsuariosService,
  // ) {}
  //
  // ngOnInit() {
  //   this.obrasService.getAll().subscribe(obras => {
  //     this.stats.obras = obras.length;
  //     this.obrasRecientes = obras.slice(0, 5).map(o => ({
  //       titulo: o.titulo,
  //       categoria: o.categoria,
  //       genero: o.genero,
  //       estado: o.estado ?? 'activo',
  //     }));
  //   });
  //   this.usuariosService.getAll().subscribe(u => this.stats.usuarios = u.length);
  // }

  ngAfterViewInit(): void {
    this.buildChart();
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