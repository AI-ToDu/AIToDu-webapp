// RUTA EXACTA: src/app/inventory/infrastructure/inventory-assembler.ts

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryItemsResponse, InventoryItemResource } from './inventory-response';

export class InventoryAssembler implements BaseAssembler<InventoryItem, InventoryItemResource, InventoryItemsResponse> {

  toEntitiesFromResponse(response: InventoryItemsResponse): InventoryItem[] {
    return response.items.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: InventoryItemResource): InventoryItem {
    return new InventoryItem({
      id: resource.id,
      sku: resource.sku,
      name: resource.name,
      quantity: resource.quantity,
      conservationStatus: resource.conservationStatus,
    });
  }

  toResourceFromEntity(entity: InventoryItem): InventoryItemResource {
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      quantity: entity.quantity,
      conservationStatus: entity.conservationStatus,
    } as InventoryItemResource;
  }
}
