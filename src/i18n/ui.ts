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
  },
  en: {
    'meta.title': 'Marek Molenda · Salesforce Developer',
    'meta.description': 'Business card and portfolio of Marek Molenda, Salesforce Developer.',
    'skip.toMain': 'Skip to content',
    'lang.switch': 'Change language',
    'home.role': 'Salesforce Developer',
    'home.status': 'The map is under construction. Soon you will be able to explore it here.',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLang];
