// RUTA EXACTA: src/app/inventory/presentation/views/product-list.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryStore } from '../../application/inventory.store';
import { FormsModule } from '@angular/forms'; // Necesario para el modal

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule],
  styles: [`
    .inventory-container { padding: 32px; max-width: 1200px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h2 { color: #0F172A; margin: 0; font-size: 28px; }
    .btn-primary { background-color: #0D9488; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2); }
    .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
    .inventory-table { width: 100%; border-collapse: collapse; text-align: left; }
    .inventory-table th { background-color: #f8fafc; color: #475569; padding: 16px 24px; font-weight: 600; font-size: 13px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    .inventory-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px; }
    .sku-code { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; color: #0F172A; font-weight: 600; }
    .status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; }
    .status-good { background-color: #dcfce7; color: #15803d; }
    .status-warning { background-color: #fef9c3; color: #a16207; }
    .status-danger { background-color: #fee2e2; color: #b91c1c; }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-card { background: white; width: 400px; padding: 24px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #334155; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
    .btn-save { background: #0D9488; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 16px; }
    .btn-cancel { background: transparent; color: #64748b; border: none; font-weight: bold; cursor: pointer; width: 100%; margin-top: 8px; padding: 8px; }
  `],
  template: `
    <div class="inventory-container">
      <div class="header">
        <h2>Catálogo de Inventario</h2>
        <button class="btn-primary" (click)="navigateToAdd()">+ Registrar Entrada</button>
      </div>

      <div class="table-card">
        <table class="inventory-table">
          <thead><tr><th>SKU</th><th>Producto</th><th>Cantidad</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            @for (item of store.items(); track item.id) {
              <tr>
                <td><span class="sku-code">{{ item.sku }}</span></td>
                <td><strong>{{ item.name }}</strong></td>
                <td>{{ item.quantity }} und.</td>
                <td>
                  <span class="status" [class.status-good]="item.quantity > 10" [class.status-warning]="item.quantity > 0 && item.quantity <= 10" [class.status-danger]="item.quantity === 0">
                    {{ item.conservationStatus }}
                  </span>
                </td>
                <td><button (click)="openEdit(item.id, item.name, item.quantity)" style="background:none; border:none; color:#0D9488; font-weight:600; cursor:pointer;">Editar</button></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Edición de Stock -->
    @if (showModal()) {
      <div class="modal-overlay">
        <div class="modal-card">
          <h3 style="margin-top: 0; color: #0F172A;">Ajustar Stock</h3>
          <p style="color: #64748b; font-size: 14px;">Producto: {{ editingName() }}</p>

          <div class="form-group">
            <label>Nueva Cantidad Físico</label>
            <input type="number" [(ngModel)]="editingQty" min="0">
          </div>

          <button class="btn-save" (click)="saveEdit()">Guardar Cambios</button>
          <button class="btn-cancel" (click)="showModal.set(false)">Cancelar</button>
        </div>
      </div>
    }
  `
})
export class ProductList {
  readonly store = inject(InventoryStore);
  readonly #router = inject(Router);

  // Estado del modal
  showModal = signal(false);
  editingId = signal('');
  editingName = signal('');
  editingQty = 0;

  navigateToAdd() {
    this.#router.navigate(['/inventory/products/new']).then();
  }

  openEdit(id: string, name: string, currentQty: number) {
    this.editingId.set(id);
    this.editingName.set(name);
    this.editingQty = currentQty;
    this.showModal.set(true);
  }

  saveEdit() {
    this.store.updateStock(this.editingId(), this.editingQty);
    this.showModal.set(false);
  }
}
