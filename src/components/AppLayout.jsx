import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-scroll p-3">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
