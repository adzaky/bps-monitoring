import { useState } from "react";
import { useLoaderData } from "react-router";
import { FileText, Import, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecapData } from "@/hooks/use-recap-data";
import { exportPdfFromJson, exportToExcel } from "@/lib/utils";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import RecapDataTable from "@/components/RecapDataTable";

export default function RekapData() {
  const [isExportingToSpreadsheet, setIsExportingToSpreadsheet] = useState(false);
  const [isExportingToXlsx, setIsExportingToXlsx] = useState(false);
  const [isExportingToPdf, setIsExportingToPdf] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [filters, setFilters] = useState({
    jenis_layanan: "",
    capaian: "",
    petugas: "",
  });

  const { statisticalTransactions, libraryServiceData, romantikServiceData } = useLoaderData();
  const { data } = useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData);

  const handleExportData = async (type) => {
    const exportData = filteredData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));

    try {
      switch (type) {
        case "spreadsheet":
          setIsExportingToSpreadsheet(true);
          await postJsonToGoogleAppScript(exportData).then((res) =>
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
          exportToExcel(exportData, "Rekap Transaksi Layanan BPS.xlsx", "Transaksi Layanan");
          break;
        case "pdf":
          setIsExportingToPdf(true);
          exportPdfFromJson(exportData, "Laporan Transaksi Layanan BPS", "Rekap Transaksi Layanan BPS.pdf", [
            "No",
            "ID Transaksi",
            "Nama Pengguna",
            "Jenis Layanan",
            "Keterangan",
            "Tanggal Permintaan",
            "Tanggal Selesai",
            "Capaian",
            "Petugas",
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

  // Get unique values for select filters
  const getUniqueValues = (columnKey) => {
    const values = data.map((item) => item[columnKey]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setDateRange({
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(),
    });
    setFilters({
      jenis_layanan: "",
      capaian: "",
      petugas: "",
    });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleFilterChange = (columnKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  // Filter and search data
  const filteredData = data.filter((item) => {
    // Global search across all columns (except 'no')
    const searchColumns = [
      "id_transaksi",
      "nama_pengguna",
      "jenis_layanan",
      "keterangan",
      "tanggal_permintaan",
      "tanggal_selesai",
      "capaian",
      "petugas",
    ];
    const matchesSearch =
      !searchTerm ||
      searchColumns.some((column) => {
        const value = item[column]?.toString().toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
      });

    // Date range filter
    const matchesDateRange = (() => {
      if (!dateRange?.from || !dateRange?.to || !item.tanggal_permintaan) {
        return true;
      }

      const itemDate = new Date(item.tanggal_permintaan);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);

      // Set time to start/end of day for proper comparison
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      return itemDate >= fromDate && itemDate <= toDate;
    })();

    // Specific filters
    const matchesFilters = Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return item[key] === filters[key];
    });

    return matchesSearch && matchesDateRange && matchesFilters;
  });

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Rekapitulasi</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua produk layanan</p>
      </div>

      <Tabs
        value={filters.jenis_layanan || "all"}
        onValueChange={(value) => handleFilterChange("jenis_layanan", value === "all" ? "" : value)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="all">Semua Jenis Layanan</TabsTrigger>
          {getUniqueValues("jenis_layanan").map((value) => (
            <TabsTrigger key={value} value={value}>
              {value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Global Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pencarian</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Cari Data Berdasarkan Semua Kolom ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Other Filters */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Permintaan</label>
              <DateRangePicker className="w-80" onChange={handleDateRangeChange} placeholder="Pilih Rentang Tanggal" />
            </div>

            {/* Capaian Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Capaian</label>
              <Select
                value={filters.capaian}
                onValueChange={(value) => handleFilterChange("capaian", value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Pilih Capaian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Capaian</SelectItem>
                  {getUniqueValues("capaian").map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Petugas Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Petugas</label>
              <Select
                value={filters.petugas}
                onValueChange={(value) => handleFilterChange("petugas", value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Pilih Petugas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Petugas</SelectItem>
                  {getUniqueValues("petugas").map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-auto">
              <X className="mr-2 h-4 w-4" />
              Clear Filter
            </Button>
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
        </div>
      </div>

      <RecapDataTable data={filteredData} />
    </div>
  );
}
