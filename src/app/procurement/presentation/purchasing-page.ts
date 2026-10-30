import { Component, signal } from '@angular/core';
import { Page, UI, State, options } from '../../shared/presentation/ui';
import { Row } from '../../shared/domain/models';
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <div>
        <span class="eyebrow">02 / {{ i.t('workspace') }}</span>
        <h1>{{ i.t('purchases') }}</h1>
      </div>
      <div class="actions">
        <button mat-stroked-button (click)="supplier()">{{ i.t('newSupplier') }}</button
        ><button
          mat-flat-button
          (click)="purchase()"
          [disabled]="!products().length || !suppliers().length"
        >
          + {{ i.t('newPurchase') }}
        </button>
      </div>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <section class="surface table-scroll">
      <table>
        <thead>
          <tr>
            <th>{{ i.t('order') }}</th>
            <th>{{ i.t('supplier') }}</th>
            <th>{{ i.t('product') }}</th>
            <th>{{ i.t('received') }} / {{ i.t('ordered') }}</th>
            <th>{{ i.t('status') }}</th>
            <th>{{ i.t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          @for (order of rows(); track order.id) {
            <tr>
              <td>
                <strong>{{ order.number }}</strong
                ><small>{{ i.formatDate(order.createdAt) }}</small>
              </td>
              <td>{{ supplierName(order) }}</td>
              <td>
                @for (line of order.lines; track line.id) {
                  <div>{{ productName(line.productId) }}</div>
                }
              </td>
              <td>
                @for (line of order.lines; track line.id) {
                  <div>{{ line.received }} / {{ line.quantity }}</div>
                }
              </td>
              <td>
                <span class="badge" [class.warn]="order.status !== 'RECEIVED'">{{
                  i.t(order.status ?? '')
                }}</span>
              </td>
              <td>
                @if (order.status !== 'RECEIVED') {
                  <button mat-button (click)="receive(order)">{{ i.t('receive') }}</button>
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="empty">{{ i.t('emptyHint') }}</td>
            </tr>
          }
        </tbody>
      </table>
    </section>`,
})
export class PurchasingPage extends Page {
  readonly products = signal<Row[]>([]);
  readonly suppliers = signal<Row[]>([]);
  constructor() {
    super();
    void this.reload();
  }
  async reload() {
    this.error.set('');
    try {
      const [p, s] = await Promise.all([this.api.list('products'), this.api.list('suppliers')]);
      this.products.set(p);
      this.suppliers.set(s);
      await this.load('purchases');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  supplierName(o: Row) {
    return this.suppliers().find((s) => s.id === (o as Row & { supplierId: string }).supplierId)
      ?.name;
  }
  productName(id: string | undefined) {
    return this.products().find((p) => p.id === id)?.name;
  }
  supplier() {
    this.dialogs.form(
      {
        title: 'newSupplier',
        path: 'suppliers',
        fields: [
          { key: 'name', label: 'name' },
          { key: 'contact', label: 'contact' },
        ],
      },
      () => void this.reload(),
    );
  }
  purchase() {
    this.dialogs.form(
      {
        title: 'newPurchase',
        path: 'purchases',
        fields: [
          {
            key: 'supplierId',
            label: 'supplier',
            type: 'select',
            options: options(this.suppliers()),
          },
          { key: 'productId', label: 'product', type: 'select', options: options(this.products()) },
          { key: 'quantity', label: 'quantity', type: 'number', min: 1, value: 1 },
        ],
        payload: (v) => ({
          supplierId: v['supplierId'],
          lines: [{ productId: v['productId'], quantity: v['quantity'] }],
        }),
      },
      () => void this.reload(),
    );
  }
  receive(order: Row) {
    const lines = (order.lines ?? []).filter((l) => (l.received ?? 0) < (l.quantity ?? 0));
    this.dialogs.form(
      {
        title: 'receive',
        path: `purchases/${order.id}/receipts`,
        fields: [
          {
            key: 'lineId',
            label: 'product',
            type: 'select',
            options: options(lines, (l) => this.productName(l.productId) ?? l.id),
            value: lines[0]?.id,
          },
          { key: 'quantity', label: 'quantity', type: 'number', min: 1, value: 1 },
        ],
        payload: (v) => ({ lines: [{ lineId: v['lineId'], quantity: v['quantity'] }] }),
      },
      () => void this.reload(),
    );
  }
}
