import type { LoginResponse } from "../types/auth";

const AUTH_KEY = "emniyet_auth";

export const saveAuth = (auth: LoginResponse) => {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const getAuth = (): LoginResponse | null => {
  const auth = sessionStorage.getItem(AUTH_KEY);

  if (!auth) {
    return null;
  }

  try {
    return JSON.parse(auth) as LoginResponse;
  } catch {
    sessionStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const getToken = (): string | null => {
  return getAuth()?.token ?? null;
};

export const clearAuth = () => {
  sessionStorage.removeItem(AUTH_KEY);
};