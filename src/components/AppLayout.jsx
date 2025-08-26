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

export default function AppLayout() {
  const { isAuthenticated } = useLoaderData();

  return !isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <React.Suspense fallback={<LoadingScreen />}>
        <SidebarInset>
          <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground -ml-1 transition-colors" />
              <Separator orientation="vertical" className="h-6 data-[orientation=vertical]:h-6" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="hover:text-foreground font-medium transition-colors">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {window.location.pathname !== "/" && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-foreground font-medium">
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
            <div className="flex items-center">
              <Notification />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Outlet />
          </main>
          <footer className="bg-muted/30 mt-auto border-t px-6 py-4">
            <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:justify-between">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} BPS Sulawesi Tengah. All rights reserved.
              </p>
              <p className="text-muted-foreground/80 text-xs">Sistem Monitoring BPS</p>
            </div>
          </footer>
        </SidebarInset>
      </React.Suspense>
    </SidebarProvider>
  );
}
