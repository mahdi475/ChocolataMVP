import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enAuth from '../locales/en/auth.json';
import enProducts from '../locales/en/products.json';
import enDashboard from '../locales/en/dashboard.json';
import deAuth from '../locales/de/auth.json';
import deProducts from '../locales/de/products.json';
import deDashboard from '../locales/de/dashboard.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        products: enProducts,
        dashboard: enDashboard,
      },
      de: {
        auth: deAuth,
        products: deProducts,
        dashboard: deDashboard,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

