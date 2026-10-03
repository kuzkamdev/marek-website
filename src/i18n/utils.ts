import { defaultLang, languages, ui, type Lang, type UiKey } from './ui';

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

export function getLang(currentLocale: string | undefined): Lang {
  return isLang(currentLocale) ? currentLocale : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}
