import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/id";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toast } from "sonner";

dayjs.locale("id");
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export function parseDate(dateString) {
  if (!dateString || dateString === "-" || dateString.toString().trim() === "") {
    return null;
  }

  let cleanedInput = dateString.toString().trim();

  if (cleanedInput.includes(" - ")) {
    cleanedInput = cleanedInput.split(" - ")[0].trim();
  }

  const monthMapping = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    Mei: "05",
    Jun: "06",
    Jul: "07",
    Agu: "08",
    Sep: "09",
    Okt: "10",
    Nov: "11",
    Des: "12",
  };

  const indonesianDateMatch = cleanedInput.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
  if (indonesianDateMatch) {
    const [, day, month, year] = indonesianDateMatch;
    if (monthMapping[month]) {
      const standardDate = `${year}-${monthMapping[month]}-${day.padStart(2, "0")}`;
      const parsed = dayjs(standardDate, "YYYY-MM-DD");
      if (parsed.isValid()) {
        return parsed;
      }
    }
  }

  if (/^\d{1,2} \w+ \d{2}$/.test(cleanedInput)) {
    const parts = cleanedInput.split(" ");
    parts[2] = "20" + parts[2];
    cleanedInput = parts.join(" ");

    const indonesianDate2DigitMatch = cleanedInput.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
    if (indonesianDate2DigitMatch) {
      const [, day, month, year] = indonesianDate2DigitMatch;
      if (monthMapping[month]) {
        const standardDate = `${year}-${monthMapping[month]}-${day.padStart(2, "0")}`;
        const parsed = dayjs(standardDate, "YYYY-MM-DD");
        if (parsed.isValid()) {
          return parsed;
        }
      }
    }
  }

  const formats = [
    "YYYY-MM-DD HH:mm:ss",
    "YYYY-MM-DD",
    "D MMMM YYYY",
    "DD MMMM YYYY",
    "D MMM YYYY",
    "DD MMM YYYY",
    "D MMMM YY",
    "DD MMMM YY",
  ];

  for (const format of formats) {
    const parsed = dayjs(cleanedInput, format, "id", true);
    if (parsed.isValid()) {
      return parsed;
    }
  }

  const fallback = dayjs(new Date(cleanedInput));
  if (!fallback.isValid()) {
    console.error(`Invalid date string: ${cleanedInput}`);
    return null;
  }
  return fallback;
}

export const formatDate = {
  toDDMMYYYY: (dateString) => {
    const parsedDate = parseDate(dateString);
    return parsedDate ? parsedDate.format("DD/MM/YYYY") : "";
  },
  toDayDateID: (dateString) => {
    const parsedDate = parseDate(dateString);
    return parsedDate ? parsedDate.format("dddd, D MMMM YYYY") : "";
  },
};

export function calculateCapaian(serviceType, requestDate, completionDate) {
  if (!serviceType || !requestDate || !completionDate) {
    return "";
  }

  // Parse dates using dayjs with DD/MM/YYYY format
  const startDate = dayjs(requestDate, "DD/MM/YYYY");
  const endDate = dayjs(completionDate, "DD/MM/YYYY");

  try {
    // Validate dates
    if (!startDate.isValid() || !endDate.isValid()) {
      return "";
    }

    // Calculate working days (NETWORKDAYS equivalent)
    const calculateNetworkDays = (start, end) => {
      let workingDays = 0;
      let current = start.clone();

      while (current.isSameOrBefore(end, "day")) {
        const dayOfWeek = current.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Exclude Sunday (0) and Saturday (6)
          workingDays++;
        }
        current = current.add(1, "day");
      }

      return workingDays;
    };

    // Calculate actual differences
    const daysDifference = endDate.diff(startDate, "day");
    const networkDays = calculateNetworkDays(startDate, endDate);

    let isTargetMet = false;

    switch (serviceType) {
      case "Perpustakaan":
        // Must be completed on the same day (G3 - F3 = 0)
        isTargetMet = daysDifference === 0;
        break;
      case "Rekomendasi Statistik":
        // ≤ 14 working days
        isTargetMet = networkDays <= 14;
        break;
      case "Konsultasi Online":
        // ≤ 3 working days
        isTargetMet = networkDays <= 3;
        break;
      case "Konsultasi Langsung":
        // ≤ 1 working day
        isTargetMet = networkDays <= 1;
        break;
      case "Produk Statistik Berbayar":
        // ≤ 10 working days
        isTargetMet = networkDays <= 10;
        break;
      default:
        return "";
    }

    return isTargetMet ? "Sesuai Target" : "Tidak Sesuai Target";
  } catch (err) {
    console.error(`Error calculating capaian for ${serviceType} - ${requestDate} - ${completionDate} :`, err);
  }
}

export function exportToExcel(data, fileName = "data.xlsx", sheetName = "Sheet1") {
  if (!data) return;

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  XLSX.writeFile(wb, fileName);
}

export function exportPdfFromJson(data, title, fileName, headers = [""], options = {}) {
  if (!data) return;
  const { columnWidths = [], orientation = "portrait" } = options;

  const doc = new jsPDF({ orientation });
  doc.text(title, 14, 10);

  autoTable(doc, {
    head: headers.length ? [headers] : [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
    columnStyles:
      columnWidths.length > 0
        ? columnWidths.reduce((acc, width, index) => {
            acc[index] = { cellWidth: width };
            return acc;
          }, {})
        : "auto",
  });

  doc.save(fileName);
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function exportLKMonitoring(data, year = 2025) {
  if (!data || data.length === 0) throw new Error("No data to export");

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
  const COLS = 15;

  const padTo = (arr, len) => arr.concat(Array(Math.max(0, len - arr.length)).fill(""));
  const parseDMY = (str) => {
    if (!str || typeof str !== "string") return null;
    const [d, m, y] = str.split("/").map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
  };

  const mapJenis = (s) => {
    if (!s) return null;
    const t = s.toLowerCase();
    if (t.includes("perpustakaan")) return "perpustakaan";
    if (t.includes("konsultasi online")) return "konsultasi_online";
    if (t.includes("konsultasi langsung")) return "konsultasi_langsung";
    if (t.includes("produk statistik berbayar") || t.includes("penjualan")) return "produk_berbayar";
    if (t.includes("rekomendasi")) return "rekomendasi";
    return null;
  };

  const make12 = () => Array(12).fill(0);
  const buckets = {
    perpustakaan: { x: make12(), y: make12() },
    konsultasi_online: { x: make12(), y: make12() },
    konsultasi_langsung: { x: make12(), y: make12() },
    produk_berbayar: { x: make12(), y: make12() },
    rekomendasi: { x: make12(), y: make12() },
  };

  for (const tx of data || []) {
    const d = parseDMY(tx.tanggal_permintaan);
    if (!d || d.getFullYear() !== year) continue;
    const mIdx = d.getMonth();
    const key = mapJenis(tx.jenis_layanan);
    if (!key || !buckets[key]) continue;

    buckets[key].y[mIdx] += 1;
    if ((tx.capaian || "").toLowerCase() === "sesuai target") {
      buckets[key].x[mIdx] += 1;
    }
  }

  const SERVICE_BLOCKS = [
    {
      title: "Pelayanan Perpustakaan",
      xLabel: "x — Jumlah pelayanan perpustakaan yang terpenuhi secara mandiri setelah login pada aplikasi PST",
      yLabel: "y — Jumlah pelayanan perpustakaan",
      key: "perpustakaan",
    },
    {
      title: "Konsultasi Statistik — Konsultasi Online",
      xLabel: "x — Jumlah pelayanan konsultasi statistik yang dapat terpenuhi dalam waktu maksimal 3 hari kerja",
      yLabel:
        "y — Jumlah pelayanan konsultasi statistik dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "konsultasi_online",
    },
    {
      title: "Konsultasi Statistik — Konsultasi Kunjungan Langsung",
      xLabel: "x — Jumlah pelayanan konsultasi statistik yang dapat terpenuhi dalam waktu maksimal 1 hari kerja",
      yLabel:
        "y — Jumlah pelayanan konsultasi statistik dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "konsultasi_langsung",
    },
    {
      title: "Penjualan Produk Statistik Berbayar",
      xLabel:
        "x — Jumlah pelayanan penjualan produk statistik (produk statistik berbayar) yang dapat terpenuhi dalam waktu maksimal 10 hari kerja",
      yLabel:
        "y — Jumlah pelayanan penjualan produk statistik (produk statistik berbayar) dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "produk_berbayar",
    },
    {
      title: "Pelayanan Rekomendasi Kegiatan Statistik",
      xLabel: "x — Jumlah pelayanan rekomendasi yang terpenuhi dalam waktu maksimal 14 hari",
      yLabel: "y — Jumlah pelayanan rekomendasi dengan Formulir Rekomendasi Statistik Sektoral",
      key: "rekomendasi",
    },
  ];

  const header1 = [`Monitoring Capaian Sasaran Mutu Tahun ${year}`];
  const header2 = [];
  const header3 = ["No", "Indikator Pada Sasaran Mutu", "Target", "Capaian Kumulatif"];
  const header4 = ["", "", "", ...months];

  const wsData = [
    padTo(header1, COLS),
    padTo(header2, COLS),
    padTo(header3, COLS),
    padTo(header4, COLS),
    padTo(["Produk Layanan"], COLS),
  ];

  let noCounter = 1;
  let currentRow = wsData.length + 1; // excel 1-based index

  for (const svc of SERVICE_BLOCKS) {
    const bx = buckets[svc.key]?.x || make12();
    const by = buckets[svc.key]?.y || make12();

    const rowService = Array(COLS).fill("");
    rowService[0] = noCounter++;
    rowService[1] = svc.title;
    rowService[2] = 100;

    wsData.push(rowService);
    const serviceRowIndex = currentRow;
    currentRow++;

    const rowX = Array(COLS).fill("");
    rowX[1] = svc.xLabel;
    bx.forEach((v, i) => (rowX[3 + i] = v ?? null));
    wsData.push(rowX);
    const rowXIndex = currentRow;
    currentRow++;

    const rowY = Array(COLS).fill("");
    rowY[1] = svc.yLabel;
    by.forEach((v, i) => (rowY[3 + i] = v ?? null));
    wsData.push(rowY);
    const rowYIndex = currentRow;
    currentRow++;

    // isi formula persentase capaian di baris jenis layanan (serviceRowIndex)
    months.forEach((_, mi) => {
      const colLetter = XLSX.utils.encode_col(3 + mi); // kolom ke-4..15
      const formula = `IF(SUM($${colLetter}$${rowYIndex})=0,0,SUM($${colLetter}$${rowXIndex})/SUM($${colLetter}$${rowYIndex}))`;
      wsData[serviceRowIndex - 1][3 + mi] = { f: formula, z: "0.00%" }; // z = format persen
    });

    wsData.push(Array(COLS).fill(""));
    currentRow++;
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws["!merges"] = [XLSX.utils.decode_range(`A1:O1`), XLSX.utils.decode_range(`D3:O3`)];
  ws["!cols"] = [
    { wch: 5 },
    { wch: 60 },
    { wch: 10 },
    ...Array(12)
      .fill(0)
      .map(() => ({ wch: 9 })),
  ];
  ws["!freeze"] = { xSplit: 2, ySplit: 4 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "LK Monitoring");
  XLSX.writeFile(wb, `LK Monitoring ${year}.xlsx`);
}

export function exportRecapData(data, year) {
  const fileName = `Rekap Transaksi Layanan PST 7200 Tahun ${year}.xlsx`;
  const dataSheetName = "Transaksi Layanan";
  const monitoringSheetName = "LK Monitoring";

  if (!data || data.length === 0) {
    toast.error("Tidak ada data transaksi untuk diekspor");
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Data Transaksi
  const wsData = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, wsData, dataSheetName);

  // Sheet 2: LK Monitoring
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
  const COLS = 15;

  const padTo = (arr, len) => arr.concat(Array(Math.max(0, len - arr.length)).fill(""));
  const parseDMY = (str) => {
    if (!str || typeof str !== "string") return null;
    const [d, m, y] = str.split("/").map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
  };

  const mapJenis = (s) => {
    if (!s) return null;
    const t = s.toLowerCase();
    if (t.includes("perpustakaan")) return "perpustakaan";
    if (t.includes("konsultasi online")) return "konsultasi_online";
    if (t.includes("konsultasi langsung")) return "konsultasi_langsung";
    if (t.includes("produk statistik berbayar") || t.includes("penjualan")) return "produk_berbayar";
    if (t.includes("rekomendasi")) return "rekomendasi";
    return null;
  };

  const make12 = () => Array(12).fill(0);
  const buckets = {
    perpustakaan: { x: make12(), y: make12() },
    konsultasi_online: { x: make12(), y: make12() },
    konsultasi_langsung: { x: make12(), y: make12() },
    produk_berbayar: { x: make12(), y: make12() },
    rekomendasi: { x: make12(), y: make12() },
  };

  for (const tx of data) {
    const d = parseDMY(tx.tanggal_permintaan);
    if (!d || d.getFullYear() !== year) continue;
    const mIdx = d.getMonth();
    const key = mapJenis(tx.jenis_layanan);
    if (!key || !buckets[key]) continue;

    buckets[key].y[mIdx] += 1;
    if ((tx.capaian || "").toLowerCase() === "sesuai target") {
      buckets[key].x[mIdx] += 1;
    }
  }

  const SERVICE_BLOCKS = [
    {
      title: "Pelayanan Perpustakaan",
      xLabel: "x — Jumlah pelayanan perpustakaan yang terpenuhi secara mandiri setelah login pada aplikasi PST",
      yLabel: "y — Jumlah pelayanan perpustakaan",
      key: "perpustakaan",
    },
    {
      title: "Konsultasi Statistik — Konsultasi Online",
      xLabel: "x — Jumlah pelayanan konsultasi statistik yang dapat terpenuhi dalam waktu maksimal 3 hari kerja",
      yLabel:
        "y — Jumlah pelayanan konsultasi statistik dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "konsultasi_online",
    },
    {
      title: "Konsultasi Statistik — Konsultasi Kunjungan Langsung",
      xLabel: "x — Jumlah pelayanan konsultasi statistik yang dapat terpenuhi dalam waktu maksimal 1 hari kerja",
      yLabel:
        "y — Jumlah pelayanan konsultasi statistik dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "konsultasi_langsung",
    },
    {
      title: "Penjualan Produk Statistik Berbayar",
      xLabel:
        "x — Jumlah pelayanan penjualan produk statistik (produk statistik berbayar) yang dapat terpenuhi dalam waktu maksimal 10 hari kerja",
      yLabel:
        "y — Jumlah pelayanan penjualan produk statistik (produk statistik berbayar) dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "produk_berbayar",
    },
    {
      title: "Pelayanan Rekomendasi Kegiatan Statistik",
      xLabel: "x — Jumlah pelayanan rekomendasi yang terpenuhi dalam waktu maksimal 14 hari",
      yLabel: "y — Jumlah pelayanan rekomendasi dengan Formulir Rekomendasi Statistik Sektoral",
      key: "rekomendasi",
    },
  ];

  const header1 = [`Monitoring Capaian Sasaran Mutu Tahun ${year}`];
  const header2 = [];
  const header3 = ["No", "Indikator Pada Sasaran Mutu", "Target", "Capaian Kumulatif"];
  const header4 = ["", "", "", ...months];

  const wsMonitoringData = [
    padTo(header1, COLS),
    padTo(header2, COLS),
    padTo(header3, COLS),
    padTo(header4, COLS),
    padTo(["Produk Layanan"], COLS),
  ];

  let noCounter = 1;
  let currentRow = wsMonitoringData.length + 1;

  for (const svc of SERVICE_BLOCKS) {
    const bx = buckets[svc.key]?.x || make12();
    const by = buckets[svc.key]?.y || make12();

    const rowService = Array(COLS).fill("");
    rowService[0] = noCounter++;
    rowService[1] = svc.title;
    rowService[2] = 100;

    wsMonitoringData.push(rowService);
    const serviceRowIndex = currentRow;
    currentRow++;

    const rowX = Array(COLS).fill("");
    rowX[1] = svc.xLabel;
    bx.forEach((v, i) => (rowX[3 + i] = v ?? null));
    wsMonitoringData.push(rowX);
    const rowXIndex = currentRow;
    currentRow++;

    const rowY = Array(COLS).fill("");
    rowY[1] = svc.yLabel;
    by.forEach((v, i) => (rowY[3 + i] = v ?? null));
    wsMonitoringData.push(rowY);
    const rowYIndex = currentRow;
    currentRow++;

    // isi formula persentase capaian di baris jenis layanan (serviceRowIndex)
    months.forEach((_, mi) => {
      const colLetter = XLSX.utils.encode_col(3 + mi); // kolom ke-4..15
      const formula = `IF(SUM($${colLetter}$${rowYIndex})=0;0;SUM($${colLetter}$${rowXIndex})/SUM($${colLetter}$${rowYIndex}))`;
      wsMonitoringData[serviceRowIndex - 1][3 + mi] = { f: formula, z: "0.00%" }; // z = format persen
    });

    wsMonitoringData.push(Array(COLS).fill(""));
    currentRow++;
  }

  const wsMonitoring = XLSX.utils.aoa_to_sheet(wsMonitoringData);

  wsMonitoring["!merges"] = [XLSX.utils.decode_range(`A1:O1`), XLSX.utils.decode_range(`D3:O3`)];
  wsMonitoring["!cols"] = [
    { wch: 5 },
    { wch: 60 },
    { wch: 10 },
    ...Array(12)
      .fill(0)
      .map(() => ({ wch: 9 })),
  ];
  wsMonitoring["!freeze"] = { xSplit: 2, ySplit: 4 };

  XLSX.utils.book_append_sheet(wb, wsMonitoring, monitoringSheetName);

  XLSX.writeFile(wb, fileName);
}

export function generateLKMonitoringAoA(data, year = 2025) {
  if (!data || data.length === 0) throw new Error("No data to export");

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
  const COLS = 15;

  const padTo = (arr, len) => arr.concat(Array(Math.max(0, len - arr.length)).fill(""));
  const parseDMY = (str) => {
    if (!str || typeof str !== "string") return null;
    const [d, m, y] = str.split("/").map(Number);
    if (!d || !m || !y) return null;
    return new Date(y, m - 1, d);
  };

  const mapJenis = (s) => {
    if (!s) return null;
    const t = s.toLowerCase();
    if (t.includes("perpustakaan")) return "perpustakaan";
    if (t.includes("konsultasi online")) return "konsultasi_online";
    if (t.includes("konsultasi langsung")) return "konsultasi_langsung";
    if (t.includes("produk statistik berbayar") || t.includes("penjualan")) return "produk_berbayar";
    if (t.includes("rekomendasi")) return "rekomendasi";
    return null;
  };

  const make12 = () => Array(12).fill(0);
  const buckets = {
    perpustakaan: { x: make12(), y: make12() },
    konsultasi_online: { x: make12(), y: make12() },
    konsultasi_langsung: { x: make12(), y: make12() },
    produk_berbayar: { x: make12(), y: make12() },
    rekomendasi: { x: make12(), y: make12() },
  };

  for (const tx of data || []) {
    const d = parseDMY(tx.tanggal_permintaan);
    if (!d || d.getFullYear() !== year) continue;
    const mIdx = d.getMonth();
    const key = mapJenis(tx.jenis_layanan);
    if (!key || !buckets[key]) continue;

    buckets[key].y[mIdx] += 1;
    if ((tx.capaian || "").toLowerCase() === "sesuai target") {
      buckets[key].x[mIdx] += 1;
    }
  }

  const SERVICE_BLOCKS = [
    {
      title: "Pelayanan Perpustakaan",
      xLabel: "x — Jumlah pelayanan perpustakaan yang terpenuhi secara mandiri setelah login pada aplikasi PST",
      yLabel: "y — Jumlah pelayanan perpustakaan",
      key: "perpustakaan",
    },
    {
      title: "Konsultasi Statistik — Konsultasi Online",
      xLabel: "x — Jumlah pelayanan konsultasi statistik yang dapat terpenuhi dalam waktu maksimal 3 hari kerja",
      yLabel:
        "y — Jumlah pelayanan konsultasi statistik dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "konsultasi_online",
    },
    {
      title: "Konsultasi Statistik — Konsultasi Kunjungan Langsung",
      xLabel: "x — Jumlah pelayanan konsultasi statistik yang dapat terpenuhi dalam waktu maksimal 1 hari kerja",
      yLabel:
        "y — Jumlah pelayanan konsultasi statistik dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "konsultasi_langsung",
    },
    {
      title: "Penjualan Produk Statistik Berbayar",
      xLabel:
        "x — Jumlah pelayanan penjualan produk statistik (produk statistik berbayar) yang dapat terpenuhi dalam waktu maksimal 10 hari kerja",
      yLabel:
        "y — Jumlah pelayanan penjualan produk statistik (produk statistik berbayar) dengan permintaan jelas dan persyaratan pelayanan telah lengkap",
      key: "produk_berbayar",
    },
    {
      title: "Pelayanan Rekomendasi Kegiatan Statistik",
      xLabel: "x — Jumlah pelayanan rekomendasi yang terpenuhi dalam waktu maksimal 14 hari",
      yLabel: "y — Jumlah pelayanan rekomendasi dengan Formulir Rekomendasi Statistik Sektoral",
      key: "rekomendasi",
    },
  ];

  const header1 = [`Monitoring Capaian Sasaran Mutu Tahun ${year}`];
  const header2 = [];
  const header3 = ["No", "Indikator Pada Sasaran Mutu", "Target", "Capaian Kumulatif"];
  const header4 = ["", "", "", ...months];

  const wsData = [
    padTo(header1, COLS),
    padTo(header2, COLS),
    padTo(header3, COLS),
    padTo(header4, COLS),
    padTo(["Produk Layanan"], COLS),
  ];

  let noCounter = 1;
  let currentRow = wsData.length + 1; // excel 1-based index

  for (const svc of SERVICE_BLOCKS) {
    const bx = buckets[svc.key]?.x || make12();
    const by = buckets[svc.key]?.y || make12();

    const rowService = Array(COLS).fill("");
    rowService[0] = noCounter++;
    rowService[1] = svc.title;
    rowService[2] = 100;

    wsData.push(rowService);
    const serviceRowIndex = currentRow;
    currentRow++;

    const rowX = Array(COLS).fill("");
    rowX[1] = svc.xLabel;
    bx.forEach((v, i) => (rowX[3 + i] = v ?? null));
    wsData.push(rowX);
    const rowXIndex = currentRow;
    currentRow++;

    const rowY = Array(COLS).fill("");
    rowY[1] = svc.yLabel;
    by.forEach((v, i) => (rowY[3 + i] = v ?? null));
    wsData.push(rowY);
    const rowYIndex = currentRow;
    currentRow++;

    // isi formula persentase capaian di baris jenis layanan (serviceRowIndex)
    months.forEach((_, mi) => {
      const colLetter = XLSX.utils.encode_col(3 + mi); // kolom ke-4..15
      const formula = `=TEXT(IFERROR($${colLetter}$${rowXIndex}/$${colLetter}$${rowYIndex};0);"0%")`;
      wsData[serviceRowIndex - 1][3 + mi] = { f: formula, z: "0%" }; // z = format persen
    });

    wsData.push(Array(COLS).fill(""));
    currentRow++;
  }

  return wsData;
}
