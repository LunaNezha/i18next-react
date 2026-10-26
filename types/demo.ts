import type { Locale } from "@/lib/i18n/config";

export type Currency = "USD" | "EUR" | "JPY";

export type DemoFormats = {
  locale: Locale;
  date: string;
  number: string;
  currencies: Record<Currency, string>;
};
