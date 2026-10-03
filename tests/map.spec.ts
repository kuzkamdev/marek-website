import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const placeIds = ['about', 'experience', 'projects', 'hobbies', 'contact'];

async function worldTransform(page: Page) {
  return page.getByTestId('map-world').evaluate((el) => (el as HTMLElement).style.transform);
}

async function worldScale(page: Page) {
  return Number(await page.getByTestId('map-world').getAttribute('data-scale'));
}

test.describe('mapa (komputer)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('map-world')).toHaveAttribute('data-scale', /\d/);
  });

  test('pokazuje wszystkie miejsca i skrót do CV', async ({ page }) => {
    for (const id of placeIds) {
      await expect(page.locator(`[data-place="${id}"]`)).toBeVisible();
    }
    await expect(page.getByTestId('quick-cv')).toBeVisible();
  });

  test('przeciąganie myszą przesuwa mapę, a nie otwiera miejsca', async ({ page }) => {
    const before = await worldTransform(page);
    const marker = page.locator('[data-place="about"]');
    const box = (await marker.boundingBox())!;
    // Przeciągnięcie zaczęte na znaczniku: mapa się przesuwa, karta się nie otwiera.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y + 80, { steps: 8 });
    await page.mouse.up();
    expect(await worldTransform(page)).not.toBe(before);
    await expect(page.locator('#place-about')).toBeHidden();
  });

  test('przyciski i kółko myszy zmieniają przybliżenie', async ({ page }) => {
    const start = await worldScale(page);
    await page.getByRole('button', { name: 'Przybliż' }).click();
    await expect.poll(() => worldScale(page)).toBeGreaterThan(start);
    const zoomed = await worldScale(page);
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => worldScale(page)).toBeLessThan(zoomed);
    await page.getByRole('button', { name: 'Cała mapa' }).click();
    await expect.poll(() => worldScale(page)).toBeCloseTo(start, 2);
  });

  test('kliknięcie miejsca otwiera kartę, Escape ją zamyka i wraca do znacznika', async ({
    page,
  }) => {
    await page.locator('[data-place="experience"]').click();
    const card = page.locator('#place-experience');
    await expect(card).toBeVisible();
    await expect(card.getByRole('heading', { level: 2 })).toContainText('Doświadczenie');
    await expect(card).toContainText('Craftware');
    await expect(page).toHaveURL(/#place-experience$/);
    await page.keyboard.press('Escape');
    await expect(card).toBeHidden();
    await expect(page.locator('[data-place="experience"]')).toBeFocused();
  });

  test('karta kontaktu ma linki, przycisk zamknięcia działa', async ({ page }) => {
    await page.locator('[data-place="contact"]').click();
    const card = page.locator('#place-contact');
    await expect(card.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(card.locator('a[href*="linkedin.com"]')).toHaveCount(1);
    await card.getByRole('button', { name: 'Zamknij' }).click();
    await expect(card).toBeHidden();
  });

  test('klawiatura: Tab do miejsca i Enter otwiera kartę', async ({ page }) => {
    await page.locator('[data-viewport]').focus();
    const before = await worldTransform(page);
    await page.keyboard.press('ArrowLeft');
    await expect.poll(() => worldTransform(page)).not.toBe(before);
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-place="about"]')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#place-about')).toBeVisible();
  });

  test('link z kotwicą otwiera wskazane miejsce', async ({ page }) => {
    await page.goto('/en/#place-projects');
    await expect(page.locator('#place-projects')).toBeVisible();
    await expect(page.locator('#place-projects h2')).toContainText('Projects');
  });

  test('brak błędów dostępności (axe), także z otwartą kartą', async ({ page }) => {
    expect((await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id)).toEqual([]);
    await page.locator('[data-place="projects"]').click();
    expect((await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe('mapa (telefon, dotyk)', () => {
  test.use({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });

  test('stuknięcie otwiera kartę, przeciągnięcie palcem i szczypanie działają', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('map-world')).toHaveAttribute('data-scale', /\d/);

    await page.locator('[data-place="about"]').tap();
    await expect(page.locator('#place-about')).toBeVisible();
    await page.getByRole('button', { name: 'Zamknij' }).first().click();

    // Gesty dotykowe przez protokół Chrome DevTools (Playwright nie ma API do wielu palców).
    const cdp = await page.context().newCDPSession(page);
    const touch = (
      type: 'touchStart' | 'touchMove' | 'touchEnd',
      points: { x: number; y: number }[],
    ) =>
      cdp.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: points.map((p, id) => ({ ...p, id })),
      });

    const before = await worldTransform(page);
    await touch('touchStart', [{ x: 180, y: 450 }]);
    for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: 180 - i * 15, y: 450 }]);
    await touch('touchEnd', []);
    expect(await worldTransform(page)).not.toBe(before);

    const scale = await worldScale(page);
    await touch('touchStart', [
      { x: 150, y: 400 },
      { x: 210, y: 400 },
    ]);
    for (let i = 1; i <= 8; i++) {
      await touch('touchMove', [
        { x: 150 - i * 10, y: 400 },
        { x: 210 + i * 10, y: 400 },
      ]);
    }
    await touch('touchEnd', []);
    expect(await worldScale(page)).toBeGreaterThan(scale);
  });
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });

  test('pokazuje listę miejsc z treścią i link do CV', async ({ page }) => {
    await page.goto('/');
    for (const id of placeIds) {
      await expect(page.locator(`#place-${id}`)).toBeVisible();
    }
    await expect(page.getByTestId('quick-cv')).toBeVisible();
  });
});
