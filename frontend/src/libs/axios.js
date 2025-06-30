import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? 'http://localhost:5001/api' 
    : "/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any existing auth state
      const authStore = useAuthStore.getState();
      if (authStore?.authUser) {
        authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);