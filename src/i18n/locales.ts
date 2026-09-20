import en from './en.json'
import ru from './ru.json'

export const LOCALES = ['ru', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const MESSAGES = { ru, en } as const

export type MessageKey =
  | 'meta.title'
  | 'meta.lang'
  | 'menu.top'
  | 'menu.bottom'
  | 'menu.cvBio'
  | 'menu.projects'
  | 'menu.contact'
  | 'menu.locale'
  | 'pages.cvBio'
  | 'pages.projects'
  | 'pages.contact'
  | 'pages.back'
  | 'cvBio.lead'
  | 'cvBio.sectionExperience'
  | 'cvBio.experienceBody'
  | 'cvBio.sectionSkills'
  | 'cvBio.skillsBody'

export const LOCALE_STORAGE_KEY = 'portfolio-locale'

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function nextLocale(locale: Locale): Locale {
  const index = LOCALES.indexOf(locale)
  return LOCALES[(index + 1) % LOCALES.length] ?? 'ru'
}

export function readMessage(locale: Locale, key: MessageKey): string {
  const parts = key.split('.')
  let node: unknown = MESSAGES[locale]
  for (const part of parts) {
    if (typeof node !== 'object' || node === null || !(part in node)) return key
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : key
}
