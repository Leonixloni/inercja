/**
 * Inercja — bank treści edukacyjnych.
 *
 * EDYCJA TREŚCI:
 * 1. NAJPIERW: przejdź do `baza.mechanika` — to pierwszy bank w pliku.
 * 2. W każdym pytaniu zmieniaj osobno `pytanie`, `odpowiedzi`, `prawidlowa`,
 *    `wskazowka`, `wyjasnienie`/`rozwiazanie`, `wzor` i `poziom`.
 * 3. Podpowiedź jest indywidualna dla pytania: `wskazowka`.
 * 4. Wyjaśnienie jest indywidualne dla pytania: `wyjasnienie` (lub starsze `rozwiazanie`).
 * 5. Wzór: `wzor`.
 * 6. Poziom: `poziom` = 1 podstawowy, 2 średni, 3 zaawansowany.
 * 7. Najprostszy szablon nowego pytania:
 *    {
 *      "pytanie": "Treść pytania",
 *      "odpowiedzi": ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C"],
 *      "prawidlowa": 1, // numer odpowiedzi: 0 = A, 1 = B, 2 = C
 *      "poziom": 1, // 1 = podstawowy, 2 = średni, 3 = zaawansowany
 *      "wskazowka": "Krótka podpowiedź dla ucznia",
 *      "wyjasnienie": "Dlaczego odpowiedź B jest poprawna"
 *    }
 * 8. Zadanie otwarte: `typ: "otwarte"`, `odpowiedz` lub `akceptowane`,
 *    opcjonalnie `tolerancja` dla odpowiedzi liczbowej.
 *
 * NIE ZMIENIAJ logiki generatorów w script.js, jeśli chcesz tylko edytować treść.
 * Zadania maturalne są celowo poza tym plikiem: edytuj je w `matura-bank.js`.
 * Ten plik zawiera wyłącznie zwykłe lekcje i ich pytania tematyczne.
 */

const baza = {

    // ============================================================
    // 1. MECHANIKA — GŁÓWNY BANK PYTAŃ
    // ============================================================
    // Każde pytanie edytujesz w jego własnym bloku `quiz`.
    // W jednym pytaniu znajdziesz: pytanie, odpowiedzi, prawidlowa,
    // wskazowka, wyjasnienie/rozwiazanie, wzor, poziom itd.
    // `prawidlowa: 0` = pierwsza odpowiedź w tablicy `odpowiedzi`.
    // Aplikacja może później losować kolejność odpowiedzi na ekranie.

    "mechanika": {
        "emoji": "⚙️",
        "nazwa": "Mechanika",
        "maturalna": true,
        "podnagalowki": {
            "kinematyka": [
                {
                    "temat": "Podstawy opisu ruchu",
                    "quiz": [
                        {
                            "pytanie": "Biegacz przebiegł jedno okrążenie toru (400 m), startując i kończąc na linii mety. Ile wynosi jego droga.",
                            "odpowiedzi": [
                                "0m",
                                "400m",
                                "800m"
                            ],
                            "prawidlowa": 1,
                            "poziom": 1,
                            "wskazowka": "Droga (oznaczana symbolem s) to całkowita długość toru, jaką biegacz rzeczywiście pokonał od momentu startu do zatrzymania się. Wyobraź sobie, że rozwijasz za nim taśmę mierniczą przez całe okrążenie, długość tej taśmy to właśnie Twoja odpowiedź.",
                         "wyjasnienie": "Droga (s) to całkowita długość toru, jaki przebyło ciało. Biegacz przebiegł cały tor, więc droga wynosi dokładnie 400 m."
                        },
                        {
                            "pytanie": "Biegacz przebiegł jedno okrążenie toru (200 m), startując i kończąc na linii mety. Ile wynosi jego przemieszczenie.",
                            "odpowiedzi": [
                                "400m",
                                "200m",
                                "0m"
                            ],
                            "prawidlowa": 2,
                            "poziom": 1,
                            "wskazowka": "Przemieszczenie to wektor łączący punkt startowy z punktem końcowym. Pamiętaj, że droga to nie to samo co przemieszczenie.",
                        
                            "wyjasnienie": "Przemieszczenie to wektor łączący punkt startu z punktem końca. Skoro biegacz wrócił w to samo miejsce, odległość między startem a metą wynosi 0."
                        },
                        {
                            "pytanie": "Czym różni się droga od przemieszczenia?",
                            "odpowiedzi": [
                                "Droga jest długością przebytej trasy, a przemieszczenie łączy położenie początkowe i końcowe jako wektor",
                                "Przemieszczenie to długość przebytej trasy, a droga łączy położenie początkowe i końcowe jako wektor",
                                "Przemieszczenie zawsze jest większe od drogi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Wyobraź sobie sytuację: Jeśli pójdziesz 10 metrów przed siebie, a potem wrócisz 10 metrów w to samo miejsce, Twoja przebyta droga wynosi 20 metrów, ale Twoje przemieszczenie wynosi 0 metrów, bo z punktu widzenia fizyki ostatecznie nigdzie się nie ruszyłeś względem startu.",
                        
                            "wyjasnienie": "Droga to wielkość skalarna, która określa całkowitą długość faktycznie pokonanej trasy, niezależnie od tego, w którą stronę poruszał się obiekt. Przemieszczenie to wielkość wektorowa, która ma zarówno wartość, jak i kierunek; jest to odcinek łączący bezpośrednio punkt początkowy ruchu z punktem końcowym. Kluczowa różnica: Jeśli poruszasz się w kółko i wracasz dokładnie w to samo miejsce, Twoja przebyta droga może być duża (np. 400 metrów), ale wartość przemieszczenia wynosi zero, ponieważ punkt startu i końca się pokrywają."
                        },
                        {
                            "pytanie": "Samochód jedzie 100 m na wschód, a następnie 100 m na zachód. Jaka jest jego droga?",
                            "odpowiedzi": [
                                "200 m",
                                "0 m",
                                "100 m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wzor": "s = s₁ + s₂",
                            "wskazowka": "W zadaniu pytają nas o drogę jaką przebył samochód. Droga to całkowita długość toru, jaką pokonał samochód.",
                        
                            "wyjasnienie": "Droga to całkowita długość toru, jaką pokonał samochód. Po dodaniu 100m do 100m wychodzi nam 200m."
                        },
                        {
                            "pytanie": "Samochód przejechał prostoliniowy odcinek drogi o długości 5 km z miejscowości A do miejscowości B, nie zatrzymując się ani nie cofając. Ile wynosi przebyta droga, a ile wartość przemieszczenia?",
                            "odpowiedzi": [
                                "Droga wynosi 0km, przemieszczenie 5km",
                                "Droga wynosi 5km, przemieszczenie 0km",
                                "Droga wynosi 5km, przemieszczenie 5km"
                            ],
                            "prawidlowa": 2,
                            "poziom": 1,
                            "wskazowka": "Jeśli ruch odbywa się po linii prostej i tylko w jednym kierunku, to długość ścieżki jest dokładnie równa odległości w linii prostej między startem a metą.",
                        
                            "wyjasnienie": "W ruchu prostoliniowym jednokierunkowym tor ruchu jest linią prostą, więc przebyta droga pokrywa się z wartością wektora przemieszczenia."
                        },
                        {
                            "pytanie": "Czy ruch może być różnie opisany przez dwóch obserwatorów?",
                            "odpowiedzi": [
                                "Tak, zależy od układu odniesienia",
                                "Nie, opis ruchu jest zawsze identyczny",
                                "Tylko w próżni"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Pomyśl o pasażerze siedzącym w jadącym autobusie i obserwatorze stojącym na ulicy. Ten sam pasażer ma różne położenie względem obu układów.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Piłka spadła z balkonu pionowo w dół z wysokości 6 m, odbiła się od ziemi i uniosła pionowo w górę na wysokość 2 m, gdzie złapał ją pies. Oblicz drogę i wartość przemieszczenia piłki.",
                            "odpowiedzi": [
                                "Droga 8m, przemieszczenie 4m",
                                "Droga 8m, przemieszczenie 6m",
                                "Droga 6m, przemieszczenie 2m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Droga sumuje każdy metr ruchu (w dół i w górę). W przemieszczeniu interesuje nas tylko odległość od miejsca, z którego piłka wypadła (balkon), do miejsca, gdzie ruch się zakończył (pysk psa).",
                            "wyjasnienie": "Droga to całkowita długość toru: 6m+2m=8m. Przemieszczenie to wektor skierowany z balkonu w dół do punktu końcowego. Skoro piłka spadła o 6 m, ale wróciła o 2 m w górę, znajduje się teraz 4 m poniżej balkonu."
                        },
                        {
                            "pytanie": "Jaka jednostka w SI opisuje drogę?",
                            "odpowiedzi": [
                                "metr (m)",
                                "sekunda (s)",
                                "metr na sekundę (m/s)"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Droga jest długością, więc szukaj jednostki długości w układzie SI.",
                        
                            "wyjasnienie": "Metr (m) to podstawowa jednostka długości w układzie SI (Międzynarodowy Układ Jednostek Miar). Ponieważ droga w fizyce oznacza przebyty dystans (długość toru), wyraża się ją w metrach lub ich pochodnych (np. kilometrach)."
                        },
                        {
                            "pytanie": "Jeżeli ciało porusza się po prostej i nie zmienia kierunku, wartość drogi i przemieszczenia...",
                            "odpowiedzi": [
                                "Są sobie równe",
                                "Są nierówne, bo droga jest większa od przemieszczenia",
                                "Są nierówne, bo przemieszczenie jest większe od drogi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": " Przy ruchu po linii prostej bez zawracania, ciało nie cofa się ani nie skręca. Cała przebyta trasa to po prostu jeden prosty odcinek łączący punkt startu z punktem mety.",
                        
                            "wyjasnienie": "Jeśli ciało porusza się wzdłuż linii prostej i nie zmienia kierunku (nie zawraca), długość przebytej trasy odpowiada dokładnie długości odcinka między pozycją początkową a końcową. Dlatego wartość przemieszczenia jest równa drodze."
                        }
                    ]
                },
                {
                    "temat": "Prędkość i czas ruchu",
                    "quiz": [
                        {
                            "pytanie": "Jak obliczyć średnią szybkość na podstawie całkowitej drogi i czasu ruchu?",
                            "odpowiedzi": [
                                "v_śr = s/Δt",
                                "v_śr = s·Δt",
                                "v_śr = Δt/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v_śr = s/Δt",
                            "wskazowka": "Szybkość mówi, jaką drogę średnio przypada na jednostkę czasu. Podziel całkowitą drogę przez całkowity czas.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało przebywa 120 m w 10 s. Jaka jest jego średnia szybkość?",
                            "odpowiedzi": [
                                "12 m/s",
                                "1200 m/s",
                                "0,083 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_śr = s/Δt",
                            "wskazowka": "Podstaw s = 120 m i Δt = 10 s do wzoru na średnią szybkość. Wynik powinien mieć jednostkę m/s.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "72 km/h to ile m/s?",
                            "odpowiedzi": [
                                "20 m/s",
                                "7,2 m/s",
                                "259,2 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Przy zamianie km/h na m/s pomnóż przez 1000 i podziel przez 3600. Możesz też użyć przybliżenia 1 m/s = 3,6 km/h.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co oznacza prędkość chwilowa?",
                            "odpowiedzi": [
                                "Prędkość w konkretnej chwili ruchu",
                                "Całą drogę podzieloną przez cały czas w każdym przypadku",
                                "Tylko maksymalną prędkość"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v(t) = dx/dt",
                            "wskazowka": "Nie uśredniaj całego ruchu. Prędkość chwilowa opisuje stan ruchu w wybranym momencie.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Prędkość jest wielkością wektorową, ponieważ ma...",
                            "odpowiedzi": [
                                "Wartość, kierunek i zwrot",
                                "Tylko wartość",
                                "Tylko jednostkę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Odróżnij prędkość od szybkości. Szybkość jest skalarem, a prędkość zawiera również informację o kierunku i zwrocie.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Pojazd jedzie 15 m/s przez 20 s. Jaką drogę pokona przy stałej prędkości?",
                            "odpowiedzi": [
                                "300 m",
                                "35 m",
                                "0,75 m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "s = vt",
                            "wskazowka": "Przy stałej prędkości droga rośnie proporcjonalnie do czasu. Pomnóż prędkość przez czas.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli czas ruchu zwiększymy dwukrotnie przy tej samej stałej prędkości, droga...",
                            "odpowiedzi": [
                                "Zwiększy się dwukrotnie",
                                "Zmniejszy się dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "s = vt",
                            "wskazowka": "Przy stałym v droga jest wprost proporcjonalna do czasu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jaka jest jednostka prędkości w SI?",
                            "odpowiedzi": [
                                "m/s",
                                "m/s²",
                                "N"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Prędkość opisuje zmianę położenia w czasie, więc połącz jednostkę długości z jednostką czasu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli prędkość chwilowa wynosi 0, czy ciało musi być przez cały ruch w spoczynku?",
                            "odpowiedzi": [
                                "Nie, może mieć chwilowo v = 0",
                                "Tak, zawsze",
                                "Tylko gdy masa wynosi 0"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Prędkość chwilowa dotyczy jednej chwili. Przykładem jest najwyższy punkt rzutu pionowego.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało pokonało 50 m w pierwszych 5 s i 100 m w kolejnych 5 s. Jaka jest średnia szybkość całego ruchu?",
                            "odpowiedzi": [
                                "15 m/s",
                                "10 m/s",
                                "30 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_śr = s_całk/Δt_całk",
                            "wskazowka": "Najpierw zsumuj obie drogi, potem zsumuj oba przedziały czasu. Nie uśredniaj samych szybkości bez sprawdzenia czasów.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Ruch jednostajny prostoliniowy",
                    "quiz": [
                        {
                            "pytanie": "Co jest stałe w ruchu jednostajnym prostoliniowym?",
                            "odpowiedzi": [
                                "Wartość i kierunek prędkości",
                                "Przyspieszenie różne od zera",
                                "Droga"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v = const, a = 0",
                            "wskazowka": "Słowo „jednostajny” oznacza stałą prędkość, a „prostoliniowy” — stały kierunek ruchu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jaki wzór opisuje drogę w ruchu jednostajnym, jeśli ciało zaczyna z położenia x₀?",
                            "odpowiedzi": [
                                "x = x₀ + vt",
                                "x = x₀ + at²",
                                "x = v/t"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "x(t) = x₀ + vt",
                            "wskazowka": "Położenie początkowe trzeba dodać do zmiany położenia. W ruchu jednostajnym zmiana ta wynosi vt.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Na wykresie x(t) ruchu jednostajnego nachylenie prostej oznacza...",
                            "odpowiedzi": [
                                "Prędkość",
                                "Masę",
                                "Siłę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v = Δx/Δt",
                            "wskazowka": "Nachylenie to zmiana wartości na osi pionowej podzielona przez zmianę czasu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Samochód jedzie 25 m/s przez 8 s. Jaką drogę pokona?",
                            "odpowiedzi": [
                                "200 m",
                                "33 m",
                                "3,125 m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "s = vt",
                            "wskazowka": "Masz stałą prędkość i czas, więc użyj bezpośrednio zależności s = vt.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli w ruchu jednostajnym prędkość wynosi 0, ciało...",
                            "odpowiedzi": [
                                "Pozostaje w spoczynku",
                                "Ma stałe dodatnie przyspieszenie",
                                "Porusza się coraz szybciej"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Stała prędkość równa zero oznacza brak zmiany położenia w czasie.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak wygląda wykres v(t) dla ruchu jednostajnego?",
                            "odpowiedzi": [
                                "Linia pozioma",
                                "Parabola",
                                "Okrąg"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Skoro v nie zmienia się z czasem, wartość na osi v pozostaje stała.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak wygląda wykres a(t) dla ruchu jednostajnego?",
                            "odpowiedzi": [
                                "Pokrywa się z osią czasu, czyli a = 0",
                                "Jest linią rosnącą",
                                "Jest parabolą"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = 0",
                            "wskazowka": "Brak zmiany prędkości oznacza brak przyspieszenia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dwa pojazdy jadą w tym samym kierunku z prędkościami 20 m/s i 12 m/s. Jaka jest ich prędkość względna?",
                            "odpowiedzi": [
                                "8 m/s",
                                "32 m/s",
                                "240 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_wzgl = |v₁ − v₂|",
                            "wskazowka": "Przy ruchu w tym samym kierunku odejmij wartości prędkości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W ruchu jednostajnym droga przebyta w kolejnych równych odstępach czasu jest...",
                            "odpowiedzi": [
                                "Taka sama",
                                "Coraz większa",
                                "Coraz mniejsza"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Stała prędkość oznacza taką samą zmianę położenia w każdym równym czasie.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało pokonało 360 m z prędkością 18 m/s. Ile trwał ruch jednostajny?",
                            "odpowiedzi": [
                                "20 s",
                                "6,7 s",
                                "378 s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "t = s/v",
                            "wskazowka": "Szukasz czasu, więc przekształć s = vt względem t, a dopiero potem podstaw dane.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Przyspieszenie i opóźnienie",
                    "quiz": [
                        {
                            "pytanie": "Czym jest przyspieszenie?",
                            "odpowiedzi": [
                                "Zmianą wektora prędkości w czasie",
                                "Drogą przebytą w czasie",
                                "Siłą podzieloną przez drogę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a = Δv/Δt",
                            "wskazowka": "Porównaj prędkość początkową i końcową oraz czas, w którym nastąpiła zmiana.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Samochód zwiększa prędkość z 10 do 20 m/s w 5 s. Jakie ma średnie przyspieszenie?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "6 m/s²",
                                "50 m/s²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a = (v − v₀)/Δt",
                            "wskazowka": "Najpierw policz zmianę prędkości: v − v₀. Następnie podziel ją przez czas zmiany.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jaką jednostkę ma przyspieszenie?",
                            "odpowiedzi": [
                                "m/s²",
                                "m/s",
                                "m²/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Przyspieszenie to prędkość podzielona przez czas. Podziel jednostkę m/s przez s.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeżeli prędkość maleje w czasie, przyspieszenie wzdłuż kierunku ruchu może być...",
                            "odpowiedzi": [
                                "Ujemne",
                                "Zawsze dodatnie",
                                "Zawsze równe zero"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Przyjmij kierunek ruchu jako dodatni i zobacz, czy zmiana prędkości ma zwrot przeciwny do osi dodatniej.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co nazywamy opóźnieniem?",
                            "odpowiedzi": [
                                "Zmniejszaniem wartości prędkości w czasie",
                                "Każdym ruchem po okręgu",
                                "Zwiększaniem drogi w czasie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Opóźnienie opisuje sytuację, w której wartość prędkości maleje. Zwróć uwagę na kierunek osi, jeśli używasz znaku przyspieszenia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało zmienia prędkość z 4 m/s do 16 m/s w 6 s. Jaka jest wartość średniego przyspieszenia?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "12 m/s²",
                                "20 m/s²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a = (16 − 4)/6",
                            "wskazowka": "Oblicz zmianę prędkości, czyli 16 − 4, i podziel przez 6 s.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Czy przyspieszenie może być niezerowe, gdy szybkość jest stała?",
                            "odpowiedzi": [
                                "Tak, gdy zmienia się kierunek prędkości",
                                "Nie, nigdy",
                                "Tylko gdy masa się zmienia"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = Δ⃗v/Δt",
                            "wskazowka": "Przyspieszenie zależy od zmiany wektora prędkości. Nawet przy stałej szybkości zmiana kierunku oznacza zmianę wektora.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeżeli v₀ = 5 m/s, a = 0 i t = 10 s, jaka będzie prędkość końcowa?",
                            "odpowiedzi": [
                                "5 m/s",
                                "0 m/s",
                                "50 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v = v₀ + at",
                            "wskazowka": "Brak przyspieszenia oznacza, że prędkość się nie zmienia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Samochód hamuje od 30 m/s do 10 m/s w 4 s. Jakie jest jego średnie przyspieszenie przy osi dodatniej zgodnej z ruchem?",
                            "odpowiedzi": [
                                "−5 m/s²",
                                "5 m/s²",
                                "−20 m/s²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = (v − v₀)/Δt",
                            "wskazowka": "Końcowa prędkość jest mniejsza od początkowej, więc licznik będzie ujemny. Dopiero potem podziel przez 4 s.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Na wykresie v(t) nachylenie prostej odpowiada...",
                            "odpowiedzi": [
                                "Przyspieszeniu",
                                "Drodze",
                                "Masie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = Δv/Δt",
                            "wskazowka": "Nachylenie to zmiana v podzielona przez zmianę czasu — dokładnie definicja przyspieszenia średniego.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Ruch jednostajnie przyspieszony i opóźniony",
                    "quiz": [
                        {
                            "pytanie": "Jaki warunek definiuje ruch jednostajnie przyspieszony?",
                            "odpowiedzi": [
                                "Przyspieszenie ma stałą wartość",
                                "Prędkość jest zawsze stała",
                                "Droga jest zawsze równa zero"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = const",
                            "wskazowka": "Słowo „jednostajnie” odnosi się tutaj do stałości przyspieszenia, a nie prędkości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak obliczyć prędkość po czasie t przy stałym przyspieszeniu?",
                            "odpowiedzi": [
                                "v = v₀ + at",
                                "v = v₀/t + a",
                                "v = at/v₀"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v = v₀ + at",
                            "wskazowka": "Zacznij od prędkości początkowej. Przyspieszenie zmienia prędkość o at.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jaki wzór opisuje położenie przy stałym przyspieszeniu?",
                            "odpowiedzi": [
                                "x = x₀ + v₀t + ½at²",
                                "x = x₀ + vt²",
                                "x = at/v₀"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "x = x₀ + v₀t + ½at²",
                            "wskazowka": "Uwzględnij zarówno ruch wynikający z prędkości początkowej, jak i dodatkowe przesunięcie wywołane przyspieszeniem.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało rusza z miejsca z a = 2 m/s². Jaka będzie jego prędkość po 5 s?",
                            "odpowiedzi": [
                                "10 m/s",
                                "2,5 m/s",
                                "25 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v = v₀ + at",
                            "wskazowka": "„Rusza z miejsca” oznacza v₀ = 0. Wstaw a i t do wzoru na prędkość.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało rusza z miejsca z a = 2 m/s². Jaką drogę pokona w 5 s?",
                            "odpowiedzi": [
                                "25 m",
                                "10 m",
                                "50 m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "s = v₀t + ½at²",
                            "wskazowka": "Ponieważ v₀ = 0, pierwszy składnik znika. Pozostaje część zależna od a i t².",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak wygląda wykres v(t) przy stałym dodatnim przyspieszeniu?",
                            "odpowiedzi": [
                                "Prosta rosnąca",
                                "Linia pozioma",
                                "Parabola zawsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v(t) = v₀ + at",
                            "wskazowka": "Prędkość rośnie o taką samą wartość w każdym kolejnym równym czasie, więc wykres jest liniowy.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak wygląda wykres x(t) przy stałym niezerowym przyspieszeniu?",
                            "odpowiedzi": [
                                "Parabola",
                                "Linia pozioma zawsze",
                                "Okrąg"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "x(t) = x₀ + v₀t + ½at²",
                            "wskazowka": "W równaniu położenia występuje t². To właśnie składnik kwadratowy powoduje kształt paraboli.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli a ma zwrot przeciwny do prędkości, ciało może...",
                            "odpowiedzi": [
                                "Zwalniać",
                                "Zawsze przyspieszać",
                                "Nie zmieniać prędkości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Porównaj kierunki wektorów v i a. Przyspieszenie przeciwne do prędkości zmniejsza wartość szybkości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Po jakim czasie ciało z v₀ = 4 m/s i a = 2 m/s² osiągnie 14 m/s?",
                            "odpowiedzi": [
                                "5 s",
                                "7 s",
                                "10 s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "t = (v − v₀)/a",
                            "wskazowka": "Najpierw przekształć v = v₀ + at względem t. Potem podstaw v = 14 m/s, v₀ = 4 m/s i a = 2 m/s².",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Czy ruch jednostajnie opóźniony ma stałe przyspieszenie?",
                            "odpowiedzi": [
                                "Tak, jeśli wartość opóźnienia jest stała",
                                "Nie, nigdy",
                                "Tylko podczas spadku swobodnego"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Jednostajnie opóźniony oznacza stałą zmianę prędkości w czasie, tylko ze zwrotem przeciwnym do ruchu.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Wykresy ruchu",
                    "quiz": [
                        {
                            "pytanie": "Co oznacza nachylenie wykresu x(t)?",
                            "odpowiedzi": [
                                "Prędkość",
                                "Przyspieszenie",
                                "Siłę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v = dx/dt",
                            "wskazowka": "Sprawdź, jak szybko zmienia się położenie wraz z czasem. Nachylenie x(t) daje prędkość.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co oznacza nachylenie wykresu v(t)?",
                            "odpowiedzi": [
                                "Przyspieszenie",
                                "Drogę",
                                "Położenie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = dv/dt",
                            "wskazowka": "Nachylenie to zmiana prędkości na jednostkę czasu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co oznacza pole pod wykresem v(t) w czasie ruchu prostoliniowego?",
                            "odpowiedzi": [
                                "Przemieszczenie",
                                "Masę",
                                "Przyspieszenie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "Δx = ∫v(t)dt",
                            "wskazowka": "Pole ma wymiar prędkość razy czas, czyli m/s · s = m. To odpowiada zmianie położenia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co oznacza pozioma linia v(t) powyżej zera?",
                            "odpowiedzi": [
                                "Stałą dodatnią prędkość",
                                "Stałe dodatnie przyspieszenie",
                                "Spoczynek"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v = const",
                            "wskazowka": "Pozioma linia oznacza stałą wartość na osi pionowej. Skoro jest powyżej zera, prędkość jest dodatnia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co oznacza pozioma linia a(t) na poziomie zera?",
                            "odpowiedzi": [
                                "Brak przyspieszenia",
                                "Stałe przyspieszenie 10 m/s²",
                                "Ruch niemożliwy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = 0",
                            "wskazowka": "Wartość a = 0 oznacza, że wektor prędkości się nie zmienia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli wykres v(t) jest prostą rosnącą, przyspieszenie jest...",
                            "odpowiedzi": [
                                "Stałe i dodatnie",
                                "Równe zero",
                                "Zawsze ujemne"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Stałe nachylenie rosnącej prostej oznacza stałe dodatnie a.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli wykres v(t) przecina oś czasu, co może to oznaczać?",
                            "odpowiedzi": [
                                "Prędkość zmieniła znak",
                                "Masa stała się zerowa",
                                "Czas przestał płynąć"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Na osi czasu v = 0. Jeśli wykres przechodzi z wartości dodatnich na ujemne, zmienia się zwrot ruchu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak wygląda x(t) dla spoczynku?",
                            "odpowiedzi": [
                                "Linia pozioma",
                                "Linia rosnąca o stałym nachyleniu",
                                "Parabola zawsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "x = const",
                            "wskazowka": "Spoczynek oznacza, że położenie nie zmienia się wraz z czasem.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeżeli wykres x(t) jest coraz bardziej stromy w dodatnim kierunku, to wartość prędkości...",
                            "odpowiedzi": [
                                "Rośnie",
                                "Maleje do zera",
                                "Jest stała"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Stromość x(t) oznacza wartość prędkości. Coraz większe nachylenie oznacza wzrost prędkości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Pole pod wykresem a(t) w przedziale czasu odpowiada zmianie...",
                            "odpowiedzi": [
                                "Prędkości",
                                "Położenia bezpośrednio",
                                "Masy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "Δv = ∫a(t)dt",
                            "wskazowka": "Jednostka pola to m/s² · s = m/s, czyli jednostka zmiany prędkości.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Spadek swobodny i rzuty pionowe",
                    "quiz": [
                        {
                            "pytanie": "Jakie przyspieszenie ma ciało w spadku swobodnym, jeśli pomijamy opór powietrza?",
                            "odpowiedzi": [
                                "Przyspieszenie g skierowane w dół",
                                "Zero",
                                "Zawsze skierowane w górę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a = g ≈ 9,81 m/s²",
                            "wskazowka": "Na ciało działa grawitacja. Przyjmij zwrot osi i odpowiednio przypisz znak przyspieszeniu g.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało spada z v₀ = 0. Jak obliczyć jego prędkość po czasie t?",
                            "odpowiedzi": [
                                "v = gt",
                                "v = g/t",
                                "v = t/g"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v = v₀ + gt = gt",
                            "wskazowka": "To szczególny przypadek ruchu jednostajnie przyspieszonego z v₀ = 0 i przyspieszeniem g.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jaką drogę pokona ciało puszczone swobodnie po czasie t?",
                            "odpowiedzi": [
                                "h = ½gt²",
                                "h = gt",
                                "h = g/t²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "h = ½gt²",
                            "wskazowka": "Użyj wzoru na drogę przy stałym przyspieszeniu i zauważ, że v₀ = 0.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W najwyższym punkcie rzutu pionowego w górę prędkość chwilowa wynosi...",
                            "odpowiedzi": [
                                "0",
                                "g",
                                "Maksimum"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "W najwyższym punkcie ciało na moment przestaje poruszać się w górę, zanim zacznie spadać.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Czy w najwyższym punkcie rzutu pionowego przyspieszenie jest równe zero?",
                            "odpowiedzi": [
                                "Nie, nadal działa grawitacja",
                                "Tak, zawsze",
                                "Tylko gdy ciało ma masę 0"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "a = −g (oś dodatnia w górę)",
                            "wskazowka": "Prędkość może być chwilowo równa zero, ale grawitacja nadal działa.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Ciało rzucono pionowo w górę z v₀. Jak znaleźć czas do osiągnięcia najwyższego punktu?",
                            "odpowiedzi": [
                                "t = v₀/g",
                                "t = g/v₀",
                                "t = v₀g"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v = v₀ − gt; 0 = v₀ − gt",
                            "wskazowka": "W najwyższym punkcie przyjmij v = 0. Z równania prędkości wyznacz t.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dwa ciała spadają z tej samej wysokości bez oporu powietrza. Jedno jest cięższe. Które ma większe przyspieszenie?",
                            "odpowiedzi": [
                                "Oba mają takie samo g",
                                "Cięższe",
                                "Lżejsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "W modelu swobodnego spadku przyspieszenie g nie zależy od masy ciała.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli wysokość swobodnego spadku wzrośnie czterokrotnie, czas spadania wzrośnie...",
                            "odpowiedzi": [
                                "Dwukrotnie",
                                "Czterokrotnie",
                                "Ośmiokrotnie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "h = ½gt²",
                            "wskazowka": "Zależność wysokości od czasu zawiera t². Porównaj pierwiastki ze stosunku wysokości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jaką prędkość ma ciało po 2 s swobodnego spadku, przyjmując g = 10 m/s²?",
                            "odpowiedzi": [
                                "20 m/s",
                                "5 m/s",
                                "40 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v = gt",
                            "wskazowka": "Podstaw g = 10 m/s² i t = 2 s. Jednostka wyniku powinna wyjść m/s.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W rzucie pionowym w górę, po minięciu najwyższego punktu ciało...",
                            "odpowiedzi": [
                                "Zaczyna zwiększać wartość prędkości w dół",
                                "Ma nadal stałą prędkość zero",
                                "Przestaje podlegać grawitacji"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Po osiągnięciu v = 0 ciało zaczyna spadać. Grawitacja nadaje mu coraz większą prędkość skierowaną w dół.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Ruch względny",
                    "quiz": [
                        {
                            "pytanie": "Czym jest prędkość względna?",
                            "odpowiedzi": [
                                "Prędkością jednego ciała mierzoną względem drugiego",
                                "Zawsze prędkością względem Ziemi",
                                "Sumą wszystkich prędkości we Wszechświecie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_{A/B} = v_A − v_B",
                            "wskazowka": "Zamiast względem Ziemi wybierz jako obserwatora drugie ciało. Wtedy porównujesz ich prędkości wektorowo.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dwa samochody jadą w tym samym kierunku z 30 m/s i 20 m/s. Jaka jest szybkość względna?",
                            "odpowiedzi": [
                                "10 m/s",
                                "50 m/s",
                                "600 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_wzgl = |v₁ − v₂|",
                            "wskazowka": "Przy zgodnych kierunkach odejmij prędkości. Większa prędkość „ucieka” drugiemu pojazdowi o różnicę.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dwa pojazdy jadą naprzeciw siebie z 15 m/s i 10 m/s. Jaka jest szybkość zbliżania?",
                            "odpowiedzi": [
                                "25 m/s",
                                "5 m/s",
                                "150 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_wzgl = v₁ + v₂",
                            "wskazowka": "Przy ruchu w przeciwnych kierunkach odległość między pojazdami zmniejsza się w tempie będącym sumą ich szybkości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Pasażer siedzi w jadącym pociągu. Względem pociągu jest...",
                            "odpowiedzi": [
                                "W spoczynku",
                                "Zawsze w ruchu",
                                "W ruchu tylko na zakrętach"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Ruch zależy od układu odniesienia. Dla obserwatora siedzącego w tym samym pociągu położenie pasażera się nie zmienia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli deszcz pada pionowo względem Ziemi, osoba jadąca rowerem odczuwa go pod kątem. Dlaczego?",
                            "odpowiedzi": [
                                "Bo widzi prędkość deszczu względną względem siebie",
                                "Bo grawitacja zmienia kierunek deszczu",
                                "Bo deszcz przestaje być pionowy względem Ziemi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "v_{deszcz/osoba} = v_{deszcz/Ziemia} − v_{osoba/Ziemia}",
                            "wskazowka": "Oblicz prędkość deszczu względem rowerzysty, odejmując wektory prędkości.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli obserwator porusza się razem z ciałem, jego prędkość względem obserwatora wynosi...",
                            "odpowiedzi": [
                                "0",
                                "Prędkość ciała względem Ziemi",
                                "Zawsze g"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Oba obiekty mają wtedy tę samą prędkość, więc ich różnica wektorowa jest zerowa.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W ruchu względnym znaczenie ma przede wszystkim...",
                            "odpowiedzi": [
                                "Wybór układu odniesienia",
                                "Tylko masa ciała",
                                "Tylko jego kształt"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Zawsze zapytaj: względem czego mierzymy położenie i prędkość? To podstawowe pytanie w zadaniach o ruch względny.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Łódź płynie z prędkością względem wody, a rzeka ma własny nurt. Aby znaleźć prędkość łodzi względem brzegu, trzeba...",
                            "odpowiedzi": [
                                "Dodać odpowiednie wektory prędkości",
                                "Zawsze odjąć ich wartości bez względu na kierunek",
                                "Pomnożyć prędkości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "⃗v_{łódź/brzeg} = ⃗v_{łódź/woda} + ⃗v_{woda/brzeg}",
                            "wskazowka": "Zwróć uwagę na kierunki wektorów. To dodawanie wektorowe, więc nie zawsze jest zwykłym dodawaniem liczb.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli dwa ciała mają identyczne wektory prędkości w tym samym układzie, ich prędkość względna wynosi...",
                            "odpowiedzi": [
                                "0",
                                "Podwojoną wartość",
                                "Połowę wartości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "⃗v_{A/B} = ⃗v_A − ⃗v_B = 0",
                            "wskazowka": "Odejmij identyczne wektory. Wynik jest wektorem zerowym.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dlaczego określenie „ciało porusza się” bez podania układu odniesienia może być niepełne?",
                            "odpowiedzi": [
                                "Bo ruch i spoczynek są względne względem wybranego obserwatora",
                                "Bo ruch zależy od temperatury",
                                "Bo każde ciało musi być w ruchu względem każdego obserwatora"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Ten sam obiekt może spoczywać względem jednego obserwatora i poruszać się względem innego.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Ruch po okręgu",
                    "quiz": [
                        {
                            "pytanie": "Jak obliczyć prędkość kątową w ruchu okresowym?",
                            "odpowiedzi": [
                                "ω = 2π/T",
                                "ω = T/2π",
                                "ω = 2πT"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "ω = 2π/T",
                            "wskazowka": "Jedno pełne okrążenie odpowiada 2π radianom i trwa okres T. Podziel kąt pełnego obrotu przez czas.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak związać częstotliwość z okresem ruchu?",
                            "odpowiedzi": [
                                "f = 1/T",
                                "f = T",
                                "f = T²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "f = 1/T",
                            "wskazowka": "Częstotliwość mówi, ile pełnych obiegów przypada na sekundę, więc jest odwrotnością czasu jednego obiegu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak obliczyć szybkość liniową w ruchu po okręgu?",
                            "odpowiedzi": [
                                "v = ωr",
                                "v = ω/r",
                                "v = r/ω"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v = ωr",
                            "wskazowka": "Prędkość liniowa rośnie wraz z promieniem przy tej samej prędkości kątowej.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Gdzie skierowane jest przyspieszenie dośrodkowe?",
                            "odpowiedzi": [
                                "Do środka okręgu",
                                "Wzdłuż stycznej zawsze",
                                "Na zewnątrz okręgu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Narysuj ciało na okręgu i zaznacz środek. Przyspieszenie dośrodkowe wskazuje od ciała do środka toru.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Czy ciało poruszające się po okręgu ze stałą szybkością ma przyspieszenie?",
                            "odpowiedzi": [
                                "Tak, bo zmienia kierunek prędkości",
                                "Nie, bo szybkość jest stała",
                                "Tylko gdy zmienia masę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Szybkość może być stała, ale wektor prędkości stale zmienia kierunek.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Samochód jedzie po okręgu z v = 10 m/s i r = 50 m. Jakie ma przyspieszenie dośrodkowe?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "5 m/s²",
                                "500 m/s²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Podnieś 10 m/s do kwadratu, a następnie podziel przez promień 50 m.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli przy tej samej prędkości promień toru zwiększymy dwukrotnie, przyspieszenie dośrodkowe...",
                            "odpowiedzi": [
                                "Zmniejszy się dwukrotnie",
                                "Wzrośnie dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Przy stałym v promień znajduje się w mianowniku. Zwiększenie r zmniejsza wartość a_d.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jeśli przy tym samym promieniu podwoimy prędkość, przyspieszenie dośrodkowe...",
                            "odpowiedzi": [
                                "Wzrośnie czterokrotnie",
                                "Wzrośnie dwukrotnie",
                                "Zmniejszy się dwukrotnie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Prędkość występuje w kwadracie. Podwojenie v oznacza czynnik 2².",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Co jest okresem ruchu po okręgu?",
                            "odpowiedzi": [
                                "Czas jednego pełnego obiegu",
                                "Liczba obiegów w sekundzie",
                                "Długość promienia"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Okres oznacza czas potrzebny na wykonanie dokładnie jednego pełnego cyklu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Jak zmieni się częstotliwość, jeśli okres ruchu skróci się dwukrotnie?",
                            "odpowiedzi": [
                                "Wzrośnie dwukrotnie",
                                "Zmniejszy się dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "f = 1/T",
                            "wskazowka": "Częstotliwość i okres są odwrotnie proporcjonalne. Mniejszy okres oznacza więcej obiegów w tej samej sekundzie.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                },
                {
                    "temat": "Rzuty i ruch w dwóch wymiarach",
                    "quiz": [
                        {
                            "pytanie": "W rzucie poziomym, pomijając opór powietrza, jaka jest składowa pozioma prędkości?",
                            "odpowiedzi": [
                                "Stała",
                                "Stale rośnie",
                                "Stale maleje do zera"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v_x = const",
                            "wskazowka": "Grawitacja działa pionowo, więc nie zmienia poziomej składowej prędkości w idealnym modelu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W rzucie poziomym jaka siła odpowiada za zmianę pionowej prędkości?",
                            "odpowiedzi": [
                                "Grawitacja",
                                "Siła pozioma o stałej wartości",
                                "Siła sprężystości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "W idealnym rzucie po opuszczeniu wyrzutni pozostaje grawitacja, która nadaje pionowe przyspieszenie g.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Tor rzutu poziomego bez oporu powietrza ma kształt...",
                            "odpowiedzi": [
                                "Paraboli",
                                "Okręgu",
                                "Prostej poziomej"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Poziomo ruch jest jednostajny, a pionowo jednostajnie przyspieszony. Po połączeniu obu zależności otrzymujesz parabolę.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Czas spadania w rzucie poziomym z wysokości h zależy przede wszystkim od...",
                            "odpowiedzi": [
                                "Wysokości i grawitacji",
                                "Masy ciała",
                                "Poziomej prędkości początkowej"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "h = ½gt²",
                            "wskazowka": "Ruch pionowy jest niezależny od poziomej składowej. Z równania pionowego wyznacz czas.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Zasięg rzutu poziomego można obliczyć jako...",
                            "odpowiedzi": [
                                "x = v₀t",
                                "x = gt",
                                "x = h/t"
                            ],
                            "prawidlowa": 0,
                            "poziom": 2,
                            "wzor": "x = v₀t",
                            "wskazowka": "Poziomo ciało porusza się ze stałą prędkością v₀. Zasięg to pozioma prędkość razy czas lotu.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W rzucie ukośnym, bez oporu powietrza, przyspieszenie poziome jest...",
                            "odpowiedzi": [
                                "Równe zero",
                                "Równe g",
                                "Zawsze ujemne"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "Grawitacja działa pionowo. W poziomie, jeśli pomijamy opór, nie ma przyspieszenia.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "W najwyższym punkcie rzutu ukośnego pionowa składowa prędkości wynosi...",
                            "odpowiedzi": [
                                "0",
                                "g",
                                "Maksimum"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
                            "wskazowka": "To moment, w którym pionowy ruch zmienia zwrot z wznoszenia na opadanie.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Czy pozioma składowa prędkości w rzucie ukośnym zmienia się bez oporu powietrza?",
                            "odpowiedzi": [
                                "Nie, pozostaje stała",
                                "Tak, rośnie z g",
                                "Tak, maleje do zera"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v_x = v₀ cosα = const",
                            "wskazowka": "Rozłóż prędkość początkową na składowe. Grawitacja wpływa tylko na składową pionową.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dla rzutu ukośnego pod kątem α składowa pionowa prędkości początkowej wynosi...",
                            "odpowiedzi": [
                                "v₀ sinα",
                                "v₀ cosα",
                                "v₀/α"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v_{0y} = v₀ sinα",
                            "wskazowka": "Narysuj wektor v₀ jako przeciwprostokątną trójkąta. Składowa pionowa jest bokiem naprzeciw kąta α.",
                        
                            "wyjasnienie": ""
                        },
                        {
                            "pytanie": "Dla rzutu ukośnego składowa pozioma prędkości początkowej wynosi...",
                            "odpowiedzi": [
                                "v₀ cosα",
                                "v₀ sinα",
                                "v₀α"
                            ],
                            "prawidlowa": 0,
                            "poziom": 3,
                            "wzor": "v_{0x} = v₀ cosα",
                            "wskazowka": "Składowa pozioma jest bokiem przyległym do kąta α, więc korzystasz z cosinusa.",
                        
                            "wyjasnienie": ""
                        }
                    ]
                }
            ],
            "dynamika": [
                {
                    "temat": "Zasady Newtona",
                    "quiz": [
                        {
                            "pytanie": "Na ciało 3 kg działa wypadkowa siła 12 N. Jakie ma przyspieszenie?",
                            "odpowiedzi": [
                                "4 m/s²",
                                "36 m/s²",
                                "0,25 m/s²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli wypadkowa siła działająca na ciało wynosi 0, ciało może:",
                            "odpowiedzi": [
                                "Spoczywać lub poruszać się ruchem jednostajnym",
                                "Zawsze przyspieszać",
                                "Zawsze hamować"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dwie siły 8 N i 5 N działają w przeciwnych kierunkach. Wypadkowa ma wartość:",
                            "odpowiedzi": [
                                "3 N",
                                "13 N",
                                "40 N"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Siła tarcia",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej wyjaśnia, czym jest siła tarcia?",
                            "odpowiedzi": [
                                "Siła oporu ruchu",
                                "Siła dośrodkowa",
                                "Siła grawitacji"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "statyka_i_bryla": [
                {
                    "temat": "Równowaga ciał",
                    "quiz": [
                        {
                            "pytanie": "Jaki warunek musi być spełniony, aby ciało pozostawało w równowadze mechanicznej?",
                            "odpowiedzi": [
                                "Gdy suma sił = 0",
                                "Gdy się porusza",
                                "Gdy działa siła"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Moment siły",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej opisuje moment siły i jego wpływ na ruch obrotowy?",
                            "odpowiedzi": [
                                "Iloczyn siły i ramienia",
                                "Siła podzielona przez czas",
                                "Energia"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Prędkość kątowa",
                    "quiz": [
                        {
                            "pytanie": "Koło wykonuje 5 pełnych obrotów w 10 s. Jaka jest jego prędkość kątowa?",
                            "odpowiedzi": [
                                "π rad/s",
                                "0,5 rad/s",
                                "10π rad/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Przyspieszenie dośrodkowe",
                    "quiz": [
                        {
                            "pytanie": "Dla v = 6 m/s i r = 3 m przyspieszenie dośrodkowe wynosi:",
                            "odpowiedzi": [
                                "12 m/s²",
                                "2 m/s²",
                                "18 m/s²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Moment pędu",
                    "quiz": [
                        {
                            "pytanie": "Punkt materialny ma pęd 4 kg·m/s i ramię 0,5 m prostopadłe do pędu. Jaki ma moment pędu?",
                            "odpowiedzi": [
                                "2 kg·m²/s",
                                "8 kg·m²/s",
                                "4,5 kg·m²/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Mechanika punktu materialnego i bryły sztywnej",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },

    "termodynamika": {
        "emoji": "⚙️",
        "nazwa": "Własności materii i termodynamika",
        "maturalna": true,
        "podnagalowki": {
            "temperatura_i_cieplo": [
                {
                    "temat": "Skale temperatur",
                    "quiz": [
                        {
                            "pytanie": "Jaką temperaturę w kelwinach odpowiada 25°C?",
                            "odpowiedzi": [
                                "298 K",
                                "248 K",
                                "325 K"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Na jaką temperaturę w stopniach Celsjusza odpowiada około 310 K?",
                            "odpowiedzi": [
                                "37°C",
                                "310°C",
                                "-37°C"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "O ile kelwinów wzrasta temperatura przy zmianie z 280 K do 300 K?",
                            "odpowiedzi": [
                                "20 K",
                                "580 K",
                                "10 K"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Pomiar temperatury",
                    "quiz": [
                        {
                            "pytanie": "O ile wzrasta temperatura, gdy wskazanie termometru zmienia się z 18°C na 43°C?",
                            "odpowiedzi": [
                                "25°C",
                                "61°C",
                                "18°C"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Którą wielkość fizyczną termometr mierzy bezpośrednio?",
                            "odpowiedzi": [
                                "Temperatura",
                                "Ciepło właściwe",
                                "Moc"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dwa termometry pokazują 20°C i 68°F. Które wskazania odpowiadają tej samej temperaturze?",
                            "odpowiedzi": [
                                "Są w przybliżeniu równe",
                                "68°F to 68°C",
                                "20°C to 20 K"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Ciepło właściwe",
                    "quiz": [
                        {
                            "pytanie": "Ile energii potrzeba, aby ogrzać 2 kg wody o 5°C? c=4200 J/(kg·°C).",
                            "odpowiedzi": [
                                "42 000 J",
                                "8 400 J",
                                "2 100 J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Który materiał potrzebuje więcej energii do ogrzania 1 kg o 10°C, jeśli ma większe c?",
                            "odpowiedzi": [
                                "Materiał o większym c",
                                "Materiał o mniejszym c",
                                "Oba zawsze tyle samo"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dostarczono 8400 J do 1 kg wody. O ile wzrośnie jej temperatura? c=4200 J/(kg·°C).",
                            "odpowiedzi": [
                                "2°C",
                                "0,5°C",
                                "4°C"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "energia_i_przemiany": [
                {
                    "temat": "Energia cieplna",
                    "quiz": [
                        {
                            "pytanie": "Który wzór pozwala obliczyć energię potrzebną do ogrzania ciała o określoną zmianę temperatury?",
                            "odpowiedzi": [
                                "Q = mcΔT",
                                "Q = mv²/2",
                                "Q = mgh"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Praca i energia",
                    "quiz": [
                        {
                            "pytanie": "Która jednostka SI jest właściwa dla pracy mechanicznej?",
                            "odpowiedzi": [
                                "Dżul",
                                "Watt",
                                "Newton"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Energia wewnętrzna",
                    "quiz": [
                        {
                            "pytanie": "Gaz otrzymał 500 J ciepła i wykonał 200 J pracy. O ile zmieniła się jego energia wewnętrzna?",
                            "odpowiedzi": [
                                "300 J",
                                "700 J",
                                "-300 J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Który proces może zwiększyć energię wewnętrzną bez dopływu ciepła?",
                            "odpowiedzi": [
                                "Wykonanie pracy nad układem",
                                "Tylko chłodzenie",
                                "Tylko topnienie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli energia wewnętrzna układu wzrosła o 150 J, co oznacza znak dodatni tej zmiany?",
                            "odpowiedzi": [
                                "Układ zwiększył swoją energię wewnętrzną",
                                "Układ stracił 150 J",
                                "Praca zawsze wyniosła 0"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Praca i energia cieplna",
                    "quiz": [
                        {
                            "pytanie": "Siła 20 N przesuwa tłok o 0,3 m w swoim kierunku. Jaką pracę wykonuje?",
                            "odpowiedzi": [
                                "6 J",
                                "60 J",
                                "0,015 J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Gaz wykonał 800 J pracy, pobierając 1200 J ciepła. Jaka była zmiana energii wewnętrznej?",
                            "odpowiedzi": [
                                "400 J",
                                "2000 J",
                                "-400 J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która jednostka SI jest właściwa dla pracy mechanicznej?",
                            "odpowiedzi": [
                                "J",
                                "W",
                                "Pa"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Przemiany gazowe",
                    "quiz": [
                        {
                            "pytanie": "Gaz ma temperaturę 300 K. Przy stałym ciśnieniu ogrzano go do 600 K. Jak zmieni się jego objętość?",
                            "odpowiedzi": [
                                "Wzrośnie dwukrotnie",
                                "Zmniejszy się dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która wielkość pozostaje stała w przemianie izochorycznej?",
                            "odpowiedzi": [
                                "Objętość",
                                "Ciśnienie",
                                "Temperatura"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która wielkość pozostaje stała w przemianie izotermicznej gazu?",
                            "odpowiedzi": [
                                "Temperatura",
                                "Objętość",
                                "Masa molowa"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "hydrostatyka_i_aerostatyka": [
                {
                    "temat": "Ciśnienie hydrostatyczne",
                    "quiz": [
                        {
                            "pytanie": "Jakie ciśnienie hydrostatyczne wywiera woda na głębokości 2 m? ρ=1000 kg/m³, g=10 m/s².",
                            "odpowiedzi": [
                                "20 000 Pa",
                                "5 000 Pa",
                                "2 000 Pa"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Ciśnienie hydrostatyczne zależy od głębokości:",
                            "odpowiedzi": [
                                "Wprost proporcjonalnie",
                                "Odwrotnie proporcjonalnie",
                                "Nie zależy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Na tej samej głębokości w tej samej cieczy ciśnienie jest:",
                            "odpowiedzi": [
                                "Takie samo niezależnie od kształtu naczynia",
                                "Zawsze większe w szerokim naczyniu",
                                "Zawsze mniejsze w wąskim"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Prawo Archimedesa",
                    "quiz": [
                        {
                            "pytanie": "Ciało wypiera 0,002 m³ wody. Jaka jest siła wyporu? ρ=1000 kg/m³, g=10 m/s².",
                            "odpowiedzi": [
                                "20 N",
                                "2 N",
                                "200 N"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Siła wyporu działa na zanurzone ciało:",
                            "odpowiedzi": [
                                "Pionowo ku górze",
                                "Pionowo w dół",
                                "Poziomo"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli objętość wypartej cieczy wzrośnie 2 razy, siła wyporu:",
                            "odpowiedzi": [
                                "Wzrośnie 2 razy",
                                "Zmniejszy się 2 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Równanie Bernoulliego",
                    "quiz": []
                }
            ],
            "gazy_i_przemiany": [
                {
                    "temat": "Równanie gazu doskonałego",
                    "quiz": []
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Własności materii i termodynamika",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "grawitacja_astronomia": {
        "emoji": "🌌",
        "nazwa": "Grawitacja i astronomia",
        "maturalna": true,
        "podnagalowki": {
            "grawitacja": [
                {
                    "temat": "Prawo powszechnego ciążenia",
                    "quiz": []
                },
                {
                    "temat": "Energia w polu grawitacyjnym",
                    "quiz": []
                },
                {
                    "temat": "Prędkość ucieczki",
                    "quiz": []
                }
            ],
            "ruch_orbitalny": [
                {
                    "temat": "Prawa Keplera",
                    "quiz": [
                        {
                            "pytanie": "Orbita planet to:",
                            "odpowiedzi": [
                                "Elipsa",
                                "Koło",
                                "Parabola"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Ruch orbitalny",
                    "quiz": [
                        {
                            "pytanie": "Planeta porusza się po orbicie eliptycznej. Jej prędkość jest większa:",
                            "odpowiedzi": [
                                "Bliżej Słońca",
                                "Dalej od Słońca",
                                "Zawsze taka sama"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Okres obiegu planety wokół Słońca rośnie wraz z odległością zgodnie z:",
                            "odpowiedzi": [
                                "III prawem Keplera",
                                "Prawem Ohma",
                                "Prawem Archimedesa"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Satelita na orbicie kołowej porusza się dzięki równowadze między bezwładnością a:",
                            "odpowiedzi": [
                                "Grawitacją",
                                "Tarciem powietrza",
                                "Siłą elektryczną"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Zastosowania grawitacji w astronomii",
                    "quiz": [
                        {
                            "pytanie": "Jeśli odległość między planetą i gwiazdą wzrośnie 2 razy, siła grawitacji:",
                            "odpowiedzi": [
                                "Zmaleje 4 razy",
                                "Zmaleje 2 razy",
                                "Wzrośnie 2 razy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zwiększenie masy planety 2 razy przy tej samej odległości powoduje siłę grawitacji:",
                            "odpowiedzi": [
                                "2 razy większą",
                                "4 razy większą",
                                "Bez zmiany"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Prędkość ucieczki z danego ciała zależy między innymi od jego:",
                            "odpowiedzi": [
                                "Masy i promienia",
                                "Koloru",
                                "Liczby pierścieni"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "ciala_niebieskie": [
                {
                    "temat": "Gwiazdy",
                    "quiz": [
                        {
                            "pytanie": "Jaki proces fizyczny jest głównym źródłem energii gwiazd ciągu głównego podobnych do Słońca?",
                            "odpowiedzi": [
                                "Fuzja jąder wodoru",
                                "Spalanie chemiczne",
                                "Rozszczepianie żelaza"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Barwa gwiazdy jest związana z jej:",
                            "odpowiedzi": [
                                "Temperaturą powierzchni",
                                "Odległością od Ziemi wyłącznie",
                                "Masą Ziemi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "W widmie gwiazdy linie absorpcyjne mogą informować o:",
                            "odpowiedzi": [
                                "Składzie chemicznym",
                                "Promieniu Ziemi",
                                "Kształcie orbity Księżyca"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Planety",
                    "quiz": [
                        {
                            "pytanie": "Ile planet obejmuje Układ Słoneczny według współczesnej klasyfikacji?",
                            "odpowiedzi": [
                                "8",
                                "7",
                                "9"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która planeta krąży najbliżej Słońca?",
                            "odpowiedzi": [
                                "Merkury",
                                "Wenus",
                                "Mars"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która planeta ma największą masę i rozmiary w Układzie Słonecznym?",
                            "odpowiedzi": [
                                "Jowisz",
                                "Saturn",
                                "Neptun"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "gwiazdy_galaktyki": [
                {
                    "temat": "Ewolucja gwiazd",
                    "quiz": [
                        {
                            "pytanie": "Gwiazda podobna do Słońca po fazie ciągu głównego może stać się:",
                            "odpowiedzi": [
                                "Czerwonym olbrzymem",
                                "Czarną dziurą zawsze",
                                "Planetą"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Pozostałością po gwieździe podobnej do Słońca może być:",
                            "odpowiedzi": [
                                "Biały karzeł",
                                "Gwiazda neutronowa zawsze",
                                "Jowisz"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Supernowa może być końcowym etapem ewolucji:",
                            "odpowiedzi": [
                                "Niektórych masywnych gwiazd",
                                "Każdej planety",
                                "Każdego meteoru"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Galaktyki",
                    "quiz": [
                        {
                            "pytanie": "Jak najlepiej scharakteryzować Drogę Mleczną?",
                            "odpowiedzi": [
                                "Galaktyką",
                                "Gromadą planet",
                                "Pojedynczą gwiazdą"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Które typy kształtów mogą mieć galaktyki?",
                            "odpowiedzi": [
                                "Spiralny, eliptyczny lub nieregularny",
                                "Tylko kulisty",
                                "Tylko płaski prostokąt"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Odległość do bardzo dalekich galaktyk można szacować między innymi na podstawie:",
                            "odpowiedzi": [
                                "Przesunięcia ku czerwieni",
                                "Koloru oceanu",
                                "Ciśnienia atmosferycznego"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "obserwacje_kosmologia": [
                {
                    "temat": "Światło i widma",
                    "quiz": [
                        {
                            "pytanie": "Jeśli widmo galaktyki jest przesunięte ku czerwieni, zwykle oznacza to, że galaktyka:",
                            "odpowiedzi": [
                                "Oddala się od nas",
                                "Zawsze się przybliża",
                                "Nie emituje światła"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jednostką odległości często używaną w astronomii jest:",
                            "odpowiedzi": [
                                "Rok świetlny",
                                "Sekunda świetlna?",
                                "Wat"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jaką wielkość mierzy się w latach świetlnych?",
                            "odpowiedzi": [
                                "Odległości",
                                "Czasu",
                                "Mocy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Rozszerzanie Wszechświata",
                    "quiz": [
                        {
                            "pytanie": "Prawo Hubble'a wiąże prędkość oddalania galaktyki z:",
                            "odpowiedzi": [
                                "Jej odległością",
                                "Jej temperaturą wyłącznie",
                                "Liczbą planet"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Obserwowane przesunięcie ku czerwieni odległych galaktyk jest zgodne z:",
                            "odpowiedzi": [
                                "Rozszerzaniem się Wszechświata",
                                "Brakiem ruchu galaktyk",
                                "Kurczeniem się wszystkich gwiazd"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Mikrofalowe promieniowanie tła jest pozostałością po:",
                            "odpowiedzi": [
                                "Wczesnym Wszechświecie",
                                "Powierzchni Słońca",
                                "Atmosferze Ziemi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Grawitacja i obserwacje",
                    "quiz": [
                        {
                            "pytanie": "Soczewkowanie grawitacyjne może:",
                            "odpowiedzi": [
                                "Powiększać i zniekształcać obraz odległego obiektu",
                                "Zmieniać masę gwiazdy",
                                "Wyłączać światło"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Ruch gwiazd wokół centrum galaktyki dostarcza informacji o:",
                            "odpowiedzi": [
                                "Rozkładzie masy w galaktyce",
                                "Temperaturze oceanu",
                                "Ciśnieniu na Ziemi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jaką okresową zmianę jasności gwiazdy obserwuje się podczas tranzytu egzoplanety?",
                            "odpowiedzi": [
                                "Spadki jasności gwiazdy",
                                "Wzrosty masy gwiazdy",
                                "Zmiany temperatury Ziemi"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Grawitacja i astronomia",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "fale_drgania": {
        "emoji": "〰️",
        "nazwa": "Drgania i fale",
        "maturalna": true,
        "podnagalowki": {
            "drgania": [
                {
                    "temat": "Ruch harmoniczny",
                    "quiz": [
                        {
                            "pytanie": "Oscylator ma częstotliwość 2 Hz. Okres wynosi:",
                            "odpowiedzi": [
                                "0,5 s",
                                "2 s",
                                "4 s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "W ruchu harmonicznym w położeniu równowagi prędkość jest:",
                            "odpowiedzi": [
                                "Maksymalna",
                                "Zawsze zerowa",
                                "Równa amplitudzie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Amplituda to:",
                            "odpowiedzi": [
                                "Maksymalne wychylenie od równowagi",
                                "Czas jednego drgania",
                                "Liczba drgań na sekundę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Amplituda i okres",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie poprawnie interpretuje amplitudę w ruchu drgającym?",
                            "odpowiedzi": [
                                "Maksymalne wychylenie",
                                "Czas pełnego cyklu",
                                "Szybkość drgań"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Okres i częstotliwość",
                    "quiz": [
                        {
                            "pytanie": "Źródło wykonuje 120 drgań w 2 s. Częstotliwość wynosi:",
                            "odpowiedzi": [
                                "60 Hz",
                                "240 Hz",
                                "0,0167 Hz"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli okres wynosi 0,25 s, częstotliwość wynosi:",
                            "odpowiedzi": [
                                "4 Hz",
                                "0,25 Hz",
                                "2 Hz"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zwiększenie częstotliwości 2 razy powoduje okres:",
                            "odpowiedzi": [
                                "2 razy mniejszy",
                                "2 razy większy",
                                "bez zmiany"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Energia drgań",
                    "quiz": [
                        {
                            "pytanie": "W idealnym oscylatorze bez strat całkowita energia drgań:",
                            "odpowiedzi": [
                                "Jest stała",
                                "Rośnie liniowo",
                                "Zawsze wynosi 0"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "W maksymalnym wychyleniu sprężyny energia potencjalna jest:",
                            "odpowiedzi": [
                                "Maksymalna",
                                "Zawsze zerowa",
                                "Ujemna"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Tłumienie drgań powoduje z czasem:",
                            "odpowiedzi": [
                                "Zmniejszanie amplitudy",
                                "Wzrost amplitudy",
                                "Brak zmian"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "fale_mechaniczne": [
                {
                    "temat": "Równanie fali",
                    "quiz": [
                        {
                            "pytanie": "Która zależność łączy prędkość fali, jej długość i częstotliwość?",
                            "odpowiedzi": [
                                "v = λ·f",
                                "v = λ/f",
                                "v = λ+f"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Rodzaje fal",
                    "quiz": [
                        {
                            "pytanie": "Falami poprzecznymi są:",
                            "odpowiedzi": [
                                "Fale świetlne",
                                "Fale dźwiękowe",
                                "Fale sejsmiczne"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Parametry fali",
                    "quiz": [
                        {
                            "pytanie": "Fala ma λ=0,5 m i f=6 Hz. Prędkość wynosi:",
                            "odpowiedzi": [
                                "3 m/s",
                                "12 m/s",
                                "0,083 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli częstotliwość fali wzrośnie 2 razy w tym samym ośrodku, długość fali:",
                            "odpowiedzi": [
                                "Zmniejszy się 2 razy",
                                "Wzrośnie 2 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jednostką długości fali jest:",
                            "odpowiedzi": [
                                "metr",
                                "herc",
                                "sekunda"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Fale poprzeczne i podłużne",
                    "quiz": [
                        {
                            "pytanie": "Fala na sprężynie, w której zwoje zagęszczają się i rozrzedzają, jest:",
                            "odpowiedzi": [
                                "Podłużna",
                                "Poprzeczna",
                                "Elektromagnetyczna"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Fala na napiętej linie może być:",
                            "odpowiedzi": [
                                "Poprzeczna",
                                "Tylko podłużna",
                                "Zawsze elektromagnetyczna"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Czego potrzebuje fala mechaniczna, aby mogła się rozchodzić?",
                            "odpowiedzi": [
                                "Ośrodka materialnego",
                                "Zawsze próżni",
                                "Wyłącznie metalu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Interferencja i dyfrakcja fal",
                    "quiz": [
                        {
                            "pytanie": "Jaki efekt może wystąpić, gdy dwie fale zgodne w fazie nakładają się?",
                            "odpowiedzi": [
                                "Wzmocnienie",
                                "Zawsze całkowite wygaszenie",
                                "Zmiana źródła"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Kiedy dyfrakcja na przeszkodzie jest szczególnie wyraźna w porównaniu z długością fali?",
                            "odpowiedzi": [
                                "Porównywalny z długością fali",
                                "Milion razy większy od fali",
                                "Zawsze zerowy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jakie zjawisko fizyczne opisuje interferencja?",
                            "odpowiedzi": [
                                "Nakładania się fal",
                                "Tylko odbicia od lustra",
                                "Tylko fal dźwiękowych"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "akustyka": [
                {
                    "temat": "Prędkość dźwięku",
                    "quiz": [
                        {
                            "pytanie": "Jaka jest przybliżona prędkość dźwięku w powietrzu?",
                            "odpowiedzi": [
                                "343 m/s",
                                "150 m/s",
                                "1000 m/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Częstotliwość dźwięku",
                    "quiz": [
                        {
                            "pytanie": "Która jednostka SI opisuje częstotliwość?",
                            "odpowiedzi": [
                                "Herc",
                                "Decybel",
                                "Sekunda"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Dźwięk",
                    "quiz": [
                        {
                            "pytanie": "Dźwięk 440 Hz w powietrzu 343 m/s ma długość około:",
                            "odpowiedzi": [
                                "0,78 m",
                                "1,28 m",
                                "343 m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Człowiek słyszy dźwięk o częstotliwości:",
                            "odpowiedzi": [
                                "20 Hz–20 kHz w przybliżeniu",
                                "1–5 Hz",
                                "100–1000 kHz"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Głośność dźwięku jest związana przede wszystkim z:",
                            "odpowiedzi": [
                                "Amplitudą drgań",
                                "Długością fali wyłącznie",
                                "Masą źródła"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Efekt Dopplera",
                    "quiz": [
                        {
                            "pytanie": "Gdy źródło dźwięku zbliża się do obserwatora, obserwowana częstotliwość:",
                            "odpowiedzi": [
                                "Rośnie",
                                "Maleje",
                                "Zawsze wynosi 0"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Syrena oddala się od stojącego obserwatora. Ton staje się:",
                            "odpowiedzi": [
                                "Niższy",
                                "Wyższy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Efekt Dopplera wynika z:",
                            "odpowiedzi": [
                                "Ruchu względnego źródła i obserwatora",
                                "Zmiany masy fali",
                                "Zaniku ośrodka"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Natężenie dźwięku",
                    "quiz": [
                        {
                            "pytanie": "Natężenie fali jest mocą przypadającą na:",
                            "odpowiedzi": [
                                "Jednostkę powierzchni",
                                "Jednostkę masy",
                                "Jednostkę czasu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jednostką natężenia dźwięku w SI jest:",
                            "odpowiedzi": [
                                "W/m²",
                                "W",
                                "Hz"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Oddalenie od punktowego źródła powoduje spadek natężenia zgodnie z prawem odwrotności:",
                            "odpowiedzi": [
                                "Kwadratu odległości",
                                "Pierwszej potęgi masy",
                                "Czasu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "fale_elektromagnetyczne": [
                {
                    "temat": "Widmo elektromagnetyczne",
                    "quiz": []
                },
                {
                    "temat": "Polaryzacja światła",
                    "quiz": []
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Drgania i fale",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "optyka": {
        "emoji": "🔭",
        "nazwa": "Optyka",
        "maturalna": true,
        "podnagalowki": {
            "optyka_geometryczna": [
                {
                    "temat": "Prawo odbicia",
                    "quiz": [
                        {
                            "pytanie": "Jaki jest warunek prawa odbicia?",
                            "odpowiedzi": [
                                "Kąt padania = kąt odbicia",
                                "Kąt padania > kąt odbicia",
                                "Kąt padania < kąt odbicia"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Prawo załamania",
                    "quiz": [
                        {
                            "pytanie": "Które równanie poprawnie przedstawia prawo Snelliusa?",
                            "odpowiedzi": [
                                "n₁·sin(θ₁) = n₂·sin(θ₂)",
                                "n₁·θ₁ = n₂·θ₂",
                                "n₁/θ₁ = n₂/θ₂"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Zwierciadła sferyczne",
                    "quiz": [
                        {
                            "pytanie": "Zwierciadło wklęsłe może wytworzyć obraz rzeczywisty, gdy przedmiot znajduje się:",
                            "odpowiedzi": [
                                "W odpowiednim położeniu przed ogniskiem",
                                "Zawsze za zwierciadłem",
                                "Tylko w ognisku"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Ogniskowa zwierciadła sferycznego jest związana z promieniem krzywizny przez:",
                            "odpowiedzi": [
                                "f=R/2",
                                "f=2R",
                                "f=R²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zwierciadło wypukłe tworzy dla rzeczywistego przedmiotu obraz:",
                            "odpowiedzi": [
                                "Pozorny, prosty i pomniejszony",
                                "Rzeczywisty i powiększony",
                                "Zawsze odwrócony i większy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "soczewki_i_przyrzady": [
                {
                    "temat": "Soczewka skupiająca",
                    "quiz": [
                        {
                            "pytanie": "Soczewka skupiająca ma f=20 cm. Jej zdolność skupiająca wynosi:",
                            "odpowiedzi": [
                                "+5 D",
                                "+0,2 D",
                                "-5 D"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Przedmiot ustawiony dalej niż ognisko soczewki skupiającej może dać obraz:",
                            "odpowiedzi": [
                                "Rzeczywisty",
                                "Zawsze pozorny",
                                "Zawsze nieistniejący"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zdolność skupiająca 2 D odpowiada ogniskowej:",
                            "odpowiedzi": [
                                "0,5 m",
                                "2 m",
                                "0,02 m"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Soczewka rozpraszająca",
                    "quiz": [
                        {
                            "pytanie": "Soczewka rozpraszająca dla rzeczywistego przedmiotu daje obraz:",
                            "odpowiedzi": [
                                "Pozorny, prosty i pomniejszony",
                                "Rzeczywisty i powiększony",
                                "Rzeczywisty i odwrócony"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zdolność skupiająca soczewki rozpraszającej ma znak:",
                            "odpowiedzi": [
                                "Ujemny",
                                "Dodatni",
                                "Zawsze zerowy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Promienie równoległe po przejściu przez soczewkę rozpraszającą:",
                            "odpowiedzi": [
                                "Rozchodzą się",
                                "Zawsze skupiają się w ognisku rzeczywistym",
                                "Nie zmieniają kierunku"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Oko i przyrządy optyczne",
                    "quiz": [
                        {
                            "pytanie": "Krótkowzroczność koryguje się najczęściej soczewką:",
                            "odpowiedzi": [
                                "Rozpraszającą",
                                "Skupiającą",
                                "Płaską zawsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dalekowzroczność koryguje się soczewką:",
                            "odpowiedzi": [
                                "Skupiającą",
                                "Rozpraszającą",
                                "Bez mocy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Lupa wykorzystuje soczewkę skupiającą do uzyskania obrazu:",
                            "odpowiedzi": [
                                "Pozornego powiększonego",
                                "Rzeczywistego pomniejszonego",
                                "Zawsze odwróconego"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Soczewki i powiększenie",
                    "quiz": []
                },
                {
                    "temat": "Oko jako układ optyczny",
                    "quiz": []
                }
            ],
            "optyka_falowa": [
                {
                    "temat": "Dyfrakcja",
                    "quiz": [
                        {
                            "pytanie": "Dyfrakcja jest wyraźna, gdy szerokość szczeliny jest:",
                            "odpowiedzi": [
                                "Porównywalna z λ",
                                "Znacznie większa od λ",
                                "Zawsze zerowa"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Wzrost długości fali przy tej samej szczelinie zwykle powoduje dyfrakcję:",
                            "odpowiedzi": [
                                "Silniejszą",
                                "Słabszą",
                                "Niemożliwą"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dyfrakcję można obserwować dla:",
                            "odpowiedzi": [
                                "Światła",
                                "Tylko dźwięku",
                                "Tylko wody"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Optyka",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "elektromagnetyzm": {
        "emoji": "⚡",
        "nazwa": "Elektryczność i magnetyzm",
        "maturalna": true,
        "podnagalowki": {
            "elektrostatyka": [
                {
                    "temat": "Ładunek elektryczny",
                    "quiz": [
                        {
                            "pytanie": "Przez przewodnik płynie 2 A przez 5 s. Jaki ładunek przepłynął?",
                            "odpowiedzi": [
                                "10 C",
                                "0,4 C",
                                "2,5 C"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jaki znak ma ładunek elektronu?",
                            "odpowiedzi": [
                                "Ujemny",
                                "Dodatni",
                                "Zawsze zerowy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która jednostka SI odpowiada ładunkowi elektrycznemu?",
                            "odpowiedzi": [
                                "Kulomb",
                                "Amper",
                                "Wolt"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Pole elektryczne",
                    "quiz": [
                        {
                            "pytanie": "Na ładunek 2 μC działa siła 0,01 N. Natężenie pola wynosi:",
                            "odpowiedzi": [
                                "5000 N/C",
                                "0,00002 N/C",
                                "200 N/C"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Linie pola elektrycznego wychodzą z ładunku dodatniego:",
                            "odpowiedzi": [
                                "Na zewnątrz",
                                "Do środka",
                                "Tylko pionowo"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jednostką natężenia pola elektrycznego może być:",
                            "odpowiedzi": [
                                "N/C",
                                "C/N",
                                "J/s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Prawo Coulomba",
                    "quiz": [
                        {
                            "pytanie": "Jeśli odległość między ładunkami wzrośnie 2 razy, siła Coulomba:",
                            "odpowiedzi": [
                                "Zmaleje 4 razy",
                                "Zmaleje 2 razy",
                                "Wzrośnie 4 razy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dwa ładunki mają wartości 2 μC i 3 μC. Ich iloczyn wynosi:",
                            "odpowiedzi": [
                                "6 μC²",
                                "5 μC",
                                "1,5 μC²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jak oddziałują na siebie ładunki jednoimienne?",
                            "odpowiedzi": [
                                "Odpychają się",
                                "Przyciągają się",
                                "Nie oddziałują"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "prad_i_obwody": [
                {
                    "temat": "Prąd elektryczny",
                    "quiz": [
                        {
                            "pytanie": "Przez przekrój przewodnika przepływa 12 C w 4 s. Natężenie prądu wynosi:",
                            "odpowiedzi": [
                                "3 A",
                                "48 A",
                                "0,33 A"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Amperomierz włącza się do obwodu:",
                            "odpowiedzi": [
                                "Szeregowo",
                                "Równolegle",
                                "Poza obwodem"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Konwencjonalny kierunek prądu w obwodzie zewnętrznym przyjmuje się od:",
                            "odpowiedzi": [
                                "Bieguna dodatniego do ujemnego",
                                "Ujemnego do dodatniego",
                                "Środka baterii"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Napięcie i opór",
                    "quiz": [
                        {
                            "pytanie": "Które równanie poprawnie opisuje zależność między napięciem, natężeniem i oporem?",
                            "odpowiedzi": [
                                "U = I·R",
                                "U = I/R",
                                "U = I+R"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Prawo Ohma",
                    "quiz": [
                        {
                            "pytanie": "Do opornika 12 Ω przyłożono 24 V. Jaki prąd płynie?",
                            "odpowiedzi": [
                                "2 A",
                                "0,5 A",
                                "36 A"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Przy stałym napięciu opór wzrasta 3 razy. Natężenie prądu:",
                            "odpowiedzi": [
                                "Maleje 3 razy",
                                "Rośnie 3 razy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Woltomierz podłącza się:",
                            "odpowiedzi": [
                                "Równolegle",
                                "Szeregowo",
                                "Tylko do źródła"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Moc i energia prądu",
                    "quiz": [
                        {
                            "pytanie": "Urządzenie pracuje przy 230 V i pobiera 2 A. Jaka jest jego moc?",
                            "odpowiedzi": [
                                "460 W",
                                "115 W",
                                "232 W"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Żarówka 100 W działa przez 10 s. Zużyta energia wynosi:",
                            "odpowiedzi": [
                                "1000 J",
                                "100 J",
                                "10 J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Która jednostka SI odpowiada mocy elektrycznej?",
                            "odpowiedzi": [
                                "W",
                                "J",
                                "C"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Łączenie oporników",
                    "quiz": []
                },
                {
                    "temat": "Moc prądu",
                    "quiz": []
                },
                {
                    "temat": "Prawo Kirchhoffa",
                    "quiz": []
                }
            ],
            "magnetyzm_i_indukcja": [
                {
                    "temat": "Pole magnetyczne",
                    "quiz": [
                        {
                            "pytanie": "Przewodnik 0,5 m jest prostopadły do pola 0,4 T i płynie w nim 2 A. Siła magnetyczna wynosi:",
                            "odpowiedzi": [
                                "0,4 N",
                                "4 N",
                                "0,1 N"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jednostką indukcji magnetycznej jest:",
                            "odpowiedzi": [
                                "tesla",
                                "weber na metr?",
                                "kulomb"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jak oddziałują na siebie bieguny magnetyczne jednoimienne?",
                            "odpowiedzi": [
                                "Odpychają się",
                                "Przyciągają się",
                                "Nie oddziałują"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Siła Lorentza",
                    "quiz": [
                        {
                            "pytanie": "Naładowana cząstka porusza się prostopadle do pola. Po podwojeniu prędkości siła Lorentza:",
                            "odpowiedzi": [
                                "Rośnie 2 razy",
                                "Maleje 2 razy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jaką siłę magnetyczną odczuwa nieruchomy ładunek w polu magnetycznym?",
                            "odpowiedzi": [
                                "0",
                                "qB",
                                "Zawsze 1 N"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Co dzieje się z siłą magnetyczną, gdy prędkość cząstki jest równoległa do pola?",
                            "odpowiedzi": [
                                "Wynosi 0",
                                "Jest maksymalna",
                                "Zależy tylko od masy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Indukcja elektromagnetyczna",
                    "quiz": [
                        {
                            "pytanie": "Zmiana strumienia magnetycznego przez obwód może wywołać:",
                            "odpowiedzi": [
                                "Siłę elektromotoryczną",
                                "Zmianę masy przewodnika",
                                "Zanik ładunku"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Szybsza zmiana strumienia oznacza zwykle wartość SEM:",
                            "odpowiedzi": [
                                "Większą",
                                "Mniejszą",
                                "Zawsze zerową"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zjawisko indukcji elektromagnetycznej wykorzystuje:",
                            "odpowiedzi": [
                                "Generator",
                                "Termometr rtęciowy",
                                "Barometr"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Elektryczność i magnetyzm",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "mechanika_kwantowa_jadrowa": {
        "emoji": "⚛️",
        "nazwa": "Fizyka atomowa i jądrowa",
        "maturalna": true,
        "podnagalowki": {
            "podstawy_fizyki_atomowej": [
                {
                    "temat": "Zasada nieoznaczoności",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej opisuje fizyczne znaczenie zasady nieoznaczoności?",
                            "odpowiedzi": [
                                "Nie można jednocześnie dokładnie znać pęd i położenie",
                                "Energia jest zawsze nieokreślona",
                                "Czas zawsze się zmienia"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Funkcja falowa",
                    "quiz": [
                        {
                            "pytanie": "Jak należy interpretować |ψ|² w mechanice kwantowej?",
                            "odpowiedzi": [
                                "Gęstość prawdopodobieństwa",
                                "Energię cząstki",
                                "Pęd cząstki"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Energia kwantu",
                    "quiz": [
                        {
                            "pytanie": "Foton ma częstotliwość 5×10¹⁴ Hz. Korzystając z E=hf, jego energia jest rzędu:",
                            "odpowiedzi": [
                                "3,3×10⁻¹⁹ J",
                                "3,3×10⁻⁵ J",
                                "1,0×10⁻³⁴ J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli częstotliwość fotonu wzrośnie 2 razy, jego energia:",
                            "odpowiedzi": [
                                "Wzrośnie 2 razy",
                                "Zmaleje 2 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Stała Plancka ma jednostkę:",
                            "odpowiedzi": [
                                "J·s",
                                "J/s",
                                "C·s"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Efekt fotoelektryczny",
                    "quiz": [
                        {
                            "pytanie": "Aby zaszedł efekt fotoelektryczny, energia fotonu musi być:",
                            "odpowiedzi": [
                                "Co najmniej równa pracy wyjścia",
                                "Zawsze równa 0",
                                "Mniejsza od pracy wyjścia"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zwiększenie częstotliwości światła powyżej progu zwiększa maksymalną energię:",
                            "odpowiedzi": [
                                "Elektronów fotoelektrycznych",
                                "Jąder atomowych zawsze",
                                "Fotonów do zera"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zwiększenie natężenia światła przy częstotliwości powyżej progu zwiększa przede wszystkim:",
                            "odpowiedzi": [
                                "Liczbę wybitych elektronów",
                                "Ich maksymalną energię liniowo zawsze",
                                "Pracę wyjścia metalu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "fizyka_jadrowa": [
                {
                    "temat": "Budowa jądra",
                    "quiz": [
                        {
                            "pytanie": "Jądro zawiera 6 protonów i 8 neutronów. Liczba masowa wynosi:",
                            "odpowiedzi": [
                                "14",
                                "8",
                                "6"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Izotopy tego samego pierwiastka mają taką samą liczbę:",
                            "odpowiedzi": [
                                "Protonów",
                                "Neutronów",
                                "Nukleonów zawsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Liczba atomowa określa liczbę:",
                            "odpowiedzi": [
                                "Protonów",
                                "Neutronów",
                                "Wszystkich nukleonów"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Radioaktywność",
                    "quiz": [
                        {
                            "pytanie": "Rozpad alfa to emisja:",
                            "odpowiedzi": [
                                "Jądra helu (He-4)",
                                "Elektronu",
                                "Fot"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Rozpady promieniotwórcze",
                    "quiz": [
                        {
                            "pytanie": "W rozpadzie alfa liczba masowa zmniejsza się o:",
                            "odpowiedzi": [
                                "4",
                                "2",
                                "1"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "W rozpadzie β⁻ neutron zamienia się w proton, więc liczba atomowa:",
                            "odpowiedzi": [
                                "Rośnie o 1",
                                "Maleje o 1",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "W rozpadzie gamma jądro emituje:",
                            "odpowiedzi": [
                                "Foton promieniowania elektromagnetycznego",
                                "Elektron zawsze",
                                "Helowe jądro"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Okres półtrwania",
                    "quiz": [
                        {
                            "pytanie": "Po jednym okresie półtrwania pozostaje:",
                            "odpowiedzi": [
                                "50% jąder początkowych",
                                "25%",
                                "75%"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Po dwóch okresach półtrwania pozostaje:",
                            "odpowiedzi": [
                                "25%",
                                "50%",
                                "12,5%"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Okres półtrwania próbki wynosi 8 dni. Po 24 dniach pozostanie:",
                            "odpowiedzi": [
                                "1/8 początkowej ilości",
                                "1/3",
                                "1/24"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Energia wiązania",
                    "quiz": [
                        {
                            "pytanie": "Energia wiązania jądra odpowiada między innymi za jego:",
                            "odpowiedzi": [
                                "Stabilność względem rozdzielenia nukleonów",
                                "Temperaturę topnienia",
                                "Kolor"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Defekt masy jest związany z:",
                            "odpowiedzi": [
                                "Energią wiązania",
                                "Wyłącznie liczbą elektronów",
                                "Ciśnieniem atmosferycznym"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zależność masy i energii opisuje:",
                            "odpowiedzi": [
                                "E=mc²",
                                "p=mv²",
                                "F=ma²"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Rozszczepienie i synteza",
                    "quiz": [
                        {
                            "pytanie": "Rozszczepienie ciężkiego jądra może uwolnić:",
                            "odpowiedzi": [
                                "Dużą ilość energii",
                                "Tylko światło widzialne",
                                "Wyłącznie energię chemiczną"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Synteza jądrowa zachodzi w Słońcu głównie poprzez łączenie jąder:",
                            "odpowiedzi": [
                                "Wodoru",
                                "Żelaza",
                                "Ołowiu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Reakcja łańcuchowa w reaktorze wymaga kontroli liczby:",
                            "odpowiedzi": [
                                "Neutronów wywołujących kolejne rozszczepienia",
                                "Elektronów walencyjnych",
                                "Fotonów widzialnych"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Promieniowanie",
                    "quiz": [
                        {
                            "pytanie": "Promieniowanie jonizujące może powodować:",
                            "odpowiedzi": [
                                "Jonizację materii",
                                "Zawsze ochłodzenie materii",
                                "Zanik grawitacji"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Które promieniowanie ma największą zdolność przenikania z typowej trójki α, β, γ?",
                            "odpowiedzi": [
                                "γ",
                                "β",
                                "α"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Do ochrony przed promieniowaniem gamma stosuje się między innymi:",
                            "odpowiedzi": [
                                "Grube warstwy materiałów o dużej gęstości",
                                "Cienki papier",
                                "Próżnię"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Fizyka atomowa i jądrowa",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "teoria_wzglednosci": {
        "emoji": "🕒",
        "nazwa": "Teoria względności — rozszerzenie",
        "maturalna": false,
        "podnagalowki": {
            "szczegolna": [
                {
                    "temat": "Względność szczególna",
                    "quiz": [
                        {
                            "pytanie": "Jaki jest słynny wzór Einsteina?",
                            "odpowiedzi": [
                                "E = mc²",
                                "E = ½mv²",
                                "E = U·q"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Dylatacja czasu",
                    "quiz": [
                        {
                            "pytanie": "Dla obserwatora na Ziemi zegar poruszającego się szybko statku wskazuje upływ czasu:",
                            "odpowiedzi": [
                                "Wolniejszy",
                                "Szybszy",
                                "Zawsze taki sam niezależnie od prędkości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Efekt dylatacji czasu staje się istotny przy prędkościach:",
                            "odpowiedzi": [
                                "Bliskich prędkości światła",
                                "Rzędu 1 m/s",
                                "Tylko zerowych"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "W jakim układzie odniesienia mierzy się czas własny zdarzenia?",
                            "odpowiedzi": [
                                "W układzie, w którym mierzone zdarzenia zachodzą w tym samym miejscu",
                                "Zawsze na Ziemi",
                                "Zawsze w laboratorium"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Kontrakcja długości",
                    "quiz": [
                        {
                            "pytanie": "Przedmiot poruszający się względem obserwatora z dużą prędkością jest wzdłuż kierunku ruchu mierzony jako:",
                            "odpowiedzi": [
                                "Krótszy",
                                "Dłuższy",
                                "Zawsze tej samej długości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Kontrakcja długości dotyczy kierunku:",
                            "odpowiedzi": [
                                "Równoległego do ruchu",
                                "Prostopadłego do ruchu wyłącznie",
                                "Wszystkich kierunków identycznie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dla prędkości znacznie mniejszej od c efekty relatywistyczne są:",
                            "odpowiedzi": [
                                "Bardzo małe",
                                "Maksymalne",
                                "Nieskończone"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Energia spoczynkowa",
                    "quiz": [
                        {
                            "pytanie": "Masa spoczynkowa 2 kg ma energię E₀=mc² równą około:",
                            "odpowiedzi": [
                                "1,8×10¹⁷ J",
                                "6×10⁸ J",
                                "9×10¹⁶ J"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jeśli masa spoczynkowa wzrośnie 3 razy, energia spoczynkowa:",
                            "odpowiedzi": [
                                "Wzrośnie 3 razy",
                                "Wzrośnie 9 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Równanie E=mc² pokazuje równoważność:",
                            "odpowiedzi": [
                                "Masy i energii",
                                "Masy i czasu",
                                "Siły i temperatury"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "ogolna": [
                {
                    "temat": "Czarna dziura",
                    "quiz": [
                        {
                            "pytanie": "Czarna dziura ma horyzont zdarzeń, za którym:",
                            "odpowiedzi": [
                                "Nic nie może uciec",
                                "Wszystko jest widoczne",
                                "Czas staje się jawnością"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Grawitacja i czasoprzestrzeń",
                    "quiz": [
                        {
                            "pytanie": "Według ogólnej teorii względności grawitacja jest związana z:",
                            "odpowiedzi": [
                                "Krzywizną czasoprzestrzeni",
                                "Tylko siłą tarcia",
                                "Ładunkiem elektrycznym"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Zegar bliżej silnego pola grawitacyjnego względem odległego obserwatora tyka:",
                            "odpowiedzi": [
                                "Wolniej",
                                "Szybciej",
                                "Tak samo zawsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Soczewkowanie grawitacyjne polega na:",
                            "odpowiedzi": [
                                "Uginaniu toru światła przez grawitację",
                                "Zwiększaniu masy fotonu",
                                "Zatrzymaniu światła w każdym polu"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Fale grawitacyjne",
                    "quiz": [
                        {
                            "pytanie": "Fale grawitacyjne są zmianami:",
                            "odpowiedzi": [
                                "Geometrii czasoprzestrzeni",
                                "Temperatury próżni",
                                "Ładunku fotonów"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Fale grawitacyjne mogą powstawać podczas zderzeń:",
                            "odpowiedzi": [
                                "Czarnych dziur",
                                "Kropli wody",
                                "Samochodów"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Detektory fal grawitacyjnych mierzą niezwykle małe zmiany:",
                            "odpowiedzi": [
                                "Długości ramion interferometru",
                                "Masy Ziemi",
                                "Temperatury lustra"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Teoria względności",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    },
    "fizyka_materialow": {
        "emoji": "🧱",
        "nazwa": "Własności materiałów",
        "maturalna": true,
        "podnagalowki": {
            "struktura_materii": [
                {
                    "temat": "Struktury krystaliczne",
                    "quiz": [
                        {
                            "pytanie": "Kryształ charakteryzuje się:",
                            "odpowiedzi": [
                                "Uporządkowaniem dalekiego zasięgu",
                                "Całkowitym brakiem atomów",
                                "Zawsze ciekłym stanem"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Jak nazywa się najmniejszy powtarzalny fragment sieci krystalicznej?",
                            "odpowiedzi": [
                                "Komórka elementarna",
                                "Jądro",
                                "Granica fazy"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Monokryształ ma uporządkowanie krystaliczne:",
                            "odpowiedzi": [
                                "Rozciągające się przez całą próbkę",
                                "Tylko na powierzchni",
                                "Tylko w jednym atomie"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Sieci przestrzenne",
                    "quiz": [
                        {
                            "pytanie": "Najprostsza sieć to:",
                            "odpowiedzi": [
                                "Sieć kubiczna",
                                "Sieć heksagonalna",
                                "Sieć ortorombowa"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Defekty kryształów",
                    "quiz": [
                        {
                            "pytanie": "Jak nazywa się defekt polegający na braku atomu w prawidłowym miejscu sieci?",
                            "odpowiedzi": [
                                "Wakancją",
                                "Dyslokacją śrubową",
                                "Fazą ciekłą"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Dyslokacja jest przykładem defektu:",
                            "odpowiedzi": [
                                "Liniowego",
                                "Punktowego zawsze",
                                "Powierzchniowego zawsze"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Wzrost temperatury zwykle zwiększa liczbę drgań atomów w sieci:",
                            "odpowiedzi": [
                                "Tak",
                                "Nie",
                                "Tylko w próżni"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Materiały amorficzne",
                    "quiz": [
                        {
                            "pytanie": "Szkło jest typowym przykładem materiału:",
                            "odpowiedzi": [
                                "Amorficznego",
                                "Monokrystalicznego",
                                "Gazowego"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Materiały amorficzne nie mają uporządkowania:",
                            "odpowiedzi": [
                                "Dalekiego zasięgu",
                                "Żadnego na poziomie atomowym",
                                "Nigdy lokalnego"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Polimer może być:",
                            "odpowiedzi": [
                                "Materiałem o bardzo długich łańcuchach cząsteczek",
                                "Wyłącznie metalem",
                                "Zawsze kryształem idealnym"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "wlasciwosci_materialow": [
                {
                    "temat": "Twardość i wytrzymałość",
                    "quiz": [
                        {
                            "pytanie": "Twardość materiału zależy od:",
                            "odpowiedzi": [
                                "Wiązań chemicznych",
                                "Tylko masy",
                                "Tylko objętości"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Przewodnictwo elektryczne",
                    "quiz": [
                        {
                            "pytanie": "Przewodniki elektryczne zawierają:",
                            "odpowiedzi": [
                                "Swobodne elektrony",
                                "Brak elektronów",
                                "Tylko jądra"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                },
                {
                    "temat": "Sprężystość i plastyczność",
                    "quiz": [
                        {
                            "pytanie": "Odkształcenie sprężyste po usunięciu siły:",
                            "odpowiedzi": [
                                "Może zaniknąć",
                                "Zawsze pozostaje",
                                "Zwiększa masę"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Odkształcenie plastyczne jest:",
                            "odpowiedzi": [
                                "Trwałe",
                                "Zawsze odwracalne",
                                "Niemożliwe w metalach"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
},
                        {
                            "pytanie": "Prawo Hooke'a w zakresie sprężystym wiąże naprężenie z:",
                            "odpowiedzi": [
                                "Odkształceniem",
                                "Temperaturą wrzenia",
                                "Ładunkiem"
                            ],
                            "prawidlowa": 0,
                            "poziom": 1,
    "wyjasnienie": "",
}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Fizyka materiałów",
                    "typ": "maturalne",
                    "quiz": []}
            ]
        }
    }
};

const zadaniaTematyczne = {
    "Wykresy ruchu": [
        { pytanie: "Na wykresie s(t) odcinek poziomy oznacza, że ciało...", odpowiedzi: ["Spoczywa", "Porusza się najszybciej", "Ma największe przyspieszenie"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Pole pod wykresem v(t) przedstawia...", odpowiedzi: ["Przemieszczenie", "Przyspieszenie", "Masę"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Nachylenie wykresu v(t) informuje o...", odpowiedzi: ["Przyspieszeniu", "Drodze całkowitej", "Czasie trwania"], prawidlowa: 0, poziom: 2 },
        { pytanie: "Prędkość zmienia się liniowo od 4 do 16 m/s w 6 s. Jakie jest przyspieszenie?", odpowiedzi: ["2 m/s²", "12 m/s²", "20 m/s²"], prawidlowa: 0, wzor: "a = Δv / Δt = (16 - 4) / 6", poziom: 2 },
        { pytanie: "Jeśli wykres v(t) przebiega poniżej osi czasu, przemieszczenie w tym przedziale jest...", odpowiedzi: ["Ujemne", "Zawsze równe zero", "Dodatnie niezależnie od wykresu"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Dwa pola pod wykresem v(t) mają przeciwne znaki i tę samą wartość. Co wynika dla przemieszczenia?", odpowiedzi: ["Wypadkowe przemieszczenie wynosi zero", "Droga wynosi zero", "Ciało nie miało prędkości"], prawidlowa: 0, poziom: 3 }
    ],
    "Ruch względny": [
        { pytanie: "Pasażer siedzący w jadącym pociągu jest w spoczynku względem...", odpowiedzi: ["Pociągu", "Drzewa przy torach", "Księżyca zawsze"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Samochód A jedzie 20 m/s, a B w tym samym kierunku 12 m/s. Prędkość A względem B wynosi...", odpowiedzi: ["8 m/s", "32 m/s", "12 m/s"], prawidlowa: 0, wzor: "v wzgl = vA - vB", poziom: 2 },
        { pytanie: "Dwa auta jadą naprzeciw siebie z 15 m/s i 10 m/s. Ich prędkość zbliżania wynosi...", odpowiedzi: ["25 m/s", "5 m/s", "150 m/s"], prawidlowa: 0, wzor: "v zbliżania = v₁ + v₂", poziom: 2 },
        { pytanie: "Czy ruch może być jednocześnie jednostajny dla jednego obserwatora i zmienny dla innego?", odpowiedzi: ["Tak, zależy od układu odniesienia", "Nie, ruch ma zawsze jedną postać", "Tylko w próżni"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Łódź płynie 4 m/s względem wody, a nurt ma 1 m/s zgodnie z jej ruchem. Prędkość względem brzegu to...", odpowiedzi: ["5 m/s", "3 m/s", "4 m/s"], prawidlowa: 0, wzor: "v brzeg = v łodzi + v nurtu", poziom: 2 },
        { pytanie: "Prędkość względna zależy przede wszystkim od...", odpowiedzi: ["Wybranego układu odniesienia", "Koloru poruszającego się ciała", "Jego temperatury zawsze"], prawidlowa: 0, poziom: 1 }
    ],
    "Droga, prędkość i czas": [
        { pytanie: "Jaki wzór pozwala obliczyć drogę w ruchu jednostajnym?", odpowiedzi: ["s = vt", "s = v/t", "s = t/v"], prawidlowa: 0, wzor: "s = v · t", poziom: 1 },
        { pytanie: "Pieszy idzie 1,5 m/s przez 4 minuty. Jaką drogę przejdzie?", odpowiedzi: ["360 m", "6 m", "90 m"], prawidlowa: 0, wzor: "s = 1,5 · 240", poziom: 2 },
        { pytanie: "Samochód pokonał 180 km w 2,5 h. Jaka była średnia prędkość?", odpowiedzi: ["72 km/h", "450 km/h", "45 km/h"], prawidlowa: 0, wzor: "vśr = s/t = 180/2,5", poziom: 2 },
        { pytanie: "Jeśli czas przejazdu skróci się o połowę przy tej samej drodze, średnia prędkość...", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się"], prawidlowa: 0, wzor: "v = s/t", poziom: 3 },
        { pytanie: "Dlaczego jednostkę km/h często zamieniamy na m/s przed obliczeniami?", odpowiedzi: ["Aby wielkości były w zgodnych jednostkach SI", "Bo km/h nie opisuje prędkości", "Aby zwiększyć wynik"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Dwa odcinki pokonano z różnymi prędkościami. Czy średnia prędkość zawsze jest średnią arytmetyczną prędkości?", odpowiedzi: ["Nie, trzeba uwzględnić całkowitą drogę i czas", "Tak, zawsze", "Tylko gdy czasy są różne"], prawidlowa: 0, wzor: "vśr = scałkowita / tcałkowity", poziom: 3 }
    ],
    "Opóźnienie i hamowanie": [
        { pytanie: "Opóźnienie jest przyspieszeniem skierowanym przeciwnie do...", odpowiedzi: ["Prędkości", "Masy", "Czasu"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Auto jedzie 20 m/s i hamuje z a = -4 m/s². Po ilu sekundach się zatrzyma?", odpowiedzi: ["5 s", "80 s", "0,2 s"], prawidlowa: 0, wzor: "t = (v - v₀) / a = (0 - 20) / -4", poziom: 2 },
        { pytanie: "Droga hamowania rośnie z kwadratem prędkości. Dwukrotny wzrost prędkości oznacza drogę...", odpowiedzi: ["Cztery razy większą", "Dwa razy większą", "Taką samą"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Czas reakcji kierowcy wpływa na drogę hamowania?", odpowiedzi: ["Wpływa na drogę przebytą przed rozpoczęciem hamowania", "Nie ma żadnego wpływu", "Zmienia masę auta"], prawidlowa: 0, poziom: 2 },
        { pytanie: "Przyspieszenie równe zero oznacza, że ciało...", odpowiedzi: ["Ma stałą prędkość wektorową", "Zawsze stoi", "Zawsze hamuje"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Dlaczego mokra nawierzchnia wydłuża drogę hamowania?", odpowiedzi: ["Zmniejsza tarcie i maksymalną siłę hamującą", "Zwiększa przyspieszenie grawitacyjne", "Zmniejsza czas reakcji"], prawidlowa: 0, poziom: 3 }
    ],
    "Ruch jednostajny prostoliniowy": [
        { pytanie: "Rowerzysta jedzie ze stałą prędkością 6 m/s przez 45 s. Jaką drogę pokona?", odpowiedzi: ["270 m", "51 m", "7,5 m"], prawidlowa: 0, wzor: "s = v · t = 6 · 45" },
        { pytanie: "Samochód pokonał 1,2 km w 60 s. Jaka była jego średnia prędkość?", odpowiedzi: ["20 m/s", "72 m/s", "0,02 m/s"], prawidlowa: 0, wzor: "v = s / t = 1200 / 60" },
        { pytanie: "Dwa pojazdy jadą naprzeciw siebie z prędkościami 12 m/s i 8 m/s. Ich odległość wynosi 400 m. Po ilu sekundach się spotkają?", odpowiedzi: ["20 s", "50 s", "80 s"], prawidlowa: 0, wzor: "t = s / (v₁ + v₂) = 400 / 20" },
        { pytanie: "Na wykresie s(t) prosta ma nachylenie 4 m/s. Co oznacza ta wartość?", odpowiedzi: ["Prędkość wynosi 4 m/s", "Droga wynosi 4 m", "Czas wynosi 4 s"], prawidlowa: 0, wzor: "v = Δs / Δt" },
        { pytanie: "Pociąg jedzie 90 km/h przez 8 minut. Jaką drogę przejedzie?", odpowiedzi: ["12 km", "720 km", "1,5 km"], prawidlowa: 0, wzor: "s = v · t = 25 · 480" },
        { pytanie: "Który wykres v(t) opisuje ruch jednostajny?", odpowiedzi: ["Linia pozioma", "Linia rosnąca", "Krzywa malejąca"], prawidlowa: 0, wzor: "v = const" }
    ],
    "Ruch jednostajnie przyspieszony": [
        { pytanie: "Ciało rusza z v₀ = 2 m/s i ma a = 3 m/s². Jaką prędkość osiągnie po 4 s?", odpowiedzi: ["14 m/s", "12 m/s", "5 m/s"], prawidlowa: 0, wzor: "v = v₀ + a · t = 2 + 3 · 4" },
        { pytanie: "Samochód zwiększa prędkość z 10 do 25 m/s w 5 s. Oblicz przyspieszenie.", odpowiedzi: ["3 m/s²", "7 m/s²", "75 m/s²"], prawidlowa: 0, wzor: "a = (v - v₀) / t = 15 / 5" },
        { pytanie: "Ciało rusza z miejsca z a = 2 m/s². Jaką drogę pokona w 6 s?", odpowiedzi: ["36 m", "12 m", "72 m"], prawidlowa: 0, wzor: "s = ½ · a · t² = ½ · 2 · 6²" },
        { pytanie: "Jeśli przyspieszenie ma wartość ujemną, a ciało porusza się zgodnie z osią, to ciało...", odpowiedzi: ["Zmniejsza prędkość", "Zawsze zmienia kierunek", "Ma stałą prędkość"], prawidlowa: 0, wzor: "a < 0 ⇒ v maleje" },
        { pytanie: "Prędkość wzrosła o 18 m/s w czasie 3 s. Jakie było przyspieszenie?", odpowiedzi: ["6 m/s²", "54 m/s²", "0,17 m/s²"], prawidlowa: 0, wzor: "a = Δv / Δt = 18 / 3" },
        { pytanie: "Pole pod wykresem v(t) oznacza...", odpowiedzi: ["Przebytą drogę", "Przyspieszenie", "Moc"], prawidlowa: 0, wzor: "s = pole pod wykresem v(t)" }
    ],
    "Zasady Newtona": [
        { pytanie: "Na ciało o masie 4 kg działa wypadkowa siła 12 N. Oblicz przyspieszenie.", odpowiedzi: ["3 m/s²", "48 m/s²", "0,33 m/s²"], prawidlowa: 0, wzor: "a = F / m = 12 / 4" },
        { pytanie: "Na skrzynię działają siły 30 N w prawo i 18 N w lewo. Jaka jest siła wypadkowa?", odpowiedzi: ["12 N w prawo", "48 N w prawo", "12 N w lewo"], prawidlowa: 0, wzor: "Fᵥ = 30 - 18" },
        { pytanie: "Dlaczego pasażer pochyla się do przodu podczas nagłego hamowania autobusu?", odpowiedzi: ["Jego ciało zachowuje dotychczasowy ruch", "Działa na niego większa grawitacja", "Masa pasażera znika"], prawidlowa: 0, wzor: "I zasada Newtona: bezwładność" },
        { pytanie: "Jaką siłę trzeba przyłożyć do masy 8 kg, aby nadać jej a = 2,5 m/s²?", odpowiedzi: ["20 N", "10,5 N", "3,2 N"], prawidlowa: 0, wzor: "F = m · a = 8 · 2,5" },
        { pytanie: "Para sił akcji i reakcji ma...", odpowiedzi: ["Równe wartości i przeciwne zwroty, ale działa na różne ciała", "Zawsze ten sam zwrot", "Różne wartości na tym samym ciele"], prawidlowa: 0, wzor: "F₁₂ = -F₂₁" },
        { pytanie: "Jeśli siła wypadkowa działająca na ciało wynosi zero, ciało może...", odpowiedzi: ["Spoczywać albo poruszać się ruchem jednostajnym", "Tylko przyspieszać", "Zawsze natychmiast się zatrzymać"], prawidlowa: 0, wzor: "Fᵥ = 0 ⇒ a = 0" }
    ],
    "Prędkość kątowa": [
        { pytanie: "Koło wykonuje 5 pełnych obrotów w 10 s. Jaka jest jego prędkość kątowa?", odpowiedzi: ["π rad/s", "0,5 rad/s", "10π rad/s"], prawidlowa: 0, wzor: "ω = Δφ / Δt = 5 · 2π / 10" },
        { pytanie: "Wentylator obraca się z ω = 20 rad/s. Ile obrotów wykona w czasie π s?", odpowiedzi: ["10 obrotów", "20π obrotów", "π/10 obrotu"], prawidlowa: 0, wzor: "N = ωt / 2π = 20π / 2π" },
        { pytanie: "Ciało wykonuje 120 obrotów na minutę. Jaka jest jego częstotliwość?", odpowiedzi: ["2 Hz", "120 Hz", "0,5 Hz"], prawidlowa: 0, wzor: "f = 120 / 60" },
        { pytanie: "Jaki jest związek okresu T z prędkością kątową ω?", odpowiedzi: ["T = 2π / ω", "T = ω / 2π", "T = 2πω"], prawidlowa: 0, wzor: "ω = 2π / T" },
        { pytanie: "Jeśli promień koła pozostaje stały, a ω wzrasta dwukrotnie, prędkość liniowa...", odpowiedzi: ["Wzrasta dwukrotnie", "Maleje dwukrotnie", "Nie zmienia się"], prawidlowa: 0, wzor: "v = ωr" },
        { pytanie: "Prędkość kątowa jest wektorem. Jej kierunek wyznacza się regułą...", odpowiedzi: ["Prawej dłoni", "Lewej ręki dla każdego ruchu", "Trzech palców bez osi obrotu"], prawidlowa: 0, wzor: "Kierunek ω: reguła prawej dłoni" }
    ],
    "Ruch po okręgu": [
        { pytanie: "Punkt porusza się po okręgu o promieniu 0,5 m z ω = 4 rad/s. Oblicz prędkość liniową.", odpowiedzi: ["2 m/s", "8 m/s", "0,125 m/s"], prawidlowa: 0, wzor: "v = ωr = 4 · 0,5" },
        { pytanie: "Koło ma promień 2 m i wykonuje jeden obrót w 4 s. Jaka jest jego prędkość liniowa na obwodzie?", odpowiedzi: ["π m/s", "2π m/s", "π/2 m/s"], prawidlowa: 0, wzor: "v = 2πr / T = 4π / 4" },
        { pytanie: "Punkt porusza się po okręgu. Która wielkość zmienia się cały czas, nawet gdy szybkość jest stała?", odpowiedzi: ["Wektor prędkości", "Masa", "Promień, jeśli tor jest stały"], prawidlowa: 0, wzor: "Zmienia się kierunek wektora v" },
        { pytanie: "Dwa punkty mają tę samą ω, ale drugi jest dwa razy dalej od osi. Jego szybkość liniowa jest...", odpowiedzi: ["Dwa razy większa", "Taka sama", "Cztery razy większa"], prawidlowa: 0, wzor: "v = ωr" },
        { pytanie: "Okres ruchu wynosi 0,25 s. Jaka jest częstotliwość?", odpowiedzi: ["4 Hz", "0,25 Hz", "π/4 Hz"], prawidlowa: 0, wzor: "f = 1 / T = 1 / 0,25" },
        { pytanie: "Przy ruchu po okręgu przyspieszenie dośrodkowe jest skierowane...", odpowiedzi: ["Do środka okręgu", "Stycznie do toru", "Na zewnątrz okręgu"], prawidlowa: 0, wzor: "a_d = v²/r" }
    ],
    "Przyspieszenie dośrodkowe": [
        { pytanie: "Dla v = 6 m/s i r = 3 m przyspieszenie dośrodkowe wynosi:", odpowiedzi: ["12 m/s²", "2 m/s²", "18 m/s²"], prawidlowa: 0, wzor: "a_d = v²/r = 36/3" },
        { pytanie: "Samochód jedzie dwa razy szybciej po tym samym łuku. Przyspieszenie dośrodkowe jest...", odpowiedzi: ["Cztery razy większe", "Dwa razy większe", "Dwa razy mniejsze"], prawidlowa: 0, wzor: "a_d = v²/r" },
        { pytanie: "Przy stałej prędkości liniowej zwiększono promień toru dwukrotnie. Co dzieje się z a_d?", odpowiedzi: ["Maleje dwukrotnie", "Rośnie dwukrotnie", "Nie zmienia się"], prawidlowa: 0, wzor: "a_d = v²/r" },
        { pytanie: "Siła dośrodkowa dla m = 2 kg i a_d = 5 m/s² wynosi:", odpowiedzi: ["10 N", "2,5 N", "7 N"], prawidlowa: 0, wzor: "F_d = ma_d = 2 · 5" },
        { pytanie: "Czy siła dośrodkowa jest nowym rodzajem siły?", odpowiedzi: ["Nie, to nazwa siły skierowanej do środka toru", "Tak, działa tylko w kosmosie", "Tak, zawsze jest równa ciężarowi"], prawidlowa: 0, wzor: "F_d = mv²/r" },
        { pytanie: "Jeśli wypadkowa siła dośrodkowa zniknie, ciało poleci...", odpowiedzi: ["Po stycznej do toru", "Promieniście do środka", "Natychmiast pionowo w górę"], prawidlowa: 0, wzor: "Bez siły ciało zachowuje chwilowy kierunek v" }
    ],
    "Moment pędu": [
        { pytanie: "Punkt materialny ma pęd 4 kg·m/s i ramię 0,5 m prostopadłe do pędu. Jaki ma moment pędu?", odpowiedzi: ["2 kg·m²/s", "8 kg·m²/s", "4,5 kg·m²/s"], prawidlowa: 0, wzor: "L = r · p · sin(90°) = 0,5 · 4" },
        { pytanie: "Jeśli ramię siły wzrośnie trzykrotnie, a pęd pozostanie stały, moment pędu...", odpowiedzi: ["Wzrośnie trzykrotnie", "Zmniejszy się trzykrotnie", "Nie zmieni się"], prawidlowa: 0, wzor: "L = r × p" },
        { pytanie: "Moment pędu punktu jest równy zero, gdy pęd jest...", odpowiedzi: ["Równoległy do wektora r", "Prostopadły do r", "Zawsze większy od zera"], prawidlowa: 0, wzor: "L = rp sin(θ); sin(0°) = 0" },
        { pytanie: "Jednostką momentu pędu w SI jest:", odpowiedzi: ["kg·m²/s", "N·m", "kg·m/s²"], prawidlowa: 0, wzor: "[L] = [r][p] = m · kg·m/s" },
        { pytanie: "Jeśli na układ nie działa zewnętrzny moment siły, to jego moment pędu...", odpowiedzi: ["Jest zachowany", "Zawsze rośnie", "Zawsze spada do zera"], prawidlowa: 0, wzor: "τ_zewn = 0 ⇒ L = const" },
        { pytanie: "Łyżwiarz przyciąga ręce do ciała i zwiększa prędkość obrotową, ponieważ...", odpowiedzi: ["Zmniejsza moment bezwładności przy zachowaniu L", "Zwiększa masę", "Usuwa grawitację"], prawidlowa: 0, wzor: "L = Iω = const" }
    ]
};

const pytaniaDlaTematu = {
    "Prawo odbicia": [
        { pytanie: "Promień pada na płaskie lustro pod kątem 35° do normalnej. Pod jakim kątem odbije się od lustra?", odpowiedzi: ["35° względem normalnej", "55° względem normalnej", "70° względem normalnej"], prawidlowa: 0, wzor: "θᵢ = θᵣ. Oba kąty mierz od normalnej do powierzchni.", wskazowka: "Najpierw sprawdź, względem czego podano kąt. W prawie odbicia porównujesz kąt padania z kątem odbicia, oba liczone od normalnej." },
        { pytanie: "Promień pada na lustro pod kątem 20° do jego powierzchni. Jaki kąt odbicia należy przyjąć w obliczeniach?", odpowiedzi: ["70°", "20°", "40°"], prawidlowa: 0, wzor: "θ = 90° − α, a następnie θᵢ = θᵣ", wskazowka: "Kąt podany względem powierzchni i kąt względem normalnej są dopełniające do 90°. Dopiero po zamianie użyj prawa odbicia." },
        { pytanie: "Na lustrze ustawiono normalną w punkcie padania. Co zmieni się w promieniu odbitym, gdy zwiększymy kąt padania?", odpowiedzi: ["Kąt odbicia zwiększy się o taką samą wartość", "Kąt odbicia zmniejszy się o taką samą wartość", "Promień odbity pozostanie w tym samym kierunku"], prawidlowa: 0, wzor: "θᵣ = θᵢ", wskazowka: "Nie zmieniaj położenia normalnej. Z prawa odbicia wynika bezpośrednio, jak zmiana kąta padania wpływa na kąt odbicia." },
        { pytanie: "Uczeń narysował kąt padania między promieniem a powierzchnią lustra i porównał go z kątem odbicia mierzonym od normalnej. Gdzie popełnił błąd?", odpowiedzi: ["Porównał kąty mierzone względem różnych linii", "Pominął współczynnik załamania", "Powinien mierzyć kąty od powierzchni w obu przypadkach"], prawidlowa: 0, wzor: "Prawo odbicia porównuje kąty względem normalnej", wskazowka: "Zaznacz normalną i sprawdź, od której linii mierzono każdy kąt. W prawie odbicia definicja kąta jest kluczowa." },
        { pytanie: "Lustro obracamy o 10°, nie zmieniając kierunku padającego promienia. O ile może obrócić się kierunek promienia odbitego?", odpowiedzi: ["O 20°", "O 10°", "O 5°"], prawidlowa: 0, wzor: "Zmiana kierunku promienia odbitego = 2Δφ", wskazowka: "Po obrocie lustra obraca się również normalna. Zastosuj prawo odbicia przed i po obrocie i porównaj oba kierunki promienia odbitego." }
    ],
    "Równanie gazu doskonałego": [
        { pytanie: "Gaz ma stałą temperaturę. Jego objętość zmniejszono dwukrotnie. Jak zmieni się ciśnienie?", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Pozostanie bez zmian"], prawidlowa: 0, wzor: "pV = nRT; przy T,n = const: p₁V₁ = p₂V₂", wskazowka: "Najpierw ustal, które wielkości są stałe. Przy stałej temperaturze iloczyn pV pozostaje stały." },
        { pytanie: "W zamkniętym zbiorniku podgrzano gaz, a jego objętość się nie zmienia. Co stanie się z ciśnieniem?", odpowiedzi: ["Wzrośnie", "Zmaleje", "Nie zmieni się"], prawidlowa: 0, wzor: "p/T = const przy V,n = const", wskazowka: "Użyj równania gazu doskonałego i usuń z niego wielkości, które pozostają stałe." },
        { pytanie: "Dwa stany tego samego gazu mają różne p, V i T. Które równanie najlepiej łączy te stany?", odpowiedzi: ["p₁V₁/T₁ = p₂V₂/T₂", "p₁/T₁ = p₂V₂", "p₁V₂ = T₁T₂"], prawidlowa: 0, wzor: "pV/T = const dla stałej ilości gazu", wskazowka: "Porównujesz dwa stany tej samej ilości gazu, więc skorzystaj z postaci łączącej p, V i T." }
    ],
    "Moc prądu": [
        { pytanie: "Grzałka pracuje przy stałym napięciu. Jeśli jej opór wzrośnie, jak zmieni się moc pobierana z obwodu?", odpowiedzi: ["Zmniejszy się", "Zwiększy się", "Nie zmieni się"], prawidlowa: 0, wzor: "P = U²/R przy U = const", wskazowka: "Wybierz wzór zawierający wielkości, które rzeczywiście są stałe. Nie używaj P = UI bez zastanowienia, jeśli nie znasz zmiany prądu." },
        { pytanie: "Urządzenie pobiera 2 A z sieci 230 V. Jak obliczyć jego moc?", odpowiedzi: ["P = UI", "P = U/I", "P = I/U"], prawidlowa: 0, wzor: "P = U · I", wskazowka: "Moc elektryczna jest iloczynem napięcia i natężenia. Po wyborze wzoru sprawdź, czy jednostka wyniku będzie watem." },
        { pytanie: "Dwie żarówki pracują przy tym samym napięciu. Która pobiera większą moc: 40 Ω czy 80 Ω?", odpowiedzi: ["40 Ω", "80 Ω", "Obie taką samą"], prawidlowa: 0, wzor: "P = U²/R", wskazowka: "Przy tym samym U moc jest odwrotnie proporcjonalna do oporu. Porównaj zależność bez wykonywania zbędnych obliczeń." }
    ],
    "Prawo Kirchhoffa": [
        { pytanie: "Do węzła wpływają prądy 2 A i 3 A. Jaki musi być łączny prąd wypływający z węzła?", odpowiedzi: ["5 A", "1 A", "6 A"], prawidlowa: 0, wzor: "ΣIwpływające = ΣIwypływające", wskazowka: "W węźle nie gromadzi się ładunek. Zapisz osobno prądy wpływające i wypływające, a następnie przyrównaj ich sumy." },
        { pytanie: "W oczku suma spadków napięć wynosi 9 V. Jakie napięcie źródła musi je równoważyć, jeśli nie ma innych źródeł?", odpowiedzi: ["9 V", "0 V", "18 V"], prawidlowa: 0, wzor: "ΣU = 0 w zamkniętym oczku", wskazowka: "Zapisz algebraiczną sumę zmian potencjału podczas pełnego obejścia oczka. Źródło musi zrównoważyć spadki napięć." },
        { pytanie: "Uczeń przypisał prądowi wpływającemu do węzła znak ujemny, a wypływającemu dodatni. Czy jest to błąd?", odpowiedzi: ["Nie, znaki można przyjąć umownie, jeśli zachowa się konsekwencję", "Tak, prąd wpływający zawsze musi być dodatni", "Tak, prąd nie może mieć znaku"], prawidlowa: 0, wzor: "ΣI = 0 z umowną konwencją znaków", wskazowka: "W prawach Kirchhoffa znaki zależą od przyjętej konwencji. Najważniejsza jest konsekwencja w całym równaniu." }
    ],
    "Łączenie oporników": [
        { pytanie: "Dwa oporniki 6 Ω i 3 Ω połączono szeregowo. Jaki jest ich opór zastępczy?", odpowiedzi: ["9 Ω", "2 Ω", "18 Ω"], prawidlowa: 0, wzor: "Rz = R₁ + R₂ dla połączenia szeregowego", wskazowka: "W szeregu przez oba oporniki płynie ten sam prąd. Dla takiego połączenia opory sumują się." },
        { pytanie: "Oporniki 6 Ω i 3 Ω połączono równolegle. Który opór zastępczy jest możliwy?", odpowiedzi: ["2 Ω", "9 Ω", "18 Ω"], prawidlowa: 0, wzor: "1/Rz = 1/R₁ + 1/R₂", wskazowka: "Dla połączenia równoległego opór zastępczy jest mniejszy od najmniejszego z oporów. Dopiero potem wykonaj rachunek." },
        { pytanie: "W połączeniu szeregowym który parametr jest taki sam dla wszystkich oporników?", odpowiedzi: ["Natężenie prądu", "Napięcie na każdym oporniku", "Moc każdego opornika"], prawidlowa: 0, wzor: "I = const w jednej gałęzi szeregowej", wskazowka: "Prześledź jedną zamkniętą drogę przepływu ładunków. W szeregu nie ma rozgałęzienia, przez które prąd mógłby się podzielić." }
    ],
    "Ciepło właściwe": [
        { pytanie: "Ile energii trzeba dostarczyć, aby ogrzać ciało o masie 2 kg i cieple właściwym 500 J/(kg·K) o 10 K?", odpowiedzi: ["10 000 J", "1 000 J", "100 000 J"], prawidlowa: 0, wzor: "Q = mcΔT", wskazowka: "Wypisz m, c i zmianę temperatury. Podstaw dopiero po sprawdzeniu, że temperatura występuje jako różnica ΔT." },
        { pytanie: "Dwa ciała o tej samej masie i takim samym wzroście temperatury otrzymują tę samą energię. Które ma większe ciepło właściwe?", odpowiedzi: ["To, które ogrzało się trudniej — przy tej samej energii miało mniejszą zmianę temperatury", "To, które ogrzało się bardziej", "Nie można tego porównać"], prawidlowa: 0, wzor: "c = Q/(mΔT)", wskazowka: "Porównaj, ile energii przypada na jednostkę masy i jeden kelwin zmiany temperatury. Większe c oznacza większą bezwładność cieplną." },
        { pytanie: "Czy ogrzanie ciała o 20°C zamiast o 20 K zmienia wartość ΔT w równaniu Q = mcΔT?", odpowiedzi: ["Nie, przyrost temperatury ma tę samą wartość liczbową", "Tak, trzeba dodać 273", "Tak, trzeba podzielić przez 273"], prawidlowa: 0, wzor: "ΔT w °C = ΔT w K", wskazowka: "Dla różnicy temperatur skala Celsjusza i Kelvina ma identyczny rozmiar jednostki. Nie przeliczaj temperatury bezwzględnej, jeśli potrzebujesz tylko ΔT." }
    ],
    "Przemiany gazowe": [
        { pytanie: "Gaz jest sprężany bardzo powoli, a temperatura pozostaje stała. Jaką przemianę opisuje doświadczenie?", odpowiedzi: ["Izotermiczną", "Izochoryczną", "Izobaryczną"], prawidlowa: 0, wzor: "T = const; pV = const", wskazowka: "Rozpoznaj wielkość utrzymywaną na stałym poziomie. Stała temperatura oznacza przemianę izotermiczną." },
        { pytanie: "W przemianie izochorycznej zwiększono temperaturę gazu. Co stanie się z ciśnieniem?", odpowiedzi: ["Wzrośnie", "Zmaleje", "Pozostanie stałe"], prawidlowa: 0, wzor: "p/T = const przy V = const", wskazowka: "Objętość jest stała, więc porównaj p i T w dwóch stanach zamiast używać zależności z V." }
    ],
    "Soczewki i powiększenie": [
        { pytanie: "Soczewka skupiająca ma ogniskową 10 cm, a przedmiot ustawiono 30 cm od niej. Które równanie należy zapisać, aby znaleźć położenie obrazu?", odpowiedzi: ["1/f = 1/x + 1/y", "f = x + y", "1/f = x/y"], prawidlowa: 0, wzor: "1/f = 1/x + 1/y", wskazowka: "Najpierw rozpoznaj: znasz ogniskową i odległość przedmiotu, a szukasz odległości obrazu. To zastosowanie równania soczewki cienkiej." },
        { pytanie: "Jeżeli wysokość obrazu jest dwa razy większa od wysokości przedmiotu, jaką wartość bezwzględną ma powiększenie?", odpowiedzi: ["2", "0,5", "4"], prawidlowa: 0, wzor: "|m| = |h'/h|", wskazowka: "Powiększenie porównuje rozmiar obrazu z rozmiarem przedmiotu. Znak informuje dodatkowo o orientacji obrazu." },
        { pytanie: "Przedmiot przesuwamy w stronę ogniska soczewki skupiającej, pozostając poza ogniskiem. Co dzieje się z obrazem?", odpowiedzi: ["Oddala się od soczewki i rośnie", "Przybliża się do soczewki i maleje", "Znika natychmiast"], prawidlowa: 0, wzor: "1/f = 1/x + 1/y", wskazowka: "Rozważ równanie soczewki dla coraz mniejszego x, ale nadal większego od f. Sprawdź, jak musi zmieniać się y." }
    ],
    "Zwierciadła sferyczne": [
        { pytanie: "W zwierciadle wklęsłym przedmiot znajduje się dalej niż środek krzywizny. Jaki obraz otrzymasz?", odpowiedzi: ["Rzeczywisty, odwrócony i pomniejszony", "Pozorny, prosty i powiększony", "Rzeczywisty, prosty i powiększony"], prawidlowa: 0, wzor: "1/f = 1/x + 1/y, f = R/2", wskazowka: "Porównaj położenie przedmiotu z f i 2f. Z diagramu promieni głównych odczytaj położenie oraz orientację obrazu." },
        { pytanie: "Dla zwierciadła wklęsłego promień padający równolegle do osi głównej po odbiciu przechodzi przez...", odpowiedzi: ["Ognisko", "Środek krzywizny", "Wierzchołek zawsze pod kątem 90°"], prawidlowa: 0, wzor: "Promień równoległy do osi → po odbiciu przez ognisko", wskazowka: "Skorzystaj z jednego z promieni konstrukcyjnych zwierciadła wklęsłego. Nie mieszaj tej reguły z promieniem przechodzącym przez środek krzywizny." }
    ],
    "Widmo elektromagnetyczne": [
        { pytanie: "Które promieniowanie ma większą częstotliwość: UV czy podczerwień?", odpowiedzi: ["UV", "Podczerwień", "Mają zawsze taką samą częstotliwość"], prawidlowa: 0, wzor: "c = λf", wskazowka: "W próżni wszystkie fale elektromagnetyczne mają tę samą prędkość. Zależność c = λf pozwala połączyć długość fali z częstotliwością." },
        { pytanie: "Fala elektromagnetyczna ma w próżni długość 600 nm. Jak znaleźć jej częstotliwość?", odpowiedzi: ["f = c/λ", "f = cλ", "f = λ/c"], prawidlowa: 0, wzor: "f = c/λ, c ≈ 3·10⁸ m/s", wskazowka: "Najpierw zamień nanometry na metry. Potem przekształć c = λf względem f." }
    ],
    "Polaryzacja światła": [
        { pytanie: "Dwa idealne polaryzatory mają osie przepuszczania ustawione prostopadle. Ile światła przechodzi przez drugi, jeśli nie ma innych efektów?", odpowiedzi: ["Praktycznie zero", "Połowa", "Całość"], prawidlowa: 0, wzor: "I = I₀ cos²θ", wskazowka: "Kąt między osiami wynosi 90°. W prawie Malusa sprawdź wartość cos²90°." },
        { pytanie: "Co dzieje się z natężeniem światła za analizatorem, gdy kąt między osiami polaryzatora i analizatora rośnie od 0° do 90°?", odpowiedzi: ["Maleje zgodnie z cos²θ", "Rośnie liniowo", "Nie zmienia się"], prawidlowa: 0, wzor: "I = I₀ cos²θ", wskazowka: "Nie zakładaj liniowej zależności. Sprawdź kwadrat cosinusa dla kilku wartości kąta." }
    ],
    "Efekt Dopplera": [
        { pytanie: "Źródło dźwięku zbliża się do nieruchomego obserwatora. Jak zmieni się słyszana częstotliwość?", odpowiedzi: ["Wzrośnie", "Zmaleje", "Pozostanie taka sama"], prawidlowa: 0, wzor: "Dla zbliżania f' > f", wskazowka: "Pomyśl o odstępie między kolejnymi frontami fali docierającymi do obserwatora. Przy zbliżaniu docierają częściej." },
        { pytanie: "Po przejechaniu karetki obok obserwatora ton syreny wydaje się niższy. Dlaczego?", odpowiedzi: ["Po minięciu źródło się oddala, więc obserwowana częstotliwość maleje", "Prędkość dźwięku nagle spada do zera", "Syrena zmienia swoją częstotliwość tylko w momencie minięcia"], prawidlowa: 0, wzor: "Efekt Dopplera: oddalanie → f' < f", wskazowka: "Rozdziel częstotliwość źródła od częstotliwości odbieranej przez obserwatora. Zmienia się sposób, w jaki fronty fal docierają do odbiorcy." }
    ],
    "Jasność i odległość gwiazd": [
        { pytanie: "Dwie identyczne gwiazdy są od nas w odległościach d i 2d. Która będzie obserwacyjnie jaśniejsza?", odpowiedzi: ["Ta w odległości d", "Ta w odległości 2d", "Obie tak samo"], prawidlowa: 0, wzor: "F ∝ 1/d²", wskazowka: "Przy tej samej mocy promieniowania strumień energii rozkłada się na powierzchni sfery 4πd²." },
        { pytanie: "Jeśli odległość do identycznej gwiazdy wzrośnie trzykrotnie, jej obserwowany strumień energii zmieni się...", odpowiedzi: ["Zmaleje dziewięciokrotnie", "Zmaleje trzykrotnie", "Wzrośnie dziewięciokrotnie"], prawidlowa: 0, wzor: "F₂/F₁ = (d₁/d₂)²", wskazowka: "Zależność od odległości jest kwadratowa. Podstaw stosunek odległości, nie same różnice." }
    ],
    "Widma gwiazd": [
        { pytanie: "Dlaczego analiza widma gwiazdy pozwala wnioskować o jej składzie chemicznym?", odpowiedzi: ["Pierwiastki mają charakterystyczne linie widmowe", "Każda gwiazda emituje wyłącznie jeden kolor", "Widmo zależy tylko od rozmiaru teleskopu"], prawidlowa: 0, wzor: "Położenie linii widmowych ↔ przejścia energetyczne atomów", wskazowka: "Porównaj obserwowane linie z widmami laboratoryjnymi znanych pierwiastków." },
        { pytanie: "Jeśli linie widmowe gwiazdy są przesunięte ku czerwieni, co można z tego wywnioskować o jej ruchu wzdłuż linii widzenia?", odpowiedzi: ["Oddala się", "Zbliża się", "Na pewno się nie porusza"], prawidlowa: 0, wzor: "Przesunięcie ku czerwieni → mniejsza obserwowana częstotliwość", wskazowka: "Połącz zmianę częstotliwości z efektem Dopplera. Czerwone przesunięcie oznacza wydłużenie obserwowanej długości fali." }
    ],
    "Ewolucja gwiazd": [
        { pytanie: "Który czynnik najbardziej wpływa na dalszą ewolucję gwiazdy po jej narodzinach?", odpowiedzi: ["Jej masa początkowa", "Kolor planety w układzie", "Odległość od Ziemi"], prawidlowa: 0, wzor: "Masa gwiazdy determinuje tempo spalania paliwa i możliwe etapy ewolucji", wskazowka: "Nie patrz na jasność obserwowaną z Ziemi. Kluczowa jest masa, bo decyduje o temperaturze, ciśnieniu i tempie reakcji w jądrze." },
        { pytanie: "Dlaczego masywna gwiazda zwykle żyje krócej niż gwiazda podobna do Słońca, mimo że ma więcej paliwa?", odpowiedzi: ["Spala paliwo znacznie szybciej", "Nie ma paliwa w jądrze", "Jej grawitacja nie działa"], prawidlowa: 0, wzor: "Większa masa → wyższe tempo reakcji jądrowych", wskazowka: "Porównaj nie tylko ilość paliwa, ale również tempo jego zużywania. Większa masa oznacza znacznie większe tempo przemian w jądrze." }
    ],
    "Model Bohra": [
        { pytanie: "Elektron w modelu Bohra przechodzi z poziomu o wyższej energii na niższy. Co dzieje się z energią układu?", odpowiedzi: ["Emitowany jest foton o energii równej różnicy poziomów", "Elektron pochłania foton", "Energia znika bez śladu"], prawidlowa: 0, wzor: "E_fotonu = |E₂ − E₁| = hf", wskazowka: "Najpierw znajdź różnicę energii między poziomami. Następnie połącz ją z energią fotonu przez E = hf." },
        { pytanie: "Co stanie się z długością fali emitowanego fotonu, jeśli różnica energii między poziomami będzie większa?", odpowiedzi: ["Zmniejszy się", "Zwiększy się", "Nie zmieni się"], prawidlowa: 0, wzor: "E = hc/λ", wskazowka: "Przy stałej prędkości światła większa energia oznacza większą częstotliwość. Zależność λ = c/f pozwala określić zmianę długości fali." }
    ],
    "Dualizm korpuskularno-falowy": [
        { pytanie: "Jak zmieni się długość fali de Broglie'a cząstki, jeśli jej pęd wzrośnie dwukrotnie?", odpowiedzi: ["Zmniejszy się dwukrotnie", "Wzrośnie dwukrotnie", "Nie zmieni się"], prawidlowa: 0, wzor: "λ = h/p", wskazowka: "Długość fali jest odwrotnie proporcjonalna do pędu. Porównaj stosunek λ₂/λ₁ zamiast podstawiać przypadkowe liczby." },
        { pytanie: "Dlaczego dla makroskopowego przedmiotu nie obserwujemy na co dzień wyraźnych efektów falowych?", odpowiedzi: ["Jego długość fali de Broglie'a jest ekstremalnie mała", "Nie ma pędu", "Nie obowiązują go prawa fizyki"], prawidlowa: 0, wzor: "λ = h/p", wskazowka: "Stała Plancka jest bardzo mała. Dla dużego pędu odpowiadająca mu długość fali staje się niezwykle mała." }
    ],
    "Cząstki elementarne": [
        { pytanie: "Proton i neutron nie są cząstkami elementarnymi. Z jakich składników są zbudowane?", odpowiedzi: ["Z kwarków", "Z fotonów", "Z elektronów"], prawidlowa: 0, wzor: "Proton: uud; neutron: udd", wskazowka: "Przypomnij sobie skład kwarkowy nukleonów. Elektron należy do leptonów i nie jest składnikiem protonu." },
        { pytanie: "Która cząstka jest nośnikiem oddziaływania elektromagnetycznego w Modelu Standardowym?", odpowiedzi: ["Foton", "Gluon", "Bozon Higgsa"], prawidlowa: 0, wzor: "Elektromagnetyzm ↔ foton", wskazowka: "Dopasuj cząstkę pośredniczącą do rodzaju oddziaływania, zamiast kierować się jej masą czy ładunkiem." }
    ],
    "Oko jako układ optyczny": [
        { pytanie: "Dlaczego osoba krótkowzroczna ma problem z ostrym widzeniem odległych obiektów?", odpowiedzi: ["Obraz odległego obiektu powstaje przed siatkówką", "Obraz zawsze powstaje za siatkówką", "Siatkówka nie reaguje na światło"], prawidlowa: 0, wzor: "Soczewka oka skupia promienie; wady określa się względem położenia ogniska i siatkówki", wskazowka: "Wyobraź sobie promienie równoległe od odległego przedmiotu i sprawdź, gdzie względem siatkówki skupiają się po przejściu przez układ optyczny oka." },
        { pytanie: "Jaką soczewkę stosuje się do korekcji krótkowzroczności?", odpowiedzi: ["Rozpraszającą", "Skupiającą", "Płaską szybę bez mocy optycznej"], prawidlowa: 0, wzor: "Soczewka rozpraszająca przesuwa ognisko układu w stronę siatkówki", wskazowka: "Skoro bez korekcji ognisko jest przed siatkówką, potrzebujesz zmniejszyć zdolność skupiającą całego układu." }
    ]
};

const pulePytanDzialow = {
    mechanika: [
        { pytanie: "Samochód zwiększa prędkość z 10 do 20 m/s w ciągu 5 s. Jaką zależność wykorzystasz, aby znaleźć przyspieszenie?", odpowiedzi: ["a = Δv/Δt", "a = v·t", "a = s/t"], prawidlowa: 0, wzor: "a = (v − v₀)/Δt", wskazowka: "Szukasz zmiany prędkości w jednostce czasu. Zapisz v₀, v i Δt, a następnie sprawdź jednostkę przyspieszenia." },
        { pytanie: "Na ciało o masie 4 kg działa wypadkowa siła 12 N. Jak znaleźć jego przyspieszenie?", odpowiedzi: ["a = F/m", "a = Fm", "a = m/F"], prawidlowa: 0, wzor: "F = ma", wskazowka: "Z II zasady Newtona wyznacz a. Sprawdź też jednostkę: N/kg = m/s²." },
        { pytanie: "Pasażer autobusu pochyla się do przodu podczas gwałtownego hamowania. Jak wyjaśnić to zjawisko?", odpowiedzi: ["Bezwładnością — ciało dąży do zachowania dotychczasowego ruchu", "Grawitacja nagle rośnie", "Masa pasażera maleje"], prawidlowa: 0, wzor: "I zasada Newtona", wskazowka: "Rozpatrz ruch pasażera względem autobusu. Samochód zmienia prędkość, a ciało zachowuje swój dotychczasowy stan ruchu." },
        { pytanie: "Rowerzysta jedzie po zakręcie ze stałą szybkością. Czy jego przyspieszenie może być różne od zera?", odpowiedzi: ["Tak, ponieważ zmienia się kierunek wektora prędkości", "Nie, bo szybkość jest stała", "Tylko jeśli zmienia się masa"], prawidlowa: 0, wzor: "a_d = v²/r", wskazowka: "Szybkość to wartość prędkości, ale wektor prędkości ma również kierunek. Na zakręcie kierunek się zmienia." },
        { pytanie: "Dla tej samej siły hamującej samochód o większej masie ma mniejsze opóźnienie. Z czego to wynika?", odpowiedzi: ["Z a = F/m", "Z a = Fm", "Z zasady zachowania energii bez związku z masą"], prawidlowa: 0, wzor: "a = F/m", wskazowka: "Porównaj dwa auta przy tej samej sile. W II zasadzie Newtona masa znajduje się w mianowniku przy wyznaczaniu przyspieszenia." }
    ],
    plyny: [
        { pytanie: "Jak zmieni się ciśnienie hydrostatyczne na dnie zbiornika, jeśli głębokość zwiększymy dwukrotnie, a ciecz pozostanie ta sama?", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się"], prawidlowa: 0, wzor: "p = ρgh", wskazowka: "Przy tej samej cieczy ρ i g są stałe. Sprawdź, jak ciśnienie zależy od h." },
        { pytanie: "Ciało zanurzone w wodzie wypiera wodę o objętości 0,002 m³. Jak wyznaczyć siłę wyporu?", odpowiedzi: ["F_w = ρgV", "F_w = ρ/V", "F_w = V/(ρg)"], prawidlowa: 0, wzor: "F_w = ρ_cieczy g V_wypartej", wskazowka: "W prawie Archimedesa używasz gęstości cieczy oraz objętości wypartej cieczy, nie masy samego ciała." },
        { pytanie: "Woda przepływa szybciej w zwężonym fragmencie rury. Jaką zasadę należy rozważyć, aby powiązać prędkość przepływu z ciśnieniem?", odpowiedzi: ["Równanie Bernoulliego", "Prawo Coulomba", "Prawo odbicia"], prawidlowa: 0, wzor: "p + ½ρv² + ρgh = const", wskazowka: "Wzdłuż strugi dla ustalonych warunków suma składników ciśnieniowego, kinetycznego i grawitacyjnego pozostaje stała." },
        { pytanie: "Dlaczego stalowa kulka może tonąć, a statek ze stali może pływać?", odpowiedzi: ["O pływaniu decyduje także objętość wypartej wody i średnia gęstość całego statku", "Stal zmienia gęstość w wodzie", "Na statek nie działa siła grawitacji"], prawidlowa: 0, wzor: "F_w = ρ_w g V_w; warunek pływania: F_w = mg", wskazowka: "Nie porównuj tylko materiału. Porównaj ciężar całego obiektu z maksymalną siłą wyporu wynikającą z objętości zanurzonej części." }
    ],
    elektrycznosc: [
        { pytanie: "Przez opornik 10 Ω płynie prąd 0,5 A. Jakie równanie pozwoli wyznaczyć napięcie?", odpowiedzi: ["U = IR", "U = I/R", "U = R/I"], prawidlowa: 0, wzor: "U = IR", wskazowka: "Skorzystaj z prawa Ohma. Sprawdź, czy iloczyn A·Ω daje wolt." },
        { pytanie: "Napięcie na oporniku pozostaje stałe, a jego opór zwiększa się dwukrotnie. Co dzieje się z natężeniem?", odpowiedzi: ["Maleje dwukrotnie", "Rośnie dwukrotnie", "Nie zmienia się"], prawidlowa: 0, wzor: "I = U/R", wskazowka: "Przy stałym U natężenie jest odwrotnie proporcjonalne do R." },
        { pytanie: "Dwa ładunki punktowe zwiększono dwukrotnie, pozostawiając odległość bez zmian. Jak zmieni się wartość siły Coulomba?", odpowiedzi: ["Wzrośnie czterokrotnie", "Wzrośnie dwukrotnie", "Nie zmieni się"], prawidlowa: 0, wzor: "F = k|q₁q₂|/r²", wskazowka: "W liczniku występuje iloczyn obu ładunków. Podwojenie każdego z nich daje czterokrotną zmianę iloczynu." },
        { pytanie: "W obwodzie szeregowym przez dwa oporniki płynie ten sam prąd. Jeśli jeden opór wzrośnie, co stanie się z całkowitym oporem?", odpowiedzi: ["Wzrośnie o wartość tej zmiany", "Zmniejszy się", "Zawsze pozostanie taki sam"], prawidlowa: 0, wzor: "Rz = R₁ + R₂ + ...", wskazowka: "W szeregu opory dodają się. Zobacz, jak zmiana jednego składnika wpływa na sumę." },
        { pytanie: "Przewodnik ma opór 5 Ω i płynie przez niego prąd 2 A. Jak obliczyć moc wydzielaną na oporze?", odpowiedzi: ["P = I²R", "P = I/R", "P = R/I"], prawidlowa: 0, wzor: "P = UI = I²R = U²/R", wskazowka: "Masz I i R, więc wybierz postać mocy, która korzysta właśnie z tych danych." }
    ],
    magnetyzm: [
        { pytanie: "Na przewodnik z prądem w polu magnetycznym działa siła. Od czego zależy jej wartość?", odpowiedzi: ["Między innymi od I, B, długości przewodnika i kąta", "Tylko od masy przewodnika", "Tylko od temperatury"], prawidlowa: 0, wzor: "F = BIl sinθ", wskazowka: "Sprawdź kąt między kierunkiem prądu a wektorem pola. Dla równoległości sinθ = 0." },
        { pytanie: "Na naładowaną cząstkę poruszającą się równolegle do linii pola magnetycznego działa siła Lorentza?", odpowiedzi: ["Nie, bo v × B = 0", "Tak, maksymalna", "Zawsze działa w kierunku ruchu"], prawidlowa: 0, wzor: "F = |q|vB sinθ", wskazowka: "Przy ruchu równoległym kąt wynosi 0°. Sprawdź wartość sin0° przed wyciągnięciem wniosku." },
        { pytanie: "Co jest konieczne, aby zmienny strumień magnetyczny wywołał siłę elektromotoryczną indukcji?", odpowiedzi: ["Zmiana strumienia magnetycznego przez obwód", "Stałe pole bez żadnej zmiany", "Sama obecność opornika"], prawidlowa: 0, wzor: "ε = −dΦ/dt", wskazowka: "Zwróć uwagę na zmianę strumienia w czasie, a nie tylko na istnienie pola magnetycznego." }
    ],
    fale: [
        { pytanie: "Fala ma częstotliwość 5 Hz i długość 2 m. Jak obliczyć jej prędkość?", odpowiedzi: ["v = λf", "v = λ/f", "v = f/λ"], prawidlowa: 0, wzor: "v = λf", wskazowka: "Połącz długość jednej fali z liczbą okresów przechodzących w ciągu sekundy. Jednostką wyniku powinno być m/s." },
        { pytanie: "Jeśli źródło wykonuje dwa razy więcej drgań w tej samej jednostce czasu, jego częstotliwość...", odpowiedzi: ["Rośnie dwukrotnie", "Maleje dwukrotnie", "Nie zmienia się"], prawidlowa: 0, wzor: "f = 1/T", wskazowka: "Częstotliwość określa liczbę pełnych drgań na sekundę. Zwróć uwagę, jak zmienia się liczba drgań w tym samym czasie." },
        { pytanie: "Fala przechodzi do ośrodka, w którym rozchodzi się wolniej, ale częstotliwość źródła się nie zmienia. Co dzieje się z długością fali?", odpowiedzi: ["Zmniejsza się", "Zwiększa się", "Nie zmienia się"], prawidlowa: 0, wzor: "λ = v/f", wskazowka: "Częstotliwość jest narzucona przez źródło. Jeśli v maleje, sprawdź zmianę λ z równania v = λf." },
        { pytanie: "Dwa zgodne źródła fal tworzą w pewnym punkcie wzmocnienie. Jaka różnica dróg może temu sprzyjać?", odpowiedzi: ["Całkowita wielokrotność długości fali", "Nieparzysta połowa długości fali", "Dowolna wartość bez związku z λ"], prawidlowa: 0, wzor: "Δr = mλ dla interferencji konstruktywnej", wskazowka: "Dla wzmocnienia fale powinny docierać zgodne w fazie. Porównaj drogę różnicy z długością fali." },
        { pytanie: "Przy źródle dźwięku zbliżającym się do obserwatora obserwowana częstotliwość jest większa. Jakie zjawisko to opisuje?", odpowiedzi: ["Efekt Dopplera", "Dyfrakcję", "Polaryzację"], prawidlowa: 0, wzor: "Zbliżanie źródła → f' > f", wskazowka: "Śledź odstępy między kolejnymi frontami fali docierającymi do obserwatora. Przy zbliżaniu docierają częściej." },
        {pytanie:"Fala elektromagnetyczna o częstotliwości 6·10¹⁴ Hz ma w próżni długość około:",odpowiedzi:["5·10⁻⁷ m","1,8·10²³ m","6·10¹⁴ m"],prawidlowa:0,wzor:"c = λf",wskazowka:"W próżni prędkość fali elektromagnetycznej jest równa c. Przekształć c = λf względem λ i dopiero potem podstaw częstotliwość."},
        {pytanie:"Które stwierdzenie o fali elektromagnetycznej w próżni jest poprawne?",odpowiedzi:["Pole elektryczne i magnetyczne są wzajemnie prostopadłe oraz prostopadłe do kierunku propagacji","Pole elektryczne i magnetyczne są równoległe do kierunku propagacji","Fala wymaga ośrodka materialnego"],prawidlowa:0,wzor:"E ⟂ B ⟂ kierunek propagacji",wskazowka:"Wyobraź sobie falę poprzeczną. Oba pola oscylują poprzecznie do kierunku, w którym energia fali jest przenoszona."},
        {pytanie:"Światło przechodzi z próżni do szkła. Która wielkość pozostaje związana ze źródłem i nie zmienia się na granicy ośrodków?",odpowiedzi:["Częstotliwość","Prędkość rozchodzenia","Długość fali"],prawidlowa:0,wzor:"f = const; v = λf",wskazowka:"Granica ośrodków nie zmienia tempa drgań narzuconego przez źródło. Skoro prędkość w szkle jest mniejsza, z v = λf wynika zmiana długości fali."},
        {pytanie:"Fala radiowa i światło widzialne mogą mieć tę samą prędkość w próżni, ale różne częstotliwości. Co musi być wtedy różne?",odpowiedzi:["Ich długości fal","Ich energia całkowita niezależnie od źródła","Ich prędkość w próżni"],prawidlowa:0,wzor:"c = λf",wskazowka:"Przy tej samej wartości c iloczyn λf musi pozostać stały. Większa częstotliwość oznacza więc krótszą długość fali."}
    ],
    optyka: [
        { pytanie: "Promień przechodzi z powietrza do szkła i zmienia kierunek. Które prawo pozwala obliczyć kąt załamania?", odpowiedzi: ["Prawo Snelliusa", "Prawo Ohma", "Prawo Archimedesa"], prawidlowa: 0, wzor: "n₁ sinθ₁ = n₂ sinθ₂", wskazowka: "Kąty mierz od normalnej. Porównaj współczynniki załamania obu ośrodków i zastosuj prawo Snelliusa." },
        { pytanie: "Soczewka skupiająca ma ogniskową 20 cm. Przedmiot znajduje się 60 cm od soczewki. Jakie równanie wykorzystasz do wyznaczenia obrazu?", odpowiedzi: ["1/f = 1/x + 1/y", "f = x + y", "f = xy"], prawidlowa: 0, wzor: "1/f = 1/x + 1/y", wskazowka: "Znasz f i x, a szukasz y. Przekształć równanie soczewki cienkiej przed podstawieniem." },
        { pytanie: "Dla zwierciadła wklęsłego promień padający równolegle do osi głównej po odbiciu przechodzi przez...", odpowiedzi: ["Ognisko", "Środek krzywizny zawsze", "Dowolny punkt osi"], prawidlowa: 0, wzor: "Promień równoległy → po odbiciu przez ognisko", wskazowka: "To jeden z podstawowych promieni konstrukcyjnych zwierciadła wklęsłego. Narysuj oś i ognisko, aby zobaczyć bieg promienia." },
        { pytanie: "Przedmiot znajduje się między ogniskiem a soczewką skupiającą. Jaki charakter ma obraz?", odpowiedzi: ["Pozorny, prosty i powiększony", "Rzeczywisty i pomniejszony", "Zawsze odwrócony i pomniejszony"], prawidlowa: 0, wzor: "1/f = 1/x + 1/y; dla x < f obraz jest pozorny", wskazowka: "Porównaj odległość przedmiotu z ogniskową. Następnie sprawdź znak i wartość powiększenia." }
    ],
    termodynamika: [
        { pytanie: "Do 2 kg wody dostarczono 84 kJ energii. Jak wyznaczyć zmianę temperatury, jeśli c = 4200 J/(kg·K) i nie ma strat?", odpowiedzi: ["ΔT = Q/(mc)", "ΔT = Qmc", "ΔT = mc/Q"], prawidlowa: 0, wzor: "Q = mcΔT", wskazowka: "Najpierw zamień kJ na J. Potem przekształć Q = mcΔT względem ΔT." },
        { pytanie: "Gaz w zamkniętym zbiorniku ogrzano, ale jego objętość nie mogła się zmienić. Co powinno stać się z ciśnieniem?", odpowiedzi: ["Wzrosnąć", "Zmniejszyć się", "Pozostać stałe"], prawidlowa: 0, wzor: "p/T = const przy V,n = const", wskazowka: "Stała objętość oznacza, że wzrost temperatury bezwzględnej powoduje wzrost ciśnienia." },
        { pytanie: "Dlaczego temperatura 20°C odpowiada zmianie temperatury 20 K, ale nie temperaturze 20 K?", odpowiedzi: ["Skala Kelvina i Celsjusza mają taki sam rozmiar stopnia, ale inne zero", "Kelwin i stopień Celsjusza są zawsze tym samym", "20°C i 20 K to ta sama temperatura bezwzględna"], prawidlowa: 0, wzor: "T[K] = t[°C] + 273,15; ΔT[K] = Δt[°C]", wskazowka: "Rozróżnij temperaturę bezwzględną od jej przyrostu. Przesunięcie początku skali znika przy odejmowaniu dwóch temperatur." }
    ],
    kwantowa: [
        { pytanie: "Foton ma energię 6,6·10⁻¹⁹ J. Który wzór pozwala znaleźć jego częstotliwość?", odpowiedzi: ["f = E/h", "f = Eh", "f = h/E"], prawidlowa: 0, wzor: "E = hf", wskazowka: "Energia fotonu jest proporcjonalna do częstotliwości. Przekształć E = hf względem f." },
        { pytanie: "Jeśli długość fali de Broglie'a cząstki zmniejszy się dwukrotnie, jej pęd...", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się"], prawidlowa: 0, wzor: "λ = h/p", wskazowka: "Stała Plancka pozostaje stała. Porównaj odwrotną proporcjonalność λ i p." },
        { pytanie: "W efekcie fotoelektrycznym światło o zbyt małej częstotliwości pada na metal. Co się stanie po zwiększaniu samego natężenia, jeśli częstotliwość nadal jest poniżej progowej?", odpowiedzi: ["Elektrony nadal nie będą wybite", "Elektrony będą miały większą energię kinetyczną", "Próg częstotliwości zniknie"], prawidlowa: 0, wzor: "hf ≥ W; natężenie nie zastępuje warunku częstotliwości progowej", wskazowka: "Najpierw sprawdź warunek energetyczny dla pojedynczego fotonu. Większa liczba zbyt mało energetycznych fotonów nie zmienia energii każdego z nich." },
        { pytanie: "Okres półtrwania próbki wynosi 4 h. Jaka część początkowej liczby jąder pozostanie po 8 h?", odpowiedzi: ["1/4", "1/2", "1/8"], prawidlowa: 0, wzor: "N = N₀(1/2)ⁿ, n = t/T₁/₂", wskazowka: "Policz, ile pełnych okresów półtrwania minęło. Po każdym okresie pozostaje połowa poprzedniej liczby jąder." }
    ],
    wzglednosc: [
        { pytanie: "Zegar poruszający się względem obserwatora mierzy krótszy czas własny niż czas wyznaczony w układzie, w którym zegar się porusza. Jakie zjawisko opisuje ten fakt?", odpowiedzi: ["Dylatację czasu", "Dyfrakcję", "Indukcję"], prawidlowa: 0, wzor: "Δt = γΔτ, γ = 1/√(1−v²/c²)", wskazowka: "Porównaj czas własny zegara z czasem mierzonym w innym układzie. Wzrost γ przy dużych v pokazuje skalę efektu." },
        { pytanie: "Co dzieje się z czynnikiem Lorentza γ, gdy prędkość ciała zbliża się do prędkości światła?", odpowiedzi: ["Rośnie bez ograniczenia", "Dąży do zera", "Pozostaje równy 1"], prawidlowa: 0, wzor: "γ = 1/√(1−v²/c²)", wskazowka: "Sprawdź mianownik. Gdy v/c zbliża się do 1, wyrażenie pod pierwiastkiem zbliża się do zera." },
        { pytanie: "Dlaczego energia spoczynkowa nie zależy od kierunku ruchu obiektu?", odpowiedzi: ["Zależy wyłącznie od jego masy spoczynkowej: E₀ = mc²", "Zależy od kierunku prędkości", "Jest zawsze równa zero"], prawidlowa: 0, wzor: "E₀ = mc²", wskazowka: "Odróżnij energię spoczynkową od całkowitej energii relatywistycznej. W E₀ występuje masa spoczynkowa, nie wektor prędkości." }
    ],
    materialy: [
        { pytanie: "Próbka materiału po usunięciu obciążenia wraca do pierwotnego kształtu. Jakie zachowanie obserwujesz?", odpowiedzi: ["Sprężyste", "Plastyczne", "Kruche bez odkształcenia"], prawidlowa: 0, wzor: "Odkształcenie sprężyste jest odwracalne", wskazowka: "Kluczowe jest zachowanie po usunięciu siły. Jeśli próbka wraca do kształtu, odkształcenie pozostawało w zakresie sprężystym." },
        { pytanie: "Dlaczego defekty sieci krystalicznej mogą wpływać na właściwości materiału?", odpowiedzi: ["Zmieniają lokalną strukturę i mogą utrudniać lub ułatwiać ruch defektów", "Nie mają żadnego wpływu na atomy", "Zawsze zmniejszają temperaturę topnienia do zera"], prawidlowa: 0, wskazowka: "Pomyśl o regularnej sieci atomów i o tym, co dzieje się, gdy pojawia się wakans, domieszka lub dyslokacja. Właściwości wynikają z budowy mikrostruktury." },
        { pytanie: "W przewodniku zwiększono liczbę swobodnych nośników ładunku. Jak może to wpłynąć na przewodnictwo elektryczne?", odpowiedzi: ["Może je zwiększyć", "Musi je wyzerować", "Nie może mieć żadnego wpływu"], prawidlowa: 0, wzor: "σ = nqμ", wskazowka: "Przewodnictwo zależy m.in. od koncentracji nośników i ich ruchliwości. Zidentyfikuj, który czynnik został zmieniony." }
    ],
    astronomia: [
        { pytanie: "Planeta porusza się po orbicie eliptycznej. Gdzie porusza się szybciej?", odpowiedzi: ["Bliżej Słońca", "Dalej od Słońca", "Zawsze z taką samą szybkością"], prawidlowa: 0, wzor: "II prawo Keplera: rysowane pola są zakreślane w równych czasach", wskazowka: "W równych odstępach czasu promień wodzący zakreśla równe pola. Gdy planeta jest bliżej Słońca, musi pokonać większy łuk." },
        { pytanie: "Jeśli półos wielka orbity planety wzrośnie, jej okres obiegu zgodnie z III prawem Keplera...", odpowiedzi: ["Wzrośnie", "Zmniejszy się", "Pozostanie taki sam"], prawidlowa: 0, wzor: "T²/a³ = const", wskazowka: "Porównaj dwa układy wokół tego samego ciała centralnego. Z III prawa Keplera wynika zależność okresu od rozmiaru orbity." },
        { pytanie: "Dwie identyczne gwiazdy są w odległościach d i 2d. Która ma większy obserwowany strumień energii?", odpowiedzi: ["Ta w odległości d", "Ta w odległości 2d", "Obie taki sam"], prawidlowa: 0, wzor: "F = L/(4πd²)", wskazowka: "Promieniowanie rozchodzi się na powierzchni sfery. Jej pole rośnie jak d², więc strumień maleje z kwadratem odległości." },
        { pytanie: "Przesunięcie linii widmowych ku czerwieni jest użyteczne do badania ruchu obiektu wzdłuż linii widzenia. Co oznacza?", odpowiedzi: ["Obiekt oddala się", "Obiekt zbliża się", "Obiekt na pewno nie porusza się"], prawidlowa: 0, wzor: "Efekt Dopplera: λ' > λ przy oddalaniu", wskazowka: "Czerwone przesunięcie oznacza zwiększenie obserwowanej długości fali. Połącz to z efektem Dopplera." },
        { pytanie: "Jak soczewkowanie grawitacyjne pomaga astronomom badać odległe obiekty?", odpowiedzi: ["Masywne obiekty zakrzywiają czasoprzestrzeń i mogą wzmacniać lub zniekształcać obraz", "Usuwa światło z obiektu", "Zmienia skład chemiczny galaktyki"], prawidlowa: 0, wzor: "Grawitacja zakrzywia tory światła", wskazowka: "Wyobraź sobie masywny obiekt między obserwatorem a źródłem. Jego pole grawitacyjne zmienia drogę promieni świetlnych." }
    ]
};

function wybierzPuleDlaTematu(temat) {
    const t = temat.toLowerCase();
    if (/(względ|dylatac|kontrakc|spoczynk|czasoprzestrz|czarna dziura|fale grawitacyjne)/.test(t)) return pulePytanDzialow.wzglednosc;
    if (/(gwiazd|planet|kepler|galakty|wszechświat|widm|astronom|kosmolog)/.test(t)) return pulePytanDzialow.astronomia;
    if (/(kwant|fotoelektr|jądra|jądrow|radioakty|rozpad|półtrwania|wiązania|promieniowani|cząst|bohra|nieoznacz|dualizm)/.test(t)) return pulePytanDzialow.kwantowa;
    if (/(odbici|załam|soczew|zwierciad|optycz|oko|polaryzacj|światł)/.test(t)) return pulePytanDzialow.optyka;
    if (/(fala|drgan|dźwięk|doppler|interferencj|dyfrakcj|częstotliwość|amplitud|okres)/.test(t)) return pulePytanDzialow.fale;
    if (/(temperatur|ciepł|gaz|termodynam|energia wewnętrz|przemian)/.test(t)) return pulePytanDzialow.termodynamika;
    if (/(ciśnienie hydrostatycz|archim|bernoulli|płyn|ciecz)/.test(t)) return pulePytanDzialow.plyny;
    if (/(ładunek|pole elektry|prawo coulomba|prąd|napięcie|opór|ohm|moc.*prąd|kirchhoff|opornik|magnetycz|lorentza|indukcj)/.test(t)) return /magnetycz|lorentza|indukcj/.test(t) ? pulePytanDzialow.magnetyzm : pulePytanDzialow.elektrycznosc;
    if (/(materiał|krystal|twardo|przewodnict|sprężyst|plastycz|defekt|sieci przestrz)/.test(t)) return pulePytanDzialow.materialy;
    if (/(ruch|prędkość|przyspiesz|siła|tarci|moment|newton|kinemat|dynamik|okręgu|grawitacj|orbital)/.test(t)) return pulePytanDzialow.mechanika;
    return pulePytanDzialow.mechanika;
}

const BANKI_JAKOSCI = {
    mechanika: [
        {pytanie:"Samochód rusza z miejsca i po 8 s ma 16 m/s. Jak obliczyć jego średnie przyspieszenie, jeśli ruch jest jednostajnie przyspieszony?",odpowiedzi:["a = (v − v₀)/t","a = vt","a = s/t"],prawidlowa:0,wzor:"a = (v − v₀)/t",wskazowka:"Wypisz prędkość początkową i końcową oraz czas. Ponieważ startuje z miejsca, v₀ = 0. Szukasz zmiany prędkości przypadającej na jednostkę czasu."},
        {pytanie:"Piłka o masie 0,5 kg jest ciągnięta poziomo siłą 4 N, a opory ruchu wynoszą 1 N. Jak wyznaczyć przyspieszenie?",odpowiedzi:["a = (4 − 1)/0,5","a = 4·0,5 + 1","a = 0,5/(4 − 1)"],prawidlowa:0,wzor:"ΣF = ma",wskazowka:"Najpierw policz siłę wypadkową wzdłuż kierunku ruchu: siła ciągnąca minus opory. Dopiero tę wypadkową podziel przez masę."},
        {pytanie:"Ciało rzucono pionowo w górę. W najwyższym punkcie jego prędkość chwilowa wynosi zero. Co można powiedzieć o przyspieszeniu?",odpowiedzi:["Nadal jest skierowane w dół i ma wartość g","Też jest równe zero","Jest skierowane w górę"],prawidlowa:0,wzor:"a = −g (przy osi skierowanej w górę)",wskazowka:"Nie utożsamiaj prędkości z przyspieszeniem. W najwyższym punkcie zmienia się kierunek ruchu, a grawitacja nadal działa."},
        {pytanie:"Samochód pokonuje zakręt o promieniu 50 m z prędkością 10 m/s. Który wzór prowadzi do przyspieszenia dośrodkowego?",odpowiedzi:["a_d = v²/r","a_d = vr","a_d = r/v²"],prawidlowa:0,wzor:"a_d = v²/r",wskazowka:"W ruchu po okręgu przyspieszenie jest związane z kwadratem prędkości i odwrotnością promienia. Zwróć uwagę, że kierunek przyspieszenia jest do środka okręgu."},
        {pytanie:"Dwa ciała mają tę samą energię kinetyczną, ale jedno ma większą masę. Które ma większą prędkość?",odpowiedzi:["Lżejsze ciało","Cięższe ciało","Mają zawsze taką samą prędkość"],prawidlowa:0,wzor:"E_k = mv²/2",wskazowka:"Przyrównaj energie kinetyczne obu ciał i zauważ, że większa masa musi być skompensowana mniejszą wartością v²."},
        {pytanie:"Skrzynia przesuwa się po podłodze ze stałą prędkością. Siła ciągnąca ma 30 N. Jaka jest wartość wypadkowej siły poziomej?",odpowiedzi:["0 N","30 N","Większa niż 30 N"],prawidlowa:0,wzor:"ΣF = ma, a = 0",wskazowka:"Stała prędkość oznacza zerowe przyspieszenie. Z II zasady Newtona wyznacz wtedy siłę wypadkową."},
        {pytanie:"Piłka spada swobodnie z pomijalnym oporem powietrza. Jak zmienia się jej prędkość w kolejnych sekundach?",odpowiedzi:["Rośnie o około g na każdą sekundę","Pozostaje stała","Maleje o około g"],prawidlowa:0,wzor:"v = v₀ + gt",wskazowka:"Swobodny spadek ma stałe przyspieszenie g. Zależność prędkości od czasu jest liniowa."},
        {pytanie:"Dźwig podnosi 200 kg na wysokość 5 m. Która zależność pozwala obliczyć przyrost energii potencjalnej grawitacji?",odpowiedzi:["ΔE_p = mgh","ΔE_p = mv²/2","ΔE_p = F/t"],prawidlowa:0,wzor:"ΔE_p = mgh",wskazowka:"Liczy się zmiana wysokości w polu grawitacyjnym. Użyj masy, przyspieszenia grawitacyjnego i przyrostu wysokości."},
        {pytanie:"Na ciało działa stały moment siły względem osi. Co stanie się z jego prędkością kątową, jeśli moment bezwładności pozostaje stały?",odpowiedzi:["Będzie się zmieniać, bo pojawia się przyspieszenie kątowe","Nie zmieni się nigdy","Natychmiast spadnie do zera"],prawidlowa:0,wzor:"τ = Iα",wskazowka:"Moment siły jest odpowiednikiem siły w ruchu obrotowym. Przy stałym I wyznacz α z τ = Iα, a potem oceń zmianę ω."},
        {pytanie:"Dlaczego pasażer bez pasa bezpieczeństwa przesuwa się do przodu podczas gwałtownego hamowania?",odpowiedzi:["Jego ciało zachowuje dotychczasowy stan ruchu","Działa na niego dodatkowa siła do przodu","Masa pasażera nagle rośnie"],prawidlowa:0,wzor:"I zasada Newtona",wskazowka:"Rozdziel ruch samochodu od ruchu pasażera. Samochód szybko zmniejsza prędkość, natomiast ciało ma tendencję do zachowania wcześniejszej prędkości."},
        {pytanie:"W rzucie poziomym pomijamy opór powietrza. Jak niezależne od siebie traktujemy ruch poziomy i pionowy?",odpowiedzi:["Poziomy jest jednostajny, pionowy jest przyspieszony grawitacyjnie","Oba są jednostajne","Poziomy jest przyspieszony, pionowy jednostajny"],prawidlowa:0,wzor:"x = v₀t, y = gt²/2",wskazowka:"Rozłóż ruch na osie. W poziomie nie ma przyspieszenia, a w pionie działa grawitacja."},
        {pytanie:"Dwie siły 6 N i 8 N działają na ciało prostopadle. Jak znaleźć wartość ich wypadkowej?",odpowiedzi:["F_w = √(6² + 8²)","F_w = 6 + 8 zawsze","F_w = 8 − 6"],prawidlowa:0,wzor:"F_w = √(F₁² + F₂²)",wskazowka:"Siły są prostopadłe, więc ich wektory tworzą trójkąt prostokątny. Zastosuj twierdzenie Pitagorasa do wartości obu składowych."}
    ],
    termodynamika: [
        {pytanie:"Ile energii trzeba dostarczyć 0,5 kg wody, aby podgrzać ją o 20 K?",odpowiedzi:["Q = mcΔT","Q = m/ cΔT","Q = c/(mΔT)"],prawidlowa:0,wzor:"Q = mcΔT",wskazowka:"Zidentyfikuj masę, ciepło właściwe wody i zmianę temperatury. Temperatura w kelwinach i jej przyrost w stopniach Celsjusza mają tę samą wartość liczbową."},
        {pytanie:"Gaz w zamkniętym, sztywnym zbiorniku jest ogrzewany. Co dzieje się z jego ciśnieniem?",odpowiedzi:["Rośnie","Maleje","Nie zmienia się"],prawidlowa:0,wzor:"pV = nRT",wskazowka:"Objętość V i ilość gazu n są stałe. Z równania gazu doskonałego sprawdź zależność p od temperatury bezwzględnej T."},
        {pytanie:"Podczas topnienia lodu dostarczamy energię, ale temperatura mieszaniny pozostaje stała. Na co zużywana jest energia?",odpowiedzi:["Na zmianę stanu skupienia","Wyłącznie na wzrost temperatury","Na zmniejszenie masy bez zmiany stanu"],prawidlowa:0,wzor:"Q = mL",wskazowka:"W czasie przemiany fazowej dostarczona energia nie musi zwiększać temperatury. Dla topnienia użyj ciepła topnienia L."},
        {pytanie:"Dwa metalowe przedmioty mają tę samą masę i otrzymują tę samą energię. Ten o mniejszym cieple właściwym ogrzeje się...",odpowiedzi:["Bardziej","Mniej","Dokładnie tak samo"],prawidlowa:0,wzor:"ΔT = Q/(mc)",wskazowka:"Przy stałych Q i m zmiana temperatury jest odwrotnie proporcjonalna do ciepła właściwego."},
        {pytanie:"Gaz rozpręża się przy stałej temperaturze. Co musi stać się z jego ciśnieniem?",odpowiedzi:["Maleje","Rośnie","Jest stałe niezależnie od objętości"],prawidlowa:0,wzor:"pV = const dla T = const",wskazowka:"To przemiana izotermiczna. Gdy V rośnie, iloczyn pV ma pozostać stały."},
        {pytanie:"Co fizycznie oznacza zerowa zmiana temperatury podczas przemiany fazowej w idealnym modelu?",odpowiedzi:["Średnia energia kinetyczna cząsteczek nie rośnie, a energia idzie w zmianę oddziaływań","Cząsteczki przestają się poruszać","Nie jest dostarczana żadna energia"],prawidlowa:0,wzor:"Q = mL",wskazowka:"Temperatura wiąże się z ruchem chaotycznym cząsteczek. Podczas przemiany fazowej energia zmienia głównie stan uporządkowania i oddziaływania między nimi."},
        {pytanie:"W jakim kierunku samorzutnie płynie ciepło między dwoma ciałami o różnych temperaturach?",odpowiedzi:["Od cieplejszego do chłodniejszego","Od chłodniejszego do cieplejszego","W obu kierunkach z takim samym efektem netto"],prawidlowa:0,wzor:"ΔT > 0 → przepływ ciepła od T większej do mniejszej",wskazowka:"Porównaj temperatury obu ciał, a nie ich masy. Samorzutny przepływ ciepła wyrównuje temperaturę."},
        {pytanie:"Jeśli temperaturę gazu doskonałego w skali Kelvina podwoimy przy stałym ciśnieniu, co stanie się z jego objętością?",odpowiedzi:["Podwoi się","Zmniejszy się o połowę","Pozostanie taka sama"],prawidlowa:0,wzor:"V/T = const przy p = const",wskazowka:"W przemianie izobarycznej objętość jest proporcjonalna do temperatury bezwzględnej, nie do temperatury w °C."},
        {pytanie:"Która wielkość opisuje zdolność substancji do magazynowania energii przy zmianie temperatury jednostki masy?",odpowiedzi:["Ciepło właściwe c","Moc P","Przewodność elektryczna σ"],prawidlowa:0,wzor:"Q = mcΔT",wskazowka:"Szukasz współczynnika stojącego przy m i ΔT w równaniu na energię ogrzewania."},
        {pytanie:"Dlaczego metalowa łyżka w gorącej herbacie szybko robi się gorąca?",odpowiedzi:["Metal dobrze przewodzi energię cieplną","Metal nie ma cząsteczek","Herbata zwiększa temperaturę otoczenia do nieskończoności"],prawidlowa:0,wzor:"Przewodzenie ciepła",wskazowka:"Pomyśl o transporcie energii wewnątrz materiału. Dobre przewodniki pozwalają szybko przekazywać energię cieplną wzdłuż przedmiotu."},
        {pytanie:"W przemianie adiabatycznej idealnego gazu nie ma wymiany ciepła z otoczeniem. Jeśli gaz wykonuje pracę, jego energia wewnętrzna...",odpowiedzi:["Maleje","Rośnie zawsze","Nie może się zmienić"],prawidlowa:0,wzor:"ΔU = Q − W",wskazowka:"Dla przemiany adiabatycznej Q = 0. Jeśli gaz wykonuje dodatnią pracę W, podstaw to do pierwszej zasady termodynamiki."},
        {pytanie:"Dlaczego szybkowar pozwala gotować wodę w temperaturze wyższej niż 100°C?",odpowiedzi:["Wyższe ciśnienie podnosi temperaturę wrzenia","Ciśnienie obniża energię cząsteczek do zera","Woda traci ciepło właściwe"],prawidlowa:0,wzor:"T_wrzenia zależy od p",wskazowka:"Wrzenie zachodzi, gdy ciśnienie pary nasyconej zrówna się z ciśnieniem otoczenia. Zwiększenie ciśnienia przesuwa tę temperaturę w górę."}
    ],
    elektromagnetyzm: [
        {pytanie:"Do źródła 12 V podłączono opornik 6 Ω. Jak obliczyć natężenie prądu?",odpowiedzi:["I = U/R","I = UR","I = R/U"],prawidlowa:0,wzor:"U = IR",wskazowka:"Masz napięcie i opór, a szukasz natężenia. Przekształć prawo Ohma względem I i pilnuj jednostek V/Ω = A."},
        {pytanie:"Dwa oporniki 4 Ω i 6 Ω połączono szeregowo. Jaki wzór opisuje opór zastępczy?",odpowiedzi:["R_z = 4 + 6","1/R_z = 1/4 + 1/6","R_z = 4·6"],prawidlowa:0,wzor:"R_z = R₁ + R₂ dla połączenia szeregowego",wskazowka:"W szeregu przez oba oporniki płynie ten sam prąd. Opór całkowity jest sumą oporów."},
        {pytanie:"Dwa oporniki są połączone równolegle do tego samego napięcia. Który wzór jest właściwy dla oporu zastępczego?",odpowiedzi:["1/R_z = 1/R₁ + 1/R₂","R_z = R₁ + R₂","R_z = R₁R₂"],prawidlowa:0,wzor:"1/R_z = 1/R₁ + 1/R₂",wskazowka:"W połączeniu równoległym napięcie na gałęziach jest takie samo. Sumują się odwrotności oporów."},
        {pytanie:"Urządzenie pobiera 2 A z sieci 230 V. Jak obliczyć jego moc elektryczną?",odpowiedzi:["P = UI","P = U/I","P = I/U"],prawidlowa:0,wzor:"P = UI",wskazowka:"Moc to szybkość przekazywania energii. Przy znanym napięciu i natężeniu użyj ich iloczynu."},
        {pytanie:"Ładunek dodatni znajduje się w jednorodnym polu elektrycznym. W którą stronę działa na niego siła elektryczna?",odpowiedzi:["Zgodnie z kierunkiem pola","Przeciwnie do kierunku pola","Zawsze prostopadle do pola"],prawidlowa:0,wzor:"F = qE",wskazowka:"Dla q > 0 wektor siły ma ten sam kierunek co wektor natężenia pola. Dla ładunku ujemnego kierunek byłby przeciwny."},
        {pytanie:"Jeśli odległość między dwoma punktowymi ładunkami zwiększymy dwukrotnie, jak zmieni się wartość siły Coulomba?",odpowiedzi:["Zmniejszy się czterokrotnie","Zmniejszy się dwukrotnie","Zwiększy się czterokrotnie"],prawidlowa:0,wzor:"F = k|q₁q₂|/r²",wskazowka:"Odległość występuje w mianowniku w drugiej potędze. Podstaw 2r zamiast r i porównaj oba wyrażenia."},
        {pytanie:"Przez przewodnik przepłynęło 12 C w czasie 4 s. Jak obliczyć natężenie prądu?",odpowiedzi:["I = Q/t","I = Qt","I = t/Q"],prawidlowa:0,wzor:"I = ΔQ/Δt",wskazowka:"Natężenie mówi, ile ładunku przepływa w jednostce czasu. Podziel przepływający ładunek przez czas."},
        {pytanie:"Akumulator oddaje 3600 J energii w czasie 60 s. Jak obliczyć średnią moc?",odpowiedzi:["P = E/t","P = Et","P = t/E"],prawidlowa:0,wzor:"P = ΔE/Δt",wskazowka:"Moc jest tempem przekazywania energii. Podziel energię przez czas i sprawdź, czy jednostką jest wat."},
        {pytanie:"Przewodnik porusza się przez pole magnetyczne tak, że jego prędkość jest równoległa do linii pola. Jaka jest siła Lorentza na ładunek?",odpowiedzi:["Zero","Maksymalna","Zawsze równa qvB"],prawidlowa:0,wzor:"F = |q|vB sinθ",wskazowka:"Przy ruchu równoległym θ = 0°. Sprawdź wartość sinθ zamiast zapamiętywać samą postać qvB."},
        {pytanie:"Co musi się zmieniać, aby w zamkniętej pętli powstała siła elektromotoryczna indukcji?",odpowiedzi:["Strumień pola magnetycznego przez pętlę","Tylko opór przewodnika","Tylko temperatura przewodnika"],prawidlowa:0,wzor:"ε = −dΦ/dt",wskazowka:"Nie wystarczy samo pole magnetyczne. Szukaj zmiany strumienia, która może wynikać ze zmiany pola, powierzchni lub orientacji pętli."},
        {pytanie:"Przy stałym napięciu zwiększono opór odbiornika czterokrotnie. Co dzieje się z mocą odbiornika?",odpowiedzi:["Maleje czterokrotnie","Rośnie czterokrotnie","Nie zmienia się"],prawidlowa:0,wzor:"P = U²/R",wskazowka:"Skoro U jest stałe, wybierz postać wzoru na moc zawierającą U i R. Opór znajduje się w mianowniku."},
        {pytanie:"Dlaczego bezpiecznik topi się przy zbyt dużym prądzie?",odpowiedzi:["Duży prąd powoduje większe wydzielanie ciepła w przewodniku","Prąd zmniejsza masę metalu","Pole elektryczne zamraża przewodnik"],prawidlowa:0,wzor:"P = I²R",wskazowka:"Wzrost prądu silnie zwiększa moc cieplną wydzielaną na oporze. Zwróć uwagę na kwadrat natężenia."}
    ],
    fale_drgania: [
        {pytanie:"Fala ma długość 0,8 m i częstotliwość 250 Hz. Jak znaleźć jej prędkość?",odpowiedzi:["v = λf","v = λ/f","v = f/λ"],prawidlowa:0,wzor:"v = λf",wskazowka:"Pomnóż długość jednej fali przez liczbę fal przechodzących w ciągu sekundy. Jednostka wyniku powinna być m/s."},
        {pytanie:"Wahadło wykonuje 20 pełnych drgań w 10 s. Jak wyznaczyć okres?",odpowiedzi:["T = 10/20","T = 20/10","T = 10·20"],prawidlowa:0,wzor:"T = t/N",wskazowka:"Okres to czas przypadający na jedno pełne drganie. Podziel całkowity czas przez liczbę drgań."},
        {pytanie:"Jeśli okres drgań zmniejszy się dwukrotnie, co stanie się z częstotliwością?",odpowiedzi:["Wzrośnie dwukrotnie","Zmniejszy się dwukrotnie","Nie zmieni się"],prawidlowa:0,wzor:"f = 1/T",wskazowka:"Częstotliwość jest odwrotnością okresu. Zastanów się, ile drgań w tej samej sekundzie odpowiada krótszemu okresowi."},
        {pytanie:"Fala przechodzi do ośrodka, w którym porusza się wolniej. Źródło pozostaje takie samo. Co dzieje się z długością fali?",odpowiedzi:["Zmniejsza się","Zwiększa się","Nie zmienia się"],prawidlowa:0,wzor:"λ = v/f",wskazowka:"Częstotliwość jest ustalana przez źródło i przy przejściu do innego ośrodka pozostaje taka sama. Zmienna jest prędkość, więc wyznacz λ."},
        {pytanie:"Dwa źródła fal zgodnych w fazie tworzą w punkcie różnicę dróg równą 2λ. Jaki typ interferencji jest możliwy?",odpowiedzi:["Konstruktywna","Destruktywna","Nie da się określić bez masy źródeł"],prawidlowa:0,wzor:"Δr = mλ → wzmocnienie",wskazowka:"Różnica dróg równa całkowitej wielokrotności długości fali oznacza zgodność fazową w punkcie obserwacji."},
        {pytanie:"Dla różnicy dróg równej λ/2 fale zgodne w fazie mogą się w punkcie...",odpowiedzi:["Wygaszać","Wzmacniać maksymalnie","Zawsze pozostawać niezależne"],prawidlowa:0,wzor:"Δr = (m + 1/2)λ → wygaszenie",wskazowka:"Połówka długości fali odpowiada zmianie fazy o π. Zastanów się, jaki jest wtedy znak amplitud w punkcie."},
        {pytanie:"Źródło dźwięku zbliża się do nieruchomego obserwatora. Jak zmienia się częstotliwość odbierana przez obserwatora?",odpowiedzi:["Rośnie","Maleje","Pozostaje zawsze taka sama"],prawidlowa:0,wzor:"Efekt Dopplera: zbliżanie → f' > f",wskazowka:"Przy zbliżaniu kolejne fronty fali docierają do obserwatora w krótszych odstępach czasu. Krótszy odstęp oznacza większą częstotliwość."},
        {pytanie:"Co oznacza większa amplituda drgań źródła dźwięku, jeśli częstotliwość pozostaje stała?",odpowiedzi:["Większą energię/intensywność fali, a nie wyższy ton","Wyższą częstotliwość","Zmianę prędkości dźwięku w tym samym ośrodku"],prawidlowa:0,wzor:"I ∝ A²",wskazowka:"Oddziel cechę związaną z częstotliwością od cechy związanej z amplitudą. Częstotliwość wpływa na wysokość tonu, amplituda na energię/intensywność."},
        {pytanie:"Na szczelinie o szerokości porównywalnej z długością fali obserwujemy silne ugięcie. Jakie zjawisko opisuje tę sytuację?",odpowiedzi:["Dyfrakcja","Polaryzacja","Indukcja elektromagnetyczna"],prawidlowa:0,wzor:"Silna dyfrakcja, gdy a ~ λ",wskazowka:"Porównaj rozmiar przeszkody lub szczeliny z długością fali. Ugięcie staje się wyraźne, gdy są podobnego rzędu."},
        {pytanie:"Fala na strunie ma prędkość 12 m/s i częstotliwość 4 Hz. Jaką ma długość?",odpowiedzi:["3 m","48 m","0,33 m"],prawidlowa:0,wzor:"λ = v/f",wskazowka:"Przekształć v = λf względem λ. Nie dziel przez okres — tutaj bezpośrednio znasz częstotliwość."},
        {pytanie:"W punkcie węzłowym fali stojącej wychylenie pozostaje równe zero. Jak interpretować ten punkt?",odpowiedzi:["Fale składowe wygaszają się tam w wyniku interferencji","Tam fala ma największą amplitudę","Tam nie istnieje żadne pole"],prawidlowa:0,wzor:"Interferencja destruktywna → A = 0",wskazowka:"Fala stojąca powstaje z nałożenia dwóch fal biegnących w przeciwnych kierunkach. W węźle ich wychylenia znoszą się w każdej chwili."},
        {pytanie:"Dlaczego dźwięk nie rozchodzi się w próżni?",odpowiedzi:["Potrzebuje ośrodka materialnego, którego cząsteczki przekazują drgania","W próżni grawitacja jest za mała","Dźwięk jest zawsze światłem"],prawidlowa:0,wzor:"Fala mechaniczna wymaga ośrodka",wskazowka:"Dźwięk jest falą mechaniczną. Zastanów się, co ma drgać i przekazywać zaburzenie, jeśli nie ma cząsteczek ośrodka."}
    ],
    optyka: [
        {pytanie:"Promień pada na płaskie lustro pod kątem 35° do normalnej. Jaki jest kąt odbicia?",odpowiedzi:["35°","55°","70°"],prawidlowa:0,wzor:"θᵢ = θᵣ",wskazowka:"W prawie odbicia oba kąty mierzy się od normalnej. Nie zamieniaj podanego kąta na kąt do powierzchni, jeśli w zadaniu już podano kąt do normalnej."},
        {pytanie:"Promień pada na lustro pod kątem 30° do jego powierzchni. Jaki kąt padania należy użyć w prawie odbicia?",odpowiedzi:["60°","30°","90°"],prawidlowa:0,wzor:"θ_do_normalnej = 90° − θ_do_powierzchni",wskazowka:"Normalna jest prostopadła do powierzchni. Najpierw zamień kąt względem lustra na kąt względem normalnej, dopiero potem zastosuj θᵢ = θᵣ."},
        {pytanie:"Promień przechodzi z powietrza do szkła. Współczynnik załamania szkła jest większy. Co dzieje się z kątem względem normalnej?",odpowiedzi:["Zmniejsza się","Zwiększa się","Zawsze pozostaje taki sam"],prawidlowa:0,wzor:"n₁ sinθ₁ = n₂ sinθ₂",wskazowka:"Przy przejściu do optycznie gęstszego ośrodka n rośnie. Aby zachować równość w prawie Snelliusa, sinθ₂ musi się zmniejszyć."},
        {pytanie:"Soczewka skupiająca ma f = 10 cm, a przedmiot stoi 30 cm od niej. Który układ obliczeń prowadzi do odległości obrazu?",odpowiedzi:["1/10 = 1/30 + 1/y","10 = 30 + y","1/y = 10 + 30"],prawidlowa:0,wzor:"1/f = 1/x + 1/y",wskazowka:"Podstaw f i odległość przedmiotu x. Następnie odizoluj 1/y, a na końcu odwróć wartość, aby otrzymać y."},
        {pytanie:"Przedmiot znajduje się dalej niż 2f przed soczewką skupiającą. Jaki obraz otrzymamy?",odpowiedzi:["Rzeczywisty, odwrócony i pomniejszony","Pozorny, prosty i powiększony","Rzeczywisty i zawsze tej samej wielkości"],prawidlowa:0,wzor:"1/f = 1/x + 1/y",wskazowka:"Porównaj x z 2f. Możesz też narysować dwa promienie konstrukcyjne: równoległy do osi i przechodzący przez środek optyczny."},
        {pytanie:"Kąt graniczny przy przejściu ze szkła do powietrza zależy od...",odpowiedzi:["Stosunku współczynników załamania ośrodków","Masy soczewki","Jasności źródła"],prawidlowa:0,wzor:"sinθ_g = n₂/n₁ dla n₁ > n₂",wskazowka:"Całkowite wewnętrzne odbicie jest możliwe tylko przy przejściu z większego n do mniejszego. Zapisz warunek dla kąta, przy którym promień załamany biegnie wzdłuż granicy."},
        {pytanie:"Dlaczego nie widzimy ostrego obrazu przedmiotu ustawionego w ognisku soczewki skupiającej na ekranie w skończonej odległości?",odpowiedzi:["Promienie po przejściu przez soczewkę stają się równoległe","Soczewka pochłania całe światło","Obraz zawsze powstaje przed soczewką"],prawidlowa:0,wzor:"x = f → y → ∞",wskazowka:"Wstaw x = f do równania soczewki. Otrzymasz sytuację, w której promienie po soczewce są równoległe, więc nie przecinają się w skończonej odległości."},
        {pytanie:"W zwierciadle wklęsłym promień biegnący równolegle do osi głównej po odbiciu przechodzi przez...",odpowiedzi:["Ognisko","Środek zwierciadła zawsze","Punkt przypadkowy"],prawidlowa:0,wzor:"Promień równoległy → ognisko",wskazowka:"To podstawowa reguła konstrukcji obrazu. Narysuj oś główną, ognisko i promień padający równolegle do osi."},
        {pytanie:"Jakie powiększenie otrzymamy, jeśli obraz ma wysokość 2 cm, a przedmiot 5 cm?",odpowiedzi:["|m| = 2/5","|m| = 5/2","|m| = 2 + 5"],prawidlowa:0,wzor:"|m| = |h'/h|",wskazowka:"Powiększenie liniowe to stosunek wysokości obrazu do wysokości przedmiotu. Najpierw podziel 2 cm przez 5 cm."},
        {pytanie:"Dlaczego niebo przy zachodzie Słońca może być czerwone?",odpowiedzi:["Krótsze fale są silniej rozpraszane, a światło do obserwatora przechodzi przez dłuższą drogę w atmosferze","Czerwone światło ma największą częstotliwość","Atmosfera emituje wyłącznie czerwone światło"],prawidlowa:0,wzor:"Rozpraszanie Rayleigha ∝ 1/λ⁴",wskazowka:"Porównaj długości fal światła niebieskiego i czerwonego oraz to, jak silnie atmosfera rozprasza krótsze fale."},
        {pytanie:"Dwa polaryzatory są ustawione pod kątem 90°. Co stanie się z idealnie spolaryzowanym światłem?",odpowiedzi:["Nie przejdzie przez drugi polaryzator","Przejdzie bez zmiany natężenia","Zostanie zamienione w dźwięk"],prawidlowa:0,wzor:"I = I₀ cos²θ",wskazowka:"Użyj prawa Malusa. Dla kąta 90° cos90° = 0, więc sprawdź, co dzieje się z natężeniem za drugim polaryzatorem."},
        {pytanie:"W doświadczeniu Younga zwiększono odległość między szczelinami, zachowując pozostałe parametry. Co stanie się z odległością między prążkami?",odpowiedzi:["Zmniejszy się","Zwiększy się","Nie zmieni się"],prawidlowa:0,wzor:"Δx = λL/d",wskazowka:"Odległość między prążkami jest odwrotnie proporcjonalna do odległości d między szczelinami. Sprawdź zmianę w mianowniku."}
    ],
    mechanika_kwantowa_jadrowa: [
        ...pulePytanDzialow.kwantowa,
        {pytanie:"Foton o częstotliwości 6·10¹⁴ Hz jest emitowany przez atom. Jak wyznaczyć energię tego fotonu?",odpowiedzi:["E = hf","E = h/f","E = f/h"],prawidlowa:0,wzor:"E = hf",wskazowka:"Energia pojedynczego fotonu jest proporcjonalna do częstotliwości. Podstaw częstotliwość do E = hf i pilnuj jednostki dżula."},
        {pytanie:"Elektron przechodzi na poziom o niższej energii. Co musi się stać z energią układu?",odpowiedzi:["Różnica energii zostaje oddana, np. w postaci fotonu","Elektron pobiera energię bez źródła","Energia poziomów znika"],prawidlowa:0,wzor:"ΔE = hf",wskazowka:"Porównaj energię stanu początkowego i końcowego. Ubytek energii elektronu musi odpowiadać energii wyemitowanego kwantu."},
        {pytanie:"Długość fali de Broglie'a cząstki zmniejszyła się dwukrotnie. Jak zmienił się jej pęd?",odpowiedzi:["Wzrósł dwukrotnie","Zmalał dwukrotnie","Nie zmienił się"],prawidlowa:0,wzor:"λ = h/p",wskazowka:"Stała Plancka się nie zmienia. Z równania λ = h/p wynika odwrotna proporcjonalność długości fali i pędu."},
        {pytanie:"Próbka promieniotwórcza ma okres półtrwania 4 dni. Jaka część jąder pozostaje po 12 dniach?",odpowiedzi:["1/8","1/3","1/12"],prawidlowa:0,wzor:"N = N₀(1/2)^(t/T₁/₂)",wskazowka:"Najpierw policz, ile pełnych okresów półtrwania mieści się w czasie 12 dni. Potem zastosuj połowę pozostałej liczby po każdym okresie."},
        {pytanie:"Dlaczego zwiększenie częstotliwości fotonu może zwiększyć jego energię, mimo że prędkość światła w próżni się nie zmienia?",odpowiedzi:["Bo E = hf, a prędkość światła nie występuje w tym związku jako czynnik zmieniający energię","Bo foton zwalnia","Bo masa fotonu rośnie wprost proporcjonalnie do częstotliwości"],prawidlowa:0,wzor:"E = hf",wskazowka:"Oddziel dwie zależności: dla fotonu E zależy od f, a c = λf wiąże długość fali z częstotliwością przy stałej prędkości światła."},
        {pytanie:"W doświadczeniu fotoelektrycznym światło ma częstotliwość poniżej częstotliwości granicznej metalu. Co stanie się po zwiększeniu samego natężenia tego światła?",odpowiedzi:["Elektrony nadal nie zostaną wybite","Elektrony będą wybite z większą energią","Praca wyjścia metalu spadnie do zera"],prawidlowa:0,wzor:"hf ≥ W + E_k,max",wskazowka:"Najpierw sprawdź warunek progowy dla pojedynczego fotonu. Zwiększenie natężenia zwiększa liczbę fotonów, ale nie ich energię, jeśli częstotliwość pozostaje za mała."},
        {pytanie:"Proton i neutron mają budowę kwarkową. Ile kwarków walencyjnych opisuje podstawowy skład nukleonu?",odpowiedzi:["Trzy","Dwa","Cztery"],prawidlowa:0,wzor:"proton = uud, neutron = udd",wskazowka:"Zapamiętaj układ dwóch typów kwarków w nukleonach: proton ma dwa u i jedno d, neutron dwa d i jedno u."},
        {pytanie:"Jeśli energia wiązania jądra na nukleon jest duża, co mówi to o stabilności w porównaniu z jądrem o bardzo małej energii wiązania na nukleon?",odpowiedzi:["Zwykle większa energia wiązania na nukleon oznacza większą stabilność","Zawsze oznacza natychmiastowy rozpad","Nie ma żadnego związku ze stabilnością"],prawidlowa:0,wzor:"E_wiązania/nukleon jako miara związania jądra",wskazowka:"Energia wiązania opisuje, jak dużo energii trzeba dostarczyć, by rozdzielić składniki. Porównuj ją na jeden nukleon, jeśli porównujesz różne rozmiary jąder."}
    ],
    teoria_wzglednosci: [
        ...pulePytanDzialow.wzglednosc,
        {pytanie:"Zegar poruszający się względem obserwatora z dużą prędkością chodzi wolniej z punktu widzenia tego obserwatora. Jaką zależność trzeba zastosować?",odpowiedzi:["Δt = γΔτ","Δt = Δτ/γ²","Δt = γ + Δτ"],prawidlowa:0,wzor:"γ = 1/√(1−v²/c²)",wskazowka:"Rozróżnij czas własny Δτ mierzony przez zegar od czasu Δt obserwatora. Najpierw oblicz czynnik Lorentza γ, potem zastosuj Δt = γΔτ."},
        {pytanie:"Statek kosmiczny porusza się z prędkością 0,8c. Dlaczego nie można użyć klasycznego dodawania prędkości bez poprawki relatywistycznej?",odpowiedzi:["Bo wynik klasyczny mógłby przekroczyć c, a transformacja Lorentza zachowuje granicę prędkości światła","Bo masa statku staje się zerowa","Bo czas przestaje istnieć"],prawidlowa:0,wzor:"u' = (u+v)/(1+uv/c²)",wskazowka:"Przy dużych prędkościach dzielenie przez c nie jest pomijalne. Użyj relatywistycznego wzoru dodawania prędkości zamiast u+v."},
        {pytanie:"Obiekt porusza się coraz szybciej i jego prędkość zbliża się do c. Co dzieje się z czynnikiem Lorentza γ?",odpowiedzi:["Rośnie bez ograniczenia, gdy v → c","Maleje do zera","Pozostaje równy 1"],prawidlowa:0,wzor:"γ = 1/√(1−v²/c²)",wskazowka:"Sprawdź mianownik. Gdy v/c zbliża się do 1, wyrażenie pod pierwiastkiem zbliża się do zera."},
        {pytanie:"Dlaczego długość poruszającego się pręta mierzoną wzdłuż kierunku ruchu ocenia się inaczej niż jego długość własną?",odpowiedzi:["Występuje kontrakcja długości związana z ruchem względem obserwatora","Bo materiał zmienia gęstość do zera","Bo poprzeczny wymiar również musi zniknąć"],prawidlowa:0,wzor:"L = L₀/γ",wskazowka:"Długość własna L₀ jest mierzona w układzie, w którym pręt spoczywa. Dla obserwatora, względem którego pręt się porusza, kontrakcja dotyczy kierunku ruchu."},
        {pytanie:"Dwa zdarzenia są rozdzielone przestrzennie. Czy wszyscy obserwatorzy muszą zmierzyć między nimi ten sam odstęp czasu?",odpowiedzi:["Nie, czas i przestrzeń zależą od układu odniesienia","Tak, czas jest absolutny","Tylko obserwator na Ziemi mierzy prawdziwy czas"],prawidlowa:0,wzor:"Transformacje Lorentza",wskazowka:"W szczególnej teorii względności czas i odległość nie są niezależnymi absolutami. Rozważ zmianę układu odniesienia zamiast zakładać wspólny czas dla wszystkich."},
        {pytanie:"Energia spoczynkowa ciała zależy od jego masy spoczynkowej. Co stanie się z nią, gdy ciało przyspieszy?",odpowiedzi:["Energia spoczynkowa E₀ = mc² pozostaje związana z tą samą masą spoczynkową","E₀ natychmiast spada do zera","E₀ zależy od kierunku ruchu"],prawidlowa:0,wzor:"E₀ = mc²",wskazowka:"Nie myl energii spoczynkowej z całkowitą energią relatywistyczną. Przy ruchu rośnie energia całkowita, ale E₀ definiuje masa spoczynkowa."},
        {pytanie:"Dlaczego masywne ciało nie może zostać rozpędzone do dokładnie c przez dostarczanie coraz większej energii?",odpowiedzi:["Czynnik γ rośnie bez ograniczenia, więc wymagania energetyczne rosną bez granicy","Bo grawitacja zawsze je zatrzymuje","Bo jego masa spoczynkowa znika"],prawidlowa:0,wzor:"E = γmc²",wskazowka:"Sprawdź zachowanie γ przy v → c. Im bliżej c, tym większa energia jest potrzebna do dalszego zwiększania prędkości."},
        {pytanie:"W pobliżu masywnego obiektu światło może zmienić kierunek. Jak opisuje to ogólna teoria względności?",odpowiedzi:["Masa zakrzywia czasoprzestrzeń, a światło porusza się po zakrzywionych geodezyjnych","Foton dostaje klasyczną siłę tarcia","Światło zwalnia do zera"],prawidlowa:0,wzor:"Geodezyjne w zakrzywionej czasoprzestrzeni",wskazowka:"Nie traktuj zjawiska jak zwykłego odbicia. W ogólnej teorii względności geometria czasoprzestrzeni wyznacza tor swobodnego ruchu światła."}
    ],
    fizyka_materialow: [
        ...pulePytanDzialow.materialy,
        {pytanie:"Próbka rozciąga się proporcjonalnie do przyłożonej siły w małym zakresie obciążenia. Jakie prawo opisuje tę zależność dla modelu sprężystego?",odpowiedzi:["Prawo Hooke'a","Prawo Ohma","Prawo Archimedesa"],prawidlowa:0,wzor:"F = kΔx",wskazowka:"W zakresie sprężystym siła odkształcająca jest proporcjonalna do wydłużenia. Rozpoznaj, która wielkość pełni rolę współczynnika sprężystości."},
        {pytanie:"Dwa materiały mają ten sam moduł Younga, ale różne pola przekroju. Który przy tej samej sile wydłuży się bardziej?",odpowiedzi:["Ten o mniejszym polu przekroju","Ten o większym polu przekroju","Oba tak samo niezależnie od pola"],prawidlowa:0,wzor:"σ = F/A, ε = ΔL/L, E = σ/ε",wskazowka:"Przy tej samej sile mniejsze A daje większe naprężenie σ. Następnie użyj relacji σ = Eε, jeśli E jest takie samo."},
        {pytanie:"Dlaczego dodanie niewielkiej ilości domieszki może zmienić przewodnictwo półprzewodnika o wiele bardziej niż metalu?",odpowiedzi:["Domieszki mogą silnie zmieniać liczbę dostępnych nośników ładunku","Metal nie ma elektronów","Półprzewodnik nie ma pasm energetycznych"],prawidlowa:0,wzor:"σ = nqμ",wskazowka:"Przewodnictwo zależy od koncentracji nośników i ich ruchliwości. W półprzewodniku domieszkowanie może znacząco zmienić n."},
        {pytanie:"Materiał pęka niemal bez zauważalnego odkształcenia plastycznego. Jaką cechę można mu przypisać?",odpowiedzi:["Kruchość","Dużą plastyczność","Idealną sprężystość"],prawidlowa:0,wzor:"Kruchość = mała zdolność do odkształceń plastycznych przed pęknięciem",wskazowka:"Patrz na zachowanie tuż przed zniszczeniem. Jeśli próbka pęka bez znacznego trwałego odkształcenia, mówimy o zachowaniu kruchym."},
        {pytanie:"Dyslokacje ułatwiają trwałe odkształcanie kryształu. Co się stanie, jeśli ich ruch zostanie utrudniony przez domieszki?",odpowiedzi:["Materiał może stać się bardziej wytrzymały","Materiał zawsze straci całą sztywność","Temperatura topnienia musi spaść do zera"],prawidlowa:0,wzor:"Utrudnienie ruchu dyslokacji → wzrost wytrzymałości",wskazowka:"Odkształcenie plastyczne wymaga ruchu dyslokacji. Jeśli przeszkody ten ruch blokują, większe naprężenie jest potrzebne do dalszego odkształcenia."},
        {pytanie:"Dlaczego włókna w kompozycie mogą zwiększać jego wytrzymałość w określonym kierunku?",odpowiedzi:["Przenoszą znaczną część obciążenia wzdłuż własnego kierunku","Zawsze zmniejszają gęstość do zera","Nie oddziałują z osnową"],prawidlowa:0,wzor:"Anizotropia i przenoszenie naprężeń w kompozycie",wskazowka:"Zwróć uwagę na kierunek ułożenia włókien. Kompozyt może mieć inne właściwości wzdłuż włókien i poprzecznie do nich."},
        {pytanie:"Przy tym samym naprężeniu materiał o większym module Younga odkształca się mniej. Dlaczego?",odpowiedzi:["Bo ε = σ/E, więc większe E daje mniejsze odkształcenie względne","Bo E jest siłą działającą na próbkę","Bo większe E oznacza większą temperaturę"],prawidlowa:0,wzor:"E = σ/ε",wskazowka:"Przekształć definicję modułu Younga względem ε. Przy stałym σ zwiększenie E musi zmniejszyć odkształcenie."},
        {pytanie:"W materiale o strukturze krystalicznej kierunek przewodzenia ciepła może zależeć od kierunku w sieci. Jak nazywa się taka cecha?",odpowiedzi:["Anizotropia","Izotropia","Radioaktywność"],prawidlowa:0,wzor:"Anizotropia = zależność właściwości od kierunku",wskazowka:"Jeśli ta sama właściwość ma różne wartości przy pomiarze w różnych kierunkach, materiał nie zachowuje się izotropowo."}
    ],
    astronomia: [
        ...pulePytanDzialow.astronomia,
        {pytanie:"Planeta jest bliżej Słońca w jednym fragmencie orbity. Jak zmienia się jej prędkość orbitalna zgodnie z II prawem Keplera?",odpowiedzi:["Rośnie w pobliżu Słońca","Maleje w pobliżu Słońca","Pozostaje zawsze identyczna"],prawidlowa:0,wzor:"II prawo Keplera: rysowane pola są zakreślane w równych czasach",wskazowka:"W równych czasach promień wodzący zakreśla równe pola. Przy mniejszym r trzeba więc pokonać większy łuk, aby zachować tę samą zmianę pola."},
        {pytanie:"Jeśli półoś wielka orbity wzrośnie dwukrotnie wokół tego samego Słońca, jak zmieni się okres obiegu?",odpowiedzi:["Wzrośnie 2√2 razy","Wzrośnie dwukrotnie","Zmniejszy się 2√2 razy"],prawidlowa:0,wzor:"T² ∝ a³",wskazowka:"Nie skaluj okresu liniowo. Zapisz T₂/T₁ = (a₂/a₁)^(3/2) i dopiero wtedy podstaw stosunek półosi."},
        {pytanie:"Dwie identyczne gwiazdy są w odległościach d i 3d. Jak porównać odbierany strumień energii?",odpowiedzi:["Dalsza daje 9 razy mniejszy strumień","Dalsza daje 3 razy mniejszy strumień","Obie dają taki sam strumień"],prawidlowa:0,wzor:"F = L/(4πd²)",wskazowka:"Strumień maleje z kwadratem odległości. Porównaj kwadraty d i 3d, zamiast odejmować odległości."},
        {pytanie:"W widmie galaktyki wszystkie charakterystyczne linie są przesunięte ku czerwieni. Co jest bezpośrednim wnioskiem o jej ruchu wzdłuż linii widzenia?",odpowiedzi:["Oddala się od nas","Zbliża się do nas","Nie da się stwierdzić kierunku"],prawidlowa:0,wzor:"Efekt Dopplera: λ' > λ przy oddalaniu",wskazowka:"Porównaj obserwowaną długość fali z laboratoryjną. Wydłużenie długości fali odpowiada ruchowi źródła w stronę oddalania."},
        {pytanie:"Dlaczego analiza widma pozwala określić obecność konkretnych pierwiastków w gwieździe?",odpowiedzi:["Pierwiastki mają charakterystyczne układy linii widmowych wynikające z poziomów energii","Każdy pierwiastek ma inną masę, więc ma inny kolor całej gwiazdy","Widmo zależy wyłącznie od odległości"],prawidlowa:0,wzor:"Linie widmowe ↔ przejścia między poziomami energii",wskazowka:"Nie porównuj tylko ogólnego koloru. Szukaj położenia konkretnych linii i zestaw je z widmami laboratoryjnymi."},
        {pytanie:"Masywna gwiazda zużywa paliwo szybciej niż gwiazda podobna do Słońca. Jaki skutek ma to dla jej życia?",odpowiedzi:["Może żyć krócej mimo większej ilości paliwa","Musi żyć dłużej","Jej czas życia nie zależy od masy"],prawidlowa:0,wzor:"Większa masa → większa jasność i szybsze zużycie paliwa",wskazowka:"Porównaj ilość paliwa z tempem jego zużywania. Nie wystarczy powiedzieć, że masywna gwiazda ma go więcej."},
        {pytanie:"Jak soczewkowanie grawitacyjne może zwiększyć obserwowalność bardzo odległej galaktyki?",odpowiedzi:["Masywny obiekt między nami a galaktyką może zakrzywić i powiększyć jej obraz","Zwiększa rzeczywistą moc gwiazd w galaktyce","Przesuwa galaktykę bliżej Ziemi"],prawidlowa:0,wzor:"Grawitacyjne ugięcie światła",wskazowka:"Rozważ masę leżącą na linii widzenia. Jej zakrzywienie czasoprzestrzeni zmienia tory promieni i może działać jak naturalna soczewka."},
        {pytanie:"Dlaczego obserwowana jasność gwiazdy nie wystarcza sama w sobie do określenia jej mocy promieniowania?",odpowiedzi:["Zależy także od odległości do gwiazdy","Bo jasność nie ma związku z energią","Bo wszystkie gwiazdy mają tę samą odległość od Ziemi"],prawidlowa:0,wzor:"F = L/(4πd²)",wskazowka:"Oddziel jasność obserwowaną od całkowitej mocy promieniowania. Wzór zawiera zarówno L, jak i odległość d."}
    ]
};

const WZORCE_SLABYCH_PYTAN = [
    /które zdanie najlepiej opisuje/i, /które stwierdzenie najlepiej opisuje/i, /najlepiej opisuje pojęcie/i,
    /jeżeli wszystkie dane.*podwoim/i, /jeśli wszystkie dane.*podwoim/i,
    /bez sprawdzenia wzoru/i, /wynik wynosi .* w jednostce si/i,
    /co należy sprawdzić/i, /która informacja jest potrzebna/i,
    /co najlepiej pozwoli wykryć błąd/i, /zmieniono warunki doświadczenia/i,
    /która wielkość fizyczna termometr mierzy bezpośrednio/i,
    /w doświadczeniu dotyczącym/i, /który wykres lub pomiar najlepiej/i, /jak definiuje się/i, /jaka jednostka SI opisuje/i, /co oznacza.*w fizyce/i, /jaki jest warunek.*prawa/i
];
const WZORCE_ABSURDALNYCH_ODPOWIEDZI = [
    /masa.*znika/i, /grawitacja.*nie działa/i, /zamienione? w dźwięk/i,
    /do nieskończoności/i, /punkt przypadkowy/i, /zawsze natychmiast/i,
    /zawsze.*niezależnie/i, /koloru.*ciała/i, /nie ma cząsteczek/i
];
function pytanieJestDobre(zadanie) {
    if (!zadanie || !zadanie.pytanie || !Array.isArray(zadanie.odpowiedzi) || zadanie.odpowiedzi.length < 3) return false;
    if (WZORCE_SLABYCH_PYTAN.some(w => w.test(zadanie.pytanie))) return false;
    if (zadanie.odpowiedzi.some(a => WZORCE_ABSURDALNYCH_ODPOWIEDZI.some(w => w.test(String(a))))) return false;
    return new Set(zadanie.odpowiedzi.map(a => String(a).trim().toLowerCase())).size === zadanie.odpowiedzi.length;
}

function dzialDlaTematu(temat) {
    const t = temat.toLowerCase();
    if (/(względ|dylatac|kontrakc|czasoprzestrz|czarna dziura|fale grawitacyjne|einstein)/.test(t)) return "teoria_wzglednosci";
    if (/(kwant|fotoelektr|jądro|jądrow|radioakty|rozpad|półtrwania|wiązania|bohra|nieoznacz|dualizm|cząstki elementarne|foton)/.test(t)) return "mechanika_kwantowa_jadrowa";
    if (/(materiał|krystal|twardo|przewodnict|sprężyst|plastycz|defekt|sieci przestrz|kompozyt)/.test(t)) return "fizyka_materialow";
    if (/(gwiazd|planet|kepler|galakty|wszechświat|widm|astronom|kosmolog|orbita|czarne dziur|grawitac)/.test(t)) return "grawitacja_astronomia";
    if (/(odbici|załam|soczew|zwierciad|optycz|oko|polaryzacj|światł)/.test(t)) return "optyka";
    if (/(fala|drgan|dźwięk|doppler|interferencj|dyfrakcj|częstotliwość|amplitud|okres)/.test(t)) return "fale_drgania";
    if (/(temperatur|ciepł|gaz|termodynam|energia wewnętrz|przemian)/.test(t)) return "termodynamika";
    if (/(ładunek|pole elektry|coulomba|prąd|napięcie|opór|ohm|moc.*prąd|kirchhoff|opornik|magnetycz|lorentza|indukcj)/.test(t)) return "elektromagnetyzm";
    return "mechanika";
}

function oczyscTekstPodpowiedzi(tekst) {
    let wynik = String(tekst ?? "").trim();
    if (!wynik) return "";
    // Starsze dane mogły zawierać gotowy HTML. Nigdy nie pokazujemy go jako tekstu.
    if (/<\/?[a-z][^>]*>/i.test(wynik)) {
        const parser = document.createElement("div");
        parser.innerHTML = wynik;
        wynik = parser.textContent || parser.innerText || "";
    }
    return wynik
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function uzupelnijPodpowiedz(zadanie) {
    const pytanie = oczyscTekstPodpowiedzi(zadanie?.pytanie || "");
    const wzor = oczyscTekstPodpowiedzi(zadanie?.wzor || "");
    const istniejaca = oczyscTekstPodpowiedzi(zadanie?.wskazowka || "");
    const tekst = `${pytanie} ${wzor}`.toLowerCase();
    const kroki = [];

    // Najpierw wykorzystujemy wskazówkę autora konkretnego zadania.
    if (istniejaca) kroki.push(istniejaca);

    if (wzor) {
        kroki.push(`W tym zadaniu przyda Ci się zależność: ${wzor}. Zastanów się, które wielkości z treści odpowiadają symbolom we wzorze.`);
    }

    if (/droga|prędkość|czas|ruch jednostaj|v\s*=/.test(tekst)) {
        kroki.push("Porównaj podaną drogę i czas z tym, czego szukasz. Jeśli występują różne jednostki czasu lub prędkości, sprowadź je do wspólnych jednostek przed obliczeniem.");
    } else if (/przyspies|opóźn|spadek swobod|rzut pion|grawitac/.test(tekst)) {
        kroki.push("Zwróć uwagę na zmianę prędkości w czasie. Ustal znak przyspieszenia zgodnie z wybranym kierunkiem osi, a dopiero potem podstaw dane.");
    } else if (/sił|newton|dynamik|tarci|moment/.test(tekst)) {
        kroki.push("Najpierw ustal, jakie siły rzeczywiście działają na ciało. Dopiero z ich kierunków i wartości wyznacz wielkość, o którą pyta zadanie.");
    } else if (/energi|prac[ay]|moc|pęd/.test(tekst)) {
        kroki.push("Najpierw rozpoznaj, jaka wielkość fizyczna zmienia się w zadaniu. Wybierz zależność, która łączy tę wielkość z podanymi danymi.");
    } else if (/kąt|odbici|załam|soczew|zwierciad|ognisk/.test(tekst)) {
        kroki.push("Zrób prosty szkic i zaznacz normalną lub oś optyczną. Szczególnie pilnuj, czy podany kąt jest mierzony względem powierzchni, czy względem normalnej.");
    } else if (/ładunek|prąd|napięcie|opór|ohm|moc|kirchhoff|indukcj|magnetycz/.test(tekst)) {
        kroki.push("Rozpoznaj, które wielkości opisują obwód lub zjawisko. Następnie wybierz prawo, które bezpośrednio łączy te wielkości, zamiast podstawiać wszystkie podane liczby naraz.");
    } else if (/gaz|ciśn|temperatur|ciepł|topn|wrzen|termodynam/.test(tekst)) {
        kroki.push("Ustal, które wielkości pozostają stałe i jaka przemiana zachodzi. Dopiero wtedy wybierz odpowiednią zależność termodynamiczną.");
    } else if (/fala|drgan|dźwięk|częstotliwość|amplitud|doppler|dyfrakcj|interferencj/.test(tekst)) {
        kroki.push("Rozdziel pojęcia występujące w zadaniu: częstotliwość, okres, długość fali i prędkość nie oznaczają tego samego. Sprawdź, które z nich są podane i której szukasz.");
    }

    if (!kroki.length) {
        kroki.push("Wypisz z treści tylko te informacje, które są potrzebne do znalezienia szukanej wielkości, a następnie dobierz zależność łączącą te wielkości.");
    }

    return kroki.slice(0, 3).join("\n");
}

const DODATKOWE_PYTANIA_TEMATYCZNE = {
    "Prawo odbicia": [
        {pytanie:"Promień pada na lustro pod kątem 42° do normalnej. Jak zmieni się kierunek promienia odbitego, jeśli obrót lustra wyniesie 8°?",odpowiedzi:["Kierunek odbitego zmieni się o 16°","O 8°","O 4°"],prawidlowa:0,wzor:"Δkierunku odbitego = 2Δφ",wskazowka:"Po obrocie lustra obraca się także normalna. Zastosuj prawo odbicia przed i po obrocie i porównaj oba kierunki."},
        {pytanie:"Promień pada na lustro pod kątem 25° do powierzchni. O ile stopni różni się kierunek promienia padającego od odbitego?",odpowiedzi:["130°","50°","25°"],prawidlowa:0,wzor:"kąt do normalnej = 90° − 25°; kąt między promieniami = 2θ",wskazowka:"Najpierw zamień kąt do powierzchni na kąt do normalnej. Potem pamiętaj, że promień padający i odbity tworzą dwa równe kąty z normalną."},
        {pytanie:"Źródło światła przesunięto równolegle do płaskiego lustra, zachowując jego orientację. Czy prawo odbicia przestaje obowiązywać?",odpowiedzi:["Nie; dla każdego punktu padania kąty względem lokalnej normalnej pozostają równe","Tak, bo kąt padania zależy tylko od odległości źródła","Tak, bo lustro odbija tylko światło padające z jednego miejsca"],prawidlowa:0,wzor:"θᵢ = θᵣ",wskazowka:"Prawo odbicia dotyczy kąta w punkcie padania, a nie konkretnego położenia źródła. Zmieniasz geometrię promienia, ale nie samą zasadę odbicia."},
        {pytanie:"Dwa promienie padają na to samo płaskie lustro pod różnymi kątami. Co musi być prawdziwe dla obu promieni?",odpowiedzi:["Każdy promień odbije się pod kątem równym swojemu kątowi padania, mierzonym od normalnej","Oba promienie odbiją się pod tym samym kątem","Oba promienie muszą odbić się prostopadle do lustra"],prawidlowa:0,wzor:"θᵢ = θᵣ dla każdego promienia",wskazowka:"Nie porównuj dwóch promieni między sobą. Dla każdego osobno zmierz kąt względem normalnej w jego własnym punkcie padania."},
        {pytanie:"Jeśli normalna do lustra tworzy z osią poziomą kąt 20°, a promień padający tworzy z tą osią 55°, jaki kąt padania ma promień?",odpowiedzi:["35°","75°","20°"],prawidlowa:0,wzor:"θᵢ = |55° − 20°|",wskazowka:"Oba kąty są podane względem tej samej osi. Kąt padania mierzysz między promieniem a normalną, więc odejmij kierunki."},
        {pytanie:"Co stanie się z kierunkiem promienia odbitego, jeśli płaskie lustro obrócimy o 15° wokół punktu padania, a kierunek promienia padającego pozostanie stały?",odpowiedzi:["Zmieni się o 30°","Zmieni się o 15°","Nie zmieni się"],prawidlowa:0,wzor:"Δθ_odbitego = 2Δφ",wskazowka:"Obrót lustra o Δφ obraca normalną o tę samą wartość. Ponieważ odbicie jest symetryczne względem normalnej, zmiana kierunku odbitego jest dwukrotna."},
        {pytanie:"Promień odbija się od dwóch wzajemnie prostopadłych luster. Co można powiedzieć o końcowym kierunku względem początkowego w idealnym modelu?",odpowiedzi:["Może zostać odwrócony względem obu składowych kierunku","Zawsze wróci dokładnie po tej samej prostej","Zawsze zatrzyma się na drugim lustrze"],prawidlowa:0,wzor:"Odbicie zmienia znak składowej prostopadłej do danej powierzchni",wskazowka:"Rozłóż kierunek ruchu na składowe względem dwóch prostopadłych powierzchni i przeanalizuj odbicie każdej składowej."}
    ],
    "Mechanika płynów": [
        {pytanie:"Woda płynie ustalonym strumieniem przez rurę. W zwężeniu pole przekroju maleje czterokrotnie. Jak zmieni się prędkość, jeśli ciecz jest nieściśliwa?",odpowiedzi:["Wzrośnie czterokrotnie","Zmniejszy się czterokrotnie","Nie zmieni się"],prawidlowa:0,wzor:"A₁v₁ = A₂v₂",wskazowka:"Dla cieczy nieściśliwej strumień objętości jest zachowany. Jeśli pole przekroju jest cztery razy mniejsze, prędkość musi odpowiednio wzrosnąć."},
        {pytanie:"W dwóch punktach poziomej rury prędkość cieczy jest większa w punkcie B niż w A. Co z ciśnieniem statycznym wynika z równania Bernoulliego, jeśli wysokość jest taka sama?",odpowiedzi:["Ciśnienie w B jest mniejsze","Ciśnienie w B jest większe","Ciśnienia muszą być równe"],prawidlowa:0,wzor:"p + ½ρv² = const",wskazowka:"Przy tej samej wysokości składnik ρgh się nie zmienia. Większy składnik ½ρv² musi być skompensowany mniejszym ciśnieniem."},
        {pytanie:"Ciało pływa spokojnie na powierzchni wody. Co musi być prawdziwe w stanie równowagi?",odpowiedzi:["Siła wyporu jest równa ciężarowi ciała","Siła wyporu jest większa od ciężaru","Ciężar jest równy zeru"],prawidlowa:0,wzor:"F_w = mg",wskazowka:"Brak przyspieszenia oznacza zerową siłę wypadkową. W pionie działają przede wszystkim ciężar i wypór, więc porównaj ich wartości."},
        {pytanie:"Dlaczego ciśnienie hydrostatyczne nie zależy od kształtu naczynia, jeśli porównujemy tę samą ciecz i tę samą głębokość?",odpowiedzi:["Wynika z wysokości słupa cieczy, gęstości i g, a nie z całkowitego kształtu naczynia","Bo ciecz nie ma masy","Bo ciśnienie zależy tylko od pola powierzchni naczynia"],prawidlowa:0,wzor:"p_h = ρgh",wskazowka:"Wzór zawiera gęstość, g i głębokość. Nie ma w nim pola dna ani objętości całego naczynia."},
        {pytanie:"Dwa zanurzone przedmioty mają taką samą objętość, ale znajdują się w tej samej cieczy. Czy siła wyporu musi być taka sama?",odpowiedzi:["Tak, jeśli oba wypierają tę samą objętość cieczy","Nie, bo zależy wyłącznie od masy przedmiotu","Nie, bo wypór nie zależy od objętości"],prawidlowa:0,wzor:"F_w = ρ_c g V_wypartej",wskazowka:"W prawie Archimedesa liczy się objętość wypartej cieczy i jej gęstość. Masa zanurzonego ciała nie występuje bezpośrednio we wzorze na wypór."},
        {pytanie:"W poziomej rurze przepływa idealna ciecz. Jeśli prędkość wzrośnie z 2 m/s do 6 m/s, jak zmieni się składnik dynamiczny ½ρv²?",odpowiedzi:["Wzrośnie dziewięciokrotnie","Wzrośnie trzykrotnie","Zmniejszy się dziewięciokrotnie"],prawidlowa:0,wzor:"q = ½ρv²",wskazowka:"W tym składniku prędkość występuje w drugiej potędze. Porównaj (6/2)², a nie tylko 6/2."},
        {pytanie:"W dwóch punktach tej samej poziomej strugi p_A + ½ρv_A² = p_B + ½ρv_B². Jeśli v_B > v_A, który punkt ma większe ciśnienie?",odpowiedzi:["A","B","Ciśnienia są równe"],prawidlowa:0,wzor:"p + ½ρv² = const",wskazowka:"Skoro wysokość się nie zmienia, suma ciśnienia i składnika dynamicznego jest stała. Większa prędkość oznacza większy składnik ½ρv², więc drugi składnik musi być mniejszy."},
        {pytanie:"Woda wypływa z otworu w zbiorniku. Który czynnik bezpośrednio wpływa na prędkość wypływu w prostym modelu Torricellego?",odpowiedzi:["Różnica wysokości słupa cieczy i otworu","Masa całego zbiornika","Kolor cieczy"],prawidlowa:0,wzor:"v ≈ √(2gh)",wskazowka:"W modelu Torricellego energia potencjalna słupa cieczy przechodzi w energię kinetyczną strugi. Kluczowa jest różnica poziomów h."},
        {pytanie:"Dlaczego zwężenie przewodu może zwiększyć prędkość przepływu, ale nie oznacza automatycznie wzrostu ciśnienia statycznego?",odpowiedzi:["Bo część energii przepływu jest związana ze składnikiem kinetycznym ½ρv²","Bo ciśnienie nie ma żadnego związku z prędkością","Bo w cieczy nie działa zasada zachowania energii"],prawidlowa:0,wzor:"p + ½ρv² + ρgh = const",wskazowka:"Rozdziel ciśnienie statyczne od składnika związanego z ruchem. W poziomej rurze wzrost v zwiększa ½ρv², co może oznaczać spadek p."}
    ],
    "Ewolucja gwiazd": [
        {pytanie:"Dlaczego masa początkowa gwiazdy tak silnie wpływa na jej dalszą ewolucję?",odpowiedzi:["Określa warunki w jądrze i tempo reakcji, a więc dostępne etapy ewolucji","Decyduje wyłącznie o jej odległości od Ziemi","Nie ma wpływu na czas życia gwiazdy"],prawidlowa:0,wzor:"większa masa → większa temperatura i tempo reakcji w jądrze",wskazowka:"Nie patrz tylko na ilość paliwa. Masywna gwiazda zużywa je znacznie szybciej, dlatego jej ewolucja przebiega innym torem."},
        {pytanie:"Gwiazda podobna do Słońca po wyczerpaniu wodoru w jądrze rozszerza się i staje się chłodniejsza na powierzchni. Jaki etap opisuje to najlepiej?",odpowiedzi:["Olbrzym","Gwiazda neutronowa","Gwiazda ciągu głównego bez zmiany struktury"],prawidlowa:0,wzor:"ewolucja po opuszczeniu ciągu głównego",wskazowka:"Rozpoznaj zmianę: spalanie wodoru w jądrze ustaje, jądro się kurczy, a zewnętrzne warstwy rozszerzają się."},
        {pytanie:"Co jest pozostałością po gwieździe podobnej do Słońca po odrzuceniu zewnętrznych warstw?",odpowiedzi:["Biały karzeł","Czarna dziura w każdym przypadku","Planeta skalista"],prawidlowa:0,wzor:"gwiazda małej/średniej masy → biały karzeł",wskazowka:"Porównaj masę gwiazdy z progami potrzebnymi do utworzenia gwiazdy neutronowej lub czarnej dziury. Dla gwiazd podobnych do Słońca końcową pozostałością jest biały karzeł."},
        {pytanie:"Dlaczego bardzo masywne gwiazdy mogą zakończyć życie wybuchem supernowej?",odpowiedzi:["Ich jądro może utracić możliwość podtrzymywania równowagi, prowadząc do gwałtownego zapadania","Bo ich powierzchnia nagle przestaje emitować światło","Bo każda gwiazda po prostu kończy się eksplozją niezależnie od masy"],prawidlowa:0,wzor:"równowaga hydrostatyczna ↔ źródło energii w jądrze",wskazowka:"Śledź równowagę między grawitacyjnym zapadaniem a ciśnieniem. Gdy reakcje jądrowe nie zapewniają odpowiedniego podparcia, może dojść do kolapsu jądra."},
        {pytanie:"Masywna gwiazda ma więcej paliwa niż gwiazda podobna do Słońca, ale żyje krócej. Jaki jest kluczowy powód?",odpowiedzi:["Zużywa paliwo w znacznie większym tempie","Nie ma wystarczająco dużo wodoru","Jej energia nie pochodzi z reakcji jądrowych"],prawidlowa:0,wzor:"czas życia ~ dostępne paliwo / tempo jego zużycia",wskazowka:"Porównaj dwie rzeczy jednocześnie: ilość paliwa oraz szybkość jego spalania. Drugi czynnik rośnie bardzo silnie wraz z masą gwiazdy."}
    ]
};

const REGULY_TEMATOW = [
    [/prawo odbicia/i, /odbici|lustro|zwierciadło/],
    [/prawo załamania|załamanie światła/i, /załam|Snell|współczynnik załamania|kąt graniczn/],
    [/zwierciadła sferyczne/i, /zwierciad|ognisk|krzywizn/],
    [/soczewka/i, /soczew|powiększen|ognisk|równanie soczewki/],
    [/oko i przyrządy optyczne/i, /oko|akomodac|krótkowzrocz|dalekowzrocz|lupa|mikroskop|teleskop/],
    [/interferencja światła/i, /interferencj|prążk|Young/], [/dyfrakcja/i, /dyfrakcj|szczelin|ugięci/], [/polaryzacja/i, /polaryzacj|Malusa|polaryzator/],
    [/ruch jednostajny/i, /ruch jednostajn|s = v|v = s \/ t|stała prędkość|v = const/], [/ruch jednostajnie przyspieszony|ruch przyspieszony/i, /ruch.*przyspiesz|v = v₀|s = ½|a = Δv|swobodny spadek|rzut/],
    [/wykresy ruchu/i, /wykres|nachylenie|pole pod wykres/], [/ruch względny/i, /względn|układ odniesienia|zbliżan|nurt/], [/droga, prędkość i czas/i, /droga.*czas|średnia prędkość|vśr|s = v|v = s \/ t/],
    [/opóźnienie i hamowanie/i, /hamowan|opóźnien|droga hamowania|tarcie/], [/zasady newtona/i, /Newton|siła wypadkowa|bezwładn|F = ma/], [/siła tarcia|tarcie/i, /tarci|współczynnik tarcia|μN/],
    [/równowaga ciał/i, /równowag|siła wypadkowa|moment/], [/moment siły|równowaga i moment siły/i, /moment siły|ramię siły|τ|dźwign/],
    [/prędkość kątowa/i, /prędkość kątow|ω|obrót|kąt.*czas/], [/ruch po okręgu/i, /ruch po okręgu|okrąg|prędkość kątow|okres obiegu/], [/przyspieszenie dośrodkowe/i, /dośrodkow|v²\/r/], [/moment pędu/i, /moment pędu|pęd kątow|L =|Iω/],
    [/prawo powszechnego ciążenia|grawitacja/i, /grawitac|ciążeni|prawo powszechnego|GMm|orbita.*siła/], [/energia w polu grawitacyjnym/i, /energia.*grawitac|potencjalna.*grawitac|mgh|GMm/], [/prędkość ucieczki/i, /prędkość ucieczki|ucieczk|GM\/R/],
    [/ciśnienie hydrostatyczne/i, /hydrostatycz|ρgh|ciśnienie.*głębokoś/], [/prawo archimedesa/i, /Archimedes|siła wyporu|wypart/], [/równanie bernoulliego/i, /Bernoulli|przepływ|struga/],
    [/skale temperatur/i, /Kelvin|Celsjusz|skala temperatur|°C/], [/pomiar temperatury/i, /termometr|pomiar temperatur|kalibrac/], [/ciepło właściwe/i, /ciepło właściwe|mcΔT|Q = mc/], [/energia cieplna/i, /energia cieplna|ciepło|ogrzewan|Q =/],
    [/praca i energia cieplna/i, /praca|energia|ciepło|pierwsza zasada/], [/energia wewnętrzna/i, /energia wewnętrzn|ΔU|gaz.*praca/], [/przemiany gazowe/i, /izoterm|izobar|izochor|gaz doskonał|pV = nRT/],
    [/ładunek elektryczny/i, /ładunek|kulomb|q/], [/pole elektryczne/i, /pole elektry|natężenie pola|E = F\/q/], [/prawo Coulomba/i, /Coulomb|kq|ładunki.*odległoś/],
    [/prąd elektryczny/i, /prąd elektryczny|natężenie prądu|ładunek.*czas|I =/], [/napięcie i opór|prawo Ohma/i, /Ohm|opór|napięcie|U = IR/], [/moc i energia prądu/i, /moc.*prąd|energia.*prąd|P = UI|P = I²R/],
    [/pole magnetyczne/i, /pole magnetyczne|linie pola magnetycznego|strumień magnetyczny/], [/siła Lorentza/i, /Lorentz|qvB|BIl/], [/indukcja elektromagnetyczna/i, /indukcj|strumień magnetycz|Faraday|Lenz/],
    [/ruch harmoniczny/i, /harmonicz|sin|cos|drgan/], [/amplituda i okres|okres i częstotliwość/i, /amplitud|okres|częstotliwoś|T = 1\/f/], [/energia drgań/i, /energia.*drga|sprężystoś|wahadł/],
    [/równanie fali|parametry fali/i, /λ|częstotliwoś|v = λf|długość fali/], [/rodzaje fal|fale poprzeczne i podłużne/i, /poprzeczn|podłużn|mechaniczna|ośrodek/], [/interferencja i dyfrakcja fal/i, /interferencj|dyfrakcj|wzmocnien|wygaszen/],
    [/prędkość dźwięku|częstotliwość dźwięku|dźwięk/i, /dźwięk|akustyk|ton|prędkość.*dźwię/], [/efekt Dopplera/i, /Doppler|zbliż|oddal|częstotliwoś.*obserw/], [/natężenie dźwięku/i, /natężenie.*dźwię|decybel|amplitud/],
    [/zasada nieoznaczoności|nieoznaczoność/i, /nieoznacz|Δx|Δp|Heisenberg/], [/funkcja falowa/i, /funkcja falowa|ψ|prawdopodobień/], [/budowa jądra/i, /jądro|proton|neutron|nukleon/],
    [/radioaktywność|rozpady promieniotwórcze|okres półtrwania/i, /radioaktyw|rozpad|półtrwania|jąder|aktywnoś/], [/energia kwantu/i, /foton|E = hf|kwant energii|energia fotonu/], [/efekt fotoelektryczny/i, /fotoelektry|praca wyjścia|częstotliwoś.*granicz/],
    [/energia wiązania/i, /energia wiązania|defekt masy|nukleon/], [/rozszczepienie i synteza/i, /rozszczep|synte|fuzj|energia jądrow/], [/promieniowanie/i, /promieniowan|alfa|beta|gamma|widmo/],
    [/względność szczególna|dylatacja czasu|kontrakcja długości|energia spoczynkowa/i, /względnoś|dylatac|kontrakc|E = mc²|energia spoczynkowa|Lorentz/], [/grawitacja i czasoprzestrzeń|czarna dziura|czarne dziury|fale grawitacyjne/i, /czasoprzestrzen|czarna dziura|horyzont|fale grawitacyj|Einstein/],
    [/struktury krystaliczne|sieci przestrzenne/i, /krystal|sieć przestrzen|komórka elementarna|Bravais/], [/defekty kryształów/i, /defekt|wakancj|dyslokacj|domieszk/], [/materiały amorficzne/i, /amorficz|szkło|brak uporządkowania/],
    [/twardość materiału|twardość i wytrzymałość/i, /twardoś|wytrzymałoś|naprężen|odkształcen/], [/przewodnictwo|przewodnictwo elektryczne/i, /przewodnictw|opór właściw|nośnik|elektron/], [/sprężystość i plastyczność/i, /sprężystoś|plastycznoś|moduł Younga|granica plastycz/],
    [/ewolucja gwiazd/i, /ewolucj.*gwiazd|ciąg główny|supernow|biały karzeł|gwiazda neutronowa/],
    [/gwiazdy/i, /gwiazd|jasnoś|widmo|temperatur.*gwiazd/], [/planety/i, /planet|atmosfer|układ słoneczn|masa.*planet/], [/prawa Keplera/i, /Kepler|orbita|półoś wielka|okres obiegu/], [/ruch orbitalny/i, /orbita|prędkość orbital|okres obiegu/],
    [/grawitacja w astronomii|grawitacja i obserwacje|Gravitacja/i, /grawitac|orbita|soczewkow|masa.*gwiazd|obserwac/], [/ewolucja gwiazd/i, /ewolucj.*gwiazd|ciąg główny|supernow|biały karzeł|gwiazda neutronowa/], [/galaktyki/i, /galaktyk|Droga Mleczna|rotacj.*galaktyk|redshift/], [/światło i widma/i, /widm|linie widmow|przesunięci.*czerw|fotometr/], [/rozszerzanie Wszechświata/i, /rozszerzan.*Wszechświat|Hubble|redshift|galakty/]
];

const ZASADY_DO_WYJASNIEN = [
    [/skale temperatur|pomiar temperatury/i, "Skala Celsjusza i skala Kelvina mają tę samą wielkość stopnia; różnią się punktem zerowym. Przy zmianie temperatury liczy się różnica wskazań, a nie przesunięcie zera skali."],
    [/ciepło właściwe|energia cieplna/i, "Ilość energii potrzebnej do ogrzania ciała zależy od jego masy, ciepła właściwego i zmiany temperatury."],
    [/przemiany gazowe|równanie gazu doskonałego/i, "W przemianach gazowych trzeba najpierw ustalić, która wielkość pozostaje stała. Dopiero wtedy można dobrać właściwą zależność między ciśnieniem, objętością i temperaturą."],
    [/ruch jednostajny|prędkość i czas ruchu/i, "W ruchu jednostajnym prędkość jest stała, dlatego droga rośnie proporcjonalnie do czasu."],
    [/przyspieszenie|spadek swobodny|rzuty/i, "Przyspieszenie opisuje zmianę prędkości w czasie. Dlatego porównujemy zmianę prędkości z czasem jej trwania, zwracając uwagę na kierunek i znak."],
    [/wykresy ruchu/i, "Na wykresie ruchu nachylenie i pole pod wykresem mają konkretne znaczenie fizyczne. Nie można odczytywać ich tak samo z wykresu położenia, prędkości i przyspieszenia."],
    [/newton|tarcie|równowaga|moment siły/i, "Odpowiedź wynika z warunku równowagi lub z II zasady Newtona: trzeba uwzględnić wypadkową siłę i jej kierunek, a dla momentu także ramię siły."],
    [/ruch po okręgu|prędkość kątowa|dośrodkowe|moment pędu/i, "W ruchu obrotowym wielkości liniowe i kątowe są powiązane przez promień. Przyspieszenie dośrodkowe jest skierowane do środka okręgu, a moment pędu zależy od ruchu obrotowego."],
    [/grawitac|ciążeni|prędkość ucieczki/i, "Grawitacja jest oddziaływaniem zależnym od mas i odległości. W zadaniach orbitalnych energia i prędkość wynikają z tego samego pola grawitacyjnego."],
    [/hydrostat|archimedes|bernoulli|płyn/i, "W cieczach ciśnienie zależy od głębokości, a siła wyporu od objętości wypartej cieczy. W przepływie energia może być wymieniana między ciśnieniem, ruchem i wysokością."],
    [/ładunek|pole elektry|coulomb/i, "Odpowiedź wynika z oddziaływania ładunków i z definicji natężenia pola. Najważniejsze jest rozróżnienie samego ładunku od pola, które on wytwarza."],
    [/prąd|ohm|napięcie|opór|kirchhoff|moc prądu/i, "W obwodzie napięcie, natężenie i opór są powiązane prawem Ohma, a w rozgałęzieniach dodatkowo obowiązują prawa Kirchhoffa. Moc opisuje tempo przekazywania energii."],
    [/magnetycz|lorentz|indukcj/i, "Odpowiedź wynika z kierunku pola magnetycznego i ruchu ładunku albo przewodnika. W indukcji liczy się zmiana strumienia magnetycznego i kierunek przeciwdziałania tej zmianie."],
    [/drgan|fala|dźwięk|doppler/i, "Okres, częstotliwość, długość fali i prędkość są różnymi wielkościami, ale łączy je zależność f = 1/T oraz v = λf. W efekcie Dopplera zmienia się częstotliwość obserwowana."],
    [/odbici|załam|soczew|zwierciad|optycz/i, "W optyce geometrycznej kierunek promienia wynika z geometrii: kąty mierzymy względem normalnej, a dla soczewek i zwierciadeł wykorzystujemy zależność między ogniskiem, odległością przedmiotu i obrazu."],
    [/interferenc|dyfrakc|polaryzac/i, "Zjawiska falowe wynikają z nakładania się fal i ich właściwości kierunkowych. Warunki wzmocnienia, wygaszenia lub polaryzacji zależą od różnicy dróg i orientacji drgań."],
    [/kwant|fotoelektry|nieoznacz|funkcja falowa/i, "W fizyce kwantowej energia i pęd nie zachowują się jak wielkości całkowicie klasyczne. Odpowiedź wynika z kwantowania energii oraz ograniczeń wynikających z zasady nieoznaczoności."],
    [/jądr|radioak|rozpad|półtrwania|wiązania|rozszczep|synteza|promieniowanie/i, "W zjawiskach jądrowych trzeba zachować liczbę nukleonów i ładunek oraz uwzględnić zmianę energii wiązania. Prawo rozpadu opisuje prawdopodobieństwo przemiany jąder."],
    [/względność|dylatac|kontrakc|energia spoczynk|czasoprzestrz|czarna dziura/i, "W teorii względności pomiar czasu, długości i energii zależy od układu odniesienia oraz od geometrii czasoprzestrzeni. Kluczowe są niezmiennicze zależności teorii, a nie klasyczne dodawanie prędkości."],
    [/kryształ|materiał|przewodnict|sprężysto|plastycz|twardość/i, "Właściwości materiału wynikają z jego budowy mikroskopowej, rodzaju wiązań i sposobu uporządkowania struktury. To właśnie dlatego różne materiały reagują inaczej na obciążenie i pole elektryczne."],
    [/gwiazd|planet|kepler|galaktyk|wszechświat|kosmolog|widm/i, "W astronomii obserwowane wielkości łączymy z prawami grawitacji, ruchem orbitalnym i informacją niesioną przez światło. Widmo i zmiany częstotliwości pozwalają wnioskować o właściwościach oraz ruchu obiektów."]
];

const DODATKOWE_ZADANIA_OBLICZENIOWE = [
    { temat: "Prędkość i czas ruchu", poziom: 1, pytanie: "Rowerzysta przejechał 18 km w 1,5 h. Jaka była jego średnia prędkość?", odpowiedzi: ["12 km/h", "27 km/h", "9 km/h"], prawidlowa: 0, wzor: "v = s/t", rozwiazanie: "Dane: s = 18 km, t = 1,5 h. Liczymy v = 18/1,5 = 12 km/h.", wskazowka: "Zamień treść na dwie wielkości: drogę i czas, a następnie podziel drogę przez czas." },
    { temat: "Ruch jednostajny prostoliniowy", poziom: 1, pytanie: "Samochód jedzie ze stałą prędkością 20 m/s przez 15 s. Jaką drogę pokona?", odpowiedzi: ["300 m", "35 m", "1,33 m"], prawidlowa: 0, wzor: "s = vt", rozwiazanie: "s = 20 m/s · 15 s = 300 m.", wskazowka: "Przy stałej prędkości droga jest iloczynem prędkości i czasu." },
    { temat: "Przyspieszenie i opóźnienie", poziom: 2, pytanie: "Prędkość auta wzrosła z 10 m/s do 25 m/s w czasie 5 s. Jakie było przyspieszenie?", odpowiedzi: ["3 m/s²", "5 m/s²", "7,5 m/s²"], prawidlowa: 0, wzor: "a = Δv/t", rozwiazanie: "Δv = 25 − 10 = 15 m/s. Zatem a = 15/5 = 3 m/s².", wskazowka: "Najpierw oblicz zmianę prędkości, a dopiero potem podziel ją przez czas." },
    { temat: "Ruch jednostajnie przyspieszony i opóźniony", poziom: 2, pytanie: "Ciało rusza z prędkości 4 m/s i ma przyspieszenie 2 m/s². Jaką prędkość osiągnie po 6 s?", odpowiedzi: ["16 m/s", "12 m/s", "8 m/s"], prawidlowa: 0, wzor: "v = v₀ + at", rozwiazanie: "v = 4 + 2·6 = 16 m/s.", wskazowka: "Podstaw prędkość początkową, przyspieszenie i czas do wzoru na prędkość końcową." },
    { temat: "Spadek swobodny i rzuty pionowe", poziom: 2, pytanie: "Pomijając opór powietrza, ciało spada przez 2 s. Przyjmij g = 10 m/s². Jaką prędkość osiągnie?", odpowiedzi: ["20 m/s", "5 m/s", "40 m/s"], prawidlowa: 0, wzor: "v = gt", rozwiazanie: "v = 10 m/s² · 2 s = 20 m/s.", wskazowka: "W spadku swobodnym z początkowego spoczynku prędkość rośnie proporcjonalnie do czasu." },
    { temat: "Ruch po okręgu", poziom: 2, pytanie: "Koło wykonuje 5 pełnych obrotów w 10 s. Jaka jest jego częstotliwość obrotów?", odpowiedzi: ["0,5 Hz", "2 Hz", "5 Hz"], prawidlowa: 0, wzor: "f = n/t", rozwiazanie: "f = 5/10 s = 0,5 Hz.", wskazowka: "Częstotliwość mówi, ile pełnych cykli przypada na jedną sekundę." },
    { temat: "Zasady Newtona", poziom: 2, pytanie: "Na ciało o masie 4 kg działa wypadkowa siła 12 N. Jakie ma przyspieszenie?", odpowiedzi: ["3 m/s²", "48 m/s²", "0,33 m/s²"], prawidlowa: 0, wzor: "a = F/m", rozwiazanie: "Z II zasady Newtona a = F/m = 12/4 = 3 m/s².", wskazowka: "Jeśli znasz siłę wypadkową i masę, podziel siłę przez masę." },
    { temat: "Siła tarcia", poziom: 2, pytanie: "Klocek o masie 5 kg leży na poziomej powierzchni. Przyjmij μ = 0,2 i g = 10 m/s². Ile wynosi siła tarcia?", odpowiedzi: ["10 N", "2 N", "25 N"], prawidlowa: 0, wzor: "Fₜ = μmg", rozwiazanie: "Fₜ = 0,2 · 5 · 10 = 10 N.", wskazowka: "Na poziomej powierzchni nacisk wynosi mg. Pomnóż go przez współczynnik tarcia." },
    { temat: "Moment siły", poziom: 2, pytanie: "Siła 20 N działa prostopadle do klucza o długości 0,25 m. Jaki moment siły wytwarza?", odpowiedzi: ["5 N·m", "80 N·m", "0,8 N·m"], prawidlowa: 0, wzor: "M = Fr", rozwiazanie: "M = 20 N · 0,25 m = 5 N·m.", wskazowka: "Dla siły prostopadłej moment to iloczyn siły i ramienia." },
    { temat: "Przyspieszenie dośrodkowe", poziom: 3, pytanie: "Ciało porusza się po okręgu o promieniu 2 m z prędkością 6 m/s. Jakie ma przyspieszenie dośrodkowe?", odpowiedzi: ["18 m/s²", "3 m/s²", "12 m/s²"], prawidlowa: 0, wzor: "a_d = v²/r", rozwiazanie: "a_d = 6²/2 = 36/2 = 18 m/s².", wskazowka: "Podnieś prędkość do kwadratu i podziel przez promień." },
    { temat: "Ciśnienie hydrostatyczne", poziom: 1, pytanie: "Jakie ciśnienie hydrostatyczne wywiera woda na głębokości 3 m? Przyjmij ρ = 1000 kg/m³ i g = 10 m/s².", odpowiedzi: ["30 000 Pa", "3 000 Pa", "300 000 Pa"], prawidlowa: 0, wzor: "p = ρgh", rozwiazanie: "p = 1000 · 10 · 3 = 30 000 Pa.", wskazowka: "Pomnóż gęstość cieczy, przyspieszenie grawitacyjne i głębokość." },
    { temat: "Prawo Archimedesa", poziom: 2, pytanie: "Ciało wypiera 0,002 m³ wody. Przyjmij ρ = 1000 kg/m³ i g = 10 m/s². Jaka siła wyporu na nie działa?", odpowiedzi: ["20 N", "2 N", "200 N"], prawidlowa: 0, wzor: "F_w = ρgV", rozwiazanie: "F_w = 1000 · 10 · 0,002 = 20 N.", wskazowka: "Siła wyporu jest równa ciężarowi wypartej cieczy." },
    { temat: "Ładunek elektryczny", poziom: 1, pytanie: "Przez przewodnik przepłynął prąd 2 A w czasie 5 s. Jaki ładunek przepłynął?", odpowiedzi: ["10 C", "2,5 C", "0,4 C"], prawidlowa: 0, wzor: "Q = It", rozwiazanie: "Q = 2 A · 5 s = 10 C.", wskazowka: "Ładunek obliczysz, mnożąc natężenie prądu przez czas." },
    { temat: "Prawo Coulomba", poziom: 3, pytanie: "Dwa ładunki 2 μC i 3 μC są oddalone o 0,3 m. Przyjmij k = 9·10⁹ N·m²/C². Jaka jest wartość siły Coulomba?", odpowiedzi: ["0,6 N", "6 N", "0,06 N"], prawidlowa: 0, wzor: "F = k|q₁q₂|/r²", rozwiazanie: "F = 9·10⁹ · (2·10⁻⁶)(3·10⁻⁶) / 0,3² = 0,6 N.", wskazowka: "Zamień mikroculomby na kulomby i pamiętaj, że odległość występuje w mianowniku w kwadracie." },
    { temat: "Prawo Ohma", poziom: 1, pytanie: "Opór wynosi 6 Ω, a napięcie 12 V. Jakie natężenie prądu płynie w obwodzie?", odpowiedzi: ["2 A", "72 A", "0,5 A"], prawidlowa: 0, wzor: "I = U/R", rozwiazanie: "I = 12/6 = 2 A.", wskazowka: "Z prawa Ohma wyznacz I, dzieląc napięcie przez opór." },
    { temat: "Moc i energia prądu", poziom: 2, pytanie: "Grzałka ma moc 1000 W i pracuje przez 3 minuty. Ile energii zużyje?", odpowiedzi: ["180 000 J", "3 000 J", "60 000 J"], prawidlowa: 0, wzor: "E = Pt", rozwiazanie: "3 min = 180 s. E = 1000 · 180 = 180 000 J.", wskazowka: "Najpierw zamień minuty na sekundy, potem pomnóż moc przez czas." },
    { temat: "Prąd elektryczny", poziom: 2, pytanie: "Przez żarówkę płynie prąd 0,5 A przy napięciu 12 V. Jaka jest jej moc?", odpowiedzi: ["6 W", "24 W", "0,04 W"], prawidlowa: 0, wzor: "P = UI", rozwiazanie: "P = 12 · 0,5 = 6 W.", wskazowka: "Moc elektryczna jest iloczynem napięcia i natężenia." },
    { temat: "Amplituda i okres", poziom: 1, pytanie: "Drganie ma okres 0,5 s. Jaka jest jego częstotliwość?", odpowiedzi: ["2 Hz", "0,5 Hz", "1 Hz"], prawidlowa: 0, wzor: "f = 1/T", rozwiazanie: "f = 1/0,5 s = 2 Hz.", wskazowka: "Częstotliwość jest odwrotnością okresu." },
    { temat: "Równanie fali", poziom: 2, pytanie: "Fala ma długość 2 m i częstotliwość 5 Hz. Z jaką prędkością się rozchodzi?", odpowiedzi: ["10 m/s", "2,5 m/s", "0,4 m/s"], prawidlowa: 0, wzor: "v = λf", rozwiazanie: "v = 2 m · 5 Hz = 10 m/s.", wskazowka: "Prędkość fali to iloczyn długości fali i częstotliwości." },
    { temat: "Prędkość dźwięku", poziom: 2, pytanie: "Echo wraca po 0,4 s. Przyjmij prędkość dźwięku 340 m/s. Jak daleko znajduje się przeszkoda?", odpowiedzi: ["68 m", "136 m", "850 m"], prawidlowa: 0, wzor: "s = vt/2", rozwiazanie: "Dźwięk pokonuje drogę do przeszkody i z powrotem, więc s = 340·0,4/2 = 68 m.", wskazowka: "Czas echa obejmuje drogę w obie strony, dlatego na końcu dzielimy przez 2." },
    { temat: "Prawo załamania", poziom: 3, pytanie: "Światło przechodzi do ośrodka o współczynniku załamania n = 1,5. Jeśli sin kąta padania = 0,75, to ile wynosi sin kąta załamania?", odpowiedzi: ["0,5", "1,125", "0,75"], prawidlowa: 0, wzor: "n₁sinα = n₂sinβ", rozwiazanie: "Dla powietrza n₁≈1: sinβ = 0,75/1,5 = 0,5.", wskazowka: "Z prawa Snelliusa wyznacz sin kąta załamania." },
    { temat: "Energia kwantu", poziom: 3, pytanie: "Foton ma częstotliwość 5·10¹⁴ Hz. Przyjmij h = 6,63·10⁻³⁴ J·s. Jaką ma energię?", odpowiedzi: ["3,315·10⁻¹⁹ J", "1,326·10⁻³³ J", "3,315·10⁻¹⁴ J"], prawidlowa: 0, wzor: "E = hf", rozwiazanie: "E = 6,63·10⁻³⁴ · 5·10¹⁴ ≈ 3,315·10⁻¹⁹ J.", wskazowka: "Pomnóż stałą Plancka przez częstotliwość fotonu." },
    { temat: "Dylatacja czasu", poziom: 3, pytanie: "Statek porusza się z v = 0,8c. W układzie statku mija 6 lat. Ile czasu mierzy obserwator zewnętrzny?", odpowiedzi: ["10 lat", "4,8 roku", "7,5 roku"], prawidlowa: 0, wzor: "t = γτ, γ = 1/√(1−v²/c²)", rozwiazanie: "γ = 1/√(1−0,8²) = 1/0,6 = 5/3. Zatem t = (5/3)·6 = 10 lat.", wskazowka: "Najpierw policz czynnik Lorentza γ, potem pomnóż przez czas własny." },
    { temat: "Energia spoczynkowa", poziom: 3, pytanie: "Jaka jest energia spoczynkowa masy 1 g? Przyjmij c = 3·10⁸ m/s.", odpowiedzi: ["9·10¹³ J", "9·10⁸ J", "3·10⁵ J"], prawidlowa: 0, wzor: "E₀ = mc²", rozwiazanie: "1 g = 0,001 kg. E₀ = 0,001·(3·10⁸)² = 9·10¹³ J.", wskazowka: "Najważniejszy jest kwadrat prędkości światła i poprawna zamiana gramów na kilogramy." },
    { temat: "Okres półtrwania", poziom: 2, pytanie: "Próbka ma początkowo 80 mg substancji. Okres półtrwania wynosi 2 dni. Ile zostanie po 6 dniach?", odpowiedzi: ["10 mg", "20 mg", "40 mg"], prawidlowa: 0, wzor: "m = m₀(1/2)ⁿ", rozwiazanie: "6 dni to 3 okresy półtrwania: 80 → 40 → 20 → 10 mg.", wskazowka: "Podziel masę przez 2 po każdym pełnym okresie półtrwania." },
    { temat: "Grawitacja", poziom: 2, pytanie: "Jaką siłą Ziemia przyciąga ciało o masie 5 kg przy g = 10 m/s²?", odpowiedzi: ["50 N", "5 N", "500 N"], prawidlowa: 0, wzor: "F_g = mg", rozwiazanie: "F_g = 5·10 = 50 N.", wskazowka: "Ciężar ciała w pobliżu powierzchni Ziemi to iloczyn masy i g." },
    { temat: "Energia w polu grawitacyjnym", poziom: 2, pytanie: "Ciało o masie 2 kg podniesiono na wysokość 5 m. Przyjmij g = 10 m/s². O ile wzrosła jego energia potencjalna?", odpowiedzi: ["100 J", "20 J", "50 J"], prawidlowa: 0, wzor: "E_p = mgh", rozwiazanie: "E_p = 2·10·5 = 100 J.", wskazowka: "Pomnóż masę, grawitację i zmianę wysokości." },
    { temat: "Energia cieplna", poziom: 2, pytanie: "Ile energii trzeba dostarczyć, aby ogrzać 2 kg wody o 5°C? c = 4200 J/(kg·°C).", odpowiedzi: ["42 000 J", "8 400 J", "4 200 J"], prawidlowa: 0, wzor: "Q = mcΔT", rozwiazanie: "Q = 2·4200·5 = 42 000 J.", wskazowka: "Wstaw masę, ciepło właściwe i zmianę temperatury do wzoru Q = mcΔT." },
    { temat: "Praca i energia", poziom: 1, pytanie: "Siła 30 N przesuwa skrzynię o 4 m w swoim kierunku. Jaką pracę wykonuje?", odpowiedzi: ["120 J", "34 J", "7,5 J"], prawidlowa: 0, wzor: "W = Fs", rozwiazanie: "W = 30·4 = 120 J.", wskazowka: "Jeśli siła działa zgodnie z kierunkiem ruchu, pracę liczysz jako F razy s." },
    { temat: "Ciepło właściwe", poziom: 2, pytanie: "Dostarczono 8400 J energii do 1 kg wody. O ile wzrosła temperatura? c = 4200 J/(kg·°C).", odpowiedzi: ["2°C", "0,5°C", "4°C"], prawidlowa: 0, wzor: "ΔT = Q/(mc)", rozwiazanie: "ΔT = 8400/(1·4200) = 2°C.", wskazowka: "Przekształć Q = mcΔT tak, aby ΔT było po jednej stronie." },
    { temat: "Praca i energia cieplna", poziom: 2, pytanie: "Gaz pobrał 1200 J ciepła i wykonał 800 J pracy. O ile zmieniła się jego energia wewnętrzna?", odpowiedzi: ["400 J", "2000 J", "-400 J"], prawidlowa: 0, wzor: "ΔU = Q − W", rozwiazanie: "ΔU = 1200 − 800 = 400 J.", wskazowka: "Jeżeli gaz wykonuje pracę, część dostarczonej energii opuszcza układ jako praca." }
];

const CONTENT_SCHEMA = {
    poziomy: {
        1: "podstawowy — definicje, pojedyncza zależność, bez łańcucha przekształceń",
        2: "średni — kilka danych, przekształcenie lub połączenie dwóch kroków",
        3: "zaawansowany — wieloetapowe rozumowanie, analiza zależności, nietypowy kontekst lub zadanie maturalne",
    },
    pola: {
        pytanie: "Treść zadania.",
        odpowiedzi: "Tablica odpowiedzi dla zadania zamkniętego.",
        prawidlowa: "Indeks poprawnej odpowiedzi od 0.",
        odpowiedz: "Wzorcowa odpowiedź dla zadania otwartego.",
        akceptowane: "Alternatywne zapisy odpowiedzi otwartej.",
        tolerancja: "Opcjonalna tolerancja dla odpowiedzi liczbowej.",
        wskazowka: "Naprowadza, ale nie zdradza wyniku.",
        wyjasnienie: "Pełne wyjaśnienie rozwiązania.",
        wzor: "Najważniejsza zależność fizyczna.",
        poziom: "1 / 2 / 3 — ustawiany ręcznie, nie według kolejności w banku.",
        maturalne: "true dla zadań w treningu maturalnym.",
        obliczeniowe: "true dla zadań wymagających rachunków.",
    },
};

export {
    baza,
    pytaniaDlaTematu,
    pulePytanDzialow,
    BANKI_JAKOSCI,
    DODATKOWE_PYTANIA_TEMATYCZNE,
    REGULY_TEMATOW,
    ZASADY_DO_WYJASNIEN,
    DODATKOWE_ZADANIA_OBLICZENIOWE,
    CONTENT_SCHEMA,
    oczyscTekstPodpowiedzi,
    uzupelnijPodpowiedz
};
