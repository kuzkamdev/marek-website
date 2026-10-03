import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', lang: 'pl', langName: 'Polski' },
  { path: '/en/', lang: 'en', langName: 'English' },
];

const viewports = [
  { name: 'mobile', width: 360, height: 740 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const { path, lang, langName } of pages) {
  test.describe(`strona ${path}`, () => {
    test('ładuje się z poprawnym językiem i nagłówkiem', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Marek Molenda');
    });

    test('przełącznik języka prowadzi do drugiej wersji', async ({ page }) => {
      await page.goto(path);
      await page.getByTestId('lang-switch').click();
      await expect(page.locator('html')).not.toHaveAttribute('lang', lang);
      // Po przejściu przełącznik wskazuje z powrotem język, z którego przyszliśmy.
      await expect(page.getByTestId('lang-switch')).toHaveText(langName);
    });

    for (const vp of viewports) {
      test(`brak poziomego przewijania i zrzut: ${vp.name}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBe(0);
        await testInfo.attach(`${lang}-${vp.name}`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      });
    }
  });
}
