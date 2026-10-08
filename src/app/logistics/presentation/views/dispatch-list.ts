import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogisticsStore } from '../../application/logistics.store';

@Component({
  selector: 'app-dispatch-list',
  standalone: true,
  imports: [FormsModule],
  styles: [`
    .logistics-container { padding: 32px; max-width: 1200px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h2 { color: #0F172A; margin: 0; font-size: 28px; }
    .board { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .column { background: #f8fafc; border-radius: 12px; padding: 16px; min-height: 500px; border: 1px solid #e2e8f0; }
    .column-title { font-weight: 700; color: #475569; margin-bottom: 16px; text-transform: uppercase; font-size: 13px; display: flex; align-items: center; gap: 8px; }
    .dispatch-card { background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border-left: 4px solid #cbd5e1; transition: transform 0.2s; }
    .dispatch-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .card-pending { border-left-color: #F59E0B; }
    .card-transit { border-left-color: #3b82f6; }
    .card-delivered { border-left-color: #10b981; opacity: 0.7; }
    .driver { font-weight: 600; color: #0F172A; font-size: 15px; }
    .destination { color: #64748b; font-size: 13px; margin-top: 6px; }
    .btn-action { background: #f1f5f9; color: #0F172A; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-top: 16px; cursor: pointer; width: 100%; transition: all 0.2s; }
    .btn-action:hover { background: #e2e8f0; color: #0D9488; }
    .btn-action.success:hover { background: #dcfce7; color: #15803d; }

    /* MODAL STYLES */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-card { background: white; width: 400px; padding: 24px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #334155; font-size: 14px; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
    .btn-save { background: #0D9488; color: white; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 8px; }
    .btn-cancel { background: transparent; color: #64748b; border: none; font-weight: bold; cursor: pointer; width: 100%; margin-top: 8px; padding: 8px; }
  `],
  template: `
    <div class="logistics-container">
      <div class="header">
        <h2>Control de Despachos</h2>
        <button (click)="showModal.set(true)" style="background-color:#0D9488; color:white; padding:12px 24px; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
          + Nuevo Manifiesto
        </button>
      </div>

      <div class="board">
        <div class="column">
          <div class="column-title"><span>⏳</span> Por Asignar</div>
          @for (dispatch of store.activeDispatches(); track dispatch.id) {
            @if (dispatch.status === 'PENDING') {
              <div class="dispatch-card card-pending">
                <div class="driver">{{ dispatch.driverName }}</div>
                <div class="destination">📍 {{ dispatch.destination }}</div>
                <!-- BOTÓN REPARADO: Ahora sí mueve la tarjeta -->
                <button class="btn-action" (click)="assign(dispatch.id)">Asignar Vehículo</button>
              </div>
            }
          }
        </div>

        <div class="column">
          <div class="column-title"><span>🚚</span> En Ruta</div>
          @for (dispatch of store.activeDispatches(); track dispatch.id) {
            @if (dispatch.status === 'IN_TRANSIT') {
              <div class="dispatch-card card-transit">
                <div class="driver">{{ dispatch.driverName }}</div>
                <div class="destination">📍 {{ dispatch.destination }}</div>
                <button class="btn-action success" (click)="deliver(dispatch.id)">Marcar Entregado ✓</button>
              </div>
            }
          }
        </div>

        <div class="column">
          <div class="column-title"><span>✅</span> Entregados (Hoy)</div>
          @for (dispatch of store.activeDispatches(); track dispatch.id) {
            @if (dispatch.status === 'DELIVERED') {
              <div class="dispatch-card card-delivered">
                <div class="driver">{{ dispatch.driverName }}</div>
                <div class="destination">📍 {{ dispatch.destination }}</div>
              </div>
            }
          }
        </div>
      </div>
    </div>

    <!-- MODAL ELEGANTE PARA NUEVO MANIFIESTO (Reemplaza al prompt) -->
    @if (showModal()) {
      <div class="modal-overlay">
        <div class="modal-card">
          <h3 style="margin-top: 0; color: #0F172A; margin-bottom: 24px;">Crear Nuevo Manifiesto</h3>

          <div class="form-group">
            <label>Nombre del Conductor</label>
            <input type="text" [(ngModel)]="newDriver" placeholder="Ej. Juan Pérez">
          </div>

          <div class="form-group">
            <label>Dirección de Destino</label>
            <input type="text" [(ngModel)]="newDestination" placeholder="Ej. Av. Larco 123">
          </div>

          <button class="btn-save" (click)="saveManifest()" [disabled]="!newDriver || !newDestination">Generar Manifiesto</button>
          <button class="btn-cancel" (click)="closeModal()">Cancelar</button>
        </div>
      </div>
    }
  `
})
export class DispatchList {
  readonly store = inject(LogisticsStore);

  // Estado del Modal
  showModal = signal(false);
  newDriver = '';
  newDestination = '';

  saveManifest() {
    if (this.newDriver && this.newDestination) {
      this.store.addDispatch(this.newDriver, this.newDestination);
      this.closeModal();
    }
  }

  closeModal() {
    this.newDriver = '';
    this.newDestination = '';
    this.showModal.set(false);
  }

  assign(id: string) {
    this.store.assignVehicle(id);
  }

  deliver(id: string) {
    this.store.markAsDelivered(id);
  }
}
