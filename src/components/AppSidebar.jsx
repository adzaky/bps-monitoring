import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import { Button } from "./ui/button";
import supabase from "@/lib/supabase";
import { useNavigate } from "react-router";
import { Award, LayoutDashboard, Library } from "lucide-react";

const SIDEBAR_NAV = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Produk Layanan",
    items: [
      {
        label: "Layanan Perpustakaan",
        url: "/layanan-perpustakaan",
        icon: Library,
      },
      {
        label: "Rekomendasi Statistik",
        url: "/rekomendasi-statistik",
        icon: Award,
      },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();
  const { pathname } = window.location;

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      localStorage.removeItem("bps_user");
      navigate("/login");
    } catch (err) {
      console.error("Failed Logout", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavLink to="/">BPS Monitoring</NavLink>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_NAV.map((nav) => (
          <SidebarGroup key={nav.title}>
            <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="hover:bg-slate-500 hover:text-white data-[active=true]:bg-slate-600 data-[active=true]:text-white"
                    >
                      <NavLink to={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button variant="destructive" onClick={handleLogout}>
          {!isLoading ? "Keluar" : "Loading..."}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
