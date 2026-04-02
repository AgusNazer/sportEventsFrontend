import type { EventFilters, EventRequest, EventResponse, Location, Sport } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
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
  if (filters?.sport) params.set("sport", filters.sport);
  if (filters?.provincia) params.set("provincia", filters.provincia);
  if (filters?.nivel) params.set("nivel", filters.nivel);
  if (filters?.desde) params.set("desde", filters.desde);
  if (filters?.hasta) params.set("hasta", filters.hasta);
  const qs = params.toString();
  return request<EventResponse[]>(`/api/events${qs ? `?${qs}` : ""}`);
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
