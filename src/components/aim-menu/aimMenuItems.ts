import type { MessageKey } from '../../i18n/locales'

export type AimMenuItemId =
  | 'cv-bio'
  | 'graphics'
  | 'programs'
  | 'devices'
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
  { id: 'graphics', labelKey: 'menu.graphics', edge: 'top' },
  { id: 'programs', labelKey: 'menu.programs', edge: 'top' },
  { id: 'devices', labelKey: 'menu.devices', edge: 'bottom' },
  { id: 'contact', labelKey: 'menu.contact', edge: 'bottom' },
  { id: 'locale', labelKey: 'menu.locale', edge: 'bottom' },
]

export const AIM_MENU_TOP = AIM_MENU_ITEMS.filter((item) => item.edge === 'top')
export const AIM_MENU_BOTTOM = AIM_MENU_ITEMS.filter((item) => item.edge === 'bottom')
