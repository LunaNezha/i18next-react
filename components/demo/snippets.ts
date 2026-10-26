export const clientSnippet = `"use client";

import { useTranslation } from "@/hooks/use-translation";

export function Welcome() {
  const { t } = useTranslation();

  return <h1>{t("demo.greeting", { name: "Alex" })}</h1>;
}`;

export const serverSnippet = `import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/server";

export default async function Page({
  params,
}: { params: { lng: string } }) {
  if (!isLocale(params.lng)) notFound();
  const { t } = await getTranslation(params.lng);

  return <h1>{t("header.title")}</h1>;
}`;

export const formatSnippet = `const locale = "fa";

const price = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "USD",
}).format(1249.99);

const date = new Intl.DateTimeFormat(locale, {
  dateStyle: "medium",
  timeZone: "UTC",
}).format(new Date("2026-10-24T00:00:00Z"));`;
