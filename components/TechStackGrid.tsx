"use client";

import React from "react";
import { techStackItems } from "@/data";
import { useTranslation } from "@/context/LanguageContext";
import { HoverEffect } from "./ui/CardHoverEffect";

const categories = [
  { key: "Frontend", label: "Frontend", labelId: "Frontend" },
  { key: "Backend", label: "Backend", labelId: "Backend" },
  { key: "Other Tools", label: "Other Tools", labelId: "Tools Lainnya" },
];

const TechStackGrid = () => {
  const { t, language } = useTranslation();

  return (
    <section className="py-20" id="tech-stack">
      <h1 className="heading">
        {t("techStack.headingPrefix")}{" "}
        <span className="text-purple">{t("techStack.heading")}</span>
      </h1>
      <p className="text-center text-white-200 mt-4 mb-12 text-sm md:text-base max-w-2xl mx-auto">
        {t("techStack.subtitle")}
      </p>

      {/* Animated Tooltip Row */}
      {/* <div className="flex flex-row items-center justify-center w-full mb-16">
        <AnimatedTooltip items={techStackItems} />
      </div> */}

      {/* Tech Stack by Category */}
      <div className="max-w-5xl mx-auto space-y-10">
        {categories.map((category) => {
          const items = techStackItems.filter(
            (item) => item.designation === category.key,
          );
          return (
            <div key={category.key}>
              <h3 className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-4 pl-1">
                {language === "id" ? category.labelId : category.label}
              </h3>
              <HoverEffect
                items={items}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 py-0"
                getItemKey={(item) => item.id}
                renderItem={(item) => (
                  <div className="relative z-20 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/[0.1] overflow-hidden bg-[linear-gradient(90deg,rgba(15,15,15,1)_0%,rgba(30,30,30,1)_100%)] h-full transition-transform duration-300 group-hover:scale-[1.03]">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple/10 via-blue-500/10 to-purple/10 rounded-2xl" />
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-10 h-10 md:w-12 md:h-12 object-contain relative z-10 ${item.name === "Express.js" || item.name === "OpenAI API" || item.name === "Flask" ? "invert" : ""}`}
                    />
                    <span className="text-white text-[11px] md:text-xs font-medium text-center relative z-10 leading-tight">
                      {item.name}
                    </span>
                  </div>
                )}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TechStackGrid;
