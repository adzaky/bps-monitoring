import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Eye, Mail, User } from "lucide-react";
import LibraryServiceDetail from "./LibraryServiceDetail";
import { Phone } from "lucide-react";
import { Briefcase } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function LibraryServiceTable({ data }) {
  const [selectedLibraryService, setSelectedLibraryService] = React.useState(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleViewDetail = (record) => {
    setSelectedLibraryService(record);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedLibraryService(null);
  };

  const getGenderBadge = (gender) => {
    return gender === "L" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700">
        L
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-50 text-pink-700">
        P
      </Badge>
    );
  };

  const getServiceMediaBadge = (media) => {
    return media === "Tercetak" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Tercetak
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
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
        {education}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Pendidikan</TableHead>
            <TableHead>Pekerjaan</TableHead>
            <TableHead>Waktu Kunjungan</TableHead>
            <TableHead>Media Layanan</TableHead>
            <TableHead>Akses Buku</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-muted-foreground py-8 text-center">
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="font-medium">{record.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {record.birthyear} ({new Date().getFullYear() - Number.parseInt(record.birthyear)} tahun)
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getGenderBadge(record.gender)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Mail className="text-muted-foreground h-3 w-3" />
                      <span className="text-xs">{record.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="text-muted-foreground h-3 w-3" />
                      <span className="text-xs">{record.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getEducationBadge(record.education)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      {record.job || <span className="text-muted-foreground italic">-</span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(record.visit_datetime).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(record.visit_datetime).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getServiceMediaBadge(record.service_media)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      {record.book_access_count === "-" ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <span className="font-medium text-green-600">{record.book_access_count}</span>
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(record)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <LibraryServiceDetail serviceRecord={selectedLibraryService} isOpen={isDetailOpen} onClose={handleCloseDetail} />
    </div>
  );
}
