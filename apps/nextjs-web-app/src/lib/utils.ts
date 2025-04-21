import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return initials.toUpperCase();
};

const DIVISIONS = [
  { amount: 60, name: "seconds" as Intl.RelativeTimeFormatUnit },
  { amount: 60, name: "minutes" as Intl.RelativeTimeFormatUnit },
  { amount: 24, name: "hours" as Intl.RelativeTimeFormatUnit },
  { amount: 7, name: "days" as Intl.RelativeTimeFormatUnit },
  { amount: 4.34524, name: "weeks" as Intl.RelativeTimeFormatUnit },
  { amount: 12, name: "months" as Intl.RelativeTimeFormatUnit },
  {
    amount: Number.POSITIVE_INFINITY,
    name: "years" as Intl.RelativeTimeFormatUnit
  }
];

const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto"
});

export function formatRelativeDate(
  toDate: Date | number,
  fromDate: Date | number = new Date()
): string {
  let duration: number = (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_DATE_FORMATTER.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
  return ""; // Fallback return, though it shouldn't reach here
}
