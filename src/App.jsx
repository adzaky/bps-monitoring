import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/dashboard";
import KonsultasiStatistik from "./pages/konsultasi-statistik";
import Login from "./pages/login";

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
    {
      path: "/login",
      Component: Login,
    },
  ]);

  return <RouterProvider router={router} />;
}
