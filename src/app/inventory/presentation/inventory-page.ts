import { Component, inject, signal, computed } from '@angular/core';
import { Page, UI, State } from '../../shared/presentation/ui';
import { Session } from '../../shared/infrastructure/api';
import { Row } from '../../shared/domain/models';
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <div>
        <span class="eyebrow">01 / {{ i.t('workspace') }}</span>
        <h1>{{ i.t('inventory') }}</h1>
      </div>
      @if (editable) {
        <div class="actions">
          <button mat-stroked-button (click)="movement()">{{ i.t('stockMovement') }}</button
          ><button mat-flat-button (click)="create()">+ {{ i.t('newProduct') }}</button>
        </div>
      }
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <section class="surface">
      <div class="section-toolbar">
        <mat-form-field appearance="outline" subscriptSizing="dynamic"
          ><mat-label>{{ i.t('search') }}</mat-label
          ><input
            matInput
            [ngModel]="query()"
            (ngModelChange)="query.set($event)" /></mat-form-field
        ><span class="count">{{ filtered().length }} / {{ rows().length }}</span
        ><button mat-button (click)="load('products')">{{ i.t('refresh') }}</button>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{{ i.t('product') }}</th>
              <th>{{ i.t('available') }}</th>
              <th>{{ i.t('price') }}</th>
              <th>{{ i.t('cost') }}</th>
              <th>{{ i.t('conservation') }}</th>
              @if (editable) {
                <th>{{ i.t('actions') }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (p of filtered(); track p.id) {
              <tr>
                <td>
                  <strong>{{ p.name }}</strong
                  ><code>{{ p.sku }}</code>
                </td>
                <td>
                  <span class="stock-number" [class.low]="(p.quantity ?? 0) <= (p.minimum ?? 0)">{{
                    p.quantity
                  }}</span
                  ><small>{{ i.t('minimum') }}: {{ p.minimum }}</small>
                </td>
                <td>{{ i.formatMoney(p.price ?? 0) }}</td>
                <td>{{ i.formatMoney(p.cost ?? 0) }}</td>
                <td>
                  <span class="badge" [class.warn]="p.conservation !== 'GOOD'">{{
                    i.t(p.conservation ?? '')
                  }}</span>
                </td>
                @if (editable) {
                  <td>
                    <button
                      mat-button
                      (click)="conservation(p)"
                      [attr.aria-label]="i.t('conservation') + ': ' + p.name"
                    >
                      {{ i.t('conservation') }}
                    </button>
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="empty">{{ i.t('empty') }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>`,
})
export class InventoryPage extends Page {
  private session = inject(Session);
  readonly query = signal('');
  readonly filtered = computed(() =>
    this.rows().filter((p) =>
      (p.name + ' ' + p.sku).toLowerCase().includes(this.query().trim().toLowerCase()),
    ),
  );
  get editable() {
    return ['ADMIN', 'WAREHOUSE'].includes(this.session.user()?.role ?? '');
  }
  constructor() {
    super();
    void this.load('products');
  }
  create() {
    this.dialogs.form(
      {
        title: 'newProduct',
        path: 'products',
        fields: [
          { key: 'sku', label: 'sku' },
          { key: 'name', label: 'name' },
          { key: 'price', label: 'price', type: 'number', min: 0, step: 0.01 },
          { key: 'cost', label: 'cost', type: 'number', min: 0, step: 0.01 },
          { key: 'minimum', label: 'minimum', type: 'number', min: 0, value: 0 },
        ],
      },
      () => void this.load('products'),
    );
  }
  movement() {
    this.dialogs.form(
      {
        title: 'stockMovement',
        path: 'movements',
        fields: [
          {
            key: 'productId',
            label: 'product',
            type: 'select',
            options: this.rows().map((p) => ({ value: p.id, label: p.sku + ' · ' + p.name })),
          },
          {
            key: 'type',
            label: 'type',
            type: 'select',
            options: ['RECEIPT', 'ISSUE', 'LOSS'].map((k) => ({ value: k, label: this.i.t(k) })),
            value: 'RECEIPT',
          },
          { key: 'quantity', label: 'quantity', type: 'number', min: 1, value: 1 },
          { key: 'reason', label: 'reason', type: 'textarea' },
        ],
      },
      () => void this.load('products'),
    );
  }
  conservation(p: Row) {
    this.dialogs.form(
      {
        title: 'conservation',
        path: 'products/' + p.id,
        method: 'PATCH',
        fields: [
          {
            key: 'conservation',
            label: 'conservation',
            type: 'select',
            value: p.conservation,
            options: ['GOOD', 'QUARANTINED', 'DAMAGED'].map((k) => ({
              value: k,
              label: this.i.t(k),
            })),
          },
        ],
      },
      () => void this.load('products'),
    );
  }
}
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <h1>{{ i.t('movements') }}</h1>
      <button mat-stroked-button (click)="load('movements')">{{ i.t('refresh') }}</button>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <section class="surface table-scroll">
      <table>
        <thead>
          <tr>
            <th>{{ i.t('date') }}</th>
            <th>{{ i.t('product') }}</th>
            <th>{{ i.t('type') }}</th>
            <th>{{ i.t('quantity') }}</th>
            <th>{{ i.t('reason') }}</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr>
              <td>{{ i.formatDate(row.createdAt) }}</td>
              <td>{{ names.get(row.productId ?? '') }}</td>
              <td>{{ i.t(row.type ?? '') }}</td>
              <td>{{ row.delta }}</td>
              <td>{{ row.reason }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="empty">{{ i.t('empty') }}</td>
            </tr>
          }
        </tbody>
      </table>
    </section>`,
})
export class MovementPage extends Page {
  readonly names = new Map<string, string>();
  constructor() {
    super();
    void this.init();
  }
  async init() {
    try {
      for (const p of await this.api.list('products')) this.names.set(p.id, p.name ?? p.id);
      await this.load('movements');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
