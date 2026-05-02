import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movimiento, MovimientoForm, PaginatedResponse, FiltrosMovimiento, StatsResumen, PnLActivo } from '../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private base = `${environment.apiUrl}/movimientos`;
  private statsBase = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getAll(filtros: FiltrosMovimiento = {}): Observable<PaginatedResponse<Movimiento>> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Movimiento>>(this.base, { params });
  }

  getById(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.base}/${id}`);
  }

  create(data: MovimientoForm): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.base, data);
  }

  update(id: number, data: MovimientoForm): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.base}/${id}`);
  }

  getResumen(): Observable<StatsResumen> {
    return this.http.get<StatsResumen>(`${this.statsBase}/resumen`);
  }

  getPorActivo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.statsBase}/por-activo`);
  }

  getPnL(): Observable<PnLActivo[]> {
    return this.http.get<PnLActivo[]>(`${this.statsBase}/pnl`);
  }
}
  