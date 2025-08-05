import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateToDDMMYYYY(dateString) {
  // Mengembalikan '-' untuk input kosong atau tidak valid
  if (!dateString || dateString === "-" || dateString === "") return "-";

  // Peta bulan yang mengenali singkatan umum (3 huruf pertama)
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    mei: 4,
    jun: 5,
    jul: 6,
    agu: 7,
    sep: 8,
    okt: 9,
    nov: 10,
    des: 11,
  };

  try {
    let date;

    // Regex fleksibel untuk mencocokkan pola "DD [KataBulan] YY" atau "DD [KataBulan] YYYY"
    const genericDateRegex = /(\d{1,2})\s+([a-zA-Z]{3,})\s+(\d{2,4})/i;
    const match = dateString.match(genericDateRegex);

    if (match) {
      // Jika cocok dengan format tanggal umum (misal: "04 Mar 25")
      const day = parseInt(match[1], 10);
      const monthAbbr = match[2].toLowerCase().substring(0, 3);
      let year = parseInt(match[3], 10);

      if (year < 100) {
        year = year < 50 ? 2000 + year : 1900 + year;
      }

      const month = monthMap[monthAbbr];

      if (month !== undefined) {
        date = new Date(Date.UTC(year, month, day));
      }
    } else {
      // Fallback untuk format lain seperti "2024-01-11" (ISO)
      date = new Date(dateString);
    }

    if (!date || isNaN(date.getTime())) {
      return dateString; // Kembalikan string asli jika parsing gagal
    }

    // Format output ke DD/MM/YYYY, pastikan 2 digit
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Date parsing error:", error, "for date:", dateString);
    return dateString;
  }
}
