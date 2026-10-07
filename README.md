# Inercja

Platforma edukacyjna do nauki fizyki.

## Struktura

- `js/app.js` — logika aplikacji i przepływ użytkownika
- `js/firebase.js` — inicjalizacja Firebase
- `js/config.js` — konfiguracja i feature flags
- `data/curriculum.js` — program nauczania i banki pytań
- `data/missions.js` — misje i nagrody
- `ARCHITECTURE.md` — zasady organizacji kodu

## Uruchomienie

```bash
npm install
npm start
```

Walidacja składni źródeł:

```bash
npm run check
```

Aplikacja jest ładowana przez `index.html` jako moduł ES (`js/app.js`).


## System podpowiedzi

Quiz korzysta z progresywnych podpowiedzi: **Zauważ → Połącz → Sprawdź**. Każdy poziom prowadzi ucznia bliżej rozwiązania, ale nie ujawnia poprawnej odpowiedzi. System filtruje również wskazówki, które przypadkowo zawierałyby dokładną treść poprawnej odpowiedzi.


## AI podpowiedzi

Podpowiedzi quizowe są generowane przez backendowy endpoint `/api/ai/hints`. Klucz API nigdy nie trafia do przeglądarki. Backend wymaga zalogowanego użytkownika Firebase, ogranicza częstotliwość żądań i cache'uje identyczne pytania.

Ustaw w środowisku serwera:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-6-luna
```

System generuje trzy poziomy: **Zauważ → Połącz → Sprawdź**. Model ma twardą zasadę: **nie podaje wzoru, jeśli treść pytania o niego nie prosi**. Dodatkowa walidacja po stronie aplikacji blokuje ujawnienie poprawnej odpowiedzi.
