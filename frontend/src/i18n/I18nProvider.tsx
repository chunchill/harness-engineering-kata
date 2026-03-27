import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { I18nContext } from './context'
import { type Locale, type MessageKey, messages } from './messages'

const LOCALE_KEY = 'task-board-locale'

function readStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(LOCALE_KEY)
    if (v === 'en' || v === 'zh') return v
  } catch {
    /* ignore */
  }
  return null
}

function inferLocaleFromNavigator(): Locale {
  const nav = (typeof navigator !== 'undefined' && navigator.language) || ''
  return nav.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

function initialLocale(): Locale {
  return readStoredLocale() ?? inferLocaleFromNavigator()
}

function htmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.lang = htmlLang(locale)
  }, [locale])

  const t = useCallback(
    (key: MessageKey) => messages[locale][key] ?? key,
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
