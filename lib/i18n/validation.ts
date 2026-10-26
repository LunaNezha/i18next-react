import { defaultNS, fallbackLng, isLocale, type Locale } from "./config";
import type { TranslationResources } from "@/types/i18n";

export function validateDictionary(dictionary: unknown, locale: Locale) {
  function visit(value: unknown, path: string) {
    if (typeof value === "string" && value.trim().length > 0) return;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0
    ) {
      for (const [key, child] of Object.entries(value)) {
        visit(child, `${path}.${key}`);
      }
      return;
    }

    throw new Error(
      `Invalid translation: ${locale}:${path}. Expected non-empty text or a non-empty object.`,
    );
  }

  if (
    !dictionary ||
    typeof dictionary !== "object" ||
    Array.isArray(dictionary)
  ) {
    throw new Error(`Invalid translation dictionary for locale "${locale}".`);
  }
  visit(dictionary, defaultNS);
}

export function validateResources(
  lng: Locale,
  resources: TranslationResources,
) {
  if (!isLocale(lng))
    throw new RangeError(`Unsupported locale: ${String(lng)}`);
  validateDictionary(resources?.[fallbackLng]?.[defaultNS], fallbackLng);

  if (lng !== fallbackLng && resources[lng]) {
    validateDictionary(resources[lng]?.[defaultNS], lng);
  }
}
