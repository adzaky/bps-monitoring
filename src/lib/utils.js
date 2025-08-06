import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.locale("id");

export function formatDateToDDMMYYYY(dateString) {
  if (!dateString || dateString === "-" || dateString.toString().trim() === "") {
    return "-";
  }

  const cleanedInput = dateString
    .toString()
    .replace(/^new Date\((.*)\)$/, "$1")
    .trim();

  const formats = ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD", "D MMMM YYYY", "DD MMMM YYYY"];

  for (const format of formats) {
    const parsed = dayjs(cleanedInput, format, "id", true);
    if (parsed.isValid()) {
      return parsed.format("DD/MM/YYYY");
    }
  }

  const fallback = dayjs(new Date(cleanedInput));
  return fallback.isValid() ? fallback.format("DD/MM/YYYY") : "-";
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
