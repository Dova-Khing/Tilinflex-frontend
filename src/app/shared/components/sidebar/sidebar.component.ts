import { Component } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  menu = [
    { label: 'Obras', ruta: '/obras' },
    { label: 'Usuarios', ruta: '/usuarios' },
    { label: 'Categorías', ruta: '/categorias' },
    { label: 'Géneros', ruta: '/generos' },
    { label: 'Suscripciones', ruta: '/suscripciones' },
  ];
}
