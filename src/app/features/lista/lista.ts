import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovimientosService } from '../../core/services/movimientos';
import { CurrencyService } from '../../core/services/currency';
import { CardMovimientoComponent } from '../../shared/card-movimiento/card-movimiento';
import { Movimiento, StatsResumen, FiltrosMovimiento, Orden, TipoActivo } from '../../core/models/movimiento.model';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, FormsModule, CardMovimientoComponent],
  templateUrl: './lista.html',
  styleUrl: './lista.scss'
})
export class ListaComponent implements OnInit {
  movimientos = signal<Movimiento[]>([]);
  stats = signal<StatsResumen | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  filtroOrden = signal<string>('');
  filtroTipo = signal<string>('');
  busqueda = signal<string>('');

  totalPages = signal(1);
  currentPage = signal(1);

  constructor(
    private svc: MovimientosService,
    private router: Router,
    public currency: CurrencyService
  ) {}

  ngOnInit() {
    this.cargar();
    this.svc.getResumen().subscribe(r => this.stats.set(r));
  }

  cargar() {
    this.loading.set(true);
    const filtros: FiltrosMovimiento = { page: this.currentPage(), limit: 20 };
    if (this.filtroOrden()) filtros.orden = this.filtroOrden() as Orden;
    if (this.filtroTipo()) filtros.tipo = this.filtroTipo() as TipoActivo;
    if (this.busqueda()) filtros.simbolo = this.busqueda();

    this.svc.getAll(filtros).subscribe({
      next: res => {
        this.movimientos.set(res.data);
        this.totalPages.set(res.meta.pages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando movimientos');
        this.loading.set(false);
      }
    });
  }

  setFiltroOrden(v: string) {
    this.filtroOrden.set(this.filtroOrden() === v ? '' : v);
    this.currentPage.set(1);
    this.cargar();
  }

  setFiltroTipo(v: string) {
    this.filtroTipo.set(this.filtroTipo() === v ? '' : v);
    this.currentPage.set(1);
    this.cargar();
  }

  onBusqueda(v: string) {
    this.busqueda.set(v);
    this.currentPage.set(1);
    this.cargar();
  }

  onDeleted(id: number) {
    this.svc.delete(id).subscribe(() => this.cargar());
  }

  nuevo() { this.router.navigate(['/movimientos/nuevo']); }

  paginaAnterior() {
    if (this.currentPage() > 1) { this.currentPage.update(p => p - 1); this.cargar(); }
  }
  paginaSiguiente() {
    if (this.currentPage() < this.totalPages()) { this.currentPage.update(p => p + 1); this.cargar(); }
  }
}
