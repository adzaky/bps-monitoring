import { useState } from "react";
import { BookOpen, FileText, GraduationCap, Import, Search, Users, Building } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Error } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportPdfFromJson, exportToExcel } from "@/lib/utils";
import LibraryServiceTable from "@/components/LibraryServiceTable";
import { useLibraryServiceData, useSheetRecapData } from "@/hooks/use-queries";

export default function LibraryService() {
  const [isExportingToSpreadsheet, setIsExportingToSpreadsheet] = useState(false);
  const [isExportingToXlsx, setIsExportingToXlsx] = useState(false);
  const [isExportingToPdf, setIsExportingToPdf] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedia, setFilterMedia] = useState("all");
  const [filterEducation, setFilterEducation] = useState("all");
  const [filterType, setFilterType] = useState("individu");

  const {
    data: libraryServiceData,
    isPending: isPendingLibraryServiceData,
    error: errorLibraryServiceData,
  } = useLibraryServiceData();
  const { mutateAsync: mutateSheetRecap } = useSheetRecapData();

  if (isPendingLibraryServiceData) {
    return (
      <div className="flex w-full items-center justify-center bg-white py-96">
        <Loading />
      </div>
    );
  }

  if (errorLibraryServiceData) {
    return <Error error={errorLibraryServiceData} type="database" size="lg" showRetry={false} />;
  }

  const currentData = (libraryServiceData || []).filter((record) => record.type === filterType);

  const filteredData = currentData
    .filter((record) => {
      if (filterType === "individu") {
        const matchesSearch =
          record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.job.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMedia = filterMedia === "all" || record.service_media === filterMedia;
        const matchesEducation = filterEducation === "all" || record.education === filterEducation;

        return matchesSearch && matchesMedia && matchesEducation;
      } else {
        // For group type
        const matchesSearch =
          record.lead_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.group_category?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      }
    })
    .sort((a, b) => (new Date(b.visit_datetime) < new Date(a.visit_datetime) ? -1 : 1));

  const handleExportData = async (type) => {
    const exportData = filteredData.map((item, index) => {
      if (filterType === "individu") {
        return {
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
        };
      } else {
        return {
          no: index + 1,
          visit_datetime: item.visit_datetime,
          lead_group: item.lead_group,
          email: item.email,
          group_category: item.group_category,
          group_name: item.group_name,
          total_people: item.total_people,
        };
      }
    });

    const exportTitle =
      filterType === "individu" ? "Laporan Layanan Perpustakaan - Individu" : "Laporan Layanan Perpustakaan - Kelompok";

    const exportHeaders =
      filterType === "individu"
        ? [
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
          ]
        : ["No", "Waktu Kunjungan", "Pemimpin Kelompok", "Email", "Kategori Kelompok", "Nama Kelompok", "Jumlah Orang"];

    try {
      switch (type) {
        case "spreadsheet":
          setIsExportingToSpreadsheet(true);
          await mutateSheetRecap({ data: exportData, title: exportTitle }).then((res) =>
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
          exportToExcel(exportData, `${exportTitle}.xlsx`, "Layanan Perpustakaan");
          break;
        case "pdf":
          setIsExportingToPdf(true);
          exportPdfFromJson(exportData, exportTitle, `${exportTitle}.pdf`, exportHeaders, {
            orientation: "landscape",
          });
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
  const totalVisitors = currentData.length;
  const digitalUsers = filterType === "individu" ? currentData.filter((r) => r.service_media === "Digilib").length : 0; // Group tidak memiliki service_media
  const printUsers = filterType === "individu" ? currentData.filter((r) => r.service_media === "Tercetak").length : 0; // Group tidak memiliki service_media
  const studentsCount = filterType === "individu" ? currentData.filter((r) => r.job === "Pelajar/Mahasiswa").length : 0; // Group tidak memiliki job
  const totalPeopleInGroups =
    filterType === "group" ? currentData.reduce((sum, r) => sum + (parseInt(r.total_people) || 0), 0) : 0;

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Pelayanan Perpustakaan</h1>
        <p className="text-muted-foreground">Kelola dan pantau data pengunjung dan layanan perpustakaan</p>
      </div>

      <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individu">
            <Users className="mr-2 h-4 w-4" />
            Individu
          </TabsTrigger>
          <TabsTrigger value="group">
            <Building className="mr-2 h-4 w-4" />
            Kelompok (Group)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individu" className="space-y-6">
          {/* Statistik Cards untuk Individu */}
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
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          {/* Statistik Cards untuk Kelompok */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{totalVisitors}</p>
                    <p className="text-muted-foreground text-sm">Total Kelompok</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{totalPeopleInGroups}</p>
                    <p className="text-muted-foreground text-sm">Total Orang</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {totalVisitors > 0 ? Math.round(totalPeopleInGroups / totalVisitors) : 0}
                    </p>
                    <p className="text-muted-foreground text-sm">Rata-rata per Kelompok</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {filterType === "individu"
              ? "Daftar Pelayanan Perpustakaan - Individu"
              : "Daftar Pelayanan Perpustakaan - Kelompok"}
          </CardTitle>
          <CardDescription>
            {filterType === "individu"
              ? "Data pengunjung individu dan layanan yang digunakan"
              : "Data kunjungan kelompok ke perpustakaan"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter dan Search */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder={
                    filterType === "individu"
                      ? "Cari nama, email, atau pekerjaan..."
                      : "Cari nama kelompok, pemimpin, email, atau kategori..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filterType === "individu" && (
              <>
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
              </>
            )}
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
          <LibraryServiceTable data={filteredData} type={filterType} />
        </CardContent>
      </Card>
    </div>
  );
}
