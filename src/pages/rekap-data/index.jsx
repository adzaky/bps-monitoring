import { useLoaderData } from "react-router";
import RecapDataTable from "@/components/RecapDataTable";
import { useRecapData } from "@/hooks/use-recap-data";


export default function RekapData() {
  const { statisticalTransactions, libraryServiceData, romantikServiceData } = useLoaderData();
  const { data } = useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData);

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Rekapitulasi</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua produk layanan</p>
      </div>

      <RecapDataTable data={data} />
    </div>
  );
}
