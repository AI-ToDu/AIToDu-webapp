import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Page, UI, State } from '../../shared/presentation/ui';
import { Metrics } from '../../shared/domain/models';
@Component({
  standalone: true,
  imports: [...UI, State, RouterLink],
  template: `<header class="page-header">
      <div>
        <span class="eyebrow">{{ i.t('workspace') }}</span>
        <h1>{{ i.t('overview') }}</h1>
        <p class="muted">{{ i.t('overviewIntro') }}</p>
      </div>
      <button mat-stroked-button (click)="reload()">{{ i.t('refresh') }}</button>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    @if (metrics(); as m) {
      <div class="metric-grid">
        @for (card of cards; track card.key) {
          <article class="metric-card">
            <span>{{ i.t(card.label) }}</span
            ><strong>{{
              card.money ? i.formatMoney(value(m, card.key)) : value(m, card.key)
            }}</strong
            ><span class="metric-accent"></span>
          </article>
        }
      </div>
      <p class="muted caption">{{ i.t('marginNote') }}</p>
    }
    <section class="surface flow-section">
      <span class="eyebrow">{{ i.t('workflow') }}</span>
      <h2>{{ i.t('overviewHint') }}</h2>
      <div class="workflow-grid">
        @for (step of steps; track step.route) {
          <a [routerLink]="'/' + step.route"
            ><span class="step-number">{{ step.number }}</span
            ><strong>{{ i.t(step.label) }}</strong
            ><span aria-hidden="true">↗</span></a
          >
        }
      </div>
    </section>`,
})
export class OverviewPage extends Page {
  readonly metrics = signal<Metrics | null>(null);
  readonly cards = [
    { key: 'revenue', label: 'revenue', money: true },
    { key: 'grossMargin', label: 'grossMargin', money: true },
    { key: 'inventoryValue', label: 'inventoryValue', money: true },
    { key: 'lowStock', label: 'lowStock', money: false },
    { key: 'dispatches', label: 'activeDispatches', money: false },
    { key: 'sales', label: 'saleCount', money: false },
  ];
  readonly steps = [
    { number: '01', label: 'flow1', route: 'inventory' },
    { number: '02', label: 'flow2', route: 'sales' },
    { number: '03', label: 'flow3', route: 'logistics' },
    { number: '04', label: 'flow4', route: 'movements' },
  ];
  constructor() {
    super();
    void this.reload();
  }
  value(m: Metrics, key: string) {
    return m[key as keyof Metrics];
  }
  async reload() {
    this.busy.set(true);
    this.error.set('');
    try {
      this.metrics.set(await this.api.request<Metrics>('GET', 'metrics'));
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }
}
