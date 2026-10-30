import { Component, Injectable, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Api } from '../infrastructure/api';
import { I18n } from '../application/i18n';
import { Field, Row, Option } from '../domain/models';
export const UI = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatProgressSpinnerModule,
];
export interface FormSpec {
  title: string;
  fields: Field[];
  path: string;
  method?: string;
  payload?: (value: Record<string, unknown>) => unknown;
}
@Component({
  standalone: true,
  imports: [...UI],
  template: `<h2 mat-dialog-title>{{ i.t(data.title) }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content
        ><div class="form-grid">
          @for (field of data.fields; track field.key) {
            <mat-form-field appearance="outline"
              ><mat-label>{{ i.t(field.label) }}</mat-label>
              @if (field.type === 'select') {
                <mat-select [formControlName]="field.key">
                  @for (option of field.options; track option.value) {
                    <mat-option [value]="option.value">{{ option.label }}</mat-option>
                  }
                </mat-select>
              } @else if (field.type === 'textarea') {
                <textarea matInput [formControlName]="field.key" rows="3"></textarea>
              } @else {
                <input
                  matInput
                  [type]="field.type || 'text'"
                  [formControlName]="field.key"
                  [attr.min]="field.min ?? null"
                  [attr.step]="field.step ?? null"
                  autocomplete="off"
                />
              }
              <mat-error>{{ i.t('required') }}</mat-error></mat-form-field
            >
          }
        </div>
        @if (error()) {
          <p class="error" role="alert">{{ i.t(error()) }}</p>
        }</mat-dialog-content
      ><mat-dialog-actions align="end"
        ><button mat-button type="button" (click)="ref.close()" [disabled]="pending()">
          {{ i.t('cancel') }}</button
        ><button mat-flat-button type="submit" [disabled]="form.invalid || pending()">
          {{ i.t(pending() ? 'loading' : 'save') }}
        </button></mat-dialog-actions
      >
    </form>`,
})
export class FormDialog {
  readonly data = inject<FormSpec>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<FormDialog>);
  readonly i = inject(I18n);
  private api = inject(Api);
  readonly error = signal('');
  readonly pending = signal(false);
  readonly form = new FormGroup(
    Object.fromEntries(
      this.data.fields.map((field) => [
        field.key,
        new FormControl(field.value ?? '', {
          nonNullable: true,
          validators: [
            ...(field.optional ? [] : [Validators.required]),
            ...(field.type === 'number' ? [Validators.min(field.min ?? 0)] : []),
            ...(field.type === 'email' ? [Validators.email] : []),
          ],
        }),
      ]),
    ),
  );
  async submit() {
    if (this.form.invalid || this.pending()) return;
    this.pending.set(true);
    this.error.set('');
    try {
      const value = this.form.getRawValue();
      const result = await this.api.request(
        this.data.method ?? 'POST',
        this.data.path,
        this.data.payload ? this.data.payload(value) : value,
      );
      this.ref.close(result);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.pending.set(false);
    }
  }
}
@Injectable({ providedIn: 'root' })
export class Dialogs {
  private dialog = inject(MatDialog);
  form(spec: FormSpec, reload: () => void) {
    this.dialog
      .open(FormDialog, {
        data: spec,
        width: '640px',
        maxWidth: 'calc(100vw - 24px)',
        autoFocus: 'first-tabbable',
        restoreFocus: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) reload();
      });
  }
}
export const options = (
  rows: Row[],
  label: (row: Row) => string = (r) => r.name ?? r.number ?? r.id,
): Option[] => rows.map((r) => ({ value: r.id, label: label(r) }));
export abstract class Page {
  readonly api = inject(Api);
  readonly i = inject(I18n);
  readonly dialogs = inject(Dialogs);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly rows = signal<Row[]>([]);
  async load(path: string) {
    this.busy.set(true);
    this.error.set('');
    try {
      this.rows.set(await this.api.list(path));
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }
  async run(method: string, path: string, body: unknown, reload: () => void) {
    this.error.set('');
    try {
      await this.api.request(method, path, body);
      reload();
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
@Component({
  selector: 'app-state',
  standalone: true,
  template: `@if (error) {
      <div class="error" role="alert">{{ i.t(error) }}</div>
    }
    @if (busy) {
      <p role="status">{{ i.t('loading') }}</p>
    }`,
  inputs: ['error', 'busy'],
})
export class State {
  readonly i = inject(I18n);
  error = '';
  busy = false;
}
