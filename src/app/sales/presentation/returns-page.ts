import { Component, signal } from '@angular/core';
import { Page, UI, State, options } from '../../shared/presentation/ui';
import { Row } from '../../shared/domain/models';
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <h1>{{ i.t('returns') }}</h1>
      <button mat-flat-button (click)="create()" [disabled]="!sales().length">
        + {{ i.t('newReturn') }}
      </button>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <section class="surface table-scroll">
      <table>
        <thead>
          <tr>
            <th>{{ i.t('date') }}</th>
            <th>{{ i.t('reference') }}</th>
            <th>{{ i.t('reason') }}</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr>
              <td>{{ i.formatDate(row.createdAt) }}</td>
              <td>
                <code>{{ row.id.slice(0, 8) }}</code>
              </td>
              <td>{{ row.reason }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="3" class="empty">{{ i.t('emptyHint') }}</td>
            </tr>
          }
        </tbody>
      </table>
    </section>`,
})
export class ReturnsPage extends Page {
  readonly sales = signal<Row[]>([]);
  constructor() {
    super();
    void this.reload();
  }
  async reload() {
    try {
      this.sales.set((await this.api.list('sales')).filter((s) => s.status === 'CONFIRMED'));
      await this.load('returns');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  create() {
    const choices = this.sales().flatMap((s) =>
      (s.lines ?? []).map((l) => ({ ...l, saleId: s.id, label: s.number + ' · ' + l.name })),
    );
    this.dialogs.form(
      {
        title: 'newReturn',
        path: 'returns',
        fields: [
          {
            key: 'saleLineId',
            label: 'sale',
            type: 'select',
            options: options(choices, (l) => (l as Row & { label: string }).label),
          },
          { key: 'quantity', label: 'quantity', type: 'number', min: 1, value: 1 },
          {
            key: 'disposition',
            label: 'returnPolicy',
            type: 'select',
            options: ['RESTOCK', 'LOSS'].map((k) => ({ value: k, label: this.i.t(k) })),
            value: 'RESTOCK',
          },
          { key: 'reason', label: 'reason', type: 'textarea' },
        ],
        payload: (v) => ({ ...v, saleId: choices.find((l) => l.id === v['saleLineId'])?.saleId }),
      },
      () => void this.reload(),
    );
  }
}
