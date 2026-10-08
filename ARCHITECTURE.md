# Inercja — architektura projektu

## Najważniejsza zasada

**Treść pytań jest oddzielona od logiki aplikacji.**

### Aktywny przepływ

```text
index.html
   ↓
script.js                  ← logika quizu, poziomów, podpowiedzi i odpowiedzi
   ↓
curriculum.js              ← zwykłe pytania / banki tematyczne
   ↓
BANK_PYTAN_MATURALNYCH.js  ← ręcznie przygotowany bank matury
```

## Gdzie edytować pytania?

- `curriculum.js` — zwykłe pytania poziomu 1, 2 i 3.
- `BANK_PYTAN_MATURALNYCH.js` — **główne miejsce dla zadań maturalnych**.
- `EDYCJA_PYTAN.md` — instrukcja pól i przykładów.

## Poziomy

Aplikacja nie miesza już poziomów przy wyborze pytań.

- `1` — podstawowy / łatwy
- `2` — średni
- `3` — zaawansowany

Trening maturalny jest zawsze poziomem `3`.

## Zadania otwarte

Bank maturalny obsługuje `typ: "otwarte"` i pola:

- `odpowiedzWzorcowa`
- `slowaKluczowe`
- `wskazowka`
- `wzor`
- `rozwiazanie`

Uczeń dostaje pole tekstowe i przycisk „Sprawdź odpowiedź”. Po sprawdzeniu widzi odpowiedź wzorcową oraz pełne rozwiązanie.

## Pliki techniczne

- `style.css` — wygląd, w tym interfejs zadań otwartych.
- `firebase.js`, `config.js` — konfiguracja usług.
- `app.js` — **legacy / nieaktywny**; aktualny interfejs używa `script.js`.


## System oceniania odpowiedzi otwartych

Logika znajduje się w `script.js` w funkcjach:
- `normalizujOdpowiedzOtwarta()`
- `liczbaZNapisu()`
- `wyciagnijJednostke()`
- `przeliczJednostke()`
- `sprawdzOdpowiedzOtwarta()`

Bank pytań pozostaje miejscem edycji treści. Każde zadanie może niezależnie określać `poprawnaWartosc`, `jednostka`, `tolerancja`, `wymagaJednostki`, `slowaKluczowe`, `wskazowka` i `rozwiazanie`.
