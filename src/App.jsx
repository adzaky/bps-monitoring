import React from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import supabase from "./lib/supabase";
import Dashboard from "./pages/dashboard";
import KonsultasiStatistik from "./pages/konsultasi-statistik";
import Login from "./pages/login";

import { consultationData } from "./constants";

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
        },
        {
          path: "konsultasi-statistik",
          Component: KonsultasiStatistik,
          loader: () => {
            return consultationData;
          },
        },
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
