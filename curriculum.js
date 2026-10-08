/**
 * Inercja — curriculum and question banks.
 *
 * This module contains educational content only. Application behaviour stays
 * in js/app.js so content can evolve without touching UI/state logic.
 */

const baza = {
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
                            "odpowiedzi": {A: "298 K", B: "248 K", C: "325 K"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Na jaką temperaturę w stopniach Celsjusza odpowiada około 310 K?",
                            "odpowiedzi": {A: "310°C", B: "-37°C", C: "37°C"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "O ile kelwinów wzrasta temperatura przy zmianie z 280 K do 300 K?",
                            "odpowiedzi": {A: "10 K", B: "20 K", C: "580 K"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Pomiar temperatury",
                    "quiz": [
                        {
                            "pytanie": "O ile wzrasta temperatura, gdy wskazanie termometru zmienia się z 18°C na 43°C?",
                            "odpowiedzi": {A: "25°C", B: "61°C", C: "18°C"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Którą wielkość fizyczną termometr mierzy bezpośrednio?",
                            "odpowiedzi": {A: "Temperatura", B: "Moc", C: "Ciepło właściwe"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwa termometry pokazują 20°C i 68°F. Które wskazania odpowiadają tej samej temperaturze?",
                            "odpowiedzi": {A: "68°F to 68°C", B: "Są w przybliżeniu równe", C: "20°C to 20 K"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Ciepło właściwe",
                    "quiz": [
                        {
                            "pytanie": "Ile energii potrzeba, aby ogrzać 2 kg wody o 5°C? c=4200 J/(kg·°C).",
                            "odpowiedzi": {A: "2 100 J", B: "42 000 J", C: "8 400 J"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Który materiał potrzebuje więcej energii do ogrzania 1 kg o 10°C, jeśli ma większe c?",
                            "odpowiedzi": {A: "Materiał o mniejszym c", B: "Oba zawsze tyle samo", C: "Materiał o większym c"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dostarczono 8400 J do 1 kg wody. O ile wzrośnie jej temperatura? c=4200 J/(kg·°C).",
                            "odpowiedzi": {A: "2°C", B: "0,5°C", C: "4°C"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "energia_i_przemiany": [
                {
                    "temat": "Energia cieplna",
                    "quiz": [
                        {
                            "pytanie": "Który wzór pozwala obliczyć energię potrzebną do ogrzania ciała o określoną zmianę temperatury?",
                            "odpowiedzi": {A: "Q = mv²/2", B: "Q = mgh", C: "Q = mcΔT"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Praca i energia",
                    "quiz": [
                        {
                            "pytanie": "Która jednostka SI jest właściwa dla pracy mechanicznej?",
                            "odpowiedzi": {A: "Newton", B: "Dżul", C: "Watt"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Energia wewnętrzna",
                    "quiz": [
                        {
                            "pytanie": "Gaz otrzymał 500 J ciepła i wykonał 200 J pracy. O ile zmieniła się jego energia wewnętrzna?",
                            "odpowiedzi": {A: "300 J", B: "700 J", C: "-300 J"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Który proces może zwiększyć energię wewnętrzną bez dopływu ciepła?",
                            "odpowiedzi": {A: "Wykonanie pracy nad układem", B: "Tylko topnienie", C: "Tylko chłodzenie"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli energia wewnętrzna układu wzrosła o 150 J, co oznacza znak dodatni tej zmiany?",
                            "odpowiedzi": {A: "Układ stracił 150 J", B: "Układ zwiększył swoją energię wewnętrzną", C: "Praca zawsze wyniosła 0"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Praca i energia cieplna",
                    "quiz": [
                        {
                            "pytanie": "Siła 20 N przesuwa tłok o 0,3 m w swoim kierunku. Jaką pracę wykonuje?",
                            "odpowiedzi": {A: "0,015 J", B: "6 J", C: "60 J"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Gaz wykonał 800 J pracy, pobierając 1200 J ciepła. Jaka była zmiana energii wewnętrznej?",
                            "odpowiedzi": {A: "2000 J", B: "-400 J", C: "400 J"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która jednostka SI jest właściwa dla pracy mechanicznej?",
                            "odpowiedzi": {A: "J", B: "W", C: "Pa"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Przemiany gazowe",
                    "quiz": [
                        {
                            "pytanie": "Gaz ma temperaturę 300 K. Przy stałym ciśnieniu ogrzano go do 600 K. Jak zmieni się jego objętość?",
                            "odpowiedzi": {A: "Zmniejszy się dwukrotnie", B: "Nie zmieni się", C: "Wzrośnie dwukrotnie"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która wielkość pozostaje stała w przemianie izochorycznej?",
                            "odpowiedzi": {A: "Temperatura", B: "Objętość", C: "Ciśnienie"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która wielkość pozostaje stała w przemianie izotermicznej gazu?",
                            "odpowiedzi": {A: "Temperatura", B: "Objętość", C: "Masa molowa"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "hydrostatyka_i_aerostatyka": [
                {
                    "temat": "Ciśnienie hydrostatyczne",
                    "quiz": [
                        {
                            "pytanie": "Jakie ciśnienie hydrostatyczne wywiera woda na głębokości 2 m? ρ=1000 kg/m³, g=10 m/s².",
                            "odpowiedzi": {A: "20 000 Pa", B: "2 000 Pa", C: "5 000 Pa"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciśnienie hydrostatyczne zależy od głębokości:",
                            "odpowiedzi": {A: "Odwrotnie proporcjonalnie", B: "Wprost proporcjonalnie", C: "Nie zależy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Na tej samej głębokości w tej samej cieczy ciśnienie jest:",
                            "odpowiedzi": {A: "Zawsze mniejsze w wąskim", B: "Takie samo niezależnie od kształtu naczynia", C: "Zawsze większe w szerokim naczyniu"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Prawo Archimedesa",
                    "quiz": [
                        {
                            "pytanie": "Ciało wypiera 0,002 m³ wody. Jaka jest siła wyporu? ρ=1000 kg/m³, g=10 m/s².",
                            "odpowiedzi": {A: "2 N", B: "200 N", C: "20 N"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Siła wyporu działa na zanurzone ciało:",
                            "odpowiedzi": {A: "Pionowo ku górze", B: "Pionowo w dół", C: "Poziomo"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli objętość wypartej cieczy wzrośnie 2 razy, siła wyporu:",
                            "odpowiedzi": {A: "Zmniejszy się 2 razy", B: "Nie zmieni się", C: "Wzrośnie 2 razy"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
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
                    "quiz": [
                        {
                            "pytanie": "Metalowy element o masie 0,50 kg ogrzano o 40 K. Jego ciepło właściwe wynosi 900 J/(kg·K). Ile energii dostarczono?",
                            "odpowiedzi": {A: "450 J", B: "18 kJ", C: "36 kJ"}, "poprawna": "B",
                            "wzor": "Q=mcΔT",
                            "rozwiazanie": "Q=0,50·900·40=18 000 J=18 kJ.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Gaz otrzymał 1,2 kJ ciepła i wykonał pracę 0,7 kJ. Jak zmieniła się jego energia wewnętrzna?",
                            "odpowiedzi": {A: "Wzrosła o 0,5 kJ", B: "Wzrosła o 1,9 kJ", C: "Zmalała o 0,5 kJ"}, "poprawna": "A",
                            "wzor": "ΔU=Q−W",
                            "rozwiazanie": "Część energii przekazanej gazowi została wykorzystana na wykonanie pracy, więc ΔU=1,2−0,7=0,5 kJ.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Dla stałej ilości gazu temperatura bezwzględna wzrosła 2 razy, a objętość nie zmieniła się. Co stało się z ciśnieniem?",
                            "odpowiedzi": {A: "Wzrosło 2 razy", B: "Nie zmieniło się", C: "Zmalało 2 razy"}, "poprawna": "A",
                            "wzor": "pV=nRT",
                            "rozwiazanie": "Przy stałych n i V ciśnienie jest proporcjonalne do temperatury w kelwinach.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Ciało pobrało 12 kJ ciepła i jego energia wewnętrzna wzrosła o 5 kJ. Jaką pracę wykonało?",
                            "odpowiedzi": {A: "17 kJ", B: "7 kJ", C: "5 kJ"}, "poprawna": "B",
                            "wzor": "W=Q−ΔU",
                            "rozwiazanie": "Z I zasady termodynamiki ΔU=Q−W, więc W=12−5=7 kJ.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
            ]
        }
    },
    "mechanika": {
        "emoji": "⚙️",
        "nazwa": "Mechanika punktu materialnego i bryły sztywnej",
        "maturalna": true,
        "podnagalowki": {
            "kinematyka": [
                {
                    "temat": "Podstawy opisu ruchu",
                    "quiz": [
                        {
                            "pytanie": "Co trzeba wskazać, aby jednoznacznie opisać położenie ciała?",
                            "odpowiedzi": {A: "Tylko czas", B: "Układ odniesienia i współrzędne położenia", C: "Tylko masę ciała"}, "poprawna": "B",
                            "wzor": "x = x(t)",
                            "wskazowka": "Najpierw ustal, względem czego opisujesz położenie. Dopiero potem możesz podać współrzędną x i jej zmianę w czasie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czym jest tor ruchu?",
                            "odpowiedzi": {A: "Czas trwania ruchu", B: "Odległość od początku układu współrzędnych", C: "Linia wyznaczona przez kolejne położenia ciała"}, "poprawna": "C",
                            "wskazowka": "Wyobraź sobie zaznaczanie położenia ciała w kolejnych chwilach. Po połączeniu tych punktów otrzymujesz tor.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czym różni się droga od przemieszczenia?",
                            "odpowiedzi": {A: "Droga jest długością przebytej trasy, a przemieszczenie łączy położenie początkowe i końcowe jako wektor", B: "To zawsze dokładnie ta sama wielkość", C: "Przemieszczenie zawsze jest większe od drogi"}, "poprawna": "A",
                            "wskazowka": "Droga zależy od całej przebytej trasy. Przemieszczenie zależy tylko od punktu startu i końca oraz ma kierunek.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Samochód jedzie 100 m na wschód, a następnie 100 m na zachód. Jaka jest jego droga?",
                            "odpowiedzi": {A: "0 m", B: "100 m", C: "200 m"}, "poprawna": "C",
                            "wzor": "s = s₁ + s₂",
                            "wskazowka": "Droga sumuje długości wszystkich przebytych odcinków. Nie skracaj jej przez odejmowanie kierunków.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Samochód jedzie 100 m na wschód, a następnie 100 m na zachód. Jakie jest jego przemieszczenie?",
                            "odpowiedzi": {A: "200 m", B: "0 m", C: "100 m"}, "poprawna": "B",
                            "wzor": "Δx = x_k − x_p",
                            "wskazowka": "Przemieszczenie zależy tylko od położenia początkowego i końcowego. Samochód wrócił do punktu startu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czy ruch może być różnie opisany przez dwóch obserwatorów?",
                            "odpowiedzi": {A: "Tak, zależy od układu odniesienia", B: "Nie, opis ruchu jest zawsze identyczny", C: "Tylko w próżni"}, "poprawna": "A",
                            "wskazowka": "Pomyśl o pasażerze siedzącym w jadącym autobusie i obserwatorze stojącym na ulicy. Ten sam pasażer ma różne położenie względem obu układów.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Wektor przemieszczenia jest skierowany...",
                            "odpowiedzi": {A: "Od położenia początkowego do końcowego", B: "Zawsze pionowo w dół", C: "Zawsze zgodnie z torem"}, "poprawna": "A",
                            "wzor": "⃗Δr = ⃗r_k − ⃗r_p",
                            "wskazowka": "Narysuj punkt startowy i końcowy. Wektor przemieszczenia to prosta strzałka łącząca te punkty w odpowiednim kierunku.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeżeli ciało pozostaje w tym samym położeniu względem wybranego układu, to...",
                            "odpowiedzi": {A: "Na pewno porusza się ruchem jednostajnym", B: "Spoczywa w tym układzie", C: "Ma zawsze przyspieszenie"}, "poprawna": "B",
                            "wskazowka": "Spoczynek oznacza brak zmiany położenia w czasie w konkretnym układzie odniesienia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaka jednostka w SI opisuje drogę?",
                            "odpowiedzi": {A: "metr na sekundę (m/s)", B: "metr (m)", C: "sekunda (s)"}, "poprawna": "B",
                            "wskazowka": "Droga jest długością, więc szukaj jednostki długości w układzie SI.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeżeli ciało porusza się po prostej i nie zmienia kierunku, wartość drogi i przemieszczenia...",
                            "odpowiedzi": {A: "Zawsze różnią się o połowę", B: "Przemieszczenie jest większe", C: "Są sobie równe"}, "poprawna": "C",
                            "wzor": "s = |Δx|",
                            "wskazowka": "Przy ruchu prostoliniowym bez zawracania cała przebyta trasa jest jednym odcinkiem między początkiem i końcem.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Prędkość i czas ruchu",
                    "quiz": [
                        {
                            "pytanie": "Jak obliczyć średnią szybkość na podstawie całkowitej drogi i czasu ruchu?",
                            "odpowiedzi": {A: "v_śr = s/Δt", B: "v_śr = s·Δt", C: "v_śr = Δt/s"}, "poprawna": "A",
                            "wzor": "v_śr = s/Δt",
                            "wskazowka": "Szybkość mówi, jaką drogę średnio przypada na jednostkę czasu. Podziel całkowitą drogę przez całkowity czas.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało przebywa 120 m w 10 s. Jaka jest jego średnia szybkość?",
                            "odpowiedzi": {A: "1200 m/s", B: "0,083 m/s", C: "12 m/s"}, "poprawna": "C",
                            "wzor": "v_śr = s/Δt",
                            "wskazowka": "Podstaw s = 120 m i Δt = 10 s do wzoru na średnią szybkość. Wynik powinien mieć jednostkę m/s.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "72 km/h to ile m/s?",
                            "odpowiedzi": {A: "259,2 m/s", B: "20 m/s", C: "7,2 m/s"}, "poprawna": "B",
                            "wskazowka": "Przy zamianie km/h na m/s pomnóż przez 1000 i podziel przez 3600. Możesz też użyć przybliżenia 1 m/s = 3,6 km/h.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co oznacza prędkość chwilowa?",
                            "odpowiedzi": {A: "Prędkość w konkretnej chwili ruchu", B: "Całą drogę podzieloną przez cały czas w każdym przypadku", C: "Tylko maksymalną prędkość"}, "poprawna": "A",
                            "wzor": "v(t) = dx/dt",
                            "wskazowka": "Nie uśredniaj całego ruchu. Prędkość chwilowa opisuje stan ruchu w wybranym momencie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Prędkość jest wielkością wektorową, ponieważ ma...",
                            "odpowiedzi": {A: "Wartość, kierunek i zwrot", B: "Tylko jednostkę", C: "Tylko wartość"}, "poprawna": "A",
                            "wskazowka": "Odróżnij prędkość od szybkości. Szybkość jest skalarem, a prędkość zawiera również informację o kierunku i zwrocie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Pojazd jedzie 15 m/s przez 20 s. Jaką drogę pokona przy stałej prędkości?",
                            "odpowiedzi": {A: "35 m", B: "300 m", C: "0,75 m"}, "poprawna": "B",
                            "wzor": "s = vt",
                            "wskazowka": "Przy stałej prędkości droga rośnie proporcjonalnie do czasu. Pomnóż prędkość przez czas.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli czas ruchu zwiększymy dwukrotnie przy tej samej stałej prędkości, droga...",
                            "odpowiedzi": {A: "Nie zmieni się", B: "Zwiększy się dwukrotnie", C: "Zmniejszy się dwukrotnie"}, "poprawna": "B",
                            "wzor": "s = vt",
                            "wskazowka": "Przy stałym v droga jest wprost proporcjonalna do czasu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaka jest jednostka prędkości w SI?",
                            "odpowiedzi": {A: "m/s²", B: "N", C: "m/s"}, "poprawna": "C",
                            "wskazowka": "Prędkość opisuje zmianę położenia w czasie, więc połącz jednostkę długości z jednostką czasu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli prędkość chwilowa wynosi 0, czy ciało musi być przez cały ruch w spoczynku?",
                            "odpowiedzi": {A: "Nie, może mieć chwilowo v = 0", B: "Tak, zawsze", C: "Tylko gdy masa wynosi 0"}, "poprawna": "A",
                            "wskazowka": "Prędkość chwilowa dotyczy jednej chwili. Przykładem jest najwyższy punkt rzutu pionowego.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało pokonało 50 m w pierwszych 5 s i 100 m w kolejnych 5 s. Jaka jest średnia szybkość całego ruchu?",
                            "odpowiedzi": {A: "10 m/s", B: "30 m/s", C: "15 m/s"}, "poprawna": "C",
                            "wzor": "v_śr = s_całk/Δt_całk",
                            "wskazowka": "Najpierw zsumuj obie drogi, potem zsumuj oba przedziały czasu. Nie uśredniaj samych szybkości bez sprawdzenia czasów.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Ruch jednostajny prostoliniowy",
                    "quiz": [
                        {
                            "pytanie": "Co jest stałe w ruchu jednostajnym prostoliniowym?",
                            "odpowiedzi": {A: "Droga", B: "Wartość i kierunek prędkości", C: "Przyspieszenie różne od zera"}, "poprawna": "B",
                            "wzor": "v = const, a = 0",
                            "wskazowka": "Słowo „jednostajny” oznacza stałą prędkość, a „prostoliniowy” — stały kierunek ruchu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaki wzór opisuje drogę w ruchu jednostajnym, jeśli ciało zaczyna z położenia x₀?",
                            "odpowiedzi": {A: "x = x₀ + vt", B: "x = x₀ + at²", C: "x = v/t"}, "poprawna": "A",
                            "wzor": "x(t) = x₀ + vt",
                            "wskazowka": "Położenie początkowe trzeba dodać do zmiany położenia. W ruchu jednostajnym zmiana ta wynosi vt.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Na wykresie x(t) ruchu jednostajnego nachylenie prostej oznacza...",
                            "odpowiedzi": {A: "Prędkość", B: "Siłę", C: "Masę"}, "poprawna": "A",
                            "wzor": "v = Δx/Δt",
                            "wskazowka": "Nachylenie to zmiana wartości na osi pionowej podzielona przez zmianę czasu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Samochód jedzie 25 m/s przez 8 s. Jaką drogę pokona?",
                            "odpowiedzi": {A: "33 m", B: "200 m", C: "3,125 m"}, "poprawna": "B",
                            "wzor": "s = vt",
                            "wskazowka": "Masz stałą prędkość i czas, więc użyj bezpośrednio zależności s = vt.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli w ruchu jednostajnym prędkość wynosi 0, ciało...",
                            "odpowiedzi": {A: "Porusza się coraz szybciej", B: "Pozostaje w spoczynku", C: "Ma stałe dodatnie przyspieszenie"}, "poprawna": "B",
                            "wskazowka": "Stała prędkość równa zero oznacza brak zmiany położenia w czasie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak wygląda wykres v(t) dla ruchu jednostajnego?",
                            "odpowiedzi": {A: "Parabola", B: "Okrąg", C: "Linia pozioma"}, "poprawna": "C",
                            "wskazowka": "Skoro v nie zmienia się z czasem, wartość na osi v pozostaje stała.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak wygląda wykres a(t) dla ruchu jednostajnego?",
                            "odpowiedzi": {A: "Pokrywa się z osią czasu, czyli a = 0", B: "Jest linią rosnącą", C: "Jest parabolą"}, "poprawna": "A",
                            "wzor": "a = 0",
                            "wskazowka": "Brak zmiany prędkości oznacza brak przyspieszenia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwa pojazdy jadą w tym samym kierunku z prędkościami 20 m/s i 12 m/s. Jaka jest ich prędkość względna?",
                            "odpowiedzi": {A: "32 m/s", B: "240 m/s", C: "8 m/s"}, "poprawna": "C",
                            "wzor": "v_wzgl = |v₁ − v₂|",
                            "wskazowka": "Przy ruchu w tym samym kierunku odejmij wartości prędkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W ruchu jednostajnym droga przebyta w kolejnych równych odstępach czasu jest...",
                            "odpowiedzi": {A: "Coraz mniejsza", B: "Taka sama", C: "Coraz większa"}, "poprawna": "B",
                            "wskazowka": "Stała prędkość oznacza taką samą zmianę położenia w każdym równym czasie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało pokonało 360 m z prędkością 18 m/s. Ile trwał ruch jednostajny?",
                            "odpowiedzi": {A: "20 s", B: "6,7 s", C: "378 s"}, "poprawna": "A",
                            "wzor": "t = s/v",
                            "wskazowka": "Szukasz czasu, więc przekształć s = vt względem t, a dopiero potem podstaw dane.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Przyspieszenie i opóźnienie",
                    "quiz": [
                        {
                            "pytanie": "Czym jest przyspieszenie?",
                            "odpowiedzi": {A: "Zmianą wektora prędkości w czasie", B: "Siłą podzieloną przez drogę", C: "Drogą przebytą w czasie"}, "poprawna": "A",
                            "wzor": "a = Δv/Δt",
                            "wskazowka": "Porównaj prędkość początkową i końcową oraz czas, w którym nastąpiła zmiana.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Samochód zwiększa prędkość z 10 do 20 m/s w 5 s. Jakie ma średnie przyspieszenie?",
                            "odpowiedzi": {A: "6 m/s²", B: "2 m/s²", C: "50 m/s²"}, "poprawna": "B",
                            "wzor": "a = (v − v₀)/Δt",
                            "wskazowka": "Najpierw policz zmianę prędkości: v − v₀. Następnie podziel ją przez czas zmiany.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaką jednostkę ma przyspieszenie?",
                            "odpowiedzi": {A: "m²/s", B: "m/s²", C: "m/s"}, "poprawna": "B",
                            "wskazowka": "Przyspieszenie to prędkość podzielona przez czas. Podziel jednostkę m/s przez s.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeżeli prędkość maleje w czasie, przyspieszenie wzdłuż kierunku ruchu może być...",
                            "odpowiedzi": {A: "Zawsze dodatnie", B: "Zawsze równe zero", C: "Ujemne"}, "poprawna": "C",
                            "wskazowka": "Przyjmij kierunek ruchu jako dodatni i zobacz, czy zmiana prędkości ma zwrot przeciwny do osi dodatniej.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co nazywamy opóźnieniem?",
                            "odpowiedzi": {A: "Zmniejszaniem wartości prędkości w czasie", B: "Każdym ruchem po okręgu", C: "Zwiększaniem drogi w czasie"}, "poprawna": "A",
                            "wskazowka": "Opóźnienie opisuje sytuację, w której wartość prędkości maleje. Zwróć uwagę na kierunek osi, jeśli używasz znaku przyspieszenia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało zmienia prędkość z 4 m/s do 16 m/s w 6 s. Jaka jest wartość średniego przyspieszenia?",
                            "odpowiedzi": {A: "12 m/s²", B: "20 m/s²", C: "2 m/s²"}, "poprawna": "C",
                            "wzor": "a = (16 − 4)/6",
                            "wskazowka": "Oblicz zmianę prędkości, czyli 16 − 4, i podziel przez 6 s.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czy przyspieszenie może być niezerowe, gdy szybkość jest stała?",
                            "odpowiedzi": {A: "Tylko gdy masa się zmienia", B: "Tak, gdy zmienia się kierunek prędkości", C: "Nie, nigdy"}, "poprawna": "B",
                            "wzor": "a = Δ⃗v/Δt",
                            "wskazowka": "Przyspieszenie zależy od zmiany wektora prędkości. Nawet przy stałej szybkości zmiana kierunku oznacza zmianę wektora.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeżeli v₀ = 5 m/s, a = 0 i t = 10 s, jaka będzie prędkość końcowa?",
                            "odpowiedzi": {A: "5 m/s", B: "0 m/s", C: "50 m/s"}, "poprawna": "A",
                            "wzor": "v = v₀ + at",
                            "wskazowka": "Brak przyspieszenia oznacza, że prędkość się nie zmienia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Samochód hamuje od 30 m/s do 10 m/s w 4 s. Jakie jest jego średnie przyspieszenie przy osi dodatniej zgodnej z ruchem?",
                            "odpowiedzi": {A: "−5 m/s²", B: "−20 m/s²", C: "5 m/s²"}, "poprawna": "A",
                            "wzor": "a = (v − v₀)/Δt",
                            "wskazowka": "Końcowa prędkość jest mniejsza od początkowej, więc licznik będzie ujemny. Dopiero potem podziel przez 4 s.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Na wykresie v(t) nachylenie prostej odpowiada...",
                            "odpowiedzi": {A: "Drodze", B: "Przyspieszeniu", C: "Masie"}, "poprawna": "B",
                            "wzor": "a = Δv/Δt",
                            "wskazowka": "Nachylenie to zmiana v podzielona przez zmianę czasu — dokładnie definicja przyspieszenia średniego.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Ruch jednostajnie przyspieszony i opóźniony",
                    "quiz": [
                        {
                            "pytanie": "Jaki warunek definiuje ruch jednostajnie przyspieszony?",
                            "odpowiedzi": {A: "Droga jest zawsze równa zero", B: "Przyspieszenie ma stałą wartość", C: "Prędkość jest zawsze stała"}, "poprawna": "B",
                            "wzor": "a = const",
                            "wskazowka": "Słowo „jednostajnie” odnosi się tutaj do stałości przyspieszenia, a nie prędkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak obliczyć prędkość po czasie t przy stałym przyspieszeniu?",
                            "odpowiedzi": {A: "v = v₀/t + a", B: "v = at/v₀", C: "v = v₀ + at"}, "poprawna": "C",
                            "wzor": "v = v₀ + at",
                            "wskazowka": "Zacznij od prędkości początkowej. Przyspieszenie zmienia prędkość o at.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaki wzór opisuje położenie przy stałym przyspieszeniu?",
                            "odpowiedzi": {A: "x = x₀ + v₀t + ½at²", B: "x = x₀ + vt²", C: "x = at/v₀"}, "poprawna": "A",
                            "wzor": "x = x₀ + v₀t + ½at²",
                            "wskazowka": "Uwzględnij zarówno ruch wynikający z prędkości początkowej, jak i dodatkowe przesunięcie wywołane przyspieszeniem.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało rusza z miejsca z a = 2 m/s². Jaka będzie jego prędkość po 5 s?",
                            "odpowiedzi": {A: "2,5 m/s", B: "25 m/s", C: "10 m/s"}, "poprawna": "C",
                            "wzor": "v = v₀ + at",
                            "wskazowka": "„Rusza z miejsca” oznacza v₀ = 0. Wstaw a i t do wzoru na prędkość.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało rusza z miejsca z a = 2 m/s². Jaką drogę pokona w 5 s?",
                            "odpowiedzi": {A: "50 m", B: "25 m", C: "10 m"}, "poprawna": "B",
                            "wzor": "s = v₀t + ½at²",
                            "wskazowka": "Ponieważ v₀ = 0, pierwszy składnik znika. Pozostaje część zależna od a i t².",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak wygląda wykres v(t) przy stałym dodatnim przyspieszeniu?",
                            "odpowiedzi": {A: "Prosta rosnąca", B: "Linia pozioma", C: "Parabola zawsze"}, "poprawna": "A",
                            "wzor": "v(t) = v₀ + at",
                            "wskazowka": "Prędkość rośnie o taką samą wartość w każdym kolejnym równym czasie, więc wykres jest liniowy.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak wygląda wykres x(t) przy stałym niezerowym przyspieszeniu?",
                            "odpowiedzi": {A: "Parabola", B: "Okrąg", C: "Linia pozioma zawsze"}, "poprawna": "A",
                            "wzor": "x(t) = x₀ + v₀t + ½at²",
                            "wskazowka": "W równaniu położenia występuje t². To właśnie składnik kwadratowy powoduje kształt paraboli.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli a ma zwrot przeciwny do prędkości, ciało może...",
                            "odpowiedzi": {A: "Zawsze przyspieszać", B: "Zwalniać", C: "Nie zmieniać prędkości"}, "poprawna": "B",
                            "wskazowka": "Porównaj kierunki wektorów v i a. Przyspieszenie przeciwne do prędkości zmniejsza wartość szybkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Po jakim czasie ciało z v₀ = 4 m/s i a = 2 m/s² osiągnie 14 m/s?",
                            "odpowiedzi": {A: "10 s", B: "5 s", C: "7 s"}, "poprawna": "B",
                            "wzor": "t = (v − v₀)/a",
                            "wskazowka": "Najpierw przekształć v = v₀ + at względem t. Potem podstaw v = 14 m/s, v₀ = 4 m/s i a = 2 m/s².",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czy ruch jednostajnie opóźniony ma stałe przyspieszenie?",
                            "odpowiedzi": {A: "Nie, nigdy", B: "Tylko podczas spadku swobodnego", C: "Tak, jeśli wartość opóźnienia jest stała"}, "poprawna": "C",
                            "wskazowka": "Jednostajnie opóźniony oznacza stałą zmianę prędkości w czasie, tylko ze zwrotem przeciwnym do ruchu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Wykresy ruchu",
                    "quiz": [
                        {
                            "pytanie": "Co oznacza nachylenie wykresu x(t)?",
                            "odpowiedzi": {A: "Prędkość", B: "Przyspieszenie", C: "Siłę"}, "poprawna": "A",
                            "wzor": "v = dx/dt",
                            "wskazowka": "Sprawdź, jak szybko zmienia się położenie wraz z czasem. Nachylenie x(t) daje prędkość.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co oznacza nachylenie wykresu v(t)?",
                            "odpowiedzi": {A: "Drogę", B: "Położenie", C: "Przyspieszenie"}, "poprawna": "C",
                            "wzor": "a = dv/dt",
                            "wskazowka": "Nachylenie to zmiana prędkości na jednostkę czasu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co oznacza pole pod wykresem v(t) w czasie ruchu prostoliniowego?",
                            "odpowiedzi": {A: "Przyspieszenie", B: "Przemieszczenie", C: "Masę"}, "poprawna": "B",
                            "wzor": "Δx = ∫v(t)dt",
                            "wskazowka": "Pole ma wymiar prędkość razy czas, czyli m/s · s = m. To odpowiada zmianie położenia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co oznacza pozioma linia v(t) powyżej zera?",
                            "odpowiedzi": {A: "Stałą dodatnią prędkość", B: "Stałe dodatnie przyspieszenie", C: "Spoczynek"}, "poprawna": "A",
                            "wzor": "v = const",
                            "wskazowka": "Pozioma linia oznacza stałą wartość na osi pionowej. Skoro jest powyżej zera, prędkość jest dodatnia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co oznacza pozioma linia a(t) na poziomie zera?",
                            "odpowiedzi": {A: "Brak przyspieszenia", B: "Ruch niemożliwy", C: "Stałe przyspieszenie 10 m/s²"}, "poprawna": "A",
                            "wzor": "a = 0",
                            "wskazowka": "Wartość a = 0 oznacza, że wektor prędkości się nie zmienia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli wykres v(t) jest prostą rosnącą, przyspieszenie jest...",
                            "odpowiedzi": {A: "Równe zero", B: "Stałe i dodatnie", C: "Zawsze ujemne"}, "poprawna": "B",
                            "wskazowka": "Stałe nachylenie rosnącej prostej oznacza stałe dodatnie a.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli wykres v(t) przecina oś czasu, co może to oznaczać?",
                            "odpowiedzi": {A: "Czas przestał płynąć", B: "Prędkość zmieniła znak", C: "Masa stała się zerowa"}, "poprawna": "B",
                            "wskazowka": "Na osi czasu v = 0. Jeśli wykres przechodzi z wartości dodatnich na ujemne, zmienia się zwrot ruchu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak wygląda x(t) dla spoczynku?",
                            "odpowiedzi": {A: "Linia rosnąca o stałym nachyleniu", B: "Parabola zawsze", C: "Linia pozioma"}, "poprawna": "C",
                            "wzor": "x = const",
                            "wskazowka": "Spoczynek oznacza, że położenie nie zmienia się wraz z czasem.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeżeli wykres x(t) jest coraz bardziej stromy w dodatnim kierunku, to wartość prędkości...",
                            "odpowiedzi": {A: "Rośnie", B: "Maleje do zera", C: "Jest stała"}, "poprawna": "A",
                            "wskazowka": "Stromość x(t) oznacza wartość prędkości. Coraz większe nachylenie oznacza wzrost prędkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Pole pod wykresem a(t) w przedziale czasu odpowiada zmianie...",
                            "odpowiedzi": {A: "Położenia bezpośrednio", B: "Masy", C: "Prędkości"}, "poprawna": "C",
                            "wzor": "Δv = ∫a(t)dt",
                            "wskazowka": "Jednostka pola to m/s² · s = m/s, czyli jednostka zmiany prędkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Spadek swobodny i rzuty pionowe",
                    "quiz": [
                        {
                            "pytanie": "Jakie przyspieszenie ma ciało w spadku swobodnym, jeśli pomijamy opór powietrza?",
                            "odpowiedzi": {A: "Zawsze skierowane w górę", B: "Przyspieszenie g skierowane w dół", C: "Zero"}, "poprawna": "B",
                            "wzor": "a = g ≈ 9,81 m/s²",
                            "wskazowka": "Na ciało działa grawitacja. Przyjmij zwrot osi i odpowiednio przypisz znak przyspieszeniu g.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało spada z v₀ = 0. Jak obliczyć jego prędkość po czasie t?",
                            "odpowiedzi": {A: "v = gt", B: "v = g/t", C: "v = t/g"}, "poprawna": "A",
                            "wzor": "v = v₀ + gt = gt",
                            "wskazowka": "To szczególny przypadek ruchu jednostajnie przyspieszonego z v₀ = 0 i przyspieszeniem g.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaką drogę pokona ciało puszczone swobodnie po czasie t?",
                            "odpowiedzi": {A: "h = ½gt²", B: "h = g/t²", C: "h = gt"}, "poprawna": "A",
                            "wzor": "h = ½gt²",
                            "wskazowka": "Użyj wzoru na drogę przy stałym przyspieszeniu i zauważ, że v₀ = 0.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W najwyższym punkcie rzutu pionowego w górę prędkość chwilowa wynosi...",
                            "odpowiedzi": {A: "g", B: "0", C: "Maksimum"}, "poprawna": "B",
                            "wskazowka": "W najwyższym punkcie ciało na moment przestaje poruszać się w górę, zanim zacznie spadać.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czy w najwyższym punkcie rzutu pionowego przyspieszenie jest równe zero?",
                            "odpowiedzi": {A: "Tylko gdy ciało ma masę 0", B: "Nie, nadal działa grawitacja", C: "Tak, zawsze"}, "poprawna": "B",
                            "wzor": "a = −g (oś dodatnia w górę)",
                            "wskazowka": "Prędkość może być chwilowo równa zero, ale grawitacja nadal działa.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ciało rzucono pionowo w górę z v₀. Jak znaleźć czas do osiągnięcia najwyższego punktu?",
                            "odpowiedzi": {A: "t = g/v₀", B: "t = v₀g", C: "t = v₀/g"}, "poprawna": "C",
                            "wzor": "v = v₀ − gt; 0 = v₀ − gt",
                            "wskazowka": "W najwyższym punkcie przyjmij v = 0. Z równania prędkości wyznacz t.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwa ciała spadają z tej samej wysokości bez oporu powietrza. Jedno jest cięższe. Które ma większe przyspieszenie?",
                            "odpowiedzi": {A: "Oba mają takie samo g", B: "Cięższe", C: "Lżejsze"}, "poprawna": "A",
                            "wskazowka": "W modelu swobodnego spadku przyspieszenie g nie zależy od masy ciała.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli wysokość swobodnego spadku wzrośnie czterokrotnie, czas spadania wzrośnie...",
                            "odpowiedzi": {A: "Czterokrotnie", B: "Ośmiokrotnie", C: "Dwukrotnie"}, "poprawna": "C",
                            "wzor": "h = ½gt²",
                            "wskazowka": "Zależność wysokości od czasu zawiera t². Porównaj pierwiastki ze stosunku wysokości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaką prędkość ma ciało po 2 s swobodnego spadku, przyjmując g = 10 m/s²?",
                            "odpowiedzi": {A: "40 m/s", B: "20 m/s", C: "5 m/s"}, "poprawna": "B",
                            "wzor": "v = gt",
                            "wskazowka": "Podstaw g = 10 m/s² i t = 2 s. Jednostka wyniku powinna wyjść m/s.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W rzucie pionowym w górę, po minięciu najwyższego punktu ciało...",
                            "odpowiedzi": {A: "Zaczyna zwiększać wartość prędkości w dół", B: "Ma nadal stałą prędkość zero", C: "Przestaje podlegać grawitacji"}, "poprawna": "A",
                            "wskazowka": "Po osiągnięciu v = 0 ciało zaczyna spadać. Grawitacja nadaje mu coraz większą prędkość skierowaną w dół.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Ruch względny",
                    "quiz": [
                        {
                            "pytanie": "Czym jest prędkość względna?",
                            "odpowiedzi": {A: "Prędkością jednego ciała mierzoną względem drugiego", B: "Sumą wszystkich prędkości we Wszechświecie", C: "Zawsze prędkością względem Ziemi"}, "poprawna": "A",
                            "wzor": "v_{A/B} = v_A − v_B",
                            "wskazowka": "Zamiast względem Ziemi wybierz jako obserwatora drugie ciało. Wtedy porównujesz ich prędkości wektorowo.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwa samochody jadą w tym samym kierunku z 30 m/s i 20 m/s. Jaka jest szybkość względna?",
                            "odpowiedzi": {A: "50 m/s", B: "10 m/s", C: "600 m/s"}, "poprawna": "B",
                            "wzor": "v_wzgl = |v₁ − v₂|",
                            "wskazowka": "Przy zgodnych kierunkach odejmij prędkości. Większa prędkość „ucieka” drugiemu pojazdowi o różnicę.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwa pojazdy jadą naprzeciw siebie z 15 m/s i 10 m/s. Jaka jest szybkość zbliżania?",
                            "odpowiedzi": {A: "150 m/s", B: "25 m/s", C: "5 m/s"}, "poprawna": "B",
                            "wzor": "v_wzgl = v₁ + v₂",
                            "wskazowka": "Przy ruchu w przeciwnych kierunkach odległość między pojazdami zmniejsza się w tempie będącym sumą ich szybkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Pasażer siedzi w jadącym pociągu. Względem pociągu jest...",
                            "odpowiedzi": {A: "Zawsze w ruchu", B: "W ruchu tylko na zakrętach", C: "W spoczynku"}, "poprawna": "C",
                            "wskazowka": "Ruch zależy od układu odniesienia. Dla obserwatora siedzącego w tym samym pociągu położenie pasażera się nie zmienia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli deszcz pada pionowo względem Ziemi, osoba jadąca rowerem odczuwa go pod kątem. Dlaczego?",
                            "odpowiedzi": {A: "Bo widzi prędkość deszczu względną względem siebie", B: "Bo grawitacja zmienia kierunek deszczu", C: "Bo deszcz przestaje być pionowy względem Ziemi"}, "poprawna": "A",
                            "wzor": "v_{deszcz/osoba} = v_{deszcz/Ziemia} − v_{osoba/Ziemia}",
                            "wskazowka": "Oblicz prędkość deszczu względem rowerzysty, odejmując wektory prędkości.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli obserwator porusza się razem z ciałem, jego prędkość względem obserwatora wynosi...",
                            "odpowiedzi": {A: "Prędkość ciała względem Ziemi", B: "Zawsze g", C: "0"}, "poprawna": "C",
                            "wskazowka": "Oba obiekty mają wtedy tę samą prędkość, więc ich różnica wektorowa jest zerowa.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W ruchu względnym znaczenie ma przede wszystkim...",
                            "odpowiedzi": {A: "Tylko jego kształt", B: "Wybór układu odniesienia", C: "Tylko masa ciała"}, "poprawna": "B",
                            "wskazowka": "Zawsze zapytaj: względem czego mierzymy położenie i prędkość? To podstawowe pytanie w zadaniach o ruch względny.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Łódź płynie z prędkością względem wody, a rzeka ma własny nurt. Aby znaleźć prędkość łodzi względem brzegu, trzeba...",
                            "odpowiedzi": {A: "Dodać odpowiednie wektory prędkości", B: "Zawsze odjąć ich wartości bez względu na kierunek", C: "Pomnożyć prędkości"}, "poprawna": "A",
                            "wzor": "⃗v_{łódź/brzeg} = ⃗v_{łódź/woda} + ⃗v_{woda/brzeg}",
                            "wskazowka": "Zwróć uwagę na kierunki wektorów. To dodawanie wektorowe, więc nie zawsze jest zwykłym dodawaniem liczb.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli dwa ciała mają identyczne wektory prędkości w tym samym układzie, ich prędkość względna wynosi...",
                            "odpowiedzi": {A: "0", B: "Połowę wartości", C: "Podwojoną wartość"}, "poprawna": "A",
                            "wzor": "⃗v_{A/B} = ⃗v_A − ⃗v_B = 0",
                            "wskazowka": "Odejmij identyczne wektory. Wynik jest wektorem zerowym.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dlaczego określenie „ciało porusza się” bez podania układu odniesienia może być niepełne?",
                            "odpowiedzi": {A: "Bo ruch zależy od temperatury", B: "Bo ruch i spoczynek są względne względem wybranego obserwatora", C: "Bo każde ciało musi być w ruchu względem każdego obserwatora"}, "poprawna": "B",
                            "wskazowka": "Ten sam obiekt może spoczywać względem jednego obserwatora i poruszać się względem innego.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Ruch po okręgu",
                    "quiz": [
                        {
                            "pytanie": "Jak obliczyć prędkość kątową w ruchu okresowym?",
                            "odpowiedzi": {A: "ω = 2πT", B: "ω = 2π/T", C: "ω = T/2π"}, "poprawna": "B",
                            "wzor": "ω = 2π/T",
                            "wskazowka": "Jedno pełne okrążenie odpowiada 2π radianom i trwa okres T. Podziel kąt pełnego obrotu przez czas.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak związać częstotliwość z okresem ruchu?",
                            "odpowiedzi": {A: "f = T", B: "f = T²", C: "f = 1/T"}, "poprawna": "C",
                            "wzor": "f = 1/T",
                            "wskazowka": "Częstotliwość mówi, ile pełnych obiegów przypada na sekundę, więc jest odwrotnością czasu jednego obiegu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak obliczyć szybkość liniową w ruchu po okręgu?",
                            "odpowiedzi": {A: "v = ωr", B: "v = ω/r", C: "v = r/ω"}, "poprawna": "A",
                            "wzor": "v = ωr",
                            "wskazowka": "Prędkość liniowa rośnie wraz z promieniem przy tej samej prędkości kątowej.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Gdzie skierowane jest przyspieszenie dośrodkowe?",
                            "odpowiedzi": {A: "Wzdłuż stycznej zawsze", B: "Na zewnątrz okręgu", C: "Do środka okręgu"}, "poprawna": "C",
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Narysuj ciało na okręgu i zaznacz środek. Przyspieszenie dośrodkowe wskazuje od ciała do środka toru.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czy ciało poruszające się po okręgu ze stałą szybkością ma przyspieszenie?",
                            "odpowiedzi": {A: "Tylko gdy zmienia masę", B: "Tak, bo zmienia kierunek prędkości", C: "Nie, bo szybkość jest stała"}, "poprawna": "B",
                            "wskazowka": "Szybkość może być stała, ale wektor prędkości stale zmienia kierunek.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Samochód jedzie po okręgu z v = 10 m/s i r = 50 m. Jakie ma przyspieszenie dośrodkowe?",
                            "odpowiedzi": {A: "2 m/s²", B: "5 m/s²", C: "500 m/s²"}, "poprawna": "A",
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Podnieś 10 m/s do kwadratu, a następnie podziel przez promień 50 m.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli przy tej samej prędkości promień toru zwiększymy dwukrotnie, przyspieszenie dośrodkowe...",
                            "odpowiedzi": {A: "Zmniejszy się dwukrotnie", B: "Nie zmieni się", C: "Wzrośnie dwukrotnie"}, "poprawna": "A",
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Przy stałym v promień znajduje się w mianowniku. Zwiększenie r zmniejsza wartość a_d.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli przy tym samym promieniu podwoimy prędkość, przyspieszenie dośrodkowe...",
                            "odpowiedzi": {A: "Wzrośnie dwukrotnie", B: "Wzrośnie czterokrotnie", C: "Zmniejszy się dwukrotnie"}, "poprawna": "B",
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Prędkość występuje w kwadracie. Podwojenie v oznacza czynnik 2².",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co jest okresem ruchu po okręgu?",
                            "odpowiedzi": {A: "Długość promienia", B: "Czas jednego pełnego obiegu", C: "Liczba obiegów w sekundzie"}, "poprawna": "B",
                            "wskazowka": "Okres oznacza czas potrzebny na wykonanie dokładnie jednego pełnego cyklu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak zmieni się częstotliwość, jeśli okres ruchu skróci się dwukrotnie?",
                            "odpowiedzi": {A: "Zmniejszy się dwukrotnie", B: "Nie zmieni się", C: "Wzrośnie dwukrotnie"}, "poprawna": "C",
                            "wzor": "f = 1/T",
                            "wskazowka": "Częstotliwość i okres są odwrotnie proporcjonalne. Mniejszy okres oznacza więcej obiegów w tej samej sekundzie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Rzuty i ruch w dwóch wymiarach",
                    "quiz": [
                        {
                            "pytanie": "W rzucie poziomym, pomijając opór powietrza, jaka jest składowa pozioma prędkości?",
                            "odpowiedzi": {A: "Stała", B: "Stale rośnie", C: "Stale maleje do zera"}, "poprawna": "A",
                            "wzor": "v_x = const",
                            "wskazowka": "Grawitacja działa pionowo, więc nie zmienia poziomej składowej prędkości w idealnym modelu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W rzucie poziomym jaka siła odpowiada za zmianę pionowej prędkości?",
                            "odpowiedzi": {A: "Siła pozioma o stałej wartości", B: "Siła sprężystości", C: "Grawitacja"}, "poprawna": "C",
                            "wskazowka": "W idealnym rzucie po opuszczeniu wyrzutni pozostaje grawitacja, która nadaje pionowe przyspieszenie g.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Tor rzutu poziomego bez oporu powietrza ma kształt...",
                            "odpowiedzi": {A: "Prostej poziomej", B: "Paraboli", C: "Okręgu"}, "poprawna": "B",
                            "wskazowka": "Poziomo ruch jest jednostajny, a pionowo jednostajnie przyspieszony. Po połączeniu obu zależności otrzymujesz parabolę.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czas spadania w rzucie poziomym z wysokości h zależy przede wszystkim od...",
                            "odpowiedzi": {A: "Wysokości i grawitacji", B: "Masy ciała", C: "Poziomej prędkości początkowej"}, "poprawna": "A",
                            "wzor": "h = ½gt²",
                            "wskazowka": "Ruch pionowy jest niezależny od poziomej składowej. Z równania pionowego wyznacz czas.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zasięg rzutu poziomego można obliczyć jako...",
                            "odpowiedzi": {A: "x = v₀t", B: "x = h/t", C: "x = gt"}, "poprawna": "A",
                            "wzor": "x = v₀t",
                            "wskazowka": "Poziomo ciało porusza się ze stałą prędkością v₀. Zasięg to pozioma prędkość razy czas lotu.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W rzucie ukośnym, bez oporu powietrza, przyspieszenie poziome jest...",
                            "odpowiedzi": {A: "Równe g", B: "Równe zero", C: "Zawsze ujemne"}, "poprawna": "B",
                            "wskazowka": "Grawitacja działa pionowo. W poziomie, jeśli pomijamy opór, nie ma przyspieszenia.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W najwyższym punkcie rzutu ukośnego pionowa składowa prędkości wynosi...",
                            "odpowiedzi": {A: "Maksimum", B: "0", C: "g"}, "poprawna": "B",
                            "wskazowka": "To moment, w którym pionowy ruch zmienia zwrot z wznoszenia na opadanie.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czy pozioma składowa prędkości w rzucie ukośnym zmienia się bez oporu powietrza?",
                            "odpowiedzi": {A: "Tak, rośnie z g", B: "Tak, maleje do zera", C: "Nie, pozostaje stała"}, "poprawna": "C",
                            "wzor": "v_x = v₀ cosα = const",
                            "wskazowka": "Rozłóż prędkość początkową na składowe. Grawitacja wpływa tylko na składową pionową.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dla rzutu ukośnego pod kątem α składowa pionowa prędkości początkowej wynosi...",
                            "odpowiedzi": {A: "v₀ sinα", B: "v₀ cosα", C: "v₀/α"}, "poprawna": "A",
                            "wzor": "v_{0y} = v₀ sinα",
                            "wskazowka": "Narysuj wektor v₀ jako przeciwprostokątną trójkąta. Składowa pionowa jest bokiem naprzeciw kąta α.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dla rzutu ukośnego składowa pozioma prędkości początkowej wynosi...",
                            "odpowiedzi": {A: "v₀ sinα", B: "v₀α", C: "v₀ cosα"}, "poprawna": "C",
                            "wzor": "v_{0x} = v₀ cosα",
                            "wskazowka": "Składowa pozioma jest bokiem przyległym do kąta α, więc korzystasz z cosinusa.",
                            "poziom": 1,
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "dynamika": [
                {
                    "temat": "Zasady Newtona",
                    "quiz": [
                        {
                            "pytanie": "Na ciało 3 kg działa wypadkowa siła 12 N. Jakie ma przyspieszenie?",
                            "odpowiedzi": {A: "0,25 m/s²", B: "4 m/s²", C: "36 m/s²"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli wypadkowa siła działająca na ciało wynosi 0, ciało może:",
                            "odpowiedzi": {A: "Spoczywać lub poruszać się ruchem jednostajnym", B: "Zawsze przyspieszać", C: "Zawsze hamować"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwie siły 8 N i 5 N działają w przeciwnych kierunkach. Wypadkowa ma wartość:",
                            "odpowiedzi": {A: "3 N", B: "40 N", C: "13 N"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Siła tarcia",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej wyjaśnia, czym jest siła tarcia?",
                            "odpowiedzi": {A: "Siła dośrodkowa", B: "Siła oporu ruchu", C: "Siła grawitacji"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "statyka_i_bryla": [
                {
                    "temat": "Równowaga ciał",
                    "quiz": [
                        {
                            "pytanie": "Jaki warunek musi być spełniony, aby ciało pozostawało w równowadze mechanicznej?",
                            "odpowiedzi": {A: "Gdy działa siła", B: "Gdy suma sił = 0", C: "Gdy się porusza"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Moment siły",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej opisuje moment siły i jego wpływ na ruch obrotowy?",
                            "odpowiedzi": {A: "Siła podzielona przez czas", B: "Energia", C: "Iloczyn siły i ramienia"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Prędkość kątowa",
                    "quiz": [
                        {
                            "pytanie": "Koło wykonuje 5 pełnych obrotów w 10 s. Jaka jest jego prędkość kątowa?",
                            "odpowiedzi": {A: "π rad/s", B: "0,5 rad/s", C: "10π rad/s"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Przyspieszenie dośrodkowe",
                    "quiz": [
                        {
                            "pytanie": "Dla v = 6 m/s i r = 3 m przyspieszenie dośrodkowe wynosi:",
                            "odpowiedzi": {A: "2 m/s²", B: "18 m/s²", C: "12 m/s²"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Moment pędu",
                    "quiz": [
                        {
                            "pytanie": "Punkt materialny ma pęd 4 kg·m/s i ramię 0,5 m prostopadłe do pędu. Jaki ma moment pędu?",
                            "odpowiedzi": {A: "4,5 kg·m²/s", B: "2 kg·m²/s", C: "8 kg·m²/s"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Mechanika punktu materialnego i bryły sztywnej",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Samochód zwiększa prędkość z 10 do 25 m/s w 5 s. Jaką drogę pokona w tym czasie, jeśli przyspieszenie jest stałe?",
                            "odpowiedzi": {A: "87,5 m", B: "62,5 m", C: "125 m"}, "poprawna": "A",
                            "wzor": "s=((v₀+v)/2)t",
                            "rozwiazanie": "Przy stałym przyspieszeniu prędkość średnia wynosi (10+25)/2=17,5 m/s, więc s=87,5 m.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Skrzynia 5 kg jest ciągnięta siłą 30 N po poziomej powierzchni. Tarcie ma 10 N. Jakie jest przyspieszenie?",
                            "odpowiedzi": {A: "4 m/s²", B: "8 m/s²", C: "6 m/s²"}, "poprawna": "A",
                            "wzor": "a=(F−Fₜ)/m",
                            "rozwiazanie": "Siła wypadkowa wynosi 20 N, więc a=20/5=4 m/s².",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Krążek o promieniu 0,20 m obraca się z częstotliwością 5 Hz. Jaka jest prędkość liniowa punktu na jego brzegu?",
                            "odpowiedzi": {A: "π m/s", B: "2π m/s", C: "10π m/s"}, "poprawna": "B",
                            "wzor": "v=2πrf",
                            "rozwiazanie": "v=2π·0,20·5=2π m/s.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Na ciało działa stała siła 12 N przez 0,50 s. Jego pęd zmienia się o 6 kg·m/s. Który wniosek jest poprawny?",
                            "odpowiedzi": {A: "Siła nie mogła być stała", B: "Zgodny z impulsem siły", C: "Pęd musi zmienić się o 24 kg·m/s"}, "poprawna": "B",
                            "wzor": "Δp=FΔt",
                            "rozwiazanie": "Impuls wynosi 12·0,50=6 N·s=6 kg·m/s, więc zgadza się ze zmianą pędu.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "Koło", B: "Parabola", C: "Elipsa"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Ruch orbitalny",
                    "quiz": [
                        {
                            "pytanie": "Planeta porusza się po orbicie eliptycznej. Jej prędkość jest większa:",
                            "odpowiedzi": {A: "Bliżej Słońca", B: "Dalej od Słońca", C: "Zawsze taka sama"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Okres obiegu planety wokół Słońca rośnie wraz z odległością zgodnie z:",
                            "odpowiedzi": {A: "Prawem Ohma", B: "Prawem Archimedesa", C: "III prawem Keplera"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Satelita na orbicie kołowej porusza się dzięki równowadze między bezwładnością a:",
                            "odpowiedzi": {A: "Siłą elektryczną", B: "Grawitacją", C: "Tarciem powietrza"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Zastosowania grawitacji w astronomii",
                    "quiz": [
                        {
                            "pytanie": "Jeśli odległość między planetą i gwiazdą wzrośnie 2 razy, siła grawitacji:",
                            "odpowiedzi": {A: "Zmaleje 4 razy", B: "Zmaleje 2 razy", C: "Wzrośnie 2 razy"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zwiększenie masy planety 2 razy przy tej samej odległości powoduje siłę grawitacji:",
                            "odpowiedzi": {A: "2 razy większą", B: "Bez zmiany", C: "4 razy większą"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Prędkość ucieczki z danego ciała zależy między innymi od jego:",
                            "odpowiedzi": {A: "Koloru", B: "Masy i promienia", C: "Liczby pierścieni"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "ciala_niebieskie": [
                {
                    "temat": "Gwiazdy",
                    "quiz": [
                        {
                            "pytanie": "Jaki proces fizyczny jest głównym źródłem energii gwiazd ciągu głównego podobnych do Słońca?",
                            "odpowiedzi": {A: "Rozszczepianie żelaza", B: "Fuzja jąder wodoru", C: "Spalanie chemiczne"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Barwa gwiazdy jest związana z jej:",
                            "odpowiedzi": {A: "Odległością od Ziemi wyłącznie", B: "Masą Ziemi", C: "Temperaturą powierzchni"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W widmie gwiazdy linie absorpcyjne mogą informować o:",
                            "odpowiedzi": {A: "Składzie chemicznym", B: "Promieniu Ziemi", C: "Kształcie orbity Księżyca"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Planety",
                    "quiz": [
                        {
                            "pytanie": "Ile planet obejmuje Układ Słoneczny według współczesnej klasyfikacji?",
                            "odpowiedzi": {A: "7", B: "9", C: "8"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która planeta krąży najbliżej Słońca?",
                            "odpowiedzi": {A: "Mars", B: "Merkury", C: "Wenus"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która planeta ma największą masę i rozmiary w Układzie Słonecznym?",
                            "odpowiedzi": {A: "Jowisz", B: "Saturn", C: "Neptun"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "gwiazdy_galaktyki": [
                {
                    "temat": "Ewolucja gwiazd",
                    "quiz": [
                        {
                            "pytanie": "Gwiazda podobna do Słońca po fazie ciągu głównego może stać się:",
                            "odpowiedzi": {A: "Czerwonym olbrzymem", B: "Planetą", C: "Czarną dziurą zawsze"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Pozostałością po gwieździe podobnej do Słońca może być:",
                            "odpowiedzi": {A: "Gwiazda neutronowa zawsze", B: "Biały karzeł", C: "Jowisz"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Supernowa może być końcowym etapem ewolucji:",
                            "odpowiedzi": {A: "Każdego meteoru", B: "Niektórych masywnych gwiazd", C: "Każdej planety"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Galaktyki",
                    "quiz": [
                        {
                            "pytanie": "Jak najlepiej scharakteryzować Drogę Mleczną?",
                            "odpowiedzi": {A: "Gromadą planet", B: "Pojedynczą gwiazdą", C: "Galaktyką"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Które typy kształtów mogą mieć galaktyki?",
                            "odpowiedzi": {A: "Spiralny, eliptyczny lub nieregularny", B: "Tylko kulisty", C: "Tylko płaski prostokąt"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Odległość do bardzo dalekich galaktyk można szacować między innymi na podstawie:",
                            "odpowiedzi": {A: "Koloru oceanu", B: "Ciśnienia atmosferycznego", C: "Przesunięcia ku czerwieni"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "obserwacje_kosmologia": [
                {
                    "temat": "Światło i widma",
                    "quiz": [
                        {
                            "pytanie": "Jeśli widmo galaktyki jest przesunięte ku czerwieni, zwykle oznacza to, że galaktyka:",
                            "odpowiedzi": {A: "Nie emituje światła", B: "Oddala się od nas", C: "Zawsze się przybliża"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jednostką odległości często używaną w astronomii jest:",
                            "odpowiedzi": {A: "Rok świetlny", B: "Sekunda świetlna?", C: "Wat"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaką wielkość mierzy się w latach świetlnych?",
                            "odpowiedzi": {A: "Odległości", B: "Mocy", C: "Czasu"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Rozszerzanie Wszechświata",
                    "quiz": [
                        {
                            "pytanie": "Prawo Hubble'a wiąże prędkość oddalania galaktyki z:",
                            "odpowiedzi": {A: "Jej temperaturą wyłącznie", B: "Jej odległością", C: "Liczbą planet"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Obserwowane przesunięcie ku czerwieni odległych galaktyk jest zgodne z:",
                            "odpowiedzi": {A: "Kurczeniem się wszystkich gwiazd", B: "Rozszerzaniem się Wszechświata", C: "Brakiem ruchu galaktyk"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Mikrofalowe promieniowanie tła jest pozostałością po:",
                            "odpowiedzi": {A: "Powierzchni Słońca", B: "Atmosferze Ziemi", C: "Wczesnym Wszechświecie"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Grawitacja i obserwacje",
                    "quiz": [
                        {
                            "pytanie": "Soczewkowanie grawitacyjne może:",
                            "odpowiedzi": {A: "Powiększać i zniekształcać obraz odległego obiektu", B: "Zmieniać masę gwiazdy", C: "Wyłączać światło"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ruch gwiazd wokół centrum galaktyki dostarcza informacji o:",
                            "odpowiedzi": {A: "Temperaturze oceanu", B: "Ciśnieniu na Ziemi", C: "Rozkładzie masy w galaktyce"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaką okresową zmianę jasności gwiazdy obserwuje się podczas tranzytu egzoplanety?",
                            "odpowiedzi": {A: "Zmiany temperatury Ziemi", B: "Spadki jasności gwiazdy", C: "Wzrosty masy gwiazdy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Grawitacja i astronomia",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Satelita porusza się po orbicie kołowej. Jeśli promień orbity wzrośnie 4 razy, jak zmieni się prędkość orbitalna?",
                            "odpowiedzi": {A: "Zmniejszy się 2 razy", B: "Zmniejszy się 4 razy", C: "Wzrośnie 2 razy"}, "poprawna": "A",
                            "wzor": "v=√(GM/r)",
                            "rozwiazanie": "Prędkość orbitalna zależy od 1/√r, więc przy czterokrotnym wzroście r maleje dwukrotnie.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Dwa ciała przyciągają się grawitacyjnie. Jeśli odległość między nimi zwiększymy 3 razy, siła zmieni się do...",
                            "odpowiedzi": {A: "1/9 wartości", B: "3 razy większej", C: "1/3 wartości"}, "poprawna": "A",
                            "wzor": "F=Gm₁m₂/r²",
                            "rozwiazanie": "Siła jest odwrotnie proporcjonalna do kwadratu odległości.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Planeta ma dwukrotnie większy promień niż Ziemia, ale taką samą masę. Jakie będzie przyspieszenie grawitacyjne przy jej powierzchni?",
                            "odpowiedzi": {A: "2 razy mniejsze", B: "4 razy mniejsze", C: "2 razy większe"}, "poprawna": "B",
                            "wzor": "g=GM/R²",
                            "rozwiazanie": "Promień występuje w mianowniku w kwadracie, więc przy 2R otrzymujemy g/4.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Widmo odległej galaktyki jest przesunięte ku czerwieni. Najbardziej uzasadniony wniosek to...",
                            "odpowiedzi": {A: "Jej masa zmalała", B: "Galaktyka oddala się od obserwatora", C: "Galaktyka na pewno jest chłodniejsza"}, "poprawna": "B",
                            "wzor": "zjawisko Dopplera",
                            "rozwiazanie": "Przesunięcie ku czerwieni oznacza obserwowany spadek częstotliwości światła, zgodny z oddalaniem się źródła.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "2 s", B: "4 s", C: "0,5 s"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W ruchu harmonicznym w położeniu równowagi prędkość jest:",
                            "odpowiedzi": {A: "Maksymalna", B: "Zawsze zerowa", C: "Równa amplitudzie"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Amplituda to:",
                            "odpowiedzi": {A: "Czas jednego drgania", B: "Liczba drgań na sekundę", C: "Maksymalne wychylenie od równowagi"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Amplituda i okres",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie poprawnie interpretuje amplitudę w ruchu drgającym?",
                            "odpowiedzi": {A: "Szybkość drgań", B: "Maksymalne wychylenie", C: "Czas pełnego cyklu"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Okres i częstotliwość",
                    "quiz": [
                        {
                            "pytanie": "Źródło wykonuje 120 drgań w 2 s. Częstotliwość wynosi:",
                            "odpowiedzi": {A: "60 Hz", B: "240 Hz", C: "0,0167 Hz"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli okres wynosi 0,25 s, częstotliwość wynosi:",
                            "odpowiedzi": {A: "4 Hz", B: "2 Hz", C: "0,25 Hz"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zwiększenie częstotliwości 2 razy powoduje okres:",
                            "odpowiedzi": {A: "2 razy większy", B: "2 razy mniejszy", C: "bez zmiany"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Energia drgań",
                    "quiz": [
                        {
                            "pytanie": "W idealnym oscylatorze bez strat całkowita energia drgań:",
                            "odpowiedzi": {A: "Zawsze wynosi 0", B: "Jest stała", C: "Rośnie liniowo"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W maksymalnym wychyleniu sprężyny energia potencjalna jest:",
                            "odpowiedzi": {A: "Zawsze zerowa", B: "Ujemna", C: "Maksymalna"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Tłumienie drgań powoduje z czasem:",
                            "odpowiedzi": {A: "Zmniejszanie amplitudy", B: "Wzrost amplitudy", C: "Brak zmian"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "fale_mechaniczne": [
                {
                    "temat": "Równanie fali",
                    "quiz": [
                        {
                            "pytanie": "Która zależność łączy prędkość fali, jej długość i częstotliwość?",
                            "odpowiedzi": {A: "v = λ/f", B: "v = λ+f", C: "v = λ·f"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Rodzaje fal",
                    "quiz": [
                        {
                            "pytanie": "Falami poprzecznymi są:",
                            "odpowiedzi": {A: "Fale sejsmiczne", B: "Fale świetlne", C: "Fale dźwiękowe"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Parametry fali",
                    "quiz": [
                        {
                            "pytanie": "Fala ma λ=0,5 m i f=6 Hz. Prędkość wynosi:",
                            "odpowiedzi": {A: "3 m/s", B: "12 m/s", C: "0,083 m/s"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli częstotliwość fali wzrośnie 2 razy w tym samym ośrodku, długość fali:",
                            "odpowiedzi": {A: "Zmniejszy się 2 razy", B: "Nie zmieni się", C: "Wzrośnie 2 razy"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jednostką długości fali jest:",
                            "odpowiedzi": {A: "herc", B: "metr", C: "sekunda"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Fale poprzeczne i podłużne",
                    "quiz": [
                        {
                            "pytanie": "Fala na sprężynie, w której zwoje zagęszczają się i rozrzedzają, jest:",
                            "odpowiedzi": {A: "Elektromagnetyczna", B: "Podłużna", C: "Poprzeczna"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Fala na napiętej linie może być:",
                            "odpowiedzi": {A: "Tylko podłużna", B: "Zawsze elektromagnetyczna", C: "Poprzeczna"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Czego potrzebuje fala mechaniczna, aby mogła się rozchodzić?",
                            "odpowiedzi": {A: "Ośrodka materialnego", B: "Zawsze próżni", C: "Wyłącznie metalu"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Interferencja i dyfrakcja fal",
                    "quiz": [
                        {
                            "pytanie": "Jaki efekt może wystąpić, gdy dwie fale zgodne w fazie nakładają się?",
                            "odpowiedzi": {A: "Zawsze całkowite wygaszenie", B: "Zmiana źródła", C: "Wzmocnienie"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Kiedy dyfrakcja na przeszkodzie jest szczególnie wyraźna w porównaniu z długością fali?",
                            "odpowiedzi": {A: "Zawsze zerowy", B: "Porównywalny z długością fali", C: "Milion razy większy od fali"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jakie zjawisko fizyczne opisuje interferencja?",
                            "odpowiedzi": {A: "Nakładania się fal", B: "Tylko odbicia od lustra", C: "Tylko fal dźwiękowych"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "akustyka": [
                {
                    "temat": "Prędkość dźwięku",
                    "quiz": [
                        {
                            "pytanie": "Jaka jest przybliżona prędkość dźwięku w powietrzu?",
                            "odpowiedzi": {A: "343 m/s", B: "1000 m/s", C: "150 m/s"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Częstotliwość dźwięku",
                    "quiz": [
                        {
                            "pytanie": "Która jednostka SI opisuje częstotliwość?",
                            "odpowiedzi": {A: "Decybel", B: "Herc", C: "Sekunda"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Dźwięk",
                    "quiz": [
                        {
                            "pytanie": "Dźwięk 440 Hz w powietrzu 343 m/s ma długość około:",
                            "odpowiedzi": {A: "343 m", B: "0,78 m", C: "1,28 m"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Człowiek słyszy dźwięk o częstotliwości:",
                            "odpowiedzi": {A: "1–5 Hz", B: "100–1000 kHz", C: "20 Hz–20 kHz w przybliżeniu"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Głośność dźwięku jest związana przede wszystkim z:",
                            "odpowiedzi": {A: "Amplitudą drgań", B: "Długością fali wyłącznie", C: "Masą źródła"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Efekt Dopplera",
                    "quiz": [
                        {
                            "pytanie": "Gdy źródło dźwięku zbliża się do obserwatora, obserwowana częstotliwość:",
                            "odpowiedzi": {A: "Maleje", B: "Zawsze wynosi 0", C: "Rośnie"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Syrena oddala się od stojącego obserwatora. Ton staje się:",
                            "odpowiedzi": {A: "Nie zmienia się", B: "Niższy", C: "Wyższy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Efekt Dopplera wynika z:",
                            "odpowiedzi": {A: "Ruchu względnego źródła i obserwatora", B: "Zmiany masy fali", C: "Zaniku ośrodka"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Natężenie dźwięku",
                    "quiz": [
                        {
                            "pytanie": "Natężenie fali jest mocą przypadającą na:",
                            "odpowiedzi": {A: "Jednostkę powierzchni", B: "Jednostkę czasu", C: "Jednostkę masy"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jednostką natężenia dźwięku w SI jest:",
                            "odpowiedzi": {A: "W", B: "W/m²", C: "Hz"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Oddalenie od punktowego źródła powoduje spadek natężenia zgodnie z prawem odwrotności:",
                            "odpowiedzi": {A: "Czasu", B: "Kwadratu odległości", C: "Pierwszej potęgi masy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
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
                    "quiz": [
                        {
                            "pytanie": "Fala ma częstotliwość 4 Hz i długość 0,75 m. Z jaką prędkością się rozchodzi?",
                            "odpowiedzi": {A: "5,33 m/s", B: "0,19 m/s", C: "3 m/s"}, "poprawna": "C",
                            "wzor": "v=λf",
                            "rozwiazanie": "v=0,75·4=3 m/s.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Okres drgań zmniejszono z 0,40 s do 0,20 s. Jak zmieniła się częstotliwość?",
                            "odpowiedzi": {A: "Wzrosła 2 razy", B: "Zmalała 2 razy", C: "Nie zmieniła się"}, "poprawna": "A",
                            "wzor": "f=1/T",
                            "rozwiazanie": "Połowa okresu oznacza dwukrotnie większą częstotliwość.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Dwa zgodne źródła fal mają różnicę dróg równą 3λ. W punkcie obserwacji wystąpi...",
                            "odpowiedzi": {A: "Wygaszenie", B: "Brak fali", C: "Wzmocnienie"}, "poprawna": "C",
                            "wzor": "Δr=kλ",
                            "rozwiazanie": "Dla całkowitej wielokrotności λ fale są zgodne w fazie i następuje wzmocnienie.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Obserwator zbliża się do nieruchomego źródła dźwięku. Jak zmienia się częstotliwość odbierana?",
                            "odpowiedzi": {A: "Nie zmienia się", B: "Rośnie", C: "Maleje"}, "poprawna": "B",
                            "wzor": "efekt Dopplera",
                            "rozwiazanie": "Zbliżanie obserwatora powoduje wzrost częstości docierających frontów fal.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "Kąt padania = kąt odbicia", B: "Kąt padania > kąt odbicia", C: "Kąt padania < kąt odbicia"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Prawo załamania",
                    "quiz": [
                        {
                            "pytanie": "Które równanie poprawnie przedstawia prawo Snelliusa?",
                            "odpowiedzi": {A: "n₁·sin(θ₁) = n₂·sin(θ₂)", B: "n₁/θ₁ = n₂/θ₂", C: "n₁·θ₁ = n₂·θ₂"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Zwierciadła sferyczne",
                    "quiz": [
                        {
                            "pytanie": "Zwierciadło wklęsłe może wytworzyć obraz rzeczywisty, gdy przedmiot znajduje się:",
                            "odpowiedzi": {A: "Zawsze za zwierciadłem", B: "W odpowiednim położeniu przed ogniskiem", C: "Tylko w ognisku"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Ogniskowa zwierciadła sferycznego jest związana z promieniem krzywizny przez:",
                            "odpowiedzi": {A: "f=R²", B: "f=R/2", C: "f=2R"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zwierciadło wypukłe tworzy dla rzeczywistego przedmiotu obraz:",
                            "odpowiedzi": {A: "Rzeczywisty i powiększony", B: "Zawsze odwrócony i większy", C: "Pozorny, prosty i pomniejszony"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "soczewki_i_przyrzady": [
                {
                    "temat": "Soczewka skupiająca",
                    "quiz": [
                        {
                            "pytanie": "Soczewka skupiająca ma f=20 cm. Jej zdolność skupiająca wynosi:",
                            "odpowiedzi": {A: "+5 D", B: "+0,2 D", C: "-5 D"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Przedmiot ustawiony dalej niż ognisko soczewki skupiającej może dać obraz:",
                            "odpowiedzi": {A: "Zawsze pozorny", B: "Zawsze nieistniejący", C: "Rzeczywisty"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zdolność skupiająca 2 D odpowiada ogniskowej:",
                            "odpowiedzi": {A: "0,02 m", B: "0,5 m", C: "2 m"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Soczewka rozpraszająca",
                    "quiz": [
                        {
                            "pytanie": "Soczewka rozpraszająca dla rzeczywistego przedmiotu daje obraz:",
                            "odpowiedzi": {A: "Pozorny, prosty i pomniejszony", B: "Rzeczywisty i powiększony", C: "Rzeczywisty i odwrócony"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zdolność skupiająca soczewki rozpraszającej ma znak:",
                            "odpowiedzi": {A: "Ujemny", B: "Zawsze zerowy", C: "Dodatni"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Promienie równoległe po przejściu przez soczewkę rozpraszającą:",
                            "odpowiedzi": {A: "Zawsze skupiają się w ognisku rzeczywistym", B: "Rozchodzą się", C: "Nie zmieniają kierunku"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Oko i przyrządy optyczne",
                    "quiz": [
                        {
                            "pytanie": "Krótkowzroczność koryguje się najczęściej soczewką:",
                            "odpowiedzi": {A: "Płaską zawsze", B: "Rozpraszającą", C: "Skupiającą"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dalekowzroczność koryguje się soczewką:",
                            "odpowiedzi": {A: "Rozpraszającą", B: "Bez mocy", C: "Skupiającą"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Lupa wykorzystuje soczewkę skupiającą do uzyskania obrazu:",
                            "odpowiedzi": {A: "Pozornego powiększonego", B: "Rzeczywistego pomniejszonego", C: "Zawsze odwróconego"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
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
                            "odpowiedzi": {A: "Znacznie większa od λ", B: "Zawsze zerowa", C: "Porównywalna z λ"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Wzrost długości fali przy tej samej szczelinie zwykle powoduje dyfrakcję:",
                            "odpowiedzi": {A: "Niemożliwą", B: "Silniejszą", C: "Słabszą"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dyfrakcję można obserwować dla:",
                            "odpowiedzi": {A: "Światła", B: "Tylko dźwięku", C: "Tylko wody"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Optyka",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Promień przechodzi z powietrza do szkła o n=1,5. Dla sin kąta padania=0,75 wartość sin kąta załamania wynosi...",
                            "odpowiedzi": {A: "0,50", B: "0,75", C: "1,125"}, "poprawna": "A",
                            "wzor": "n₁sinα=n₂sinβ",
                            "rozwiazanie": "Dla powietrza n₁≈1, więc sinβ=0,75/1,5=0,50.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Soczewka skupiająca ma ogniskową 20 cm. Przedmiot ustawiono 60 cm od soczewki. W jakiej odległości powstanie obraz?",
                            "odpowiedzi": {A: "15 cm", B: "30 cm", C: "40 cm"}, "poprawna": "B",
                            "wzor": "1/f=1/x+1/y",
                            "rozwiazanie": "1/20=1/60+1/y, więc 1/y=1/30 i y=30 cm.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Na płaskie lustro pada promień pod kątem 35° do normalnej. Kąt między promieniem padającym a odbitym wynosi...",
                            "odpowiedzi": {A: "55°", B: "70°", C: "35°"}, "poprawna": "B",
                            "wzor": "αodb=αpad",
                            "rozwiazanie": "Oba kąty względem normalnej mają 35°, więc kąt między promieniami to 35°+35°=70°.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "W doświadczeniu z interferencją zwiększono długość fali, pozostawiając geometrię układu bez zmian. Odstęp prążków...",
                            "odpowiedzi": {A: "Zmniejszy się", B: "Nie zmieni się", C: "Zwiększy się"}, "poprawna": "C",
                            "wzor": "Δx∝λ",
                            "rozwiazanie": "Odległość między prążkami interferencyjnymi jest proporcjonalna do długości fali.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "10 C", B: "0,4 C", C: "2,5 C"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaki znak ma ładunek elektronu?",
                            "odpowiedzi": {A: "Dodatni", B: "Zawsze zerowy", C: "Ujemny"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która jednostka SI odpowiada ładunkowi elektrycznemu?",
                            "odpowiedzi": {A: "Wolt", B: "Kulomb", C: "Amper"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Pole elektryczne",
                    "quiz": [
                        {
                            "pytanie": "Na ładunek 2 μC działa siła 0,01 N. Natężenie pola wynosi:",
                            "odpowiedzi": {A: "5000 N/C", B: "0,00002 N/C", C: "200 N/C"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Linie pola elektrycznego wychodzą z ładunku dodatniego:",
                            "odpowiedzi": {A: "Na zewnątrz", B: "Tylko pionowo", C: "Do środka"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jednostką natężenia pola elektrycznego może być:",
                            "odpowiedzi": {A: "C/N", B: "N/C", C: "J/s"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Prawo Coulomba",
                    "quiz": [
                        {
                            "pytanie": "Jeśli odległość między ładunkami wzrośnie 2 razy, siła Coulomba:",
                            "odpowiedzi": {A: "Wzrośnie 4 razy", B: "Zmaleje 4 razy", C: "Zmaleje 2 razy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dwa ładunki mają wartości 2 μC i 3 μC. Ich iloczyn wynosi:",
                            "odpowiedzi": {A: "5 μC", B: "1,5 μC²", C: "6 μC²"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak oddziałują na siebie ładunki jednoimienne?",
                            "odpowiedzi": {A: "Odpychają się", B: "Przyciągają się", C: "Nie oddziałują"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "prad_i_obwody": [
                {
                    "temat": "Prąd elektryczny",
                    "quiz": [
                        {
                            "pytanie": "Przez przekrój przewodnika przepływa 12 C w 4 s. Natężenie prądu wynosi:",
                            "odpowiedzi": {A: "48 A", B: "0,33 A", C: "3 A"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Amperomierz włącza się do obwodu:",
                            "odpowiedzi": {A: "Poza obwodem", B: "Szeregowo", C: "Równolegle"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Konwencjonalny kierunek prądu w obwodzie zewnętrznym przyjmuje się od:",
                            "odpowiedzi": {A: "Bieguna dodatniego do ujemnego", B: "Ujemnego do dodatniego", C: "Środka baterii"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Napięcie i opór",
                    "quiz": [
                        {
                            "pytanie": "Które równanie poprawnie opisuje zależność między napięciem, natężeniem i oporem?",
                            "odpowiedzi": {A: "U = I·R", B: "U = I+R", C: "U = I/R"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Prawo Ohma",
                    "quiz": [
                        {
                            "pytanie": "Do opornika 12 Ω przyłożono 24 V. Jaki prąd płynie?",
                            "odpowiedzi": {A: "0,5 A", B: "2 A", C: "36 A"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Przy stałym napięciu opór wzrasta 3 razy. Natężenie prądu:",
                            "odpowiedzi": {A: "Nie zmienia się", B: "Maleje 3 razy", C: "Rośnie 3 razy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Woltomierz podłącza się:",
                            "odpowiedzi": {A: "Szeregowo", B: "Tylko do źródła", C: "Równolegle"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Moc i energia prądu",
                    "quiz": [
                        {
                            "pytanie": "Urządzenie pracuje przy 230 V i pobiera 2 A. Jaka jest jego moc?",
                            "odpowiedzi": {A: "460 W", B: "115 W", C: "232 W"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Żarówka 100 W działa przez 10 s. Zużyta energia wynosi:",
                            "odpowiedzi": {A: "100 J", B: "10 J", C: "1000 J"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Która jednostka SI odpowiada mocy elektrycznej?",
                            "odpowiedzi": {A: "C", B: "W", C: "J"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
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
                            "odpowiedzi": {A: "0,4 N", B: "4 N", C: "0,1 N"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jednostką indukcji magnetycznej jest:",
                            "odpowiedzi": {A: "tesla", B: "kulomb", C: "weber na metr?"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak oddziałują na siebie bieguny magnetyczne jednoimienne?",
                            "odpowiedzi": {A: "Przyciągają się", B: "Odpychają się", C: "Nie oddziałują"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Siła Lorentza",
                    "quiz": [
                        {
                            "pytanie": "Naładowana cząstka porusza się prostopadle do pola. Po podwojeniu prędkości siła Lorentza:",
                            "odpowiedzi": {A: "Nie zmienia się", B: "Rośnie 2 razy", C: "Maleje 2 razy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jaką siłę magnetyczną odczuwa nieruchomy ładunek w polu magnetycznym?",
                            "odpowiedzi": {A: "qB", B: "Zawsze 1 N", C: "0"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Co dzieje się z siłą magnetyczną, gdy prędkość cząstki jest równoległa do pola?",
                            "odpowiedzi": {A: "Wynosi 0", B: "Jest maksymalna", C: "Zależy tylko od masy"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Indukcja elektromagnetyczna",
                    "quiz": [
                        {
                            "pytanie": "Zmiana strumienia magnetycznego przez obwód może wywołać:",
                            "odpowiedzi": {A: "Zmianę masy przewodnika", B: "Zanik ładunku", C: "Siłę elektromotoryczną"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Szybsza zmiana strumienia oznacza zwykle wartość SEM:",
                            "odpowiedzi": {A: "Zawsze zerową", B: "Większą", C: "Mniejszą"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zjawisko indukcji elektromagnetycznej wykorzystuje:",
                            "odpowiedzi": {A: "Generator", B: "Termometr rtęciowy", C: "Barometr"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Elektryczność i magnetyzm",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Opornik 6 Ω podłączono do napięcia 12 V. Następnie napięcie zwiększono do 24 V, a opór pozostał stały. Jak zmieni się moc?",
                            "odpowiedzi": {A: "Wzrośnie 4 razy", B: "Nie zmieni się", C: "Wzrośnie 2 razy"}, "poprawna": "A",
                            "wzor": "P=U²/R",
                            "rozwiazanie": "Przy stałym R moc jest proporcjonalna do U², więc przy podwojeniu napięcia rośnie czterokrotnie.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Dwa oporniki 6 Ω i 3 Ω połączono równolegle. Jaki jest opór zastępczy?",
                            "odpowiedzi": {A: "9 Ω", B: "2 Ω", C: "4,5 Ω"}, "poprawna": "B",
                            "wzor": "1/R=1/R₁+1/R₂",
                            "rozwiazanie": "1/R=1/6+1/3=1/2, więc R=2 Ω.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Ładunek 2 μC znajduje się w odległości 0,30 m od punktowego ładunku 3 μC. Przyjmij k=9·10⁹. Wartość siły wynosi...",
                            "odpowiedzi": {A: "0,06 N", B: "0,60 N", C: "6,0 N"}, "poprawna": "B",
                            "wzor": "F=k|q₁q₂|/r²",
                            "rozwiazanie": "Po zamianie μC na C: F=9·10⁹·6·10⁻¹²/0,09=0,60 N.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Strumień pola magnetycznego przez zwojnicę zmniejsza się. Zgodnie z regułą Lenza prąd indukowany...",
                            "odpowiedzi": {A: "Zawsze ma dowolny zwrot", B: "Nie może powstać", C: "Wytwarza pole przeciwdziałające zmianie strumienia"}, "poprawna": "C",
                            "wzor": "prawo Lenza",
                            "rozwiazanie": "Indukowany prąd przeciwdziała przyczynie, która go wywołała, czyli zmianie strumienia.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "Nie można jednocześnie dokładnie znać pęd i położenie", B: "Energia jest zawsze nieokreślona", C: "Czas zawsze się zmienia"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Funkcja falowa",
                    "quiz": [
                        {
                            "pytanie": "Jak należy interpretować |ψ|² w mechanice kwantowej?",
                            "odpowiedzi": {A: "Energię cząstki", B: "Pęd cząstki", C: "Gęstość prawdopodobieństwa"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Energia kwantu",
                    "quiz": [
                        {
                            "pytanie": "Foton ma częstotliwość 5×10¹⁴ Hz. Korzystając z E=hf, jego energia jest rzędu:",
                            "odpowiedzi": {A: "1,0×10⁻³⁴ J", B: "3,3×10⁻¹⁹ J", C: "3,3×10⁻⁵ J"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli częstotliwość fotonu wzrośnie 2 razy, jego energia:",
                            "odpowiedzi": {A: "Wzrośnie 2 razy", B: "Zmaleje 2 razy", C: "Nie zmieni się"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Stała Plancka ma jednostkę:",
                            "odpowiedzi": {A: "J·s", B: "C·s", C: "J/s"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Efekt fotoelektryczny",
                    "quiz": [
                        {
                            "pytanie": "Aby zaszedł efekt fotoelektryczny, energia fotonu musi być:",
                            "odpowiedzi": {A: "Zawsze równa 0", B: "Co najmniej równa pracy wyjścia", C: "Mniejsza od pracy wyjścia"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zwiększenie częstotliwości światła powyżej progu zwiększa maksymalną energię:",
                            "odpowiedzi": {A: "Fotonów do zera", B: "Elektronów fotoelektrycznych", C: "Jąder atomowych zawsze"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zwiększenie natężenia światła przy częstotliwości powyżej progu zwiększa przede wszystkim:",
                            "odpowiedzi": {A: "Ich maksymalną energię liniowo zawsze", B: "Pracę wyjścia metalu", C: "Liczbę wybitych elektronów"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "fizyka_jadrowa": [
                {
                    "temat": "Budowa jądra",
                    "quiz": [
                        {
                            "pytanie": "Jądro zawiera 6 protonów i 8 neutronów. Liczba masowa wynosi:",
                            "odpowiedzi": {A: "14", B: "8", C: "6"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Izotopy tego samego pierwiastka mają taką samą liczbę:",
                            "odpowiedzi": {A: "Neutronów", B: "Nukleonów zawsze", C: "Protonów"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Liczba atomowa określa liczbę:",
                            "odpowiedzi": {A: "Wszystkich nukleonów", B: "Protonów", C: "Neutronów"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Radioaktywność",
                    "quiz": [
                        {
                            "pytanie": "Rozpad alfa to emisja:",
                            "odpowiedzi": {A: "Jądra helu (He-4)", B: "Elektronu", C: "Fot"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Rozpady promieniotwórcze",
                    "quiz": [
                        {
                            "pytanie": "W rozpadzie alfa liczba masowa zmniejsza się o:",
                            "odpowiedzi": {A: "4", B: "1", C: "2"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W rozpadzie β⁻ neutron zamienia się w proton, więc liczba atomowa:",
                            "odpowiedzi": {A: "Maleje o 1", B: "Rośnie o 1", C: "Nie zmienia się"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W rozpadzie gamma jądro emituje:",
                            "odpowiedzi": {A: "Helowe jądro", B: "Foton promieniowania elektromagnetycznego", C: "Elektron zawsze"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Okres półtrwania",
                    "quiz": [
                        {
                            "pytanie": "Po jednym okresie półtrwania pozostaje:",
                            "odpowiedzi": {A: "25%", B: "75%", C: "50% jąder początkowych"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Po dwóch okresach półtrwania pozostaje:",
                            "odpowiedzi": {A: "25%", B: "50%", C: "12,5%"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Okres półtrwania próbki wynosi 8 dni. Po 24 dniach pozostanie:",
                            "odpowiedzi": {A: "1/3", B: "1/24", C: "1/8 początkowej ilości"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Energia wiązania",
                    "quiz": [
                        {
                            "pytanie": "Energia wiązania jądra odpowiada między innymi za jego:",
                            "odpowiedzi": {A: "Kolor", B: "Stabilność względem rozdzielenia nukleonów", C: "Temperaturę topnienia"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Defekt masy jest związany z:",
                            "odpowiedzi": {A: "Energią wiązania", B: "Wyłącznie liczbą elektronów", C: "Ciśnieniem atmosferycznym"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zależność masy i energii opisuje:",
                            "odpowiedzi": {A: "E=mc²", B: "F=ma²", C: "p=mv²"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Rozszczepienie i synteza",
                    "quiz": [
                        {
                            "pytanie": "Rozszczepienie ciężkiego jądra może uwolnić:",
                            "odpowiedzi": {A: "Tylko światło widzialne", B: "Dużą ilość energii", C: "Wyłącznie energię chemiczną"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Synteza jądrowa zachodzi w Słońcu głównie poprzez łączenie jąder:",
                            "odpowiedzi": {A: "Ołowiu", B: "Wodoru", C: "Żelaza"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Reakcja łańcuchowa w reaktorze wymaga kontroli liczby:",
                            "odpowiedzi": {A: "Elektronów walencyjnych", B: "Fotonów widzialnych", C: "Neutronów wywołujących kolejne rozszczepienia"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Promieniowanie",
                    "quiz": [
                        {
                            "pytanie": "Promieniowanie jonizujące może powodować:",
                            "odpowiedzi": {A: "Jonizację materii", B: "Zawsze ochłodzenie materii", C: "Zanik grawitacji"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Które promieniowanie ma największą zdolność przenikania z typowej trójki α, β, γ?",
                            "odpowiedzi": {A: "β", B: "α", C: "γ"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Do ochrony przed promieniowaniem gamma stosuje się między innymi:",
                            "odpowiedzi": {A: "Próżnię", B: "Grube warstwy materiałów o dużej gęstości", C: "Cienki papier"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Fizyka atomowa i jądrowa",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Foton ma częstotliwość 6·10¹⁴ Hz. Przyjmij h=6,63·10⁻³⁴ J·s. Energia fotonu wynosi około...",
                            "odpowiedzi": {A: "3,98·10⁻¹⁹ J", B: "1,10·10⁻¹⁹ J", C: "3,98·10⁻²⁰ J"}, "poprawna": "A",
                            "wzor": "E=hf",
                            "rozwiazanie": "E=6,63·10⁻³⁴·6·10¹⁴≈3,98·10⁻¹⁹ J.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Praca wyjścia metalu wynosi 2 eV, a energia fotonu 5 eV. Maksymalna energia kinetyczna elektronu wynosi...",
                            "odpowiedzi": {A: "3 eV", B: "2,5 eV", C: "7 eV"}, "poprawna": "A",
                            "wzor": "Eₖ,max=hf−W",
                            "rozwiazanie": "Część energii fotonu pokonuje pracę wyjścia, więc pozostają 5−2=3 eV.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Próbka ma okres półtrwania 3 h. Po 9 h pozostanie jaka część początkowej liczby jąder?",
                            "odpowiedzi": {A: "1/3", B: "1/8", C: "1/9"}, "poprawna": "B",
                            "wzor": "N=N₀(1/2)ⁿ",
                            "rozwiazanie": "9 h to trzy okresy półtrwania: (1/2)³=1/8.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "W reakcji jądrowej ubytek masy wynosi 2·10⁻³ kg. Przyjmij c=3·10⁸ m/s. Energia odpowiadająca temu ubytkowi to...",
                            "odpowiedzi": {A: "6·10⁵ J", B: "1,8·10¹⁴ J", C: "1,8·10¹² J"}, "poprawna": "B",
                            "wzor": "E=Δmc²",
                            "rozwiazanie": "E=2·10⁻³·9·10¹⁶=1,8·10¹⁴ J.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "E = ½mv²", B: "E = U·q", C: "E = mc²"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Dylatacja czasu",
                    "quiz": [
                        {
                            "pytanie": "Dla obserwatora na Ziemi zegar poruszającego się szybko statku wskazuje upływ czasu:",
                            "odpowiedzi": {A: "Wolniejszy", B: "Szybszy", C: "Zawsze taki sam niezależnie od prędkości"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Efekt dylatacji czasu staje się istotny przy prędkościach:",
                            "odpowiedzi": {A: "Rzędu 1 m/s", B: "Tylko zerowych", C: "Bliskich prędkości światła"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "W jakim układzie odniesienia mierzy się czas własny zdarzenia?",
                            "odpowiedzi": {A: "Zawsze w laboratorium", B: "W układzie, w którym mierzone zdarzenia zachodzą w tym samym miejscu", C: "Zawsze na Ziemi"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Kontrakcja długości",
                    "quiz": [
                        {
                            "pytanie": "Przedmiot poruszający się względem obserwatora z dużą prędkością jest wzdłuż kierunku ruchu mierzony jako:",
                            "odpowiedzi": {A: "Krótszy", B: "Dłuższy", C: "Zawsze tej samej długości"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Kontrakcja długości dotyczy kierunku:",
                            "odpowiedzi": {A: "Równoległego do ruchu", B: "Wszystkich kierunków identycznie", C: "Prostopadłego do ruchu wyłącznie"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dla prędkości znacznie mniejszej od c efekty relatywistyczne są:",
                            "odpowiedzi": {A: "Maksymalne", B: "Bardzo małe", C: "Nieskończone"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Energia spoczynkowa",
                    "quiz": [
                        {
                            "pytanie": "Masa spoczynkowa 2 kg ma energię E₀=mc² równą około:",
                            "odpowiedzi": {A: "9×10¹⁶ J", B: "1,8×10¹⁷ J", C: "6×10⁸ J"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jeśli masa spoczynkowa wzrośnie 3 razy, energia spoczynkowa:",
                            "odpowiedzi": {A: "Wzrośnie 9 razy", B: "Nie zmieni się", C: "Wzrośnie 3 razy"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Równanie E=mc² pokazuje równoważność:",
                            "odpowiedzi": {A: "Masy i energii", B: "Masy i czasu", C: "Siły i temperatury"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "ogolna": [
                {
                    "temat": "Czarna dziura",
                    "quiz": [
                        {
                            "pytanie": "Czarna dziura ma horyzont zdarzeń, za którym:",
                            "odpowiedzi": {A: "Wszystko jest widoczne", B: "Czas staje się jawnością", C: "Nic nie może uciec"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Grawitacja i czasoprzestrzeń",
                    "quiz": [
                        {
                            "pytanie": "Według ogólnej teorii względności grawitacja jest związana z:",
                            "odpowiedzi": {A: "Ładunkiem elektrycznym", B: "Krzywizną czasoprzestrzeni", C: "Tylko siłą tarcia"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Zegar bliżej silnego pola grawitacyjnego względem odległego obserwatora tyka:",
                            "odpowiedzi": {A: "Wolniej", B: "Szybciej", C: "Tak samo zawsze"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Soczewkowanie grawitacyjne polega na:",
                            "odpowiedzi": {A: "Uginaniu toru światła przez grawitację", B: "Zatrzymaniu światła w każdym polu", C: "Zwiększaniu masy fotonu"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Fale grawitacyjne",
                    "quiz": [
                        {
                            "pytanie": "Fale grawitacyjne są zmianami:",
                            "odpowiedzi": {A: "Temperatury próżni", B: "Geometrii czasoprzestrzeni", C: "Ładunku fotonów"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Fale grawitacyjne mogą powstawać podczas zderzeń:",
                            "odpowiedzi": {A: "Samochodów", B: "Czarnych dziur", C: "Kropli wody"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Detektory fal grawitacyjnych mierzą niezwykle małe zmiany:",
                            "odpowiedzi": {A: "Masy Ziemi", B: "Temperatury lustra", C: "Długości ramion interferometru"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Teoria względności",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Statek porusza się z v=0,8c. Czas własny na statku wynosi 6 lat. Ile mierzy obserwator zewnętrzny?",
                            "odpowiedzi": {A: "10 lat", B: "4,8 roku", C: "7,5 roku"}, "poprawna": "A",
                            "wzor": "t=γτ",
                            "rozwiazanie": "γ=1/√(1−0,8²)=5/3, więc t=10 lat.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Długość pręta w jego układzie spoczynkowym wynosi 10 m. Dla obserwatora, względem którego pręt porusza się z 0,6c, długość wynosi...",
                            "odpowiedzi": {A: "10 m", B: "6 m", C: "8 m"}, "poprawna": "C",
                            "wzor": "L=L₀/γ",
                            "rozwiazanie": "γ=1/√(1−0,6²)=1,25, więc L=10/1,25=8 m.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Energia spoczynkowa masy 2 g wynosi przy c=3·10⁸ m/s...",
                            "odpowiedzi": {A: "6·10⁵ J", B: "1,8·10¹⁴ J", C: "1,8·10¹⁵ J"}, "poprawna": "B",
                            "wzor": "E₀=mc²",
                            "rozwiazanie": "2 g=0,002 kg, więc E₀=0,002·9·10¹⁶=1,8·10¹⁴ J.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Które stwierdzenie najlepiej opisuje ogólną teorię względności?",
                            "odpowiedzi": {A: "Grawitacja jest związana z geometrią czasoprzestrzeni", B: "Grawitacja znika dla światła", C: "Czas płynie identycznie w każdym polu grawitacyjnym"}, "poprawna": "A",
                            "wzor": "zasada równoważności",
                            "rozwiazanie": "W OTW grawitacja jest opisywana jako efekt zakrzywienia czasoprzestrzeni.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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
                            "odpowiedzi": {A: "Uporządkowaniem dalekiego zasięgu", B: "Zawsze ciekłym stanem", C: "Całkowitym brakiem atomów"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Jak nazywa się najmniejszy powtarzalny fragment sieci krystalicznej?",
                            "odpowiedzi": {A: "Jądro", B: "Komórka elementarna", C: "Granica fazy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Monokryształ ma uporządkowanie krystaliczne:",
                            "odpowiedzi": {A: "Tylko w jednym atomie", B: "Rozciągające się przez całą próbkę", C: "Tylko na powierzchni"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Sieci przestrzenne",
                    "quiz": [
                        {
                            "pytanie": "Najprostsza sieć to:",
                            "odpowiedzi": {A: "Sieć heksagonalna", B: "Sieć ortorombowa", C: "Sieć kubiczna"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Defekty kryształów",
                    "quiz": [
                        {
                            "pytanie": "Jak nazywa się defekt polegający na braku atomu w prawidłowym miejscu sieci?",
                            "odpowiedzi": {A: "Wakancją", B: "Dyslokacją śrubową", C: "Fazą ciekłą"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Dyslokacja jest przykładem defektu:",
                            "odpowiedzi": {A: "Punktowego zawsze", B: "Powierzchniowego zawsze", C: "Liniowego"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Wzrost temperatury zwykle zwiększa liczbę drgań atomów w sieci:",
                            "odpowiedzi": {A: "Tylko w próżni", B: "Tak", C: "Nie"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Materiały amorficzne",
                    "quiz": [
                        {
                            "pytanie": "Szkło jest typowym przykładem materiału:",
                            "odpowiedzi": {A: "Amorficznego", B: "Monokrystalicznego", C: "Gazowego"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Materiały amorficzne nie mają uporządkowania:",
                            "odpowiedzi": {A: "Dalekiego zasięgu", B: "Nigdy lokalnego", C: "Żadnego na poziomie atomowym"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Polimer może być:",
                            "odpowiedzi": {A: "Wyłącznie metalem", B: "Materiałem o bardzo długich łańcuchach cząsteczek", C: "Zawsze kryształem idealnym"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "wlasciwosci_materialow": [
                {
                    "temat": "Twardość i wytrzymałość",
                    "quiz": [
                        {
                            "pytanie": "Twardość materiału zależy od:",
                            "odpowiedzi": {A: "Tylko objętości", B: "Wiązań chemicznych", C: "Tylko masy"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Przewodnictwo elektryczne",
                    "quiz": [
                        {
                            "pytanie": "Przewodniki elektryczne zawierają:",
                            "odpowiedzi": {A: "Brak elektronów", B: "Tylko jądra", C: "Swobodne elektrony"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                },
                {
                    "temat": "Sprężystość i plastyczność",
                    "quiz": [
                        {
                            "pytanie": "Odkształcenie sprężyste po usunięciu siły:",
                            "odpowiedzi": {A: "Może zaniknąć", B: "Zawsze pozostaje", C: "Zwiększa masę"}, "poprawna": "A",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Odkształcenie plastyczne jest:",
                            "odpowiedzi": {A: "Zawsze odwracalne", B: "Niemożliwe w metalach", C: "Trwałe"}, "poprawna": "C",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"},
                        {
                            "pytanie": "Prawo Hooke'a w zakresie sprężystym wiąże naprężenie z:",
                            "odpowiedzi": {A: "Ładunkiem", B: "Odkształceniem", C: "Temperaturą wrzenia"}, "poprawna": "B",
                            "poziom": 1,
                            "wskazowka": "TU WPISZ WŁASNĄ PODPOWIEDŹ DO TEGO PYTANIA",
                            "rozwiazanie": "TU WPISZ WŁASNE ROZWIĄZANIE DO TEGO PYTANIA"}
                    ]
                }
            ],
            "trening_maturalny": [
                {
                    "temat": "Trening maturalny — Fizyka materiałów",
                    "typ": "maturalne",
                    "quiz": [
                        {
                            "pytanie": "Drut wydłużono o 0,2 mm przy długości początkowej 2 m. Względne wydłużenie wynosi...",
                            "odpowiedzi": {A: "1·10⁻⁴", B: "1·10⁻²", C: "1·10⁻⁶"}, "poprawna": "A",
                            "wzor": "ε=ΔL/L₀",
                            "rozwiazanie": "0,2 mm=2·10⁻⁴ m, więc ε=2·10⁻⁴/2=1·10⁻⁴.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Materiał ma przewodność większą 100 razy od innego materiału. Przy takim samym polu i długości prąd w pierwszym materiale będzie...",
                            "odpowiedzi": {A: "100 razy większy", B: "Taki sam", C: "100 razy mniejszy"}, "poprawna": "A",
                            "wzor": "J=σE",
                            "rozwiazanie": "Przy tym samym polu elektrycznym gęstość prądu jest proporcjonalna do przewodności.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Które zjawisko najlepiej wyjaśnia wzrost oporu metalu wraz z temperaturą?",
                            "odpowiedzi": {A: "Zmniejszenie liczby protonów", B: "Silniejsze rozpraszanie elektronów na drganiach sieci", C: "Zanik pola elektrycznego"}, "poprawna": "B",
                            "wzor": "model przewodnictwa",
                            "rozwiazanie": "Wzrost drgań sieci krystalicznej zwiększa rozpraszanie nośników ładunku.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        },
                        {
                            "pytanie": "Defekt sieci krystalicznej może zmienić właściwości materiału, ponieważ...",
                            "odpowiedzi": {A: "Usuwa wszystkie wiązania", B: "Zmienia lokalne uporządkowanie i ruch nośników", C: "Zawsze zwiększa masę całej próbki dwukrotnie"}, "poprawna": "B",
                            "wzor": "struktura mikroskopowa",
                            "rozwiazanie": "Właściwości makroskopowe zależą od struktury i defektów na poziomie mikroskopowym.",
                            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
                            "poziom": 3,
                            "obliczeniowe": true,
                            "maturalne": true
                        }
                    ]
                }
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



// Utrzymujemy jeden kanoniczny temat na całą aplikację. Aliasowe mapy nie mogą
// ponownie pokazywać tej samej lekcji pod innym tytułem.
(function usunPowtorzeniaZProgramu() {
    const widziane = new Set();
    Object.values(baza).forEach(dzial => {
        Object.keys(dzial.podnagalowki || {}).forEach(podklucz => {
            const unikalne = [];
            (dzial.podnagalowki[podklucz] || []).forEach(lekcja => {
                const klucz = String(lekcja.temat || "")
                    .trim()
                    .toLocaleLowerCase("pl")
                    .replace(/^gravitacja$/, "grawitacja");
                if (!klucz || widziane.has(klucz)) return;
                if (klucz === "grawitacja") lekcja.temat = "Grawitacja";
                widziane.add(klucz);
                unikalne.push(lekcja);
            });
            if (unikalne.length) dzial.podnagalowki[podklucz] = unikalne;
            else delete dzial.podnagalowki[podklucz];
        });
    });
})();

export {
    baza,
    zadaniaTematyczne,
    pytaniaDlaTematu,
    pulePytanDzialow,
    BANKI_JAKOSCI,
    WZORCE_SLABYCH_PYTAN,
    WZORCE_ABSURDALNYCH_ODPOWIEDZI,
    DODATKOWE_PYTANIA_TEMATYCZNE,
    REGULY_TEMATOW
};
