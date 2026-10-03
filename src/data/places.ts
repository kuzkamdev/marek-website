import type { Lang } from '../i18n/ui';
import { profiles } from './profile';

// Miejsca na mapie: pozycja w układzie świata (WORLD_WIDTH × WORLD_HEIGHT) i krótka treść karty.
// Treści pochodzą z profile.ts, żeby nie powielać danych.

export const WORLD_WIDTH = 1600;
export const WORLD_HEIGHT = 1000;

export type PlaceId = 'about' | 'experience' | 'projects' | 'hobbies' | 'contact';

export interface PlacePosition {
  id: PlaceId;
  x: number;
  y: number;
  icon: string;
}

export const placePositions: PlacePosition[] = [
  { id: 'about', x: 640, y: 470, icon: '🏡' },
  { id: 'experience', x: 980, y: 330, icon: '🏰' },
  { id: 'projects', x: 1180, y: 610, icon: '🛠️' },
  { id: 'hobbies', x: 430, y: 280, icon: '🎸' },
  { id: 'contact', x: 520, y: 740, icon: '⚓' },
];

export interface PlaceLink {
  text: string;
  href: string;
}

export interface PlaceContent {
  title: string;
  lines: string[];
  tags?: readonly string[];
  links?: PlaceLink[];
}

const titles: Record<Lang, Record<PlaceId, string>> = {
  pl: {
    about: 'O mnie',
    experience: 'Doświadczenie',
    projects: 'Projekty',
    hobbies: 'Hobby',
    contact: 'Kontakt',
  },
  en: {
    about: 'About me',
    experience: 'Experience',
    projects: 'Projects',
    hobbies: 'Hobbies',
    contact: 'Contact',
  },
};

export function getPlaces(lang: Lang): (PlacePosition & PlaceContent)[] {
  const p = profiles[lang];
  const job = p.experience[0];
  const content: Record<PlaceId, PlaceContent> = {
    about: {
      title: titles[lang].about,
      lines: [`${p.name} · ${p.role} · ${p.location}`, p.summary],
    },
    experience: {
      title: titles[lang].experience,
      lines: [
        `${job.company}: ${job.roles.map((r) => `${r.title} (${r.period})`).join(', ')}`,
        ...job.highlights,
      ],
    },
    projects: {
      title: titles[lang].projects,
      lines: p.projects.map((pr) => `${pr.title}: ${pr.description}`),
      tags: [...new Set(p.projects.flatMap((pr) => pr.tags))],
    },
    hobbies: {
      title: titles[lang].hobbies,
      lines: [p.hobbies.map((h) => `${h.icon} ${h.name}`).join(' · ')],
    },
    contact: {
      title: titles[lang].contact,
      lines: [],
      links: p.contact.map((c) => ({ text: `${c.label}: ${c.text}`, href: c.href })),
    },
  };
  return placePositions.map((pos) => ({ ...pos, ...content[pos.id] }));
}
