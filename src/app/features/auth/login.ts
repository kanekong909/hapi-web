import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.estaAutenticado()) this.router.navigate(['/movimientos']);
  }

  onEmail(e: Event)    { this.email    = (e.target as HTMLInputElement).value; }
  onPassword(e: Event) { this.password = (e.target as HTMLInputElement).value; }

  entrar() {
    this.error.set(null);
    if (!this.email || !this.password) {
      this.error.set('Ingresa tu email y contraseña');
      return;
    }
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/movimientos']),
      error: (e) => {
        this.error.set(e.error?.error ?? 'Error al iniciar sesión');
        this.loading.set(false);
      }
    });
  }
}
