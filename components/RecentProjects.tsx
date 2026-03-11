"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { projects } from "@/data";
import { ExpandableProjectCard } from "./ui/ExpandableProjectCard";

const ITEMS_PER_PAGE = 4;

const RecentProjects = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const projectTranslations = t("projects.items") as Array<{
    title: string;
    des: string;
    highlights?: string[];
    tags?: string[];
  }>;

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const needsPagination = projects.length > ITEMS_PER_PAGE;

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  return (
    <div className="" id="projects">
      <h1 className="heading">
        {t("projects.headingPrefix")}{" "}
        <span className="text-purple">{t("projects.heading")}</span>
      </h1>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10"
        >
          {visibleProjects.map((item, index) => {
            const globalIndex = startIndex + index;
            return (
              <div
                className="lg:min-h-[25rem] h-[18rem] flex items-center justify-center sm:w-96 w-[80vw]"
                key={item.id}
              >
                <ExpandableProjectCard
                  item={{
                    ...item,
                    title:
                      projectTranslations[globalIndex]?.title ?? item.title,
                    des: projectTranslations[globalIndex]?.des ?? item.des,
                    highlights:
                      projectTranslations[globalIndex]?.highlights ??
                      (item as any).highlights,
                    tags:
                      projectTranslations[globalIndex]?.tags ??
                      (item as any).tags,
                  }}
                />
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {needsPagination && (
        <div className="flex justify-center items-center gap-6 mt-8 relative z-50">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === page
                    ? "w-6 h-2 bg-purple"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
