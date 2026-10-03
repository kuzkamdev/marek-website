# CLAUDE.md

Wizytówka i portfolio Marka Molendy (Salesforce Developer) w formie interaktywnej mapy 2D, PL/EN.
Projekt jest też ćwiczeniem dobrych praktyk pracy z Claude Code.

- Specyfikacja (źródło prawdy o wymaganiach): `docs/spec.md`. Zmiana wymagań = wpis w jej dzienniku decyzji.
- Komunikacja z Markiem po polsku. Kod, nazwy plików i identyfikatory po angielsku; komentarze po polsku.

## Stack

- Astro 7 (statyczny build) + TypeScript (strict). Interaktywność jako wyspy Astro, tylko tam, gdzie potrzeba.
- i18n wbudowane w Astro: `pl` (domyślny, bez prefiksu), `en` (`/en/`).
- Testy: Playwright (`tests/`). Lint: ESLint, format: Prettier.
- Hosting: GitHub Pages (`/marek-website`). Docelowo własna domena: zmienić `SITE_URL` i `BASE_PATH` w `.github/workflows/deploy.yml`.

## Komendy

- `npm run dev`: serwer deweloperski (http://localhost:4321)
- `npm run check`: lint + format + typecheck + build (uruchom przed każdym pushem)
- `npm test`: testy Playwright (same budują i uruchamiają podgląd)
- `npm run format`: formatowanie Prettierem
- W chmurze Claude Code przeglądarka jest preinstalowana:
  `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm test` (nie uruchamiaj `playwright install`).

## Struktura

- `src/pages/`: strony; `src/pages/en/` to wersja angielska, która korzysta z tych samych komponentów.
- `src/components/`: komponenty sekcji. Teksty nie są wpisywane na sztywno w komponentach.
- `src/i18n/ui.ts`: słownik tekstów UI dla obu języków; każdy klucz musi istnieć w `pl` i `en` (wymusza to typ).
- `src/layouts/Base.astro`: wspólny szkielet HTML, przełącznik języka, globalne style i zmienne CSS.

## Zasady

- Linki wewnętrzne przez `getRelativeLocaleUrl()` z `astro:i18n` albo `import.meta.env.BASE_URL`, nigdy przez sztywne `/`, bo strona działa pod podścieżką.
- Mobile first: wszystko ma działać od 360 px; testy pilnują braku poziomego przewijania na 360/768/1280.
- Dostępność: semantyczny HTML, obsługa klawiatury, kontrast, animacje wyłączane przy `prefers-reduced-motion`.
- Krótkie porcje treści: żadnych ścian tekstu (wymóg ze specyfikacji).

## Sposób pracy

1. Każdy etap z `docs/spec.md` (sekcja 10) zaczyna się od planu zaakceptowanego przez Marka.
2. Jeden etap = jedna gałąź = jeden PR do `main`; CI musi być zielone.
3. Przed pushem: `npm run check` i `npm test`. Przy zmianach wizualnych dołącz zrzuty ekranu.
4. Nowe ustalenia trafiają do `docs/spec.md` lub tego pliku w tym samym PR.
