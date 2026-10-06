import type { MessageKey } from '../i18n/locales'

export const CV_EDUCATION: { years: MessageKey; text: MessageKey }[] = [
  { years: 'cvBio.edu.baumann.years', text: 'cvBio.edu.baumann.text' },
  { years: 'cvBio.edu.rodchenko.years', text: 'cvBio.edu.rodchenko.text' },
]

export const CV_EXHIBITIONS: {
  year: MessageKey
  title: MessageKey
  place: MessageKey
  href?: string
}[] = [
  {
    year: 'cvBio.show.space.year',
    title: 'cvBio.show.space.title',
    place: 'cvBio.show.space.place',
  },
  {
    year: 'cvBio.show.glitch.year',
    title: 'cvBio.show.glitch.title',
    place: 'cvBio.show.glitch.place',
    href: 'https://kholmy.vzmoscow.ru/glitch',
  },
  {
    year: 'cvBio.show.sludge.year',
    title: 'cvBio.show.sludge.title',
    place: 'cvBio.show.sludge.place',
  },
  {
    year: 'cvBio.show.galeev.year',
    title: 'cvBio.show.galeev.title',
    place: 'cvBio.show.galeev.place',
    href: 'https://prometheuskzn.ru/history/',
  },
  {
    year: 'cvBio.show.prometheus.year',
    title: 'cvBio.show.prometheus.title',
    place: 'cvBio.show.prometheus.place',
    href: 'https://kholmy.vzmoscow.ru/prometheus',
  },
  {
    year: 'cvBio.show.neural.year',
    title: 'cvBio.show.neural.title',
    place: 'cvBio.show.neural.place',
    href: 'https://kholmy.vzmoscow.ru/neural_intensive',
  },
  {
    year: 'cvBio.show.photo.year',
    title: 'cvBio.show.photo.title',
    place: 'cvBio.show.photo.place',
  },
  {
    year: 'cvBio.show.graphics.year',
    title: 'cvBio.show.graphics.title',
    place: 'cvBio.show.graphics.place',
  },
  {
    year: 'cvBio.show.mice.year',
    title: 'cvBio.show.mice.title',
    place: 'cvBio.show.mice.place',
  },
]

export const CV_LINKS: { label: MessageKey; href: string }[] = [
  { label: 'cvBio.socialLinks.telegram', href: 'https://t.me/change_log' },
  { label: 'cvBio.socialLinks.graphics', href: 'https://www.instagram.com/namenameemail/' },
  { label: 'cvBio.socialLinks.photo', href: 'https://www.instagram.com/phonesurname/' },
  { label: 'cvBio.socialLinks.graffiti', href: 'https://www.instagram.com/namenameemail/tagged/' },
  { label: 'cvBio.socialLinks.computer', href: 'https://www.instagram.com/rasterscape/' },
]
