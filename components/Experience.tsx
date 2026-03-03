"use client";

import React from "react";
import { workExperience } from "@/data";
import { Timeline } from "./ui/timeline";

const Experience = () => {
  const timelineData = workExperience
    .slice()
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
                Key Achievements:
              </p>
              <ul className="space-y-2">
                {exp.achievements.map((achievement, i) => (
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

          {/* Thumbnail */}
          <div className="mt-4 flex items-center gap-3">
            <img
              src={exp.thumbnail}
              alt={exp.title}
              className="w-10 h-10 md:w-12 md:h-12 opacity-60"
            />
          </div>
        </div>
      ),
    }));

  return (
    <div className="py-20 w-full" id="experience">
      <h1 className="heading">
        My <span className="text-purple">work experience</span>
      </h1>
      <div className="w-full mt-12">
        <Timeline data={timelineData} />
      </div>
    </div>
  );
};

export default Experience;
