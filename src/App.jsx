import React from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import { api } from "./services/api";
import supabase from "./lib/supabase";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import LayananPerpustakaan from "./pages/layanan-perpustakaan";
import RekomendasiStatistik from "./pages/rekomendasi-statistik";
import TransaksiStatistik from "./pages/transaksi-statistik";
import EkstraksiData from "./pages/ekstraksi-data";

import { statisticalTransactions } from "./constants/data";
import RekapData from "./pages/rekap-data";

export default function App() {
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

            return { statisticalTransactions, libraryServiceData, romantikServiceData };
          },
        },
        {
          path: "transaksi-statistik",
          Component: TransaksiStatistik,
          loader: async () => {
            return { statisticalTransactions };
          },
        },
        {
          path: "layanan-perpustakaan",
          Component: LayananPerpustakaan,
          loader: async () => {
            const { data: libraryServiceData } = await api.libraryService.getLibraryServiceData();
            return { libraryServiceData };
          },
        },
        {
          path: "rekomendasi-statistik",
          Component: RekomendasiStatistik,
          loader: async () => {
            const { data: romantikServiceData } = await api.romantikService.getRomantikStatisticalActivities();
            return { romantikServiceData };
          },
        },
        {
          path: "rekap-data",
          Component: RekapData,
          loader: async () => {
            const { data: libraryServiceData } = await api.libraryService.getLibraryServiceData();
            const { data: romantikServiceData } = await api.romantikService.getRomantikStatisticalActivities();

            return { statisticalTransactions, libraryServiceData, romantikServiceData };
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

  return <RouterProvider router={router} />;
}
