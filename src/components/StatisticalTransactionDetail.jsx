import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Settings,
  MapPin,
  Timer,
} from "lucide-react";

export default function StatisticalTransactionDetail({ transaction, isOpen, onClose }) {
  if (!transaction) return null;

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("selesai")) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Selesai
        </Badge>
      );
    } else if (statusLower.includes("batal")) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Batal
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getGenderBadge = (gender) => {
    return gender === "Laki-laki" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700">
        Laki-laki
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-50 text-pink-700">
        Perempuan
      </Badge>
    );
  };

  const getEducationBadge = (education) => {
    const educationColors = {
      "<= SMA": "bg-yellow-100 text-yellow-800",
      "Diploma (D1/D2/D3)": "bg-orange-100 text-orange-800",
      S1: "bg-blue-100 text-blue-800",
      S2: "bg-green-100 text-green-800",
      S3: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge variant="outline" className={educationColors[education] || "bg-gray-100 text-gray-800"}>
        <GraduationCap className="mr-1 h-3 w-3" />
        {education}
      </Badge>
    );
  };

  const getNeedTypeBadge = (needType) => {
    if (needType.includes("Konsultasi")) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <FileText className="mr-1 h-3 w-3" />
          Konsultasi
        </Badge>
      );
    } else if (needType.includes("Permintaan Data")) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <FileText className="mr-1 h-3 w-3" />
          Permintaan Data
        </Badge>
      );
    }
    return <Badge variant="outline">{needType}</Badge>;
  };

  const parsePhoneGender = (phoneGender, countryPhone = "") => {
    // Handle different formats:
    // Format 1: "phone/gender" (onsite visits)
    // Format 2: "age unit/gender" (online services)
    const parts = phoneGender.split("/");

    // Check if first part contains "Tahun" (age format)
    if (parts[0] && parts[0].includes("Tahun")) {
      return {
        phone: countryPhone.split("/")[1] || "", // Extract phone from country_phone
        gender: parts[1] || "",
        age: parts[0].replace("Tahun", "").trim(),
      };
    } else {
      return {
        phone: parts[0] || "",
        gender: parts[1] || "",
        age: "",
      };
    }
  };

  const parseAgeEducation = (ageEducation) => {
    if (!ageEducation) return { age: "", education: "" };
    const parts = ageEducation.split("/");
    return {
      age: parts[0] || "",
      education: parts[1] || "",
    };
  };

  const parseStatus = (status) => {
    const parts = status.split(": ");
    return {
      statusText: parts[0] || "",
      rating: parts[1] || "0",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum Ditentukan";
    try {
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthsEng = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Remove time if present
      let processedDate = dateString.split(" - ")[0];
      months.forEach((month, index) => {
        processedDate = processedDate.replace(month, monthsEng[index]);
      });

      return new Date(processedDate).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const {
    phone,
    gender,
    age: ageFromPhone,
  } = parsePhoneGender(
    transaction.detail.customer_detail.phone_gender,
    transaction.detail.customer_detail.country_phone
  );
  const { age: ageFromEducation, education } = parseAgeEducation(transaction.detail.customer_detail.age_education);
  const { statusText, rating } = parseStatus(transaction.status);

  // Use age from phone_gender if available, otherwise from age_education
  const customerAge = ageFromPhone || ageFromEducation;

  // Determine service type
  const isOnlineService = !!transaction.detail.online_service_detail;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnlineService ? <FileText className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
              {isOnlineService ? "Detail Layanan Online" : "Detail Kunjungan Langsung"}
            </div>
          </DialogTitle>
          <DialogDescription>
            {isOnlineService
              ? "Informasi lengkap layanan online pelanggan"
              : "Informasi lengkap kunjungan langsung pelanggan"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {isOnlineService ? <FileText className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                {isOnlineService ? "Informasi Layanan" : "Informasi Kunjungan"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">ID Transaksi</Label>
                  <p className="font-mono text-lg font-bold">{transaction.transaction_id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(transaction.status)}
                    {rating !== "0" && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        <Star className="mr-1 h-3 w-3" />
                        {rating}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Keperluan</Label>
                  <div>{getNeedTypeBadge(transaction.need_type)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Layanan</Label>
                  <div className="flex items-center gap-2">
                    {isOnlineService ? (
                      <>
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-600">Layanan Online</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-orange-600">Kunjungan Langsung</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Informasi Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <User className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-sm font-medium">Nama Lengkap</Label>
                  <p className="text-lg font-semibold">{transaction.detail.customer_detail.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Mail className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Email</Label>
                    <p className="font-medium text-blue-600">{transaction.detail.customer_detail.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Phone className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Nomor Telepon</Label>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Kelamin</Label>
                  <div>{getGenderBadge(gender)}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Usia</Label>
                  <p className="font-medium">{customerAge} tahun</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Pendidikan & Profesi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {education && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm font-medium">Pendidikan Terakhir</Label>
                    <div>{getEducationBadge(education)}</div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">
                    {isOnlineService ? "Segmentasi Konsumen" : "Unit/Instansi"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Building className="text-muted-foreground h-4 w-4" />
                    <p className="font-medium">
                      {isOnlineService
                        ? transaction.detail.customer_detail.consumer_segmentation || "Tidak tersedia"
                        : transaction.detail.customer_detail.unit || "Tidak tersedia"}
                    </p>
                  </div>
                </div>
                {transaction.detail.customer_detail.average_rating && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm font-medium">Rating Rata-rata</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-yellow-600">
                        ⭐ {transaction.detail.customer_detail.average_rating}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                {isOnlineService ? "Timeline Layanan" : "Timeline Kunjungan"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Permintaan</Label>
                    <p className="font-medium">
                      {isOnlineService
                        ? formatDate(transaction.request_date)
                        : formatDate(transaction.detail.onsite_visit_detail?.request_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Selesai</Label>
                    <p className="font-medium">
                      {transaction.detail.completion_date
                        ? formatDate(transaction.detail.completion_date)
                        : "Belum Selesai"}
                    </p>
                  </div>
                </div>

                {isOnlineService && transaction.detail.online_service_detail?.request_deadline && (
                  <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <Calendar className="h-6 w-6 text-orange-500" />
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-sm font-medium">Batas Waktu</Label>
                      <p className="font-medium text-orange-600">
                        {transaction.detail.online_service_detail.request_deadline}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 md:col-span-2">
                  <Settings className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Operator yang Menangani</Label>
                    <p className="font-medium text-blue-600">
                      {isOnlineService
                        ? transaction.detail.online_service_detail?.operator ||
                          transaction.main_operator ||
                          "Belum ditugaskan"
                        : transaction.detail.onsite_visit_detail?.operator || "Belum ditugaskan"}
                    </p>
                  </div>
                </div>

                {/* Durasi Penyelesaian */}
                {transaction.detail.completion_date && (
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 md:col-span-2">
                    <Timer className="h-6 w-6 text-green-500" />
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-sm font-medium">Durasi Penyelesaian</Label>
                      <p className="font-medium text-green-600">
                        {(() => {
                          try {
                            const requestDate = new Date(
                              isOnlineService
                                ? transaction.request_date
                                : transaction.detail.onsite_visit_detail?.request_date
                            );
                            const completionDate = new Date(transaction.detail.completion_date.split(" - ")[0]);
                            const diffTime = Math.abs(completionDate.getTime() - requestDate.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            return diffDays === 1 ? "Selesai dalam 1 hari" : `Selesai dalam ${diffDays} hari`;
                          } catch {
                            return "Selesai pada hari yang sama";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Detail Keperluan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Keperluan Utama</Label>
                  <div>{getNeedTypeBadge(transaction.need_type)}</div>
                </div>

                {isOnlineService ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm font-medium">Topik</Label>
                      <p className="font-medium">
                        {transaction.detail.online_service_detail?.topic || "Tidak tersedia"}
                      </p>
                    </div>

                    {transaction.detail.online_service_detail?.tag && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm font-medium">Tag</Label>
                        <div className="flex flex-wrap gap-1">
                          {transaction.detail.online_service_detail.tag.split(", ").map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {transaction.detail.online_service_detail?.consultation_coverage && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm font-medium">Cakupan Konsultasi</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <p className="font-medium text-green-600">
                            {transaction.detail.online_service_detail.consultation_coverage}
                          </p>
                        </div>
                      </div>
                    )}

                    {transaction.detail.online_service_detail?.consultation_type && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm font-medium">Tipe Konsultasi</Label>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                          {transaction.detail.online_service_detail.consultation_type}
                        </Badge>
                      </div>
                    )}

                    {transaction.detail.online_service_detail?.location_status && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm font-medium">Status Lokasi</Label>
                        <Badge variant="outline" className="bg-teal-50 text-teal-700">
                          {transaction.detail.online_service_detail.location_status}
                        </Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm font-medium">Keperluan Detail</Label>
                    <div>
                      {getNeedTypeBadge(transaction.detail.onsite_visit_detail?.need_type || transaction.need_type)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-3 text-center">
                <div className="flex justify-center gap-2">
                  {getStatusBadge(transaction.status)}
                  {getNeedTypeBadge(transaction.need_type)}
                  {getGenderBadge(gender)}
                </div>
                <p className="text-muted-foreground text-sm">
                  {statusText.toLowerCase() === "selesai"
                    ? `${isOnlineService ? "Layanan online" : "Kunjungan langsung"} telah selesai dilayani`
                    : statusText.toLowerCase() === "proses"
                      ? `${isOnlineService ? "Layanan" : "Kunjungan"} sedang dalam proses`
                      : `${isOnlineService ? "Layanan" : "Kunjungan"} menunggu untuk diproses`}
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
