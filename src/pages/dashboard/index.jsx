import React from "react";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "@/components/WorkflowCard";
import { WORKFLOWS } from "@/constants/workflow";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import { calculateCapaian, formatDateToDDMMYYYY } from "@/lib/utils";

export default function Dashboard() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { statisticalTransactions, libraryServiceData, romantikServiceData } = useLoaderData();

  const handleExportData = async () => {
    setIsLoading(true);

    try {
      let data = [];
      let counter = 1;

      const generateRandomId = () => Math.floor(10000 + Math.random() * 90000);

      // Add statistical transactions data
      if (statisticalTransactions && statisticalTransactions.length > 0) {
        const statisticalData = statisticalTransactions.map((transaction) => {
          const mapServiceType = (needType) => {
            if (!needType) return "";

            if (needType.includes("Kunjungan langsung")) {
              return needType.includes("Permintaan Data") ? "Produk Statistik Berbayar" : "Konsultasi Langsung";
            }
            if (needType.includes("Layanan Online")) {
              return needType.includes("Permintaan Data") ? "Produk Statistik Berbayar" : "Konsultasi Online";
            }

            return "";
          };

          const mapKeterangan = (topic) => {
            if (!topic) return "";
            if (topic.includes("Data Mikro")) return "Data Mikro";
            return "";
          };

          const serviceType = mapServiceType(
            transaction.need_type || transaction.detail.onsite_visit_detail?.need_type
          );
          const keterangan = mapKeterangan(transaction.detail?.online_service_detail?.topic || "");
          const requestDate = transaction.request_date || transaction.detail.request_date;
          const formattedRequestDate = formatDateToDDMMYYYY(requestDate);
          const formattedCompletionDate = formatDateToDDMMYYYY(transaction.detail.completion_date);

          return {
            no: counter++,
            id_transaksi: `BPS-7200-SILASTIK-${generateRandomId()}`,
            nama_pengguna: transaction.customer_name,
            jenis_layanan: serviceType,
            keterangan: keterangan,
            tanggal_permintaan: formattedRequestDate,
            tanggal_selesai: formattedCompletionDate,
            capaian: calculateCapaian(serviceType, formattedRequestDate, formattedCompletionDate),
            petugas: transaction.main_operator,
          };
        });
        data = [...data, ...statisticalData];
      }

      // Add library service data
      if (libraryServiceData && libraryServiceData.length > 0) {
        const libraryData = libraryServiceData.map((record) => {
          const visitDate = record.visit_datetime || record.visit_date_time;
          const formattedRequestDate = formatDateToDDMMYYYY(visitDate);
          const formattedCompletionDate = formatDateToDDMMYYYY(visitDate);
          const jenisLayanan = "Perpustakaan";

          return {
            no: counter++,
            id_transaksi: `BPS-7200-PST-${generateRandomId()}`,
            nama_pengguna: record.name,
            jenis_layanan: jenisLayanan,
            keterangan: record.service_media === "Digilib" ? "Digital" : "Tercetak",
            tanggal_permintaan: formattedRequestDate,
            tanggal_selesai: formattedCompletionDate,
            capaian: calculateCapaian(jenisLayanan, formattedRequestDate, formattedCompletionDate),
            petugas: "",
          };
        });
        data = [...data, ...libraryData];
      }

      // Add romantik service data
      if (romantikServiceData && romantikServiceData.length > 0) {
        const romantikData = romantikServiceData.map((activity) => {
          const jenisLayanan = "Rekomendasi Statistik";
          const formattedRequestDate = formatDateToDDMMYYYY(activity.submission_date);
          const formattedCompletionDate = formatDateToDDMMYYYY(activity.completion_date);

          return {
            no: counter++,
            id_transaksi: `BPS-7200-ROMANTIK-${generateRandomId()}`,
            nama_pengguna: activity.organizer,
            jenis_layanan: jenisLayanan,
            keterangan: activity.activity_title?.substring(0, 50) + (activity.activity_title?.length > 50 ? "..." : ""),
            tanggal_permintaan: formattedRequestDate,
            tanggal_selesai: formattedCompletionDate,
            capaian: calculateCapaian(jenisLayanan, formattedRequestDate, formattedCompletionDate),
            petugas: "Ince Mariyani S.E., M.M.",
          };
        });
        data = [...data, ...romantikData];
      }

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {WORKFLOWS.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflowId={workflow.id}
            workflowName={workflow.name}
            workflowDescription={workflow.description}
            icon={workflow.icon}
            color={workflow.color}
          />
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Panduan Cepat</CardTitle>
          <CardDescription>Cara menggunakan dashboard ini</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-primary font-medium">1.</span>
            <span>Klik "Jalankan Workflow" pada kartu mana pun untuk memicu workflow tersebut</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-medium">2.</span>
            <span>Pantau pembaruan status dan progress secara real-time</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
