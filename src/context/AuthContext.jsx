import { createContext, useEffect, useMemo, useState } from "react";

import { authService, profileService } from "../services";

export const AuthContext = createContext(null);

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    return JSON.parse(decodedPayload);
  } catch {
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
  const [user, setUser] = useState(() =>
    getUserFromToken(authService.getToken()),
  );
  const [profile, setProfile] = useState(null);

  const refreshProfile = async () => {
    const savedToken = authService.getToken();

    if (!savedToken) {
      setProfile(null);
      return null;
    }

    const result = await profileService.getMe();

    setProfile(result.profile);

    setUser((prev) => ({
      ...prev,
      ...result.profile,
    }));

    return result.profile;
  };

  const login = async ({ email, password }) => {
    const result = await authService.login({
      email,
      password,
    });

    const savedToken = result.token;

    setToken(savedToken);
    setUser(getUserFromToken(savedToken));

    await refreshProfile();

    return result;
  };

  const loginWithGoogle = async ({ credential }) => {
    const result = await authService.googleLogin({
      credential,
    });

    const savedToken = result.token;

    setToken(savedToken);

    if (result.user) {
      setUser(result.user);
    } else {
      setUser(getUserFromToken(savedToken));
    }

    await refreshProfile();

    return result;
  };

  const register = async ({ email, password }) => {
    return authService.register({
      email,
      password,
    });
  };

  const logout = () => {
    authService.logout();

    setToken(null);
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    const savedToken = authService.getToken();

    if (!savedToken) {
      setToken(null);
      setUser(null);
      setProfile(null);
      return;
    }

    setToken(savedToken);
    setUser(getUserFromToken(savedToken));

    refreshProfile().catch(() => {
      setProfile(null);
    });
  }, []);

  const value = useMemo(() => {
    return {
      token,
      user,
      profile,
      isAuthenticated: Boolean(token && user),
      login,
      loginWithGoogle,
      register,
      logout,
      refreshProfile,
    };
  }, [token, user, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;