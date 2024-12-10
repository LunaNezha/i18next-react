"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/app/i18n/client";
import { languages } from "@/app/i18n/settings";
import Link from "next/link";
import { EN, ENGLISH, FA, PERSIAN } from "@/constants/langs.const";
import Image from "next/image";

import IranFlag from "@/public/images/iran.png";
import UnitedStatesFlag from "@/public/images/united-states.png";
import { LanguagesIcon } from "lucide-react";

type Props = {
  params: {
    lng: string;
  };
};

const LanguageSwitcher = ({ params }: Props) => {
  const { i18n, t } = useTranslation(params.lng, "translations");

  return (
    <DropdownMenu dir={i18n.language === FA ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={"lg"}
          aria-label="language-switcher"
          className="h-auto rounded-xl py-4"
        >
          <LanguagesIcon />
          <span>{t("change_language")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {languages.map((item, index) => {
          return (
            <DropdownMenuItem key={index}>
              <Link
                href={`/${item}`}
                className="flex items-center gap-2"
                passHref
              >
                <Image
                  alt="flag"
                  src={item === FA ? IranFlag : UnitedStatesFlag}
                  className="size-5 object-contain"
                />
                {item === FA && (
                  <span className="font-iranyekan">{PERSIAN}</span>
                )}
                {item === EN && (
                  <span className="font-montserrat">{ENGLISH}</span>
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
