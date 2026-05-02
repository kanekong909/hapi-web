import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransaccionesService } from '../../core/services/transacciones';
import { CurrencyService } from '../../core/services/currency';
import { TransaccionForm, TipoTransaccion } from '../../core/models/movimiento.model';

const formVacio = (): TransaccionForm => ({
  tipo: 'DEPOSITO',
  descripcion: '',
  simbolo: '',
  monto_bruto: 0,
  impuesto: 0,
  valor_cop: 0,
  trm: 0,
  fecha: new Date().toISOString().split('T')[0],
  hora: '00:00:00',
  notas: '',
});

@Component({
  selector: 'app-form-transaccion',
  imports: [CommonModule],
  templateUrl: './form-transaccion.html',
  styleUrl: './form-transaccion.scss'
})
export class FormTransaccionComponent implements OnInit {
  editId = signal<number | null>(null);
  saving = signal(false);
  error = signal<string | null>(null);
  form = signal<TransaccionForm>(formVacio());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: TransaccionesService,
    public currency: CurrencyService
  ) {}

  ngOnInit() {
    const setTrm = () => this.form.update(f => ({ ...f, trm: this.currency.trm() }));
    if (this.currency.trmLoaded()) setTrm();
    else {
      const iv = setInterval(() => { if (this.currency.trmLoaded()) { setTrm(); clearInterval(iv); } }, 300);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.svc.getById(+id).subscribe(t => {
        this.form.set({
          tipo: t.tipo,
          descripcion: t.descripcion ?? '',
          simbolo: t.simbolo ?? '',
          monto_bruto: Number(t.monto_bruto),
          impuesto: Number(t.impuesto),
          valor_cop: t.valor_cop ? Number(t.valor_cop) : 0,
          trm: t.trm ? Number(t.trm) : this.currency.trm(),
          fecha: String(t.fecha).substring(0, 10),
          hora: t.hora ?? '00:00:00',
          notas: t.notas ?? '',
        });
      });
    }
  }

  get f() { return this.form(); }

  setTipo(tipo: TipoTransaccion) { this.form.update(f => ({ ...f, tipo })); }

  setField(key: keyof TransaccionForm, val: any) {
    this.form.update(f => {
      const updated = { ...f, [key]: val };
      // Recalcular COP si cambia monto_bruto o TRM
      if (key === 'monto_bruto' || key === 'trm') {
        updated.valor_cop = Math.round(Number(updated.monto_bruto) * Number(updated.trm));
      }
      return updated;
    });
  }

  onCopChange(val: number) {
    this.form.update(f => ({
      ...f,
      valor_cop: val,
      monto_bruto: f.trm ? parseFloat((val / f.trm).toFixed(4)) : f.monto_bruto,
    }));
  }

  get montoNeto(): number {
    return Math.max(0, Number(this.f.monto_bruto) - Number(this.f.impuesto));
  }

  guardar() {
    this.error.set(null);
    const f = this.form();
    if (!f.monto_bruto || !f.fecha) {
      this.error.set('Monto y fecha son requeridos');
      return;
    }
    this.saving.set(true);
    const request = this.editId()
      ? this.svc.update(this.editId()!, f)
      : this.svc.create(f);

    request.subscribe({
      next: () => this.router.navigate(['/transacciones']),
      error: e => { this.error.set(e.error?.error ?? 'Error guardando'); this.saving.set(false); }
    });
  }

  cancelar() { this.router.navigate(['/transacciones']); }
}
