// RUTA EXACTA: src/app/logistics/domain/model/dispatch.entity.ts

import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Dispatch implements BaseEntity {
  #id: string;
  #driverName: string;
  #destination: string;
  #status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';

  constructor(props: { id: string; driverName: string; destination: string; status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' }) {
    this.#id = props.id;
    this.#driverName = props.driverName;
    this.#destination = props.destination;
    this.#status = props.status;
  }

  get id(): string { return this.#id; }
  get driverName(): string { return this.#driverName; }
  get destination(): string { return this.#destination; }
  get status(): 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' { return this.#status; }
}
