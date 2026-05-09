/*
  * LoginComponent: Componente para manejar el inicio de sesión de los usuarios.
  * Permite a los usuarios ingresar su email y contraseña para autenticarse.
  * Utiliza el AuthService para realizar la autenticación y manejar el token de acceso.
  * Redirige a los usuarios a la página principal después de un inicio de sesión exitoso.
  * Muestra mensajes de error en caso de credenciales incorrectas o problemas de autenticación.
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})


export class LoginComponent {
  // Variables para almacenar el email, contraseña, mensaje de error y estado de carga

  email = '';
  contrasena = '';
  error = '';
  cargando = false;

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    // Función para manejar el proceso de inicio de sesión
    this.error = '';
    this.cargando = true;

    this.auth.login(this.email, this.contrasena).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.data.access_token);
        const destino = this.auth.isAdmin() ? '/admin/dashboard' : '/perfiles';
        this.router.navigate([destino]);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Credenciales incorrectas';
        this.cargando = false;
      },
    });
  }
}
