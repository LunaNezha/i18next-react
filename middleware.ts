import { NextResponse, NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|workbox-.*).*)",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.includes("icon") ||
    pathname.includes("chrome") ||
    pathname === "/manifest.json"
  ) {
    return NextResponse.next();
  }

  let lng: string | undefined | null;

  // Check if language is set in cookies
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }

  // If not in cookies, check Accept-Language header
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  }

  // If no language is detected, use the fallback language
  if (!lng) {
    lng = fallbackLng;
  }

  // Handle root path explicitly
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${fallbackLng}${pathname}`, req.url),
    );
  }

  // Redirect if the language in the path is not supported
  if (
    !languages.some((loc) => pathname.startsWith(`/${loc}`)) &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lng}${pathname}`, req.url));
  }

  // Set the language cookie based on the referer
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") || "");
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
