import { Component, signal } from '@angular/core';
import { Page, UI, State, options } from '../../shared/presentation/ui';
import { Row } from '../../shared/domain/models';
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <div>
        <span class="eyebrow">04 / {{ i.t('workspace') }}</span>
        <h1>{{ i.t('logistics') }}</h1>
      </div>
      <div class="actions">
        <button mat-stroked-button (click)="driver()">{{ i.t('newDriver') }}</button
        ><button mat-stroked-button (click)="vehicle()">{{ i.t('newVehicle') }}</button
        ><button
          mat-flat-button
          (click)="create()"
          [disabled]="!candidates().length || !drivers().length || !vehicles().length"
        >
          + {{ i.t('newDispatch') }}
        </button>
      </div>
    </header>
    <app-state [busy]="busy()" [error]="error()" />
    <div class="dispatch-board">
      @for (status of statuses; track status) {
        <section class="dispatch-column">
          <header>
            <h2>{{ i.t(status) }}</h2>
            <span>{{ byStatus(status).length }}</span>
          </header>
          @for (d of byStatus(status); track d.id) {
            <article class="dispatch-card">
              <span class="eyebrow">{{ d.number }}</span>
              <h3>{{ d.destination }}</h3>
              <dl>
                <div>
                  <dt>{{ i.t('driver') }}</dt>
                  <dd>{{ resourceName(d, 'driverId', drivers()) }}</dd>
                </div>
                <div>
                  <dt>{{ i.t('vehicle') }}</dt>
                  <dd>{{ resourceName(d, 'vehicleId', vehicles()) }}</dd>
                </div>
              </dl>
              <p class="muted">
                {{ i.t('quantity') }}: {{ quantity(d) }} · {{ i.t('incident') }}:
                {{ d.incidents?.length || 0 }}
              </p>
              @for (incident of d.incidents; track incident.id) {
                <p class="incident-note">{{ incident.description }}</p>
              }
              <div class="card-actions">
                @if (status === 'PENDING') {
                  <button mat-flat-button (click)="start(d)">{{ i.t('startRoute') }}</button>
                }
                @if (status === 'IN_TRANSIT') {
                  <button mat-flat-button (click)="deliver(d)">{{ i.t('deliver') }}</button>
                }
                <button mat-button (click)="incident(d)">{{ i.t('incident') }}</button>
              </div>
            </article>
          } @empty {
            <p class="empty muted">{{ i.t('empty') }}</p>
          }
        </section>
      }
    </div>`,
})
export class LogisticsPage extends Page {
  readonly statuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED'];
  readonly candidates = signal<Row[]>([]);
  readonly drivers = signal<Row[]>([]);
  readonly vehicles = signal<Row[]>([]);
  constructor() {
    super();
    void this.reload();
  }
  async reload() {
    try {
      const [c, d, v] = await Promise.all([
        this.api.list('dispatch-candidates'),
        this.api.list('drivers'),
        this.api.list('vehicles'),
      ]);
      this.candidates.set(c);
      this.drivers.set(d);
      this.vehicles.set(v);
      await this.load('dispatches');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  byStatus(status: string) {
    return this.rows().filter((r) => r.status === status);
  }
  quantity(d: Row) {
    return d.lines?.reduce((n, l) => n + (l.quantity ?? 0), 0) ?? 0;
  }
  resourceName(row: Row, key: string, resources: Row[]) {
    return resources.find((r) => r.id === (row as unknown as Record<string, string>)[key])?.name;
  }
  create() {
    this.dialogs.form(
      {
        title: 'newDispatch',
        path: 'dispatches',
        fields: [
          { key: 'saleId', label: 'sale', type: 'select', options: options(this.candidates()) },
          { key: 'driverId', label: 'driver', type: 'select', options: options(this.drivers()) },
          { key: 'vehicleId', label: 'vehicle', type: 'select', options: options(this.vehicles()) },
          { key: 'destination', label: 'destination', type: 'textarea' },
        ],
        payload: (v) => ({ ...v, saleIds: [v['saleId']] }),
      },
      () => void this.reload(),
    );
  }
  start(d: Row) {
    void this.run(
      'PATCH',
      `dispatches/${d.id}`,
      { status: 'IN_TRANSIT' },
      () => void this.reload(),
    );
  }
  deliver(d: Row) {
    this.dialogs.form(
      {
        title: 'deliver',
        path: `dispatches/${d.id}`,
        method: 'PATCH',
        fields: [{ key: 'recipient', label: 'recipient' }],
        payload: (v) => ({ ...v, status: 'DELIVERED' }),
      },
      () => void this.reload(),
    );
  }
  incident(d: Row) {
    this.dialogs.form(
      {
        title: 'incident',
        path: `dispatches/${d.id}/incidents`,
        fields: [{ key: 'description', label: 'description', type: 'textarea' }],
      },
      () => void this.reload(),
    );
  }
  driver() {
    this.dialogs.form(
      {
        title: 'newDriver',
        path: 'drivers',
        fields: [
          { key: 'name', label: 'name' },
          { key: 'license', label: 'license' },
        ],
      },
      () => void this.reload(),
    );
  }
  vehicle() {
    this.dialogs.form(
      {
        title: 'newVehicle',
        path: 'vehicles',
        fields: [
          { key: 'name', label: 'name' },
          { key: 'plate', label: 'plate' },
        ],
      },
      () => void this.reload(),
    );
  }
}
