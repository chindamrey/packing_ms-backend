// src/api/api.js
import axios from "axios";
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
  console.log('token expre ? ',authStore.isAuthenticated.value);
  if(!authStore.isAuthenticated.value) {
    // authStore.clearAuth();
    // return;
  }
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token.value}`;
  }

  return config;
});

export default api;