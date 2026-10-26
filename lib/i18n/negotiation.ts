import { fallbackLng, isLocale, type Locale } from "./config";

export function getPreferredLocale(
  cookie: unknown,
  header: string | null,
): Locale {
  if (isLocale(cookie)) return cookie;

  const candidates: { locale: Locale; quality: number }[] = [];
  for (const entry of header?.split(",") ?? []) {
    const [range, weight, ...extra] = entry
      .trim()
      .split(";")
      .map((part) => part.trim());
    if (!range || extra.length > 0) continue;
    if (
      weight !== undefined &&
      !/^q=(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/i.test(weight)
    )
      continue;
    const quality = weight === undefined ? 1 : Number(weight.slice(2));
    if (quality === 0) continue;

    if (range === "*") {
      candidates.push({ locale: fallbackLng, quality });
      continue;
    }

    try {
      const locale = new Intl.Locale(range);
      const supported = isLocale(locale.baseName)
        ? locale.baseName
        : locale.language;
      if (isLocale(supported)) candidates.push({ locale: supported, quality });
    } catch {
      continue;
    }
  }

  candidates.sort((first, second) => second.quality - first.quality);
  return candidates[0]?.locale ?? fallbackLng;
}
