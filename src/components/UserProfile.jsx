import React from "react";
import { useNavigate } from "react-router";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthLogout, useAuthUser } from "@/hooks/use-queries";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isPending } = useAuthUser();
  const { logout } = useAuthLogout({ onSuccess: () => navigate("/login") });

  const handleLogout = async () => {
    await logout();
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-muted h-8 w-8 animate-pulse rounded-full"></div>
        <div className="bg-muted h-4 w-20 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!user) return null;

  const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  const displayNameRaw = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const displayName = capitalize(displayNameRaw);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto items-center gap-2 px-2 py-1">
          <div className="text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-sm font-medium">
            <User />
          </div>
          <span className="text-primary hidden text-sm font-medium hover:text-blue-700 sm:inline-block">
            Selamat Datang, <strong>{displayName}</strong>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{displayName}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="text-destructive mr-2 h-4 w-4" />
          <span className="text-destructive">Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
