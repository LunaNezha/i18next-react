import { cache } from "react";
import { defaultNS, fallbackLng, isLocale, type Locale } from "./config";
import { validateDictionary } from "./validation";
import type { TranslationDictionary, TranslationResources } from "@/types/i18n";

const dictionaries = {
  en: () =>
    import("@/locales/en/translations.json").then((module) => module.default),
  fa: () =>
    import("@/locales/fa/translations.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<TranslationDictionary>>;

const loadDictionary = cache(async (lng: Locale) => {
  const dictionary = await dictionaries[lng]();
  validateDictionary(dictionary, lng);
  return dictionary;
});

export const getResources = cache(
  async (lng: Locale): Promise<TranslationResources> => {
    if (!isLocale(lng))
      throw new RangeError(`Unsupported locale: ${String(lng)}`);

    const fallbackPromise = loadDictionary(fallbackLng).catch(
      (cause: unknown) => {
        throw new Error(
          `Required fallback dictionary "${fallbackLng}" could not be loaded.`,
          { cause },
        );
      },
    );
    const selectedPromise =
      lng === fallbackLng
        ? fallbackPromise
        : loadDictionary(lng).catch(() => undefined);
    const [fallback, selected] = await Promise.all([
      fallbackPromise,
      selectedPromise,
    ]);
    const resources: TranslationResources = {
      [fallbackLng]: { [defaultNS]: fallback },
    };

    if (selected) resources[lng] = { [defaultNS]: selected };
    return resources;
  },
);
