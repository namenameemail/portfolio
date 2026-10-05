import { useEffect, useRef, useState } from 'react'
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
  const [bottomHidden, setBottomHidden] = useState(false)
  const skipBottomRef = useRef(false)
  skipBottomRef.current = bottomHidden

  const { activeId, pointerRef, centerRef } = useAimTarget(
    containerRef,
    itemRefs,
    aimEnabled,
    skipBottomRef,
  )

  const setItemRef = (id: AimMenuItemId, el: HTMLElement | null) => {
    itemRefs.current[id] = el
  }

  useEffect(() => {
    const onScroll = () => {
      const sample = itemRefs.current[AIM_MENU_BOTTOM[0].id]
      const height = sample?.offsetHeight ?? 0
      const next = window.scrollY > height
      setBottomHidden((prev) => (prev === next ? prev : next))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

      <motion.nav
        className="aim-menu__rail aim-menu__rail--bottom"
        aria-label={t('menu.bottom')}
        aria-hidden={bottomHidden}
        initial={false}
        animate={{ opacity: bottomHidden ? 0 : 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {AIM_MENU_BOTTOM.map((item) => (
          <AimMenuItem
            key={item.id}
            id={item.id}
            label={t(item.labelKey)}
            active={activeId === item.id}
            onRef={setItemRef}
          />
        ))}
      </motion.nav>

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
