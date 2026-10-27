export const languages = ["fa", "en"] as const;
export type Locale = (typeof languages)[number];

export const fallbackLng = "en" satisfies Locale;
export const defaultNS = "translations";
export const cookieName = "i18next";

export const localeDetails = {
  fa: { label: "فارسی", direction: "rtl" },
  en: { label: "English", direction: "ltr" },
} as const satisfies Record<
  Locale,
  { label: string; direction: "rtl" | "ltr" }
>;

export function isLocale(value: unknown): value is Locale {
  return languages.some((language) => language === value);
}

export function getOptions(lng: Locale = fallbackLng) {
  return {
    supportedLngs: [...languages],
    fallbackLng,
    lng,
    defaultNS,
    ns: [defaultNS],
    returnNull: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
  };
}
