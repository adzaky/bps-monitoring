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
