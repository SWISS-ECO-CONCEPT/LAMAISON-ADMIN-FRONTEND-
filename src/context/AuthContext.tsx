import { createContext, useEffect, useContext, useMemo, useState, type ReactNode } from "react";

type AdminShape = {
  id: number;
  email: string;
  name: string;
  role: string;
} | null;

type AuthContextValue = {
  admin: AdminShape;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  admin: null,
  token: null,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: () => {},
});

type Props = { children: ReactNode };

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("admin_token");
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState<AdminShape>(() => {
    try {
      const raw = localStorage.getItem("admin_user");
      return raw ? (JSON.parse(raw) as AdminShape) : null;
    } catch {
      return null;
    }
  });

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/admin/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const json = (await res.json().catch(() => null)) as
      | { success: true; data: { token: string; admin: NonNullable<AdminShape> } }
      | { success: false; error?: { message?: string }; message?: string }
      | { token?: string; admin?: NonNullable<AdminShape>; error?: string }
      | null;

    if (!res.ok) {
      const msg =
        (json && 'error' in json && typeof json.error === 'object' && json.error?.message) ||
        (json && typeof (json as { message?: string }).message === 'string' && (json as { message: string }).message) ||
        (json && typeof (json as { error?: string }).error === 'string' && (json as { error: string }).error) ||
        "Erreur de connexion";
      throw new Error(msg);
    }

    // Déballer le format uniforme { success: true, data: { token, admin } }
    // et garder la compatibilité ascendante avec l'ancien format { token, admin }
    const unwrapped =
      json && typeof json === 'object' && 'success' in json && 'data' in json
        ? (json as { data: { token?: string; admin?: NonNullable<AdminShape> } }).data
        : (json as { token?: string; admin?: NonNullable<AdminShape> } | null);

    if (!unwrapped || !("token" in unwrapped) || !("admin" in unwrapped) || !unwrapped.token || !unwrapped.admin) {
      throw new Error("Réponse invalide du serveur");
    }

    setToken(unwrapped.token);
    setAdmin(unwrapped.admin);
  };

  const signOut = () => {
    setToken(null);
    setAdmin(null);
  };

  useEffect(() => {
    try {
      if (token) localStorage.setItem("admin_token", token);
      else localStorage.removeItem("admin_token");
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    try {
      if (admin) localStorage.setItem("admin_user", JSON.stringify(admin));
      else localStorage.removeItem("admin_user");
    } catch {
      // ignore
    }
  }, [admin]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      admin,
      token,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    };
  }, [admin, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;