import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

export const useDataStore = create((set) => ({
  states: [],
  districts: [],
  allDistricts: [],
  palikas: [],
  allPalikas: [],
  loading: false,

  fetchStates: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/data/states");
      set({ states: res.data });
    } catch (err) {
      console.error("Error fetching states", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchDistrictsByStateId: async (stateId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/data/districts/${stateId}`);
      set({ districts: res.data });
    } catch (err) {
      console.error("Error fetching districts", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllDistricts: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/data/districts"); 
      set({ allDistricts: res.data });
    } catch (err) {
      console.error("Error fetching all districts", err);
    } finally {
      set({ loading: false });
    }
  },



  fetchPalikasByDistrictId: async (DistrictId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/data/palikas/${DistrictId}`);
      set({ palikas: res.data });
    } catch (err) {
      console.error("Error fetching palikas", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllPalikas: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/data/palikas"); 
      set({ allPalikas: res.data });
    } catch (err) {
      console.error("Error fetching all palikas", err);
    } finally {
      set({ loading: false });
    }
  }
}));
