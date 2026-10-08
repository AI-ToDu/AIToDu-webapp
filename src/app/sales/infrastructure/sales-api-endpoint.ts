import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Sale } from '../domain/model/sale.entity';
import { SaleResource, SalesResponse } from './sales-response';
import { SalesAssembler } from './sales-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class SalesApiEndpoint extends BaseApiEndpoint<
  Sale,
  SaleResource,
  SalesResponse,
  SalesAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}/sales`,
      new SalesAssembler()
    );
  }
}
