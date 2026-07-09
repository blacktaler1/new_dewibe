import type { Locale, LocalizedText } from "./types";

export const LOCALES: { code: Locale; label: string; menuLabel: string }[] = [
  { code: "en", label: "EN", menuLabel: "english" },
  { code: "uz", label: "UZ", menuLabel: "o'zbek" },
  { code: "ru", label: "RU", menuLabel: "русский" },
];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "dewibe-locale";

export function lt(text: LocalizedText | string | undefined, locale: Locale): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.en || "";
}

export function L(en: string, uz: string, ru: string): LocalizedText {
  return { en, uz, ru };
}

export function toLocalized(
  value: string | LocalizedText | undefined,
  fallback = "",
): LocalizedText {
  if (!value) return L(fallback, fallback, fallback);
  if (typeof value === "string") return L(value, value, value);
  return {
    en: value.en ?? fallback,
    uz: value.uz ?? value.en ?? fallback,
    ru: value.ru ?? value.en ?? fallback,
  };
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "uz" || value === "ru";
}
