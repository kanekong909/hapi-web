import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransaccionesService } from '../../core/services/transacciones';
import { CurrencyService } from '../../core/services/currency';
import { Transaccion, ResumenTransacciones } from '../../core/models/movimiento.model';

@Component({
  selector: 'app-transacciones',
  imports: [CommonModule],
  templateUrl: './transacciones.html',
  styleUrl: './transacciones.scss'
})
export class TransaccionesComponent implements OnInit {
  todas = signal<Transaccion[]>([]);
  resumen = signal<ResumenTransacciones | null>(null);
  loading = signal(true);
  filtroTipo = signal<string>('');
  expandido = signal<number | null>(null);

  lista = computed(() => {
    const tipo = this.filtroTipo();
    return this.todas().filter(t => !tipo || t.tipo === tipo);
  });

  constructor(
    private svc: TransaccionesService,
    public router: Router,
    public currency: CurrencyService
  ) {}

  ngOnInit() {
    this.svc.getAll({ limit: 200 }).subscribe({
      next: r => { this.todas.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.svc.getResumen().subscribe(r => this.resumen.set(r));
  }

  setFiltro(tipo: string) {
    this.filtroTipo.set(this.filtroTipo() === tipo ? '' : tipo);
  }

  toggle(id: number) {
    this.expandido.set(this.expandido() === id ? null : id);
  }

  onDeleted(id: number) {
    this.svc.delete(id).subscribe(() => {
      this.todas.update(t => t.filter(x => x.id !== id));
      this.svc.getResumen().subscribe(r => this.resumen.set(r));
    });
  }

  confirmarEliminar(e: Event, id: number) {
    e.stopPropagation();
    if (confirm('¿Eliminar esta transacción?')) this.onDeleted(id);
  }

  editar(e: Event, id: number) {
    e.stopPropagation();
    this.router.navigate(['/transacciones/editar', id]);
  }

  tipoIcon(tipo: string): string {
    return { DEPOSITO: '💵', RETIRO: '💸', DIVIDENDO: '🏦' }[tipo] ?? '💰';
  }

  tipoColor(tipo: string): string {
    return { DEPOSITO: 'deposito', RETIRO: 'retiro', DIVIDENDO: 'dividendo' }[tipo] ?? '';
  }

  fechaFormateada(fecha: string): string {
    const [y, m, d] = fecha.substring(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  get saldoNeto(): number {
    const r = this.resumen();
    if (!r) return 0;
    return Number(r.total_depositos) - Number(r.total_retiros) + Number(r.total_dividendos);
  }
}
