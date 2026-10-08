// RUTA EXACTA: src/app/iam/domain/model/user.entity.ts

import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class User implements BaseEntity {
  #id: string;
  #email: string;
  #fullName: string;
  #role: string;

  constructor(props: { id: string; email: string; fullName: string; role: string }) {
    this.#id = props.id;
    this.#email = props.email;
    this.#fullName = props.fullName;
    this.#role = props.role;
  }

  // Getters para proteger la inmutabilidad de la entidad
  get id(): string { return this.#id; }
  get email(): string { return this.#email; }
  get fullName(): string { return this.#fullName; }
  get role(): string { return this.#role; }
}
