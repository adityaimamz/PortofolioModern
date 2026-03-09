"use client";

import { FaDownload } from "react-icons/fa6";
import { useTranslation } from "@/context/LanguageContext";

import MagicButton from "./MagicButton";
// import { Spotlight } from "./ui/Spotlight";
import { Spotlight } from "./ui/SpotlightNew";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { EncryptedText } from "./ui/EncryptedText";
import { ShootingStars } from "./ui/ShootingStars";
import { StarsBackground } from "./ui/stars-background";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="pb-20 pt-32 md:pt-20">
      {/**
       *  UI: Spotlights
       *  Link: https://ui.aceternity.com/components/spotlight
       */}
      <div>
        {/* <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" /> */}
        {/* <Spotlight /> */}
        <ShootingStars className="z-[1]" />
        <StarsBackground className="z-[1]" />
      </div>

      {/**
       *  UI: grid
       *  change bg color to bg-black-100 and reduce grid color from
       *  0.2 to 0.03
       */}
      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        {/* Radial gradient for the container to give a faded look */}
        <div
          // chnage the bg to bg-black-100, so it matches the bg color and will blend in
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="relative z-10 mt-8 flex justify-center md:mt-12 lg:mt-16">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-neutral-300 max-w-80">
            {t("hero.tagline")}
          </p>

          {/**
           *  Link: https://ui.aceternity.com/components/text-generate-effect
           *
           *  change md:text-6xl, add more responsive code
           */}
          <TextGenerateEffect
            key={t("hero.title")}
            words={t("hero.title")}
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center mt-4 lg:mt-0 md:tracking-wider mb-4 lg:mb-0 text-sm md:text-lg lg:text-2xl">
            {t("hero.intro")}
          </p>

          <a href="/Aditya Imam Zuhdi-resume .pdf" download className="mt-8 lg:mt-0">
            <MagicButton
              title={t("hero.button")}
              icon={<FaDownload />}
              position="right"
            />
          </a>

          {/* Mini Metrics */}
          {(() => {
            const metrics = t("hero.metrics") as
              | Array<{ value: string; label: string }>
              | undefined;
            return metrics && metrics.length > 0 ? (
              <div className="flex items-start justify-center gap-6 md:gap-10 mt-10">
                {metrics.map((metric, i) => (
                  <div key={i} className="flex w-24 md:w-32 flex-col items-center">
                    <EncryptedText
                      text={metric.value}
                      className="text-center text-2xl md:text-3xl font-bold text-white"
                      revealDelayMs={35}
                      flipDelayMs={40}
                    />
                    <EncryptedText
                      text={metric.label}
                      className="mt-1 text-center text-xs md:text-sm text-neutral-400 leading-snug"
                      revealDelayMs={40}
                      flipDelayMs={45}
                    />
                  </div>
                ))}
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default Hero;
