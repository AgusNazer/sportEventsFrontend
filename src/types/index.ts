export type EventLevel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";
export type UserRole = "USER" | "ADMIN";

export interface Sport {
  id: string;
  nombre: string;
  slug: string;
}

export interface Location {
  id: string;
  ciudad: string;
  provincia: string;
  pais: string;
  lat?: number;
  lng?: number;
}

export interface EventResponse {
  id: string;
  nombre: string;
  slug: string;
  sport: string;
  ciudad: string;
  provincia: string;
  fecha: string;
  fechaLimiteInscripcion?: string;
  distancias?: string;
  precio?: string;
  nivel?: EventLevel;
  urlInscripcion?: string;
  activo: boolean;
}

export interface EventRequest {
  nombre: string;
  sportId: string;
  locationId: string;
  fecha: string;
  fechaLimiteInscripcion?: string;
  distancias?: string;
  precio?: string;
  nivel?: EventLevel;
  urlInscripcion?: string;
  fuente?: string;
}

export interface EventFilters {
  sport?: string;
  provincia?: string;
  nivel?: EventLevel;
  desde?: string;
  hasta?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombre: string
  rol: UserRole;
}