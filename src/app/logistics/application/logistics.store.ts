import { Injectable, signal } from '@angular/core';
import { Dispatch } from '../domain/model/dispatch.entity';

@Injectable({
  providedIn: 'root',
})
export class LogisticsStore {
  readonly activeDispatches = signal<Dispatch[]>([
    new Dispatch({ id: '1', driverName: 'Roberto Gómez', destination: 'Av. Javier Prado 1234', status: 'IN_TRANSIT' }),
    new Dispatch({ id: '2', driverName: 'Carlos Ruiz', destination: 'Mercado Central, Stand 45', status: 'PENDING' }),
    new Dispatch({ id: '3', driverName: 'Ana María López', destination: 'Plaza San Miguel', status: 'DELIVERED' })
  ]);

  // NUEVA FUNCIÓN: Agregar un nuevo despacho a la columna "Por Asignar"
  addDispatch(driverName: string, destination: string) {
    const newDispatch = new Dispatch({
      id: crypto.randomUUID(),
      driverName,
      destination,
      status: 'PENDING'
    });
    this.activeDispatches.update(dispatches => [...dispatches, newDispatch]);
  }

  assignVehicle(id: string) {
    this.activeDispatches.update(dispatches =>
      dispatches.map(d => d.id === id ? new Dispatch({
        id: d.id, driverName: d.driverName, destination: d.destination, status: 'IN_TRANSIT'
      }) : d)
    );
  }

  markAsDelivered(id: string) {
    this.activeDispatches.update(dispatches =>
      dispatches.map(d => d.id === id ? new Dispatch({
        id: d.id, driverName: d.driverName, destination: d.destination, status: 'DELIVERED'
      }) : d)
    );
  }
}
