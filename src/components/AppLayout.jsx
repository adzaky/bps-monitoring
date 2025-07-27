import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navigate, Outlet } from "react-router";

export default function AppLayout({ isAuthenticated }) {
  return !isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-scroll p-3">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
