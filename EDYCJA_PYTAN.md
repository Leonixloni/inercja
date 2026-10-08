# Jak samodzielnie edytować pytania

## Najważniejsze

**Nie edytuj `script.js`**, jeśli chcesz zmienić treść zadań.

- Zwykłe pytania: `curriculum.js`
- Zadania maturalne: `BANK_PYTAN_MATURALNYCH.js`

W obu plikach pytanie ma czytelne pola.

## Pytanie zamknięte

```js
{
    "pytanie": "Tu wpisz całe pytanie.",
    "odpowiedzi": {
        A: "Pierwsza odpowiedź",
        B: "Druga odpowiedź",
        C: "Trzecia odpowiedź",
        D: "Czwarta odpowiedź"
    },
    "poprawna": "C",
    "poziom": 2,
    "wskazowka": "Tu wpisz podpowiedź tylko do tego pytania.",
    "rozwiazanie": "Tu wpisz pełne rozwiązanie tylko do tego pytania."
}
```

### Poziom
- `1` = ŁATWY
- `2` = ŚREDNI
- `3` = ZAAWANSOWANY

Dla matury wszystkie zadania są poziomu `3`.

### Poprawna odpowiedź
Wpisujesz **literę**, a nie numer:

```js
"poprawna": "A"
```

lub `B`, `C`, `D`. Nie wpisuj `0`, `1`, `2`, `3`. Aplikacja sama zajmuje się technicznym indeksem.

## Pytanie otwarte

```js
{
    "typ": "otwarte",
    "pytanie": "Tu wpisz treść zadania.",
    "odpowiedzWzorcowa": "25 N",
    "poprawnaWartosc": 25,
    "jednostka": "N",
    "wymagaJednostki": true,
    "tolerancja": 0.01,
    "slowaKluczowe": ["25", "N"],
    "poziom": 3,
    "wskazowka": "Tu wpisz indywidualną podpowiedź.",
    "wzor": "F = ma",
    "rozwiazanie": "Tu wpisz pełne rozwiązanie."
}
```

### Co możesz zmieniać w każdym zadaniu

- **`pytanie`** — całą treść zadania
- **`odpowiedzi`** — A/B/C/D w zamkniętym
- **`poprawna`** — właściwa litera
- **`poprawnaWartosc`** — wartość liczbowa w otwartym
- **`jednostka`** — wymagana jednostka
- **`wymagaJednostki`** — czy brak jednostki ma być oznaczony jako „prawie”
- **`tolerancja`** — dopuszczalny błąd liczbowy
- **`slowaKluczowe`** — elementy wymagane przy odpowiedzi opisowej
- **`poziom`** — 1/2/3
- **`wskazowka`** — indywidualna podpowiedź
- **`wzor`** — wzór pomocniczy
- **`rozwiazanie`** — pełne rozwiązanie

## Ważne

Możesz zmieniać teksty bez ruszania logiki aplikacji. Jeśli chcesz dodać nowe pytanie, skopiuj cały blok jednego pytania i zmień jego pola.
