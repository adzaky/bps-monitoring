import React from "react";
import { Navigate, Outlet } from "react-router";
import { useLoaderData } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Notification from "./Notification";
import UserProfile from "./UserProfile";

export default function AppLayout() {
  const { isAuthenticated } = useLoaderData();

  return !isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <React.Suspense fallback={<LoadingScreen />}>
        <SidebarInset>
          <header className="bg-sidebar sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-blue-200 px-4 shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 transition-colors hover:bg-blue-50 hover:text-blue-900" />
              <Separator orientation="vertical" className="h-6 bg-blue-300 data-[orientation=vertical]:h-6" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="font-medium transition-colors hover:text-blue-700">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {window.location.pathname !== "/" && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium hover:text-blue-900">
                          {window.location.pathname
                            .split("/")
                            .pop()
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-3">
              <Notification />
              <Separator orientation="vertical" className="h-6 bg-blue-300 data-[orientation=vertical]:h-6" />
              <UserProfile />
            </div>
          </header>
          <main className="space-y-4 p-4">
            <Outlet />
          </main>
          <footer className="bg-muted/30 mt-auto border-t border-blue-200 px-6 py-4">
            <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:justify-between">
              <p className="text-sm text-blue-700">
                © {new Date().getFullYear()} BPS Sulawesi Tengah. All rights reserved.
              </p>
              <p className="text-xs text-blue-600/80">Sistem Monitoring BPS</p>
            </div>
          </footer>
        </SidebarInset>
      </React.Suspense>
    </SidebarProvider>
  );
}
