import { getMe, logoutApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

interface AuthState {
  email: string | null;
  rol: UserRole | null;
}

export function useAuth(requiredRole?: UserRole) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({
    email: null,
    rol: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((me) => {
      if (!me) {
        router.replace("/login");
        return;
      }

      if (requiredRole && me.rol !== requiredRole) {
        router.replace("/");
        return;
      }

      setAuth({ email: me.email, rol: me.rol });
      setLoading(false);
    });
  }, []);

  async function logout() {
    await logoutApi();
    router.replace("/login");
  }

  return { ...auth, loading, logout };
}