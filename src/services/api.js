import apiClient from "../lib/axios";

export const api = {
  libraryService: {
    getLibraryServiceData: async () => {
      const response = await apiClient.get("/library-service");
      return { data: response.data, error: null };
    },
    getLibraryServiceByType: async (type = "individu") => {
      const response = await apiClient.get(`/library-service/${type}`);
      return { data: response.data, error: null };
    },
  },
  romantikService: {
    getRomantikStatisticalActivities: async () => {
      const response = await apiClient.get("/romantik-service");
      return { data: response.data, error: null };
    },
  },
  silastikService: {
    getStatisticalTransactions: async () => {
      const response = await apiClient.get("/silastik-service");
      return { data: response.data, error: null };
    },
    getConsultationStatistic: async () => {
      const response = await apiClient.get("/silastik-service/konsultasi");
      return { data: response.data, error: null };
    },
    getProductStatistic: async () => {
      const response = await apiClient.get("/silastik-service/permintaan");
      return { data: response.data, error: null };
    },
  },
  sheetService: {
    createRecapData: async ({ data, title }) => {
      const response = await apiClient.post("/create-sheet/recap-data", {
        title: title,
        data: data,
      });
      return { data: response.data, error: null };
    },
  },
};
