import type { EventFilters, EventRequest, EventResponse, Location, Sport } from "@/types";
import type { AuthResponse, LoginRequest, RegisterRequest, FavoriteResponse } from "@/types";

const BASE_URL = typeof window !== "undefined"
  ? ""
  : process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${error}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Events ---

export function getEvents(filters?: EventFilters): Promise<EventResponse[]> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.sport?.trim()) params.set("sport", filters.sport);
    if (filters.provincia?.trim()) params.set("provincia", filters.provincia);
    if (filters.nivel?.trim()) params.set("nivel", filters.nivel);
    if (filters.desde?.trim()) params.set("desde", filters.desde);
    if (filters.hasta?.trim()) params.set("hasta", filters.hasta);
  }

  const queryString = params.toString();
  const path = `/api/events${queryString ? `?${queryString}` : ""}`;
  return request<EventResponse[]>(path);
}

export function getThisWeekendEvents(): Promise<EventResponse[]> {
  return request<EventResponse[]>("/api/events/this-weekend");
}

export function getEventBySlug(slug: string): Promise<EventResponse> {
  return request<EventResponse>(`/api/events/slug/${slug}`);
}

export function getEventById(id: string): Promise<EventResponse> {
  return request<EventResponse>(`/api/events/${id}`);
}

export function createEvent(data: EventRequest): Promise<EventResponse> {
  return request<EventResponse>("/api/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteEvent(id: string): Promise<void> {
  return request<void>(`/api/events/${id}`, { method: "DELETE" });
}

// --- Sports ---

export function getSports(): Promise<Sport[]> {
  return request<Sport[]>("/api/sports");
}

export function getSportById(id: string): Promise<Sport> {
  return request<Sport>(`/api/sports/${id}`);
}

export function createSport(data: { nombre: string; slug: string }): Promise<Sport> {
  return request<Sport>("/api/sports", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Auth ---

export function login(data: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMe(): Promise<AuthResponse | null> {
  return request<AuthResponse>("/api/auth/me").catch(() => null);
}

export async function logoutApi(): Promise<void> {
  // return request<void>("/api/auth/logout", { method: "POST" });
  try {
    await request<void>("/api/auth/logout", { method: "POST" });
  } catch {
    // ignorar error, igual limpiamos el estado
  }
}

// --- Favorites ---

export function getFavorites(): Promise<FavoriteResponse[]> {
  return request<FavoriteResponse[]>("/api/favorites");
}

export function addFavorite(eventId: string): Promise<void> {
  return request<void>(`/api/favorites/${eventId}`, {
    method: "POST",
  });
}

export function removeFavorite(eventId: string): Promise<void> {
  return request<void>(`/api/favorites/${eventId}`, {
    method: "DELETE",
  });
}

export function isFavorite(eventId: string): Promise<boolean> {
  return request<boolean>(`/api/favorites/${eventId}/check`);
}

