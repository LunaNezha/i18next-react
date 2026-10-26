import { isLocale, type Locale } from "./config";

export function getLocalePathname(pathname: string, lng: Locale) {
  const segments = pathname.split("/");
  if (isLocale(segments[1] ?? "")) {
    segments[1] = lng;
    return segments.join("/");
  }

  return `/${lng}${pathname === "/" ? "" : pathname}`;
}
