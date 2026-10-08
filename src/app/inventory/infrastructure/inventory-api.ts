// RUTA EXACTA: src/app/inventory/infrastructure/inventory-api.ts

import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryApiEndpoint } from './inventory-api-endpoint';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventoryApi extends BaseApi {
  readonly #endpoint = new InventoryApiEndpoint(this.http);

  getAllItems(): Observable<InventoryItem[]> {
    return this.#endpoint.getAll();
  }

  createItem(item: InventoryItem): Observable<InventoryItem> {
    return this.#endpoint.create(item);
  }

  updateItem(item: InventoryItem): Observable<InventoryItem> {
    return this.#endpoint.update(item, item.id);
  }

  deleteItem(id: string): Observable<void> {
    return this.#endpoint.delete(id);
  }
}
