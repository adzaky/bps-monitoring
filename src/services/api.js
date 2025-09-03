import apiClient from "../lib/axios";

export const api = {
  authService: {
    signIn: ({ email, password }) => {
      return apiClient.post("/auth/sign-in", {
        email,
        password,
      });
    },
    createUser: ({ name, email, password }) => {
      return apiClient.post("/auth/user", {
        name,
        email,
        password,
      });
    },
  },
  libraryService: {
    getLibraryServiceData: () => {
      return apiClient.get("/library-service");
    },
    getLibraryServiceByType: (type = "individu") => {
      return apiClient.get(`/library-service/${type}`);
    },
  },
  romantikService: {
    getRomantikStatisticalActivities: () => {
      return apiClient.get("/romantik-service");
    },
  },
  silastikService: {
    getStatisticalTransactions: () => {
      return apiClient.get("/silastik-service");
    },
    getConsultationStatistic: () => {
      return apiClient.get("/silastik-service/konsultasi");
    },
    getProductStatistic: () => {
      return apiClient.get("/silastik-service/permintaan");
    },
  },
  sheetService: {
    createRecapData: ({ data, title }) => {
      return apiClient.post("/create-sheet/recap-data", {
        title: title,
        data: data,
      });
    },
  },
};
