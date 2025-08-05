import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  Settings,
  Star,
  User,
} from "lucide-react";
import StatisticalTransactionDetail from "./StatisticalTransactionDetail";

export default function StatisticalTransactionTable({ data }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedTransaction(null);
  };

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
        L
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-50 text-pink-700">
        P
      </Badge>
    );
  };

  const getNeedTypeBadge = (needType) => {
    if (needType.includes("Konsultasi")) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Konsultasi
        </Badge>
      );
    } else if (needType.includes("Permintaan Data")) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Permintaan Data
        </Badge>
      );
    }
    return <Badge variant="outline">{needType}</Badge>;
  };

  const parsePhoneGender = (phoneGender) => {
    if (!phoneGender) return { phone: "", gender: "" };
    const parts = phoneGender.split("/");
    return {
      phone: parts[0] || "",
      gender: parts[1] || "",
    };
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
    if (!status) return { statusText: "", rating: "0" };
    const parts = status.split(": ");
    return {
      statusText: parts[0] || "",
      rating: parts[1] || "0",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    try {
      // Handle Indonesian date format
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

      let processedDate = dateString;
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

  const columns = [
    {
      accessorKey: "customer_name",
      header: "Pelanggan",
      cell: ({ row }) => {
        const transaction = row.original;
        const { gender } = parsePhoneGender(transaction.detail.customer_detail.phone_gender);
        const { age } = parseAgeEducation(transaction.detail.customer_detail.age_education);

        return (
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="font-medium">{transaction.customer_name}</p>
              <div className="mt-1 flex items-center gap-1">
                {getGenderBadge(gender)}
                <span className="text-muted-foreground text-xs">{age ? `${age} tahun` : "-"}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "transaction_id",
      header: "ID Transaksi",
      cell: ({ row }) => <p className="font-mono text-sm">{row.original.transaction_id}</p>,
    },
    {
      accessorKey: "contact",
      header: "Kontak",
      cell: ({ row }) => {
        const transaction = row.original;
        const { phone } = parsePhoneGender(transaction.detail.customer_detail.phone_gender);

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Mail className="text-muted-foreground h-3 w-3" />
              <span className="text-xs">{transaction.detail.customer_detail.email || "-"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="text-muted-foreground h-3 w-3" />
              <span className="text-xs">{phone || "-"}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "need_type",
      header: "Keperluan",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="space-y-1">
            {getNeedTypeBadge(transaction.need_type)}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-600">
                {transaction.need_type.split(/Konsultasi|Permintaan Data/)[1].trim()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "request_date",
      header: "Tanggal",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{formatDate(transaction.request_date)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const transaction = row.original;
        return <span>{getStatusBadge(transaction.status)}</span>;
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const transaction = row.original;
        const { rating } = parseStatus(transaction.status);

        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{rating}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "main_operator",
      header: "Operator",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex items-center gap-2">
            <Settings className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              {transaction.main_operator || <span className="text-muted-foreground">Belum ditugaskan</span>}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Button variant="outline" size="sm" onClick={() => handleViewDetail(transaction)}>
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
      <StatisticalTransactionDetail
        transaction={selectedTransaction}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
