import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Eye,
  Building,
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  FileText,
  Download,
} from "lucide-react";
import RomantikServiceDetail from "./RomantikServiceDetail";

export default function RomantikServiceTable({ data }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (activity) => {
    setSelectedActivity(activity);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedActivity(null);
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

  const getRatingDisplay = (rating) => {
    if (rating === 0) return <span className="text-muted-foreground">-</span>;
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-500" />
        <span className="font-medium">{rating}</span>
      </div>
    );
  };

  const columns = [
    {
      accessorKey: "activity_title",
      header: "Kegiatan",
      cell: ({ row }) => {
        const activity = row.original;
        return (
          <div className="flex items-start gap-2">
            <FileText className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="line-clamp-2 font-medium whitespace-normal">{activity.activity_title}</p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span className="block whitespace-pre-wrap">{activity.activity_title}</span>
                </TooltipContent>
              </Tooltip>
              <p className="text-muted-foreground mt-1 text-xs">Diajukan: {formatDate(activity.submission_date)}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "organizer",
      header: "Penyelenggara",
      cell: ({ row }) => {
        const activity = row.original;
        return (
          <div className="flex items-center gap-2">
            <Building className="text-muted-foreground h-4 w-4 shrink-0" />
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="line-clamp-2 font-medium whitespace-normal">{activity.organizer}</p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span className="block whitespace-pre-wrap">{activity.organizer}</span>
                </TooltipContent>
              </Tooltip>
              {activity.submitted_by && <p className="text-muted-foreground text-xs">Oleh: {activity.submitted_by}</p>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "transaction_number",
      header: "No. Transaksi",
      cell: ({ row }) => {
        const activity = row.original;
        return activity.transaction_number ? (
          <Badge variant="outline" className="font-mono text-xs">
            {activity.transaction_number}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
    },
    {
      accessorKey: "activity_year",
      header: "Tahun",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-blue-600">
          {row.original.activity_year}
        </Badge>
      ),
    },
    {
      accessorKey: "submission_status",
      header: "Status Pengajuan",
      cell: ({ row }) => getSubmissionStatusBadge(row.original.submission_status),
    },
    {
      accessorKey: "recommendation_status",
      header: "Status Rekomendasi",
      cell: ({ row }) => getRecommendationStatusBadge(row.original.recommendation_status),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => getRatingDisplay(row.original.rating),
    },
    {
      accessorKey: "completion_date",
      header: "Tanggal Selesai",
      cell: ({ row }) => {
        const activity = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{formatDate(activity.completion_date)}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const activity = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewDetail(activity)}>
              <Eye className="mr-2 h-4 w-4" />
              Detail
            </Button>
            {activity.commitment_letter && activity.commitment_letter !== "-" && (
              <Button variant="ghost" size="sm" onClick={() => window.open(activity.commitment_letter, "_blank")}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
      <RomantikServiceDetail activity={selectedActivity} isOpen={isDetailOpen} onClose={handleCloseDetail} />
    </div>
  );
}
