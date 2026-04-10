"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/api";
import { useAuthContext } from "@/lib/AuthContext";
import type { EventResponse } from "@/types";

const levelConfig: Record<string, { label: string; className: string }> = {
  PRINCIPIANTE: { label: "Principiante", className: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  INTERMEDIO:   { label: "Intermedio",   className: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  AVANZADO:     { label: "Avanzado",     className: "bg-red-500/10 text-red-600 border border-red-200" },
};

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

  // ⭐ FAVORITOS
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email } = useAuthContext();

useEffect(() => {
  if (!email) return;
  async function check() {
    try {
      const res = await isFavorite(event.id);
      setFavorite(res);
    } catch {
      setFavorite(false);
    }
  }
  check();
}, [event.id, email]);

  async function toggleFavorite(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (!email || loading) return;

    setLoading(true);
    try {
      if (favorite) {
        await removeFavorite(event.id);
        setFavorite(false);
      } else {
        await addFavorite(event.id);
        setFavorite(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const urgencyBadge =
    daysUntil === 0 ? { label: "Hoy", className: "bg-red-500 text-white" } :
    daysUntil === 1 ? { label: "Mañana", className: "bg-orange-500 text-white" } :
    daysUntil <= 7  ? { label: `En ${daysUntil} días`, className: "bg-amber-400 text-amber-900" } :
    null;

  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <article className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

        {/* ❤️ BOTÓN FAVORITO */}
        {email && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={toggleFavorite}
            className="bg-white/90 backdrop-blur rounded-full p-2 shadow hover:scale-110 transition"
          >
            <svg
              className={`w-5 h-5 ${favorite ? "text-red-500 fill-red-500" : "text-gray-400"}`}
              viewBox="0 0 24 24"
              fill={favorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 21s-6.716-4.35-9.192-7.192C.686 11.686 1.5 8.5 4.5 7.5c2-.5 3.5.5 4.5 1.5 1-1 2.5-2 4.5-1.5 3 .999 3.814 4.186 1.692 6.308C18.716 16.65 12 21 12 21z" />
            </svg>
          </button>
        </div>
        )}

        {/* Franja */}
        <div className={`h-1 w-full bg-gradient-to-r ${sport.gradient}`} />

        <div className="p-5">
          {/* Tags */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${sport.tagClass}`}>
              {event.sport}
            </span>
            <div className="flex items-center gap-1.5">
              {urgencyBadge && (
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${urgencyBadge.className}`}>
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
          <h3 className="font-black text-gray-900 text-base mb-4 uppercase line-clamp-2">
            {event.nombre}
          </h3>

          {/* Info */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center bg-dark-950 text-white rounded-xl px-3 py-2 min-w-[52px]">
              <span className="text-[10px] text-brand-400">{weekday}</span>
              <span className="text-2xl font-black">{day}</span>
              <span className="text-[10px] text-gray-400">{month}</span>
            </div>

            <div className="flex flex-col justify-center text-sm text-gray-600">
              <p className="truncate">{event.ciudad}, {event.provincia}</p>
              {event.distancias && <p className="truncate">{event.distancias}</p>}
            </div>
          </div>

          {/* Precio */}
          {event.precio && (
            <div className="mt-4 pt-3 border-t flex justify-between">
              <span className="text-xs text-gray-400">Precio</span>
              <span className="text-sm font-black">{event.precio}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}