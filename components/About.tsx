"use client";

import { useTranslation } from "@/context/LanguageContext";
import Image from "next/image";

const About = () => {
  const { t } = useTranslation();

  const paragraphs = t("aboutSection.paragraphs") as string[];
  const highlights = t("aboutSection.highlights") as string[];
  const stats = t("aboutSection.stats") as { value: string; label: string }[];

  return (
    <section id="about" className="w-full py-20 flex justify-center z-10 relative">
      <div className="flex flex-col gap-6 w-full text-left text-neutral-300">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t("aboutSection.heading")}</h2>
          <p className="text-sm md:text-base text-purple tracking-wide font-medium">
            {t("aboutSection.role")}
          </p>
        </div>
        
        <div className="border-t border-dashed border-neutral-700 w-full my-4"></div>

        <div className="flex flex-col md:flex-row gap-16 items-center md:items-start w-full">
          {/* TEXT */}
          <div className="flex-1 max-w-3xl flex flex-col gap-5 text-base leading-relaxed text-justify">
            {Array.isArray(paragraphs) ? paragraphs.map((item, i) => (
              <p key={i}>{item}</p>
            )) : null}

            {/* <div className="flex flex-col gap-2 mt-2">
              <p className="font-semibold text-white">{t("aboutSection.highlightsHeading")}</p>
              <ul className="list-none flex flex-col gap-2">
                {Array.isArray(highlights) ? highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple flex-shrink-0"></span>
                    {highlight}
                  </li>
                )) : null}
              </ul>
            </div> */}

            {/* <p className="mt-2 text-neutral-300">{t("aboutSection.closingParagraph")}</p> */}

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-neutral-400">{t("aboutSection.closing")}</p>
              <div className="relative w-40 h-16">
                <Image
                  src="/signature-image.webp"
                  alt={t("aboutSection.signature")}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* QUICK STATS */}
            {/* <div className="mt-8 flex gap-6 md:gap-10 border-t border-neutral-800 pt-6">
              {Array.isArray(stats) ? stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              )) : null}
            </div> */}
          </div>
          
          {/* PHOTO */}
          <div className="
            relative 
            w-72 h-[420px] md:h-[480px]
            rounded-2xl
            overflow-hidden
            border border-neutral-700
            bg-neutral-900/60
            backdrop-blur
            shadow-2xl
            transition duration-300
            hover:scale-[1.02]
            group
          ">
            {/* Soft Glow Behind Image inside container */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <Image
              src="/about-image.webp"
              alt={t("aboutSection.signature") || "About Image"}
              fill
              className="object-cover object-top z-10"
              sizes="(max-width: 768px) 288px, 288px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
