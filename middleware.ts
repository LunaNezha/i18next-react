import { NextResponse, type NextRequest } from "next/server";
import { cookieName, isLocale } from "@/lib/i18n/config";
import { getLocalePathname } from "@/lib/i18n/routing";
import { getPreferredLocale } from "@/lib/i18n/negotiation";

export const config = {
  matcher: [
    {
      source: "/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export function middleware(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];

  if (isLocale(segment)) {
    const response = NextResponse.next();
    if (request.cookies.get(cookieName)?.value !== segment) {
      response.cookies.set(cookieName, segment, {
        path: "/",
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
    }
    return response;
  }

  const lng = getPreferredLocale(
    request.cookies.get(cookieName)?.value,
    request.headers.get("Accept-Language"),
  );
  const url = request.nextUrl.clone();
  url.pathname = getLocalePathname(url.pathname, lng);

  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Cookie, Accept-Language");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
