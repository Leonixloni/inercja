# Inercja — architektura klienta

## Zasada podziału

Kod aplikacji jest rozdzielony według odpowiedzialności, a nie według przypadkowych fragmentów historii projektu:

```text
index.html
│
├── js/app.js                 # orkiestracja UI, sesji i przepływu nauki
├── js/config.js              # konfiguracja aplikacji i feature flags
├── js/firebase.js             # jedyne miejsce inicjalizacji Firebase
│
├── data/curriculum.js         # działy, lekcje i banki pytań
└── data/missions.js           # misje, nagrody i powiązania tematów
```

### `js/app.js`

Zawiera zachowanie aplikacji: obsługę ekranu, sesji, quizu, synchronizacji postępu i zdarzeń DOM. Nie zawiera już wielotysięcznej bazy treści edukacyjnych ani konfiguracji Firebase.

### `data/curriculum.js`

Zawiera wyłącznie treści edukacyjne i reguły doboru pytań. Można rozbudowywać program nauczania bez grzebania w logice UI.

### `data/missions.js`

Definiuje progresję użytkownika. Nagrody i cele są danymi produktu, nie logiką interfejsu.

### `js/firebase.js`

Centralizuje inicjalizację Firebase. Pozostałe moduły korzystają z gotowych `auth` i `firestore`, zamiast tworzyć własne instancje.

## Zasady dalszego rozwoju

1. Nowe pytania trafiają do `data/curriculum.js`, nie do `js/app.js`.
2. Nowe misje trafiają do `data/missions.js`.
3. Nowe flagi produktu trafiają do `js/config.js`.
4. Kod Firebase pozostaje w `js/firebase.js`.
5. `js/app.js` powinien koordynować moduły, a nie przechowywać dane konfiguracyjne.
6. Każda nowa funkcja powinna mieć jedną odpowiedzialność i możliwie mały wpływ na resztę aplikacji.
