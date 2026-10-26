import "i18next";
import type translations from "@/locales/en/translations.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translations";
    returnNull: false;
    returnEmptyString: false;
    resources: {
      translations: typeof translations;
    };
  }
}
