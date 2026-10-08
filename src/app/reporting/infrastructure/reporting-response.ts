// RUTA EXACTA: src/app/reporting/infrastructure/reporting-response.ts

import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardMetricsResponse extends BaseResponse {
  items: DashboardMetricResource[];
}

export interface DashboardMetricResource extends BaseResource {
  id: string;
  totalRevenue: number;
  activeDispatches: number;
  lowStockAlerts: number;
  topSellingProducts: Array<{ name: string; sold: number }>;
}
