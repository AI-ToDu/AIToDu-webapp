// RUTA EXACTA: src/app/reporting/domain/model/dashboard-metric.entity.ts

import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class DashboardMetric implements BaseEntity {
  #id: string;
  #totalRevenue: number;
  #activeDispatches: number;
  #lowStockAlerts: number;
  #topSellingProducts: Array<{ name: string; sold: number }>;

  constructor(props: {
    id: string;
    totalRevenue: number;
    activeDispatches: number;
    lowStockAlerts: number;
    topSellingProducts: Array<{ name: string; sold: number }>;
  }) {
    this.#id = props.id;
    this.#totalRevenue = props.totalRevenue;
    this.#activeDispatches = props.activeDispatches;
    this.#lowStockAlerts = props.lowStockAlerts;
    this.#topSellingProducts = props.topSellingProducts;
  }

  get id(): string { return this.#id; }
  get totalRevenue(): number { return this.#totalRevenue; }
  get activeDispatches(): number { return this.#activeDispatches; }
  get lowStockAlerts(): number { return this.#lowStockAlerts; }
  get topSellingProducts(): Array<{ name: string; sold: number }> { return this.#topSellingProducts; }
}
