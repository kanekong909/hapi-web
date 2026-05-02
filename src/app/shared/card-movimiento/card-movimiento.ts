import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movimiento } from '../../core/models/movimiento.model';
import { CurrencyService } from '../../core/services/currency';

@Component({
  selector: 'app-card-movimiento',
  imports: [CommonModule],
  templateUrl: './card-movimiento.html',
  styleUrl: './card-movimiento.scss'
})
export class CardMovimientoComponent {
  @Input({ required: true }) movimiento!: Movimiento;
  @Output() deleted = new EventEmitter<number>();

  expanded = signal(false);

  constructor(private router: Router, public currency: CurrencyService) {}

  toggle() { this.expanded.update(v => !v); }

  edit(e: Event) {
    e.stopPropagation();
    this.router.navigate(['/movimientos/editar', this.movimiento.id]);
  }

  delete(e: Event) {
    e.stopPropagation();
    if (confirm(`¿Eliminar ${this.movimiento.simbolo}?`)) {
      this.deleted.emit(this.movimiento.id);
    }
  }

  get esCompra(): boolean { return this.movimiento.orden === 'COMPRA'; }

  get tipoLabel(): string {
    const map: Record<string, string> = { ACCION: 'Acción', CRIPTO: 'Cripto', ETF: 'ETF' };
    return map[this.movimiento.tipo] ?? this.movimiento.tipo;
  }

  get fechaFormateada(): string {
    return new Date(this.movimiento.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
