import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/dashboard";
import KonsultasiStatistik from "./pages/konsultasi-statistik";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: AppLayout,
      children: [
        {
          index: true,
          Component: Dashboard,
        },
        {
          path: "konsultasi-statistik",
          Component: KonsultasiStatistik,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
