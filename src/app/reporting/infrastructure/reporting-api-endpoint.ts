// RUTA EXACTA: src/app/reporting/infrastructure/reporting-api-endpoint.ts

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DashboardMetric } from '../domain/model/dashboard-metric.entity';
import { DashboardMetricResource, DashboardMetricsResponse } from './reporting-response';
import { ReportingAssembler } from './reporting-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class ReportingApiEndpoint extends BaseApiEndpoint<
  DashboardMetric,
  DashboardMetricResource,
  DashboardMetricsResponse,
  ReportingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}/reporting/metrics`,
      new ReportingAssembler()
    );
  }
}
