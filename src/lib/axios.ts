import axios from "axios";
const api = axios.create({
  baseURL: "https://api.blacvolta.com/",
  withCredentials: true,
  timeout: 45000,
});

// 🔹 Automatically attach token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
        const excludedApis = ['/api/auth/login','/api/auth/register'];
        if (!excludedApis.some(api => config.url?.includes(api))) {
            const token = localStorage.getItem("accessToken");
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      // optional redirect:
      // window.location.href = "/login";
    }

    if (status === 500) {
      console.error("Server error", error);
    }

    return Promise.reject(error);
  }
);

export default api;
