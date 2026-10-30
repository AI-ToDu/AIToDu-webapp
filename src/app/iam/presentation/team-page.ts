import { Component } from '@angular/core';
import { Page, UI, State } from '../../shared/presentation/ui';
@Component({
  standalone: true,
  imports: [...UI, State],
  template: `<header class="page-header">
      <h1>{{ i.t('team') }}</h1>
      <button mat-flat-button (click)="create()">+ {{ i.t('newEmployee') }}</button>
    </header>
    <p class="info-note">{{ i.t('activationNote') }}</p>
    <app-state [busy]="busy()" [error]="error()" />
    <section class="surface table-scroll">
      <table>
        <thead>
          <tr>
            <th>{{ i.t('fullName') }}</th>
            <th>{{ i.t('role') }}</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr>
              <td>
                <strong>{{ row.name }}</strong>
              </td>
              <td>
                <span class="badge">{{ i.t(row.role ?? '') }}</span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>`,
})
export class TeamPage extends Page {
  constructor() {
    super();
    void this.load('employees');
  }
  create() {
    this.dialogs.form(
      {
        title: 'newEmployee',
        path: 'employees',
        fields: [
          { key: 'name', label: 'fullName' },
          { key: 'email', label: 'email', type: 'email' },
          {
            key: 'role',
            label: 'role',
            type: 'select',
            options: ['WAREHOUSE', 'SALES', 'LOGISTICS'].map((k) => ({
              value: k,
              label: this.i.t(k),
            })),
          },
        ],
      },
      () => void this.load('employees'),
    );
  }
}
