# Jak samodzielnie edytować pytania w Inercji

Wszystkie zwykłe pytania edytujesz w **`question-bank.js`**. To główny bank używany przez stronę.

Zadania z treningu maturalnego znajdują się osobno w **`matura-bank.js`**.

## Gdzie znaleźć pytania?

W `question-bank.js` rozwiń strukturę:

**dział → podnagalowki → podtemat → lekcja → quiz**

W tablicy `quiz` znajdują się obiekty pytań. Każdy obiekt to jedno pytanie.

## Gotowy szablon do kopiowania

Skopiuj ten fragment do tablicy `quiz` i uzupełnij własną treścią:

```js
{
    pytanie: "Treść pytania.",
    odpowiedzi: [
        "Odpowiedź A",
        "Odpowiedź B",
        "Odpowiedź C",
        "Odpowiedź D"
    ],
    prawidlowa: 1,
    poziom: 2,
    wskazowka: "Wskazówka, która naprowadza na rozwiązanie.",
    wyjasnienie: "Wyjaśnienie, dlaczego poprawna odpowiedź jest prawidłowa.",
    wzor: "F = m · a"
},
```

### Co oznaczają pola?

| Pole | Co wpisać |
|---|---|
| `pytanie` | Treść pytania lub zadania |
| `odpowiedzi` | Lista 3–4 możliwych odpowiedzi |
| `prawidlowa` | Numer poprawnej odpowiedzi, liczony od zera |
| `poziom` | `1` łatwy, `2` średni, `3` zaawansowany |
| `wskazowka` | Indywidualna podpowiedź do tego pytania |
| `wyjasnienie` | Wyjaśnienie pokazywane po odpowiedzi |
| `wzor` | Opcjonalny wzór fizyczny |
| `krokiPodpowiedzi` | Opcjonalnie `true` — podpowiedź jako kroki; `false` — zwykły tekst |

**Jak działa `prawidlowa`?**

- `0` oznacza pierwszą odpowiedź (A),
- `1` oznacza drugą odpowiedź (B),
- `2` oznacza trzecią odpowiedź (C),
- `3` oznacza czwartą odpowiedź (D).

**Poziom trudności:** `1` = łatwy, `2` = średni, `3` = zaawansowany.

## Przykład z podpowiedzią w kilku krokach

```js
{
    pytanie: "Ciało o masie 2 kg uzyskuje przyspieszenie 3 m/s². Jaka siła wypadkowa na nie działa?",
    odpowiedzi: ["5 N", "6 N", "1,5 N", "9 N"],
    prawidlowa: 1,
    poziom: 1,
    wskazowka: "Najpierw przypomnij sobie, jak masa i przyspieszenie łączą się z siłą wypadkową.\\nNastępnie podstaw dane z zadania.",
    krokiPodpowiedzi: true,
    wyjasnienie: "Korzystamy z II zasady Newtona: F = m · a. Po podstawieniu F = 2 kg · 3 m/s² = 6 N.",
    wzor: "F = m · a"
},
```

## Ile pytań trzeba dodać?

Nie ma wymogu 10 ani 12 pytań. Quiz korzysta z takiej liczby pytań, jaka rzeczywiście znajduje się w banku dla wybranego poziomu. Jeśli dodasz 4 pytania na poziomie łatwym, quiz wykorzysta te 4 pytania.

## Ważne zasady edycji

1. Dodając kolejne pytanie, wstaw przecinek między obiektami.
2. `prawidlowa` musi wskazywać istniejącą odpowiedź.
3. Wpisuj podpowiedź i wyjaśnienie dopasowane do konkretnego zadania.
4. Jeśli pytanie nie potrzebuje wzoru, usuń całe pole `wzor`.
5. Zachowaj układ działów i lekcji — dzięki temu pytanie pojawi się we właściwym miejscu.
6. Nie edytuj `script.js`, jeśli chcesz zmienić wyłącznie treść pytania.

## Ukrywanie tematów na wybranych poziomach

Na początku `question-bank.js` znajduje się `TEMATY_WYLACZONE_DLA_POZIOMU`.

- `podstawowy` — poziom łatwy,
- `sredni` — poziom średni,
- `zaawansowany` — poziom zaawansowany.

Wpisz dokładną nazwę tematu w odpowiedniej tablicy, aby ukryć go na danym poziomie. Usunięcie nazwy przywróci temat. Nie usuwa to pytań z banku.
