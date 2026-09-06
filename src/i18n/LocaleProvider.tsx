import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocaleContext } from './LocaleContext'
import {
  isLocale,
  LOCALE_STORAGE_KEY,
  nextLocale,
  readMessage,
  type Locale,
} from './locales'

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  return stored && isLocale(stored) ? stored : 'ru'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = readMessage(locale, 'meta.lang')
    document.title = readMessage(locale, 'meta.title')
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      t: (key: Parameters<typeof readMessage>[1]) => readMessage(locale, key),
      cycleLocale: () => setLocale((current) => nextLocale(current)),
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
