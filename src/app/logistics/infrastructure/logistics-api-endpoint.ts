// RUTA EXACTA: src/app/logistics/infrastructure/logistics-api-endpoint.ts

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Dispatch } from '../domain/model/dispatch.entity';
import { DispatchResource, DispatchItemsResponse } from './logistics-response';
import { LogisticsAssembler } from './logistics-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class LogisticsApiEndpoint extends BaseApiEndpoint<
  Dispatch,
  DispatchResource,
  DispatchItemsResponse,
  LogisticsAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}/logistics/dispatches`,
      new LogisticsAssembler()
    );
  }
}
