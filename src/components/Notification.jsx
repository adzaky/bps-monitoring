import { Link } from "react-router";
import { Bell, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useLatestData } from "@/hooks/use-queries";
import { useTimestampTracker } from "@/hooks/use-timestamp";

export default function Notification() {
  const { timestamp } = useTimestampTracker();
  const { data: latestData, refetch } = useLatestData(timestamp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative ml-auto bg-transparent">
          <Bell size={20} />
          {latestData && latestData.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-red-500 text-xs text-white" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-96 w-80 overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Data Terbaru</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-6 w-6 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Data list */}
        <div className="max-h-64 overflow-y-auto">
          {!latestData || latestData.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-sm">Belum ada data terbaru.</div>
          ) : (
            latestData.map((item, index) => (
              <DropdownMenuItem
                key={`${item.id || index}`}
                className="flex cursor-pointer flex-col items-start gap-2 p-3"
              >
                <div className="flex w-full items-center gap-2">
                  <Bell size={16} className="text-blue-500" />
                  <span className="text-muted-foreground text-xs">Data Terbaru</span>
                  <ChevronRight size={12} className="ml-auto" />
                </div>
                <div className="w-full">
                  <div className="truncate text-sm font-medium">
                    {item.name || item.activity_title || item.customer_name || "Data"}
                  </div>
                  <div className="text-muted-foreground truncate text-xs">
                    {item.created_at && new Date(item.created_at).toLocaleString("id-ID")}
                  </div>
                  <div className="text-muted-foreground mt-1 truncate text-xs">
                    {JSON.stringify(item, null, 2).slice(0, 100)}...
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
