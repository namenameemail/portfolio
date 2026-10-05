import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion'

const COMPACT_MQ = '(max-width: 720px)'
const ease = [0.22, 1, 0.36, 1] as const

function inlineStrip() {
  const raw = document.documentElement.style.getPropertyValue('--noise-strip')
  const value = parseFloat(raw)
  return Number.isFinite(value) ? value : null
}

export function useCompactMenu() {
  const [compact, setCompact] = useState(() => window.matchMedia(COMPACT_MQ).matches)
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLSpanElement>(null)
  const openRef = useRef<HTMLSpanElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MQ)
    const onChange = () => setCompact(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!compact) setOpen(false)
  }, [compact])

  useEffect(() => {
    const root = document.documentElement
    const clear = () => root.style.removeProperty('--noise-strip')

    if (!compact) {
      clear()
      wasOpen.current = false
      return
    }

    if (!open) {
      if (!wasOpen.current) return
      const from = inlineStrip() ?? barRef.current?.offsetHeight ?? 0
      const to = barRef.current?.offsetHeight ?? from
      wasOpen.current = false
      const controls = animate(from, to, {
        duration: 0.4,
        ease,
        onUpdate: (value) => root.style.setProperty('--noise-strip', `${value}px`),
        onComplete: clear,
      })
      return () => controls.stop()
    }

    const from = inlineStrip() ?? barRef.current?.offsetHeight ?? 0
    const bar = barRef.current?.offsetHeight ?? from
    const list = document.getElementById('scroll-section-menu-list')
    const content = bar + (list?.scrollHeight ?? 0)
    const cap = openRef.current?.offsetHeight ?? content
    const to = Math.max(bar, Math.min(content, cap))
    wasOpen.current = true
    const controls = animate(from, to, {
      duration: 0.4,
      ease,
      onUpdate: (value) => root.style.setProperty('--noise-strip', `${value}px`),
    })
    return () => controls.stop()
  }, [open, compact])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return { compact, open, setOpen, barRef, openRef }
}
