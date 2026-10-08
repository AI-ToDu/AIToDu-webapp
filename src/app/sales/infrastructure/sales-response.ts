import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SalesResponse extends BaseResponse {
  items: SaleResource[];
}

export interface SaleResource extends BaseResource {
  customerName: string;
  totalAmount: number;
  date: string;
  status: string;
}
