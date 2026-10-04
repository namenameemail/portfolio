import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animateScrollToElement } from '../app/animateScrollTo'
import { useLocale } from '../i18n/useLocale'
import {
  getProject,
  PROJECT_GROUPS,
  PROJECTS,
  projectIdFromHash,
  type Project,
  type ProjectId,
} from './projectsData'
import './LandingPanel.css'
import './Projects.css'

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
  solo,
  onOpen,
}: {
  project: Project
  solo?: boolean
  onOpen: (id: ProjectId) => void
}) {
  const { t } = useLocale()

  return (
    <button
      type="button"
      className={`projects__card${solo ? ' projects__card--solo' : ''}`}
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
      <span className="projects__card-name">{t(project.titleKey)}</span>
      <span className="projects__card-teaser">{t(project.teaserKey)}</span>
    </button>
  )
}

function ProjectDetail({ project }: { project: Project }) {
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
        <h3 className="projects__name">{t(project.titleKey)}</h3>
        {project.sections.map(({ heading, body }) => (
          <div key={heading} className="projects__section">
            <h4 className="projects__heading">{t(heading)}</h4>
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

  useLayoutEffect(() => {
    if (!expanded || !focusId || skipScrollRef.current) {
      skipScrollRef.current = false
      return
    }
    const el = document.getElementById(focusId)
    if (!el) return

    animateScrollToElement(el)

    let settled = false
    const snap = () => {
      const top = el.getBoundingClientRect().top + window.scrollY
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

  const collapse = () => {
    skipScrollRef.current = true
    setExpanded(false)
    setFocusId(null)
    setProjectHash(null, 'push')
    const section = sectionRef.current
    if (section) animateScrollToElement(section)
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
            <div
              key={group.id}
              className={`projects__group projects__group--${group.id}`}
            >
              {group.titleKey ? (
                <h3 className="projects__group-title">{t(group.titleKey)}</h3>
              ) : null}
              <div
                className={
                  group.id === 'solo' ? 'projects__solo' : 'projects__grid'
                }
              >
                {group.projectIds.map((id) => (
                  <ProjectCard
                    key={id}
                    project={getProject(id)}
                    solo={group.id === 'solo'}
                    onOpen={open}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="projects__list">
          {PROJECTS.map((project) => (
            <ProjectDetail key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
