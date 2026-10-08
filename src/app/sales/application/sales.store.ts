import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalesStore {
  // Estado del carrito de compras interactivo
  readonly cart = signal<CartItem[]>([]);

  // Calcula automáticamente el total a pagar según lo que haya en el carrito
  readonly totalAmount = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  addToCart(id: string, name: string, price: number) {
    this.cart.update(items => {
      const existing = items.find(i => i.id === id);
      if (existing) {
        return items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { id, name, price, quantity: 1 }];
    });
  }

  updateQuantity(id: string, change: number) {
    this.cart.update(items => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + change };
        }
        return item;
      }).filter(item => item.quantity > 0); // Si llega a 0, se elimina del carrito
    });
  }

  clearCart() {
    this.cart.set([]);
  }

  processCheckout() {
    // Aquí en el futuro llamaremos a SalesApi.registerSale()
    console.log('Procesando pago por S/', this.totalAmount());
    this.clearCart();
  }
}
