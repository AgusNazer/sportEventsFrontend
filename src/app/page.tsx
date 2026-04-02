import { Suspense } from "react";
import { getEvents } from "@/lib/api";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import type { EventFilters as Filters, EventLevel, EventResponse } from "@/types";

interface SearchParams {
  sport?: string;
  provincia?: string;
  nivel?: string;
  desde?: string;
  hasta?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters: Filters = {
    sport: params.sport,
    provincia: params.provincia,
    nivel: params.nivel as EventLevel | undefined,
    desde: params.desde,
    hasta: params.hasta,
  };

  let events: EventResponse[] = [];
  let error: string | null = null;

  try {
    events = await getEvents(filters);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar eventos";
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="bg-dark-950 hero-pattern">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <p className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Argentina
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Encontrá tu<br />
            <span className="text-brand-400">próximo evento</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg">
            Carreras, Crossfit, Triatlones, Ciclismo y más en toda Argentina. Un solo lugar para no perderte nada.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-dark-900 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Suspense>
            <EventFilters />
          </Suspense>
        </div>
      </section>

      {/* Eventos */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {error ? (
          <ErrorMessage message={error} />
        ) : events.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {events.length} evento{events.length !== 1 ? "s" : ""} encontrado{events.length !== 1 ? "s" : ""}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-red-700 font-bold uppercase tracking-wide text-sm">Sin conexión con el servidor</p>
      <p className="text-red-500 text-sm mt-1">{message}</p>
      <p className="text-gray-400 text-xs mt-3">
        Backend esperado en{" "}
        <code className="bg-red-100 px-1.5 py-0.5 rounded text-red-600">
          {process.env.NEXT_PUBLIC_API_BASE_URL}
        </code>
      </p>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
      <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Sin eventos</p>
      {hasFilters && (
        <p className="text-gray-400 text-sm mt-1">Probá ajustando los filtros</p>
      )}
    </div>
  );
}
