import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios.js";


export const useInquiryStore = create((set, get) => ({
  inquiries: [],
  isLoading: false,

  fetchInquiries: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/inquiry");
      set({ inquiries: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch inquiries");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new website entry
  createInquiry: async (data) => {
    try {
      const res = await axiosInstance.post("/inquiry", data);
      set({ inquiries: [res.data, ...get().inquiries] });
      toast.success("Inquiry created");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Creation failed");
    }
  },

  // Update a website
  updateInquiry: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/inquiry/${id}`, data);
      set({
        inquiries: get().inquiries.map((site) =>
          site._id === id ? res.data : site
        ),
      });
      toast.success("inquiry updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  },

  // Delete a website
  deleteInquiry: async (id) => {
    try {
      await axiosInstance.delete(`/inquiry/${id}`);
      set({
        inquiries: get().inquiries.filter((site) => site._id !== id),
      });
      toast.success("inquiry deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  },
}));
