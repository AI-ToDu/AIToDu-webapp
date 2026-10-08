import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styles: [`
    .login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 80vh; font-family: 'Segoe UI', sans-serif; }
    .login-card { background: white; padding: 48px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; width: 100%; max-width: 450px; text-align: center; }
    .form-group { margin-bottom: 20px; text-align: left; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 14px; }
    input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background-color: #f8fafc; }
    .btn-login { background-color: #0D9488; color: white; width: 100%; padding: 14px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 16px; transition: background-color 0.2s; }
    .btn-login:disabled { background-color: #94a3b8; cursor: not-allowed; }
    .login-link { margin-top: 24px; font-size: 14px; color: #64748b; }
    .login-link a { color: #0F172A; font-weight: bold; text-decoration: none; }
  `],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2 style="color: #0D9488; margin-top:0; font-size: 24px;">Crear Cuenta Nueva</h2>
        <p style="color: #64748b; margin-bottom: 32px;">Únete a la plataforma logística líder</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nombre de la Empresa</label>
            <input type="text" formControlName="company" placeholder="Mi Empresa S.A.C">
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" formControlName="email" placeholder="admin@miempresa.com">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password" placeholder="Mínimo 6 caracteres">
          </div>

          <button type="submit" class="btn-login" [disabled]="form.invalid">Registrarme Gratis</button>
        </form>

        <div class="login-link">
          ¿Ya tienes una cuenta? <a routerLink="/login">Inicia Sesión</a>
        </div>
      </div>
    </div>
  `
})
export class Register {
  #fb = inject(FormBuilder);
  #router = inject(Router);

  form = this.#fb.nonNullable.group({
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.valid) {
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      this.#router.navigate(['/login']).then();
    }
  }
}
