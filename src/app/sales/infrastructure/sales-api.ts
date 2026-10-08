import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Sale } from '../domain/model/sale.entity';
import { SalesApiEndpoint } from './sales-api-endpoint';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesApi extends BaseApi {
  readonly #endpoint = new SalesApiEndpoint(this.http);

  getAllSales(): Observable<Sale[]> {
    return this.#endpoint.getAll();
  }

  registerSale(sale: Sale): Observable<Sale> {
    return this.#endpoint.create(sale);
  }
}
