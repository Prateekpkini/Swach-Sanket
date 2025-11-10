import React from "react";
import { useI18n } from "../i18n/I18nProvider";

export default function LanguageSwitcher({ position = "fixed", className = "" }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`${position} top-3 right-3 z-[1000]`}
      aria-label="Language Switcher"
    >
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className={`px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 text-sm shadow ${className}`}
      >
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>
    </div>
  );
}


