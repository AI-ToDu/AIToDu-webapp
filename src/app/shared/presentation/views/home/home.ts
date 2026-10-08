import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .hero-container {
      max-width: 900px;
      margin: 60px auto;
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      font-family: 'Segoe UI', Tahoma, sans-serif;
    }
    .title { color: #0F172A; font-size: 42px; margin-bottom: 16px; font-weight: 800; }
    .subtitle { color: #64748b; font-size: 20px; line-height: 1.6; margin-bottom: 32px; }
    .btn-start {
      background: #0D9488; color: white; padding: 14px 32px; border-radius: 8px;
      text-decoration: none; font-size: 18px; font-weight: bold; transition: background 0.2s;
    }
    .btn-start:hover { background: #0f766e; }
  `],
  template: `
    <div class="hero-container">
      <h1 class="title">El Sistema Nervioso de tu Logística 🚀</h1>
      <p class="subtitle">
        AI-ToDu es la plataforma integral B2B que conecta tus ventas, inventarios y despachos en tiempo real.
        Diseñado para dueños de negocios y operarios exigentes.
      </p>
      <a routerLink="/login" class="btn-start">Comenzar Ahora</a>
    </div>
  `
})
export class Home {}
