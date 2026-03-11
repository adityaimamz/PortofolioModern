"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/[0.2] p-1 bg-black-200/50 backdrop-blur-sm">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          language === "en"
            ? "bg-gradient-to-r from-[#555] to-[#333] text-white shadow-lg"
            : "text-neutral-400 hover:text-white"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage("id")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          language === "id"
            ? "bg-gradient-to-r from-[#555] to-[#333] text-white shadow-lg"
            : "text-neutral-400 hover:text-white"
        }`}
      >
        Indonesia
      </button>
    </div>
  );
};

export default LanguageSwitcher;
