import type { Locale } from "./config";
import type { Currency, DemoFormats } from "@/types/demo";

export function getDemoFormats(locale: Locale): DemoFormats {
  function formatCurrency(currency: Currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(1249.99);
  }

  return {
    locale,
    date: new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 9, 24))),
    number: new Intl.NumberFormat(locale).format(1234567.89),
    currencies: {
      USD: formatCurrency("USD"),
      EUR: formatCurrency("EUR"),
      JPY: formatCurrency("JPY"),
    },
  };
}
