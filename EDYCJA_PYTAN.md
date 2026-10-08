# 🧑‍🏫 EDYCJA PYTAŃ — INERCJA

To jest krótka instrukcja dla osoby, która będzie samodzielnie rozwijać bank pytań.

## 1. Gdzie zmieniać pytania?

### Zwykłe pytania (poziomy 1/2/3)

**Plik:** `curriculum.js`

Szukaj:

```js
"quiz": [
```

Każde pytanie ma pola:

```js
{
    "pytanie": "TREŚĆ PYTANIA",
    "odpowiedzi": [
        "ODPOWIEDŹ A",
        "ODPOWIEDŹ B",
        "ODPOWIEDŹ C"
    ],
    "prawidlowa": 0,
    "wzor": "WZÓR, jeśli potrzebny",
    "wskazowka": "PODPOWIEDŹ DO TEGO KONKRETNEGO ZADANIA",
    "rozwiazanie": "PEŁNE ROZWIĄZANIE",
    "poziom": 1
}
```

`prawidlowa` liczymy od zera:

- `0` = pierwsza odpowiedź,
- `1` = druga,
- `2` = trzecia,
- `3` = czwarta.

### Zadania maturalne

**Plik:** `BANK_PYTAN_MATURALNYCH.js`

**To jest główne miejsce do ręcznego tworzenia i poprawiania zadań maturalnych.**

Bank jest podzielony na działy:

- `termodynamika`
- `mechanika`
- `grawitacja_astronomia`
- `fale_drgania`
- `optyka`
- `elektromagnetyzm`
- `mechanika_kwantowa_jadrowa`
- `teoria_wzglednosci`
- `fizyka_materialow`

Każdy dział ma 12 zadań: **8 zamkniętych + 4 otwarte**.

## 2. Zamknięte zadanie maturalne

```js
{
    id: "MECH-01",
    typ: "zamkniete",
    poziom: 3,
    pytanie: "TREŚĆ...",
    odpowiedzi: [
        "A",
        "B",
        "C",
        "D"
    ],
    prawidlowa: 0,
    wskazowka: "PODPOWIEDŹ — NIE PODAWAJ WYNIKU",
    wzor: "NAJWAŻNIEJSZY WZÓR",
    rozwiazanie: "PEŁNE ROZWIĄZANIE"
}
```

## 3. Zadanie otwarte

```js
{
    id: "MECH-09",
    typ: "otwarte",
    poziom: 3,
    pytanie: "TREŚĆ ZADANIA OTWARTEGO...",
    odpowiedzWzorcowa: "KRÓTKA ODPOWIEDŹ WZORCOWA",
    slowaKluczowe: [
        "najważniejszy element",
        "wynik",
        "jednostka"
    ],
    wskazowka: "PODPOWIEDŹ, KTÓRA NAPROWADZA, ALE NIE ROZWIĄZUJE ZADANIA",
    wzor: "WZÓR",
    rozwiazanie: "PEŁNE ROZWIĄZANIE KROK PO KROKU"
}
```

### Jak działa sprawdzanie zadania otwartego?

Aplikacja nie wymaga identycznego tekstu odpowiedzi. Sprawdza obecność większości elementów wpisanych w `slowaKluczowe`.

Dlatego przy tworzeniu zadania wpisuj tam **krótkie i jednoznaczne elementy**, np.:

```js
slowaKluczowe: ["25", "J"]
```

albo dla odpowiedzi opisowej:

```js
slowaKluczowe: ["pęd", "zachowany", "energia wewnętrzna"]
```

## 4. Podpowiedź ≠ rozwiązanie

To ważne.

### `wskazowka`

Ma powiedzieć uczniowi **jak zacząć**, np.:

> Najpierw wypisz siły działające na ciało. Następnie rozłóż ciężar na składowe względem równi.

Nie powinna od razu zawierać wyniku.

### `rozwiazanie`

Tutaj dajesz pełne rozwiązanie, np.:

> N = mg cos α. Tarcie T = μN. Zatem...

To pojawia się dopiero po odpowiedzi.

## 5. Poziomy — NIE MIESZAĆ

W aplikacji obowiązuje teraz sztywna zasada:

| Poziom | Znaczenie |
|---|---|
| `1` | podstawowy / łatwy |
| `2` | średni |
| `3` | zaawansowany |

Quiz **nie dobiera już pytań z sąsiedniego poziomu**, żeby sztucznie dobić do liczby pytań.

Każdy zwykły temat jest budowany osobno dla poziomu 1, 2 i 3.

### Trening maturalny

Wszystkie zadania maturalne mają:

```js
poziom: 3
```

Trening maturalny jest więc zawsze torem **zaawansowanym**. Nie miesza się z łatwymi ani średnimi pytaniami.

## 6. Co robić, gdy chcesz dodać nowe zadanie?

Najbezpieczniejsza kolejność:

1. Otwórz `BANK_PYTAN_MATURALNYCH.js`.
2. Wybierz odpowiedni dział.
3. Skopiuj istniejący obiekt zadania.
4. Nadaj nowe `id`.
5. Zmień `pytanie`.
6. Zmień `odpowiedzi` + `prawidlowa` albo pola zadania otwartego.
7. Napisz **osobną** `wskazowka` dla tego zadania.
8. Napisz `rozwiazanie`.
9. Sprawdź wzór i jednostki.
10. Zostaw `poziom: 3` dla matury.

## 7. Czego nie edytować przy zwykłej zmianie pytania?

Nie trzeba ruszać:

- `script.js` — logika quizu,
- `style.css` — wygląd,
- Firebase,
- logowania,
- mechanizmu zapisu postępów.

Jeżeli chcesz tylko zmienić treść pytania, **edytujesz bank pytań**.

## 8. Pliki odpowiedzialne za treść

```text
curriculum.js
    ↓ zwykłe pytania i banki tematyczne

BANK_PYTAN_MATURALNYCH.js
    ↓ ręcznie przygotowane zadania maturalne

EDYCJA_PYTAN.md
    ↓ instrukcja dla osoby edytującej pytania

script.js
    ↓ logika quizu, poziomów, podpowiedzi i sprawdzania
```

`script.js` nie powinien być miejscem do ręcznego pisania nowych pytań.


## System oceniania zadań otwartych

Każde zadanie otwarte może mieć własne ustawienia sprawdzania:

```js
{
  typ: "otwarte",
  pytanie: "...",
  odpowiedzWzorcowa: "25 N",

  // Dla zadań liczbowych — ustawiasz osobno dla tego pytania:
  poprawnaWartosc: 25,
  jednostka: "N",
  tolerancja: 0.005,
  wymagaJednostki: true,

  // Dla zadań opisowych:
  slowaKluczowe: ["pęd", "energia", "zachowany"],

  wskazowka: "Własna podpowiedź tylko do tego zadania.",
  wzor: "F = ma",
  rozwiazanie: "Pełne rozwiązanie tylko do tego zadania."
}
```

### Jak działa sprawdzanie?

- `25 N`, `25N`, `25,0 N` → **poprawnie**.
- `25` przy wymaganej jednostce N → **„Prawie! Wynik liczbowy jest poprawny, ale pamiętaj o właściwej jednostce.”**
- `25 kg` przy wymaganym N → **„Wynik liczbowy jest poprawny, ale podana jednostka jest nieprawidłowa.”**
- `0,025 kN` dla oczekiwanego `25 N` → **poprawnie**, bo system przelicza równoważne jednostki.
- `24,99 N` przy tolerancji 0,005 → system uwzględnia ustawioną tolerancję względną.
- Dla odpowiedzi opisowych system porównuje kilka słów kluczowych i może oznaczyć odpowiedź jako **częściowo poprawną**, zamiast od razu uznać ją za błędną.

**Ważne:** możesz ustawić `poprawnaWartosc`, `jednostka` i `tolerancja` osobno dla każdego zadania. Nie ma jednej globalnej odpowiedzi dla wszystkich zadań.

## System pytań zamkniętych

Po wybraniu błędnej odpowiedzi:
1. błędna odpowiedź jest oznaczona,
2. wszystkie odpowiedzi zostają zablokowane,
3. poprawna odpowiedź zostaje wyróżniona,
4. od razu pojawia się wyjaśnienie i rozwiązanie,
5. uczeń może przejść do następnego zadania.

Po poprawnej odpowiedzi uczeń również dostaje wyjaśnienie, ale odpowiedź jest od razu zaliczona.
