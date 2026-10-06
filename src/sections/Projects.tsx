import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { animateScrollToElement } from '../app/animateScrollTo'
import { useLocale } from '../i18n/useLocale'
import {
  getProject,
  PROJECT_GROUPS,
  PROJECTS,
  projectIdFromHash,
  type Project,
  type ProjectGroupId,
  type ProjectId,
} from './projectsData'
import './LandingPanel.css'
import './Projects.css'

function headingOffset(article: HTMLElement) {
  const bar = article.querySelector<HTMLElement>('.projects__name-bar')
  const name = article.querySelector<HTMLElement>('.projects__name')
  if (!name) return 0
  const previous = bar?.style.position
  if (bar) bar.style.position = 'relative'
  const offset = name.getBoundingClientRect().top - article.getBoundingClientRect().top
  if (bar) bar.style.position = previous ?? ''
  return offset
}

function readStuckProject(): ProjectId | null {
  let found: ProjectId | null = null
  for (const project of PROJECTS) {
    const bar = document
      .getElementById(project.id)
      ?.querySelector<HTMLElement>('.projects__name-bar')
    if (!bar) continue
    const top = bar.getBoundingClientRect().top
    if (top <= 1 && top >= -1) found = project.id
  }
  return found
}

function pathWithoutHash() {
  return `${window.location.pathname}${window.location.search}`
}

function setProjectHash(id: ProjectId | null, mode: 'push' | 'replace') {
  const url = id ? `${pathWithoutHash()}#${id}` : pathWithoutHash()
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (id: ProjectId) => void
}) {
  const { t } = useLocale()

  return (
    <button
      type="button"
      className="projects__card"
      onClick={() => onOpen(project.id)}
    >
      {project.gif ? (
        <img
          className="projects__card-media"
          src={project.gif}
          alt=""
        />
      ) : (
        <span
          className="projects__card-media"
          style={{ background: project.color }}
          aria-hidden
        />
      )}
      <span className="projects__card-copy">
        <span className="projects__card-name">{t(project.titleKey)}</span>
        <span className="projects__card-teaser">{t(project.teaserKey)}</span>
      </span>
    </button>
  )
}

function ProjectIndex({
  onProject,
  onGroup,
}: {
  onProject: (id: ProjectId) => void
  onGroup: (id: ProjectGroupId) => void
}) {
  const { t } = useLocale()

  return (
    <p className="projects__index">
      {t('projects.index.lead')}{' '}
      {PROJECT_GROUPS.map((group, groupIndex) => (
        <span key={group.id}>
          {groupIndex > 0 ? '; ' : null}
          {group.titleKey ? (
            <>
              <button
                type="button"
                className="projects__index-group"
                onClick={() => onGroup(group.id)}
              >
                {t(group.titleKey)}
              </button>
              {': '}
            </>
          ) : (
            <>{t('projects.index.also')} </>
          )}
          {group.projectIds.map((id, index) => (
            <span key={id}>
              {index > 0 ? ', ' : null}
              <button type="button" onClick={() => onProject(id)}>
                {t(getProject(id).titleKey)}
              </button>
            </span>
          ))}
        </span>
      ))}
      .
    </p>
  )
}

function ProjectDetail({
  project,
  stuck,
  onCollapse,
}: {
  project: Project
  stuck: boolean
  onCollapse: () => void
}) {
  const { t } = useLocale()

  return (
    <article id={project.id} className="projects__detail">
      <div
        className="projects__visual"
        style={project.gif ? undefined : { background: project.color }}
      >
        {project.gif ? (
          <img
            className="projects__visual-media"
            src={project.gif}
            alt={t(project.titleKey)}
          />
        ) : (
          <span className="projects__visual-media" aria-hidden />
        )}
      </div>
      <div className="projects__copy">
        <div className="projects__name-bar">
          <h3 className="projects__name">{t(project.titleKey)}</h3>
          {stuck ? (
            <motion.button
              type="button"
              className="projects__fold"
              initial={false}
              animate={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0)' }}
              whileHover={{ color: '#111', backgroundColor: '#fff' }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              onClick={onCollapse}
            >
              {t('pages.projects')}
            </motion.button>
          ) : null}
        </div>
        {project.sections.map(({ heading, body }) => (
          <div key={body} className="projects__section">
            {heading ? (
              <h4 className="projects__heading">{t(heading)}</h4>
            ) : null}
            <p className="projects__text">{t(body)}</p>
          </div>
        ))}
        {project.video ? (
          <video
            className="projects__video"
            src={project.video}
            style={
              project.videoAspect
                ? { aspectRatio: project.videoAspect }
                : undefined
            }
            controls
            playsInline
            preload="metadata"
          />
        ) : null}
      </div>
    </article>
  )
}

export function Projects() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const skipScrollRef = useRef(false)
  const initialId = projectIdFromHash()
  const [expanded, setExpanded] = useState(initialId !== null)
  const [focusId, setFocusId] = useState<ProjectId | null>(initialId)
  const [stuckId, setStuckId] = useState<ProjectId | null>(null)

  useEffect(() => {
    if (!expanded) {
      setStuckId(null)
      return
    }
    const update = () => {
      const next = readStuckProject()
      setStuckId((prev) => (prev === next ? prev : next))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [expanded])

  useLayoutEffect(() => {
    if (!expanded || !focusId || skipScrollRef.current) {
      skipScrollRef.current = false
      return
    }
    const el = document.getElementById(focusId)
    if (!el) return

    const scrollTop = () =>
      el.getBoundingClientRect().top + window.scrollY + headingOffset(el)

    animateScrollToElement(el, 0.75, headingOffset(el))

    let settled = false
    const snap = () => {
      const top = scrollTop()
      if (Math.abs(window.scrollY - top) > 2) window.scrollTo(0, top)
    }
    const settleTimer = window.setTimeout(() => {
      settled = true
      snap()
    }, 800)
    const ro = new ResizeObserver(() => {
      if (settled) snap()
    })
    ro.observe(el)
    const stopTimer = window.setTimeout(() => ro.disconnect(), 2000)

    return () => {
      ro.disconnect()
      window.clearTimeout(settleTimer)
      window.clearTimeout(stopTimer)
    }
  }, [expanded, focusId])

  useEffect(() => {
    const syncFromUrl = () => {
      const id = projectIdFromHash()
      if (id) {
        skipScrollRef.current = false
        setFocusId(id)
        setExpanded(true)
        return
      }
      skipScrollRef.current = true
      setExpanded(false)
      setFocusId(null)
    }

    window.addEventListener('hashchange', syncFromUrl)
    window.addEventListener('popstate', syncFromUrl)
    return () => {
      window.removeEventListener('hashchange', syncFromUrl)
      window.removeEventListener('popstate', syncFromUrl)
    }
  }, [])

  useEffect(() => {
    if (!expanded) return

    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      if (section.getBoundingClientRect().top < window.innerHeight) return
      skipScrollRef.current = true
      setExpanded(false)
      setFocusId(null)
      setProjectHash(null, 'replace')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [expanded])

  const open = (id: ProjectId) => {
    setFocusId(id)
    setExpanded(true)
    setProjectHash(id, 'push')
  }

  const jumpTo = (id: ProjectId) => {
    if (focusId !== id) {
      setFocusId(id)
      setProjectHash(id, 'replace')
      return
    }
    const el = document.getElementById(id)
    if (el) animateScrollToElement(el, 0.75, headingOffset(el))
  }

  const jumpToGroup = (id: ProjectGroupId) => {
    const first = PROJECT_GROUPS.find((group) => group.id === id)?.projectIds[0]
    if (first) jumpTo(first)
  }

  const collapse = () => {
    skipScrollRef.current = true
    setExpanded(false)
    setFocusId(null)
    setProjectHash(null, 'push')
    const section = sectionRef.current
    if (!section) return
    const title = section.querySelector<HTMLElement>('.landing-panel__title')
    const offset = title
      ? title.getBoundingClientRect().top - section.getBoundingClientRect().top
      : 0
    animateScrollToElement(section, 0.75, offset)
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`landing-panel projects${expanded ? ' projects--expanded' : ''}`}
    >
      <h2 className="landing-panel__title">
        {expanded ? (
          <button type="button" className="projects__back" onClick={collapse}>
            {t('pages.projects')}
          </button>
        ) : (
          t('pages.projects')
        )}
      </h2>

      {!expanded ? (
        <div className="projects__catalog">
          {PROJECT_GROUPS.map((group) => (
            <div key={group.id} className="projects__group">
              {group.titleKey ? (
                <h3 className="projects__group-title">{t(group.titleKey)}</h3>
              ) : null}
              {group.bodyKey ? (
                <p className="projects__group-text">{t(group.bodyKey)}</p>
              ) : null}
              <div className="projects__grid">
                {group.projectIds.map((id) => (
                  <ProjectCard
                    key={id}
                    project={getProject(id)}
                    onOpen={open}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <ProjectIndex onProject={jumpTo} onGroup={jumpToGroup} />
          <div className="projects__list">
            {PROJECTS.map((project) => (
              <ProjectDetail
                key={project.id}
                project={project}
                stuck={stuckId === project.id}
                onCollapse={collapse}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
