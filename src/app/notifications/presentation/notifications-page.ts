import { Component } from '@angular/core';
import { Page, UI, State } from '../../shared/presentation/ui';
import { Row } from '../../shared/domain/models';
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <h1>{{ i.t('notifications') }}</h1>
      <button mat-stroked-button (click)="load('notifications')">{{ i.t('refresh') }}</button>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <section class="surface notification-list">
      @for (n of rows(); track n.id) {
        <article>
          <div>
            <strong>{{ i.t(n.type ?? '') }}</strong>
            <p>{{ i.formatDate(n.createdAt) }}</p>
          </div>
          @if (!n.read) {
            <button mat-stroked-button (click)="read(n)">{{ i.t('read') }}</button>
          }
        </article>
      } @empty {
        <p class="empty">{{ i.t('empty') }}</p>
      }
    </section>`,
})
export class NotificationsPage extends Page {
  constructor() {
    super();
    void this.load('notifications');
  }
  read(n: Row) {
    void this.run(
      'PATCH',
      'notifications/' + n.id,
      { read: true },
      () => void this.load('notifications'),
    );
  }
}
