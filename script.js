function rozszerzOdpowiedzi(pytanie) {
    if (!pytanie || !Array.isArray(pytanie.odpowiedzi) || pytanie.odpowiedzi.length >= 4) {
        return pytanie;
    }

    const poprawna = pytanie.odpowiedzi[pytanie.prawidlowa];
    const dodatkowe = [
        "Odpowiedź nie uwzględnia zależności z zadania",
        "Wynik jest poprawny tylko w innych jednostkach",
        "Ta odpowiedź pomija istotny warunek z treści"
    ];
    const rozszerzone = [...pytanie.odpowiedzi];

    dodatkowe.forEach(opcja => {
        if (!rozszerzone.includes(opcja)) {
            rozszerzone.push(opcja);
        }
    });

    return {
        ...pytanie,
        odpowiedzi: rozszerzone,
        prawidlowa: rozszerzone.indexOf(poprawna)
    };
}

const zadaniaTematyczne = {
    "Wykresy ruchu": [
        { pytanie: "Na wykresie s(t) odcinek poziomy oznacza, że ciało...", odpowiedzi: ["Spoczywa", "Porusza się najszybciej", "Ma największe przyspieszenie", "Zmienia kierunek ruchu"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Pole pod wykresem v(t) przedstawia...", odpowiedzi: ["Przemieszczenie", "Przyspieszenie", "Masę", "Ciśnienie"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Nachylenie wykresu v(t) informuje o...", odpowiedzi: ["Przyspieszeniu", "Drodze całkowitej", "Czasie trwania", "Mocy"], prawidlowa: 0, poziom: 2 },
        { pytanie: "Prędkość zmienia się liniowo od 4 do 16 m/s w 6 s. Jakie jest przyspieszenie?", odpowiedzi: ["2 m/s²", "12 m/s²", "20 m/s²", "4 m/s²"], prawidlowa: 0, hint: "a = Δv / Δt = (16 - 4) / 6", poziom: 2 },
        { pytanie: "Jeśli wykres v(t) przebiega poniżej osi czasu, przemieszczenie w tym przedziale jest...", odpowiedzi: ["Ujemne", "Zawsze równe zero", "Dodatnie niezależnie od wykresu", "Równe zero tylko w punkcie"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Dwa pola pod wykresem v(t) mają przeciwne znaki i tę samą wartość. Co wynika dla przemieszczenia?", odpowiedzi: ["Wypadkowe przemieszczenie wynosi zero", "Droga wynosi zero", "Przyspieszenie jest maksymalne", "Prędkość jest stała"], prawidlowa: 0, poziom: 3 }
    ],
    "Ruch względny": [
        { pytanie: "Pasażer siedzący w jadącym pociągu jest w spoczynku względem...", odpowiedzi: ["Pociągu", "Drzewa przy torach", "Księżyca zawsze", "Ziemi bezwzględnie"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Samochód A jedzie 20 m/s, a B w tym samym kierunku 12 m/s. Prędkość A względem B wynosi...", odpowiedzi: ["8 m/s", "32 m/s", "12 m/s", "-8 m/s"], prawidlowa: 0, hint: "v względem = vA - vB", poziom: 2 },
        { pytanie: "Dwa auta jadą naprzeciw siebie z 15 m/s i 10 m/s. Ich prędkość zbliżania wynosi...", odpowiedzi: ["25 m/s", "5 m/s", "150 m/s", "10 m/s"], prawidlowa: 0, hint: "v zbliżania = v₁ + v₂", poziom: 2 },
        { pytanie: "Czy ruch może być jednocześnie jednostajny dla jednego obserwatora i zmienny dla innego?", odpowiedzi: ["Tak, zależy od układu odniesienia", "Nie, ruch ma zawsze jedną prędkość", "Tak, tylko dla ciał niebieskich", "Nie, tylko prawo pows. działa"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Łódź płynie 4 m/s względem wody, a nurt ma 1 m/s zgodnie z jej ruchem. Prędkość względem brzegu to...", odpowiedzi: ["5 m/s", "3 m/s", "4 m/s", "1 m/s"], prawidlowa: 0, poziom: 2 },
        { pytanie: "Prędkość względna zależy przede wszystkim od...", odpowiedzi: ["Wybranego układu odniesienia", "Koloru poruszającego się ciała", "Jego temperatury zawsze", "Prawa pows. ciężkości"], prawidlowa: 0, poziom: 3 }
    ],
    "Droga, prędkość i czas": [
        { pytanie: "Jaki wzór pozwala obliczyć drogę w ruchu jednostajnym?", odpowiedzi: ["s = vt", "s = v/t", "s = t/v", "s = v²t"], prawidlowa: 0, hint: "s = v · t", poziom: 1 },
        { pytanie: "Pieszy idzie 1,5 m/s przez 4 minuty. Jaką drogę przejdzie?", odpowiedzi: ["360 m", "6 m", "90 m", "240 m"], prawidlowa: 0, hint: "s = 1,5 · 240", poziom: 2 },
        { pytanie: "Samochód pokonał 180 km w 2,5 h. Jaka była średnia prędkość?", odpowiedzi: ["72 km/h", "450 km/h", "45 km/h", "180 km/h"], prawidlowa: 0, hint: "vśr = s/t = 180/2,5", poziom: 2 },
        { pytanie: "Jeśli czas przejazdu skróci się o połowę przy tej samej drodze, średnia prędkość...", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się", "Wzrośnie o 50%"], prawidlowa: 0, poziom: 2 },
        { pytanie: "Dlaczego jednostkę km/h często zamieniamy na m/s przed obliczeniami?", odpowiedzi: ["Aby wielkości były w zgodnych jednostkach SI", "Bo km/h nie opisuje prędkości", "Aby zwiększyć dokładność liczby", "Bo w fizyce nie stosuję km/h"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Dwa odcinki pokonano z różnymi prędkościami. Czy średnia prędkość zawsze jest średnią arytmetyczną prędkości?", odpowiedzi: ["Nie, trzeba uwzględnić czasy trwania", "Tak, zawsze jest średnia arytmetyczna", "Tak, bo to tylko liczby", "Nie, średnia nie dotycza ruchu"], prawidlowa: 0, poziom: 3 }
    ],
    "Opóźnienie i hamowanie": [
        { pytanie: "Opóźnienie jest przyspieszeniem skierowanym przeciwnie do...", odpowiedzi: ["Prędkości", "Masy", "Czasu", "Siły ciężkości"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Auto jedzie 20 m/s i hamuje z a = -4 m/s². Po ilu sekundach się zatrzyma?", odpowiedzi: ["5 s", "80 s", "0,2 s", "20 s"], prawidlowa: 0, hint: "t = (v - v₀) / a = (0 - 20) / -4", poziom: 2 },
        { pytanie: "Droga hamowania rośnie z kwadratem prędkości. Dwukrotny wzrost prędkości oznacza drogę...", odpowiedzi: ["Cztery razy większą", "Dwa razy większą", "Taką samą", "O 100% większą"], prawidlowa: 0, poziom: 2 },
        { pytanie: "Czas reakcji kierowcy wpływa na drogę hamowania?", odpowiedzi: ["Wpływa na drogę przebytą przed rozpoczęciem hamowania", "Nie ma żadnego wpływu", "Zmienia masę auta", "Zmienia prawa fizyki"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Przyspieszenie równe zero oznacza, że ciało...", odpowiedzi: ["Ma stałą prędkość wektorową", "Zawsze stoi", "Zawsze hamuje", "Ma masę zerową"], prawidlowa: 0, poziom: 1 },
        { pytanie: "Dlaczego mokra nawierzchnia wydłuża drogę hamowania?", odpowiedzi: ["Zmniejsza tarcie i maksymalną siłę hamującą", "Zwiększa przyspieszenie grawitacyjne", "Zmniejsza masę auta", "Napierw zwiększa opór powietrza"], prawidlowa: 0, poziom: 3 }
    ],
    "Ruch jednostajny prostoliniowy": [
        { pytanie: "Rowerzysta jedzie ze stałą prędkością 6 m/s przez 45 s. Jaką drogę pokona?", odpowiedzi: ["270 m", "51 m", "7,5 m", "90 m"], prawidlowa: 0, hint: "s = v · t = 6 · 45" },
        { pytanie: "Samochód pokonał 1,2 km w 60 s. Jaka była jego średnia prędkość?", odpowiedzi: ["20 m/s", "72 m/s", "0,02 m/s", "12 m/s"], prawidlowa: 0, hint: "v = s / t = 1200 / 60" },
        { pytanie: "Dwa pojazdy jadą naprzeciw siebie z prędkościami 12 m/s i 8 m/s. Ich odległość wynosi 400 m. Po ilu sekundach się spotkają?", odpowiedzi: ["20 s", "50 s", "80 s", "25 s"], prawidlowa: 0, hint: "t = s / (v₁ + v₂) = 400 / 20" },
        { pytanie: "Na wykresie s(t) prosta ma nachylenie 4 m/s. Co oznacza ta wartość?", odpowiedzi: ["Prędkość wynosi 4 m/s", "Droga wynosi 4 m", "Czas wynosi 4 s", "Przyspieszenie wynosi 4 m/s²"], prawidlowa: 0, hint: "nachylenie = ds/dt" },
        { pytanie: "Pociąg jedzie 90 km/h przez 8 minut. Jaką drogę przejedzie?", odpowiedzi: ["12 km", "720 km", "1,5 km", "90 km"], prawidlowa: 0, hint: "s = v · t = 25 · 480" },
        { pytanie: "Który wykres v(t) opisuje ruch jednostajny?", odpowiedzi: ["Linia pozioma", "Linia rosnąca", "Krzywa malejąca", "Linia pionowa"], prawidlowa: 0, hint: "v = const" }
    ],
    "Ruch jednostajnie przyspieszony": [
        { pytanie: "Ciało rusza z v₀ = 2 m/s i ma a = 3 m/s². Jaką prędkość osiągnie po 4 s?", odpowiedzi: ["14 m/s", "12 m/s", "5 m/s", "6 m/s"], prawidlowa: 0, hint: "v = v₀ + a · t = 2 + 3 · 4" },
        { pytanie: "Samochód zwiększa prędkość z 10 do 25 m/s w 5 s. Oblicz przyspieszenie.", odpowiedzi: ["3 m/s²", "7 m/s²", "75 m/s²", "15 m/s²"], prawidlowa: 0, hint: "a = (v - v₀) / t = 15 / 5" },
        { pytanie: "Ciało rusza z miejsca z a = 2 m/s². Jaką drogę pokona w 6 s?", odpowiedzi: ["36 m", "12 m", "72 m", "18 m"], prawidlowa: 0, hint: "s = ½ · a · t² = ½ · 2 · 6²" },
        { pytanie: "Jeśli przyspieszenie ma wartość ujemną, a ciało porusza się zgodnie z osią, to ciało...", odpowiedzi: ["Zmniejsza prędkość", "Zawsze zmienia kierunek", "Ma stałą prędkość", "Przyspiesza zawsze"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Prędkość wzrosła o 18 m/s w czasie 3 s. Jakie było przyspieszenie?", odpowiedzi: ["6 m/s²", "54 m/s²", "0,17 m/s²", "9 m/s²"], prawidlowa: 0, hint: "a = Δv / Δt = 18 / 3" },
        { pytanie: "Pole pod wykresem v(t) oznacza...", odpowiedzi: ["Przebytą drogę", "Przyspieszenie", "Moc", "Objętość"], prawidlowa: 0, hint: "s = pole pod wykresem v(t)" }
    ],
    "Zasady Newtona": [
        { pytanie: "Na ciało o masie 4 kg działa wypadkowa siła 12 N. Oblicz przyspieszenie.", odpowiedzi: ["3 m/s²", "48 m/s²", "0,33 m/s²", "8 m/s²"], prawidlowa: 0, hint: "a = F / m = 12 / 4" },
        { pytanie: "Na skrzynię działają siły 30 N w prawo i 18 N w lewo. Jaka jest siła wypadkowa?", odpowiedzi: ["12 N w prawo", "48 N w prawo", "12 N w lewo", "18 N w lewo"], prawidlowa: 0, hint: "Fw = 30 - 18" },
        { pytanie: "Dlaczego pasażer pochyla się do przodu podczas nagłego hamowania autobusu?", odpowiedzi: ["Jego ciało zachowuje dotychczasowy ruch", "Działa na niego większa grawitacja", "Autobus go pchnie", "Jest to złudzenie optyczne"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Jaką siłę trzeba przyłożyć do masy 8 kg, aby nadać jej a = 2,5 m/s²?", odpowiedzi: ["20 N", "10,5 N", "3,2 N", "32 N"], prawidlowa: 0, hint: "F = m · a = 8 · 2,5" },
        { pytanie: "Para sił akcji i reakcji ma...", odpowiedzi: ["Równe wartości i przeciwne zwroty, ale działa na różne ciała", "Zawsze ten sam zwrot", "Różne wartości na tym samym ciele", "Takie same kierunki zawsze"], prawidlowa: 0, poziom: 3 },
        { pytanie: "Jeśli siła wypadkowa działająca na ciało wynosi zero, ciało może...", odpowiedzi: ["Spoczywać albo poruszać się ruchem jednostajnym", "Tylko przyspieszać", "Zawsze stać", "Nigdy się nie poruszać"], prawidlowa: 0, poziom: 2 }
    ]
};

const zadaniaUniwersalne = temat => [
    { pytanie: `Które zdanie najlepiej opisuje pojęcie „${temat}"?`, odpowiedzi: ["Opisuje konkretne zjawisko lub zależność fizyczną", "Jest jednostką bez znaczenia fizycznego", "Dotyczy tylko teorii", "To zawsze liczba bez znaczenia"], prawidlowa: 0, poziom: 2 },
    { pytanie: `W doświadczeniu dotyczącym „${temat}" wynik wynosi 24 w jednostce SI. Co należy sprawdzić?`, odpowiedzi: ["Wzór, jednostki i sens fizyczny wyniku", "Tylko ostatnią cyfrę", "Czy liczba jest parzysta", "Nic się nie sprawdza"], prawidlowa: 0, poziom: 2 },
    { pytanie: `W zadaniu o „${temat}" zmierzono wielkość dwa razy: 10 i 14. Jaka jest średnia?`, odpowiedzi: ["12", "24", "4", "14"], prawidlowa: 0, hint: "x̄ = (x₁ + x₂) / 2", poziom: 1 },
    { pytanie: `Jeżeli wszystkie dane w zadaniu o „${temat}" podwoimy, bez sprawdzenia wzoru możemy...`, odpowiedzi: ["Otrzymać błędny wynik, bo zależność może nie być liniowa", "Zawsze podwoić wynik", "Nic nie zmienić", "Zmienić go na połowę"], prawidlowa: 0, poziom: 3 },
    { pytanie: `Wybierz poprawną kolejność rozwiązania zadania o „${temat}".`, odpowiedzi: ["Dane i szukane → wzór → jednostki → obliczenia", "Obliczenia → zgadywanie wzoru → jeśli wyjdzie, OK", "Losowe liczby → liczymy → gotowe", "Nic się nie planuje"], prawidlowa: 0, poziom: 2 },
    { pytanie: `Który wniosek wymaga interpretacji, a nie samego podstawienia do wzoru dla tematu „${temat}"?`, odpowiedzi: ["Ocena, czy wynik zgadza się z przewidywanym zachowaniem układu", "Samo podstawienie liczb", "Użycie kalkulatora", "Przepisanie wyniku"], prawidlowa: 0, poziom: 3 },
    { pytanie: `Wartość 0,0045 km po przeliczeniu na metry wynosi...`, odpowiedzi: ["4,5 m", "45 m", "0,45 m", "450 m"], prawidlowa: 0, hint: "1 km = 1000 m", poziom: 1 },
    { pytanie: `Co oznacza jednostka wyniku w zadaniu fizycznym?`, odpowiedzi: ["Określa, jaką wielkość i w jakiej skali obliczono", "Jest ozdobnikiem", "Można ją zawsze pominąć", "Nie ma żadnego znaczenia"], prawidlowa: 0, poziom: 2 }
];

Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki).forEach(lekcje => {
    lekcje.forEach(lekcja => {
        lekcja.quiz = (zadaniaTematyczne[lekcja.temat] || zadaniaUniwersalne(lekcja.temat)).map((zadanie, index) => {
            const poprawione = rozszerzOdpowiedzi({
                ...zadanie,
                poziom: zadanie.poziom || (index < 2 ? 1 : index < 5 ? 2 : 3)
            });
            return poprawione;
        });
        lekcja.quiz.push(
            {
                pytanie: `Który wykres lub pomiar najlepiej pozwoli zbadać temat „${lekcja.temat}"?`,
                odpowiedzi: ["Pomiar wielkości związanych z badanym zjawiskiem", "Dowolna obserwacja bez danych", "Tylko odczyt temperatury", "Losowe zgadywanie"],
                prawidlowa: 0,
                poziom: 2
            },
            {
                pytanie: `Jeśli zmienimy jeden parametr w doświadczeniu dotyczącym „${lekcja.temat}", należy...`,
                odpowiedzi: ["Kontrolować pozostałe warunki i porównać wynik", "Zmienić wszystkie parametry naraz", "Pominąć jednostki", "Zmienić tylko kolor notatki"],
                prawidlowa: 0,
                poziom: 2
            },
            {
                pytanie: `Który wynik jest najbardziej wiarygodny dla tematu „${lekcja.temat}"?`,
                odpowiedzi: ["Zgodny ze wzorem, jednostką i przewidywanym zachowaniem", "Największy z możliwych", "Zaokrąglony bez sprawdzenia", "Najbardziej „ładnie" zapisany"],
                prawidlowa: 0,
                poziom: 3
            },
            {
                pytanie: `Co może być źródłem błędu podczas badania „${lekcja.temat}"?`,
                odpowiedzi: ["Niedokładny pomiar lub złe jednostki", "Samo zapisanie wyniku", "Użycie symbolu w równaniu", "Brak kolorów na wykresie"],
                prawidlowa: 0,
                poziom: 1
            }
        );
    });
}));

function pokazWynik() {
    document.querySelectorAll(".wynik-gracza").forEach(element => {
        element.textContent = wynikGracza;
    });
    document.getElementById("punkty-profilu").textContent = wynikGracza;
}

function showQuestion() {
    if (aktualnaPytanieIndex < aktualnaLiczbaPytan) {
        const dostepnePytania = aktualnePytania.filter(pytanie => !pokazanePytania.includes(pytanie));
        const pytanie = dostepnePytania.sort((pierwsze, drugie) => Math.abs(pierwsze.poziom - poziomAdaptacyjny) - Math.abs(drugie.poziom - poziomAdaptacyjny))[0] || aktualnePytania[aktualnaPytanieIndex];
        aktualnePytanie = pytanie;
        document.getElementById("quiz-pytanie").textContent = pytanie.pytanie;
        document.getElementById("numer-pytania").textContent = `Pytanie ${aktualnaPytanieIndex + 1} z ${aktualnaLiczbaPytan} • poziom ${pytanie.poziom}`;
        pokazPodpowiedz(pytanie);

        const odpowiedziDiv = document.getElementById("quiz-odpowiedzi");
        odpowiedziDiv.innerHTML = "";

        wymieszaj(pytanie.odpowiedzi.map((odpowiedz, index) => ({ odpowiedz, index }))).forEach(({ odpowiedz, index }) => {
            const btn = document.createElement("button");
            btn.className = "przycisk-odpowiedzi";
            btn.dataset.index = String(index);
            btn.textContent = odpowiedz;
            btn.addEventListener("click", () => {
                if (index === pytanie.prawidlowa) {
                    odpowiedziDiv.querySelectorAll("button").forEach(odpowiedz => odpowiedz.disabled = true);
                    btn.style.background = "#4CAF50";
                    btn.style.borderColor = "#4CAF50";
                    btn.style.color = "white";
                    pokazanePytania.push(pytanie);
                    seriaPoprawnych += 1;
                    seriaBlednych = 0;
                    if (seriaPoprawnych >= 2) poziomAdaptacyjny = Math.min(3, poziomAdaptacyjny + 1);
                    wynikGracza += 10;
                    magazynDanych().setItem(`fizyka-wynik-${aktywnyUzytkownik}`, wynikGracza);
                    pokazWynik();
                    ustawWizualnyPostep(((aktualnaPytanieIndex + 1) / aktualnaLiczbaPytan) * 100);
                    ustawPostep(aktualnyPakiet, ((aktualnaPytanieIndex + 1) / aktualnaLiczbaPytan) * 100);
                    setTimeout(() => {
                        aktualnaPytanieIndex++;
                        showQuestion();
                    }, 900);
                } else {
                    seriaBlednych += 1;
                    seriaPoprawnych = 0;
                    if (seriaBlednych >= 1) poziomAdaptacyjny = Math.max(1, poziomAdaptacyjny - 1);
                    btn.style.background = "#f44336";
                    btn.style.borderColor = "#f44336";
                    btn.style.color = "white";
                    const podpowiedz = document.getElementById("podpowiedz-quizu");
                    podpowiedz.hidden = false;
                    podpowiedz.textContent = "Błędna odpowiedź — popraw ją, żeby przejść dalej.";
                }
            });
            odpowiedziDiv.appendChild(btn);
        });
    } else {
        endQuiz();
    }
}

function wyswietlLekcje(podnagalek) {
    aktualnyPodnagalek = podnagalek;
    const dzial = baza[aktualnyDzial];
    const lekcje = dzial.podnagalowki[podnagalek];
    const nazwaMapy = podnagalek === "ruch_obrotowy" ? "Ruch obrotowy" : podnagalek.charAt(0).toUpperCase() + podnagalek.slice(1);
    document.getElementById("nazwa-lekcji").textContent = nazwaMapy;

    const kolkaDiv = document.getElementById("kolka-lekcji");
    kolkaDiv.innerHTML = "";

    for (let index = 0; index < lekcje.length; index += lekcjiWKole) {
        const pakiet = lekcje.slice(index, index + lekcjiWKole);
        const btn = document.createElement("button");
        const numerLekcji = index / lekcjiWKole;
        const odblokowany = numerLekcji === 0 || pobierzPostep(lekcje.slice(index - 1, index)) === 100;
        const postepPakietu = pobierzPostep(pakiet);
        btn.className = "kolko-lekcji";
        btn.innerHTML = `<span class="kolko-numer">${postepPakietu === 100 ? "✓" : numerLekcji + 1}</span><span class="kolko-podpis"></span>`;
        btn.querySelector(".kolko-podpis").textContent = pakiet[0].temat;
        btn.style.setProperty("--przesuniecie", `${Math.round(Math.sin(numerLekcji * 0.9) * 60)}px`);
        btn.classList.toggle("ukonczona", postepPakietu === 100);
        btn.classList.toggle("aktualna", odblokowany && postepPakietu < 100);
        btn.title = pakiet[0].temat;
        btn.style.setProperty("--postep", `${pobierzPostep(pakiet)}%`);
        btn.disabled = !odblokowany;
        btn.classList.toggle("zablokowane", !odblokowany);
        if (!odblokowany) {
            btn.title = "Ukończ poprzednią lekcję, aby odblokować tę lekcję";
            btn.setAttribute("aria-label", "Zablokowana lekcja");
        } else {
            btn.addEventListener("click", () => startQuiz(pakiet, btn));
        }
        kolkaDiv.appendChild(btn);
    }
}

function pokazPodpowiedz(pytanie) {
    const podpowiedziDiv = document.getElementById("podpowiedz-quizu");
    if (!podpowiedziDiv) return;
    
    if (pytanie.hint) {
        podpowiedziDiv.textContent = pytanie.hint;
    } else {
        podpowiedziDiv.textContent = "Przeanalizuj treść zadania.";
    }
    podpowiedziDiv.hidden = true;
}
