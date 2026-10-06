import type { MessageKey } from '../i18n/locales'

export type ProjectId =
  | 'rasterscape'
  | 'aup'
  | 'cchhees'
  | 'hover'
  | 'waalll'
  | 'filter'
  | 'mouse-1'
  | 'piramidi'
  | 'ride'
  | 'darina'

type ProjectSection = {
  heading?: MessageKey
  body: MessageKey
}

export type Project = {
  id: ProjectId
  titleKey: MessageKey
  teaserKey: MessageKey
  color: string
  gif?: string
  video?: string
  videoAspect?: string
  sections: ProjectSection[]
}

export type ProjectGroupId = 'web' | 'audio' | 'devices' | 'solo'

export type ProjectGroup = {
  id: ProjectGroupId
  titleKey: MessageKey | null
  bodyKey?: MessageKey
  projectIds: ProjectId[]
}

function mockSections(slug: string): ProjectSection[] {
  return [
    {
      heading: `projects.${slug}.sectionHeading` as MessageKey,
      body: `projects.${slug}.sectionBody` as MessageKey,
    },
  ]
}

export const PROJECTS: Project[] = [
  {
    id: 'rasterscape',
    titleKey: 'projects.rasterscape.title',
    teaserKey: 'projects.rasterscape.teaser',
    color: '#c8c2b4',
    gif: '/projects/rasterscape/camera.gif',
    video: '/projects/rasterscape/result.mp4',
    videoAspect: '968 / 720',
    sections: [
      {
        heading: 'projects.rasterscape.musicHeading',
        body: 'projects.rasterscape.musicBody',
      },
      {
        heading: 'projects.rasterscape.spaceHeading',
        body: 'projects.rasterscape.spaceBody',
      },
      {
        heading: 'projects.rasterscape.interfaceHeading',
        body: 'projects.rasterscape.interfaceBody',
      },
      {
        heading: 'projects.rasterscape.recursionHeading',
        body: 'projects.rasterscape.recursionBody',
      },
    ],
  },
  {
    id: 'aup',
    titleKey: 'projects.aup.title',
    teaserKey: 'projects.aup.teaser',
    color: '#b7cfc4',
    gif: '/projects/aup/preview.gif',
    video: '/projects/aup/demo.mp4',
    videoAspect: '1 / 1',
    sections: [{ body: 'projects.aup.sectionBody' }],
  },
  {
    id: 'cchhees',
    titleKey: 'projects.cchhees.title',
    teaserKey: 'projects.cchhees.teaser',
    color: '#d4b8a5',
    gif: '/projects/cchhees/preview.png',
    sections: [{ body: 'projects.cchhees.sectionBody' }],
  },
  {
    id: 'hover',
    titleKey: 'projects.hover.title',
    teaserKey: 'projects.hover.teaser',
    color: '#b0b8c8',
    sections: mockSections('hover'),
  },
  {
    id: 'waalll',
    titleKey: 'projects.waalll.title',
    teaserKey: 'projects.waalll.teaser',
    color: '#c9b3c4',
    sections: mockSections('waalll'),
  },
  {
    id: 'filter',
    titleKey: 'projects.filter.title',
    teaserKey: 'projects.filter.teaser',
    color: '#b9c9a8',
    sections: [],
  },
  {
    id: 'mouse-1',
    titleKey: 'projects.mouse1.title',
    teaserKey: 'projects.mouse1.teaser',
    color: '#a8a8a8',
    gif: '/projects/mouse-1/preview.gif',
    video: '/projects/mouse-1/demo.mp4',
    videoAspect: '16 / 9',
    sections: mockSections('mouse1'),
  },
  {
    id: 'piramidi',
    titleKey: 'projects.piramidi.title',
    teaserKey: 'projects.piramidi.teaser',
    color: '#c4a882',
    sections: mockSections('piramidi'),
  },
  {
    id: 'ride',
    titleKey: 'projects.ride.title',
    teaserKey: 'projects.ride.teaser',
    color: '#8fa3b0',
    sections: [{ body: 'projects.ride.sectionBody' }],
  },
  {
    id: 'darina',
    titleKey: 'projects.darina.title',
    teaserKey: 'projects.darina.teaser',
    color: '#d2c4b0',
    sections: mockSections('darina'),
  },
]

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    id: 'web',
    titleKey: 'projects.groups.web',
    bodyKey: 'projects.groups.webBody',
    projectIds: ['rasterscape', 'aup', 'cchhees', 'hover', 'waalll'],
  },
  {
    id: 'audio',
    titleKey: 'projects.groups.audio',
    projectIds: ['filter'],
  },
  {
    id: 'devices',
    titleKey: 'projects.groups.devices',
    bodyKey: 'projects.groups.devicesBody',
    projectIds: ['mouse-1', 'piramidi'],
  },
  {
    id: 'solo',
    titleKey: null,
    bodyKey: 'projects.groups.soloBody',
    projectIds: ['ride', 'darina'],
  },
]

const PROJECT_BY_ID = Object.fromEntries(
  PROJECTS.map((project) => [project.id, project]),
) as Record<ProjectId, Project>

export function getProject(id: ProjectId): Project {
  return PROJECT_BY_ID[id]
}

export function isProjectId(value: string): value is ProjectId {
  return value in PROJECT_BY_ID
}

export function projectIdFromHash(hash = window.location.hash): ProjectId | null {
  const id = hash.replace(/^#/, '')
  return isProjectId(id) ? id : null
}
