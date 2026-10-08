import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IamStore } from '../../application/iam.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styles: [`
    .login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 80vh; font-family: 'Segoe UI', sans-serif; }
    .login-card { background: white; padding: 48px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; width: 100%; max-width: 400px; text-align: center; }
    .form-group { margin-bottom: 24px; text-align: left; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 14px; }
    input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background-color: #f8fafc; }
    input:focus { outline: none; border-color: #0D9488; background-color: #fff; }
    .btn-login { background-color: #64748b; color: white; width: 100%; padding: 14px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 16px; transition: background-color 0.2s; }
    .btn-login:not(:disabled) { background-color: #0F172A; }
    .btn-login:not(:disabled):hover { background-color: #1e293b; }
    .register-link { margin-top: 24px; font-size: 14px; color: #64748b; }
    .register-link a { color: #0D9488; font-weight: bold; text-decoration: none; }
    .register-link a:hover { text-decoration: underline; }
  `],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2 style="color: #0D9488; margin-top:0; font-size: 28px;">AI-ToDu</h2>
        <p style="color: #64748b; margin-bottom: 32px;">Inicia sesión en tu espacio de trabajo</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" formControlName="email" placeholder="tu_correo@empresa.com">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password" placeholder="••••••••">
          </div>

          <button type="submit" class="btn-login" [disabled]="form.invalid">Ingresar al Sistema</button>
        </form>

        <div class="register-link">
          ¿No tienes una cuenta? <a routerLink="/register">Regístrate aquí</a>
        </div>
      </div>
    </div>
  `
})
export class Login {
  #fb = inject(FormBuilder);
  #store = inject(IamStore);
  #router = inject(Router);

  form = this.#fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.valid) {
      // Pasamos el correo real escrito por el usuario
      this.#store.login(this.form.getRawValue().email);
      this.#router.navigate(['/reporting/dashboard']).then();
    }
  }
}
