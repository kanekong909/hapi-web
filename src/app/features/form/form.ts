import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovimientosService } from '../../core/services/movimientos';
import { CurrencyService } from '../../core/services/currency';
import { MovimientoForm, Orden, TipoActivo } from '../../core/models/movimiento.model';

const formVacio = (): MovimientoForm => ({
  orden: 'COMPRA',
  nombre: '',
  simbolo: '',
  tipo: 'ACCION',
  valor_usd: 0,
  valor_cop: 0,
  trm: 0,
  fecha: new Date().toISOString().split('T')[0],
  notas: '',
});

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
  form = signal<MovimientoForm>(formVacio());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: MovimientosService,
    public currency: CurrencyService
  ) {}

  ngOnInit() {
    // Setear TRM
    const setTrm = () => {
      this.form.update(f => ({ ...f, trm: this.currency.trm() }));
    };
    if (this.currency.trmLoaded()) {
      setTrm();
    } else {
      const interval = setInterval(() => {
        if (this.currency.trmLoaded()) { setTrm(); clearInterval(interval); }
      }, 300);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.svc.getById(+id).subscribe(m => {
        this.form.set({
          orden: m.orden,
          nombre: m.nombre,
          simbolo: m.simbolo,
          tipo: m.tipo,
          valor_usd: Number(m.valor_usd),
          valor_cop: Number(m.valor_cop),
          trm: Number(m.trm),
          fecha: String(m.fecha).substring(0, 10),
          notas: m.notas ?? '',
        });
      });
    }
  }

  get f() { return this.form(); }

  onUsdChange(val: number) {
    this.form.update(f => ({ ...f, valor_usd: val, valor_cop: Math.round(val * f.trm) }));
  }

  onCopChange(val: number) {
    this.form.update(f => ({ ...f, valor_cop: val, valor_usd: parseFloat((val / f.trm).toFixed(2)) }));
  }

  setOrden(orden: Orden) { this.form.update(f => ({ ...f, orden })); }
  setTipo(tipo: TipoActivo) { this.form.update(f => ({ ...f, tipo })); }

  setField(key: keyof MovimientoForm, val: any) {
    this.form.update(f => ({ ...f, [key]: val }));
  }

  guardar() {
    this.error.set(null);
    const f = this.form();
    if (!f.nombre || !f.simbolo || !f.fecha) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }
    if (!f.valor_usd || !f.valor_cop) {
      this.error.set('Ingresa el valor en USD o COP');
      return;
    }
    this.saving.set(true);
    const payload = { ...f, simbolo: f.simbolo.toUpperCase() };
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
