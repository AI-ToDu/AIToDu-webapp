import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Sale } from '../domain/model/sale.entity';
import { SaleResource, SalesResponse } from './sales-response';

export class SalesAssembler implements BaseAssembler<Sale, SaleResource, SalesResponse> {

  toEntitiesFromResponse(response: SalesResponse): Sale[] {
    return response.items.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: SaleResource): Sale {
    return new Sale({
      id: resource.id,
      customerName: resource.customerName,
      totalAmount: resource.totalAmount,
      date: new Date(resource.date),
      status: resource.status,
    });
  }

  toResourceFromEntity(entity: Sale): SaleResource {
    return {
      id: entity.id,
      customerName: entity.customerName,
      totalAmount: entity.totalAmount,
      date: entity.date.toISOString(),
      status: entity.status,
    } as SaleResource;
  }
}
