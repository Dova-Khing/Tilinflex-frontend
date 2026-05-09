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
    { label: 'Obras', ruta: '/admin/obras' },
    { label: 'Usuarios', ruta: '/admin/usuarios' },
    { label: 'Categorías', ruta: '/admin/categorias' },
    { label: 'Géneros', ruta: '/admin/generos' },
    { label: 'Suscripciones', ruta: '/admin/suscripciones' },
  ];
}
