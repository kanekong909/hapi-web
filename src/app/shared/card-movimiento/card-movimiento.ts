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
    private readonly logosMap: Record<string, string> = {
    // Acciones
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
    LYFT:  'lyft.com',
    SPOT:  'spotify.com',
    SHOP:  'shopify.com',
    SQ:    'squareup.com',
    SNAP:  'snap.com',
    TWTR:  'twitter.com',
    HOOD:  'robinhood.com',
    AMD:   'amd.com',
    INTC:  'intel.com',
    QCOM:  'qualcomm.com',
    CRM:   'salesforce.com',
    ADBE:  'adobe.com',
    ZM:    'zoom.us',
    ABNB:  'airbnb.com',
    COIN:  'coinbase.com',

    // ETFs
    VOO:  'vanguard.com',
    VTI:  'vanguard.com',
    SPY:  'ssga.com',
    QQQ:  'invesco.com',
    IVV:  'ishares.com',
    VGT:  'vanguard.com',
    ARKK: 'ark-funds.com',

    // Cripto
    BTC:  'bitcoin.org',
    ETH:  'ethereum.org',
    BNB:  'binance.com',
    SOL:  'solana.com',
    ADA:  'cardano.org',
    XRP:  'ripple.com',
    DOGE: 'dogecoin.com',
    DOT:  'polkadot.network',
    AVAX: 'avax.network',
    MATIC:'polygon.technology',
  };

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
    const [year, month, day] = this.movimiento.fecha.split('T')[0].split('-').map(Number);
    const fecha = new Date(year, month - 1, day).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const hora = this.movimiento.hora
      ? this.movimiento.hora.substring(0, 5)  // "HH:MM"
      : '';
    return hora ? `${fecha} · ${hora}` : fecha;
  }

    get logoUrl(): string {
    const dominio = this.logosMap[this.movimiento.simbolo.toUpperCase()];
    if (dominio) return `https://logo.clearbit.com/${dominio}`;
    return '';
  }

  imagenError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
