"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { EventFilters, EventLevel, Sport } from "@/types";

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
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
  const [expanded, setExpanded] = useState(false);

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
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

      {/* Mobile: filtros principales siempre visibles */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        <select
          value={filters.sport}
          onChange={(e) => handleChange("sport", e.target.value)}
          className="dark-select"
        >
          <option value="">Todos los deportes</option>
          {sports.map((s) => (
            <option key={s.id} value={s.slug}>{s.nombre}</option>
          ))}
        </select>

        <select
          value={filters.provincia}
          onChange={(e) => handleChange("provincia", e.target.value)}
          className="dark-select"
        >
          <option value="">Todas las provincias</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Mobile: botón para expandir filtros avanzados */}
      <div className="flex gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
          Más filtros
          {activeCount > 0 && (
            <span className="bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile: filtros avanzados expandibles */}
      {expanded && (
        <div className="flex flex-col gap-2 sm:hidden">
          <select
            value={filters.nivel}
            onChange={(e) => handleChange("nivel", e.target.value as EventLevel)}
            className="dark-select"
          >
            <option value="">Todos los niveles</option>
            {NIVELES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider px-1">Desde</label>
              <input
                type="date"
                value={filters.desde}
                onChange={(e) => handleChange("desde", e.target.value)}
                className="dark-select"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider px-1">Hasta</label>
              <input
                type="date"
                value={filters.hasta}
                onChange={(e) => handleChange("hasta", e.target.value)}
                className="dark-select"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop: todos los filtros en una fila */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <select
          value={filters.sport}
          onChange={(e) => handleChange("sport", e.target.value)}
          className="dark-select"
        >
          <option value="">Todos los deportes</option>
          {sports.map((s) => (
            <option key={s.id} value={s.slug}>{s.nombre}</option>
          ))}
        </select>

        <select
          value={filters.provincia}
          onChange={(e) => handleChange("provincia", e.target.value)}
          className="dark-select"
        >
          <option value="">Todas las provincias</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filters.nivel}
          onChange={(e) => handleChange("nivel", e.target.value as EventLevel)}
          className="dark-select"
        >
          <option value="">Todos los niveles</option>
          {NIVELES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
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

      {/* Botones */}
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