import { useState } from "react";
import { useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Activity, Star, CheckCircle, Award } from "lucide-react";
import RomantikServiceTable from "@/components/RomantikServiceTable";

export default function RekomendasiStatistik() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterSubmissionStatus, setFilterSubmissionStatus] = useState("all");
  const [filterRecommendationStatus, setFilterRecommendationStatus] = useState("all");

  // Filter data
  const { romantikServiceData } = useLoaderData();
  const filteredData = romantikServiceData.filter((activity) => {
    const matchesSearch =
      activity.activity_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.organizer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = filterYear === "all" || activity.activity_year === filterYear;
    const matchesSubmissionStatus =
      filterSubmissionStatus === "all" || activity.submission_status === filterSubmissionStatus;
    const matchesRecommendationStatus =
      filterRecommendationStatus === "all" || activity.recommendation_status === filterRecommendationStatus;

    return matchesSearch && matchesYear && matchesSubmissionStatus && matchesRecommendationStatus;
  });

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
        <CardContent>
          {/* Filter dan Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Cari judul kegiatan atau penyelenggara..."
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

          <RomantikServiceTable data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
