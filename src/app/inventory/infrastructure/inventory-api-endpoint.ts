// RUTA EXACTA: src/app/inventory/infrastructure/inventory-api-endpoint.ts

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { InventoryItem } from '../domain/model/inventory-item.entity';
import { InventoryItemResource, InventoryItemsResponse } from './inventory-response';
import { InventoryAssembler } from './inventory-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class InventoryApiEndpoint extends BaseApiEndpoint<
  InventoryItem,
  InventoryItemResource,
  InventoryItemsResponse,
  InventoryAssembler
> {
  constructor(http: HttpClient) {
    // Apunta al backend real en el puerto de Spring Boot
    super(
      http,
      `${environment.platformProviderApiBaseUrl}/inventory`,
      new InventoryAssembler()
    );
  }
}
