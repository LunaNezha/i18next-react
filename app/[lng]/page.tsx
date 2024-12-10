"use client";

import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import HeaderImage from "@/public/images/header.png";
import HeaderBgImage from "@/public/images/header-bg.png";
import LanguageSwitcher from "@/components/language-switcher";

type Props = {
  params: {
    lng: string;
  };
};

const Home = ({ params }: Props) => {
  const { t } = useTranslation(params.lng, "translations");

  return (
    <div className="xs:gap-8 relative z-0 flex h-full flex-col items-center gap-4 p-10 md:flex-row lg:gap-20 lg:p-20">
      <Image
        src={HeaderBgImage}
        className="absolute inset-x-auto z-0 w-full md:inset-y-auto md:ltr:-left-40 md:rtl:-right-40"
        width={800}
        height={800}
        alt="header image"
      />

      {/* image */}
      <div className="z-10 flex flex-1 items-center justify-center">
        <Image
          src={HeaderImage}
          className="xs:w-9/12 w-10/12 object-contain sm:w-8/12 md:w-full 2xl:w-9/12"
          width={800}
          height={800}
          alt="header image"
        />
      </div>

      {/* content */}
      <div className="rtl:font-iranyekan ltr:font-montserrat z-10 flex flex-1 flex-col items-center gap-4 text-center text-gray-50 md:items-start md:ltr:text-left md:rtl:text-right">
        {/* title */}
        <h4 className="text-xl font-extrabold lg:text-2xl">
          {t("header.title")}
        </h4>

        {/* description */}
        <p className="mb-3 text-base leading-7 opacity-70 lg:mb-8 lg:text-lg">
          {t("header.description")}
        </p>

        {/* language switcher */}
        <LanguageSwitcher params={{ lng: params.lng }} />
      </div>
    </div>
  );
};
export default Home;
