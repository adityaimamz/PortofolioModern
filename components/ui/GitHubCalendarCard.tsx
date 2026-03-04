"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher } from "@/services/fetcher";
import { useTranslation } from "@/context/LanguageContext";

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface Week {
  firstDay: string;
  contributionDays: ContributionDay[];
}

interface CalendarData {
  totalContributions: number;
  weeks: Week[];
  months: { name: string; firstDay: string; totalWeeks: number }[];
  colors: string[];
}

const PURPLE_COLORS = [
  "rgba(139, 92, 246, 0.15)",
  "rgba(139, 92, 246, 0.35)",
  "rgba(139, 92, 246, 0.55)",
  "rgba(139, 92, 246, 0.80)",
];

const GitHubCalendarCard = () => {
  const { data, isLoading } = useSWR<CalendarData>("/api/github", fetcher);
  const { language } = useTranslation();
  const [tooltip, setTooltip] = useState<{
    count: number | null;
    date: string | null;
    x: number;
    y: number;
  }>({ count: null, date: null, x: 0, y: 0 });

  const weeks = data?.weeks ?? [];
  const totalContributions = data?.totalContributions ?? 0;

  const getColor = (day: ContributionDay) => {
    if (day.contributionCount === 0) return "rgba(255,255,255,0.04)";
    const idx = data?.colors?.indexOf(day.color) ?? -1;
    if (idx >= 0 && idx < PURPLE_COLORS.length) return PURPLE_COLORS[idx];
    if (day.contributionCount >= 10) return PURPLE_COLORS[3];
    if (day.contributionCount >= 5) return PURPLE_COLORS[2];
    if (day.contributionCount >= 2) return PURPLE_COLORS[1];
    return PURPLE_COLORS[0];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-4">
        <div className="w-full flex flex-col gap-[3px]">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex gap-[3px]">
              {[...Array(20)].map((_, j) => (
                <div
                  key={j}
                  className="w-[10px] h-[10px] rounded-[2px] bg-white/[0.04] animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact: only last ~26 weeks on mobile, full on desktop
  const displayWeeks = weeks;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 16 16"
            className="w-5 h-5 fill-white/70"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="text-white/70 text-xs sm:text-sm font-medium">
            {language === "id" ? "Kontribusi GitHub" : "GitHub Contributions"}
          </span>
          <span className="font-light text-xs sm:text-sm text-white/70">@adityaimamz</span>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-purple text-xs sm:text-sm font-bold"
        >
          {totalContributions.toLocaleString()}{" "}
          {language === "id" ? "kontribusi" : "contributions"}
        </motion.span>
      </div>

      {/* Heatmap */}
      <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide z-10">
        <div className="flex gap-[2px] sm:gap-[3px] mx-auto">
          {displayWeeks.map((week, wi) => (
            <div key={week.firstDay} className="flex flex-col gap-[2px] sm:gap-[3px]">
              {week.contributionDays.map((day) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: Math.min(wi * 0.01, 0.5),
                    duration: 0.2,
                  }}
                  className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] lg:w-[11px] lg:h-[11px] rounded-[2px] cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-purple/50 hover:scale-125"
                  style={{ backgroundColor: getColor(day) }}
                  onMouseEnter={(e) => {
                    const rect = (
                      e.target as HTMLElement
                    ).getBoundingClientRect();
                    setTooltip({
                      count: day.contributionCount,
                      date: day.date,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() =>
                    setTooltip({ count: null, date: null, x: 0, y: 0 })
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer tagline */}
      <div className="flex items-center justify-between mt-3 z-10">
        <p className="text-white/30 text-[10px] sm:text-xs italic">
          {language === "id"
            ? "Aktivitas GitHub saya selama setahun terakhir."
            : "My GitHub activity over the past year."}
        </p>
        {/* Legend */}
        <div className="flex items-center gap-1">
          <span className="text-white/30 text-[10px]">
            {language === "id" ? "Sedikit" : "Less"}
          </span>
          <div className="w-[8px] h-[8px] rounded-[2px] bg-white/[0.04]" />
          {PURPLE_COLORS.map((color, i) => (
            <div
              key={i}
              className="w-[8px] h-[8px] rounded-[2px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-white/30 text-[10px]">
            {language === "id" ? "Banyak" : "More"}
          </span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.count !== null && (
        <div
          className="fixed z-[9999] px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-xs text-white shadow-xl pointer-events-none backdrop-blur-sm"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          <span className="font-bold text-purple">{tooltip.count}</span>{" "}
          {language === "id" ? "kontribusi pada" : "contributions on"}{" "}
          {formatDate(tooltip.date!)}
        </div>
      )}
    </div>
  );
};

export default GitHubCalendarCard;
