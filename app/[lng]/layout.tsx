import "@/public/styles/globals.css";
import "@/public/styles/font-families.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  languages,
  isLocale,
  localeDetails,
  fallbackLng,
} from "@/lib/i18n/config";
import { getResources } from "@/lib/i18n/resources";
import { I18nProvider } from "@/components/providers/i18n-provider";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/brand/globe.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  applicationName: "Locale — i18n playground",
  title: "Locale — One experience. Every language.",
  description:
    "An interactive Next.js internationalization playground. Explore English and Persian translations, RTL layouts, and localized formatting.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1511" },
  ],
};

export const dynamicParams = false;

type Props = {
  children: React.ReactNode;
  params: {
    lng: string;
  };
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout(props: Readonly<Props>) {
  const { children, params } = props;
  const { lng } = params;
  if (!isLocale(lng)) notFound();
  const resources = await getResources(lng);
  const contentLocale = resources[lng] ? lng : fallbackLng;

  return (
    <html
      lang={contentLocale}
      dir={localeDetails[contentLocale].direction}
      className="min-h-full bg-canvas text-ink ltr:font-montserrat rtl:font-iranyekan"
    >
      <body className="min-h-screen">
        <I18nProvider key={lng} lng={lng} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
