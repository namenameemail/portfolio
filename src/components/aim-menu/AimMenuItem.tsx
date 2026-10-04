import { motion } from 'motion/react'
import type { AimMenuItemId } from './aimMenuItems'

type AimMenuItemProps = {
  id: AimMenuItemId
  label: string
  active: boolean
  onRef: (id: AimMenuItemId, el: HTMLElement | null) => void
}

export function AimMenuItem({ id, label, active, onRef }: AimMenuItemProps) {
  return (
    <motion.span
      ref={(el) => onRef(id, el)}
      className="aim-menu__item"
      initial={false}
      animate={{
        color: active ? '#111' : '#fff',
        backgroundColor: active ? '#fff' : 'rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      {label}
    </motion.span>
  )
}
