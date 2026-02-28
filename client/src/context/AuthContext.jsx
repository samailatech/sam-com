import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("sam_com_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("sam_com_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (nextToken, nextUser) => {
    localStorage.setItem("sam_com_token", nextToken);
    localStorage.setItem("sam_com_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("sam_com_token");
    localStorage.removeItem("sam_com_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
