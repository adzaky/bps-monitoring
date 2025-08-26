import { useState } from "react";
import { useLoaderData } from "react-router";
import { FileText, Import, List, Search, CheckCircle, XOctagon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportPdfFromJson, exportToExcel } from "@/lib/utils";
import StatisticalTransactionTable from "@/components/StatisticalTransactionTable";

export default function ProdukStatistik() {
  const [isExportingToSpreadsheet, setIsExportingToSpreadsheet] = useState(false);
  const [isExportingToXlsx, setIsExportingToXlsx] = useState(false);
  const [isExportingToPdf, setIsExportingToPdf] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOperator, setFilterOperator] = useState("all");
  const [filterNeedType, setFilterNeedType] = useState("all");

  // Filter data
  const { productStatistic } = useLoaderData();

  const filteredData = productStatistic.filter((visit) => {
    const { statusText } = productStatistic.reduce((acc, visit) => {
      const parts = visit.status?.split(": ") || [];
      acc[visit.status] = { statusText: parts[0] || "", rating: parts[1] || "0" };
      return acc;
    }, {})[visit.status] || { statusText: "" };

    const matchesSearch =
      (visit.customer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (visit.detail?.customer_details?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (visit.transaction_id?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || statusText.toLowerCase() === filterStatus.toLowerCase();
    const matchesNeedType = filterNeedType === "all" || (visit.need_type && visit.need_type.includes(filterNeedType));
    const matchesOperator =
      filterOperator === "all" || (visit.main_operator && visit.main_operator.includes(filterOperator));

    return matchesSearch && matchesStatus && matchesNeedType && matchesOperator;
  });

  const handleExportData = async (type) => {
    const exportData = filteredData.map((item, index) => ({
      no: index + 1,
      customer_name: item.customer_name,
      transaction_id: item.transaction_id,
      contact: `${item.detail?.customer_details?.email ?? ""} - ${item.detail?.customer_details?.phone ?? ""}`,
      need_type: item.need_type,
      request_date: item.request_date,
      completion_date: item.detail?.completion_date,
      operator: item.main_operator,
      status: item.status,
    }));

    try {
      switch (type) {
        case "spreadsheet":
          setIsExportingToSpreadsheet(true);
          await postJsonToGoogleAppScript(exportData, "Laporan Produk Statistik").then((res) =>
            toast(
              <div className="grid gap-1">
                <span className="font-semibold">Data berhasil diekspor ke Google Sheets!</span>
                <a href={res.url} target="_blank" className="text-sm text-blue-600 underline">
                  {res.url}
                </a>
              </div>
            )
          );
          break;
        case "xlsx":
          setIsExportingToXlsx(true);
          exportToExcel(exportData, "Laporan Produk Statistik.xlsx", "Produk Statistik");
          break;
        case "pdf":
          setIsExportingToPdf(true);
          exportPdfFromJson(exportData, "Laporan Produk Statistik", "Laporan Produk Statistik.pdf", [
            "No",
            "Nama Pengguna",
            "ID Transaksi",
            "Kontak",
            "Keperluan",
            "Tanggal Permintaan",
            "Tanggal Selesai",
            "Operator",
            "Status",
          ]);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Error exporting data:", err);
    } finally {
      setIsExportingToSpreadsheet(false);
      setIsExportingToXlsx(false);
      setIsExportingToPdf(false);
    }
  };

  // Statistik
  const totalVisits = productStatistic.length;
  const completedVisits = productStatistic.filter((v) => v.status?.toLowerCase().includes("selesai")).length;
  const canceledVisits = productStatistic.filter((v) => v.status?.toLowerCase().includes("batal")).length;

  // Get unique operators and need types
  const uniqueOperators = [...new Set(productStatistic.map((v) => v.main_operator).filter(Boolean))];
  const uniqueNeedTypes = [...new Set(productStatistic.map((v) => v.need_type).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Transaksi Produk Statistik Berbayar</h1>
        <p className="text-muted-foreground">Kelola dan pantau data transaksi produk statistik pelanggan</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <List className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalVisits}</p>
                <p className="text-muted-foreground text-sm">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedVisits}</p>
                <p className="text-muted-foreground text-sm">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XOctagon className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{canceledVisits}</p>
                <p className="text-muted-foreground text-sm">Batal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi Produk Statistik</CardTitle>
          <CardDescription>Data transaksi produk statistik pelanggan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab Filter Keperluan */}
          <div className="overflow-auto">
            <h3 className="mb-3 text-sm font-medium">Jenis Keperluan</h3>
            <Tabs value={filterNeedType} onValueChange={setFilterNeedType}>
              <ScrollArea>
                <TabsList className="mb-3 w-full">
                  <TabsTrigger value="all" className="text-xs whitespace-nowrap uppercase">
                    Semua
                  </TabsTrigger>
                  {uniqueNeedTypes.map((type) => (
                    <TabsTrigger key={type} value={type} className="text-xs whitespace-nowrap uppercase">
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" className="[&>div]:bg-muted-foreground" />
              </ScrollArea>
            </Tabs>
          </div>

          {/* Filter dan Search Lainnya */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Cari nama, email, atau ID transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="batal">Batal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOperator} onValueChange={setFilterOperator}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Operator</SelectItem>
                {uniqueOperators.map((operator) => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-x-2">
            <Button onClick={() => handleExportData("spreadsheet")} disabled={isExportingToSpreadsheet}>
              <Import /> {isExportingToSpreadsheet ? "Exporting..." : "Spreadsheet"}
            </Button>
            <Button onClick={() => handleExportData("xlsx")} disabled={isExportingToXlsx}>
              <FileText /> {isExportingToXlsx ? "Exporting..." : "Excel"}
            </Button>
            <Button onClick={() => handleExportData("pdf")} disabled={isExportingToPdf}>
              <FileText /> {isExportingToPdf ? "Exporting..." : "PDF"}
            </Button>
          </div>

          <StatisticalTransactionTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
