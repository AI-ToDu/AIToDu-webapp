// RUTA EXACTA: src/app/shared/application/i18n.store.ts
import { Injectable, signal, computed } from '@angular/core';

const DICTIONARIES = {
  ES: {
    layout: { dashboard: 'Dashboard', inventory: 'Inventario', pos: 'Caja / Ventas', dispatches: 'Despachos', logout: 'Cerrar Sesión' }
  },
  EN: {
    layout: { dashboard: 'Dashboard', inventory: 'Inventory', pos: 'POS / Sales', dispatches: 'Dispatches', logout: 'Log Out' }
  }
};

@Injectable({
  providedIn: 'root',
})
export class I18nStore {
  readonly currentLang = signal<'ES' | 'EN'>('ES');

  // Computed que devuelve el diccionario activo en tiempo real
  readonly t = computed(() => DICTIONARIES[this.currentLang()]);

  toggleLanguage() {
    this.currentLang.update(lang => lang === 'ES' ? 'EN' : 'ES');
  }
}
