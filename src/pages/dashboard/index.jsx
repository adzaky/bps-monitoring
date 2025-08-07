import React from "react";
import { useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";

import { useRecapData } from "@/hooks/use-recap-data";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import RecapDataTable from "@/components/RecapDataTable";

export default function Dashboard() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { statisticalTransactions, libraryServiceData, romantikServiceData } = useLoaderData();
  const { data } = useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData);

  const handleExportData = async () => {
    setIsLoading(true);

    try {
      console.log("Exported data:", data);
      await postJsonToGoogleAppScript(
        "https://script.google.com/macros/s/AKfycbw6YazEmRwCDWmW4_qCnNikeEVQHRjxz7RXwVjOkApKSTdjn8QqYoGuAN-kPTAYdT4mdg/exec",
        data
      );
    } catch (err) {
      console.error("Error exporting data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua transaksi layanan</p>
      </div>

      <Button onClick={handleExportData} disabled={isLoading} className="w-full">
        {isLoading ? "Exporting..." : "Export Recapitulation Data to Spreadsheet"}
      </Button>

      <div>
        <RecapDataTable data={data} />
      </div>
    </div>
  );
}
