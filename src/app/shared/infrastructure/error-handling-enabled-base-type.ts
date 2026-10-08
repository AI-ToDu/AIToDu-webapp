import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export abstract class ErrorHandlingEnabledBaseType {
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;

      if (error.status === 404) {
        errorMessage = `${operation}: Recurso no encontrado.`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: Error de red - ${error.error.message}`;
      } else {
        errorMessage = `${operation}: Error inesperado del servidor (Código ${error.status}).`;
      }

      console.error(errorMessage, error);
      return throwError(() => new Error(errorMessage));
    };
  }
}
