import React from "react";
import { Link, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import supabase from "@/lib/supabase";
import { SIDEBAR_NAV } from "@/constants/menu";

export function AppSidebar({ ...props }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();
  const { pathname } = window.location;

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

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
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-bps.png" alt="BPS Monitoring" width={48} height={48} />
          <span className="text-sm leading-5 font-medium text-blue-700">
            <strong className="text-base text-blue-900">Monitoring</strong>
            <br />
            Badan Pusat Statistik
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_NAV.map((nav) => (
          <SidebarGroup key={nav.title}>
            <SidebarGroupLabel className="tracking-wider uppercase">{nav.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="h-auto transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-indigo-500 data-[active=true]:text-white data-[active=true]:shadow-md dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                    >
                      <Link to={item.url}>
                        <item.icon className="size-4 shrink-0" />
                        <div className="leading-normal text-pretty">{item.label}</div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-border/40 border-t bg-gradient-to-r from-red-50 to-pink-50 p-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-red-500 to-red-600 font-medium shadow-sm transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-md disabled:opacity-50"
        >
          <LogOut className="mr-1 size-4" />
          {!isLoading ? "Keluar" : "Loading..."}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
