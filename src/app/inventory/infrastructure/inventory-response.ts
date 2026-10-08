// RUTA EXACTA: src/app/inventory/infrastructure/inventory-response.ts

import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface InventoryItemsResponse extends BaseResponse {
  items: InventoryItemResource[];
}

export interface InventoryItemResource extends BaseResource {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  conservationStatus: string;
}
