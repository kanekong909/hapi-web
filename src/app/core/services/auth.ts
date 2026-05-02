import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  usuario = signal<Usuario | null>(null);
  token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // Restaurar sesión al recargar
    const t = localStorage.getItem('hapi_token');
    const u = localStorage.getItem('hapi_usuario');
    if (t && u) {
      this.token.set(t);
      this.usuario.set(JSON.parse(u));
    }
  }

  register(nombre: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.base}/register`, { nombre, email, password }).pipe(
      tap(res => this.guardarSesion(res))
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, password }).pipe(
      tap(res => this.guardarSesion(res))
    );
  }

  logout() {
    localStorage.removeItem('hapi_token');
    localStorage.removeItem('hapi_usuario');
    this.token.set(null);
    this.usuario.set(null);
    this.router.navigate(['/auth/login']);
  }

  estaAutenticado(): boolean {
    return !!this.token();
  }

  private guardarSesion(res: AuthResponse) {
    localStorage.setItem('hapi_token', res.token);
    localStorage.setItem('hapi_usuario', JSON.stringify(res.usuario));
    this.token.set(res.token);
    this.usuario.set(res.usuario);
  }
}
