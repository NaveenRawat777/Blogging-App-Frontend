import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("dowit_user") || "null"),
  );
  const login = ({ token, user: currentUser }) => {
    localStorage.setItem("dowit_token", token);
    localStorage.setItem("dowit_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };
  const updateUser = (currentUser) => {
    localStorage.setItem("dowit_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };
  const logout = () => {
    localStorage.removeItem("dowit_token");
    localStorage.removeItem("dowit_user");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
