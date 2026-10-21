
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    try {
      const savedAuth = localStorage.getItem("auth");
      const auth = savedAuth ? JSON.parse(savedAuth) : null;

      let token = auth?.jwtToken;

      if (typeof token === "string") {
        token = token.trim();

        // If the saved value contains a cookie string, keep only its value.
token = token.split(";")[0].trim();

        token = token.replace(/^Bearer\s+/i, "");
        token = token.replace(/^springBootEcom=/i, "");
        token = token.replace(/\s+/g, "");
      }

      if (token && token.split(".").length === 3) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers?.Authorization;
      }
    } catch (error) {
      console.error("Could not read saved authentication data.");
      delete config.headers?.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;