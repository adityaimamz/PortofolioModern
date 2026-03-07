"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { CardSpotlight } from "./ui/CardSpotlight";
import {
  FaLink,
  FaRobot,
  FaComments,
  FaMagnifyingGlass,
} from "react-icons/fa6";

const iconMap = [
  <FaLink key="rag" className="w-6 h-6" />,
  <FaRobot key="llm" className="w-6 h-6" />,
  <FaComments key="chatbot" className="w-6 h-6" />,
  <FaMagnifyingGlass key="kb" className="w-6 h-6" />,
];

const spotlightColors = ["#1e3a5f", "#3b1f5e", "#1a3d2e", "#4a2c17"];

const AICapability = () => {
  const { t } = useTranslation();
  const items = t("aiCapability.items") as Array<{
    title: string;
    desc: string;
  }>;

  return (
    <section className="w-full py-20" id="ai-capability">
      <h1 className="heading">
        {t("aiCapability.headingPrefix")}{" "}
        <span className="text-purple">{t("aiCapability.heading")}</span>
      </h1>
      <p className="text-center text-neutral-400 mt-4 mb-12 text-sm md:text-base max-w-2xl mx-auto">
        {t("aiCapability.subtitle")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {items.map((item, index) => (
          <CardSpotlight
            key={index}
            className="p-8 rounded-2xl border border-white/[0.08] bg-[#0f0f0f] hover:border-purple/30 transition-colors duration-300"
            color={spotlightColors[index] || "#262626"}
          >
            <div className="relative z-20">
              <div className="w-12 h-12 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple mb-5">
                {iconMap[index]}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </CardSpotlight>
        ))}
      </div>
    </section>
  );
};

export default AICapability;
