// RUTA EXACTA: src/app/logistics/infrastructure/logistics-response.ts

import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DispatchItemsResponse extends BaseResponse {
  items: DispatchResource[];
}

export interface DispatchResource extends BaseResource {
  id: string;
  driverName: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
}
