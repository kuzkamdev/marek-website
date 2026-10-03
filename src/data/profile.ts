import type { Lang } from '../i18n/ui';

// Treści profilu w jednym miejscu. Typ wymusza ten sam kształt w obu językach.
// Źródło PL: tresci-v1.md (zaakceptowane przez Marka); EN: tłumaczenie do korekty przez Marka.

export interface Role {
  title: string;
  period: string;
}

export interface Experience {
  company: string;
  url: string;
  roles: Role[];
  highlights: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
}

export interface Profile {
  name: string;
  role: string;
  summary: string;
  location: string;
  experience: Experience[];
  projects: Project[];
  certificates: { name: string; date: string }[];
  education: { school: string; field: string; period: string }[];
  languages: { name: string; level: string }[];
  skills: string[];
  hobbies: { name: string; icon: string }[];
  contact: { label: string; href: string; text: string }[];
}

const name = 'Marek Molenda';
const role = 'Salesforce Developer';

const skills = [
  'Apex',
  'LWC',
  'Aura',
  'Flow',
  'REST API',
  'Sales Cloud',
  'Service Cloud',
  'Salesforce CPQ',
  'Omnichannel',
  'Git',
  'GitHub Actions',
  'Bitbucket Pipelines',
  'Salesforce CLI',
];

const salesTags = ['Apex', 'Aura', 'Flow', 'Salesforce CPQ', 'REST API', 'Bitbucket Pipelines'];
const serviceTags = ['Apex', 'LWC', 'Service Cloud', 'Omnichannel', 'REST API', 'GitHub Actions'];

const contact = (emailLabel: string) => [
  {
    label: emailLabel,
    href: 'mailto:marek.molenda.dev@gmail.com',
    text: 'marek.molenda.dev@gmail.com',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/marek-molenda/',
    text: 'linkedin.com/in/marek-molenda',
  },
  { label: 'GitHub', href: 'https://github.com/kuzkamdev', text: 'github.com/kuzkamdev' },
];

export const profiles = {
  pl: {
    name,
    role,
    summary:
      'Od prawie 6 lat buduję rozwiązania na platformie Salesforce dla międzynarodowych klientów. Łączę rozmowy z biznesem z konkretną implementacją: od analizy procesu, przez kod, po wdrożenie i CI/CD.',
    location: 'Warszawa',
    experience: [
      {
        company: 'Craftware',
        url: 'https://craftware.pl/',
        roles: [
          { title: 'Salesforce Developer', period: '02.2023 – obecnie' },
          { title: 'Junior Salesforce Developer', period: '02.2021 – 02.2023' },
        ],
        highlights: [
          '5 międzynarodowych projektów: Sales Cloud (z CPQ) i Service Cloud',
          'Analiza procesów z biznesem, implementacja w Apex, LWC i Flow',
          'Integracje REST i konfiguracja CI/CD',
        ],
      },
    ],
    projects: [
      {
        title: 'Sprzedaż i wyceny (Sales Cloud + CPQ)',
        description:
          'Nowe procesy sprzedażowe od rozmów z biznesem po wdrożenie, rozbudowa integracji REST z wyceną kosztów zmian, CI/CD na Bitbucket Pipelines.',
        tags: salesTags,
      },
      {
        title: 'Obsługa klienta (Service Cloud)',
        description:
          'Omnichannel, email-to-case, web chat osadzony na stronie klienta i integracja z Facebookiem; CI/CD na GitHub Actions.',
        tags: serviceTags,
      },
    ],
    certificates: [
      { name: 'Platform Developer I', date: '01.2024' },
      { name: 'AI Associate', date: '01.2024' },
      { name: 'Platform App Builder', date: '07.2023' },
      { name: 'Associate', date: '05.2023' },
    ],
    education: [
      { school: 'SGGW w Warszawie', field: 'Informatyka', period: '2018 – 2019' },
      {
        school: 'SGGW w Warszawie',
        field: 'Technologie Energii Odnawialnej',
        period: '2013 – 2018',
      },
    ],
    languages: [
      { name: 'Polski', level: 'ojczysty' },
      { name: 'Angielski', level: 'B2' },
    ],
    skills,
    hobbies: [
      { name: 'Gitara', icon: '🎸' },
      { name: 'Kostka Rubika', icon: '🧩' },
      { name: 'AI', icon: '🤖' },
    ],
    contact: contact('E-mail'),
  },
  en: {
    name,
    role,
    summary:
      'For almost 6 years I have been building solutions on the Salesforce platform for international clients. I connect business conversations with hands-on implementation: from process analysis, through code, to deployment and CI/CD.',
    location: 'Warsaw, Poland',
    experience: [
      {
        company: 'Craftware',
        url: 'https://craftware.pl/',
        roles: [
          { title: 'Salesforce Developer', period: '02.2023 – present' },
          { title: 'Junior Salesforce Developer', period: '02.2021 – 02.2023' },
        ],
        highlights: [
          '5 international projects: Sales Cloud (with CPQ) and Service Cloud',
          'Process analysis with business stakeholders, implementation in Apex, LWC and Flow',
          'REST integrations and CI/CD setup',
        ],
      },
    ],
    projects: [
      {
        title: 'Sales and quoting (Sales Cloud + CPQ)',
        description:
          'New sales processes from business workshops to delivery, extending REST integrations with change cost estimates, CI/CD on Bitbucket Pipelines.',
        tags: salesTags,
      },
      {
        title: 'Customer service (Service Cloud)',
        description:
          'Omnichannel, email-to-case, a web chat embedded on the client’s website and a Facebook integration; CI/CD on GitHub Actions.',
        tags: serviceTags,
      },
    ],
    certificates: [
      { name: 'Platform Developer I', date: '01.2024' },
      { name: 'AI Associate', date: '01.2024' },
      { name: 'Platform App Builder', date: '07.2023' },
      { name: 'Associate', date: '05.2023' },
    ],
    education: [
      {
        school: 'Warsaw University of Life Sciences',
        field: 'Computer Science',
        period: '2018 – 2019',
      },
      {
        school: 'Warsaw University of Life Sciences',
        field: 'Renewable Energy Technologies',
        period: '2013 – 2018',
      },
    ],
    languages: [
      { name: 'Polish', level: 'native' },
      { name: 'English', level: 'B2' },
    ],
    skills,
    hobbies: [
      { name: 'Guitar', icon: '🎸' },
      { name: 'Rubik’s cube', icon: '🧩' },
      { name: 'AI', icon: '🤖' },
    ],
    contact: contact('Email'),
  },
} as const satisfies Record<Lang, Profile>;
