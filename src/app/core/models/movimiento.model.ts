export type Orden = 'COMPRA' | 'VENTA';
export type TipoActivo = 'ACCION' | 'CRIPTO' | 'ETF';

export interface Movimiento {
  id: number;
  orden: Orden;
  nombre: string;
  simbolo: string;
  tipo: TipoActivo;
  valor_usd: number;
  valor_cop: number;
  trm: number;
  fecha: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  hora: string;
}

export interface MovimientoForm {
  orden: Orden;
  nombre: string;
  simbolo: string;
  tipo: TipoActivo;
  valor_usd: number;
  valor_cop: number;
  trm: number;
  fecha: string;
  notas?: string;
  hora: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface FiltrosMovimiento {
  orden?: Orden;
  tipo?: TipoActivo;
  simbolo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}

export interface StatsResumen {
  total_movimientos: number;
  total_compras: number;
  total_ventas: number;
  invertido_usd: number;
  invertido_cop: number;
  vendido_usd: number;
  vendido_cop: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface PnLActivo {
  simbolo: string;
  nombre: string;
  tipo: TipoActivo;
  cantidad_comprada: number;
  cantidad_vendida: number;
  cantidad_en_mano: number;
  total_invertido_usd: number;
  total_vendido_usd: number;
  ganancia_realizada_usd: number;
  precio_promedio_usd: number;
  pnl_porcentaje: number;
  movimientos: {
    orden: Orden;
    cantidad: number;
    valor_usd: number;
    fecha: string;
    hora: string;
  }[];
}

export type TipoTransaccion = 'DEPOSITO' | 'RETIRO' | 'DIVIDENDO';

export interface Transaccion {
  id: number;
  usuario_id: number;
  tipo: TipoTransaccion;
  descripcion?: string;
  simbolo?: string;
  monto_bruto: number;
  impuesto: number;
  monto_neto: number;
  valor_cop?: number;
  trm?: number;
  fecha: string;
  hora: string;
  notas?: string;
  created_at: string;
}

export interface TransaccionForm {
  tipo: TipoTransaccion;
  descripcion?: string;
  simbolo?: string;
  monto_bruto: number;
  impuesto: number;
  valor_cop?: number;
  trm?: number;
  fecha: string;
  hora: string;
  notas?: string;
}

export interface ResumenTransacciones {
  total_depositos: number;
  total_retiros: number;
  total_dividendos: number;
  total_impuestos: number;
  num_depositos: number;
  num_retiros: number;
  num_dividendos: number;
}
