"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Eventos" },
  { href: "/this-weekend", label: "Este fin de semana" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { email, nombre, rol, logout } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isLoggedIn = !!email;
  const isAdmin = rol === "ADMIN";

  return (
    <header className="bg-dark-950 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-md bg-brand-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
            </svg>
          </span>
          <span className="text-white font-black text-lg tracking-tight uppercase">
            Sport<span className="text-brand-400">Events</span>
            <span className="text-gray-500 font-medium text-sm ml-1">AR</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Admin
            </Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden lg:block">
                Hola <span className="text-orange-500 font-semibold">{nombre}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/login"
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Iniciar sesión
            </Link>
          )}
        </nav>

        {/* Hamburguesa mobile */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-900 border-t border-white/5 px-4 py-3 flex flex-col gap-1">
          {isLoggedIn && nombre && (
            <span className="px-4 py-2 text-sm text-gray-500">
              Hola <span className="text-orange-500 font-semibold">{nombre}</span>
            </span>
          )}

          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Admin
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-left"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/login"
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  );
}