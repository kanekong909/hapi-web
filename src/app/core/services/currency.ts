import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

// TRM de respaldo si la API externa falla
const TRM_FALLBACK = 4150;

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  trm = signal<number>(TRM_FALLBACK);
  trmLoaded = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadTrm();
  }

  private loadTrm() {
    // API pública de la TRM Colombia (datos.gov.co)
    const url = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde DESC';
    this.http.get<any[]>(url).pipe(
      catchError(() => of(null))
    ).subscribe(data => {
      if (data && data.length > 0 && data[0].valor) {
        this.trm.set(parseFloat(data[0].valor));
      }
      this.trmLoaded.set(true);
    });
  }

  usdToCop(usd: number): number {
    return Math.round(usd * this.trm());
  }

  copToUsd(cop: number): number {
    return parseFloat((cop / this.trm()).toFixed(2));
  }

  formatUsd(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  }

  formatCop(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }
}
