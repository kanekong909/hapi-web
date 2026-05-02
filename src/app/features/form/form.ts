import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovimientosService } from '../../core/services/movimientos';
import { CurrencyService } from '../../core/services/currency';
import { MovimientoForm, Orden, TipoActivo } from '../../core/models/movimiento.model';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class FormComponent implements OnInit {
  editId = signal<number | null>(null);
  saving = signal(false);
  error = signal<string | null>(null);

  form: MovimientoForm = {
    orden: 'COMPRA',
    nombre: '',
    simbolo: '',
    tipo: 'ACCION',
    valor_usd: 0,
    valor_cop: 0,
    trm: 0,
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: MovimientosService,
    public currency: CurrencyService
  ) {}

  ngOnInit() {
    // Esperar TRM y setear
    const setTrm = () => {
      if (this.form.trm === 0) this.form.trm = this.currency.trm();
    };
    setTrm();
    if (!this.currency.trmLoaded()) {
      const interval = setInterval(() => {
        if (this.currency.trmLoaded()) { setTrm(); clearInterval(interval); }
      }, 300);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.svc.getById(+id).subscribe(m => {
        this.form = {
          orden: m.orden, nombre: m.nombre, simbolo: m.simbolo,
          tipo: m.tipo, valor_usd: m.valor_usd, valor_cop: m.valor_cop,
          trm: m.trm, fecha: m.fecha.split('T')[0], notas: m.notas ?? '',
        };
      });
    }
  }

  onUsdChange() {
    if (this.form.valor_usd > 0) {
      this.form.valor_cop = Math.round(this.form.valor_usd * this.form.trm);
    }
  }

  onCopChange() {
    if (this.form.valor_cop > 0) {
      this.form.valor_usd = parseFloat((this.form.valor_cop / this.form.trm).toFixed(2));
    }
  }

  setOrden(orden: Orden) { this.form.orden = orden; }
  setTipo(tipo: TipoActivo) { this.form.tipo = tipo; }

  guardar() {
    this.error.set(null);
    if (!this.form.nombre || !this.form.simbolo || !this.form.fecha) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }
    if (!this.form.valor_usd || !this.form.valor_cop) {
      this.error.set('Ingresa el valor en USD o COP');
      return;
    }

    this.saving.set(true);
    const payload = { ...this.form, simbolo: this.form.simbolo.toUpperCase() };
    const request = this.editId()
      ? this.svc.update(this.editId()!, payload)
      : this.svc.create(payload);

    request.subscribe({
      next: () => this.router.navigate(['/movimientos']),
      error: (e) => {
        this.error.set(e.error?.error ?? 'Error guardando');
        this.saving.set(false);
      }
    });
  }

  cancelar() { this.router.navigate(['/movimientos']); }
}
