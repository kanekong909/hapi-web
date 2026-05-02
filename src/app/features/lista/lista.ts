import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovimientosService } from '../../core/services/movimientos';
import { CurrencyService } from '../../core/services/currency';
import { CardMovimientoComponent } from '../../shared/card-movimiento/card-movimiento';
import { Movimiento, StatsResumen, FiltrosMovimiento, Orden, TipoActivo } from '../../core/models/movimiento.model';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, FormsModule, CardMovimientoComponent],
  templateUrl: './lista.html',
  styleUrl: './lista.scss'
})
export class ListaComponent implements OnInit {
  todosLosMovimientos = signal<Movimiento[]>([]);
  stats = signal<StatsResumen | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  filtroOrden = signal<string>('');
  filtroTipo = signal<string>('');
  busqueda = signal<string>('');
  fechaDesde = signal<string>('');
  fechaHasta = signal<string>('');

  totalPages = signal(1);
  currentPage = signal(1);

  // Filtro local — busca en nombre Y símbolo
  movimientos = computed(() => {
    const texto  = this.busqueda().toLowerCase().trim();
    const orden  = this.filtroOrden();
    const tipo   = this.filtroTipo();
    const desde  = this.fechaDesde();
    const hasta  = this.fechaHasta();

    return this.todosLosMovimientos().filter(m => {
      const matchTexto = !texto ||
        m.nombre.toLowerCase().includes(texto) ||
        m.simbolo.toLowerCase().includes(texto);
      const matchOrden = !orden || m.orden === orden;
      const matchTipo  = !tipo  || m.tipo  === tipo;
      const fechaMov   = m.fecha.substring(0, 10);
      const matchDesde = !desde || fechaMov >= desde;
      const matchHasta = !hasta || fechaMov <= hasta;
      return matchTexto && matchOrden && matchTipo && matchDesde && matchHasta;
    });
  });

  constructor(
    private svc: MovimientosService,
    private router: Router,
    public currency: CurrencyService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.cargar();
    this.svc.getResumen().subscribe(r => this.stats.set(r));
  }

  cargar() {
    this.loading.set(true);
    const filtros: FiltrosMovimiento = { page: this.currentPage(), limit: 100 };

    this.svc.getAll(filtros).subscribe({
      next: res => {
        this.todosLosMovimientos.set(res.data);
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
  }

  setFiltroTipo(v: string) {
    this.filtroTipo.set(this.filtroTipo() === v ? '' : v);
  }

  onBusqueda(v: string) {
    this.busqueda.set(v);
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

  limpiarFechas() {
    this.fechaDesde.set('');
    this.fechaHasta.set('');
  }
}
