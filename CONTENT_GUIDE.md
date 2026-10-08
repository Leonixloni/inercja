# Inercja — szybka mapa edycji treści

## Gdzie co jest?

| Co chcesz zmienić | Plik | Pole |
|---|---|---|
| Treść pytania | `data/question-bank.js` | `pytanie` |
| Odpowiedzi zamknięte | `data/question-bank.js` | `odpowiedzi` |
| Poprawna odpowiedź | `data/question-bank.js` | `prawidlowa` |
| Podpowiedź | `data/question-bank.js` | `wskazowka` |
| Pełne wyjaśnienie | `data/question-bank.js` | `wyjasnienie` |
| Wzór | `data/question-bank.js` | `wzor` |
| Poziom | `data/question-bank.js` | `poziom` |
| Typ zadania | `data/question-bank.js` | `typ` |
| Odpowiedź zadania otwartego | `data/question-bank.js` | `odpowiedz` / `akceptowane` |
| Zadania maturalne otwarte | `data/question-bank.js` | `OTWARTE_ZADANIA_MATURALNE` |
| Wygląd zadania otwartego | `style.css` | `.zadanie-otwarte*` |
| Mechanika quizu | `script.js` | nie zmieniaj przy zwykłej edycji treści |

## Poziomy

### 1 — podstawowy
Jedna definicja albo jedna prosta zależność. Uczeń powinien wykonać najwyżej jeden oczywisty krok.

### 2 — średni
Trzeba dobrać zależność, przekształcić ją albo połączyć 2 kroki. Dane mogą wymagać konwersji jednostek.

### 3 — zaawansowany
Wieloetapowe rozumowanie, kilka zależności, analiza wykresu/modelu, nietypowy kontekst albo zadanie w stylu maturalnym.

**Nie przypisuj poziomu według miejsca pytania w tablicy.** Pole `poziom` jest informacją merytoryczną.

## Zadanie zamknięte

```js
{
    pytanie: "Na ciało o masie 4 kg działa siła 12 N. Oblicz przyspieszenie.",
    odpowiedzi: ["3 m/s²", "48 m/s²", "1/3 m/s²"],
    prawidlowa: 0,
    poziom: 2,
    wzor: "a = F/m",
    wskazowka: "Z II zasady Newtona wyznacz a.",
    wyjasnienie: "a = 12/4 = 3 m/s².",
    obliczeniowe: true
}
```

## Zadanie otwarte

```js
{
    typ: "otwarte",
    pytanie: "Oblicz ...",
    poziom: 3,
    maturalne: true,
    odpowiedz: "20 cm",
    akceptowane: ["20 cm", "20"],
    tolerancja: 0.02,
    wzor: "1/f = 1/x + 1/y",
    wskazowka: "Najpierw przekształć równanie.",
    wyjasnienie: "Po podstawieniu danych otrzymujemy ..."
}
```

`akceptowane` pozwala dopuścić różne zapisy tej samej odpowiedzi. `tolerancja` jest opcjonalna i dotyczy odpowiedzi liczbowych.

## Ważna zasada jakości

Podpowiedź **nie może zawierać wyniku**.  
Wyjaśnienie może zawierać wynik i powinno pokazywać tok rozumowania.

Dla trudnych zadań maturalnych preferowany jest schemat:

1. rozpoznanie modelu fizycznego,
2. wypisanie danych,
3. wybór zależności,
4. przekształcenie,
5. podstawienie,
6. jednostka i interpretacja wyniku.

## Gdzie są podpowiedzi i odpowiedzi w kodzie?

Są bezpośrednio przy konkretnym zadaniu w `data/question-bank.js`:

- `pytanie` — pytanie,
- `odpowiedzi` — warianty odpowiedzi,
- `prawidlowa` — numer poprawnej odpowiedzi,
- `wskazowka` — podpowiedź,
- `wyjasnienie` — pełne rozwiązanie,
- `poziom` — trudność,
- `wzor` — zależność.

Nie trzeba już szukać tych elementów w `script.js`.
