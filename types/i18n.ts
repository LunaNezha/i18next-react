import type { defaultNS, fallbackLng, Locale } from "@/lib/i18n/config";
import type translations from "@/locales/en/translations.json";
import type { TOptions } from "i18next";

export type TranslationDictionary = typeof translations;

type LeafKeys<Value> = {
  [Key in keyof Value & string]: Value[Key] extends string
    ? Key
    : Value[Key] extends object
      ? `${Key}.${LeafKeys<Value[Key]>}`
      : never;
}[keyof Value & string];

export type TranslationKey = LeafKeys<TranslationDictionary>;

export type TranslationOptions = TOptions<Record<string, unknown>> & {
  defaultValue?: string;
  ns?: typeof defaultNS;
  lng?: Locale;
  lngs?: readonly Locale[];
  fallbackLng?: never;
  keySeparator?: ".";
  nsSeparator?: ":";
  returnObjects?: false;
  returnDetails?: false;
  returnNull?: false;
  returnEmptyString?: false;
  keyPrefix?: never;
};

export type Translate = (
  key: TranslationKey | [TranslationKey, ...TranslationKey[]],
  options?: TranslationOptions,
) => string;

type TranslationBundle = Record<typeof defaultNS, TranslationDictionary>;

export type TranslationResources = Partial<Record<Locale, TranslationBundle>> &
  Record<typeof fallbackLng, TranslationBundle>;
