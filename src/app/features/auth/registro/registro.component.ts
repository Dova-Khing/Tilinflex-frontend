import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  nombre = '';
  apellido = '';
  email = '';
  contrasena = '';
  edad: number | null = null;
  pais = '';
  error = '';
  cargando = false;

  constructor(private auth: AuthService, private router: Router) {}

  registro() {
    this.error = '';
    this.cargando = true;

    this.auth.registro({ nombre: this.nombre, apellido: this.apellido, email: this.email, contrasena: this.contrasena, edad: this.edad, pais: this.pais }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Error al crear la cuenta';
        this.cargando = false;
      },
    });
  }
}
