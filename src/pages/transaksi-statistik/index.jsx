import { useState } from "react";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { List, Search, CheckCircle, XOctagon } from "lucide-react";
import StatisticalTransactionTable from "@/components/StatisticalTransactionTable";

export default function TransaksiStatistik() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOperator, setFilterOperator] = useState("all");
  const [filterNeedType, setFilterNeedType] = useState("all");

  // Filter data
  const { statisticalTransactions } = useLoaderData();
  const filteredData = statisticalTransactions.filter((visit) => {
    const { statusText } = statisticalTransactions.reduce((acc, visit) => {
      const parts = visit.status.split(": ");
      acc[visit.status] = { statusText: parts[0] || "", rating: parts[1] || "0" };
      return acc;
    }, {})[visit.status];
    const matchesSearch =
      visit.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.detail.customer_detail.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || statusText.toLowerCase() === filterStatus.toLowerCase();
    const matchesNeedType = filterNeedType === "all" || visit.need_type.includes(filterNeedType);
    const matchesOperator = filterOperator === "all" || visit.main_operator.includes(filterOperator);

    return matchesSearch && matchesStatus && matchesNeedType && matchesOperator;
  });

  // Statistik
  const totalVisits = statisticalTransactions.length;
  const completedVisits = statisticalTransactions.filter((v) => v.status.toLowerCase().includes("selesai")).length;
  const canceledVisits = statisticalTransactions.filter((v) => v.status.toLowerCase().includes("batal")).length;

  // Get unique operators and need types
  const uniqueOperators = [...new Set(statisticalTransactions.map((v) => v.main_operator).filter(Boolean))];
  const uniqueNeedTypes = [...new Set(statisticalTransactions.map((v) => v.need_type))].sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Transaksi Statistik</h1>
        <p className="text-muted-foreground">Kelola dan pantau data transaksi statistik pelanggan</p>
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
          <CardTitle>Daftar Transaksi Statistik</CardTitle>
          <CardDescription>Data transaksi statistik pelanggan</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter dan Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
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

            <Select value={filterNeedType} onValueChange={setFilterNeedType}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Jenis Keperluan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Keperluan</SelectItem>
                {uniqueNeedTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
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

          <StatisticalTransactionTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
