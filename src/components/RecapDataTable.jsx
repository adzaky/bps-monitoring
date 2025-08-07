import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import { Import } from "lucide-react";

export default function RecapDataTable({ data }) {
  const [isLoading, setIsLoading] = useState(false);
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

  const columns = [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "id_transaksi",
      header: "ID Transaksi",
      filterFn: "includesString",
    },
    {
      accessorKey: "nama_pengguna",
      header: "Nama Pengguna",
      filterFn: "includesString",
    },
    {
      accessorKey: "jenis_layanan",
      header: "Jenis Layanan",
      filterFn: "includesString",
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      filterFn: "includesString",
    },
    {
      accessorKey: "tanggal_permintaan",
      header: "Tanggal Permintaan",
      filterFn: "includesString",
    },
    {
      accessorKey: "tanggal_selesai",
      header: "Tanggal Selesai",
      filterFn: "includesString",
    },
    {
      accessorKey: "capaian",
      header: "Capaian",
      filterFn: "includesString",
    },
    {
      accessorKey: "petugas",
      header: "Petugas",
      filterFn: "includesString",
    },
  ];

  return (
    <div className="space-y-4">
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

        {/* Filters */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Permintaan</label>
              <DateRangePicker className="w-80" onChange={handleDateRangeChange} placeholder="Pilih Rentang Tanggal" />
            </div>

            {/* Jenis Layanan Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Layanan</label>
              <Select
                value={filters.jenis_layanan}
                onValueChange={(value) => handleFilterChange("jenis_layanan", value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Pilih Jenis Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis Layanan</SelectItem>
                  {getUniqueValues("jenis_layanan").map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <Button onClick={handleExportData} disabled={isLoading}>
            <Import /> {isLoading ? "Exporting..." : "Spreadsheet"}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
