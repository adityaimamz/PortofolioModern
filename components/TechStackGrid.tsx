"use client";

import React from "react";
import { techStackItems } from "@/data";
import { useTranslation } from "@/context/LanguageContext";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { motion } from "framer-motion";

const TechStackGrid = () => {
  const { t } = useTranslation();

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
      <div className="flex flex-row items-center justify-center w-full mb-16">
        <AnimatedTooltip items={techStackItems} />
      </div>

      {/* Tech Stack Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
        {techStackItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-white/[0.1] overflow-hidden"
              style={{
                background: "rgb(15,15,15)",
                backgroundColor:
                  "linear-gradient(90deg, rgba(15,15,15,1) 0%, rgba(30,30,30,1) 100%)",
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple/10 via-blue-500/10 to-purple/10 rounded-2xl" />

              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 md:w-14 md:h-14 object-contain relative z-10"
              />
              <span className="text-white text-xs md:text-sm font-medium text-center relative z-10">
                {item.name}
              </span>
              <span className="text-white-200 text-[10px] md:text-xs text-center relative z-10">
                {item.designation}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechStackGrid;

