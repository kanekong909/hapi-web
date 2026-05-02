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
