# EDYCJA PYTAŃ — PROSTO I BEZ GRZEBANIA W LOGICE

## Gdzie edytować?

**Zwykłe pytania:** `curriculum.js`

**Zadania maturalne:** `BANK_PYTAN_MATURALNYCH.js`

**Nie edytuj `script.js`**, jeśli chcesz tylko zmienić treść zadania.

---

## Każde pytanie ma te informacje

- `dzial` — dział fizyki, np. „Mechanika”. Aplikacja uzupełnia nazwę z miejsca, w którym znajduje się pytanie.
- `podtemat` — podtemat.
- `lekcja` — konkretna lekcja, np. „Zasady Newtona”.
- `poziom` — 1 łatwy, 2 średni, 3 zaawansowany.
- `pytanie` — pełna treść.
- `odpowiedzi` — A/B/C/D w pytaniu zamkniętym.
- `poprawna` — litera poprawnej odpowiedzi, np. `"C"`.
- `wskazowka` — indywidualna podpowiedź.
- `wzor` — wzór, jeśli chcesz go pokazać.
- `rozwiazanie` — pełne rozwiązanie.

## Najprostszy przykład — zamknięte

```js
{
    "pytanie": "Które ciało ma największe przyspieszenie?",
    "odpowiedzi": {
        A: "Ciało 1",
        B: "Ciało 2",
        C: "Ciało 3",
        D: "Ciało 4"
    },
    "poprawna": "C",
    "poziom": 2,
    "wskazowka": "Porównaj siłę wypadkową z masą.",
    "wzor": "a = F/m",
    "rozwiazanie": "Dla każdego ciała obliczamy F/m i porównujemy wyniki."
}
```

### Poziom

`1` = ŁATWY · `2` = ŚREDNI · `3` = ZAAWANSOWANY.

**Matura = zawsze poziom 3.**

### Poprawna odpowiedź

Nie wpisujesz `0`, `1`, `2`, `3`. Wpisujesz literę: `"A"`, `"B"`, `"C"` lub `"D"`.

---

## Zadanie otwarte

```js
{
    "typ": "otwarte",
    "pytanie": "Oblicz siłę działającą na ciało.",
    "odpowiedzWzorcowa": "25 N",
    "poprawnaWartosc": 25,
    "jednostka": "N",
    "wymagaJednostki": true,
    "tolerancja": 0.01,
    "slowaKluczowe": ["25", "N"],
    "poziom": 3,
    "wskazowka": "Najpierw wyznacz siłę wypadkową.",
    "wzor": "F = ma",
    "rozwiazanie": "F = 5 kg · 5 m/s² = 25 N."
}
```

## Hierarchia programu

W `curriculum.js` pytania są ułożone: **DZIAŁ → PODTEMAT → LEKCJA → PYTANIA**.

Przykład: `Własności materii i termodynamika → Temperatura i ciepło → Skale temperatur → pytania`.

Aplikacja automatycznie dopisuje do każdego pytania `dzial`, `podtemat` i `lekcja`, więc przy edycji zawsze wiadomo, gdzie dane pytanie należy.

## Punktacja po odpowiedzi

- poprawna pierwsza odpowiedź → **10 pkt**
- błędna pierwsza odpowiedź → **0 pkt** i **od razu następne pytanie**
- bez dodatkowego klikania poprawnej odpowiedzi
- numer sesji rośnie normalnie: `1/12 → 2/12 → 3/12 ...`
- działa tak samo dla zamkniętych i otwartych

## Zasada

Jeśli zmieniasz pytanie, odpowiedzi, poprawną odpowiedź, poziom, podpowiedź, wzór albo rozwiązanie — robisz to w banku pytań. **Nie ruszasz `script.js`.**
