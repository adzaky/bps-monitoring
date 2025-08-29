import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Error } from "@/components/ui/error";
import { FileText, Import, Search, Activity, Star, CheckCircle, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { exportPdfFromJson, exportToExcel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RomantikServiceTable from "@/components/RomantikServiceTable";
import { useRomantikStatisticalActivities, useSheetRecapData } from "@/hooks/use-queries";

export default function RekomendasiStatistik() {
  const [isExportingToSpreadsheet, setIsExportingToSpreadsheet] = useState(false);
  const [isExportingToXlsx, setIsExportingToXlsx] = useState(false);
  const [isExportingToPdf, setIsExportingToPdf] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterSubmissionStatus, setFilterSubmissionStatus] = useState("all");
  const [filterRecommendationStatus, setFilterRecommendationStatus] = useState("all");

  // Filter data
  const {
    data: romantikServiceData,
    isPending: isPendingRomantikService,
    error: errorRomantikService,
  } = useRomantikStatisticalActivities();
  const { mutateAsync: mutateSheetRecap } = useSheetRecapData();

  if (isPendingRomantikService) {
    return (
      <div className="flex w-full items-center justify-center bg-white py-96">
        <Loading />
      </div>
    );
  }

  if (errorRomantikService) {
    return <Error error={errorRomantikService} type="database" size="lg" showRetry={false} />;
  }

  const filteredData = (romantikServiceData || []).filter((activity) => {
    const matchesSearch =
      activity.activity_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.submitted_by && activity.submitted_by.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.processed_by && activity.processed_by.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.transaction_number && activity.transaction_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.recommendation_number &&
        activity.recommendation_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesYear = filterYear === "all" || activity.activity_year === filterYear;
    const matchesSubmissionStatus =
      filterSubmissionStatus === "all" || activity.submission_status === filterSubmissionStatus;
    const matchesRecommendationStatus =
      filterRecommendationStatus === "all" || activity.recommendation_status === filterRecommendationStatus;

    return matchesSearch && matchesYear && matchesSubmissionStatus && matchesRecommendationStatus;
  });

  const handleExportData = async (type) => {
    const exportData = filteredData.map((item, index) => ({
      no: index + 1,
      activity_title: item.activity_title,
      organizer: item.organizer,
      activity_year: item.activity_year,
      submitted_by: item.submitted_by,
      revision_date: item.revision_date ? item.revision_date : "-",
      completion_date: item.completion_date ? item.completion_date : "-",
      examination_process: item.examination_process ? item.examination_process : "-",
      rating: item.rating > 0 ? item.rating : "-",
      commitment_letter: item.commitment_letter ? item.commitment_letter : "-",
    }));

    try {
      switch (type) {
        case "spreadsheet":
          setIsExportingToSpreadsheet(true);
          await mutateSheetRecap({ data: exportData, title: "Laporan Rekomendasi Statistik" }).then((res) =>
            toast(
              <div className="grid gap-1">
                <span className="font-semibold">Data berhasil diekspor ke Google Sheets!</span>
                <a href={res.data.url} target="_blank" className="text-sm text-blue-600 underline">
                  {res.data.url}
                </a>
              </div>
            )
          );
          break;
        case "xlsx":
          setIsExportingToXlsx(true);
          exportToExcel(exportData, "Laporan Rekomendasi Statistik.xlsx", "Rekomendasi Statistik");
          break;
        case "pdf":
          setIsExportingToPdf(true);
          exportPdfFromJson(
            exportData,
            "Laporan Rekomendasi Statistik",
            "Laporan Rekomendasi Statistik.pdf",
            [
              "No",
              "Judul Kegiatan",
              "Penyelenggara",
              "Tahun Kegiatan",
              "Tgl. Pengajuan",
              "Tgl. Perbaikan Terakhir",
              "Tgl. Selesai",
              "Proses Pemeriksaan",
              "Rating",
              "Surat Komitmen",
            ],
            {
              columnWidths: [10, 40, 40, 15, 30, 30, 30, 30, 20, 30],
              orientation: "landscape",
            }
          );
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
  const totalActivities = romantikServiceData.length;
  const completedActivities = romantikServiceData.filter((a) => a.submission_status === "selesai").length;
  const approvedActivities = romantikServiceData.filter((a) => a.recommendation_status === "layak").length;
  const averageRating =
    romantikServiceData.filter((a) => a.rating > 0).reduce((sum, a) => sum + a.rating, 0) /
    romantikServiceData.filter((a) => a.rating > 0).length;

  // Get unique years for filter
  const uniqueYears = [...new Set(romantikServiceData.map((a) => a.activity_year))].sort();

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Rekomendasi Kegiatan Statistik</h1>
        <p className="text-muted-foreground">Kelola dan pantau rekomendasi kegiatan statistik dari berbagai instansi</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalActivities}</p>
                <p className="text-muted-foreground text-sm">Total Kegiatan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedActivities}</p>
                <p className="text-muted-foreground text-sm">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{approvedActivities}</p>
                <p className="text-muted-foreground text-sm">Direkomendasikan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{averageRating ? averageRating.toFixed(1) : "-"}</p>
                <p className="text-muted-foreground text-sm">Rata-rata Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kegiatan Statistik</CardTitle>
          <CardDescription>Rekomendasi kegiatan statistik dari berbagai instansi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter dan Search */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Cari judul, penyelenggara, nomor transaksi, nomor rekomendasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSubmissionStatus} onValueChange={setFilterSubmissionStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status Pengajuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="revisi">Revisi</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRecommendationStatus} onValueChange={setFilterRecommendationStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status Rekomendasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Rekomendasi</SelectItem>
                <SelectItem value="layak">Layak</SelectItem>
                <SelectItem value="perlu perbaikan">Perlu Perbaikan</SelectItem>
                <SelectItem value="dalam review">Dalam Review</SelectItem>
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

          <RomantikServiceTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
