import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .not-found-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 70vh; text-align: center; font-family: 'Segoe UI', Tahoma, sans-serif;
    }
    .error-code { font-size: 140px; font-weight: 800; color: #e2e8f0; margin: 0; line-height: 1; }
    .error-title { font-size: 28px; color: #0F172A; margin-top: 16px; font-weight: 700; }
    .error-msg { color: #64748b; margin-top: 8px; max-width: 400px; font-size: 16px; line-height: 1.5; }
    .btn-home {
      background-color: #0F172A; color: white; padding: 12px 28px; text-decoration: none;
      border-radius: 8px; font-weight: 600; margin-top: 32px; display: inline-block; transition: background 0.2s;
    }
    .btn-home:hover { background-color: #1e293b; }
  `],
  template: `
    <div class="not-found-container">
      <h1 class="error-code">404</h1>
      <div class="error-title">Ruta Extraviada</div>
      <p class="error-msg">Parece que el cargamento se desvió del camino. La página que buscas no existe o fue movida de lugar.</p>
      <a routerLink="/reporting/dashboard" class="btn-home">Volver a la Base Central</a>
    </div>
  `
})
export class PageNotFound {}
