"use client";

import { CheckIcon, ChevronDown, Globe2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import {
  cookieName,
  languages,
  localeDetails,
  isLocale,
  fallbackLng,
} from "@/lib/i18n/config";
import { getLocalePathname } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation();
  const segment = pathname.split("/")[1];
  const lng = isLocale(segment) ? segment : fallbackLng;
  const contentLocale = isLocale(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : fallbackLng;
  const query = searchParams.toString();

  return (
    <DropdownMenu dir={localeDetails[contentLocale].direction}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={t("change_language")}
          className="gap-2 rounded-xl px-3 text-xs sm:px-4"
        >
          <Globe2 className="text-subtle" aria-hidden="true" />
          <span lang={lng}>{localeDetails[lng].label}</span>
          <ChevronDown className="size-3 text-subtle" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        aria-label={t("change_language")}
        className="motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none"
      >
        {languages.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={`${getLocalePathname(pathname, locale)}${query ? `?${query}` : ""}`}
              hrefLang={locale}
              dir={localeDetails[locale].direction}
              aria-current={locale === lng ? "page" : undefined}
              prefetch={false}
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                try {
                  document.cookie = `${cookieName}=${locale}; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
                } catch {
                  return;
                }
              }}
              className={`min-h-12 cursor-pointer justify-between gap-6 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${locale === "fa" ? "font-iranyekan" : "font-montserrat"}`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="rounded border border-line px-1.5 py-1 font-mono text-[10px] uppercase text-subtle"
                >
                  {locale}
                </span>
                <span lang={locale}>{localeDetails[locale].label}</span>
              </span>
              {locale === lng && (
                <>
                  <CheckIcon aria-hidden="true" />
                  <span className="sr-only">{t("current_language")}</span>
                </>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
