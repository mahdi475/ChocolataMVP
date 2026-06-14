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
import svAuth from '../locales/sv/auth.json';
import svUi from '../locales/sv/ui.json';
import frAuth from '../locales/fr/auth.json';
import frUi from '../locales/fr/ui.json';
import itAuth from '../locales/it/auth.json';
import itUi from '../locales/it/ui.json';
import esAuth from '../locales/es/auth.json';
import esUi from '../locales/es/ui.json';
import nlAuth from '../locales/nl/auth.json';
import nlUi from '../locales/nl/ui.json';
import daAuth from '../locales/da/auth.json';
import daUi from '../locales/da/ui.json';
import noAuth from '../locales/no/auth.json';
import noUi from '../locales/no/ui.json';
import fiAuth from '../locales/fi/auth.json';
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
      sv: { auth: svAuth, products: enProducts, dashboard: enDashboard, ui: svUi },
      fr: { auth: frAuth, products: enProducts, dashboard: enDashboard, ui: frUi },
      it: { auth: itAuth, products: enProducts, dashboard: enDashboard, ui: itUi },
      es: { auth: esAuth, products: enProducts, dashboard: enDashboard, ui: esUi },
      nl: { auth: nlAuth, products: enProducts, dashboard: enDashboard, ui: nlUi },
      da: { auth: daAuth, products: enProducts, dashboard: enDashboard, ui: daUi },
      no: { auth: noAuth, products: enProducts, dashboard: enDashboard, ui: noUi },
      nb: { auth: noAuth, products: enProducts, dashboard: enDashboard, ui: noUi },
      nn: { auth: noAuth, products: enProducts, dashboard: enDashboard, ui: noUi },
      fi: { auth: fiAuth, products: enProducts, dashboard: enDashboard, ui: fiUi },
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
