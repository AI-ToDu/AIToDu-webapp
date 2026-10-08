import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ReportingStore } from '../../application/reporting.store';
import { IamStore } from '../../../iam/application/iam.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  styles: [`
    .dashboard-container { padding: 32px; max-width: 1200px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; }
    .header { margin-bottom: 32px; }
    .header h2 { color: #0F172A; margin: 0; font-size: 28px; }
    .header p { color: #64748b; margin-top: 4px; }

    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px; }

    .kpi-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }

    .kpi-card.highlight { border-top: 4px solid #0D9488; }
    .kpi-card.warning { border-top: 4px solid #F59E0B; }
    .kpi-card.info { border-top: 4px solid #3b82f6; }

    .kpi-title { font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .kpi-value { font-size: 38px; font-weight: 800; color: #0F172A; margin-top: 8px; font-family: monospace; letter-spacing: -1px; }

    .table-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .table-title { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }

    .product-row { display: flex; justify-content: space-between; padding: 14px 12px; border-bottom: 1px solid #f8fafc; border-radius: 6px; }
    .product-row:hover { background-color: #f8fafc; }
    .product-row:last-child { border-bottom: none; }

    .product-name { font-weight: 600; color: #334155; }
    .product-sold { font-weight: bold; color: #0D9488; background: #ccfbf1; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
  `],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h2>Hola, {{ iamStore.currentUser()?.fullName || 'Administrador' }} 👋</h2>
        <p>Aquí tienes el resumen operativo de tu negocio en tiempo real.</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <div class="kpi-title">Ingresos del Mes</div>
          <div class="kpi-value">{{ store.metrics().totalRevenue | currency:'PEN':'S/ ' }}</div>
        </div>

        <div class="kpi-card info">
          <div class="kpi-title">Despachos en Ruta</div>
          <div class="kpi-value">🚚 {{ store.metrics().activeDispatches }}</div>
        </div>

        <div class="kpi-card warning">
          <div class="kpi-title">Alertas de Stock Bajo</div>
          <div class="kpi-value">⚠️ {{ store.metrics().lowStockAlerts }}</div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-title">Top Productos Más Vendidos</div>
        @for (product of store.metrics().topSellingProducts; track product.name) {
          <div class="product-row">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-sold">{{ product.sold }} und.</span>
          </div>
        } @empty {
          <p style="color: #64748b; text-align: center; padding: 20px;">No hay ventas registradas aún.</p>
        }
      </div>
    </div>
  `
})
export class Dashboard {
  // Inyectamos los stores para tener acceso a los datos
  readonly store = inject(ReportingStore);
  readonly iamStore = inject(IamStore);
}
