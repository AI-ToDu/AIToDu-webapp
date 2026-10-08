// RUTA EXACTA: src/app/inventory/domain/model/inventory-item.entity.ts

import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class InventoryItem implements BaseEntity {
  #id: string;
  #sku: string;
  #name: string;
  #quantity: number;
  #conservationStatus: string;

  constructor(props: { id: string; sku: string; name: string; quantity: number; conservationStatus: string }) {
    this.#id = props.id;
    this.#sku = props.sku;
    this.#name = props.name;
    this.#quantity = props.quantity;
    this.#conservationStatus = props.conservationStatus;
  }

  get id(): string { return this.#id; }
  get sku(): string { return this.#sku; }
  get name(): string { return this.#name; }
  get quantity(): number { return this.#quantity; }
  get conservationStatus(): string { return this.#conservationStatus; }

  addStock(amount: number): void {
    this.#quantity += amount;
  }
}
