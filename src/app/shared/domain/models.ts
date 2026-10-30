export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'WAREHOUSE' | 'SALES' | 'LOGISTICS';
}
export interface Row {
  id: string;
  name?: string;
  sku?: string;
  quantity?: number;
  price?: number;
  cost?: number;
  minimum?: number;
  conservation?: string;
  status?: string;
  number?: string;
  total?: number;
  createdAt?: string;
  productId?: string;
  delta?: number;
  type?: string;
  reason?: string;
  received?: number;
  destination?: string;
  role?: string;
  read?: boolean;
  lines?: Row[];
  receipt?: Row;
  incidents?: Row[];
  stops?: Row[];
  recipient?: string;
  description?: string;
}
export interface Metrics {
  revenue: number;
  grossMargin: number;
  inventoryValue: number;
  lowStock: number;
  dispatches: number;
  sales: number;
}
export interface Option {
  value: string;
  label: string;
}
export interface Field {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea';
  options?: Option[];
  value?: string | number;
  min?: number;
  step?: number;
  optional?: boolean;
}
