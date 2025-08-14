import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Building,
  FileText,
  Download,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Activity,
  Award,
  Timer,
} from "lucide-react";

export default function RomantikServiceDetail({ activity, isOpen, onClose }) {
  if (!activity) return null;

  const handleDownloadCommitment = () => {
    if (activity.commitment_letter) {
      window.open(activity.commitment_letter, "_blank");
    }
  };

  const formatDate = (dateString) => {
    if (dateString === "-") return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSubmissionStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Selesai
          </Badge>
        );
      case "revisi":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Revisi
          </Badge>
        );
      case "menunggu":
        return (
          <Badge variant="destructive">
            <Clock className="mr-1 h-3 w-3" />
            Menunggu
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRecommendationStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "layak":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Award className="mr-1 h-3 w-3" />
            Layak
          </Badge>
        );
      case "perlu perbaikan":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Perlu Perbaikan
          </Badge>
        );
      case "dalam review":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Clock className="mr-1 h-3 w-3" />
            Dalam Review
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRatingBadge = (rating) => {
    if (rating === 0) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Belum Dinilai
        </Badge>
      );
    } else if (rating >= 16) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Star className="mr-1 h-3 w-3" />
          Sangat Baik ({rating})
        </Badge>
      );
    } else if (rating >= 12) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <Star className="mr-1 h-3 w-3" />
          Baik ({rating})
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Star className="mr-1 h-3 w-3" />
          Cukup ({rating})
        </Badge>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Detail Rekomendasi Kegiatan Statistik
            </div>
          </DialogTitle>
          <DialogDescription>Informasi lengkap kegiatan statistik dan rekomendasi</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informasi Kegiatan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Informasi Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm font-medium">Judul Kegiatan</Label>
                <p className="text-lg leading-relaxed font-semibold">{activity.activity_title}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Penyelenggara</Label>
                  <div className="flex items-center gap-2">
                    <Building className="text-muted-foreground h-4 w-4" />
                    <p className="font-medium">{activity.organizer}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Tahun Kegiatan</Label>
                  <p className="font-medium text-blue-600">{activity.activity_year}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Nomor Transaksi</Label>
                  <p className="font-medium">{activity.transaction_number || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Nomor Rekomendasi</Label>
                  <p className="font-medium">{activity.recommendation_number || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status dan Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                Status dan Penilaian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Status Pengajuan</Label>
                  <div>{getSubmissionStatusBadge(activity.submission_status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Status Rekomendasi</Label>
                  <div>{getRecommendationStatusBadge(activity.recommendation_status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Rating</Label>
                  <div>{getRatingBadge(activity.rating)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Pengajuan dan Pemrosesan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5" />
                Informasi Pengajuan dan Pemrosesan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Diajukan Oleh</Label>
                  <p className="font-medium">{activity.submitted_by || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Diproses Oleh</Label>
                  <p className="font-medium">{activity.processed_by || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Kegiatan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Timeline Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Pengajuan</Label>
                    <p className="font-medium">{formatDate(activity.submission_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-orange-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Revisi</Label>
                    <p className="font-medium">
                      {activity.revision_date ? formatDate(activity.revision_date) : "Tidak ada revisi"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Selesai</Label>
                    <p className="font-medium">
                      {activity.completion_date ? formatDate(activity.completion_date) : "Belum selesai"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                  <Timer className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Proses Pemeriksaan</Label>
                    <p className="font-medium text-blue-600">{activity.examination_process}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dokumen */}
          {activity.commitment_letter && activity.commitment_letter !== "-" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Dokumen Terkait
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium">Surat Komitmen</p>
                      <p className="text-muted-foreground text-sm">Dokumen komitmen kegiatan statistik</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDownloadCommitment}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-3 text-center">
                <div className="flex justify-center gap-2">
                  {getSubmissionStatusBadge(activity.submission_status)}
                  {getRecommendationStatusBadge(activity.recommendation_status)}
                  {getRatingBadge(activity.rating)}
                </div>
                <p className="text-muted-foreground text-sm">
                  {activity.submission_status === "selesai" && activity.recommendation_status === "layak"
                    ? "Kegiatan telah selesai dan mendapat rekomendasi layak"
                    : activity.submission_status === "revisi"
                      ? "Kegiatan memerlukan revisi sebelum dapat direkomendasikan"
                      : "Kegiatan sedang dalam proses review dan penilaian"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
