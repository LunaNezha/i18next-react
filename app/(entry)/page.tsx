"use client";

import { useEffect } from "react";
import { fallbackLng } from "@/lib/i18n/config";

const destination = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${fallbackLng}/`;

export default function RootPage() {
  useEffect(() => {
    window.location.replace(
      `${destination}${window.location.search}${window.location.hash}`,
    );
  }, []);

  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      </noscript>
      <a href={destination}>Continue in English</a>
    </>
  );
}
