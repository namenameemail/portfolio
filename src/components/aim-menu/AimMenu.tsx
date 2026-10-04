import { useRef } from 'react'
import { motion } from 'motion/react'
import { useLocale } from '../../i18n/useLocale'
import {
  AIM_MENU_BOTTOM,
  AIM_MENU_TOP,
  type AimMenuItemId,
} from './aimMenuItems'
import { AimMenuDevOverlay } from './AimMenuDevOverlay'
import { AimMenuItem } from './AimMenuItem'
import { useAimTarget } from './useAimTarget'
import { useFinePointer } from './useFinePointer'
import './AimMenu.css'

type AimMenuProps = {
  children?: React.ReactNode
  className?: string
  covered?: boolean
  onSelect?: (id: AimMenuItemId) => void
}

export function AimMenu({
  children,
  className,
  covered = false,
  onSelect,
}: AimMenuProps) {
  const { t, cycleLocale } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Partial<Record<AimMenuItemId, HTMLElement | null>>>({})
  const finePointer = useFinePointer()
  const aimEnabled = finePointer && !covered

  const { activeId, pointerRef, centerRef } = useAimTarget(
    containerRef,
    itemRefs,
    aimEnabled,
  )

  const setItemRef = (id: AimMenuItemId, el: HTMLElement | null) => {
    itemRefs.current[id] = el
  }

  const onClick = () => {
    if (!aimEnabled || !activeId) return
    const item = itemRefs.current[activeId]
    if (item && window.scrollY > item.offsetHeight) return
    if (activeId === 'locale') cycleLocale()
    onSelect?.(activeId)
  }

  const rootClass = ['aim-menu', className ?? ''].filter(Boolean).join(' ')

  return (
    <motion.div
      ref={containerRef}
      className={rootClass}
      data-active={activeId ?? undefined}
      onClick={onClick}
      initial={false}
      animate={{ opacity: covered ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        pointerEvents: covered ? 'none' : undefined,
        cursor: covered ? 'auto' : undefined,
      }}
    >
      <div className="aim-menu__stage">{children}</div>

      <nav className="aim-menu__rail aim-menu__rail--top" aria-label={t('menu.top')}>
        {AIM_MENU_TOP.map((item) => (
          <AimMenuItem
            key={item.id}
            id={item.id}
            label={t(item.labelKey)}
            active={activeId === item.id}
            onRef={setItemRef}
          />
        ))}
      </nav>

      <nav className="aim-menu__rail aim-menu__rail--bottom" aria-label={t('menu.bottom')}>
        {AIM_MENU_BOTTOM.map((item) => (
          <AimMenuItem
            key={item.id}
            id={item.id}
            label={t(item.labelKey)}
            active={activeId === item.id}
            onRef={setItemRef}
          />
        ))}
      </nav>

      {aimEnabled ? (
        <AimMenuDevOverlay
          containerRef={containerRef}
          pointerRef={pointerRef}
          centerRef={centerRef}
        />
      ) : null}
    </motion.div>
  )
}
