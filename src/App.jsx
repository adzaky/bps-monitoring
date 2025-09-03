import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import { LoadingScreen } from "./components/ui/loading-screen";
import { isAuthenticated } from "./lib/auth";

import {
  Dashboard,
  EkstraksiData,
  KonsultasiStatistik,
  LayananPerpustakaan,
  Login,
  ProdukStatistik,
  RekapData,
  RekomendasiStatistik,
} from "./constants/menu";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: AppLayout,
      HydrateFallback: LoadingScreen,
      loader: () => {
        return { isAuthenticated: isAuthenticated() };
      },
      children: [
        {
          index: true,
          Component: Dashboard,
        },
        {
          path: "konsultasi-statistik",
          Component: KonsultasiStatistik,
        },
        {
          path: "produk-statistik",
          Component: ProdukStatistik,
        },
        {
          path: "layanan-perpustakaan",
          Component: LayananPerpustakaan,
        },
        {
          path: "rekomendasi-statistik",
          Component: RekomendasiStatistik,
        },
        {
          path: "rekap-data",
          Component: RekapData,
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
      HydrateFallback: LoadingScreen,
      loader: () => {
        return { isAuthenticated: isAuthenticated() };
      },
    },
  ]);

  return <RouterProvider router={router} />;
}
