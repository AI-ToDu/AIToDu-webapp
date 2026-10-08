// RUTA EXACTA: src/app/reporting/infrastructure/reporting-assembler.ts

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardMetric } from '../domain/model/dashboard-metric.entity';
import { DashboardMetricsResponse, DashboardMetricResource } from './reporting-response';

export class ReportingAssembler implements BaseAssembler<DashboardMetric, DashboardMetricResource, DashboardMetricsResponse> {

  toEntitiesFromResponse(response: DashboardMetricsResponse): DashboardMetric[] {
    return response.items.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DashboardMetricResource): DashboardMetric {
    return new DashboardMetric({
      id: resource.id,
      totalRevenue: resource.totalRevenue,
      activeDispatches: resource.activeDispatches,
      lowStockAlerts: resource.lowStockAlerts,
      topSellingProducts: resource.topSellingProducts || [],
    });
  }

  toResourceFromEntity(entity: DashboardMetric): DashboardMetricResource {
    return {
      id: entity.id,
      totalRevenue: entity.totalRevenue,
      activeDispatches: entity.activeDispatches,
      lowStockAlerts: entity.lowStockAlerts,
      topSellingProducts: entity.topSellingProducts,
    } as DashboardMetricResource;
  }
}
