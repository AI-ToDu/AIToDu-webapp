import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { IamStore } from '../../../../iam/application/iam.store';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { FooterContent } from '../footer-content/footer-content';
import { I18nStore } from '../../../application/i18n.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LanguageSwitcher,
    FooterContent
  ],
  styles: [`
    .app-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f8fafc;
    }
    .top-navbar {
      background-color: #0F172A;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      gap: 24px;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand-logo {
      margin: 0;
      color: #0D9488;
      font-weight: 800;
      font-size: 24px;
      cursor: pointer;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      flex-grow: 1;
    }
    .nav-link {
      color: #cbd5e1;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      padding: 6px 0;
    }
    .nav-link:hover, .nav-link.active {
      color: white;
      border-bottom: 2px solid #0D9488;
    }
    .actions-panel {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .btn-logout {
      background-color: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 6px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background-color: #ef4444;
      color: white;
    }
    .main-content {
      flex-grow: 1;
      padding-bottom: 40px;
    }
  `],
  template: `
    <div class="app-wrapper">
      @if (iamStore.isAuthenticated()) {
        <nav class="top-navbar">
          <a class="brand-logo" routerLink="/reporting/dashboard">AI-ToDu</a>

          <div class="nav-links">
            <a routerLink="/reporting/dashboard" routerLinkActive="active" class="nav-link">{{ i18n.t().layout.dashboard }}</a>
            <a routerLink="/inventory/products" routerLinkActive="active" class="nav-link">{{ i18n.t().layout.inventory }}</a>
            <a routerLink="/sales/pos" routerLinkActive="active" class="nav-link">{{ i18n.t().layout.pos }}</a>
            <a routerLink="/logistics/dispatches" routerLinkActive="active" class="nav-link">{{ i18n.t().layout.dispatches }}</a>
          </div>

          <div class="actions-panel">
            <app-language-switcher></app-language-switcher>
            <button class="btn-logout" (click)="logout()">{{ i18n.t().layout.logout }}</button>
          </div>
        </nav>
      }

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer siempre abajo usando flexbox -->
      <app-footer-content></app-footer-content>
    </div>
  `
})
export class Layout {
  readonly iamStore = inject(IamStore);
  readonly i18n = inject(I18nStore);
  readonly #router = inject(Router);

  logout() {
    this.iamStore.logout(); // CORREGIDO: Ahora llamamos a iamStore correctamente
    this.#router.navigate(['/login']).then();
  }
}
