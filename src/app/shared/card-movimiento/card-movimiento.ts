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

  private readonly logosMap: Record<string, string> = {
    AAPL:  'apple.com',
    MSFT:  'microsoft.com',
    GOOGL: 'google.com',
    GOOG:  'google.com',
    AMZN:  'amazon.com',
    META:  'meta.com',
    TSLA:  'tesla.com',
    NVDA:  'nvidia.com',
    NFLX:  'netflix.com',
    ORCL:  'oracle.com',
    KO:    'coca-cola.com',
    PEP:   'pepsico.com',
    MCD:   'mcdonalds.com',
    DIS:   'disney.com',
    SBUX:  'starbucks.com',
    NKE:   'nike.com',
    WMT:   'walmart.com',
    JPM:   'jpmorganchase.com',
    BAC:   'bankofamerica.com',
    V:     'visa.com',
    MA:    'mastercard.com',
    PYPL:  'paypal.com',
    UBER:  'uber.com',
    SPOT:  'spotify.com',
    SHOP:  'shopify.com',
    AMD:   'amd.com',
    INTC:  'intel.com',
    QCOM:  'qualcomm.com',
    CRM:   'salesforce.com',
    ADBE:  'adobe.com',
    ABNB:  'airbnb.com',
    COIN:  'coinbase.com',
    VOO:   'vanguard.com',
    VTI:   'vanguard.com',
    SPY:   'ssga.com',
    QQQ:   'invesco.com',
    IVV:   'ishares.com',
    ARKK:  'ark-funds.com',
    BTC:   'bitcoin.org',
    ETH:   'ethereum.org',
    BNB:   'binance.com',
    SOL:   'solana.com',
    XRP:   'ripple.com',
    DOGE:  'dogecoin.com',
  };

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

  get logoUrl(): string {
    const dominio = this.logosMap[this.movimiento.simbolo.toUpperCase()];
    return dominio ? `https://logo.clearbit.com/${dominio}` : '';
  }

  imagenError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  get esCompra(): boolean { return this.movimiento.orden === 'COMPRA'; }

  get tipoLabel(): string {
    const map: Record<string, string> = { ACCION: 'Acción', CRIPTO: 'Cripto', ETF: 'ETF' };
    return map[this.movimiento.tipo] ?? this.movimiento.tipo;
  }

  get fechaFormateada(): string {
    const [year, month, day] = this.movimiento.fecha.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
