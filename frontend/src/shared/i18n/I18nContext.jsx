import { createContext, useContext, useMemo, useState } from 'react';
import { UI, WORDS } from './dictionary';

const STORAGE_KEY = 'asean-explorer-locale';
const I18nContext = createContext(null);

function detectDefaultLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'my') return saved;
  } catch {
    // localStorage can throw in private/blocked contexts — fall through to detection.
  }
  return navigator.language?.toLowerCase().startsWith('my') ? 'my' : 'en';
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detectDefaultLocale);

  const setLocale = (next) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // per-viewer convenience only — a failed save just means it resets next visit.
    }
  };

  const value = useMemo(() => {
    // t(key, vars) — static UI copy, e.g. t('guess.round', { current: 1, total: 10 }).
    const t = (key, vars) => interpolate(UI[locale]?.[key] ?? UI.en[key] ?? key, vars);
    // tWord(atom) — a snake_case data atom from the backend (country, capital,
    // topic, ...). Falls back to a humanized English label if untranslated.
    const tWord = (atom) => {
      if (!atom) return atom;
      if (locale === 'my' && WORDS[atom]) return WORDS[atom];
      return String(atom).replace(/_/g, ' ');
    };
    return { locale, setLocale, t, tWord };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside an <I18nProvider>');
  return ctx;
}
