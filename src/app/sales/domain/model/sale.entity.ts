import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Sale implements BaseEntity {
  #id: string;
  #customerName: string;
  #totalAmount: number;
  #date: Date;
  #status: string;

  constructor(props: { id: string; customerName: string; totalAmount: number; date: Date; status: string }) {
    this.#id = props.id;
    this.#customerName = props.customerName;
    this.#totalAmount = props.totalAmount;
    this.#date = props.date;
    this.#status = props.status;
  }

  // Getters para mantener la inmutabilidad de la entidad
  get id(): string { return this.#id; }
  get customerName(): string { return this.#customerName; }
  get totalAmount(): number { return this.#totalAmount; }
  get date(): Date { return this.#date; }
  get status(): string { return this.#status; }
}
