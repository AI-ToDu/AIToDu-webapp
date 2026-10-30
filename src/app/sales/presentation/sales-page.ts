import { Component, inject, signal, computed } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Page, UI, State } from '../../shared/presentation/ui';
import { I18n } from '../../shared/application/i18n';
import { Row } from '../../shared/domain/models';
interface CartLine {
  product: Row;
  quantity: number;
}
@Component({
  standalone: true,
  imports: [...UI],
  template: `<h2 mat-dialog-title>{{ i.t('receiptTitle') }}</h2>
    <mat-dialog-content class="receipt"
      ><p>
        <strong>{{ sale.receipt?.number }}</strong>
      </p>
      <p>{{ i.formatDate(sale.createdAt) }}</p>
      @for (line of sale.lines; track line.id) {
        <p class="receipt-line">
          <span>{{ line.quantity }} × {{ line.name }}</span
          ><strong>{{ i.formatMoney((line.price ?? 0) * (line.quantity ?? 0)) }}</strong>
        </p>
      }
      <hr />
      <p class="receipt-line">
        <strong>{{ i.t('total') }}</strong
        ><strong>{{ i.formatMoney(sale.total ?? 0) }}</strong>
      </p>
      <p>{{ i.t('demoNote') }}</p></mat-dialog-content
    ><mat-dialog-actions align="end"
      ><button mat-button mat-dialog-close>{{ i.t('close') }}</button
      ><button mat-flat-button (click)="print()">{{ i.t('print') }}</button></mat-dialog-actions
    >`,
})
export class ReceiptDialog {
  readonly sale = inject<Row>(MAT_DIALOG_DATA);
  readonly i = inject(I18n);
  print() {
    window.print();
  }
}
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <div>
        <span class="eyebrow">03 / {{ i.t('workspace') }}</span>
        <h1>{{ i.t('sales') }}</h1>
      </div>
      <button mat-stroked-button (click)="reload()">{{ i.t('refresh') }}</button>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <div class="sales-layout">
      <section class="surface">
        <div class="section-toolbar">
          <h2>{{ i.t('product') }}</h2>
        </div>
        <div class="product-grid">
          @for (p of products(); track p.id) {
            <button
              class="product-card"
              (click)="add(p)"
              [disabled]="!p.quantity || p.conservation !== 'GOOD'"
            >
              <code>{{ p.sku }}</code
              ><strong>{{ p.name }}</strong
              ><span class="product-bottom"
                ><span>{{ i.formatMoney(p.price ?? 0) }}</span
                ><span>{{ i.t('stock') }}: {{ p.quantity }}</span></span
              >
            </button>
          }
        </div>
      </section>
      <section class="surface cart-panel">
        <h2>{{ i.t('cart') }}</h2>
        @for (line of cart(); track line.product.id) {
          <div class="cart-line">
            <strong>{{ line.product.name }}</strong>
            <div class="quantity-control">
              <button
                mat-icon-button
                (click)="change(line.product.id, -1)"
                [attr.aria-label]="i.t('quantity') + ' − ' + line.product.name"
              >
                −</button
              ><span>{{ line.quantity }}</span
              ><button
                mat-icon-button
                (click)="change(line.product.id, 1)"
                [disabled]="line.quantity >= (line.product.quantity ?? 0)"
                [attr.aria-label]="i.t('quantity') + ' + ' + line.product.name"
              >
                +</button
              ><b>{{ i.formatMoney((line.product.price ?? 0) * line.quantity) }}</b>
            </div>
          </div>
        } @empty {
          <p class="muted empty">{{ i.t('empty') }}</p>
        }
        <div class="cart-total">
          <span>{{ i.t('total') }}</span
          ><strong>{{ i.formatMoney(total()) }}</strong>
        </div>
        <button mat-flat-button (click)="checkout()" [disabled]="!cart().length || submitting()">
          {{ i.t('checkout') }}
        </button>
      </section>
    </div>
    <section class="surface history">
      <div class="section-toolbar">
        <h2>{{ i.t('history') }}</h2>
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{{ i.t('sale') }}</th>
              <th>{{ i.t('date') }}</th>
              <th>{{ i.t('total') }}</th>
              <th>{{ i.t('status') }}</th>
              <th>{{ i.t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (s of rows(); track s.id) {
              <tr>
                <td>
                  <strong>{{ s.number }}</strong>
                </td>
                <td>{{ i.formatDate(s.createdAt) }}</td>
                <td>{{ i.formatMoney(s.total ?? 0) }}</td>
                <td>
                  <span class="badge" [class.warn]="s.status === 'CANCELLED'">{{
                    i.t(s.status ?? '')
                  }}</span>
                </td>
                <td>
                  <button mat-button (click)="receipt(s)">{{ i.t('receiptTitle') }}</button>
                  @if (s.status === 'CONFIRMED') {
                    <button mat-button (click)="cancel(s)">{{ i.t('cancelSale') }}</button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="empty">{{ i.t('emptyHint') }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>`,
})
export class SalesPage extends Page {
  private dialog = inject(MatDialog);
  readonly products = signal<Row[]>([]);
  readonly cart = signal<CartLine[]>([]);
  readonly submitting = signal(false);
  readonly total = computed(
    () =>
      this.cart().reduce((n, l) => n + Math.round((l.product.price ?? 0) * 100) * l.quantity, 0) /
      100,
  );
  constructor() {
    super();
    void this.reload();
  }
  async reload() {
    try {
      this.products.set(await this.api.list('products'));
      await this.load('sales');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  add(p: Row) {
    const existing = this.cart().find((l) => l.product.id === p.id);
    if ((existing?.quantity ?? 0) >= (p.quantity ?? 0)) return;
    if (existing) this.change(p.id, 1);
    else this.cart.update((lines) => [...lines, { product: p, quantity: 1 }]);
  }
  change(id: string, delta: number) {
    this.cart.update((lines) =>
      lines
        .map((l) =>
          l.product.id === id
            ? { ...l, quantity: Math.min(l.quantity + delta, l.product.quantity ?? 0) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }
  async checkout() {
    if (!this.cart().length || this.submitting()) return;
    this.submitting.set(true);
    this.error.set('');
    try {
      const sale = await this.api.request<Row>('POST', 'sales', {
        lines: this.cart().map((l) => ({ productId: l.product.id, quantity: l.quantity })),
      });
      this.cart.set([]);
      await this.reload();
      const result = this.rows().find((s) => s.id === sale.id);
      if (result) this.receipt(result);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.submitting.set(false);
    }
  }
  receipt(s: Row) {
    this.dialog.open(ReceiptDialog, { data: s, width: '560px', maxWidth: 'calc(100vw - 24px)' });
  }
  cancel(s: Row) {
    this.dialogs.form(
      {
        title: 'cancelSale',
        path: `sales/${s.id}/cancel`,
        fields: [{ key: 'reason', label: 'reason', type: 'textarea' }],
      },
      () => void this.reload(),
    );
  }
}
