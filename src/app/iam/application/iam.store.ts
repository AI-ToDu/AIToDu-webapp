import { Injectable, signal } from '@angular/core';
import { User } from '../domain/model/user.entity';

@Injectable({
  providedIn: 'root',
})
export class IamStore {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  // Ahora recibe el email real y genera un nombre dinámico
  login(email: string) {
    // Extraemos la parte antes del @ para simular el nombre del usuario
    const namePart = email.split('@')[0];
    // Ponemos la primera letra en mayúscula
    const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const activeUser = new User({
      id: crypto.randomUUID(),
      email: email,
      fullName: fullName,
      role: 'ADMIN'
    });

    this.currentUser.set(activeUser);
    this.isAuthenticated.set(true);
    localStorage.setItem('token', 'fake-jwt-token-123');
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('token');
  }
}
