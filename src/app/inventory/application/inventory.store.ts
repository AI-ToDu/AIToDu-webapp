import { Injectable, signal, computed } from '@angular/core';
import { InventoryItem } from '../domain/model/inventory-item.entity';

@Injectable({
  providedIn: 'root',
})
export class InventoryStore {
  readonly #itemsSignal = signal<InventoryItem[]>([
    new InventoryItem({ id: '1', sku: 'ALIM-001', name: 'Caja de Tomates (20kg)', quantity: 15, conservationStatus: 'GOOD' }),
    new InventoryItem({ id: '2', sku: 'ALIM-002', name: 'Saco de Arroz Extra (50kg)', quantity: 8, conservationStatus: 'WARNING' }),
    new InventoryItem({ id: '3', sku: 'ALIM-003', name: 'Aceite Vegetal (Caja 12x1L)', quantity: 0, conservationStatus: 'DAMAGED' })
  ]);

  readonly items = this.#itemsSignal.asReadonly();
  readonly totalItemsCount = computed(() => this.items().length);

  addItem(itemData: { sku: string; name: string; quantity: number; status: string }) {
    const exists = this.#itemsSignal().some(i => i.sku === itemData.sku);
    if (exists) {
      alert('Error: Ya existe un producto con el SKU ' + itemData.sku);
      return;
    }
    const newItem = new InventoryItem({
      id: crypto.randomUUID(), sku: itemData.sku, name: itemData.name, quantity: itemData.quantity, conservationStatus: itemData.status
    });
    this.#itemsSignal.update(items => [...items, newItem]);
  }

  // NUEVA FUNCIÓN: Actualizar stock manualmente desde la tabla
  updateStock(id: string, newQuantity: number) {
    this.#itemsSignal.update(items => items.map(item => {
      if (item.id === id) {
        let newStatus = item.conservationStatus;
        if (newQuantity === 0) newStatus = 'DAMAGED';
        else if (newQuantity <= 10) newStatus = 'WARNING';
        else newStatus = 'GOOD';
        return new InventoryItem({ id: item.id, sku: item.sku, name: item.name, quantity: newQuantity, conservationStatus: newStatus });
      }
      return item;
    }));
  }

  decreaseStock(productId: string, soldQuantity: number) {
    this.#itemsSignal.update(items => items.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity - soldQuantity);
        let newStatus = item.conservationStatus;

        if (newQty === 0) newStatus = 'DAMAGED'; // Simulamos "Agotado"
        else if (newQty <= 10) newStatus = 'WARNING'; // Simulamos "Stock Bajo"

        return new InventoryItem({
          id: item.id, sku: item.sku, name: item.name, quantity: newQty, conservationStatus: newStatus
        });
      }
      return item;
    }));
  }
}
