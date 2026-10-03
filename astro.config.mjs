// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH są ustawiane w workflow publikacji (GitHub Pages: /marek-website).
// Po przejściu na własną domenę wystarczy zmienić te dwie wartości.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
