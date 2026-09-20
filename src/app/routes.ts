import type { MessageKey } from '../i18n/locales'

export const PAGE_IDS = ['cv-bio', 'projects', 'contact'] as const

export type PageId = (typeof PAGE_IDS)[number]

export type AppRoute = 'home' | PageId

export const PAGE_TITLE_KEYS: Record<PageId, MessageKey> = {
  'cv-bio': 'pages.cvBio',
  projects: 'pages.projects',
  contact: 'pages.contact',
}

export function isPageId(value: string): value is PageId {
  return (PAGE_IDS as readonly string[]).includes(value)
}

export function pathFor(route: AppRoute): string {
  if (route === 'home') return '.'
  return route
}

export function pageFromPathname(pathname: string): AppRoute {
  const parts = pathname.split('/').filter(Boolean)
  const last = parts[parts.length - 1] ?? ''
  if (!last || last === 'portfolio' || last === 'index.html') return 'home'
  return isPageId(last) ? last : 'home'
}
