"use client";

import { useEffect, useState } from "react";
import { createEvent, createSport, deleteEvent, getEvents, getSports } from "@/lib/api";
import type { EventLevel, EventResponse, Sport } from "@/types";

type Tab = "events" | "create-event" | "create-sport";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("events");

  return (
    <div className="page-container">
      <h1 className="page-title mb-6">Panel de administracion</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {(
          [
            { id: "events", label: "Eventos" },
            { id: "create-event", label: "Crear evento" },
            { id: "create-sport", label: "Crear deporte" },
          ] as { id: Tab; label: string }[]
        ).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "events" && <EventsList />}
      {tab === "create-event" && <CreateEventForm onSuccess={() => setTab("events")} />}
      {tab === "create-sport" && <CreateSportForm onSuccess={() => setTab("events")} />}
    </div>
  );
}

// ---- Events list with delete ----

function EventsList() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setEvents(await getEvents());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`Eliminar "${nombre}"?`)) return;
    try {
      setDeleting(id);
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <AlertError message={error} />;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Todos los eventos ({events.length})</h2>
        <button onClick={load} className="btn-secondary text-sm">
          Actualizar
        </button>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No hay eventos cargados aun.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Nombre</th>
                <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Deporte</th>
                <th className="pb-3 pr-4 font-medium hidden md:table-cell">Ubicacion</th>
                <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Fecha</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900 truncate max-w-[200px]">
                      {event.nombre}
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell text-gray-600">
                    {event.sport}
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell text-gray-600">
                    {event.ciudad}, {event.provincia}
                  </td>
                  <td className="py-3 pr-4 hidden lg:table-cell text-gray-600">
                    {event.fecha}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(event.id, event.nombre)}
                      disabled={deleting === event.id}
                      className="btn-danger text-xs py-1 px-3"
                    >
                      {deleting === event.id ? "..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- Create event form ----

interface CreateEventFormProps {
  onSuccess: () => void;
}

function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    sportId: "",
    locationId: "",
    fecha: "",
    fechaLimiteInscripcion: "",
    distancias: "",
    precio: "",
    nivel: "" as EventLevel | "",
    urlInscripcion: "",
    fuente: "manual",
  });

  useEffect(() => {
    getSports()
      .then(setSports)
      .catch(() => setSports([]));
  }, []);

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await createEvent({
        nombre: form.nombre,
        sportId: form.sportId,
        locationId: form.locationId,
        fecha: form.fecha,
        fechaLimiteInscripcion: form.fechaLimiteInscripcion || undefined,
        distancias: form.distancias || undefined,
        precio: form.precio || undefined,
        nivel: (form.nivel as EventLevel) || undefined,
        urlInscripcion: form.urlInscripcion || undefined,
        fuente: form.fuente || undefined,
      });
      setFeedback({ type: "success", message: "Evento creado correctamente." });
      setTimeout(onSuccess, 1500);
    } catch (e) {
      setFeedback({
        type: "error",
        message: e instanceof Error ? e.message : "Error al crear evento",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card max-w-2xl">
      <h2 className="section-title mb-5">Nuevo evento</h2>

      {feedback && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="label">Nombre *</label>
          <input
            className="input-field"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Maratón Buenos Aires 2025"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Deporte *</label>
            <select
              className="input-select"
              value={form.sportId}
              onChange={(e) => handleChange("sportId", e.target.value)}
              required
            >
              <option value="">Seleccionar deporte</option>
              {sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">ID de Ubicacion *</label>
            <input
              className="input-field"
              value={form.locationId}
              onChange={(e) => handleChange("locationId", e.target.value)}
              placeholder="UUID de la ubicacion"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Las ubicaciones se gestionan directamente en la base de datos por ahora.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Fecha del evento *</label>
            <input
              type="date"
              className="input-field"
              value={form.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Limite de inscripcion</label>
            <input
              type="date"
              className="input-field"
              value={form.fechaLimiteInscripcion}
              onChange={(e) => handleChange("fechaLimiteInscripcion", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Distancias</label>
            <input
              className="input-field"
              value={form.distancias}
              onChange={(e) => handleChange("distancias", e.target.value)}
              placeholder="5km, 10km, 21km"
            />
          </div>

          <div className="form-group">
            <label className="label">Precio</label>
            <input
              className="input-field"
              value={form.precio}
              onChange={(e) => handleChange("precio", e.target.value)}
              placeholder="Gratis / $5.000 / $3.000 - $8.000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Nivel</label>
            <select
              className="input-select"
              value={form.nivel}
              onChange={(e) => handleChange("nivel", e.target.value)}
            >
              <option value="">Sin especificar</option>
              <option value="PRINCIPIANTE">Principiante</option>
              <option value="INTERMEDIO">Intermedio</option>
              <option value="AVANZADO">Avanzado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Fuente</label>
            <select
              className="input-select"
              value={form.fuente}
              onChange={(e) => handleChange("fuente", e.target.value)}
            >
              <option value="manual">Manual</option>
              <option value="organizer">Organizador</option>
              <option value="scraper">Scraper</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">URL de inscripcion</label>
          <input
            type="url"
            className="input-field"
            value={form.urlInscripcion}
            onChange={(e) => handleChange("urlInscripcion", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creando..." : "Crear evento"}
          </button>
          <button type="button" onClick={onSuccess} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- Create sport form ----

interface CreateSportFormProps {
  onSuccess: () => void;
}

function CreateSportForm({ onSuccess }: CreateSportFormProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({ nombre: "", slug: "" });

  function handleNombreChange(value: string) {
    const slug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setForm({ nombre: value, slug });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await createSport({ nombre: form.nombre, slug: form.slug });
      setFeedback({ type: "success", message: "Deporte creado correctamente." });
      setForm({ nombre: "", slug: "" });
      setTimeout(onSuccess, 1500);
    } catch (e) {
      setFeedback({
        type: "error",
        message: e instanceof Error ? e.message : "Error al crear deporte",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card max-w-md">
      <h2 className="section-title mb-5">Nuevo deporte</h2>

      {feedback && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="label">Nombre *</label>
          <input
            className="input-field"
            value={form.nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
            placeholder="Running"
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Slug *</label>
          <input
            className="input-field"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="running"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Se genera automaticamente desde el nombre. Debe ser unico.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creando..." : "Crear deporte"}
          </button>
          <button type="button" onClick={onSuccess} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- Helpers ----

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AlertError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <p className="text-red-700 font-medium">Error</p>
      <p className="text-red-500 text-sm mt-1">{message}</p>
    </div>
  );
}
