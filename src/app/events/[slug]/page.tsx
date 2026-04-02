import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/api";

const levelLabels: Record<string, string> = {
  PRINCIPIANTE: "Principiante",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
};

const levelColors: Record<string, string> = {
  PRINCIPIANTE: "bg-green-100 text-green-800",
  INTERMEDIO: "bg-yellow-100 text-yellow-800",
  AVANZADO: "bg-red-100 text-red-800",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let event;
  try {
    event = await getEventBySlug(slug);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("404")) notFound();
    throw e;
  }

  const date = new Date(event.fecha + "T00:00:00");
  const formattedDate = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let formattedDeadline: string | undefined;
  if (event.fechaLimiteInscripcion) {
    formattedDeadline = new Date(event.fechaLimiteInscripcion + "T00:00:00").toLocaleDateString(
      "es-AR",
      { day: "numeric", month: "long", year: "numeric" }
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver a eventos
      </Link>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md">
              {event.sport}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{event.nombre}</h1>
          </div>
          {event.nivel && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${levelColors[event.nivel] ?? "bg-gray-100 text-gray-700"}`}
            >
              {levelLabels[event.nivel] ?? event.nivel}
            </span>
          )}
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Fecha" value={formattedDate} />
          <DetailRow label="Ubicacion" value={`${event.ciudad}, ${event.provincia}`} />
          {event.distancias && (
            <DetailRow label="Distancias" value={event.distancias} />
          )}
          {event.precio && <DetailRow label="Precio" value={event.precio} />}
          {formattedDeadline && (
            <DetailRow label="Inscripcion hasta" value={formattedDeadline} />
          )}
        </dl>

        {event.urlInscripcion && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <a
              href={event.urlInscripcion}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Inscribirse
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-gray-900 font-medium">{value}</dd>
    </div>
  );
}
