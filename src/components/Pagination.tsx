"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export default function Pagination({ currentPage, totalPages, totalItems, pageSize }: Props) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    return `/${qs ? `?${qs}` : ""}`;
  }

  // Genera el rango de páginas a mostrar (máx 5 botones)
  function getPageRange(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      {/* Info */}
      <p className="text-xs text-gray-400 uppercase tracking-widest">
        Mostrando <span className="text-gray-600 font-semibold">{from}–{to}</span> de{" "}
        <span className="text-gray-600 font-semibold">{totalItems}</span> eventos
      </p>

      {/* Controles */}
      <div className="flex items-center gap-1">
        {/* Anterior */}
        {currentPage > 1 ? (
          <Link href={buildUrl(currentPage - 1)} className="pagination-btn">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
        ) : (
          <span className="pagination-btn opacity-30 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </span>
        )}

        {/* Páginas */}
        {getPageRange().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p as number)}
              className={`pagination-btn font-semibold text-sm min-w-[38px] justify-center ${
                p === currentPage
                  ? "bg-brand-600 text-white border-brand-600 hover:bg-brand-600"
                  : ""
              }`}
            >
              {p}
            </Link>
          )
        )}

        {/* Siguiente */}
        {currentPage < totalPages ? (
          <Link href={buildUrl(currentPage + 1)} className="pagination-btn">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ) : (
          <span className="pagination-btn opacity-30 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
