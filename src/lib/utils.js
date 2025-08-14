import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/id";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

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
