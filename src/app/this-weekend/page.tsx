import { getThisWeekendEvents } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import type { EventResponse } from "@/types";

export default async function ThisWeekendPage() {
  let events: EventResponse[] = [];
  let error: string | null = null;

  try {
    events = await getThisWeekendEvents();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar eventos";
  }

  const now = new Date();
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  const weekendLabel = `${saturday.toLocaleDateString("es-AR", { day: "numeric", month: "long" })} y ${sunday.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title mb-1">Este fin de semana</h1>
        <p className="text-gray-500 text-sm">{weekendLabel}</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700 font-medium">No se pudo conectar con el servidor</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 font-medium">No hay eventos este fin de semana</p>
          <Link href="/" className="text-brand-600 hover:underline text-sm mt-2 inline-block">
            Ver todos los eventos
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {events.length} evento{events.length !== 1 ? "s" : ""} este fin de semana
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
