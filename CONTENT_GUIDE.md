# Gdzie edytować treść?

## 1. Zwykłe lekcje — `question-bank.js`

To jest główny bank treści dla normalnych lekcji.

Każda lekcja ma własny temat, a w nim pytania. Dla każdego pytania możesz osobno ustawić:

- `pytanie` — treść pytania,
- `odpowiedzi` — odpowiedzi do wyboru,
- `prawidlowa` — indeks poprawnej odpowiedzi: `0`, `1` albo `2`,
- `wskazowka` — podpowiedź tylko dla tego pytania,
- `wyjasnienie` — wyjaśnienie tylko dla tego pytania,
- `rozwiazanie` — starsza nazwa pola, nadal obsługiwana,
- `wzor` — wzór,
- `poziom` — `1`, `2` albo `3`,
- `obliczeniowe` — `true`, jeśli zadanie wymaga obliczeń.

### Poziomy

- `1` = podstawowy / łatwy
- `2` = średni
- `3` = zaawansowany

Poziom wpisujesz ręcznie przy konkretnym pytaniu. Jeśli pytanie nie ma pola `poziom`, aplikacja ma mechanizm awaryjnego rozpoznania, ale **dla własnych pytań najlepiej zawsze wpisać poziom jawnie**.

## 2. Zadania maturalne — `matura-bank.js`

**Wszystkie treści zadań maturalnych są osobno.** Nie trzeba ich szukać w `question-bank.js` ani w `script.js`.

W `matura-bank.js` znajdują się osobne pule dla:

- mechaniki,
- termodynamiki,
- grawitacji i astronomii,
- fal i drgań,
- optyki,
- elektromagnetyzmu,
- fizyki atomowej i jądrowej,
- teorii względności,
- fizyki materiałów.

Każde zadanie maturalne ma własne pola treści, a także `poziom`.

Na końcu pliku znajduje się osobna sekcja `MATURA_OPEN_TASKS` dla zadań otwartych.

## 3. Ważna zasada poziomu

Quiz **nie miesza poziomów**.

Jeżeli uczeń ma:

- poziom `1` → dostaje tylko pytania `poziom: 1`,
- poziom `2` → dostaje tylko pytania `poziom: 2`,
- poziom `3` → dostaje tylko pytania `poziom: 3`.

Nie ma już mechanizmu „jeśli zabraknie, dobierz sąsiedni poziom”. Jeśli bank danego tematu jest za mały dla wybranego poziomu, quiz nie uzupełnia go łatwiejszymi ani trudniejszymi pytaniami.

## 4. Mechanika aplikacji

`script.js` zawiera mechanikę aplikacji: filtrowanie, losowanie, punktację, obsługę odpowiedzi itd.

**Jeśli chcesz zmienić treść pytania, nie edytuj `script.js`.**


## Poziom każdego pytania
Każde pytanie ma własne pole `"poziom": 1`, `2` albo `3`. Ustawiaj je osobno przy każdym pytaniu. 1 = podstawowy, 2 = średni, 3 = zaawansowany. Filtr quizu wybiera wyłącznie pytania o poziomie wybranym przez ucznia. Zwykłe pytania edytuj w `question-bank.js`, strukturę lekcji w `curriculum.js`, a zadania maturalne w `matura-bank.js`.
