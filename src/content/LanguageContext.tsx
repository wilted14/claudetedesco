"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { site, type Locale } from "@/content/site";
import { siteEn } from "@/content/site.en";

const STORAGE_KEY = "ct-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  site: typeof site;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  // Langue mémorisée (ou langue du navigateur au premier passage)
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "fr" || stored === "en") {
      setLocaleState(stored);
    } else if (navigator.language.toLowerCase().startsWith("en")) {
      setLocaleState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const value = useMemo(
    () => ({ locale, setLocale, site: locale === "en" ? siteEn : site }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useSite must be used within LanguageProvider");
  return ctx.site;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
