export const languages = {
  pl: 'Polski',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'pl';

export const ui = {
  pl: {
    'meta.title': 'Marek Molenda · Salesforce Developer',
    'meta.description': 'Wizytówka i portfolio Marka Molendy, Salesforce Developera.',
    'skip.toMain': 'Przejdź do treści',
    'lang.switch': 'Zmień język',
    'home.role': 'Salesforce Developer',
    'home.status': 'Mapa jest w budowie. Wkrótce będzie tu można ją zwiedzać.',
    'home.quickCv': 'Szybkie CV',
    'cv.title': 'CV · Marek Molenda',
    'cv.description':
      'Krótkie CV Marka Molendy, Salesforce Developera: doświadczenie, projekty, certyfikaty, kontakt.',
    'cv.photoAlt': 'Zdjęcie Marka Molendy',
    'cv.experience': 'Doświadczenie',
    'cv.projects': 'Projekty',
    'cv.certificates': 'Certyfikaty Salesforce',
    'cv.education': 'Wykształcenie',
    'cv.languages': 'Języki',
    'cv.skills': 'Umiejętności',
    'cv.hobbies': 'Hobby',
    'cv.contact': 'Kontakt',
    'cv.back': 'Strona główna',
    'cv.print': 'Drukuj / zapisz PDF',
  },
  en: {
    'meta.title': 'Marek Molenda · Salesforce Developer',
    'meta.description': 'Business card and portfolio of Marek Molenda, Salesforce Developer.',
    'skip.toMain': 'Skip to content',
    'lang.switch': 'Change language',
    'home.role': 'Salesforce Developer',
    'home.status': 'The map is under construction. Soon you will be able to explore it here.',
    'home.quickCv': 'Quick CV',
    'cv.title': 'CV · Marek Molenda',
    'cv.description':
      'Short CV of Marek Molenda, Salesforce Developer: experience, projects, certificates, contact.',
    'cv.photoAlt': 'Photo of Marek Molenda',
    'cv.experience': 'Experience',
    'cv.projects': 'Projects',
    'cv.certificates': 'Salesforce certifications',
    'cv.education': 'Education',
    'cv.languages': 'Languages',
    'cv.skills': 'Skills',
    'cv.hobbies': 'Hobbies',
    'cv.contact': 'Contact',
    'cv.back': 'Home',
    'cv.print': 'Print / save as PDF',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLang];
