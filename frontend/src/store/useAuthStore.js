import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  users: [],
  isLoadingUsers: false,

  // Check if user is admin
  isAdmin: () => {
    const { authUser } = get();
    return authUser?.role === "admin";
  },

  // Check if user is logged in
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign up
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      const msg = error?.response?.data?.message || "Signup failed";
      toast.error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      const msg = error?.response?.data?.message || "Logout failed";
      toast.error(msg);
    }
  },

  // Promote user to admin (admin only)
  promoteToAdmin: async (userId) => {
    try {
      const res = await axiosInstance.put(`/auth/promote/${userId}`);
      toast.success(res.data.message || "User promoted to admin");

      get().getAllUsers();
    } catch (error) {
      const msg = error?.response?.data?.message || "Promotion failed";
      toast.error(msg);
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/auth/users");
      set({ users: res.data });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to fetch users";
      toast.error(msg);
      set({ users: [] });
    } finally {
      set({ isLoadingUsers: false });
    }
  },
}));
