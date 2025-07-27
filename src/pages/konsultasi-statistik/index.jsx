import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { consultationData } from "@/constants";
import ConsultationTable from "@/components/ConsultationTable";

export default function KonsultasiStatistik() {
  const [activeTab, setActiveTab] = React.useState("all");

  const data = consultationData.sort((a, b) => new Date(b.tanggal_permintaan) - new Date(a.tanggal_permintaan));

  const groupDataByType = (data) => {
    return data.reduce((acc, item) => {
      const type = item.jenis_keperluan;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
  };

  const getPendingCount = (data) => {
    return data.filter((item) => item.status.toLowerCase() !== "selesai").length;
  };

  const groupedData = groupDataByType(data);
  const consultationTypes = Object.keys(groupedData);

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Konsultasi Statistik</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau semua konsultasi statistik berdasarkan jenis keperluan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Konsultasi</CardTitle>
          <CardDescription>Konsultasi dikelompokkan berdasarkan jenis keperluan layanan</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="relative">
                Semua
                {getPendingCount(consultationData) > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {getPendingCount(consultationData)}
                  </Badge>
                )}
              </TabsTrigger>
              {consultationTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="relative">
                  {type}
                  {getPendingCount(groupedData[type]) > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {getPendingCount(groupedData[type])}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Semua Konsultasi</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">Total: {consultationData.length} konsultasi</Badge>
                  <Badge variant="destructive">Belum Selesai: {getPendingCount(consultationData)}</Badge>
                </div>
              </div>
              <ConsultationTable data={consultationData} />
            </TabsContent>

            {consultationTypes.map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Konsultasi {type}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">Total: {groupedData[type].length} konsultasi</Badge>
                    {getPendingCount(groupedData[type]) > 0 && (
                      <Badge variant="destructive">Belum Selesai: {getPendingCount(groupedData[type])}</Badge>
                    )}
                  </div>
                </div>
                <ConsultationTable data={groupedData[type]} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
