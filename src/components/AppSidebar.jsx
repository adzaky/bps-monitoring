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

const SIDEBAR_NAV = [
  {
    label: "Produk Layanan",
    items: [
      {
        title: "Konsultasi Statistik",
        url: "/konsultasi-statistik",
      },
      {
        title: "Layanan Perpustakaan",
        url: "/layanan-perpustakaan",
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
          <SidebarGroup key={nav.label}>
            <SidebarGroupLabel>{nav.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.url)}
                      className="hover:bg-slate-500 hover:text-white data-[active=true]:bg-slate-600 data-[active=true]:text-white"
                    >
                      <NavLink to={item.url}>{item.title}</NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={handleLogout}>{!isLoading ? "Keluar" : "Loading..."}</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
