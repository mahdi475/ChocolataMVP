import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enAuth from '../locales/en/auth.json';
import enProducts from '../locales/en/products.json';
import enDashboard from '../locales/en/dashboard.json';
import enUi from '../locales/en/ui.json';
import deAuth from '../locales/de/auth.json';
import deProducts from '../locales/de/products.json';
import deDashboard from '../locales/de/dashboard.json';
import deUi from '../locales/de/ui.json';
import svUi from '../locales/sv/ui.json';
import frUi from '../locales/fr/ui.json';
import itUi from '../locales/it/ui.json';
import esUi from '../locales/es/ui.json';
import nlUi from '../locales/nl/ui.json';
import daUi from '../locales/da/ui.json';
import noUi from '../locales/no/ui.json';
import fiUi from '../locales/fi/ui.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        products: enProducts,
        dashboard: enDashboard,
        ui: enUi,
      },
      de: {
        auth: deAuth,
        products: deProducts,
        dashboard: deDashboard,
        ui: deUi,
      },
      sv: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: svUi },
      fr: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: frUi },
      it: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: itUi },
      es: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: esUi },
      nl: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: nlUi },
      da: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: daUi },
      no: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: noUi },
      nb: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: noUi },
      nn: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: noUi },
      fi: { auth: enAuth, products: enProducts, dashboard: enDashboard, ui: fiUi },
    },
    supportedLngs: ['en', 'sv', 'de', 'fr', 'it', 'es', 'nl', 'da', 'no', 'nb', 'nn', 'fi'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'en',
    fallbackNS: ['ui', 'auth', 'products', 'dashboard'],
    defaultNS: 'auth',
    ns: ['auth', 'products', 'dashboard', 'ui'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'chocolataLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
