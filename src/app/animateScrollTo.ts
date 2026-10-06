import { animate } from 'motion'

let active: { stop: () => void } | null = null

function documentTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY
}

export function animateScrollTo(top: number, duration = 0.75) {
  active?.stop()
  const from = window.scrollY
  active = animate(from, top, {
    duration,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (value) => {
      window.scrollTo(0, value)
    },
    onComplete: () => {
      active = null
    },
  })
  return active
}

export function animateScrollToElement(el: HTMLElement, duration = 0.75, offset = 0) {
  active?.stop()
  const from = window.scrollY
  active = animate(0, 1, {
    duration,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (progress) => {
      const target = documentTop(el) + offset
      window.scrollTo(0, from + (target - from) * progress)
    },
    onComplete: () => {
      window.scrollTo(0, documentTop(el) + offset)
      active = null
    },
  })
  return active
}
