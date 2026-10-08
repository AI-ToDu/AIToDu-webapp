// RUTA EXACTA: src/app/reporting/infrastructure/reporting-api.ts

import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { DashboardMetric } from '../domain/model/dashboard-metric.entity';
import { ReportingApiEndpoint } from './reporting-api-endpoint';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportingApi extends BaseApi {
  readonly #endpoint = new ReportingApiEndpoint(this.http);

  // Obtiene el consolidado general de la empresa
  getDashboardMetrics(): Observable<DashboardMetric[]> {
    return this.#endpoint.getAll();
  }
}
