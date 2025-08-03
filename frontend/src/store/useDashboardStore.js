import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';
import toast from 'react-hot-toast';

export const useDashboardStore = create((set, get) => ({
  // Enhanced State
  inquirySummary: null,
  inquiriesByStatus: [],
  monthlyInquiries: [],
  actionStats: [],
  conversionFunnel: [],
  websitesByLocation: {
    states: [],
    districts: [],
    palikas: [],
    softwareStats: [],    
  },
  softwareStats: {          
    inquiries: [],
    websites: []
  },
  recentActivities: {       
    recentInquiries: [],
    recentWebsites: []
  },
  loading: false,
  error: null,

  // Enhanced loading states for better UX
  loadingStates: {
    inquirySummary: false,
    inquiriesByStatus: false,
    monthlyInquiries: false,
    actionStats: false,
    conversionFunnel: false,
    websitesByLocation: false,
    softwareStats: false,
    recentActivities: false
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setLoadingState: (key, loading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: loading }
  })),

  // Enhanced API calls with individual loading states
  fetchInquirySummary: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, inquirySummary: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/inquiry-summary');
      
      set((state) => ({ 
        inquirySummary: response.data, 
        loadingStates: { ...state.loadingStates, inquirySummary: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, inquirySummary: false }
      }));
      toast.error('Failed to fetch inquiry summary');
    }
  },

  fetchInquiriesByStatus: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, inquiriesByStatus: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/inquiries-by-status');
      
      set((state) => ({ 
        inquiriesByStatus: response.data, 
        loadingStates: { ...state.loadingStates, inquiriesByStatus: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, inquiriesByStatus: false }
      }));
      toast.error('Failed to fetch inquiries by status');
    }
  },

  fetchMonthlyInquiries: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, monthlyInquiries: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/monthly-inquiries');
      
      set((state) => ({ 
        monthlyInquiries: response.data, 
        loadingStates: { ...state.loadingStates, monthlyInquiries: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, monthlyInquiries: false }
      }));
      toast.error('Failed to fetch monthly inquiries');
    }
  },

  fetchActionStats: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, actionStats: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/action-stats');
      
      set((state) => ({ 
        actionStats: response.data, 
        loadingStates: { ...state.loadingStates, actionStats: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, actionStats: false }
      }));
      toast.error('Failed to fetch action statistics');
    }
  },

  fetchConversionFunnel: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, conversionFunnel: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/conversion-funnel');
      
      // Ensure we're setting an array
      const funnelData = Array.isArray(response.data) ? response.data : [];
      
      set((state) => ({ 
        conversionFunnel: funnelData, 
        loadingStates: { ...state.loadingStates, conversionFunnel: false }
      }));
    } catch (error) {
      set((state) => ({ 
        error: error.response?.data?.message || error.message, 
        loadingStates: { ...state.loadingStates, conversionFunnel: false }
      }));
      toast.error('Failed to fetch conversion funnel data');
    }
  },

  fetchWebsitesByLocation: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, websitesByLocation: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/websites-by-location');
      
      set((state) => ({ 
        websitesByLocation: response.data, 
        loadingStates: { ...state.loadingStates, websitesByLocation: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, websitesByLocation: false }
      }));
      toast.error('Failed to fetch websites by location');
    }
  },

  // 🆕 New API calls for enhanced functionality
  fetchSoftwareStats: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, softwareStats: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/software-stats');
      
      set((state) => ({ 
        softwareStats: response.data, 
        loadingStates: { ...state.loadingStates, softwareStats: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, softwareStats: false }
      }));
      toast.error('Failed to fetch software statistics');
    }
  },

  fetchRecentActivities: async () => {
    try {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, recentActivities: true },
        error: null 
      }));
      
      const response = await axiosInstance.get('/dashboard/recent-activities');
      
      set((state) => ({ 
        recentActivities: response.data, 
        loadingStates: { ...state.loadingStates, recentActivities: false }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set((state) => ({ 
        error: errorMessage, 
        loadingStates: { ...state.loadingStates, recentActivities: false }
      }));
      toast.error('Failed to fetch recent activities');
    }
  },

  // Enhanced fetch all data with better error handling
  fetchAllData: async () => {
    const { 
      fetchInquirySummary, 
      fetchInquiriesByStatus, 
      fetchMonthlyInquiries, 
      fetchActionStats, 
      fetchConversionFunnel, 
      fetchWebsitesByLocation,
      fetchSoftwareStats,      
      fetchRecentActivities    
    } = get();

    set({ loading: true, error: null });

    try {
      await Promise.allSettled([
        fetchInquirySummary(),
        fetchInquiriesByStatus(),
        fetchMonthlyInquiries(),
        fetchActionStats(),
        fetchConversionFunnel(),
        fetchWebsitesByLocation(),
        fetchSoftwareStats(),
        fetchRecentActivities()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Some dashboard data failed to load');
    } finally {
      set({ loading: false });
    }
  },

  // Selective data fetching for performance
  fetchCoreData: async () => {
    const { 
      fetchInquirySummary, 
      fetchInquiriesByStatus, 
      fetchMonthlyInquiries, 
      fetchConversionFunnel 
    } = get();

    await Promise.allSettled([
      fetchInquirySummary(),
      fetchInquiriesByStatus(),
      fetchMonthlyInquiries(),
      fetchConversionFunnel()
    ]);
  },

  fetchAnalyticsData: async () => {
    const { 
      fetchActionStats, 
      fetchWebsitesByLocation, 
      fetchSoftwareStats 
    } = get();

    await Promise.allSettled([
      fetchActionStats(),
      fetchWebsitesByLocation(),
      fetchSoftwareStats()
    ]);
  },

  //  Data refresh utility
  refreshData: async (dataTypes = []) => {
    const functions = {
      summary: get().fetchInquirySummary,
      status: get().fetchInquiriesByStatus,
      monthly: get().fetchMonthlyInquiries,
      actions: get().fetchActionStats,
      funnel: get().fetchConversionFunnel,
      locations: get().fetchWebsitesByLocation,
      software: get().fetchSoftwareStats,
      recent: get().fetchRecentActivities
    };

    if (dataTypes.length === 0) {
      await get().fetchAllData();
    } else {
      const promises = dataTypes.map(type => functions[type]?.());
      await Promise.allSettled(promises.filter(Boolean));
    }
  },

  // Enhanced reset with loading states
  reset: () => set({
    inquirySummary: null,
    inquiriesByStatus: [],
    monthlyInquiries: [],
    actionStats: [],
    conversionFunnel: [],
    websitesByLocation: {
      states: [],
      districts: [],
      palikas: [],
      softwareStats: [],
      websiteStatus: {}
    },
    softwareStats: {
      inquiries: [],
      websites: []
    },
    recentActivities: {
      recentInquiries: [],
      recentWebsites: []
    },
    loading: false,
    error: null,
    loadingStates: {
      inquirySummary: false,
      inquiriesByStatus: false,
      monthlyInquiries: false,
      actionStats: false,
      conversionFunnel: false,
      websitesByLocation: false,
      softwareStats: false,
      recentActivities: false
    }
  }),

  //  Computed selectors for enhanced data
  getters: {
    // Check if any data is loading
    isAnyLoading: () => {
      const { loadingStates } = get();
      return Object.values(loadingStates).some(loading => loading);
    },

    // Get conversion rate from inquiry summary
    getConversionRate: () => {
      const { inquirySummary } = get();
      return inquirySummary?.conversionRate || 0;
    },

    // Get month-over-month changes
    getChanges: () => {
      const { inquirySummary } = get();
      return inquirySummary?.changes || {};
    },

    // Get total websites count
    getTotalWebsites: () => {
      const { websitesByLocation } = get();
      return websitesByLocation?.websiteStatus?.total || 0;
    },

    // Get active vs expired websites
    getWebsiteStatus: () => {
      const { websitesByLocation } = get();
      return websitesByLocation?.websiteStatus || { active: 0, expired: 0, total: 0 };
    }
  }
}));