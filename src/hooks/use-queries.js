import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { getAuthUser, signOut } from "../lib/auth";

// Library Service Queries
export const useLibraryServiceData = () => {
  return useQuery({
    queryKey: ["libraryService"],
    queryFn: async () => {
      const res = await api.libraryService.getLibraryServiceData();
      return res.data;
    },
  });
};

export const useLibraryServiceByType = (type = "individu") => {
  return useQuery({
    queryKey: ["libraryService", type],
    queryFn: async () => {
      const res = await api.libraryService.getLibraryServiceByType(type);
      return res.data;
    },
  });
};

// Romantik Service Queries
export const useRomantikStatisticalActivities = () => {
  return useQuery({
    queryKey: ["romantikService"],
    queryFn: async () => {
      const res = await api.romantikService.getRomantikStatisticalActivities();
      return res.data;
    },
  });
};

// Silastik Service Queries
export const useStatisticalTransactions = () => {
  return useQuery({
    queryKey: ["silastikService", "transactions"],
    queryFn: async () => {
      const res = await api.silastikService.getStatisticalTransactions();
      return res.data;
    },
  });
};

export const useConsultationStatistic = () => {
  return useQuery({
    queryKey: ["silastikService", "consultation"],
    queryFn: async () => {
      const res = await api.silastikService.getConsultationStatistic();
      return res.data;
    },
  });
};

export const useProductStatistic = () => {
  return useQuery({
    queryKey: ["silastikService", "product"],
    queryFn: async () => {
      const res = await api.silastikService.getProductStatistic();
      return res.data;
    },
  });
};

// Sheet Service Queries
export const useSheetRecapData = () => {
  return useMutation({
    mutationFn: ({ data, title }) => api.sheetService.createRecapData({ data, title }),
  });
};

// Auth Queries
export const useAuthSignIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }) => api.authService.signIn({ email, password }),
    onSuccess: ({ data }) => {
      localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, data.token);
      navigate("/", { replace: true });
    },
  });
};

export const useAuthSignOut = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: () => getAuthUser(),
  });
};

// Combined Dashboard Data
export const useDashboardData = () => {
  const libraryService = useLibraryServiceData();
  const romantikService = useRomantikStatisticalActivities();
  const statisticalTransactions = useStatisticalTransactions();

  return {
    libraryServiceData: libraryService.data ?? [],
    romantikServiceData: romantikService.data ?? [],
    statisticalTransactions: statisticalTransactions.data ?? [],
    isPending: libraryService.isPending || romantikService.isPending || statisticalTransactions.isPending,
    error: libraryService.error || romantikService.error || statisticalTransactions.error,
  };
};
