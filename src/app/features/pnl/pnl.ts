import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovimientosService } from '../../core/services/movimientos';
import { CurrencyService } from '../../core/services/currency';
import { PnLActivo } from '../../core/models/movimiento.model';

@Component({
  selector: 'app-pnl',
  imports: [CommonModule],
  templateUrl: './pnl.html',
  styleUrl: './pnl.scss'
})
export class PnlComponent implements OnInit {
  datos = signal<PnLActivo[]>([]);
  loading = signal(true);
  expandido = signal<string | null>(null);

  constructor(
    private svc: MovimientosService,
    private router: Router,
    public currency: CurrencyService
  ) {}

  ngOnInit() {
    this.svc.getPnL().subscribe({
      next: d => { this.datos.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  toggle(simbolo: string) {
    this.expandido.set(this.expandido() === simbolo ? null : simbolo);
  }

  get totalGanancia(): number {
    return this.datos().reduce((s, a) => s + a.ganancia_realizada_usd, 0);
  }

  get activosConGanancia(): number {
    return this.datos().filter(a => a.ganancia_realizada_usd > 0).length;
  }

  get activosConPerdida(): number {
    return this.datos().filter(a => a.ganancia_realizada_usd < 0).length;
  }

  fechaFormateada(fecha: string): string {
    const [y, m, d] = fecha.substring(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  ordenarMovimientos(movs: any[]) {
    return [...movs].sort((a, b) => {
      const fechaA = new Date(`${a.fecha} ${a.hora || '00:00:00'}`).getTime();
      const fechaB = new Date(`${b.fecha} ${b.hora || '00:00:00'}`).getTime();

      return fechaB - fechaA; // más nuevos primero
    });
  }

  volver() { this.router.navigate(['/movimientos']); }
}
