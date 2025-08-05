import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Calendar, Eye, Mail, User, Phone, Briefcase, BookOpen } from "lucide-react";
import LibraryServiceDetail from "./LibraryServiceDetail";

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

  const columns = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="font-medium">{record.name}</p>
              <p className="text-muted-foreground text-xs">
                {record.birthyear} ({new Date().getFullYear() - Number.parseInt(record.birthyear)} tahun)
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Jenis Kelamin",
      cell: ({ row }) => getGenderBadge(row.original.gender),
    },
    {
      accessorKey: "contact",
      header: "Kontak",
      cell: ({ row }) => {
        const record = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "education",
      header: "Pendidikan",
      cell: ({ row }) => getEducationBadge(row.original.education),
    },
    {
      accessorKey: "job",
      header: "Pekerjaan",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <Briefcase className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{record.job || <span className="text-muted-foreground italic">-</span>}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "visit_datetime",
      header: "Waktu Kunjungan",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-sm font-medium">{new Date(record.visit_datetime).toLocaleDateString("id-ID")}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(record.visit_datetime).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "service_media",
      header: "Media Layanan",
      cell: ({ row }) => getServiceMediaBadge(row.original.service_media),
    },
    {
      accessorKey: "book_access_count",
      header: "Akses Buku",
      cell: ({ row }) => {
        const record = row.original;
        return (
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
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <Button variant="outline" size="sm" onClick={() => handleViewDetail(record)}>
            <Eye className="mr-2 h-4 w-4" />
            Detail
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
      <LibraryServiceDetail serviceRecord={selectedLibraryService} isOpen={isDetailOpen} onClose={handleCloseDetail} />
    </div>
  );
}
