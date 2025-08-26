import { useState } from "react";
import { useLoaderData } from "react-router";
import { BookOpen, FileText, GraduationCap, Import, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportPdfFromJson, exportToExcel } from "@/lib/utils";
import { postJsonToGoogleAppScript } from "@/services/sheet";
import LibraryServiceTable from "@/components/LibraryServiceTable";

export default function LibraryService() {
  const [isExportingToSpreadsheet, setIsExportingToSpreadsheet] = useState(false);
  const [isExportingToXlsx, setIsExportingToXlsx] = useState(false);
  const [isExportingToPdf, setIsExportingToPdf] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedia, setFilterMedia] = useState("all");
  const [filterEducation, setFilterEducation] = useState("all");

  const { libraryServiceData } = useLoaderData();

  const filteredData = libraryServiceData
    .filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.job.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMedia = filterMedia === "all" || record.service_media === filterMedia;
      const matchesEducation = filterEducation === "all" || record.education === filterEducation;

      return matchesSearch && matchesMedia && matchesEducation;
    })
    .sort((a, b) => (new Date(b.visit_date_time) < new Date(a.visit_date_time) ? -1 : 1));

  const handleExportData = async (type) => {
    const exportData = filteredData.map((item, index) => ({
      no: index + 1,
      name: item.name,
      gender: item.gender === "L" ? "Laki-laki" : "Perempuan",
      birthyear: item.birthyear,
      email: item.email,
      phone: item.phone,
      education: item.education,
      job: item.job || "-",
      visit_datetime: item.visit_datetime,
      service_media: item.service_media,
      book_access_count: item.book_access_count === "-" ? "-" : item.book_access_count.split("(Lihat)")[0],
    }));

    try {
      switch (type) {
        case "spreadsheet":
          setIsExportingToSpreadsheet(true);
          await postJsonToGoogleAppScript(exportData, "Laporan Layanan Perpustakaan").then((res) =>
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
          exportToExcel(exportData, "Laporan Layanan Perpustakaan.xlsx", "Layanan Perpustakaan");
          break;
        case "pdf":
          setIsExportingToPdf(true);
          exportPdfFromJson(
            exportData,
            "Laporan Layanan Perpustakaan",
            "Laporan Layanan Perpustakaan.pdf",
            [
              "No",
              "Nama Pengguna",
              "Jenis Kelamin",
              "Tahun Lahir",
              "Email",
              "Telepon",
              "Pendidikan",
              "Pekerjaan",
              "Waktu Kunjungan",
              "Media Layanan",
              "Jumlah Akses Buku",
            ],
            {
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
  const totalVisitors = libraryServiceData.length;
  const digitalUsers = libraryServiceData.filter((r) => r.service_media === "Digilib").length;
  const printUsers = libraryServiceData.filter((r) => r.service_media === "Tercetak").length;
  const studentsCount = libraryServiceData.filter((r) => r.job === "Pelajar/Mahasiswa").length;

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Pelayanan Perpustakaan</h1>
        <p className="text-muted-foreground">Kelola dan pantau data pengunjung dan layanan perpustakaan</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalVisitors}</p>
                <p className="text-muted-foreground text-sm">Total Pengunjung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{digitalUsers}</p>
                <p className="text-muted-foreground text-sm">Pengguna Digital</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{printUsers}</p>
                <p className="text-muted-foreground text-sm">Pengguna Tercetak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{studentsCount}</p>
                <p className="text-muted-foreground text-sm">Pelajar/Mahasiswa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelayanan Perpustakaan</CardTitle>
          <CardDescription>Data pengunjung dan layanan yang digunakan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter dan Search */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Cari nama, email, atau pekerjaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterMedia} onValueChange={setFilterMedia}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Media" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Media</SelectItem>
                <SelectItem value="Tercetak">Tercetak</SelectItem>
                <SelectItem value="Digilib">Digital</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterEducation} onValueChange={setFilterEducation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Pendidikan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pendidikan</SelectItem>
                <SelectItem value="<= SLTA">≤ SLTA</SelectItem>
                <SelectItem value="S1">S1</SelectItem>
                <SelectItem value="S2">S2</SelectItem>
                <SelectItem value="S3">S3</SelectItem>
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

          {/* Tabel Data */}
          <LibraryServiceTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
