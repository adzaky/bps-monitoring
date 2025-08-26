import { calculateCapaian, formatDate } from "@/lib/utils";

export function useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData) {
  const generateId = (data) => {
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (Math.abs(hash) % 90000) + 10000;
  };

  let data = [];
  let counter = 1;

  // --- Statistical ---
  if (statisticalTransactions && statisticalTransactions.length > 0) {
    const statisticalData = statisticalTransactions.map((transaction) => {
      const mapServiceType = (needType) => {
        if (!needType) return "";
        if (needType.includes("Kunjungan langsung")) {
          return needType.includes("Permintaan Data") ? "Produk Statistik Berbayar" : "Konsultasi Langsung";
        }
        if (needType.includes("Layanan Online")) {
          return needType.includes("Permintaan Data") ? "Produk Statistik Berbayar" : "Konsultasi Online";
        }
        return "";
      };

      const mapKeterangan = (topic) => {
        if (!topic) return "";
        if (topic.includes("Data Mikro")) return "Data Mikro";
        return "";
      };

      const serviceType = mapServiceType(transaction.need_type || transaction.detail.onsite_visit_detail?.need_type);
      const keterangan = mapKeterangan(transaction.detail?.online_service_details?.topic || "");
      const requestDate = transaction.request_date || transaction.detail.request_date;
      const formattedRequestDate = formatDate.toDDMMYYYY(requestDate);
      const formattedCompletionDate = formatDate.toDDMMYYYY(transaction.detail.completion_date);

      return {
        no: counter++,
        id_transaksi: `BPS-7200-SILASTIK-${generateId(transaction)}`,
        nama_pengguna: transaction.customer_name,
        jenis_layanan: serviceType,
        keterangan,
        tanggal_permintaan: formattedRequestDate,
        tanggal_selesai: transaction.status.toLowerCase().includes("batal") ? "" : formattedCompletionDate,
        capaian: transaction.status.toLowerCase().includes("batal")
          ? "Tidak Sesuai Target"
          : calculateCapaian(serviceType, formattedRequestDate, formattedCompletionDate),
        petugas: transaction.main_operator,
      };
    });

    data = [...data, ...statisticalData];
  }

  // --- Library ---
  if (libraryServiceData && libraryServiceData.length > 0) {
    const libraryData = libraryServiceData.map((record) => {
      const visitDate = record.visit_datetime || record.visit_date_time;
      const formattedRequestDate = formatDate.toDDMMYYYY(visitDate);
      const formattedCompletionDate = formatDate.toDDMMYYYY(visitDate);
      const jenisLayanan = "Perpustakaan";

      return {
        no: counter++,
        id_transaksi: `BPS-7200-PST-${generateId(record)}`,
        nama_pengguna: record.name || record.lead_group,
        jenis_layanan: jenisLayanan,
        keterangan: record.service_media === "Digilib" || record.type === "group" ? "Digital" : "Tercetak",
        tanggal_permintaan: formattedRequestDate,
        tanggal_selesai: formattedCompletionDate,
        capaian: calculateCapaian(jenisLayanan, formattedRequestDate, formattedCompletionDate),
        petugas: "Ince Mariyani S.E., M.M.",
      };
    });

    data = [...data, ...libraryData];
  }

  // --- Romantik ---
  if (romantikServiceData && romantikServiceData.length > 0) {
    const romantikData = romantikServiceData.map((activity) => {
      const jenisLayanan = "Rekomendasi Statistik";
      const formattedRequestDate = formatDate.toDDMMYYYY(activity.submission_date);
      const formattedCompletionDate = formatDate.toDDMMYYYY(activity.completion_date);

      return {
        no: counter++,
        id_transaksi: `BPS-7200-ROMANTIK-${generateId(activity)}`,
        nama_pengguna: activity.organizer,
        jenis_layanan: jenisLayanan,
        keterangan: activity.activity_title?.substring(0, 50) + (activity.activity_title?.length > 50 ? "..." : ""),
        tanggal_permintaan: formattedRequestDate,
        tanggal_selesai: formattedCompletionDate,
        capaian: calculateCapaian(jenisLayanan, formattedRequestDate, formattedCompletionDate),
        petugas: activity.processed_by || "-",
      };
    });

    data = [...data, ...romantikData];
  }

  return { data };
}
