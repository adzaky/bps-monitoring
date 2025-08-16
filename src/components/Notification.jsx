import { Link } from "react-router";
import { Bell, RefreshCw, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNotifyData } from "@/hooks/use-notify-data";

export default function Notification() {
  const { changedList, markAllAsSeen, reload } = useNotifyData(
    ["pst_customer", "romantik_statistical", "silastik_transaction"],
    { pollMs: 180000 }
  );

  const menu = {
    pst_customer: { name: "Layanan Perpustakaan", href: "/layanan-perpustakaan" },
    romantik_statistical: { name: "Rekomendasi Statistik", href: "/rekomendasi-statistik" },
    silastik_transaction: { name: "Transaksi Statistik", href: "/transaksi-statistik" },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative ml-auto bg-transparent">
          <Bell size={20} />
          {changedList.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-red-500 text-xs text-white" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-96 w-80 overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifikasi</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={reload} className="h-6 w-6 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => markAllAsSeen()} className="h-6 w-6 p-0">
              <Check className="h-3 w-3" />
            </Button>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Rows list */}
        <div className="max-h-64 overflow-y-auto">
          {changedList.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-sm">Belum ada data baru.</div>
          ) : (
            changedList.map((data, index) => (
              <Link key={index} to={menu[data].href}>
                <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                  <span className="text-muted-foreground text-xs">Terdapat perubahan pada menu</span>
                  <div className="flex w-full items-center justify-between text-sm font-medium">
                    {menu[data].name} <ChevronRight size={16} />
                  </div>
                </DropdownMenuItem>
              </Link>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
