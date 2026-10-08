// RUTA EXACTA: src/app/inventory/presentation/views/product-form.ts

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryStore } from '../../application/inventory.store';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  styles: [`
    .form-container { padding: 32px; max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; }
    .card { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .form-group { margin-bottom: 24px; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; }
    input, select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
    .btn-save { background-color: #0D9488; color: white; padding: 12px 32px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .btn-cancel { background-color: transparent; color: #64748b; padding: 12px 32px; border: none; font-weight: bold; cursor: pointer; margin-right: 16px; }
  `],
  template: `
    <div class="form-container">
      <h2 style="color: #0F172A; margin-top: 0;">Registrar Nuevo Producto</h2>
      <p style="color: #64748b; margin-bottom: 24px;">Ingresa los datos de la mercadería para darla de alta en el almacén.</p>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSave()">
          <div class="grid-2">
            <div class="form-group">
              <label>Código SKU</label>
              <input type="text" formControlName="sku" placeholder="Ej. ALIM-001">
            </div>
            <div class="form-group">
              <label>Nombre del Producto</label>
              <input type="text" formControlName="name" placeholder="Ej. Tomates Empacados">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label>Cantidad Inicial (Stock)</label>
              <input type="number" formControlName="quantity" min="0">
            </div>
            <div class="form-group">
              <label>Estado de Conservación</label>
              <select formControlName="status">
                <option value="GOOD">Óptimo (Bueno)</option>
                <option value="WARNING">Por Vencer</option>
                <option value="DAMAGED">Dañado (Merma)</option>
              </select>
            </div>
          </div>

          <div style="text-align: right; margin-top: 16px;">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar Producto</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductForm {
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #store = inject(InventoryStore);

  form = this.#fb.nonNullable.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    status: ['GOOD', Validators.required]
  });

  onSave() {
    if (this.form.valid) {
      this.#store.addItem(this.form.getRawValue());
      this.#router.navigate(['/inventory/products']).then();
    }
  }

  onCancel() {
    this.#router.navigate(['/inventory/products']).then();
  }
}
