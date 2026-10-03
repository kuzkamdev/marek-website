# Specyfikacja strony — Marek's Website

> Żywy dokument. Aktualizowany po każdej rundzie pytań. Status: **zaakceptowana 2026-10-03**. Zmiany przez dziennik decyzji.
> Ostatnia aktualizacja: 2026-10-03 (po rundzie 3)

## 1. Cel projektu
- Ćwiczenie dobrych praktyk z kursu Anthropic (CCAR-F): praca z Claude Code, workflow agentowy.
- Cel samej strony: **wizytówka + portfolio** skierowane do rekruterów (trochę CV, trochę o mnie, trochę hobby).
- Na teraz to głównie poligon do nauki; strona może być wykorzystana w przyszłości.

## 2. Założenia potwierdzone
- Strona **responsywna** (telefon, tablet, desktop).
- Strona **niecodzienna**: nietypowa forma, nie szablonowa. Konkretny kierunek do ustalenia.

## 3. Odbiorcy
- Docelowo: **rekruterzy**.
- Na teraz: poligon do nauki (Marek).
- Zadanie odwiedzającego: przede wszystkim **zapoznać się z informacjami**, a także **pobawić się interakcjami**.

## 4. Treść i sekcje
- Treści jeszcze nie ma. Na start: tymczasowe teksty, potem podmiana na prawdziwe.
- Wstępne sekcje: **O mnie**, **CV / doświadczenie i umiejętności**, **Projekty / portfolio**, **Hobby**, **Kontakt** (do potwierdzenia).
- Kontakt: **tylko linki** (e-mail, LinkedIn, GitHub), bez formularza.
- Języki: **polski i angielski od pierwszej wersji**, z przełącznikiem języka.

## 5. Styl wizualny i inspiracje
- Koncepcja „niecodzienności”: **strona jako mapa 2D do eksplorowania** (ilustracyjna, przesuwana myszką/palcem). Sekcje są miejscami na mapie, które odwiedzający odkrywa.
- Charakter: **interaktywny, żywy**.
- Unikać: ścian tekstu, rozbudowanych prezentacji, których nie da się ogarnąć wzrokiem. Treść w krótkich porcjach.
- **Szybka ścieżka dla rekrutera**: zawsze dostępny skrót do prostej wersji CV (bez eksplorowania mapy).
- Inspiracje: brak konkretnych przykładów (można dodać później).
- Kolory i klimat (ciemny/jasny): _jeszcze nieustalone_.

## 6. Technologia i hosting
- Stack (domyślny, przyjęty): **Astro + TypeScript**, interaktywne fragmenty jako „wyspy” tylko tam, gdzie potrzeba; i18n PL/EN wbudowane w Astro.
- Testy: **Playwright** (scenariusze + zrzuty ekranu na 360/768/1280 px), **Lighthouse** (wydajność, dostępność).
- Hosting na teraz: **GitHub Pages** (darmowy, podgląd online).
- Docelowo: **własna domena** (jeszcze nie kupiona). Architektura musi pozwalać na łatwe przeniesienie: statyczny build, bez zależności od konkretnego hostingu.

## 7. Repozytorium i narzędzia
- Marek ma konto na GitHubie. **Nowe repozytorium** dla tej strony (jeszcze nie istnieje).
- Praca na razie **w chmurze** (Claude Code w tym projekcie). Później możliwa praca lokalna, repo ma działać tak samo na obu.
- Workflow git: gałąź na każdy etap, PR, CI (lint, testy, build) na GitHub Actions.

## 8. Proces pracy (zaakceptowany)
1. **Spec first**: ten dokument musi być zaakceptowany przed pierwszą linijką kodu.
2. **Repo + CLAUDE.md**: na starcie repozytorium z plikiem CLAUDE.md (stack, komendy, konwencje, zasady).
3. **Plan przed kodem**: dla każdego etapu najpierw plan (plan mode), akceptacja, dopiero potem implementacja.
4. **Małe, weryfikowalne kroki**: jeden etap = jedna gałąź = jeden PR, z jasnym kryterium "gotowe".
5. **Weryfikacja**: lint/format, testy, zrzuty ekranu na kilku szerokościach (Playwright), audyt dostępności i wydajności (Lighthouse).
6. **Pętla feedbacku**: po każdym etapie przegląd, poprawki, aktualizacja spec/CLAUDE.md o nowe ustalenia.

## 9. Kryteria akceptacji (wstępne)
- Działa poprawnie od 360 px do szerokich ekranów.
- Dostępność: kontrast, nawigacja klawiaturą, `prefers-reduced-motion` dla animacji.
- _reszta do ustalenia_

## 10. Plan etapów (wstępny, każdy etap = plan → PR → weryfikacja)
1. Szkielet: repo, CLAUDE.md, Astro + TS, lint/format, CI, deploy na GitHub Pages.
2. Prosta wersja CV (szybka ścieżka) z i18n PL/EN: najpierw działająca treść.
3. Szkic mapy 2D: przesuwanie/zoom, punkty sekcji, działanie na dotyku.
4. Sekcje jako miejsca na mapie (O mnie, CV, Projekty, Hobby, Kontakt) z krótkimi porcjami treści.
5. Ożywienie: animacje, mikrointerakcje, `prefers-reduced-motion`; wybór kolorystyki.
6. Szlif: dostępność, wydajność, testy wizualne, prawdziwe treści.

## 11. Otwarte pytania
- Kolory i klimat (ciemny/jasny): decyzja po pierwszym szkicu mapy.
- Nazwa repozytorium.

## Dziennik decyzji
| Data | Decyzja |
|---|---|
| 2026-10-03 | Najpierw zbieranie wymagań, kod dopiero po akceptacji spec. |
| 2026-10-03 | Strona ma być responsywna i niecodzienna. |
| 2026-10-03 | Charakter: wizytówka + portfolio dla rekruterów, z interakcjami. |
| 2026-10-03 | Dwujęzyczna (PL/EN) od pierwszej wersji. |
| 2026-10-03 | Koncepcja: interaktywna mapa do eksplorowania. |
| 2026-10-03 | Zawsze dostępny skrót do prostego CV dla rekruterów. |
| 2026-10-03 | Kontakt tylko przez linki, bez formularza. |
| 2026-10-03 | Mapa w wersji 2D. |
| 2026-10-03 | Praca w chmurze; hosting tymczasowy, docelowo własna domena. |
| 2026-10-03 | Nowe repozytorium na GitHubie Marka: kuzkamdev/marek-website. |
| 2026-10-03 | Specyfikacja zaakceptowana przez Marka. |
