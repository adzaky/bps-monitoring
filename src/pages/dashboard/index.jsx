import React from "react";
import { useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";

import { useRecapData } from "@/hooks/use-recap-data";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import RecapDataTable from "@/components/RecapDataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeChart, setActiveChart] = React.useState("targetMetPercentage");
  const { statisticalTransactions, libraryServiceData, romantikServiceData } = useLoaderData();
  const { data } = useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData);

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!data || data.length === 0)
      return { total: 0, sesuaiTarget: 0, tidakSesuaiTarget: 0, persentaseSesuaiTarget: 0 };

    const total = data.length;
    const sesuaiTarget = data.filter((item) => item.capaian === "Sesuai Target").length;
    const tidakSesuaiTarget = total - sesuaiTarget;
    const persentaseSesuaiTarget = total > 0 ? Math.round((sesuaiTarget / total) * 100) : 0;

    return { total, sesuaiTarget, tidakSesuaiTarget, persentaseSesuaiTarget };
  }, [data]);

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group by month from tanggal_permintaan
    const monthlyData = {};

    data.forEach((item) => {
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
  }, [data]);

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
      color: "var(--chart-1)",
    },
    targetNotMetPercentage: {
      label: "Tidak Sesuai Target (%)",
      color: "var(--chart-2)",
    },
    targetMet: {
      label: "Jumlah Sesuai Target",
      color: "var(--chart-3)",
    },
    targetNotMet: {
      label: "Jumlah Tidak Sesuai Target",
      color: "var(--chart-4)",
    },
    total: {
      label: "Total Transaksi",
      color: "var(--chart-5)",
    },
  };

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua transaksi layanan</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Transaksi Statistik</h3>
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
            <p className="text-muted-foreground text-xs">Total transaksi statistik tercatat</p>
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
            <h3 className="text-lg font-medium">Grafik Capaian Transaksi Statistik Bulanan</h3>
            <p className="text-muted-foreground text-sm">
              Statistik pencapaian target layanan transaksi statistik per bulan
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
                <LineChart
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
                        formatter={(value) => [`${value}%`, "Sesuai Target"]}
                      />
                    }
                  />
                  <Line
                    dataKey="targetMetPercentage"
                    type="monotone"
                    stroke={chartConfig.targetMetPercentage.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="targetMet" className="mt-4">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <LineChart
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
                        formatter={(value) => [`${value} transaksi`, "Sesuai Target"]}
                      />
                    }
                  />
                  <Line
                    dataKey="targetMet"
                    type="monotone"
                    stroke={chartConfig.targetMet.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="total" className="mt-4">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <LineChart
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
                        formatter={(value) => [`${value} transaksi`, "Total"]}
                      />
                    }
                  />
                  <Line
                    dataKey="total"
                    type="monotone"
                    stroke={chartConfig.total.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
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
