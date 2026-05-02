import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaccion, TransaccionForm, PaginatedResponse, ResumenTransacciones } from '../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class TransaccionesService {
  private base = `${environment.apiUrl}/transacciones`;

  constructor(private http: HttpClient) {}

  getAll(filtros: any = {}): Observable<PaginatedResponse<Transaccion>> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Transaccion>>(this.base, { params });
  }

  getById(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.base}/${id}`);
  }

  create(data: TransaccionForm): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.base, data);
  }

  update(id: number, data: TransaccionForm): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  getResumen(): Observable<ResumenTransacciones> {
    return this.http.get<ResumenTransacciones>(`${this.base}/resumen`);
  }
}
