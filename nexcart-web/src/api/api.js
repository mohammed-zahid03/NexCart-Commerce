api.interceptors.request.use(
  (config) => {
    try {
      const savedAuth = localStorage.getItem("auth");
      const auth = savedAuth ? JSON.parse(savedAuth) : null;

      let token = auth?.jwtToken;

      if (typeof token === "string") {
        token = token.trim();

        // Remove an existing Bearer prefix.
        token = token.replace(/^Bearer\s+/i, "");

        // Remove a cookie-name prefix if present.
        token = token.replace(/^springBootEcom=/i, "");

        // JWTs must not contain whitespace.
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