import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//
//
//
//
//
//
// export function randomNumberBetween(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// export function sleep(duration: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, duration);
//   });
// }

// // https://www.youtube.com/watch?v=EoUIS2PxKCs
// // export function memoize(cb) {
// //   const cache = new Map()
// //   return (...args) => {
// //     const key = JSON.stringify(args)
// //     if (cache.has(key)) return cache.get(key)

// //     const result = cb(...args)
// //     cache.set(key, result)
// //     return result
// //   }
// // }

// export function first(array: number[], n = 1) {
//   if (n === 1) return array[0];
//   return array.filter((_, index) => index < n);
// }

// export function last(array: number[], n = 1) {
//   if (n === 1) return array[array.length - 1];
//   return array.filter((_, index) => array.length - index <= n);
// }

// export function sample(array: number[]) {
//   return array[randomNumberBetween(0, array.length - 1)];
// }

// type ArrayObject = {
//   name: string;
//   age: number;
// };

// export function pluck(array: ArrayObject[], key: keyof ArrayObject) {
//   return array.map((element) => element[key]);
// }

// // export function groupBy(array: ArrayObject[], key: keyof ArrayObject) {
// //   return array.reduce((group, element) => {
// //     const keyValue = element[key];
// //     return { ...group, [keyValue]: [...(group[keyValue] ?? []), element] };
// //   }, {});
// // }

// const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
//   currency: "USD",
//   style: "currency"
// });
// export function formatCurrency(number: number) {
//   return CURRENCY_FORMATTER.format(number);
// }

// const NUMBER_FORMATTER = new Intl.NumberFormat(undefined);
// export function formatNumber(number: number) {
//   return NUMBER_FORMATTER.format(number);
// }

// const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
//   notation: "compact"
// });
// export function formatCompactNumber(number: number) {
//   return COMPACT_NUMBER_FORMATTER.format(number);
// }
// const DIVISIONS = [
//   { amount: 60, name: "seconds" as Intl.RelativeTimeFormatUnit },
//   { amount: 60, name: "minutes" as Intl.RelativeTimeFormatUnit },
//   { amount: 24, name: "hours" as Intl.RelativeTimeFormatUnit },
//   { amount: 7, name: "days" as Intl.RelativeTimeFormatUnit },
//   { amount: 4.34524, name: "weeks" as Intl.RelativeTimeFormatUnit },
//   { amount: 12, name: "months" as Intl.RelativeTimeFormatUnit },
//   {
//     amount: Number.POSITIVE_INFINITY,
//     name: "years" as Intl.RelativeTimeFormatUnit
//   }
// ];

// const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(undefined, {
//   numeric: "auto"
// });

// export function formatRelativeDate(
//   toDate: Date | number,
//   fromDate: Date | number = new Date()
// ): string {
//   let duration: number = (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 1000;

//   for (let i = 0; i < DIVISIONS.length; i++) {
//     const division = DIVISIONS[i];
//     if (division) {
//       if (Math.abs(duration) < division.amount) {
//         return RELATIVE_DATE_FORMATTER.format(Math.round(duration), division.name);
//       }
//       duration /= division.amount;
//     }
//   }
//   return ""; // Fallback return, though it shouldn't reach here
// }

// // const DIVISIONS = [
// //   { amount: 60, name: "seconds" },
// //   { amount: 60, name: "minutes" },
// //   { amount: 24, name: "hours" },
// //   { amount: 7, name: "days" },
// //   { amount: 4.34524, name: "weeks" },
// //   { amount: 12, name: "months" },
// //   { amount: Number.POSITIVE_INFINITY, name: "years" },
// // ];

// // const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(undefined, {
// //   numeric: "auto",
// // });

// // export function formatRelativeDate(toDate, fromDate = new Date()) {
// //   let duration =
// //     (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 1000;

// //   for (let i = 0; i < DIVISIONS.length; i++) {
// //     const division = DIVISIONS[i];
// //     if (Math.abs(duration) < division.amount) {
// //       return RELATIVE_DATE_FORMATTER.format(
// //         Math.round(duration),
// //         division.name
// //       );
// //     }
// //     duration /= division.amount;
// //   }
// //   return ""; // Fallback return, though it shouldn't reach here
// // }

// // const currentDate = new Date();
// // const twoMonthsAgo = new Date().setMonth(currentDate.getMonth() - 2);
// // const yesterday = new Date().setDate(currentDate.getDate() - 1);
// // const nineDaysAgo = new Date().setDate(currentDate.getDate() - 9);

// // console.log("Two Months Ago:\n", formatRelativeDate(twoMonthsAgo));
// // console.log("Yesterday:\n", formatRelativeDate(yesterday));
// // console.log("Nine Days Ago:\n", formatRelativeDate(nineDaysAgo));
// // console.log(
// //   "Yesterday vs Nine Days Ago:\n",
// //   formatRelativeDate(yesterday, nineDaysAgo)
// // );
