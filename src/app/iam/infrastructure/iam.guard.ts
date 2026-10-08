// RUTA EXACTA: src/app/iam/infrastructure/iam.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';

export const iamGuard: CanActivateFn = (route, state) => {
  const store = inject(IamStore);
  const router = inject(Router);

  // Si el usuario está autenticado, le permitimos pasar
  if (store.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, lo enviamos al login
  return router.createUrlTree(['/login']);
};
