"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "@/messages/en.json";
import id from "@/messages/id.json";

type Language = "en" | "id";

const messages: Record<Language, Record<string, any>> = { en, id };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Language;
    if (saved && (saved === "en" || saved === "id")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string): any => {
      const keys = key.split(".");
      let result: any = messages[language];
      for (const k of keys) {
        if (result === undefined || result === null) return key;
        result = result[k];
      }
      return result ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}
