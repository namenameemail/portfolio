import en from './en.json'
import ru from './ru.json'

export const LOCALES = ['ru', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const MESSAGES = { ru, en } as const

type MessageLeaf<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : {
      [K in keyof T & string]: MessageLeaf<
        T[K],
        Prefix extends '' ? K : `${Prefix}.${K}`
      >
    }[keyof T & string]

export type MessageKey = MessageLeaf<typeof ru>

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
