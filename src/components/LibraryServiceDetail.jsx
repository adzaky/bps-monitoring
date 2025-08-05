"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, User, Mail, Phone, GraduationCap, Briefcase, BookOpen, Clock, X, UserCheck } from "lucide-react";

export default function LibraryServiceDetail({ serviceRecord, isOpen, onClose }) {
  if (!serviceRecord) return null;

  const visitDate = new Date(serviceRecord.visit_datetime);

  const calculateAge = (birthYear) => {
    const currentYear = new Date().getFullYear();
    return currentYear - Number.parseInt(birthYear);
  };

  const age = calculateAge(serviceRecord.birthyear);

  const getGenderBadge = (gender) => {
    return gender === "L" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700">
        Laki-laki
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-50 text-pink-700">
        Perempuan
      </Badge>
    );
  };

  const getServiceMediaBadge = (media) => {
    return media === "Tercetak" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <BookOpen className="mr-1 h-3 w-3" />
        Tercetak
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
        <BookOpen className="mr-1 h-3 w-3" />
        Digital
      </Badge>
    );
  };

  const getEducationBadge = (education) => {
    const educationColors = {
      "<= SLTA": "bg-yellow-100 text-yellow-800",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Detail Layanan Perpustakaan
            </div>
          </DialogTitle>
          <DialogDescription>Informasi lengkap pengunjung perpustakaan</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informasi Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Informasi Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <UserCheck className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-sm font-medium">Nama Lengkap</Label>
                  <p className="text-lg font-semibold">{serviceRecord.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Kelamin</Label>
                  <div>{getGenderBadge(serviceRecord.gender)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Tahun Lahir / Usia</Label>
                  <p className="font-medium">
                    {serviceRecord.birthyear} <span className="text-muted-foreground">({age} tahun)</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Kontak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Mail className="h-6 w-6 text-blue-500" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-sm font-medium">Email</Label>
                  <p className="font-medium text-blue-600">{serviceRecord.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Phone className="h-6 w-6 text-green-500" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-sm font-medium">Nomor Telepon</Label>
                  <p className="font-medium">{serviceRecord.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Pendidikan & Pekerjaan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Pendidikan & Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Pendidikan Terakhir</Label>
                  <div>{getEducationBadge(serviceRecord.education)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Pekerjaan</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-muted-foreground h-4 w-4" />
                    <p className="font-medium">
                      {serviceRecord.job || <span className="text-muted-foreground italic">Tidak disebutkan</span>}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Kunjungan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Informasi Kunjungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                <Clock className="h-6 w-6 text-blue-500" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-sm font-medium">Waktu Kunjungan</Label>
                  <p className="font-semibold">
                    {visitDate.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Pukul {visitDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Media Layanan</Label>
                  <div>{getServiceMediaBadge(serviceRecord.service_media)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Akses Buku</Label>
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-muted-foreground h-4 w-4" />
                    <p className="font-medium">
                      {serviceRecord.book_access_count === "-" ? (
                        <span className="text-muted-foreground">Tidak ada akses</span>
                      ) : (
                        <span className="text-green-600">{serviceRecord.book_access_count}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <div className="flex justify-center gap-2">
                  {getServiceMediaBadge(serviceRecord.service_media)}
                  {getEducationBadge(serviceRecord.education)}
                </div>
                <p className="text-muted-foreground text-sm">
                  {serviceRecord.service_media === "Tercetak"
                    ? "Menggunakan layanan buku fisik/tercetak"
                    : "Menggunakan layanan perpustakaan digital"}
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
