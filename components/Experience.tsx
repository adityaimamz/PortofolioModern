"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { Timeline } from "./ui/timeline";

const Experience = () => {
  const { t } = useTranslation();
  const jobs = t("experience.jobs") as Array<{
    title: string;
    company: string;
    duration: string;
    desc: string;
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
              {exp.title}
            </h4>
            <p className="text-purple text-sm md:text-base font-semibold mt-1">
              {exp.company}
            </p>
          </div>

          {/* Description */}
          <p className="text-white-200 text-sm md:text-base mb-4 leading-relaxed">
            {exp.desc}
          </p>

          {/* Achievements */}
          {exp.achievements && exp.achievements.length > 0 && (
            <div className="space-y-2">
              <p className="text-white text-sm font-semibold">
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

