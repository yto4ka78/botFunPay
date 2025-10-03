import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-CSRF-Token",
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { config, response } = error || {};
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      refreshing ??= axios
        .post("/auth/refresh", null, { withCredentials: true })
        .finally(() => (refreshing = null));
      await refreshing;
      return api(config);
    }
    return Promise.reject(error);
  }
);

export default api;
