"use client";

import { useContext, useMemo } from "react";
import {
  I18nContext,
  useTranslation as useReactTranslation,
} from "react-i18next";
import { defaultNS } from "@/lib/i18n/config";
import { createTranslator } from "@/lib/i18n/translator";

function useI18nInstance() {
  const context = useContext(I18nContext);
  if (!context?.i18n) {
    throw new Error("useTranslation must be used within I18nProvider.");
  }
  return context.i18n;
}

export function useTranslation(namespace: typeof defaultNS = defaultNS) {
  const i18n = useI18nInstance();
  const translation = useReactTranslation(namespace, {
    i18n,
    useSuspense: false,
  });
  const translate = useMemo(
    () => createTranslator(translation.t),
    [translation.t],
  );
  return { t: translate, i18n: translation.i18n, ready: translation.ready };
}
