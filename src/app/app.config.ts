import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilitamos el enrutador con las rutas maestras
    provideRouter(routes, withComponentInputBinding()),
    // Habilitamos HttpClient globalmente para hacer peticiones a Spring Boot
    provideHttpClient(withFetch())
  ]
};
