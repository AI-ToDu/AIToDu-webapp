// RUTA EXACTA: src/app/iam/infrastructure/iam-api.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { User } from '../domain/model/user.entity';
import { IamAssembler } from './iam-assembler';
import { LoginRequest, LoginResponse } from './iam-response';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  readonly #assembler = new IamAssembler();
  readonly #basePath = `${environment.platformProviderApiBaseUrl}/iam`;

  // Este método hará el POST real a Spring Boot cuando el backend esté listo
  login(request: LoginRequest): Observable<{ user: User, token: string }> {
    return this.http.post<LoginResponse>(`${this.#basePath}/sign-in`, request).pipe(
      map(response => ({
        user: this.#assembler.toEntityFromResource(response.user),
        token: response.token
      }))
    );
  }
}
