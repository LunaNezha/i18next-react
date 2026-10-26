import { createInstance } from "i18next";
import { cache } from "react";
import { defaultNS, getOptions, type Locale } from "./config";
import { getResources } from "./resources";
import { createTranslator } from "./translator";

export const getTranslation = cache(async (lng: Locale) => {
  const instance = createInstance();
  await instance.init({
    ...getOptions(lng),
    resources: await getResources(lng),
  });

  return { t: createTranslator(instance.getFixedT(lng, defaultNS)) };
});
