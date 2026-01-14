import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trTranslations from './locales/tr';
import enTranslations from './locales/en';

const resources = {
  tr: {
    translation: trTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app-language') || 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
