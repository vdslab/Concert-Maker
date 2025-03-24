import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translation_en from "./en.json";
import translation_ja from "./ja.json";

const resources = {
  en: { translation: translation_en },
  ja: { translation: translation_ja }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en", // デフォルトの言語を設定
    returnEmptyString: false,  // 空文字での定義を許可
    supportedLngs: Object.keys(resources),
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
