import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe2 } from 'lucide-react';
import styles from './LanguageSelector.module.css';

const LANGUAGES = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'sv', short: 'SV', label: 'Svenska' },
  { code: 'de', short: 'DE', label: 'Deutsch' },
  { code: 'fr', short: 'FR', label: 'Francais' },
  { code: 'it', short: 'IT', label: 'Italiano' },
  { code: 'es', short: 'ES', label: 'Espanol' },
  { code: 'nl', short: 'NL', label: 'Nederlands' },
  { code: 'da', short: 'DA', label: 'Dansk' },
  { code: 'no', short: 'NO', label: 'Norsk' },
  { code: 'fi', short: 'FI', label: 'Suomi' },
];

const normalizeLanguage = (language?: string) => {
  const normalized = (language || 'en').toLowerCase().split('-')[0];
  if (normalized === 'nb' || normalized === 'nn') return 'no';
  return LANGUAGES.some((item) => item.code === normalized) ? normalized : 'en';
};

const LanguageSelector = () => {
  const { i18n, t } = useTranslation('ui');
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const activeCode = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const activeLanguage = useMemo(
    () => LANGUAGES.find((language) => language.code === activeCode) || LANGUAGES[0],
    [activeCode]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    window.localStorage.setItem('chocolataLng', code);
    setIsOpen(false);
  };

  return (
    <div className={styles.selector} ref={selectorRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={t('language.selectorLabel')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={`${t('language.current')}: ${activeLanguage.label}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Globe2 className={styles.icon} />
        <span className={styles.shortCode}>{activeLanguage.short}</span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu" aria-label={t('language.selectorLabel')}>
          {LANGUAGES.map((language) => {
            const isActive = language.code === activeCode;

            return (
              <button
                key={language.code}
                type="button"
                className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className={styles.optionLabel}>{language.label}</span>
                <span className={styles.optionMeta}>{language.short}</span>
                {isActive && <Check className={styles.checkIcon} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
