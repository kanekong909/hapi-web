import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  trm = signal<number>(4150);
  trmLoaded = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadTrm();
  }

  private loadTrm() {
    this.http.get<{ trm: number }>(`${environment.apiUrl}/trm`).pipe(
      catchError(() => of({ trm: 4150 }))
    ).subscribe(data => {
      this.trm.set(data.trm);
      this.trmLoaded.set(true);
    });
  }

  usdToCop(usd: number): number { return Math.round(usd * this.trm()); }
  copToUsd(cop: number): number  { return parseFloat((cop / this.trm()).toFixed(2)); }

  formatUsd(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  }

  formatCop(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }
}
