import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sections = [
  'experience',
  'projects',
  'contact',
  'skills',
  'certificates',
  'education',
  'languages',
  'hobbies',
];

const pages = [
  { home: '/', cv: '/cv/', lang: 'pl', button: 'Szybkie CV', otherCv: '/en/cv/' },
  { home: '/en/', cv: '/en/cv/', lang: 'en', button: 'Quick CV', otherCv: '/cv/' },
];

for (const { home, cv, lang, button, otherCv } of pages) {
  test.describe(`CV ${lang}`, () => {
    test('strona główna prowadzi do CV jednym kliknięciem', async ({ page }) => {
      await page.goto(home);
      await page.getByRole('link', { name: button }).click();
      await expect(page).toHaveURL(new RegExp(`${cv}$`));
    });

    test('CV zawiera wszystkie sekcje i linki kontaktowe', async ({ page }) => {
      await page.goto(cv);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Marek Molenda');
      for (const id of sections) {
        await expect(page.getByTestId(`cv-${id}`)).toBeVisible();
      }
      const contact = page.getByTestId('cv-contact');
      await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(1);
      await expect(contact.locator('a[href*="linkedin.com/in/marek-molenda"]')).toHaveCount(1);
      await expect(contact.locator('a[href="https://github.com/kuzkamdev"]')).toHaveCount(1);
      // Telefon nie może trafić na stronę (decyzja Marka).
      await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    });

    test('przełącznik języka zostaje na stronie CV', async ({ page }) => {
      await page.goto(cv);
      await page.getByTestId('lang-switch').click();
      await expect(page).toHaveURL(new RegExp(`${otherCv}$`));
    });

    test('brak błędów dostępności (axe)', async ({ page }) => {
      await page.goto(cv);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  });
}
