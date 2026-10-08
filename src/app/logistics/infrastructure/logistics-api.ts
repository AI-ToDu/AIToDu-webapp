// RUTA EXACTA: src/app/logistics/infrastructure/logistics-api.ts

import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Dispatch } from '../domain/model/dispatch.entity';
import { LogisticsApiEndpoint } from './logistics-api-endpoint';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LogisticsApi extends BaseApi {
  readonly #endpoint = new LogisticsApiEndpoint(this.http);

  getAllDispatches(): Observable<Dispatch[]> {
    return this.#endpoint.getAll();
  }

  updateDispatch(dispatch: Dispatch): Observable<Dispatch> {
    return this.#endpoint.update(dispatch, dispatch.id);
  }
}
