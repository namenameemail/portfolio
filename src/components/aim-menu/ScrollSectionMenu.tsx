import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { PAGE_IDS, type PageId } from '../../app/routes'
import { useLocale } from '../../i18n/useLocale'
import { AIM_MENU_ITEMS, type AimMenuItemId } from './aimMenuItems'
import { useCompactMenu } from './useCompactMenu'
import './ScrollSectionMenu.css'

const slotEase = [0.22, 1, 0.36, 1] as const

type ScrollSectionMenuProps = {
  onSelect: (id: AimMenuItemId) => void
}

function readBarPx() {
  const el = document.querySelector('.scroll-section-menu__measure--bar')
  const value = el?.getBoundingClientRect().height ?? 0
  return value > 0 ? value : 50
}

function readCurrentSection(): PageId | null {
  const probe = readBarPx() + 1
  for (const id of PAGE_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= probe && rect.bottom > probe) return id
  }
  return null
}

function ScrollSectionMenuSlot({
  spaced,
  hidden,
  stack,
  animateWidth,
  label,
  onClick,
}: {
  spaced: boolean
  hidden: boolean
  stack: boolean
  animateWidth: boolean
  label: string
  onClick: () => void
}) {
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <motion.span
      ref={ref}
      className="scroll-section-menu__slot"
      aria-hidden={hidden || undefined}
      initial={false}
      animate={
        stack
          ? { width: 'auto', height: hidden ? 0 : 'auto' }
          : { width: hidden ? 0 : 'auto', height: 'auto' }
      }
      transition={{ duration: animateWidth ? 0.35 : 0, ease: slotEase }}
      onAnimationComplete={() => {
        if (hidden || !ref.current) return
        ref.current.style.width = 'auto'
        ref.current.style.height = 'auto'
      }}
    >
      <span
        className={
          spaced
            ? 'scroll-section-menu__fit scroll-section-menu__fit--spaced'
            : 'scroll-section-menu__fit'
        }
      >
        <motion.button
          type="button"
          className="scroll-section-menu__item"
          tabIndex={hidden ? -1 : 0}
          initial={false}
          animate={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0)' }}
          whileHover={{ color: '#111', backgroundColor: '#fff' }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          onClick={onClick}
        >
          {label}
        </motion.button>
      </span>
    </motion.span>
  )
}

export function ScrollSectionMenu({ onSelect }: ScrollSectionMenuProps) {
  const { t, cycleLocale } = useLocale()
  const [currentId, setCurrentId] = useState<PageId | null>(readCurrentSection)
  const animateWidth = useRef(false)
  const { compact, open, setOpen, barRef, openRef } = useCompactMenu()

  useLayoutEffect(() => {
    setCurrentId(readCurrentSection())
  }, [])

  useEffect(() => {
    animateWidth.current = true
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const next = readCurrentSection()
      if (!next) setOpen(false)
      setCurrentId((prev) => (prev === next ? prev : next))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [setOpen])

  const navClass = [
    'scroll-section-menu',
    compact ? 'is-compact' : '',
    open ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.nav
      className={navClass}
      aria-label={t('menu.top')}
      initial={false}
      animate={{ opacity: currentId ? 1 : 0 }}
      style={{ pointerEvents: currentId ? 'auto' : 'none' }}
    >
      <span
        ref={barRef}
        className="scroll-section-menu__measure scroll-section-menu__measure--bar"
      />
      <span
        ref={openRef}
        className="scroll-section-menu__measure scroll-section-menu__measure--open"
      />
      {compact ? (
        <motion.button
          type="button"
          className="scroll-section-menu__burger"
          aria-expanded={open}
          aria-controls="scroll-section-menu-list"
          aria-label={open ? t('menu.close') : t('menu.open')}
          onClick={() => setOpen((value) => !value)}
        >
          <motion.span
            className="scroll-section-menu__burger-label"
            initial={false}
            animate={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0)' }}
            whileHover={{ color: '#111', backgroundColor: '#fff' }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          >
            {open ? 'x' : t('menu.open')}
          </motion.span>
        </motion.button>
      ) : null}
      <div
        id="scroll-section-menu-list"
        className="scroll-section-menu__list"
        inert={compact && !open ? true : undefined}
      >
        {AIM_MENU_ITEMS.map((item, index) => {
          const hidden = item.id === currentId
          const spaced = compact
            ? AIM_MENU_ITEMS.slice(0, index).some((prev) => prev.id !== currentId)
            : index > 0
          return (
            <ScrollSectionMenuSlot
              key={item.id}
              spaced={spaced}
              hidden={hidden}
              stack={compact}
              animateWidth={animateWidth.current}
              label={t(item.labelKey)}
              onClick={() => {
                if (item.id === 'locale') {
                  cycleLocale()
                  return
                }
                setOpen(false)
                onSelect(item.id)
              }}
            />
          )
        })}
      </div>
    </motion.nav>
  )
}
