// RUTA EXACTA: src/app/shared/presentation/components/language-switcher/language-switcher.ts
import { Component, inject } from '@angular/core';
import { I18nStore } from '../../../application/i18n.store';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  styles: [`
    .lang-btn { background: transparent; border: 1px solid #cbd5e1; color: #cbd5e1; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
    .lang-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; border-color: white; }
  `],
  template: `
    <button class="lang-btn" (click)="store.toggleLanguage()">
      <span>🌍</span> {{ store.currentLang() }}
    </button>
  `
})
export class LanguageSwitcher {
  readonly store = inject(I18nStore);
}
