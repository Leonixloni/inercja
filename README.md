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
