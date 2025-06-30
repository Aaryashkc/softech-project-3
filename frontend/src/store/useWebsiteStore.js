import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useWebsiteStore = create((set, get) => ({
  websites: [],
  isLoading: false,

  // Fetch all websites (admin gets all, user gets own)
  fetchWebsites: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/website");
      set({ websites: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch websites");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new website entry
  createWebsite: async (data) => {
    try {
      const res = await axiosInstance.post("/website", data);
      set({ websites: [res.data, ...get().websites] });
      toast.success("Website created");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Creation failed");
    }
  },

  // Update a website
  updateWebsite: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/website/${id}`, data);
      set({
        websites: get().websites.map((site) =>
          site._id === id ? res.data : site
        ),
      });
      toast.success("Website updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  },

  // Delete a website
  deleteWebsite: async (id) => {
    try {
      await axiosInstance.delete(`/website/${id}`);
      set({
        websites: get().websites.filter((site) => site._id !== id),
      });
      toast.success("Website deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  },
}));
