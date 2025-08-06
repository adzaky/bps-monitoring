import { calculateCapaian, formatDateToDDMMYYYY } from "@/lib/utils";

export function useRecapData(statisticalTransactions, libraryServiceData, romantikServiceData) {
  const generateRandomId = () => Math.floor(10000 + Math.random() * 90000);
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
      const keterangan = mapKeterangan(transaction.detail?.online_service_detail?.topic || "");
      const requestDate = transaction.request_date || transaction.detail.request_date;
      const formattedRequestDate = formatDateToDDMMYYYY(requestDate);
      const formattedCompletionDate = formatDateToDDMMYYYY(transaction.detail.completion_date);

      return {
        no: counter++,
        id_transaksi: `BPS-7200-SILASTIK-${generateRandomId()}`,
        nama_pengguna: transaction.customer_name,
        jenis_layanan: serviceType,
        keterangan,
        tanggal_permintaan: formattedRequestDate,
        tanggal_selesai: formattedCompletionDate,
        capaian: calculateCapaian(serviceType, formattedRequestDate, formattedCompletionDate),
        petugas: transaction.main_operator,
      };
    });

    data = [...data, ...statisticalData];
  }

  // --- Library ---
  if (libraryServiceData && libraryServiceData.length > 0) {
    const libraryData = libraryServiceData.map((record) => {
      const visitDate = record.visit_datetime || record.visit_date_time;
      const formattedRequestDate = formatDateToDDMMYYYY(visitDate);
      const formattedCompletionDate = formatDateToDDMMYYYY(visitDate);
      const jenisLayanan = "Perpustakaan";

      return {
        no: counter++,
        id_transaksi: `BPS-7200-PST-${generateRandomId()}`,
        nama_pengguna: record.name,
        jenis_layanan: jenisLayanan,
        keterangan: record.service_media === "Digilib" ? "Digital" : "Tercetak",
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
      const formattedRequestDate = formatDateToDDMMYYYY(activity.submission_date);
      const formattedCompletionDate = formatDateToDDMMYYYY(activity.completion_date);

      return {
        no: counter++,
        id_transaksi: `BPS-7200-ROMANTIK-${generateRandomId()}`,
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
