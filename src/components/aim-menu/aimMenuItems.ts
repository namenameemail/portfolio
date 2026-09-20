import type { MessageKey } from '../../i18n/locales'

export type AimMenuItemId =
  | 'cv-bio'
  | 'projects'
  | 'contact'
  | 'locale'

export type AimMenuEdge = 'top' | 'bottom'

export type AimMenuItem = {
  id: AimMenuItemId
  labelKey: MessageKey
  edge: AimMenuEdge
}

export const AIM_MENU_ITEMS: AimMenuItem[] = [
  { id: 'cv-bio', labelKey: 'menu.cvBio', edge: 'top' },
  { id: 'projects', labelKey: 'menu.projects', edge: 'top' },
  { id: 'contact', labelKey: 'menu.contact', edge: 'bottom' },
  { id: 'locale', labelKey: 'menu.locale', edge: 'bottom' },
]

export const AIM_MENU_TOP = AIM_MENU_ITEMS.filter((item) => item.edge === 'top')
export const AIM_MENU_BOTTOM = AIM_MENU_ITEMS.filter((item) => item.edge === 'bottom')
