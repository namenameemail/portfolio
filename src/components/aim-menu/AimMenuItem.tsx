import type { AimMenuItemId } from './aimMenuItems'

type AimMenuItemProps = {
  id: AimMenuItemId
  label: string
  active: boolean
  onRef: (id: AimMenuItemId, el: HTMLElement | null) => void
}

export function AimMenuItem({ id, label, active, onRef }: AimMenuItemProps) {
  return (
    <span
      ref={(el) => onRef(id, el)}
      className={['aim-menu__item', active ? 'aim-menu__item--active' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  )
}
