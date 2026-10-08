// RUTA EXACTA: src/app/logistics/infrastructure/logistics-assembler.ts

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Dispatch } from '../domain/model/dispatch.entity';
import { DispatchItemsResponse, DispatchResource } from './logistics-response';

export class LogisticsAssembler implements BaseAssembler<Dispatch, DispatchResource, DispatchItemsResponse> {

  toEntitiesFromResponse(response: DispatchItemsResponse): Dispatch[] {
    return response.items.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DispatchResource): Dispatch {
    return new Dispatch({
      id: resource.id,
      driverName: resource.driverName,
      destination: resource.destination,
      status: resource.status,
    });
  }

  toResourceFromEntity(entity: Dispatch): DispatchResource {
    return {
      id: entity.id,
      driverName: entity.driverName,
      destination: entity.destination,
      status: entity.status,
    } as DispatchResource;
  }
}
