import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  options: {
    currency?: "NGN" | "USD" | "EUR" | "GBP";
    locale?: string;
  } = {}
) {
  const { currency = "NGN", locale = "en-NG" } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
}