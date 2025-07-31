import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios.js";

export const useInquiryStore = create((set, get) => ({
  inquiries: [],
  softwareSuggestions: [],
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

  createInquiry: async (data) => {
    try {
      const res = await axiosInstance.post("/inquiry", data);
      set({ inquiries: [res.data, ...get().inquiries] });
      toast.success("Inquiry created");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Creation failed");
    }
  },

  updateInquiry: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/inquiry/${id}`, data);
      set({
        inquiries: get().inquiries.map((site) =>
          site._id === id ? res.data : site
        ),
      });
      toast.success("Inquiry updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  },

  updateInquiryStatus: async (id, newStatus) => {
    try {
      const res = await axiosInstance.put(`/inquiry/${id}`, { status: newStatus });
      set({
        inquiries: get().inquiries.map((inq) =>
          inq._id === id ? res.data : inq
        ),
      });
      toast.success("Status updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status update failed");
    }
  },

  deleteInquiry: async (id) => {
    try {
      await axiosInstance.delete(`/inquiry/${id}`);
      set({
        inquiries: get().inquiries.filter((site) => site._id !== id),
      });
      toast.success("Inquiry deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  },

  fetchSoftwareSuggestions: async () => {
    try {
      const res = await axiosInstance.get("/inquiry/suggestions/software");
      set({ softwareSuggestions: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch software suggestions");
    }
  },

  // Add Action to Inquiry
  addActionToInquiry: async (inquiryId, actionData) => {
    try {
      const res = await axiosInstance.post(`/inquiry/${inquiryId}/actions`, actionData);
      set({
        inquiries: get().inquiries.map((inq) =>
          inq._id === inquiryId ? { ...inq, actions: res.data } : inq
        ),
      });
      toast.success("Action added");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add action");
    }
  },

  // Get Actions for Inquiry
  fetchActionsForInquiry: async (inquiryId) => {
    try {
      const res = await axiosInstance.get(`/inquiry/${inquiryId}/actions`);
      return res.data; // Use this in component state if needed
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch actions");
      return [];
    }
  },
}));
