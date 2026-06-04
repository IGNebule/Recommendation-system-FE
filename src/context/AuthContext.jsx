import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services";

export const AuthContext = createContext(null);

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const decodePayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    return JSON.parse(decodePayload);
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getUserFromToken = (token) => {
  if (!token) return null;

  const payload = decodeJwtPayload(token);

  if (!payload?.email) return null;

  return {
    email: payload.email,
  };
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => authService.getToken());
  const [user, setUser] = useState(() => {
    return getUserFromToken(authService.getToken());
  });

  const login = async ({ email, password }) => {
    const result = await authService.login({
      email,
      password,
    });

    const savedToken = result.token;

    setToken(savedToken);
    setUser(getUserFromToken(savedToken));

    return result;
  };

  const register = async ({ email, password }) => {
    const result = await authService.register({
      email,
      password,
    });

    return result;
  };

  const logout = () => {
    authService.logout();

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const savedToken = authService.getToken();

    if (!savedToken) {
      setToken(null);
      setUser(null);
      return;
    }

    setToken(savedToken);
    setUser(getUserFromToken(savedToken));
  }, []);

  const value = useMemo(() => {
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
};

export default AuthProvider