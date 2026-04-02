import { Suspense } from "react";
import { getEvents, getSports } from "@/lib/api";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import Pagination from "@/components/Pagination";
import type { EventFilters as Filters, EventLevel, EventResponse, Sport } from "@/types";

const PAGE_SIZE = 12;

interface SearchParams {
  sport?: string;
  provincia?: string;
  nivel?: string;
  desde?: string;
  hasta?: string;
  page?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const filters: Filters = {
    sport: params.sport,
    provincia: params.provincia,
    nivel: params.nivel as EventLevel | undefined,
    desde: params.desde,
    hasta: params.hasta,
  };

  let allEvents: EventResponse[] = [];
  let sports: Sport[] = [];
  let error: string | null = null;

  try {
    [allEvents, sports] = await Promise.all([getEvents(filters), getSports()]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar eventos";
  }

  const totalItems = allEvents.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const events = allEvents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
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
          <p className="text-gray-400 text-base max-w-lg mb-6">
            Carreras, Crossfit, Triatlones, Ciclismo y más en toda Argentina.
          </p>

          {/* Stats rápidas */}
          {!error && totalItems > 0 && (
            <div className="flex flex-wrap gap-3">
              <StatPill value={totalItems} label="eventos" />
              {sports.slice(0, 4).map((s) => {
                const count = allEvents.filter((e) => e.sport.toLowerCase() === s.nombre.toLowerCase()).length;
                return count > 0 ? <StatPill key={s.id} value={count} label={s.nombre} /> : null;
              })}
            </div>
          )}
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-dark-900 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Suspense>
            <EventFilters sports={sports} />
          </Suspense>
        </div>
      </section>

      {/* Eventos */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {error ? (
          <ErrorMessage message={error} />
        ) : allEvents.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 shrink-0">
                {totalItems} evento{totalItems !== 1 ? "s" : ""}
                {hasFilters && " encontrados"}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
              {totalPages > 1 && (
                <span className="text-xs text-gray-400 shrink-0">
                  Página {safePage} de {totalPages}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <Suspense>
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
              />
            </Suspense>
          </>
        )}
      </div>
    </>
  );
}

function StatPill({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
      <span className="text-white font-black text-sm">{value}</span>
      <span className="text-gray-400 text-xs uppercase tracking-wide">{label}</span>
    </div>
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
