import { Component, inject, signal } from '@angular/core';
// Agregamos SlicePipe aquí abajo:
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { InventoryStore } from '../../../inventory/application/inventory.store';
import { SalesStore } from '../../application/sales.store';

@Component({
  selector: 'app-pos',
  standalone: true,
  // Y lo agregamos al arreglo de imports:
  imports: [CurrencyPipe, DatePipe, SlicePipe],
  styles: [`
    .pos-container { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; padding: 32px; max-width: 1400px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; }
    .header h2 { color: #0F172A; margin: 0 0 24px 0; font-size: 28px; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .product-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; }
    .product-card:hover:not(.out-of-stock) { border-color: #0D9488; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1); transform: translateY(-2px); }
    .product-card.out-of-stock { opacity: 0.5; cursor: not-allowed; background-color: #f8fafc; }
    .product-price { color: #0D9488; font-weight: bold; font-size: 18px; margin-top: 8px; }
    .cart-panel { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; flex-direction: column; height: calc(100vh - 150px); position: sticky; top: 24px; }
    .cart-items { flex-grow: 1; overflow-y: auto; }
    .cart-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
    .btn-checkout { background-color: #0F172A; color: white; width: 100%; padding: 16px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; margin-top: 24px; cursor: pointer; transition: background 0.2s; }
    .btn-checkout:not(:disabled):hover { background-color: #1e293b; }
    .btn-checkout:disabled { background-color: #94a3b8; cursor: not-allowed; }

    /* ESTILOS DEL MODAL DE BOLETA */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .receipt-card { background: white; width: 400px; border-radius: 12px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); font-family: monospace; }
    .receipt-header { text-align: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px; }
    .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .receipt-total { border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 16px; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; }
    .btn-print { background: #0D9488; color: white; width: 100%; padding: 12px; border: none; border-radius: 6px; margin-top: 24px; font-weight: bold; font-family: 'Segoe UI', sans-serif; cursor: pointer; }
  `],
  template: `
    <div class="pos-container">
      <div>
        <div class="header"><h2>Punto de Venta (Caja)</h2></div>

        <div class="product-grid">
          @for (item of inventoryStore.items(); track item.id) {
            <div class="product-card" [class.out-of-stock]="item.quantity === 0" (click)="add(item.id, item.name, item.quantity)">
              <div style="display:flex; justify-content: space-between;">
                <span style="color: #64748b; font-size: 12px;">{{ item.sku }}</span>
                <span style="font-size: 12px; font-weight: bold;" [style.color]="item.quantity > 0 ? '#10b981' : '#ef4444'">Stock: {{ item.quantity }}</span>
              </div>
              <div style="font-weight: 600; color: #0F172A; margin-top: 4px;">{{ item.name }}</div>
              <div class="product-price">{{ 15.50 | currency:'PEN':'S/ ' }}</div>
            </div>
          } @empty {
            <p style="color: #64748b;">No hay productos disponibles. Registre en el inventario primero.</p>
          }
        </div>
      </div>

      <div class="cart-panel">
        <h3 style="margin-top: 0; color: #0F172A;">Resumen de Venta</h3>
        <div class="cart-items">
          @for (cartItem of salesStore.cart(); track cartItem.id) {
            <div class="cart-item">
              <div style="flex-grow: 1;">
                <div style="font-weight: 600; color: #334155;">{{ cartItem.name }}</div>
                <div style="font-size: 12px; color: #64748b;">S/ 15.50 c/u</div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px; background: #f1f5f9; border-radius: 6px; padding: 2px 6px;">
                <button (click)="salesStore.updateQuantity(cartItem.id, -1)" style="border:none; background:transparent; cursor:pointer; font-weight:bold; color:#64748b;">-</button>
                <span style="font-size: 14px; font-weight:bold; width: 20px; text-align: center;">{{ cartItem.quantity }}</span>
                <button (click)="salesStore.updateQuantity(cartItem.id, 1)" style="border:none; background:transparent; cursor:pointer; font-weight:bold; color:#0D9488;">+</button>
              </div>

              <div style="font-weight: bold; color: #0F172A; margin-left: 16px; min-width: 60px; text-align: right;">
                {{ (cartItem.quantity * cartItem.price) | currency:'PEN':'S/ ' }}
              </div>
            </div>
          } @empty {
            <div style="text-align: center; color: #94a3b8; margin-top: 40px;"><span style="font-size: 32px;">🛒</span><p>La canasta está vacía</p></div>
          }
        </div>

        <div>
          <hr style="border-top: 1px dashed #cbd5e1; border-bottom: none; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #0D9488;">
            <span>Total a Cobrar:</span>
            <span>{{ salesStore.totalAmount() | currency:'PEN':'S/ ' }}</span>
          </div>

          <button class="btn-checkout" [disabled]="salesStore.cart().length === 0" (click)="checkout()">Procesar Pago</button>
        </div>
      </div>
    </div>

    <!-- MODAL DE BOLETA ELECTRÓNICA -->
    @if (showReceipt()) {
      <div class="modal-overlay">
        <div class="receipt-card">
          <div class="receipt-header">
            <h2 style="margin:0;">AI-ToDu POS</h2>
            <p style="margin: 4px 0;">Boleta Electrónica</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Fecha: {{ currentDate | date:'short' }}</p>
          </div>

          <div style="margin-bottom: 16px;">
            <div class="receipt-row" style="font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
              <span>CANT. PRODUCTO</span>
              <span>SUBTOTAL</span>
            </div>
            @for (item of finalReceipt.items; track item.name) {
              <div class="receipt-row">
                <span>{{ item.quantity }}x {{ item.name | slice:0:15 }}...</span>
                <span>{{ (item.quantity * item.price) | currency:'PEN':'S/ ' }}</span>
              </div>
            }
          </div>

          <div class="receipt-total">
            <span>TOTAL PAGADO</span>
            <span>{{ finalReceipt.total | currency:'PEN':'S/ ' }}</span>
          </div>

          <button class="btn-print" (click)="closeReceipt()">IMPRIMIR Y CERRAR</button>
        </div>
      </div>
    }
  `
})
export class Pos {
  readonly inventoryStore = inject(InventoryStore);
  readonly salesStore = inject(SalesStore);

  showReceipt = signal(false);
  finalReceipt: { items: any[], total: number } = { items: [], total: 0 };
  currentDate = new Date();

  add(id: string, name: string, stock: number) {
    if (stock <= 0) return; // No permite agregar si no hay stock
    this.salesStore.addToCart(id, name, 15.50);
  }

  checkout() {
    // 1. Guardar copia de los datos para la boleta antes de limpiar el carrito
    this.finalReceipt = {
      items: [...this.salesStore.cart()],
      total: this.salesStore.totalAmount()
    };

    // 2. Descontar el stock del inventario global
    this.salesStore.cart().forEach(cartItem => {
      this.inventoryStore.decreaseStock(cartItem.id, cartItem.quantity);
    });

    // 3. Procesar venta y mostrar boleta
    this.salesStore.processCheckout();
    this.currentDate = new Date();
    this.showReceipt.set(true);
  }

  closeReceipt() {
    this.showReceipt.set(false);
  }
}
