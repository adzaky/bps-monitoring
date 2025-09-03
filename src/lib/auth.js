import { jwtDecode } from "jwt-decode";

export const decodedToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    const isTokenExpired = decoded.exp ? decoded.exp < currentTime : true;

    if (isTokenExpired) {
      localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
    }

    return {
      isTokenExpired,
      user: !isTokenExpired ? decoded : null,
    };
  } catch (err) {
    return { isTokenExpired: true, user: null, err };
  }
};

export const getAuthUser = () => {
  const token = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
  const { user } = decodedToken(token);
  return user;
};

export const signOut = () => {
  localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const isAuthenticated = () => {
  const token = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_NAME || "");
  const { isTokenExpired } = decodedToken(token);
  return !isTokenExpired;
};
