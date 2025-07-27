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

const SIDEBAR_NAV = [
  {
    label: "Produk Layanan",
    items: [
      {
        title: "Konsultasi Statistik",
        url: "/konsultasi-statistik",
      },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const { pathname } = window.location;

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
        <Button>Keluar</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
