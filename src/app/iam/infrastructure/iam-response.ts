// RUTA EXACTA: src/app/iam/infrastructure/iam-response.ts

export interface UserResource {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginResponse {
  user: UserResource;
  token: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}
