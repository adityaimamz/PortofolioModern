"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { Timeline } from "./ui/Timeline";

const Experience = () => {
  const { t } = useTranslation();
  const jobs = t("experience.jobs") as Array<{
    title: string;
    company: string;
    duration: string;
    desc: string;
    techStack?: string;
    techStackItems?: Array<{ icon: string; name: string }>;
    achievements: string[];
  }>;

  const timelineData = [...jobs]
    .reverse()
    .map((exp) => ({
      title: exp.duration,
      content: (
        <div className="pb-8">
          {/* Company & Role */}
          <div className="mb-4">
            <h4 className="text-lg md:text-2xl font-bold text-white">
              {exp.title}{" "}
              <span className="text-purple">— {exp.company}</span>
            </h4>
          </div>

          {/* Description */}
          <p className="text-white-200 text-sm md:text-base mb-4 leading-relaxed">
            {exp.desc}
          </p>

          {/* Tech Stack Badges with Icons */}
          {exp.techStackItems && exp.techStackItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {exp.techStackItems.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 text-xs md:text-sm font-medium hover:bg-purple/10 hover:border-purple/30 transition-all duration-200"
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          )}

          {/* Fallback: old string-based techStack */}
          {!exp.techStackItems && exp.techStack && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-purple/10 border border-purple/20 text-purple-300 text-xs md:text-sm font-medium">
                {exp.techStack}
              </span>
            </div>
          )}

          {/* Impact / Achievements */}
          {exp.achievements && exp.achievements.length > 0 && (
            <div className="space-y-2">
              <p className="text-white text-sm font-bold">
                {t("experience.keyAchievements")}
              </p>
              <ul className="space-y-2">
                {exp.achievements.map((achievement: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-white-100 text-sm"
                  >
                    <span className="text-purple mt-1 flex-shrink-0">▹</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    }));

  return (
    <div className="py-20 w-full" id="experience">
      <h1 className="heading">
        {t("experience.headingPrefix")}{" "}
        <span className="text-purple">{t("experience.heading")}</span>
      </h1>
      <div className="w-full mt-12">
        <Timeline data={timelineData} />
      </div>
    </div>
  );
};

export default Experience;

