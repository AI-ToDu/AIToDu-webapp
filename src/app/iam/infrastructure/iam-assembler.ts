// RUTA EXACTA: src/app/iam/infrastructure/iam-assembler.ts

import { User } from '../domain/model/user.entity';
import { UserResource } from './iam-response';

export class IamAssembler {
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      email: resource.email,
      fullName: resource.fullName,
      role: resource.role
    });
  }
}
