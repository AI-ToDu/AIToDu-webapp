import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { Session } from './shared/infrastructure/api';
import { I18n } from './shared/application/i18n';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => Promise.all([inject(Session).restore(), inject(I18n).load()])),
  ],
};
