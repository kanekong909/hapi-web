import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './login.scss'
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.estaAutenticado()) this.router.navigate(['/movimientos']);
  }

  onNombre(e: Event)   { this.nombre   = (e.target as HTMLInputElement).value; }
  onEmail(e: Event)    { this.email    = (e.target as HTMLInputElement).value; }
  onPassword(e: Event) { this.password = (e.target as HTMLInputElement).value; }

  registrar() {
    this.error.set(null);
    if (!this.nombre || !this.email || !this.password) {
      this.error.set('Todos los campos son requeridos');
      return;
    }
    if (this.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    this.loading.set(true);
    this.auth.register(this.nombre, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/movimientos']),
      error: (e) => {
        this.error.set(e.error?.error ?? 'Error al registrarse');
        this.loading.set(false);
      }
    });
  }
}
