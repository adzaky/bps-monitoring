import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Eye, Mail, Settings, User } from "lucide-react";
import ConsultationDetail from "./ConsultationDetail";

export default function ConsultationTable({ data }) {
  const [selectedConsultation, setSelectedConsultation] = React.useState(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleViewDetail = (consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedConsultation(null);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Selesai
          </Badge>
        );
      case "proses":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Proses
          </Badge>
        );
      case "menunggu":
        return <Badge variant="destructive">Menunggu</Badge>;
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Transaksi</TableHead>
            <TableHead>Konsumen</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Jenis Layanan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Permintaan</TableHead>
            <TableHead>Tanggal Selesai</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-muted-foreground py-8 text-center">
                Tidak ada data konsultasi
              </TableCell>
            </TableRow>
          ) : (
            data.map((consultation) => (
              <TableRow key={consultation.id_transaksi}>
                <TableCell className="font-medium">{consultation.id_transaksi}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{consultation.nama_konsumen}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-sm">{consultation.email_konsumen}</span>
                  </div>
                </TableCell>
                <TableCell>{getServiceTypeBadge(consultation.keperluan_lain)}</TableCell>
                <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    {new Date(consultation.tanggal_permintaan).toLocaleDateString("id-ID")}
                  </div>
                </TableCell>
                <TableCell>
                  {consultation.tanggal_selesai ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      {new Date(consultation.tanggal_selesai).toLocaleDateString("id-ID")}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {consultation.operator ? (
                    <div className="flex items-center gap-2">
                      <Settings className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{consultation.operator}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Belum ditugaskan</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(consultation)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <ConsultationDetail consultation={selectedConsultation} isOpen={isDetailOpen} onClose={handleCloseDetail} />
    </div>
  );
}
