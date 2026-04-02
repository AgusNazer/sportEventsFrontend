"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { EventFilters, EventLevel, Sport } from "@/types";

const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const NIVELES: { value: EventLevel; label: string }[] = [
  { value: "PRINCIPIANTE", label: "Principiante" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "AVANZADO", label: "Avanzado" },
];

interface Props {
  sports: Sport[];
}

export default function EventFilters({ sports }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<EventFilters>({
    sport: searchParams.get("sport") ?? "",
    provincia: searchParams.get("provincia") ?? "",
    nivel: (searchParams.get("nivel") as EventLevel | undefined) ?? undefined,
    desde: searchParams.get("desde") ?? "",
    hasta: searchParams.get("hasta") ?? "",
  });

  function handleChange(key: keyof EventFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.sport) params.set("sport", filters.sport);
    if (filters.provincia) params.set("provincia", filters.provincia);
    if (filters.nivel) params.set("nivel", filters.nivel);
    if (filters.desde) params.set("desde", filters.desde);
    if (filters.hasta) params.set("hasta", filters.hasta);
    router.push(`/?${params.toString()}`);
  }

  function handleClear() {
    setFilters({ sport: "", provincia: "", nivel: undefined, desde: "", hasta: "" });
    router.push("/");
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <select
          value={filters.sport}
          onChange={(e) => handleChange("sport", e.target.value)}
          className="dark-select"
        >
          <option value="">Todos los deportes</option>
          {sports.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.nombre}
            </option>
          ))}
        </select>

        <select
          value={filters.provincia}
          onChange={(e) => handleChange("provincia", e.target.value)}
          className="dark-select"
        >
          <option value="">Todas las provincias</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filters.nivel}
          onChange={(e) => handleChange("nivel", e.target.value as EventLevel)}
          className="dark-select"
        >
          <option value="">Todos los niveles</option>
          {NIVELES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.desde}
          onChange={(e) => handleChange("desde", e.target.value)}
          className="dark-select"
          title="Fecha desde"
        />

        <input
          type="date"
          value={filters.hasta}
          onChange={(e) => handleChange("hasta", e.target.value)}
          className="dark-select"
          title="Fecha hasta"
        />
      </div>

      <div className="flex gap-2 justify-end">
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Limpiar
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 text-sm font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors uppercase tracking-wide"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
