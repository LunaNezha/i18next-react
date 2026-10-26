"use client";

import { createInstance } from "i18next";
import { useMemo, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { getOptions, type Locale } from "@/lib/i18n/config";
import { validateResources } from "@/lib/i18n/validation";
import type { TranslationResources } from "@/types/i18n";

type Props = {
  children: ReactNode;
  lng: Locale;
  resources: TranslationResources;
};

export function I18nProvider({ children, lng, resources }: Props) {
  const instance = useMemo(() => {
    validateResources(lng, resources);
    const i18n = createInstance();
    void i18n.init({
      ...getOptions(lng),
      resources,
      react: { useSuspense: false },
    });
    if (!i18n.isInitialized) {
      throw new Error(
        "The i18n provider requires synchronously loaded resources.",
      );
    }
    return i18n;
  }, [lng, resources]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
