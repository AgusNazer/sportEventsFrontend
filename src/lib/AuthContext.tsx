"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logoutApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

interface AuthContextType {
  email: string | null;
  nombre: string | null;
  rol: UserRole | null;
  loading: boolean;
  logout: () => Promise<void>;
  reloadAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  email: null,
  nombre: null,
  rol: null,
  loading: true,
  logout: async () => {},
  reloadAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [rol, setRol] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function reloadAuth() {
    const me = await getMe();
    setEmail(me?.email ?? null);
    setNombre(me?.nombre ?? null);
    setRol(me?.rol ?? null);
    setLoading(false);
  }

  async function logout() {
    await logoutApi();
    setEmail(null);
    setNombre(null);
    setRol(null);
    router.replace("/");
  }

  useEffect(() => {
    reloadAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ email, nombre, rol, loading, logout, reloadAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}