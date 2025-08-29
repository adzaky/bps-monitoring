import { authClient } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

// Library Service Queries
export const useLibraryServiceData = () => {
  return useQuery({
    queryKey: ["libraryService"],
    queryFn: api.libraryService.getLibraryServiceData,
    select: (data) => data.data ?? [],
  });
};

export const useLibraryServiceByType = (type = "individu") => {
  return useQuery({
    queryKey: ["libraryService", type],
    queryFn: () => api.libraryService.getLibraryServiceByType(type),
    select: (data) => data.data ?? [],
  });
};

// Romantik Service Queries
export const useRomantikStatisticalActivities = () => {
  return useQuery({
    queryKey: ["romantikService"],
    queryFn: api.romantikService.getRomantikStatisticalActivities,
    select: (data) => data.data ?? [],
  });
};

// Silastik Service Queries
export const useStatisticalTransactions = () => {
  return useQuery({
    queryKey: ["silastikService", "transactions"],
    queryFn: api.silastikService.getStatisticalTransactions,
    select: (data) => data.data ?? [],
  });
};

export const useConsultationStatistic = () => {
  return useQuery({
    queryKey: ["silastikService", "consultation"],
    queryFn: api.silastikService.getConsultationStatistic,
    select: (data) => data.data ?? [],
  });
};

export const useProductStatistic = () => {
  return useQuery({
    queryKey: ["silastikService", "product"],
    queryFn: api.silastikService.getProductStatistic,
    select: (data) => data.data ?? [],
  });
};

// Sheet Service Queries
export const useSheetRecapData = () => {
  return useMutation({
    mutationFn: ({ data, title }) => api.sheetService.createRecapData({ data, title }),
  });
};

// Auth Queries
export const useAuthUser = () => {
  const { data, isPending } = authClient.useSession();

  const user = data?.user;

  return { user, isPending };
};

export const useAuthSession = () => {
  const { data, isPending } = authClient.useSession();

  const session = data?.session;
  const isExpired = session ? new Date(session.expiresAt) < new Date() : true;
  const isAuthenticated = session && !isExpired;

  return { session, isPending, isAuthenticated };
};

export const useAuthLogout = () => {
  const logout = async (fetchOptions = {}) => {
    await authClient.signOut({
      fetchOptions,
    });
  };

  return { logout };
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
