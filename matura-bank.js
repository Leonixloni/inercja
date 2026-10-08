/**
 * INERCJA — OSOBNY BANK ZADAŃ MATURALNYCH
 *
 * EDYTUJESZ TYLKO TEN PLIK, jeśli chcesz zmienić zadania maturalne.
 * Każde zadanie ma własne: pytanie, odpowiedzi, poprawną odpowiedź,
 * podpowiedź, wyjaśnienie, wzór i poziom.
 *
 * poziom: 1 = podstawowy, 2 = średni, 3 = zaawansowany.
 * Zadania są filtrowane ŚCIŚLE po poziomie ucznia — aplikacja nie
 * dobiera pytań z poziomu niższego ani wyższego.
 */

const MATURA_BANK = {
    "mechanika": [
        {
            "pytanie": "Na ciało działa stała siła 12 N przez 0,50 s. Jego pęd zmienia się o 6 kg·m/s. Który wniosek jest poprawny?",
            "odpowiedzi": [
                "Zgodny z impulsem siły",
                "Pęd musi zmienić się o 24 kg·m/s",
                "Siła nie mogła być stała"
            ],
            "prawidlowa": 0,
            "wzor": "Δp=FΔt",
            "rozwiazanie": "Impuls wynosi 12·0,50=6 N·s=6 kg·m/s, więc zgadza się ze zmianą pędu.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Krążek o promieniu 0,20 m obraca się z częstotliwością 5 Hz. Jaka jest prędkość liniowa punktu na jego brzegu?",
            "odpowiedzi": [
                "2π m/s",
                "π m/s",
                "10π m/s"
            ],
            "prawidlowa": 0,
            "wzor": "v=2πrf",
            "rozwiazanie": "v=2π·0,20·5=2π m/s.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Skrzynia 5 kg jest ciągnięta siłą 30 N po poziomej powierzchni. Tarcie ma 10 N. Jakie jest przyspieszenie?",
            "odpowiedzi": [
                "4 m/s²",
                "6 m/s²",
                "8 m/s²"
            ],
            "prawidlowa": 0,
            "wzor": "a=(F−Fₜ)/m",
            "rozwiazanie": "Siła wypadkowa wynosi 20 N, więc a=20/5=4 m/s².",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Samochód zwiększa prędkość z 10 do 25 m/s w 5 s. Jaką drogę pokona w tym czasie, jeśli przyspieszenie jest stałe?",
            "odpowiedzi": [
                "87,5 m",
                "62,5 m",
                "125 m"
            ],
            "prawidlowa": 0,
            "wzor": "s=((v₀+v)/2)t",
            "rozwiazanie": "Przy stałym przyspieszeniu prędkość średnia wynosi (10+25)/2=17,5 m/s, więc s=87,5 m.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "mechanika-1",
            "pytanie": "Samochód zwiększa prędkość z 12 m/s do 28 m/s w 8 s. Oblicz przyspieszenie.",
            "odpowiedzi": [
                "2 m/s²",
                "3 m/s²",
                "4 m/s²"
            ],
            "prawidlowa": 0,
            "wzor": "a = Δv/t",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność a = Δv/t i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność a = Δv/t. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 2 m/s²."
        },
        {
            "id": "mechanika-2",
            "pytanie": "Klocek 5 kg jest ciągnięty siłą 18 N po poziomej powierzchni, a tarcie ma 3 N. Oblicz przyspieszenie.",
            "odpowiedzi": [
                "3 m/s²",
                "3,6 m/s²",
                "4,2 m/s²"
            ],
            "prawidlowa": 0,
            "wzor": "a = (F−T)/m",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność a = (F−T)/m i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność a = (F−T)/m. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 3 m/s²."
        },
        {
            "id": "mechanika-3",
            "pytanie": "Ciało o masie 2 kg porusza się z 6 m/s. Oblicz jego energię kinetyczną.",
            "odpowiedzi": [
                "36 J",
                "18 J",
                "12 J"
            ],
            "prawidlowa": 1,
            "wzor": "E_k = ½mv²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E_k = ½mv² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E_k = ½mv². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 18 J."
        },
        {
            "id": "mechanika-4",
            "pytanie": "Pocisk zmienia pęd o 12 kg·m/s w czasie 0,03 s. Oblicz średnią siłę.",
            "odpowiedzi": [
                "400 N",
                "40 N",
                "360 N"
            ],
            "prawidlowa": 0,
            "wzor": "F = Δp/Δt",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność F = Δp/Δt i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność F = Δp/Δt. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 400 N."
        },
        {
            "id": "mechanika-5",
            "pytanie": "Dźwignia ma ramię 0,4 m i działa na nią siła 50 N prostopadle. Oblicz moment.",
            "odpowiedzi": [
                "20 N·m",
                "125 N·m",
                "50 N·m"
            ],
            "prawidlowa": 0,
            "wzor": "M = Fr",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność M = Fr i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność M = Fr. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 20 N·m."
        },
        {
            "id": "mechanika-6",
            "pytanie": "Ciało rusza z miejsca z a = 3 m/s². Jaką drogę pokona w 6 s?",
            "odpowiedzi": [
                "54 m",
                "18 m",
                "108 m"
            ],
            "prawidlowa": 0,
            "wzor": "s = ½at²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność s = ½at² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność s = ½at². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 54 m."
        },
        {
            "id": "mechanika-7",
            "pytanie": "W ruchu po okręgu v = 10 m/s i r = 5 m. Oblicz a_d.",
            "odpowiedzi": [
                "20 m/s²",
                "2 m/s²",
                "50 m/s²"
            ],
            "prawidlowa": 0,
            "wzor": "a_d = v²/r",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność a_d = v²/r i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność a_d = v²/r. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 20 m/s²."
        },
        {
            "id": "mechanika-8",
            "pytanie": "Dwa pojazdy jadą w przeciwnych kierunkach z 15 m/s i 20 m/s. Oblicz prędkość względną.",
            "odpowiedzi": [
                "35 m/s",
                "5 m/s",
                "300 m/s"
            ],
            "prawidlowa": 0,
            "wzor": "v_wzgl = v₁+v₂",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność v_wzgl = v₁+v₂ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność v_wzgl = v₁+v₂. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 35 m/s."
        },
        {
            "id": "mechanika-9",
            "pytanie": "Ciało o masie 4 kg ma pęd 28 kg·m/s. Oblicz prędkość.",
            "odpowiedzi": [
                "7 m/s",
                "112 m/s",
                "24 m/s"
            ],
            "prawidlowa": 0,
            "wzor": "p = mv",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność p = mv i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność p = mv. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 7 m/s."
        },
        {
            "id": "mechanika-10",
            "pytanie": "Piłka o masie 0,5 kg spada z wysokości 8 m. Przyjmij g = 10 m/s². Jaka jest jej energia potencjalna względem podłoża?",
            "odpowiedzi": [
                "40 J",
                "80 J",
                "4 J"
            ],
            "prawidlowa": 0,
            "wzor": "E_p = mgh",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E_p = mgh i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E_p = mgh. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 40 J."
        },
        {
            "id": "mechanika-11",
            "pytanie": "Na ciało działają siły 12 N i 5 N w przeciwnych kierunkach. Jaka jest wartość siły wypadkowej?",
            "odpowiedzi": [
                "7 N",
                "17 N",
                "60 N"
            ],
            "prawidlowa": 0,
            "wzor": "F_w = |F₁−F₂|",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność F_w = |F₁−F₂| i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność F_w = |F₁−F₂|. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 7 N."
        },
        {
            "id": "mechanika-12",
            "pytanie": "Praca siły 25 N na drodze 4 m, gdy siła jest równoległa do ruchu, wynosi...",
            "odpowiedzi": [
                "100 J",
                "29 J",
                "6,25 J"
            ],
            "prawidlowa": 0,
            "wzor": "W = Fs",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność W = Fs i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność W = Fs. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 100 J."
        }
    ],
    "grawitacja": [
        {
            "pytanie": "Widmo odległej galaktyki jest przesunięte ku czerwieni. Najbardziej uzasadniony wniosek to...",
            "odpowiedzi": [
                "Galaktyka oddala się od obserwatora",
                "Galaktyka na pewno jest chłodniejsza",
                "Jej masa zmalała"
            ],
            "prawidlowa": 0,
            "wzor": "zjawisko Dopplera",
            "rozwiazanie": "Przesunięcie ku czerwieni oznacza obserwowany spadek częstotliwości światła, zgodny z oddalaniem się źródła.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Planeta ma dwukrotnie większy promień niż Ziemia, ale taką samą masę. Jakie będzie przyspieszenie grawitacyjne przy jej powierzchni?",
            "odpowiedzi": [
                "4 razy mniejsze",
                "2 razy mniejsze",
                "2 razy większe"
            ],
            "prawidlowa": 0,
            "wzor": "g=GM/R²",
            "rozwiazanie": "Promień występuje w mianowniku w kwadracie, więc przy 2R otrzymujemy g/4.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Dwa ciała przyciągają się grawitacyjnie. Jeśli odległość między nimi zwiększymy 3 razy, siła zmieni się do...",
            "odpowiedzi": [
                "1/9 wartości",
                "1/3 wartości",
                "3 razy większej"
            ],
            "prawidlowa": 0,
            "wzor": "F=Gm₁m₂/r²",
            "rozwiazanie": "Siła jest odwrotnie proporcjonalna do kwadratu odległości.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Satelita porusza się po orbicie kołowej. Jeśli promień orbity wzrośnie 4 razy, jak zmieni się prędkość orbitalna?",
            "odpowiedzi": [
                "Zmniejszy się 2 razy",
                "Zmniejszy się 4 razy",
                "Wzrośnie 2 razy"
            ],
            "prawidlowa": 0,
            "wzor": "v=√(GM/r)",
            "rozwiazanie": "Prędkość orbitalna zależy od 1/√r, więc przy czterokrotnym wzroście r maleje dwukrotnie.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "grawitacja-1",
            "pytanie": "Dwie masy są oddalone o 2r. W porównaniu z odległością r siła grawitacji jest...",
            "odpowiedzi": [
                "4 razy mniejsza",
                "2 razy mniejsza",
                "4 razy większa"
            ],
            "prawidlowa": 0,
            "wzor": "F ∝ 1/r²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność F ∝ 1/r² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność F ∝ 1/r². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 4 razy mniejsza."
        },
        {
            "id": "grawitacja-2",
            "pytanie": "Na orbicie kołowej promień zwiększono 4 razy. Jak zmienia się prędkość orbitalna?",
            "odpowiedzi": [
                "Zmniejsza się 2 razy",
                "Zmniejsza się 4 razy",
                "Rośnie 2 razy"
            ],
            "prawidlowa": 0,
            "wzor": "v_orb = √(GM/r)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność v_orb = √(GM/r) i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność v_orb = √(GM/r). Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: Zmniejsza się 2 razy."
        },
        {
            "id": "grawitacja-3",
            "pytanie": "Jak zmieni się przyspieszenie grawitacyjne, gdy odległość od środka planety zwiększymy 3 razy?",
            "odpowiedzi": [
                "Zmniejszy się 9 razy",
                "Zmniejszy się 3 razy",
                "Zwiększy się 9 razy"
            ],
            "prawidlowa": 0,
            "wzor": "g = GM/r²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność g = GM/r² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność g = GM/r². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: Zmniejszy się 9 razy."
        },
        {
            "id": "grawitacja-4",
            "pytanie": "Ciało o masie 2 kg podniesiono o 15 m. Przyjmij g = 10 m/s². Przyrost energii potencjalnej wynosi...",
            "odpowiedzi": [
                "300 J",
                "30 J",
                "150 J"
            ],
            "prawidlowa": 0,
            "wzor": "ΔE_p = mgΔh",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ΔE_p = mgΔh i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ΔE_p = mgΔh. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 300 J."
        },
        {
            "id": "grawitacja-5",
            "pytanie": "Prędkość ucieczki z planety zależy od...",
            "odpowiedzi": [
                "M i R planety",
                "tylko masy statku",
                "tylko czasu lotu"
            ],
            "prawidlowa": 0,
            "wzor": "v_e = √(2GM/R)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność v_e = √(2GM/R) i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność v_e = √(2GM/R). Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: M i R planety."
        },
        {
            "id": "grawitacja-6",
            "pytanie": "Satelita obiega planetę po orbicie kołowej. Która siła zapewnia przyspieszenie dośrodkowe?",
            "odpowiedzi": [
                "grawitacja",
                "tarcie",
                "siła wyporu"
            ],
            "prawidlowa": 0,
            "wzor": "GMm/r² = mv²/r",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność GMm/r² = mv²/r i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność GMm/r² = mv²/r. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: grawitacja."
        },
        {
            "id": "grawitacja-7",
            "pytanie": "Jeżeli masa planety wzrośnie 4 razy przy stałym promieniu, g na powierzchni...",
            "odpowiedzi": [
                "wzrośnie 4 razy",
                "wzrośnie 2 razy",
                "nie zmieni się"
            ],
            "prawidlowa": 0,
            "wzor": "g = GM/R²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność g = GM/R² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność g = GM/R². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wzrośnie 4 razy."
        },
        {
            "id": "grawitacja-8",
            "pytanie": "Dla orbity kołowej energia mechaniczna satelity jest...",
            "odpowiedzi": [
                "ujemna",
                "zawsze dodatnia",
                "równa zeru"
            ],
            "prawidlowa": 0,
            "wzor": "E = −GMm/(2r)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E = −GMm/(2r) i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E = −GMm/(2r). Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: ujemna."
        },
        {
            "id": "grawitacja-9",
            "pytanie": "Okres obiegu planety zależy od półosi wielkiej orbity zgodnie z...",
            "odpowiedzi": [
                "T² ∝ a³",
                "T ∝ a³",
                "T² ∝ 1/a³"
            ],
            "prawidlowa": 0,
            "wzor": "T²/a³ = const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność T²/a³ = const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność T²/a³ = const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: T² ∝ a³."
        },
        {
            "id": "grawitacja-10",
            "pytanie": "Ciało spada z wysokości h bez oporu. Jak zmienia się jego energia mechaniczna?",
            "odpowiedzi": [
                "Pozostaje stała",
                "Rośnie",
                "Maleje"
            ],
            "prawidlowa": 0,
            "wzor": "E_mech = const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E_mech = const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E_mech = const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: Pozostaje stała."
        },
        {
            "id": "grawitacja-11",
            "pytanie": "Jeżeli promień orbity wzrośnie 9 razy, okres obiegu wzrośnie...",
            "odpowiedzi": [
                "27 razy",
                "9 razy",
                "3 razy"
            ],
            "prawidlowa": 0,
            "wzor": "T ∝ r^(3/2)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność T ∝ r^(3/2) i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność T ∝ r^(3/2). Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 27 razy."
        },
        {
            "id": "grawitacja-12",
            "pytanie": "Na powierzchni planety g = 4 m/s². Przy tym samym R, po zwiększeniu M 3 razy g wyniesie...",
            "odpowiedzi": [
                "12 m/s²",
                "7 m/s²",
                "4/3 m/s²"
            ],
            "prawidlowa": 0,
            "wzor": "g ∝ M",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność g ∝ M i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność g ∝ M. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 12 m/s²."
        }
    ],
    "termodynamika": [
        {
            "pytanie": "Ciało pobrało 12 kJ ciepła i jego energia wewnętrzna wzrosła o 5 kJ. Jaką pracę wykonało?",
            "odpowiedzi": [
                "7 kJ",
                "17 kJ",
                "5 kJ"
            ],
            "prawidlowa": 0,
            "wzor": "W=Q−ΔU",
            "rozwiazanie": "Z I zasady termodynamiki ΔU=Q−W, więc W=12−5=7 kJ.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Dla stałej ilości gazu temperatura bezwzględna wzrosła 2 razy, a objętość nie zmieniła się. Co stało się z ciśnieniem?",
            "odpowiedzi": [
                "Wzrosło 2 razy",
                "Zmalało 2 razy",
                "Nie zmieniło się"
            ],
            "prawidlowa": 0,
            "wzor": "pV=nRT",
            "rozwiazanie": "Przy stałych n i V ciśnienie jest proporcjonalne do temperatury w kelwinach.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Gaz otrzymał 1,2 kJ ciepła i wykonał pracę 0,7 kJ. Jak zmieniła się jego energia wewnętrzna?",
            "odpowiedzi": [
                "Wzrosła o 0,5 kJ",
                "Wzrosła o 1,9 kJ",
                "Zmalała o 0,5 kJ"
            ],
            "prawidlowa": 0,
            "wzor": "ΔU=Q−W",
            "rozwiazanie": "Część energii przekazanej gazowi została wykorzystana na wykonanie pracy, więc ΔU=1,2−0,7=0,5 kJ.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Metalowy element o masie 0,50 kg ogrzano o 40 K. Jego ciepło właściwe wynosi 900 J/(kg·K). Ile energii dostarczono?",
            "odpowiedzi": [
                "18 kJ",
                "36 kJ",
                "450 J"
            ],
            "prawidlowa": 0,
            "wzor": "Q=mcΔT",
            "rozwiazanie": "Q=0,50·900·40=18 000 J=18 kJ.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "termodynamika-w-asno-ci-materii-1",
            "pytanie": "2 kg wody ogrzano o 10 K. Przy c = 4200 J/(kg·K). Ile energii dostarczono?",
            "odpowiedzi": [
                "84 kJ",
                "8,4 kJ",
                "840 kJ"
            ],
            "prawidlowa": 0,
            "wzor": "Q = mcΔT",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność Q = mcΔT i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność Q = mcΔT. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 84 kJ."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-2",
            "pytanie": "Gaz w przemianie izotermicznej zmniejszył objętość 3 razy. Ciśnienie...",
            "odpowiedzi": [
                "wzrosło 3 razy",
                "zmalało 3 razy",
                "nie zmieniło się"
            ],
            "prawidlowa": 0,
            "wzor": "pV = const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność pV = const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność pV = const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wzrosło 3 razy."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-3",
            "pytanie": "W przemianie izochorycznej gaz ogrzano. Jak zmienia się ciśnienie?",
            "odpowiedzi": [
                "rośnie wraz z temperaturą bezwzględną",
                "maleje",
                "nie zmienia się"
            ],
            "prawidlowa": 0,
            "wzor": "p/T = const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność p/T = const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność p/T = const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: rośnie wraz z temperaturą bezwzględną."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-4",
            "pytanie": "Ciało o objętości 0,01 m³ jest całkowicie zanurzone w wodzie. Przyjmij ρ=1000 kg/m³ i g=10 m/s². Wypór wynosi...",
            "odpowiedzi": [
                "100 N",
                "10 N",
                "1000 N"
            ],
            "prawidlowa": 0,
            "wzor": "F_w = ρgV",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność F_w = ρgV i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność F_w = ρgV. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 100 N."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-5",
            "pytanie": "Ciśnienie hydrostatyczne w wodzie na 3 m wynosi przy g=10 m/s²...",
            "odpowiedzi": [
                "30 kPa",
                "3 kPa",
                "300 kPa"
            ],
            "prawidlowa": 0,
            "wzor": "p = ρgh",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność p = ρgh i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność p = ρgh. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 30 kPa."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-6",
            "pytanie": "Jeśli ciało pływa, to jego średnia gęstość jest...",
            "odpowiedzi": [
                "mniejsza od gęstości cieczy",
                "większa",
                "zawsze równa zeru"
            ],
            "prawidlowa": 0,
            "wzor": "ρ_ciała < ρ_cieczy",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ρ_ciała < ρ_cieczy i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ρ_ciała < ρ_cieczy. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: mniejsza od gęstości cieczy."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-7",
            "pytanie": "Ciało pobrało 15 kJ ciepła i wykonało pracę 4 kJ. ΔU wynosi...",
            "odpowiedzi": [
                "11 kJ",
                "19 kJ",
                "4 kJ"
            ],
            "prawidlowa": 0,
            "wzor": "ΔU = Q − W",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ΔU = Q − W i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ΔU = Q − W. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 11 kJ."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-8",
            "pytanie": "Gaz doskonały ma n moli, temperaturę T i objętość V. Ciśnienie opisuje...",
            "odpowiedzi": [
                "pV = nRT",
                "p = nVRT",
                "pV = RT/n"
            ],
            "prawidlowa": 0,
            "wzor": "pV = nRT",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność pV = nRT i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność pV = nRT. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: pV = nRT."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-9",
            "pytanie": "Współczynnik rozszerzalności cieplnej opisuje zmianę...",
            "odpowiedzi": [
                "wymiarów pod wpływem temperatury",
                "ładunku elektronu",
                "okresu rozpadu"
            ],
            "prawidlowa": 0,
            "wzor": "ΔL = αL₀ΔT",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ΔL = αL₀ΔT i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ΔL = αL₀ΔT. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wymiarów pod wpływem temperatury."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-10",
            "pytanie": "Woda i olej mają tę samą masę i otrzymują tyle samo ciepła. Materiał o większym c ma...",
            "odpowiedzi": [
                "mniejszy przyrost temperatury",
                "większy przyrost temperatury",
                "zawsze ten sam przyrost"
            ],
            "prawidlowa": 0,
            "wzor": "ΔT = Q/(mc)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ΔT = Q/(mc) i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ΔT = Q/(mc). Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: mniejszy przyrost temperatury."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-11",
            "pytanie": "W przepływie idealnej cieczy w zwężeniu prędkość...",
            "odpowiedzi": [
                "rośnie, a ciśnienie statyczne może maleć",
                "maleje, a ciśnienie zawsze rośnie",
                "nie zmienia się"
            ],
            "prawidlowa": 0,
            "wzor": "A₁v₁=A₂v₂; Bernoulli",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność A₁v₁=A₂v₂; Bernoulli i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność A₁v₁=A₂v₂; Bernoulli. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: rośnie, a ciśnienie statyczne może maleć."
        },
        {
            "id": "termodynamika-w-asno-ci-materii-12",
            "pytanie": "Przy stałej masie gazu w przemianie izobarycznej objętość jest proporcjonalna do...",
            "odpowiedzi": [
                "temperatury w kelwinach",
                "temperatury w °C",
                "odwrotności temperatury"
            ],
            "prawidlowa": 0,
            "wzor": "V/T = const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność V/T = const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność V/T = const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: temperatury w kelwinach."
        }
    ],
    "fale_drgania": [
        {
            "pytanie": "Obserwator zbliża się do nieruchomego źródła dźwięku. Jak zmienia się częstotliwość odbierana?",
            "odpowiedzi": [
                "Rośnie",
                "Maleje",
                "Nie zmienia się"
            ],
            "prawidlowa": 0,
            "wzor": "efekt Dopplera",
            "rozwiazanie": "Zbliżanie obserwatora powoduje wzrost częstości docierających frontów fal.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Dwa zgodne źródła fal mają różnicę dróg równą 3λ. W punkcie obserwacji wystąpi...",
            "odpowiedzi": [
                "Wzmocnienie",
                "Wygaszenie",
                "Brak fali"
            ],
            "prawidlowa": 0,
            "wzor": "Δr=kλ",
            "rozwiazanie": "Dla całkowitej wielokrotności λ fale są zgodne w fazie i następuje wzmocnienie.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Okres drgań zmniejszono z 0,40 s do 0,20 s. Jak zmieniła się częstotliwość?",
            "odpowiedzi": [
                "Wzrosła 2 razy",
                "Zmalała 2 razy",
                "Nie zmieniła się"
            ],
            "prawidlowa": 0,
            "wzor": "f=1/T",
            "rozwiazanie": "Połowa okresu oznacza dwukrotnie większą częstotliwość.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Fala ma częstotliwość 4 Hz i długość 0,75 m. Z jaką prędkością się rozchodzi?",
            "odpowiedzi": [
                "3 m/s",
                "5,33 m/s",
                "0,19 m/s"
            ],
            "prawidlowa": 0,
            "wzor": "v=λf",
            "rozwiazanie": "v=0,75·4=3 m/s.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "fale-drgania-1",
            "pytanie": "Drganie ma T=0,25 s. Częstotliwość wynosi...",
            "odpowiedzi": [
                "4 Hz",
                "0,25 Hz",
                "2 Hz"
            ],
            "prawidlowa": 0,
            "wzor": "f=1/T",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność f=1/T i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność f=1/T. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 4 Hz."
        },
        {
            "id": "fale-drgania-2",
            "pytanie": "Fala ma λ=2 m i f=5 Hz. Prędkość wynosi...",
            "odpowiedzi": [
                "10 m/s",
                "2,5 m/s",
                "7 m/s"
            ],
            "prawidlowa": 0,
            "wzor": "v=λf",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność v=λf i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność v=λf. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 10 m/s."
        },
        {
            "id": "fale-drgania-3",
            "pytanie": "Zwiększenie amplitudy fali przy tej samej częstotliwości wpływa przede wszystkim na...",
            "odpowiedzi": [
                "energię/intensywność drgań",
                "prędkość światła w próżni",
                "okres, który musi się zmienić"
            ],
            "prawidlowa": 0,
            "wzor": "A — amplituda",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność A — amplituda i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność A — amplituda. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: energię/intensywność drgań."
        },
        {
            "id": "fale-drgania-4",
            "pytanie": "Fala podłużna charakteryzuje się drganiami ośrodka...",
            "odpowiedzi": [
                "wzdłuż kierunku rozchodzenia się fali",
                "prostopadle do niego",
                "bez drgań"
            ],
            "prawidlowa": 0,
            "wzor": "fala podłużna",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność fala podłużna i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność fala podłużna. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wzdłuż kierunku rozchodzenia się fali."
        },
        {
            "id": "fale-drgania-5",
            "pytanie": "Przy stałej prędkości fali wzrost częstotliwości 2 razy powoduje...",
            "odpowiedzi": [
                "spadek długości fali 2 razy",
                "wzrost λ 2 razy",
                "brak zmiany λ"
            ],
            "prawidlowa": 0,
            "wzor": "λ=v/f",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność λ=v/f i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność λ=v/f. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: spadek długości fali 2 razy."
        },
        {
            "id": "fale-drgania-6",
            "pytanie": "W rezonansie amplituda drgań wymuszonych może...",
            "odpowiedzi": [
                "znacznie wzrosnąć przy odpowiedniej częstotliwości wymuszającej",
                "zawsze spaść do zera",
                "nie zależeć od częstotliwości"
            ],
            "prawidlowa": 0,
            "wzor": "rezonans",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność rezonans i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność rezonans. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: znacznie wzrosnąć przy odpowiedniej częstotliwości wymuszającej."
        },
        {
            "id": "fale-drgania-7",
            "pytanie": "Źródło zbliża się do obserwatora. Efekt Dopplera daje częstotliwość...",
            "odpowiedzi": [
                "większą",
                "mniejszą",
                "równą zero"
            ],
            "prawidlowa": 0,
            "wzor": "efekt Dopplera",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność efekt Dopplera i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność efekt Dopplera. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: większą."
        },
        {
            "id": "fale-drgania-8",
            "pytanie": "Interferencja konstruktywna występuje, gdy fale...",
            "odpowiedzi": [
                "wzmacniają się w wyniku zgodnej fazy",
                "zawsze mają przeciwne fazy",
                "nie mają żadnej zależności fazowej"
            ],
            "prawidlowa": 0,
            "wzor": "Δr = kλ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność Δr = kλ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność Δr = kλ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wzmacniają się w wyniku zgodnej fazy."
        },
        {
            "id": "fale-drgania-9",
            "pytanie": "Dyfrakcja jest szczególnie wyraźna, gdy rozmiar szczeliny jest...",
            "odpowiedzi": [
                "porównywalny z długością fali",
                "milion razy większy od λ",
                "równy zeru"
            ],
            "prawidlowa": 0,
            "wzor": "a ~ λ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność a ~ λ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność a ~ λ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: porównywalny z długością fali."
        },
        {
            "id": "fale-drgania-10",
            "pytanie": "Energia drgania harmonicznego jest w idealnym modelu...",
            "odpowiedzi": [
                "stała w czasie",
                "zawsze rosnąca",
                "zawsze malejąca"
            ],
            "prawidlowa": 0,
            "wzor": "E = const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E = const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E = const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: stała w czasie."
        },
        {
            "id": "fale-drgania-11",
            "pytanie": "Jeżeli częstotliwość wzrośnie 4 razy, okres...",
            "odpowiedzi": [
                "zmaleje 4 razy",
                "wzrośnie 4 razy",
                "nie zmieni się"
            ],
            "prawidlowa": 0,
            "wzor": "T=1/f",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność T=1/f i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność T=1/f. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: zmaleje 4 razy."
        },
        {
            "id": "fale-drgania-12",
            "pytanie": "Prędkość dźwięku w gazie zależy m.in. od...",
            "odpowiedzi": [
                "właściwości ośrodka i temperatury",
                "tylko amplitudy",
                "ładunku źródła"
            ],
            "prawidlowa": 0,
            "wzor": "v_dźwięku",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność v_dźwięku i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność v_dźwięku. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: właściwości ośrodka i temperatury."
        }
    ],
    "optyka": [
        {
            "pytanie": "W doświadczeniu z interferencją zwiększono długość fali, pozostawiając geometrię układu bez zmian. Odstęp prążków...",
            "odpowiedzi": [
                "Zwiększy się",
                "Zmniejszy się",
                "Nie zmieni się"
            ],
            "prawidlowa": 0,
            "wzor": "Δx∝λ",
            "rozwiazanie": "Odległość między prążkami interferencyjnymi jest proporcjonalna do długości fali.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Na płaskie lustro pada promień pod kątem 35° do normalnej. Kąt między promieniem padającym a odbitym wynosi...",
            "odpowiedzi": [
                "70°",
                "35°",
                "55°"
            ],
            "prawidlowa": 0,
            "wzor": "αodb=αpad",
            "rozwiazanie": "Oba kąty względem normalnej mają 35°, więc kąt między promieniami to 35°+35°=70°.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Soczewka skupiająca ma ogniskową 20 cm. Przedmiot ustawiono 60 cm od soczewki. W jakiej odległości powstanie obraz?",
            "odpowiedzi": [
                "30 cm",
                "15 cm",
                "40 cm"
            ],
            "prawidlowa": 0,
            "wzor": "1/f=1/x+1/y",
            "rozwiazanie": "1/20=1/60+1/y, więc 1/y=1/30 i y=30 cm.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Promień przechodzi z powietrza do szkła o n=1,5. Dla sin kąta padania=0,75 wartość sin kąta załamania wynosi...",
            "odpowiedzi": [
                "0,50",
                "1,125",
                "0,75"
            ],
            "prawidlowa": 0,
            "wzor": "n₁sinα=n₂sinβ",
            "rozwiazanie": "Dla powietrza n₁≈1, więc sinβ=0,75/1,5=0,50.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "optyka-1",
            "pytanie": "Kąt odbicia jest równy...",
            "odpowiedzi": [
                "kątowi padania względem normalnej",
                "kątowi do powierzchni",
                "zawsze 90°"
            ],
            "prawidlowa": 0,
            "wzor": "θᵢ=θᵣ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność θᵢ=θᵣ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność θᵢ=θᵣ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: kątowi padania względem normalnej."
        },
        {
            "id": "optyka-2",
            "pytanie": "Przy przejściu do optycznie gęstszego ośrodka promień załamuje się...",
            "odpowiedzi": [
                "ku normalnej",
                "od normalnej",
                "zawsze prostopadle"
            ],
            "prawidlowa": 0,
            "wzor": "n₁sinθ₁=n₂sinθ₂",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność n₁sinθ₁=n₂sinθ₂ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność n₁sinθ₁=n₂sinθ₂. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: ku normalnej."
        },
        {
            "id": "optyka-3",
            "pytanie": "Soczewka skupiająca dla promieni równoległych powoduje...",
            "odpowiedzi": [
                "ich skupienie w ognisku",
                "ich całkowite pochłonięcie",
                "ich rozbieganie"
            ],
            "prawidlowa": 0,
            "wzor": "soczewka skupiająca",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność soczewka skupiająca i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność soczewka skupiająca. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: ich skupienie w ognisku."
        },
        {
            "id": "optyka-4",
            "pytanie": "Dla soczewki cienkiej zachodzi...",
            "odpowiedzi": [
                "1/f=1/x+1/y",
                "f=x+y",
                "f=xy"
            ],
            "prawidlowa": 0,
            "wzor": "1/f=1/x+1/y",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność 1/f=1/x+1/y i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność 1/f=1/x+1/y. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 1/f=1/x+1/y."
        },
        {
            "id": "optyka-5",
            "pytanie": "Zwiększenie odległości przedmiotu od soczewki może zmienić...",
            "odpowiedzi": [
                "położenie i rozmiar obrazu",
                "prędkość światła w próżni",
                "ładunek fotonu"
            ],
            "prawidlowa": 0,
            "wzor": "równanie soczewki",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność równanie soczewki i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność równanie soczewki. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: położenie i rozmiar obrazu."
        },
        {
            "id": "optyka-6",
            "pytanie": "Całkowite wewnętrzne odbicie jest możliwe, gdy światło przechodzi...",
            "odpowiedzi": [
                "z ośrodka optycznie gęstszego do rzadszego i kąt jest dostatecznie duży",
                "z powietrza do szkła przy dowolnym kącie",
                "z próżni do powietrza"
            ],
            "prawidlowa": 0,
            "wzor": "sinθ_gr=n₂/n₁",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność sinθ_gr=n₂/n₁ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność sinθ_gr=n₂/n₁. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: z ośrodka optycznie gęstszego do rzadszego i kąt jest dostatecznie duży."
        },
        {
            "id": "optyka-7",
            "pytanie": "W interferencji światła prążki powstają w wyniku...",
            "odpowiedzi": [
                "nakładania się fal",
                "zatrzymania fotonów",
                "zmiany masy światła"
            ],
            "prawidlowa": 0,
            "wzor": "interferencja",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność interferencja i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność interferencja. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: nakładania się fal."
        },
        {
            "id": "optyka-8",
            "pytanie": "Dyfrakcja pokazuje, że światło...",
            "odpowiedzi": [
                "ma właściwości falowe",
                "nie może się rozchodzić",
                "jest wyłącznie cząstką klasyczną"
            ],
            "prawidlowa": 0,
            "wzor": "dyfrakcja",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność dyfrakcja i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność dyfrakcja. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: ma właściwości falowe."
        },
        {
            "id": "optyka-9",
            "pytanie": "Współczynnik załamania można wiązać z prędkością światła w ośrodku przez...",
            "odpowiedzi": [
                "n=c/v",
                "n=v/c",
                "n=cv"
            ],
            "prawidlowa": 0,
            "wzor": "n=c/v",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność n=c/v i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność n=c/v. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: n=c/v."
        },
        {
            "id": "optyka-10",
            "pytanie": "Powiększenie liniowe obrazu jest związane ze stosunkiem...",
            "odpowiedzi": [
                "wysokości obrazu do wysokości przedmiotu",
                "mas obrazu i przedmiotu",
                "częstotliwości światła i czasu"
            ],
            "prawidlowa": 0,
            "wzor": "m=h_i/h_o",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność m=h_i/h_o i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność m=h_i/h_o. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wysokości obrazu do wysokości przedmiotu."
        },
        {
            "id": "optyka-11",
            "pytanie": "Oko krótkowzroczne koryguje się soczewką...",
            "odpowiedzi": [
                "rozpraszającą",
                "skupiającą",
                "cylindryczną w każdym przypadku"
            ],
            "prawidlowa": 0,
            "wzor": "korekcja krótkowzroczności",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność korekcja krótkowzroczności i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność korekcja krótkowzroczności. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: rozpraszającą."
        },
        {
            "id": "optyka-12",
            "pytanie": "Światło o krótszej długości fali ma w próżni...",
            "odpowiedzi": [
                "większą częstotliwość",
                "mniejszą częstotliwość",
                "taką samą częstotliwość"
            ],
            "prawidlowa": 0,
            "wzor": "c=λf",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność c=λf i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność c=λf. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: większą częstotliwość."
        }
    ],
    "elektromagnetyzm": [
        {
            "pytanie": "Strumień pola magnetycznego przez zwojnicę zmniejsza się. Zgodnie z regułą Lenza prąd indukowany...",
            "odpowiedzi": [
                "Wytwarza pole przeciwdziałające zmianie strumienia",
                "Zawsze ma dowolny zwrot",
                "Nie może powstać"
            ],
            "prawidlowa": 0,
            "wzor": "prawo Lenza",
            "rozwiazanie": "Indukowany prąd przeciwdziała przyczynie, która go wywołała, czyli zmianie strumienia.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Ładunek 2 μC znajduje się w odległości 0,30 m od punktowego ładunku 3 μC. Przyjmij k=9·10⁹. Wartość siły wynosi...",
            "odpowiedzi": [
                "0,60 N",
                "6,0 N",
                "0,06 N"
            ],
            "prawidlowa": 0,
            "wzor": "F=k|q₁q₂|/r²",
            "rozwiazanie": "Po zamianie μC na C: F=9·10⁹·6·10⁻¹²/0,09=0,60 N.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Dwa oporniki 6 Ω i 3 Ω połączono równolegle. Jaki jest opór zastępczy?",
            "odpowiedzi": [
                "2 Ω",
                "9 Ω",
                "4,5 Ω"
            ],
            "prawidlowa": 0,
            "wzor": "1/R=1/R₁+1/R₂",
            "rozwiazanie": "1/R=1/6+1/3=1/2, więc R=2 Ω.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Opornik 6 Ω podłączono do napięcia 12 V. Następnie napięcie zwiększono do 24 V, a opór pozostał stały. Jak zmieni się moc?",
            "odpowiedzi": [
                "Wzrośnie 4 razy",
                "Wzrośnie 2 razy",
                "Nie zmieni się"
            ],
            "prawidlowa": 0,
            "wzor": "P=U²/R",
            "rozwiazanie": "Przy stałym R moc jest proporcjonalna do U², więc przy podwojeniu napięcia rośnie czterokrotnie.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "elektromagnetyzm-elektryczno-1",
            "pytanie": "Prawo Ohma ma postać...",
            "odpowiedzi": [
                "U=IR",
                "U=I/R",
                "U=R/I"
            ],
            "prawidlowa": 0,
            "wzor": "U=IR",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność U=IR i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność U=IR. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: U=IR."
        },
        {
            "id": "elektromagnetyzm-elektryczno-2",
            "pytanie": "Moc urządzenia o U=20 V i I=2 A wynosi...",
            "odpowiedzi": [
                "40 W",
                "10 W",
                "22 W"
            ],
            "prawidlowa": 0,
            "wzor": "P=UI",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność P=UI i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność P=UI. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 40 W."
        },
        {
            "id": "elektromagnetyzm-elektryczno-3",
            "pytanie": "Dwa oporniki 4 Ω i 6 Ω szeregowo mają...",
            "odpowiedzi": [
                "10 Ω",
                "2,4 Ω",
                "24 Ω"
            ],
            "prawidlowa": 0,
            "wzor": "R_z=R₁+R₂",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność R_z=R₁+R₂ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność R_z=R₁+R₂. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 10 Ω."
        },
        {
            "id": "elektromagnetyzm-elektryczno-4",
            "pytanie": "Dwa jednakowe oporniki R połączone równolegle mają...",
            "odpowiedzi": [
                "R/2",
                "2R",
                "R"
            ],
            "prawidlowa": 0,
            "wzor": "R_z=R/2",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność R_z=R/2 i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność R_z=R/2. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: R/2."
        },
        {
            "id": "elektromagnetyzm-elektryczno-5",
            "pytanie": "Siła Lorentza jest prostopadła do...",
            "odpowiedzi": [
                "prędkości i pola magnetycznego w odpowiedniej konfiguracji",
                "zawsze tylko do ładunku",
                "czasu"
            ],
            "prawidlowa": 0,
            "wzor": "F=qvB sinθ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność F=qvB sinθ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność F=qvB sinθ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: prędkości i pola magnetycznego w odpowiedniej konfiguracji."
        },
        {
            "id": "elektromagnetyzm-elektryczno-6",
            "pytanie": "Indukcja elektromagnetyczna powstaje przy zmianie...",
            "odpowiedzi": [
                "strumienia magnetycznego",
                "masy elektronu",
                "temperatury absolutnej w każdym przypadku"
            ],
            "prawidlowa": 0,
            "wzor": "ε=-ΔΦ/Δt",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ε=-ΔΦ/Δt i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ε=-ΔΦ/Δt. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: strumienia magnetycznego."
        },
        {
            "id": "elektromagnetyzm-elektryczno-7",
            "pytanie": "Pole elektryczne punktowego ładunku maleje z odległością jak...",
            "odpowiedzi": [
                "1/r²",
                "1/r",
                "r²"
            ],
            "prawidlowa": 0,
            "wzor": "E=kq/r²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E=kq/r² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E=kq/r². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 1/r²."
        },
        {
            "id": "elektromagnetyzm-elektryczno-8",
            "pytanie": "W węźle obwodu suma prądów wpływających...",
            "odpowiedzi": [
                "równa się sumie wypływających",
                "zawsze jest większa",
                "zawsze jest mniejsza"
            ],
            "prawidlowa": 0,
            "wzor": "I prawo Kirchhoffa",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność I prawo Kirchhoffa i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność I prawo Kirchhoffa. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: równa się sumie wypływających."
        },
        {
            "id": "elektromagnetyzm-elektryczno-9",
            "pytanie": "Napięcie jest pracą przypadającą na...",
            "odpowiedzi": [
                "jednostkę ładunku",
                "jednostkę masy",
                "jednostkę czasu"
            ],
            "prawidlowa": 0,
            "wzor": "U=W/q",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność U=W/q i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność U=W/q. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: jednostkę ładunku."
        },
        {
            "id": "elektromagnetyzm-elektryczno-10",
            "pytanie": "Praca pola elektrycznego przy przenoszeniu ładunku wiąże się z...",
            "odpowiedzi": [
                "różnicą potencjałów",
                "gęstością wody",
                "okresem fali mechanicznej"
            ],
            "prawidlowa": 0,
            "wzor": "W=qU",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność W=qU i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność W=qU. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: różnicą potencjałów."
        },
        {
            "id": "elektromagnetyzm-elektryczno-11",
            "pytanie": "Jeśli napięcie wzrośnie 3 razy przy stałym R, prąd...",
            "odpowiedzi": [
                "wzrośnie 3 razy",
                "zmaleje 3 razy",
                "nie zmieni się"
            ],
            "prawidlowa": 0,
            "wzor": "I=U/R",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność I=U/R i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność I=U/R. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wzrośnie 3 razy."
        },
        {
            "id": "elektromagnetyzm-elektryczno-12",
            "pytanie": "Siła na przewodnik z prądem w polu magnetycznym zależy od...",
            "odpowiedzi": [
                "B, I, L i kąta",
                "tylko temperatury",
                "tylko masy przewodnika"
            ],
            "prawidlowa": 0,
            "wzor": "F=BIL sinθ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność F=BIL sinθ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność F=BIL sinθ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: B, I, L i kąta."
        }
    ],
    "fizyka_atomowa_jadrowa": [
        {
            "pytanie": "W reakcji jądrowej ubytek masy wynosi 2·10⁻³ kg. Przyjmij c=3·10⁸ m/s. Energia odpowiadająca temu ubytkowi to...",
            "odpowiedzi": [
                "1,8·10¹⁴ J",
                "1,8·10¹² J",
                "6·10⁵ J"
            ],
            "prawidlowa": 0,
            "wzor": "E=Δmc²",
            "rozwiazanie": "E=2·10⁻³·9·10¹⁶=1,8·10¹⁴ J.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Próbka ma okres półtrwania 3 h. Po 9 h pozostanie jaka część początkowej liczby jąder?",
            "odpowiedzi": [
                "1/8",
                "1/3",
                "1/9"
            ],
            "prawidlowa": 0,
            "wzor": "N=N₀(1/2)ⁿ",
            "rozwiazanie": "9 h to trzy okresy półtrwania: (1/2)³=1/8.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Praca wyjścia metalu wynosi 2 eV, a energia fotonu 5 eV. Maksymalna energia kinetyczna elektronu wynosi...",
            "odpowiedzi": [
                "3 eV",
                "7 eV",
                "2,5 eV"
            ],
            "prawidlowa": 0,
            "wzor": "Eₖ,max=hf−W",
            "rozwiazanie": "Część energii fotonu pokonuje pracę wyjścia, więc pozostają 5−2=3 eV.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Foton ma częstotliwość 6·10¹⁴ Hz. Przyjmij h=6,63·10⁻³⁴ J·s. Energia fotonu wynosi około...",
            "odpowiedzi": [
                "3,98·10⁻¹⁹ J",
                "1,10·10⁻¹⁹ J",
                "3,98·10⁻²⁰ J"
            ],
            "prawidlowa": 0,
            "wzor": "E=hf",
            "rozwiazanie": "E=6,63·10⁻³⁴·6·10¹⁴≈3,98·10⁻¹⁹ J.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-1",
            "pytanie": "Energia fotonu jest równa...",
            "odpowiedzi": [
                "E=hf",
                "E=h/f",
                "E=f/h"
            ],
            "prawidlowa": 0,
            "wzor": "E=hf",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E=hf i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E=hf. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: E=hf."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-2",
            "pytanie": "Efekt fotoelektryczny potwierdza...",
            "odpowiedzi": [
                "kwantową naturę oddziaływania światła z materią",
                "brak energii fotonów",
                "że światło nie ma częstotliwości"
            ],
            "prawidlowa": 0,
            "wzor": "E_k,max=hf−W",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E_k,max=hf−W i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E_k,max=hf−W. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: kwantową naturę oddziaływania światła z materią."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-3",
            "pytanie": "Po dwóch okresach półtrwania pozostaje...",
            "odpowiedzi": [
                "1/4 próbki",
                "1/2 próbki",
                "3/4 próbki"
            ],
            "prawidlowa": 0,
            "wzor": "N=N₀/2ⁿ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność N=N₀/2ⁿ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność N=N₀/2ⁿ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: 1/4 próbki."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-4",
            "pytanie": "Czas połowicznego rozpadu jest...",
            "odpowiedzi": [
                "charakterystyczny dla danego izotopu",
                "zależny wyłącznie od masy próbki",
                "zawsze równy 1 s"
            ],
            "prawidlowa": 0,
            "wzor": "T₁/₂",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność T₁/₂ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność T₁/₂. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: charakterystyczny dla danego izotopu."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-5",
            "pytanie": "Jądro atomowe składa się z...",
            "odpowiedzi": [
                "protonów i neutronów",
                "elektronów i fotonów",
                "samych elektronów"
            ],
            "prawidlowa": 0,
            "wzor": "A=Z+N",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność A=Z+N i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność A=Z+N. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: protonów i neutronów."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-6",
            "pytanie": "W rozpadzie alfa emitowana jest...",
            "odpowiedzi": [
                "cząstka ⁴₂He",
                "pojedynczy elektron",
                "foton widzialny"
            ],
            "prawidlowa": 0,
            "wzor": "α=⁴₂He",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność α=⁴₂He i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność α=⁴₂He. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: cząstka ⁴₂He."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-7",
            "pytanie": "W rozpadzie beta minus neutron przechodzi w...",
            "odpowiedzi": [
                "proton, elektron i antyneutrino",
                "elektron i proton bez zachowania ładunku",
                "foton"
            ],
            "prawidlowa": 0,
            "wzor": "n→p+e⁻+ν̄",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność n→p+e⁻+ν̄ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność n→p+e⁻+ν̄. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: proton, elektron i antyneutrino."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-8",
            "pytanie": "Energia wiązania wynika z...",
            "odpowiedzi": [
                "defektu masy",
                "koloru jądra",
                "promienia elektronu"
            ],
            "prawidlowa": 0,
            "wzor": "E=Δmc²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E=Δmc² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E=Δmc². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: defektu masy."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-9",
            "pytanie": "Rozszczepienie ciężkiego jądra może uwolnić...",
            "odpowiedzi": [
                "energię",
                "wyłącznie światło widzialne bez energii",
                "masę bez energii"
            ],
            "prawidlowa": 0,
            "wzor": "E=Δmc²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E=Δmc² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E=Δmc². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: energię."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-10",
            "pytanie": "Długość fali de Broglie’a jest odwrotnie proporcjonalna do...",
            "odpowiedzi": [
                "pędu",
                "masy spoczynkowej wyłącznie",
                "czasu"
            ],
            "prawidlowa": 0,
            "wzor": "λ=h/p",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność λ=h/p i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność λ=h/p. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: pędu."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-11",
            "pytanie": "Zasada nieoznaczoności ogranicza jednoczesną dokładność pomiaru...",
            "odpowiedzi": [
                "położenia i pędu",
                "masy i ładunku zawsze",
                "temperatury i czasu"
            ],
            "prawidlowa": 0,
            "wzor": "ΔxΔp ≥ ħ/2",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ΔxΔp ≥ ħ/2 i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ΔxΔp ≥ ħ/2. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: położenia i pędu."
        },
        {
            "id": "fizyka-atomowa-j-drowa-kwantowa-12",
            "pytanie": "W atomie absorpcja fotonu może prowadzić do...",
            "odpowiedzi": [
                "przejścia elektronu na wyższy poziom energii",
                "zniknięcia jądra w każdym przypadku",
                "zmiany stałej Plancka"
            ],
            "prawidlowa": 0,
            "wzor": "ΔE=hf",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność ΔE=hf i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność ΔE=hf. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: przejścia elektronu na wyższy poziom energii."
        }
    ],
    "teoria_wzglednosci": [
        {
            "pytanie": "Które stwierdzenie najlepiej opisuje ogólną teorię względności?",
            "odpowiedzi": [
                "Grawitacja jest związana z geometrią czasoprzestrzeni",
                "Grawitacja znika dla światła",
                "Czas płynie identycznie w każdym polu grawitacyjnym"
            ],
            "prawidlowa": 0,
            "wzor": "zasada równoważności",
            "rozwiazanie": "W OTW grawitacja jest opisywana jako efekt zakrzywienia czasoprzestrzeni.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Energia spoczynkowa masy 2 g wynosi przy c=3·10⁸ m/s...",
            "odpowiedzi": [
                "1,8·10¹⁴ J",
                "1,8·10¹⁵ J",
                "6·10⁵ J"
            ],
            "prawidlowa": 0,
            "wzor": "E₀=mc²",
            "rozwiazanie": "2 g=0,002 kg, więc E₀=0,002·9·10¹⁶=1,8·10¹⁴ J.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Długość pręta w jego układzie spoczynkowym wynosi 10 m. Dla obserwatora, względem którego pręt porusza się z 0,6c, długość wynosi...",
            "odpowiedzi": [
                "8 m",
                "10 m",
                "6 m"
            ],
            "prawidlowa": 0,
            "wzor": "L=L₀/γ",
            "rozwiazanie": "γ=1/√(1−0,6²)=1,25, więc L=10/1,25=8 m.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Statek porusza się z v=0,8c. Czas własny na statku wynosi 6 lat. Ile mierzy obserwator zewnętrzny?",
            "odpowiedzi": [
                "10 lat",
                "4,8 roku",
                "7,5 roku"
            ],
            "prawidlowa": 0,
            "wzor": "t=γτ",
            "rozwiazanie": "γ=1/√(1−0,8²)=5/3, więc t=10 lat.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "wzgl-dno-1",
            "pytanie": "Energia spoczynkowa ciała wynosi...",
            "odpowiedzi": [
                "E₀=mc²",
                "E₀=mv",
                "E₀=m/c²"
            ],
            "prawidlowa": 0,
            "wzor": "E₀=mc²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E₀=mc² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E₀=mc². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: E₀=mc²."
        },
        {
            "id": "wzgl-dno-2",
            "pytanie": "Dla obserwatora poruszający się zegar chodzi...",
            "odpowiedzi": [
                "wolniej",
                "szybciej bez ograniczeń",
                "tak samo w każdym układzie"
            ],
            "prawidlowa": 0,
            "wzor": "Δt=γΔt₀",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność Δt=γΔt₀ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność Δt=γΔt₀. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: wolniej."
        },
        {
            "id": "wzgl-dno-3",
            "pytanie": "Długość poruszającego się pręta wzdłuż ruchu...",
            "odpowiedzi": [
                "ulega skróceniu",
                "ulega wydłużeniu",
                "nie zależy od prędkości"
            ],
            "prawidlowa": 0,
            "wzor": "L=L₀/γ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność L=L₀/γ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność L=L₀/γ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: ulega skróceniu."
        },
        {
            "id": "wzgl-dno-4",
            "pytanie": "Współczynnik Lorentza jest...",
            "odpowiedzi": [
                "γ=1/√(1−v²/c²)",
                "γ=1−v²/c²",
                "γ=√(1−v²/c²)"
            ],
            "prawidlowa": 0,
            "wzor": "γ=1/√(1−v²/c²",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność γ=1/√(1−v²/c² i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność γ=1/√(1−v²/c². Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: γ=1/√(1−v²/c²)."
        },
        {
            "id": "wzgl-dno-5",
            "pytanie": "Dla v << c teoria względności...",
            "odpowiedzi": [
                "przechodzi w przybliżeniu klasycznym",
                "zabrania ruchu",
                "daje nieskończoną energię"
            ],
            "prawidlowa": 0,
            "wzor": "granica klasyczna",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność granica klasyczna i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność granica klasyczna. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: przechodzi w przybliżeniu klasycznym."
        },
        {
            "id": "wzgl-dno-6",
            "pytanie": "Masa spoczynkowa jest...",
            "odpowiedzi": [
                "niezmiennikiem układu odniesienia",
                "zawsze zależna od prędkości obserwatora",
                "równa pędowi"
            ],
            "prawidlowa": 0,
            "wzor": "m=const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność m=const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność m=const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: niezmiennikiem układu odniesienia."
        },
        {
            "id": "wzgl-dno-7",
            "pytanie": "Prędkość światła w próżni jest...",
            "odpowiedzi": [
                "taka sama dla inercjalnych obserwatorów",
                "zależna od ruchu źródła",
                "większa dla cięższych obserwatorów"
            ],
            "prawidlowa": 0,
            "wzor": "c=const",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność c=const i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność c=const. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: taka sama dla inercjalnych obserwatorów."
        },
        {
            "id": "wzgl-dno-8",
            "pytanie": "Zależność E²=(pc)²+(mc²)² łączy...",
            "odpowiedzi": [
                "energię, pęd i masę spoczynkową",
                "tylko energię cieplną",
                "ładunek i temperaturę"
            ],
            "prawidlowa": 0,
            "wzor": "E²=p²c²+m²c⁴",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność E²=p²c²+m²c⁴ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność E²=p²c²+m²c⁴. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: energię, pęd i masę spoczynkową."
        },
        {
            "id": "wzgl-dno-9",
            "pytanie": "Dylatacja czasu jest istotna...",
            "odpowiedzi": [
                "przy prędkościach porównywalnych z c",
                "tylko dla nieruchomych zegarów",
                "wyłącznie w gazach"
            ],
            "prawidlowa": 0,
            "wzor": "efekty relatywistyczne",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność efekty relatywistyczne i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność efekty relatywistyczne. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: przy prędkościach porównywalnych z c."
        },
        {
            "id": "wzgl-dno-10",
            "pytanie": "Kontrakcja długości dotyczy wymiaru...",
            "odpowiedzi": [
                "równoległego do ruchu",
                "prostopadłego do ruchu",
                "każdego wymiaru w ten sam sposób"
            ],
            "prawidlowa": 0,
            "wzor": "L=L₀/γ",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność L=L₀/γ i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność L=L₀/γ. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: równoległego do ruchu."
        },
        {
            "id": "wzgl-dno-11",
            "pytanie": "Zasada względności mówi, że prawa fizyki...",
            "odpowiedzi": [
                "mają tę samą postać w układach inercjalnych",
                "zmieniają się losowo",
                "obowiązują tylko na Ziemi"
            ],
            "prawidlowa": 0,
            "wzor": "zasada względności",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność zasada względności i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność zasada względności. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: mają tę samą postać w układach inercjalnych."
        },
        {
            "id": "wzgl-dno-12",
            "pytanie": "Wzrost prędkości do wartości bliskiej c powoduje γ...",
            "odpowiedzi": [
                "rosnące bez ograniczenia",
                "malejące do zera",
                "stałe równe 1"
            ],
            "prawidlowa": 0,
            "wzor": "γ→∞ dla v→c",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zanim wybierzesz odpowiedź, wypisz wielkości dane i szukaną. Następnie dobierz zależność γ→∞ dla v→c i sprawdź jednostkę wyniku.",
            "wyjasnienie": "Zastosuj zależność γ→∞ dla v→c. Po podstawieniu danych i wykonaniu potrzebnych przekształceń otrzymujesz poprawną odpowiedź: rosnące bez ograniczenia."
        }
    ],
    "fizyka_materialow": [
        {
            "pytanie": "Defekt sieci krystalicznej może zmienić właściwości materiału, ponieważ...",
            "odpowiedzi": [
                "Zmienia lokalne uporządkowanie i ruch nośników",
                "Zawsze zwiększa masę całej próbki dwukrotnie",
                "Usuwa wszystkie wiązania"
            ],
            "prawidlowa": 0,
            "wzor": "struktura mikroskopowa",
            "rozwiazanie": "Właściwości makroskopowe zależą od struktury i defektów na poziomie mikroskopowym.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Które zjawisko najlepiej wyjaśnia wzrost oporu metalu wraz z temperaturą?",
            "odpowiedzi": [
                "Silniejsze rozpraszanie elektronów na drganiach sieci",
                "Zmniejszenie liczby protonów",
                "Zanik pola elektrycznego"
            ],
            "prawidlowa": 0,
            "wzor": "model przewodnictwa",
            "rozwiazanie": "Wzrost drgań sieci krystalicznej zwiększa rozpraszanie nośników ładunku.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Materiał ma przewodność większą 100 razy od innego materiału. Przy takim samym polu i długości prąd w pierwszym materiale będzie...",
            "odpowiedzi": [
                "100 razy większy",
                "100 razy mniejszy",
                "Taki sam"
            ],
            "prawidlowa": 0,
            "wzor": "J=σE",
            "rozwiazanie": "Przy tym samym polu elektrycznym gęstość prądu jest proporcjonalna do przewodności.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "pytanie": "Drut wydłużono o 0,2 mm przy długości początkowej 2 m. Względne wydłużenie wynosi...",
            "odpowiedzi": [
                "1·10⁻⁴",
                "1·10⁻²",
                "1·10⁻⁶"
            ],
            "prawidlowa": 0,
            "wzor": "ε=ΔL/L₀",
            "rozwiazanie": "0,2 mm=2·10⁻⁴ m, więc ε=2·10⁻⁴/2=1·10⁻⁴.",
            "wskazowka": "Najpierw rozpoznaj model fizyczny, wypisz wielkości dane i szukaną, a dopiero potem wybierz zależność.",
            "poziom": 3,
            "obliczeniowe": true,
            "maturalne": true
        },
        {
            "id": "fizyka-materialow-5",
            "pytanie": "Pręt o długości 1,50 m i polu przekroju 2,0 mm² wydłużył się o 0,75 mm pod działaniem siły 240 N. Oblicz moduł Younga materiału.",
            "odpowiedzi": [
                "240 GPa",
                "120 GPa",
                "60 GPa"
            ],
            "prawidlowa": 0,
            "wzor": "E = FL/(AΔL)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Najpierw wyznacz naprężenie F/A i odkształcenie względne ΔL/L. Pamiętaj o zamianie mm² na m².",
            "wyjasnienie": "E = (F/A)/(ΔL/L) = FL/(AΔL). Po podstawieniu 240·1,50/(2,0·10⁻⁶·0,75·10⁻³) otrzymujemy 2,40·10¹¹ Pa = 240 GPa."
        },
        {
            "id": "fizyka-materialow-6",
            "pytanie": "Drut ma długość 2,0 m i pole przekroju 1,5 mm². Przy sile rozciągającej 150 N wydłuża się o 1,0 mm. Oblicz naprężenie w drucie.",
            "odpowiedzi": [
                "100 MPa",
                "10 MPa",
                "225 MPa"
            ],
            "prawidlowa": 0,
            "wzor": "σ = F/A",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Naprężenie nie zależy od długości drutu. Podziel siłę przez pole przekroju wyrażone w metrach kwadratowych.",
            "wyjasnienie": "A = 1,5·10⁻⁶ m². Zatem σ = 150/(1,5·10⁻⁶) = 1,0·10⁸ Pa = 100 MPa."
        },
        {
            "id": "fizyka-materialow-7",
            "pytanie": "Dwa pręty z tego samego materiału mają takie samo pole przekroju. Pierwszy jest dwa razy dłuższy od drugiego. Przy tej samej sile wydłużenie pierwszego będzie...",
            "odpowiedzi": [
                "dwa razy większe",
                "dwa razy mniejsze",
                "takie samo"
            ],
            "prawidlowa": 0,
            "wzor": "ΔL = FL/(AE)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": false,
            "wskazowka": "Porównaj tylko wielkości, które zmieniają się między prętami. Dla tego samego materiału i pola przekroju E oraz A są stałe.",
            "wyjasnienie": "Wydłużenie jest proporcjonalne do długości pręta: ΔL = FL/(AE). Dwukrotne zwiększenie L daje dwukrotnie większe wydłużenie."
        },
        {
            "id": "fizyka-materialow-8",
            "pytanie": "Pręt wydłuża się o 0,30 mm przy długości początkowej 0,75 m. Oblicz odkształcenie względne w zapisie naukowym.",
            "odpowiedzi": [
                "4,0·10⁻⁴",
                "2,5·10⁻⁴",
                "4,0·10⁻³"
            ],
            "prawidlowa": 0,
            "wzor": "ε = ΔL/L₀",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Zamień 0,30 mm na metry, a następnie podziel wydłużenie przez długość początkową.",
            "wyjasnienie": "0,30 mm = 3,0·10⁻⁴ m. Zatem ε = (3,0·10⁻⁴)/0,75 = 4,0·10⁻⁴."
        },
        {
            "id": "fizyka-materialow-9",
            "pytanie": "Materiał ma moduł Younga 70 GPa. Jakie naprężenie odpowiada odkształceniu sprężystemu 0,002?",
            "odpowiedzi": [
                "140 MPa",
                "35 MPa",
                "14 MPa"
            ],
            "prawidlowa": 0,
            "wzor": "σ = Eε",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "W zakresie sprężystym naprężenie jest proporcjonalne do odkształcenia. Pomnóż E przez ε.",
            "wyjasnienie": "σ = 70·10⁹·0,002 = 1,4·10⁸ Pa = 140 MPa."
        },
        {
            "id": "fizyka-materialow-10",
            "pytanie": "W doświadczeniu zwiększono siłę rozciągającą dwukrotnie, nie zmieniając materiału, długości ani pola przekroju. W zakresie sprężystym wydłużenie...",
            "odpowiedzi": [
                "wzrośnie dwukrotnie",
                "nie zmieni się",
                "wzrośnie czterokrotnie"
            ],
            "prawidlowa": 0,
            "wzor": "ΔL = FL/(AE)",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": false,
            "wskazowka": "Sprawdź, od którego parametru zależy liniowo wydłużenie w prawie Hooke'a dla pręta.",
            "wyjasnienie": "Przy stałych L, A i E wydłużenie jest wprost proporcjonalne do siły F. Podwojenie F podwaja ΔL."
        },
        {
            "id": "fizyka-materialow-11",
            "pytanie": "Pręt o długości 1,0 m i polu przekroju 4,0 mm² wydłuża się o 0,50 mm pod siłą 400 N. Oblicz jego sztywność osiową EA.",
            "odpowiedzi": [
                "8,0·10⁵ N",
                "8,0·10⁸ N",
                "2,0·10⁵ N"
            ],
            "prawidlowa": 0,
            "wzor": "F = EA·ΔL/L",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": true,
            "wskazowka": "Przekształć zależność na EA. Nie musisz osobno obliczać modułu Younga.",
            "wyjasnienie": "EA = FL/ΔL = 400·1,0/(0,50·10⁻³) = 8,0·10⁵ N. Zatem poprawna byłaby odpowiedź 8,0·10⁵ N."
        },
        {
            "id": "fizyka-materialow-12",
            "pytanie": "Wykres naprężenie–odkształcenie ma początkowo liniowy przebieg. Co oznacza nachylenie tej części wykresu?",
            "odpowiedzi": [
                "Moduł Younga",
                "Gęstość materiału",
                "Ciepło właściwe"
            ],
            "prawidlowa": 0,
            "wzor": "σ = Eε",
            "poziom": 3,
            "maturalne": true,
            "obliczeniowe": false,
            "wskazowka": "Porównaj równanie prostej σ = Eε z postacią y = ax.",
            "wyjasnienie": "W liniowym zakresie sprężystym współczynnik kierunkowy wykresu σ(ε) jest równy modułowi Younga E."
        }
    ]
};

const MATURA_OPEN_TASKS = [
    {
        "temat": "Trening maturalny — Grawitacja i astronomia",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Sonda o masie 500 kg znajduje się na orbicie kołowej wokół Ziemi. Jej prędkość orbitalna wynosi 7,8 km/s. Wyznacz promień orbity, przyjmując GM_Z = 3,99·10¹⁴ m³/s². Zapisz tok obliczeń i wynik w kilometrach.",
        "odpowiedz": "6553 km",
        "akceptowane": [
            "6553",
            "6,55·10^3 km",
            "6,55e3 km",
            "6550 km"
        ],
        "tolerancja": 0.02,
        "wzor": "v = √(GM/r)  ⇒  r = GM/v²",
        "wskazowka": "Najpierw przelicz prędkość na m/s. Zależność na prędkość orbitalną przekształć względem r, zanim podstawisz dane.",
        "wyjasnienie": "Z warunku ruchu po orbicie kołowej v² = GM/r. Stąd r = GM/v² = 3,99·10¹⁴/(7,8·10³)² ≈ 6,55·10⁶ m, czyli około 6550 km."
    },
    {
        "temat": "Trening maturalny — Optyka",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Soczewka skupiająca ma ogniskową 12 cm. Przedmiot umieszczono 30 cm od soczewki. Oblicz odległość obrazu od soczewki oraz podaj, czy obraz jest rzeczywisty czy pozorny.",
        "odpowiedz": "20 cm, rzeczywisty",
        "akceptowane": [
            "20 cm, rzeczywisty",
            "20 cm rzeczywisty",
            "20; rzeczywisty"
        ],
        "wzor": "1/f = 1/x + 1/y",
        "wskazowka": "Podstaw f = 12 cm i x = 30 cm. Wyznacz y, a następnie oceń znak i położenie obrazu.",
        "wyjasnienie": "1/y = 1/12 − 1/30 = 1/20, więc y = 20 cm. Dodatnie y oznacza obraz rzeczywisty po przeciwnej stronie soczewki."
    },
    {
        "temat": "Trening maturalny — Elektryczność i magnetyzm",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Opornik 6 Ω połączono szeregowo z nieznanym opornikiem. Cały obwód jest zasilany napięciem 18 V, a natężenie prądu wynosi 2 A. Oblicz opór nieznanego opornika i moc wydzielaną na oporniku 6 Ω.",
        "odpowiedz": "3 Ω; 24 W",
        "akceptowane": [
            "3 Ω; 24 W",
            "3 ohm; 24 W",
            "3Ω 24W",
            "3;24"
        ],
        "wzor": "R_z = U/I; R_x = R_z − R_1; P_1 = I²R_1",
        "wskazowka": "Najpierw oblicz opór zastępczy całego obwodu. Potem odejmij znany opór i osobno policz moc na oporniku 6 Ω.",
        "wyjasnienie": "R_z = 18/2 = 9 Ω. Dla połączenia szeregowego R_x = 9 − 6 = 3 Ω. Moc na pierwszym oporniku: P = I²R = 2²·6 = 24 W."
    },
    {
        "temat": "Trening maturalny — Fizyka atomowa i jądrowa",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Izotop ma okres półtrwania 8 h. Początkowa aktywność próbki wynosi 640 Bq. Po jakim czasie aktywność spadnie do 40 Bq? Zapisz liczbę przebytych okresów półtrwania.",
        "odpowiedz": "32 h, 4 okresy",
        "akceptowane": [
            "32 h, 4 okresy",
            "32 h 4 okresy",
            "32; 4"
        ],
        "wzor": "A = A₀(1/2)^n",
        "wskazowka": "Sprawdź kolejno: 640 → 320 → 160 → 80 → 40 Bq. Każde przejście odpowiada jednemu okresowi półtrwania.",
        "wyjasnienie": "Spadek z 640 Bq do 40 Bq oznacza cztery podwojenia mianownika: 640/2⁴ = 40. Czas wynosi więc 4·8 h = 32 h."
    },
    {
        "temat": "Trening maturalny — Teoria względności",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Statek porusza się względem Ziemi z prędkością 0,6c. Zegar na statku odmierza 5 lat czasu własnego. Oblicz czas mierzony przez obserwatora na Ziemi.",
        "odpowiedz": "6,25 roku",
        "akceptowane": [
            "6,25 roku",
            "6,25 r",
            "6.25 roku",
            "6.25"
        ],
        "tolerancja": 0.02,
        "wzor": "t = γτ, γ = 1/√(1−v²/c²)",
        "wskazowka": "Najpierw oblicz γ dla v = 0,6c. Następnie pomnóż czas własny przez γ.",
        "wyjasnienie": "γ = 1/√(1−0,6²) = 1/0,8 = 1,25. Zatem t = 1,25·5 lat = 6,25 roku."
    },
    {
        "temat": "Równanie Bernoulliego",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "W poziomej rurze ciecz przepływa ze stałym strumieniem. W szerszym odcinku prędkość wynosi 2,0 m/s, a ciśnienie 180 kPa. W zwężeniu prędkość wzrasta do 6,0 m/s. Przyjmij gęstość cieczy 1000 kg/m³. Oblicz ciśnienie w zwężeniu.",
        "odpowiedz": "164 kPa",
        "akceptowane": [
            "164 kPa",
            "164",
            "164000 Pa",
            "164000"
        ],
        "tolerancja": 0.5,
        "wzor": "p₁ + ½ρv₁² = p₂ + ½ρv₂²",
        "wskazowka": "Rura jest pozioma, więc składniki grawitacyjne się skracają. Zapisz równanie Bernoulliego dla obu przekrojów i wyznacz p₂.",
        "wyjasnienie": "p₂ = 180 kPa + ½·1000·(2² − 6²) Pa = 180 kPa − 16 kPa = 164 kPa."
    },
    {
        "temat": "Moment pędu",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Dysk ma moment bezwładności 0,80 kg·m² i obraca się z prędkością kątową 12 rad/s. Po zadziałaniu hamulca prędkość maleje jednostajnie do 4 rad/s w czasie 2,0 s. Oblicz średni moment siły hamującej.",
        "odpowiedz": "-3,2 N·m",
        "akceptowane": [
            "-3,2 N·m",
            "-3.2 N·m",
            "-3,2",
            "-3.2"
        ],
        "tolerancja": 0.05,
        "wzor": "τ = Iα,  α = (ω₂ − ω₁)/Δt",
        "wskazowka": "Najpierw wyznacz przyspieszenie kątowe, zachowując znak informujący o hamowaniu. Potem użyj τ = Iα.",
        "wyjasnienie": "α = (4−12)/2 = −4 rad/s². Zatem τ = 0,80·(−4) = −3,2 N·m. Znak minus oznacza moment przeciwny do ruchu."
    },
    {
        "temat": "Widmo elektromagnetyczne",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Promieniowanie ma długość fali 600 nm. Oblicz jego częstotliwość, przyjmując c = 3,00·10⁸ m/s. Zapisz wynik w Hz.",
        "odpowiedz": "5,0·10¹⁴ Hz",
        "akceptowane": [
            "5,0·10^14 Hz",
            "5e14 Hz",
            "5·10^14 Hz",
            "500000000000000 Hz"
        ],
        "tolerancja": 0.02,
        "wzor": "c = λf",
        "wskazowka": "Najpierw zamień 600 nm na metry. Następnie przekształć c = λf względem f.",
        "wyjasnienie": "f = c/λ = 3,00·10⁸/(600·10⁻⁹) = 5,0·10¹⁴ Hz."
    },
    {
        "temat": "Trening maturalny — Fizyka materiałów",
        "typ": "otwarte",
        "poziom": 3,
        "maturalne": true,
        "pytanie": "Pręt o długości 2,00 m wydłużył się o 1,2 mm pod wpływem naprężenia 120 MPa. Oblicz moduł Younga materiału i podaj wynik w GPa.",
        "odpowiedz": "200 GPa",
        "akceptowane": [
            "200 GPa",
            "200",
            "2,00e2 GPa"
        ],
        "tolerancja": 0.02,
        "wzor": "E = σ/ε,  ε = ΔL/L",
        "wskazowka": "Najpierw oblicz odkształcenie względne z ΔL/L. Pamiętaj, że 1,2 mm trzeba zapisać w metrach.",
        "wyjasnienie": "ε = 0,0012/2,00 = 6·10⁻⁴. E = 120·10⁶/(6·10⁻⁴) = 2·10¹¹ Pa = 200 GPa."
    }
];

export { MATURA_BANK, MATURA_OPEN_TASKS };
