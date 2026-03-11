"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { useTranslation } from "@/context/LanguageContext";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-20 pb-10 relative" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-10 md:-bottom-24 h-[60vh] md:h-[40vh] md:min-h-96 pointer-events-none">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50 object-cover object-bottom"
        />
      </div>

      <div className="flex flex-col items-center relative z-10">
        <h1 className="heading lg:max-w-[45vw]">
          {t("footer.headingPart1")}{" "}
          <span className="text-purple">{t("footer.headingHighlight")}</span>{" "}
          {t("footer.headingPart2")}
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          {t("footer.subtitle")}
        </p>
        <a href="mailto:20102217@ittelkom-pwt.ac.id">
          <MagicButton
            title={t("footer.button")}
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center relative z-10">
        <p className="mb-4 md:text-base md:mb-0 text-sm md:font-normal font-light">
          {t("footer.copyright").replace("2024", currentYear.toString())}
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              key={info.id}
              href={info.link}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <img src={info.img} alt="icons" width={20} height={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
