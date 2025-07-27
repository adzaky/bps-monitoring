import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/dashboard";
import KonsultasiStatistik from "./pages/konsultasi-statistik";
import Login from "./pages/login";
import supabase from "./lib/supabase";

export default function App() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!session;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout isAuthenticated={isAuthenticated} />,
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
