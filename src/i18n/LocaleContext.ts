import { createContext } from 'react'
import type { Locale, MessageKey } from './locales'

export type LocaleContextValue = {
  locale: Locale
  t: (key: MessageKey) => string
  cycleLocale: () => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
