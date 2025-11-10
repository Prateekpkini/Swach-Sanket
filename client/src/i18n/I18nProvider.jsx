import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { translations } from "./translations";

const I18nContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en;
    const getter = (key, fallback) => {
      try {
        return key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), dict) ?? fallback ?? key;
      } catch {
        return fallback ?? key;
      }
    };
    return getter;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);


