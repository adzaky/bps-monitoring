"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, User, Settings, FileText, Mail, CheckCircle, AlertCircle, Clock, X } from "lucide-react";

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "selesai":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Selesai
        </Badge>
      );
    case "proses":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <Clock className="mr-1 h-3 w-3" />
          Proses
        </Badge>
      );
    case "menunggu":
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Menunggu
        </Badge>
      );
    default:
      return <Badge variant="outline">Belum Selesai</Badge>;
  }
};

const getServiceTypeBadge = (serviceType) => {
  switch (serviceType) {
    case "Layanan Online":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          Online
        </Badge>
      );
    case "Kunjungan langsung":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700">
          Langsung
        </Badge>
      );
    default:
      return <Badge variant="outline">{serviceType}</Badge>;
  }
};

export default function ConsultationDetail({ consultation, isOpen, onClose }) {
  if (!consultation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detail Konsultasi {consultation.id_transaksi}
            </div>
          </DialogTitle>
          <DialogDescription>Informasi lengkap konsultasi statistik</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informasi Transaksi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Informasi Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">ID Transaksi</Label>
                  <p className="font-mono text-lg font-bold">{consultation.id_transaksi}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Status</Label>
                  <div>{getStatusBadge(consultation.status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Keperluan</Label>
                  <p className="font-medium text-blue-600">{consultation.jenis_keperluan}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Jenis Layanan</Label>
                  <div>{getServiceTypeBadge(consultation.keperluan_lain)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Konsumen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Informasi Konsumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <User className="h-8 w-8 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Nama Lengkap</Label>
                    <p className="text-lg font-semibold">{consultation.nama_konsumen}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Mail className="h-8 w-8 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Email</Label>
                    <p className="font-medium text-blue-600">{consultation.email_konsumen}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Waktu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Permintaan</Label>
                    <p className="font-semibold">
                      {new Date(consultation.tanggal_permintaan).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-sm font-medium">Tanggal Selesai</Label>
                    <p className="font-semibold">
                      {consultation.tanggal_selesai ? (
                        new Date(consultation.tanggal_selesai).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        <span className="text-muted-foreground italic">Belum selesai</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Durasi Pengerjaan */}
                {consultation.tanggal_selesai && (
                  <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                    <Clock className="h-6 w-6 text-blue-500" />
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-sm font-medium">Durasi Pengerjaan</Label>
                      <p className="font-semibold text-blue-600">
                        {Math.ceil(
                          (new Date(consultation.tanggal_selesai).getTime() -
                            new Date(consultation.tanggal_permintaan).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        hari
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informasi Operator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Informasi Operator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Settings className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-sm font-medium">Operator yang Menangani</Label>
                  <p className="text-lg font-semibold">
                    {consultation.operator || <span className="text-orange-500 italic">Belum ditugaskan</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Status */}
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <div className="text-2xl">{getStatusBadge(consultation.status)}</div>
                <p className="text-muted-foreground text-sm">
                  {consultation.status.toLowerCase() === "selesai"
                    ? "Konsultasi telah selesai dikerjakan"
                    : consultation.status.toLowerCase() === "proses"
                      ? "Konsultasi sedang dalam proses pengerjaan"
                      : "Konsultasi menunggu untuk diproses"}
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
