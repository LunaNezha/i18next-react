import "@/public/styles/globals.css";
import "@/public/styles/font-families.module.css";

import { dir } from "i18next";
import type { Metadata, Viewport } from "next";
import { languages } from "../i18n/settings";

export const metadata: Metadata = {
  applicationName: "i18n React Next.js",
  title: "Internationalization Next.js",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

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

  return (
    <html
      lang={params.lng ?? "fa"}
      dir={dir(params.lng) ?? "rtl"}
      className="ltr:font-montserrat rtl:font-iranyekan h-full bg-zinc-950 text-gray-50"
      suppressHydrationWarning
    >
      <body className="ltr:font-montserrat rtl:font-iranyekan h-full bg-zinc-950 text-gray-50">
        {children}
      </body>
    </html>
  );
}
