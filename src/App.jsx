import React from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import { LoadingScreen } from "./components/ui/loading-screen";
import { useAppLoading } from "./hooks/use-app-loading";
import { api } from "./services/api";
import supabase from "./lib/supabase";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import LayananPerpustakaan from "./pages/layanan-perpustakaan";
import RekomendasiStatistik from "./pages/rekomendasi-statistik";
import KonsultasiStatistik from "./pages/konsultasi-statistik";
import EkstraksiData from "./pages/ekstraksi-data";
import RekapData from "./pages/rekap-data";
import ProdukStatistik from "./pages/produk-statistik";

export default function App() {
  const { isLoading } = useAppLoading();

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      Component: AppLayout,
      loader: async () => {
        const isAuthenticated = await getSession();

        return { isAuthenticated };
      },
      children: [
        {
          index: true,
          Component: Dashboard,
          loader: async () => {
            const { data: libraryServiceData } = await api.libraryService.getLibraryServiceData();
            const { data: romantikServiceData } = await api.romantikService.getRomantikStatisticalActivities();
            const { data: statisticalTransactions } = await api.silastikService.getStatisticalTransactions();

            return {
              statisticalTransactions: statisticalTransactions ?? [],
              libraryServiceData: libraryServiceData ?? [],
              romantikServiceData: romantikServiceData ?? [],
            };
          },
        },
        {
          path: "konsultasi-statistik",
          Component: KonsultasiStatistik,
          loader: async () => {
            const { data: consultationStatistic } = await api.silastikService.getConsultationStatistic();
            return { consultationStatistic: consultationStatistic ?? [] };
          },
        },
        {
          path: "produk-statistik",
          Component: ProdukStatistik,
          loader: async () => {
            const { data: productStatistic } = await api.silastikService.getProductStatistic();
            return { productStatistic: productStatistic ?? [] };
          },
        },
        {
          path: "layanan-perpustakaan",
          Component: LayananPerpustakaan,
          loader: async () => {
            const { data: libraryServiceData } = await api.libraryService.getLibraryServiceData();
            return { libraryServiceData: libraryServiceData ?? [] };
          },
        },
        {
          path: "rekomendasi-statistik",
          Component: RekomendasiStatistik,
          loader: async () => {
            const { data: romantikServiceData } = await api.romantikService.getRomantikStatisticalActivities();
            return { romantikServiceData: romantikServiceData ?? [] };
          },
        },
        {
          path: "rekap-data",
          Component: RekapData,
          loader: async () => {
            const { data: libraryServiceData } = await api.libraryService.getLibraryServiceData();
            const { data: romantikServiceData } = await api.romantikService.getRomantikStatisticalActivities();
            const { data: statisticalTransactions } = await api.silastikService.getStatisticalTransactions();

            return {
              statisticalTransactions: statisticalTransactions ?? [],
              libraryServiceData: libraryServiceData ?? [],
              romantikServiceData: romantikServiceData ?? [],
            };
          },
        },
        {
          path: "ekstraksi-data",
          Component: EkstraksiData,
        },
      ],
    },
    {
      path: "/login",
      Component: Login,
      loader: async () => {
        const isAuthenticated = await getSession();

        return isAuthenticated ? redirect("/") : null;
      },
    },
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}
