import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/id";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.locale("id");

export function formatDateToDDMMYYYY(dateString) {
  if (!dateString || dateString === "-" || dateString.toString().trim() === "") {
    return "";
  }

  let cleanedInput = dateString.toString().trim();

  if (cleanedInput.includes(" - ")) {
    cleanedInput = cleanedInput.split(" - ")[0].trim();
  }

  if (/^\d{1,2} \w+ \d{2}$/.test(cleanedInput)) {
    const parts = cleanedInput.split(" ");
    parts[2] = "20" + parts[2];
    cleanedInput = parts.join(" ");
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
      return parsed.format("DD/MM/YYYY");
    }
  }

  const fallback = dayjs(new Date(cleanedInput));
  if (!fallback.isValid()) {
    throw new Error(`Invalid date string: ${cleanedInput} to ${fallback}`);
  }
  return fallback.format("DD/MM/YYYY");
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
