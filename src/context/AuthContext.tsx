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
    const res = await fetch("http://localhost:5000/admin/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json().catch(() => null)) as
      | { token: string; admin: { id: number; email: string; name: string; role: string } }
      | { error?: string };

    if (!res.ok) {
      const msg = (data && "error" in data && data.error) ? data.error : "Erreur de connexion";
      throw new Error(msg);
    }

    if (!data || !("token" in data) || !("admin" in data)) {
      throw new Error("Réponse invalide du serveur");
    }

    setToken(data.token);
    setAdmin(data.admin);
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