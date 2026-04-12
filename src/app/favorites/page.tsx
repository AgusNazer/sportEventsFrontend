"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/api";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import type { EventResponse, FavoriteResponse } from "@/types";

export default function FavoritesPage() {
  const { email, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!email) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const favs = await getFavorites();
        setEvents(favs.map((f: FavoriteResponse) => f.event));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar favoritos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [email, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="page-container">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title mb-6">Mis favoritos</h1>

      {events.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">
            No tenés eventos guardados
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Tocá el ❤️ en cualquier evento para guardarlo acá
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}