import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateToDDMMYYYY(dateString) {
  if (!dateString || dateString === "-" || dateString === "") return "-";

  let date;

  // Indonesian month mapping
  const indonesianMonths = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    jun: 5,
    jul: 6,
    agu: 7,
    sep: 8,
    okt: 9,
    nov: 10,
    des: 11,
  };

  try {
    // Handle different date formats
    if (dateString.includes(" - ")) {
      // Format: "28 Mei 25 - 10:14:44 WIB" -> extract "28 Mei 25"
      const datePart = dateString.split(" - ")[0];
      const parts = datePart.split(" ");
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthName = parts[1].toLowerCase();
        let year = parseInt(parts[2]);

        // Convert 2-digit year to 4-digit
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }

        const month = indonesianMonths[monthName];
        if (month !== undefined) {
          date = new Date(year, month, day);
        } else {
          date = new Date(datePart);
        }
      } else {
        date = new Date(datePart);
      }
    } else if (dateString.includes(" ") && !dateString.includes("/") && !dateString.includes("-")) {
      // Format: "30 Desember 2024" or "28 Juli 2025"
      const parts = dateString.split(" ");
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthName = parts[1].toLowerCase();
        const year = parseInt(parts[2]);

        const month = indonesianMonths[monthName];
        if (month !== undefined) {
          date = new Date(year, month, day);
        } else {
          date = new Date(dateString);
        }
      } else {
        date = new Date(dateString);
      }
    } else if (dateString.includes("-") && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      // Format: "2024-01-11" (ISO format)
      date = new Date(dateString);
    } else if (dateString.includes("/")) {
      // Format: "2/6/2025" or already in dd/mm/yyyy
      date = new Date(dateString);
    } else {
      // Fallback to standard Date parsing
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Date parsing error:", error, "for date:", dateString);
    return dateString; // Return original if parsing fails
  }
}
