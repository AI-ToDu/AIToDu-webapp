// RUTA EXACTA: src/app/reporting/application/reporting.store.ts

import { Injectable, signal } from '@angular/core';
import { DashboardMetric } from '../domain/model/dashboard-metric.entity';

@Injectable({
  providedIn: 'root',
})
export class ReportingStore {
  // MOCK: Simulamos los datos del mes en tiempo real para la demo
  readonly metrics = signal<DashboardMetric>(
    new DashboardMetric({
      id: crypto.randomUUID(),
      totalRevenue: 12450.50, // Ganancias del mes
      activeDispatches: 4,    // Vehículos en ruta
      lowStockAlerts: 3,      // Alertas críticas de inventario
      topSellingProducts: [
        { name: 'Caja de Tomates (20kg)', sold: 145 },
        { name: 'Saco de Arroz Extra (50kg)', sold: 98 },
        { name: 'Aceite Vegetal (Caja 12x1L)', sold: 76 }
      ]
    })
  );

  refreshMetrics() {
    // Aquí nos conectaremos al ReportingApi en el futuro
    console.log('Solicitando recálculo de métricas a Spring Boot...');
  }
}
