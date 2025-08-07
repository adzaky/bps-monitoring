import React from "react";
import { useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useRecapData } from "@/hooks/use-recap-data";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import RecapDataTable from "@/components/RecapDataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Area, AreaChart, XAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeChart, setActiveChart] = React.useState("targetMetPercentage");
  const [selectedServiceType, setSelectedServiceType] = React.useState("all");
  const { statisticalTransactions, libraryServiceData, romantikServiceData } = useLoaderData();
  const { data } = useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData);

  // Get unique service types
  const serviceTypes = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const types = [...new Set(data.map((item) => item.jenis_layanan))];
    return types.filter(Boolean).sort();
  }, [data]);

  // Filter data based on selected service type
  const filteredData = React.useMemo(() => {
    if (!data || selectedServiceType === "all") return data || [];
    return data.filter((item) => item.jenis_layanan === selectedServiceType);
  }, [data, selectedServiceType]);

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!filteredData || filteredData.length === 0)
      return { total: 0, sesuaiTarget: 0, tidakSesuaiTarget: 0, persentaseSesuaiTarget: 0 };

    const total = filteredData.length;
    const sesuaiTarget = filteredData.filter((item) => item.capaian === "Sesuai Target").length;
    const tidakSesuaiTarget = total - sesuaiTarget;
    const persentaseSesuaiTarget = total > 0 ? Math.round((sesuaiTarget / total) * 100) : 0;

    return { total, sesuaiTarget, tidakSesuaiTarget, persentaseSesuaiTarget };
  }, [filteredData]);

  const chartData = React.useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    // Group by month from tanggal_permintaan
    const monthlyData = {};

    filteredData.forEach((item) => {
      if (!item.tanggal_permintaan) return;

      const [, month, year] = item.tanggal_permintaan.split("/");
      const monthKey = `${year}-${month.padStart(2, "0")}`;
      const dateKey = new Date(year, month - 1, 1).toISOString();

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          date: dateKey,
          month: new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
          total: 0,
          targetMet: 0,
          targetNotMet: 0,
        };
      }

      monthlyData[monthKey].total++;
      if (item.capaian === "Sesuai Target") {
        monthlyData[monthKey].targetMet++;
      } else {
        monthlyData[monthKey].targetNotMet++;
      }
    });

    // Convert to array and calculate percentages
    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        targetMetPercentage: item.total > 0 ? Math.round((item.targetMet / item.total) * 100) : 0,
        targetNotMetPercentage: item.total > 0 ? Math.round((item.targetNotMet / item.total) * 100) : 0,
      }));
  }, [filteredData]);

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

  const chartConfig = {
    targetMetPercentage: {
      label: "Sesuai Target (%)",
      color: "#34C759", // green
    },
    targetNotMetPercentage: {
      label: "Tidak Sesuai Target (%)",
      color: "#F56565", // red
    },
    targetMet: {
      label: "Jumlah Sesuai Target",
      color: "#718096", // blue
    },
    targetNotMet: {
      label: "Jumlah Tidak Sesuai Target",
      color: "#F7DC6F", // yellow
    },
    total: {
      label: "Total Transaksi",
      color: "#90CDF4", // teal
    },
  };

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua transaksi layanan</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="service-type" className="text-md font-bold">
              Jenis Layanan:
            </label>
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger id="service-type" className="w-[280px]">
                <SelectValue placeholder="Pilih jenis layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-md">
          Menampilkan data untuk:{" "}
          <span className="font-bold">{selectedServiceType === "all" ? "Semua Layanan" : selectedServiceType}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">
              {selectedServiceType === "all" ? "Total Transaksi" : `Total ${selectedServiceType}`}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="m22 21-3-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.total}</div>
            <p className="text-muted-foreground text-xs">
              {selectedServiceType === "all"
                ? "Total transaksi semua layanan"
                : `Total transaksi ${selectedServiceType.toLowerCase()}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Sesuai Target</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryMetrics.sesuaiTarget}</div>
            <p className="text-muted-foreground text-xs">Transaksi yang memenuhi target waktu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Tidak Sesuai Target</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryMetrics.tidakSesuaiTarget}</div>
            <p className="text-muted-foreground text-xs">Transaksi yang tidak memenuhi target waktu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Persentase Capaian</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M12 2v20m8-10H4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.persentaseSesuaiTarget}%</div>
            <p className="text-muted-foreground text-xs">Tingkat pencapaian target secara keseluruhan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium">
              {selectedServiceType === "all"
                ? "Grafik Capaian Transaksi Bulanan - Semua Layanan"
                : `Grafik Capaian Transaksi Bulanan - ${selectedServiceType}`}
            </h3>
            <p className="text-muted-foreground text-sm">
              {selectedServiceType === "all"
                ? "Statistik pencapaian target semua jenis layanan per bulan"
                : `Statistik pencapaian target layanan ${selectedServiceType.toLowerCase()} per bulan`}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="targetMetPercentage">Persentase Sesuai Target</TabsTrigger>
              <TabsTrigger value="targetMet">Jumlah Sesuai Target</TabsTrigger>
              <TabsTrigger value="total">Total Transaksi</TabsTrigger>
            </TabsList>

            <TabsContent value="targetMetPercentage" className="mt-4">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        nameKey="targetMetPercentage"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("id-ID", {
                            month: "long",
                            year: "numeric",
                          });
                        }}
                        formatter={(value) => [`${value}% `, "Sesuai Target"]}
                      />
                    }
                  />
                  <Area
                    dataKey="targetMetPercentage"
                    type="monotone"
                    stroke={chartConfig.targetMetPercentage.color}
                    fill={chartConfig.targetMetPercentage.color}
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="targetMet" className="mt-4">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        nameKey="targetMet"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("id-ID", {
                            month: "long",
                            year: "numeric",
                          });
                        }}
                        formatter={(value) => [`${value} Transaksi `, "Sesuai Target"]}
                      />
                    }
                  />
                  <Area
                    dataKey="targetMet"
                    type="monotone"
                    stroke={chartConfig.targetMet.color}
                    fill={chartConfig.targetMet.color}
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="total" className="mt-4">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        nameKey="total"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("id-ID", {
                            month: "long",
                            year: "numeric",
                          });
                        }}
                        formatter={(value) => [`${value} Transaksi `, "Total"]}
                      />
                    }
                  />
                  <Area
                    dataKey="total"
                    type="monotone"
                    stroke={chartConfig.total.color}
                    fill={chartConfig.total.color}
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button onClick={handleExportData} disabled={isLoading} className="w-full">
        {isLoading ? "Exporting..." : "Export Recapitulation Data to Spreadsheet"}
      </Button>

      <div>
        <RecapDataTable data={data} />
      </div>
    </div>
  );
}
