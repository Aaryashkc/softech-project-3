import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? 'http://localhost:5001/api' 
    : "https://softech-project-3.onrender.com/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      if (authStore?.authUser) {
        authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);