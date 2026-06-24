// src/api/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  
  if (authStore.token.value) {
    try {
      const decoded = jwtDecode(authStore.token.value);
      if (decoded.exp * 1000 < Date.now()) {
        authStore.clearAuth();

        // Optional: redirect to login
        window.location.href = "/login";

        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${authStore.token.value}`;
    } catch (error) {
      authStore.clearAuth();
      return Promise.reject(error);
    }
  }

  return config;
});

export default api;