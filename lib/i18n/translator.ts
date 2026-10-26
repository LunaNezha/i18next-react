import type { TFunction } from "i18next";
import type { Translate } from "@/types/i18n";
import type { defaultNS } from "./config";

export function createTranslator(
  translate: TFunction<typeof defaultNS>,
): Translate {
  return (key, options) => translate(key, options);
}
