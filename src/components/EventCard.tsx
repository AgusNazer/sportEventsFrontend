import Link from "next/link";
import type { EventResponse } from "@/types";

const levelConfig: Record<string, { label: string; className: string }> = {
  PRINCIPIANTE: { label: "Principiante", className: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  INTERMEDIO:   { label: "Intermedio",   className: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  AVANZADO:     { label: "Avanzado",     className: "bg-red-500/10 text-red-600 border border-red-200" },
};

// Franja de color y estilo del tag según deporte
const sportConfig: Record<string, { gradient: string; tagClass: string }> = {
  running:  { gradient: "from-brand-500 to-brand-400",    tagClass: "bg-brand-50 text-brand-700" },
  crossfit: { gradient: "from-orange-500 to-amber-400",   tagClass: "bg-orange-50 text-orange-700" },
  triatlon: { gradient: "from-purple-500 to-violet-400",  tagClass: "bg-purple-50 text-purple-700" },
  natacion: { gradient: "from-cyan-500 to-sky-400",       tagClass: "bg-cyan-50 text-cyan-700" },
  duatlon:  { gradient: "from-emerald-500 to-green-400",  tagClass: "bg-emerald-50 text-emerald-700" },
  default:  { gradient: "from-gray-500 to-gray-400",      tagClass: "bg-gray-100 text-gray-700" },
};

function getSportConfig(sportName: string) {
  const key = sportName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return sportConfig[key] ?? sportConfig.default;
}

function getDaysUntil(fecha: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(fecha + "T00:00:00");
  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

interface Props {
  event: EventResponse;
}

export default function EventCard({ event }: Props) {
  const date = new Date(event.fecha + "T00:00:00");
  const day = date.toLocaleDateString("es-AR", { day: "numeric" });
  const month = date.toLocaleDateString("es-AR", { month: "short" }).toUpperCase().replace(".", "");
  const weekday = date.toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase().replace(".", "");

  const level = event.nivel ? levelConfig[event.nivel] : null;
  const sport = getSportConfig(event.sport);
  const daysUntil = getDaysUntil(event.fecha);

  const urgencyBadge =
    daysUntil === 0 ? { label: "Hoy", className: "bg-red-500 text-white" } :
    daysUntil === 1 ? { label: "Mañana", className: "bg-orange-500 text-white" } :
    daysUntil <= 7  ? { label: `En ${daysUntil} días`, className: "bg-amber-400 text-amber-900" } :
    null;

  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

        {/* Franja de color por deporte */}
        <div className={`h-1 w-full bg-gradient-to-r ${sport.gradient}`} />

        <div className="p-5">
          {/* Sport tag + nivel */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${sport.tagClass}`}>
              {event.sport}
            </span>
            <div className="flex items-center gap-1.5">
              {urgencyBadge && (
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${urgencyBadge.className}`}>
                  {urgencyBadge.label}
                </span>
              )}
              {level && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${level.className}`}>
                  {level.label}
                </span>
              )}
            </div>
          </div>

          {/* Nombre */}
          <h3 className="font-black text-gray-900 text-base leading-snug tracking-tight group-hover:text-brand-700 transition-colors mb-4 uppercase line-clamp-2">
            {event.nombre}
          </h3>

          {/* Fecha + lugar */}
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col items-center justify-center bg-dark-950 text-white rounded-xl px-3 py-2 min-w-[52px]">
              <span className="text-[10px] font-bold text-brand-400 tracking-widest">{weekday}</span>
              <span className="text-2xl font-black leading-none">{day}</span>
              <span className="text-[10px] font-semibold text-gray-400 tracking-wider">{month}</span>
            </div>

            <div className="flex flex-col justify-center gap-1.5 text-sm text-gray-600 min-w-0">
              <p className="flex items-center gap-1.5 truncate">
                <LocationIcon />
                <span className="truncate">{event.ciudad}, {event.provincia}</span>
              </p>
              {event.distancias && (
                <p className="flex items-center gap-1.5 truncate">
                  <RouteIcon />
                  <span className="truncate">{event.distancias}</span>
                </p>
              )}
            </div>
          </div>

          {/* Footer: precio */}
          {event.precio && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Precio</span>
              <span className="text-sm font-black text-gray-900">{event.precio}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  );
}
