import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '../../shared/presentation/ui';
import { I18n } from '../../shared/application/i18n';
import { Api, Session } from '../../shared/infrastructure/api';
@Component({
  standalone: true,
  imports: [...UI, RouterLink],
  template: `<div class="auth-layout">
    <section class="auth-story">
      <a class="wordmark" href="https://ai-todu.github.io/ai-todu-platform/">AI<span>ToDu</span></a
      ><span class="eyebrow">{{ i.t('workspace') }}</span>
      <h1>{{ i.t('welcome') }}</h1>
      <p>{{ i.t('welcomeText') }}</p>
      <div class="auth-flow">
        <span>01 · {{ i.t('inventory') }}</span
        ><span>02 · {{ i.t('sales') }}</span
        ><span>03 · {{ i.t('logistics') }}</span>
      </div>
    </section>
    <section class="auth-panel">
      <div class="auth-card">
        <span class="eyebrow">{{ i.t('demoAccess') }}</span>
        <h2>{{ i.t(register ? 'register' : 'login') }}</h2>
        <p>{{ i.t('demoNote') }}</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          @if (register) {
            <mat-form-field appearance="outline"
              ><mat-label>{{ i.t('fullName') }}</mat-label
              ><input matInput formControlName="name" autocomplete="name" /></mat-form-field
            ><mat-form-field appearance="outline"
              ><mat-label>{{ i.t('company') }}</mat-label
              ><input matInput formControlName="company" autocomplete="organization"
            /></mat-form-field>
          }
          <mat-form-field appearance="outline"
            ><mat-label>{{ i.t('email') }}</mat-label
            ><input
              matInput
              type="email"
              formControlName="email"
              autocomplete="username" /></mat-form-field
          ><mat-form-field appearance="outline"
            ><mat-label>{{ i.t('password') }}</mat-label
            ><input
              matInput
              type="password"
              formControlName="password"
              [autocomplete]="register ? 'new-password' : 'current-password'"
            /><mat-hint>{{ register ? i.t('passwordHint') : '' }}</mat-hint></mat-form-field
          >
          @if (error()) {
            <p class="error" role="alert">{{ i.t(error()) }}</p>
          }
          <button mat-flat-button [disabled]="form.invalid || pending()">
            {{ i.t(pending() ? 'loading' : register ? 'register' : 'login') }}
          </button>
        </form>
        @if (!register) {
          <div class="demo-login">
            <strong>{{ i.t('demoAccess') }}</strong
            ><code>{{demoEmail}}</code><code>DemoOnly2026!</code>
          </div>
        }
        <p class="auth-switch">
          {{ i.t(register ? 'hasAccount' : 'noAccount') }}
          <a [routerLink]="register ? '/login' : '/register'">{{
            i.t(register ? 'login' : 'register')
          }}</a>
        </p>
      </div>
    </section>
  </div>`,
})
export class AuthPage {
 readonly demoEmail=new URLSearchParams(location.search).get('role')==='warehouse'?'warehouse@demo.ai-todu.test':'admin@demo.ai-todu.test';
  readonly i = inject(I18n);
  private api = inject(Api);
  private session = inject(Session);
  private router = inject(Router);
  readonly register = inject(ActivatedRoute).snapshot.data['register'] === true;
  readonly error = signal('');
  readonly pending = signal(false);
  readonly form = inject(FormBuilder).nonNullable.group({
    name: [''],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  constructor() {
    if (this.register) {
      this.form.controls.name.addValidators(Validators.required);
      this.form.controls.company.addValidators(Validators.required);
    }
  }
  async submit() {
    if (this.form.invalid || this.pending()) return;
    this.pending.set(true);
    this.error.set('');
    try {
      const v = this.form.getRawValue();
      if (this.register) await this.api.request('POST', 'auth/register', v);
      await this.session.login(v.email, v.password);
      await this.router.navigate(['/' + this.session.firstRoute()]);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.pending.set(false);
    }
  }
}
