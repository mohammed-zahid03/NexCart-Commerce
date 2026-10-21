
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const rawToken = auth?.jwtToken;

      if (typeof rawToken === "string") {
        // Remove a possible "Bearer " prefix and surrounding whitespace.
        const token = rawToken
          .trim()
          .replace(/^Bearer\s+/i, "");

        // Send only a standard JWT, not a prefixed or malformed value.
        if (token && !/\s/.test(token) && token.split(".").length === 3) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }
      }
    } catch (error) {
      console.error("Could not read saved authentication data.");
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;