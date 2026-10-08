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


## Edycja pytań bez grzebania w logice aplikacji

Cała ręcznie edytowalna treść quizów została wydzielona do:

- `data/question-bank.js` — **główne miejsce edycji pytań**.
- `CONTENT_GUIDE.md` — krótka instrukcja pól i poziomów.

W pojedynczym zadaniu możesz zmieniać bez dotykania `script.js`:

```js
{
    pytanie: "Treść pytania",
    odpowiedzi: ["A", "B", "C"],
    prawidlowa: 0,
    poziom: 2,
    wzor: "F = ma",
    wskazowka: "Naprowadź ucznia, ale nie podawaj wyniku.",
    wyjasnienie: "Pełne wyjaśnienie rozwiązania.",
    obliczeniowe: true
}
```

Dla zadania otwartego:

```js
{
    typ: "otwarte",
    pytanie: "Oblicz ...",
    poziom: 3,
    maturalne: true,
    odpowiedz: "12 N",
    akceptowane: ["12 N", "12"],
    tolerancja: 0.02,
    wzor: "F = ma",
    wskazowka: "Najpierw wyznacz przyspieszenie.",
    wyjasnienie: "Najpierw ..., następnie ..."
}
```

**Poziom jest jawny i nie zależy od kolejności pytania.**  
1 = podstawowy, 2 = średni, 3 = zaawansowany. Zadania maturalne są prowadzone jako poziom 3.

`script.js` odpowiada za mechanikę aplikacji, a `data/question-bank.js` za treść. Dzięki temu możesz poprawiać pytania, odpowiedzi, podpowiedzi, wyjaśnienia i poziom bez szukania logiki quizu.


### Edycja pytań
Jedynym źródłem treści pytań używanym przez aplikację jest `question-bank.js` w katalogu głównym. Po zmianie treści nie trzeba modyfikować `script.js`.
