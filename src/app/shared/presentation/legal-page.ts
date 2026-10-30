import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../application/i18n';
import { UI } from './ui';
@Component({
  standalone: true,
  imports: [...UI, RouterLink],
  template: `<section class="surface legal-page">
    <span class="eyebrow">AI-ToDu / TB1</span>
    <h1>{{ i.t('legalTitle') }}</h1>
    <p>{{ i.t('legalText') }}</p>
    <a mat-stroked-button routerLink="/">{{ i.t('backWorkspace') }}</a>
  </section>`,
})
export class LegalPage {
  readonly i = inject(I18n);
}
