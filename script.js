// Ekrany
const ekranDialow = document.getElementById("ekran-dialow");
const ekranPodnagalowkow = document.getElementById("ekran-podnagalowkow");
const ekranLekcji = document.getElementById("ekran-lekcji");
const ekranQuizu = document.getElementById("ekran-quizu");
const ekranLogowania = document.getElementById("ekran-logowania");
const ekranStartowy = document.getElementById("ekran-startowy");
const ekranDoswiadczen = document.getElementById("ekran-doswiadczen");

let aktualnyDzial = null;
let aktualnyPodnagalek = null;
let aktualnaPytanieIndex = 0;
let aktualnaLekcja = null;
let aktualnyPrzyciskLekcji = null;
let aktualnyPakiet = [];
let aktualnePytania = [];
let profilUcznia = null;
let lekcjiWKole = 2;
let aktywnyUzytkownik = localStorage.getItem("fizyka-aktywny-uzytkownik") || "";
let wynikGracza = Number(localStorage.getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
let poziomAdaptacyjny = 2;
let seriaPoprawnych = 0;
let seriaBlednych = 0;
let pokazanePytania = [];
let aktualnePytanie = null;
let aktualnaLiczbaPytan = 10;

// Baza danych - 9 głównych działów
const baza = {
    termodynamika: {
        emoji: "⚙️",
        nazwa: "Termodynamika",
        podnagalowki: {
            temperatura: [
                { temat: "Skale temperatur", quiz: [{ pytanie: "Jaka jest jednostka temperatury w SI?", odpowiedzi: ["Kelwin", "Celsius", "Fahrenheit"], prawidlowa: 0 }] },
                { temat: "Pomiar temperatury", quiz: [{ pytanie: "Co to jest termometr?", odpowiedzi: ["Przyrząd do pomiaru temp.", "Urządzenie do ogrzewania", "Gazowy zbiornik"], prawidlowa: 0 }] }
            ],
            energia: [
                { temat: "Energia cieplna", quiz: [{ pytanie: "Jaki jest wzór na energię cieplną?", odpowiedzi: ["Q = mcΔT", "Q = mv²/2", "Q = mgh"], prawidlowa: 0 }] },
                { temat: "Praca i energia", quiz: [{ pytanie: "Jaka jest jednostka pracy?", odpowiedzi: ["Dżul", "Watt", "Newton"], prawidlowa: 0 }] }
            ]
        }
    },
    mechanika: {
        emoji: "🏃",
        nazwa: "Mechanika",
        podnagalowki: {
            kinematyka: [
                { temat: "Ruch jednostajny prostoliniowy", quiz: [{ pytanie: "Jaka jest prędkość przy ruchu jednostajnym?", odpowiedzi: ["Stała", "Zmienna", "Zerowa"], prawidlowa: 0 }] },
                { temat: "Ruch jednostajnie przyspieszony", quiz: [{ pytanie: "Co to jest przyspieszenie?", odpowiedzi: ["Zmiana prędkości w czasie", "Szybkość", "Siła"], prawidlowa: 0 }] },
                { temat: "Prędkość i przyspieszenie", quiz: [{ pytanie: "Jaka jest jednostka przyspieszenia?", odpowiedzi: ["m/s²", "m/s", "m"], prawidlowa: 0 }] },
                { temat: "Wykresy ruchu", quiz: [] },
                { temat: "Ruch względny", quiz: [] },
                { temat: "Droga, prędkość i czas", quiz: [] },
                { temat: "Opóźnienie i hamowanie", quiz: [] }
            ],
            dynamika: [
                { temat: "Zasady Newtona", quiz: [{ pytanie: "Ile jest zasad dynamiki?", odpowiedzi: ["Trzy", "Cztery", "Dwie"], prawidlowa: 0 }] },
                { temat: "Siła tarcia", quiz: [{ pytanie: "Czym jest siła tarcia?", odpowiedzi: ["Siła oporu ruchu", "Siła dośrodkowa", "Siła grawitacji"], prawidlowa: 0 }] }
            ],
            statyka: [
                { temat: "Równowaga ciał", quiz: [{ pytanie: "Kiedy ciało jest w równowadze?", odpowiedzi: ["Gdy suma sił = 0", "Gdy się porusza", "Gdy działa siła"], prawidlowa: 0 }] },
                { temat: "Moment siły", quiz: [{ pytanie: "Co to jest moment siły?", odpowiedzi: ["Iloczyn siły i ramienia", "Siła podzielona przez czas", "Energia"], prawidlowa: 0 }] }
            ],
            ruch_obrotowy: [
                { temat: "Prędkość kątowa", quiz: [{ pytanie: "Koło wykonuje 5 pełnych obrotów w 10 s. Jaka jest jego prędkość kątowa?", odpowiedzi: ["π rad/s", "0,5 rad/s", "10π rad/s"], prawidlowa: 0 }] },
                { temat: "Ruch po okręgu", quiz: [{ pytanie: "Punkt porusza się po okręgu o promieniu 0,5 m z ω = 4 rad/s. Oblicz prędkość liniową.", odpowiedzi: ["2 m/s", "8 m/s", "0,125 m/s"], prawidlowa: 0 }] },
                { temat: "Przyspieszenie dośrodkowe", quiz: [{ pytanie: "Dla v = 6 m/s i r = 3 m przyspieszenie dośrodkowe wynosi:", odpowiedzi: ["12 m/s²", "2 m/s²", "18 m/s²"], prawidlowa: 0 }] },
                { temat: "Moment pędu", quiz: [{ pytanie: "Punkt materialny ma pęd 4 kg·m/s i ramię 0,5 m prostopadłe do pędu. Jaki ma moment pędu?", odpowiedzi: ["2 kg·m²/s", "8 kg·m²/s", "4,5 kg·m²/s"], prawidlowa: 0 }] }
            ],
            grawitacja: [
                { temat: "Prawo powszechnego ciążenia", quiz: [] },
                { temat: "Energia w polu grawitacyjnym", quiz: [] },
                { temat: "Prędkość ucieczki", quiz: [] }
            ],
            mechanika_plynow: [
                { temat: "Ciśnienie hydrostatyczne", quiz: [] },
                { temat: "Prawo Archimedesa", quiz: [] },
                { temat: "Równanie Bernoulliego", quiz: [] }
            ]
        }
    },
    elektromagnetyzm: {
        emoji: "⚡",
        nazwa: "Elektromagnetyzm",
        podnagalowki: {
            elektrostatyka: [
                { temat: "Ładunek elektryczny", quiz: [{ pytanie: "Jaka jest jednostka ładunku?", odpowiedzi: ["Kulomb", "Amper", "Wolt"], prawidlowa: 0 }] },
                { temat: "Pole elektryczne", quiz: [{ pytanie: "Jak wyraża się pole elektryczne?", odpowiedzi: ["E = F/q", "E = U·q", "E = I/q"], prawidlowa: 0 }] }
            ],
            prad: [
                { temat: "Prąd elektryczny", quiz: [{ pytanie: "Jaka jest jednostka prądu?", odpowiedzi: ["Amper", "Wolt", "Ohm"], prawidlowa: 0 }] },
                { temat: "Napięcie i opór", quiz: [{ pytanie: "Jakie jest prawo Ohma?", odpowiedzi: ["U = I·R", "U = I/R", "U = I+R"], prawidlowa: 0 }] }
            ],
            magnetyzm: [
                { temat: "Pole magnetyczne", quiz: [{ pytanie: "Jaka jest jednostka pola magnetycznego?", odpowiedzi: ["Tesla", "Weber", "Henry"], prawidlowa: 0 }] },
                { temat: "Siła Lorentza", quiz: [{ pytanie: "Wzór siły Lorentza to:", odpowiedzi: ["F = qv × B", "F = qvB + I", "F = qE/B"], prawidlowa: 0 }] }
            ]
        }
    },
    fale_drgania: {
        emoji: "〰️",
        nazwa: "Fale i Drgania",
        podnagalowki: {
            drgania: [
                { temat: "Ruch harmoniczny", quiz: [{ pytanie: "Jaki jest wzór ruchu harmonicznego?", odpowiedzi: ["x = A sin(ωt)", "x = A cos(v·t)", "x = v·t²/2"], prawidlowa: 0 }] },
                { temat: "Amplituda i okres", quiz: [{ pytanie: "Co to jest amplituda?", odpowiedzi: ["Maksymalne wychylenie", "Czas pełnego cyklu", "Szybkość drgań"], prawidlowa: 0 }] }
            ],
            fale_mechaniczne: [
                { temat: "Równanie fali", quiz: [{ pytanie: "Jaki jest związek v, λ i f?", odpowiedzi: ["v = λ·f", "v = λ/f", "v = λ+f"], prawidlowa: 0 }] },
                { temat: "Rodzaje fal", quiz: [{ pytanie: "Falami poprzecznymi są:", odpowiedzi: ["Fale świetlne", "Fale dźwiękowe", "Fale sejsmiczne"], prawidlowa: 0 }] }
            ],
            optyka_falowa: [
                { temat: "Interferencja światła", quiz: [{ pytanie: "Interferencja występuje gdy:", odpowiedzi: ["Fale się nakładają", "Fale się odbijają", "Fale przechodzą otworem"], prawidlowa: 0 }] },
                { temat: "Dyfrakcja", quiz: [{ pytanie: "Dyfrakcja to:", odpowiedzi: ["Ugięcie fali przy przeszkodzie", "Odbicie fali", "Pochłanianie fali"], prawidlowa: 0 }] }
            ],
            akustyka: [
                { temat: "Prędkość dźwięku", quiz: [{ pytanie: "Jaka jest przybliżona prędkość dźwięku w powietrzu?", odpowiedzi: ["343 m/s", "150 m/s", "1000 m/s"], prawidlowa: 0 }] },
                { temat: "Częstotliwość dźwięku", quiz: [{ pytanie: "Jaka jest jednostka częstotliwości?", odpowiedzi: ["Herc", "Decybel", "Sekunda"], prawidlowa: 0 }] }
            ]
        }
    },
    optyka: {
        emoji: "💡",
        nazwa: "Optyka",
        podnagalowki: {
            optyka_geometryczna: [
                { temat: "Prawo odbicia", quiz: [{ pytanie: "Jaki jest warunek prawa odbicia?", odpowiedzi: ["Kąt padania = kąt odbicia", "Kąt padania > kąt odbicia", "Kąt padania < kąt odbicia"], prawidlowa: 0 }] },
                { temat: "Prawo załamania", quiz: [{ pytanie: "Prawo Snelliusa to:", odpowiedzi: ["n₁·sin(θ₁) = n₂·sin(θ₂)", "n₁·θ₁ = n₂·θ₂", "n₁/θ₁ = n₂/θ₂"], prawidlowa: 0 }] }
            ],
            soczewki: [
                { temat: "Soczewka skupiająca", quiz: [{ pytanie: "Ogniskowa soczewki skupiającej jest:", odpowiedzi: ["Dodatnia", "Ujemna", "Równa zeru"], prawidlowa: 0 }] },
                { temat: "Soczewka rozpraszająca", quiz: [{ pytanie: "Soczewka rozpraszająca tworzy obraz:", odpowiedzi: ["Pozorny", "Rzeczywisty", "Odwrócony"], prawidlowa: 0 }] }
            ]
        }
    },
    mechanika_kwantowa_jadrowa: {
        emoji: "⚛️",
        nazwa: "Mechanika Kwantowa i Fizyka Jądrowa",
        podnagalowki: {
            podstawy_kwantowe: [
                { temat: "Zasada nieoznaczoności", quiz: [{ pytanie: "Co mówi zasada nieoznaczoności?", odpowiedzi: ["Nie można jednocześnie dokładnie znać pęd i położenie", "Energia jest zawsze nieokreślona", "Czas zawsze się zmienia"], prawidlowa: 0 }] },
                { temat: "Funkcja falowa", quiz: [{ pytanie: "Co reprezentuje |ψ|²?", odpowiedzi: ["Gęstość prawdopodobieństwa", "Energię cząstki", "Pęd cząstki"], prawidlowa: 0 }] }
            ],
            fizyka_jadrowa: [
                { temat: "Budowa jądra", quiz: [{ pytanie: "Jądro zbudowane jest z:", odpowiedzi: ["Protonów i neutronów", "Protonów i elektronów", "Neutronów i elektronów"], prawidlowa: 0 }] },
                { temat: "Radioaktywność", quiz: [{ pytanie: "Rozpad alfa to emisja:", odpowiedzi: ["Jądra helu (He-4)", "Elektronu", "Fot"], prawidlowa: 0 }] }
            ]
        }
    },
    teoria_wzglednosci: {
        emoji: "🚀",
        nazwa: "Teoria Względności",
        podnagalowki: {
            szczegolna: [
                { temat: "Względność szczególna", quiz: [{ pytanie: "Jaki jest slynny wzór Einsteina?", odpowiedzi: ["E = mc²", "E = ½mv²", "E = U·q"], prawidlowa: 0 }] },
                { temat: "Dylatacja czasu", quiz: [{ pytanie: "Dylatacja czasu oznacza:", odpowiedzi: ["Powolniejszy upływ czasu przy wysokich prędkościach", "Szybszy upływ czasu", "Brak zmiany czasu"], prawidlowa: 0 }] }
            ],
            ogolna: [
                { temat: "Grawitacja", quiz: [{ pytanie: "Grawitacja w ogólnej teorii względności to:", odpowiedzi: ["Krzywizna czasoprzestrzeni", "Siła przyciągająca masy", "Ruch przyśpieszony"], prawidlowa: 0 }] },
                { temat: "Czarna dziura", quiz: [{ pytanie: "Czarna dziura ma horyzont zdarzeń, za którym:", odpowiedzi: ["Nic nie może uciec", "Wszystko jest widoczne", "Czas staje się jawnością"], prawidlowa: 0 }] }
            ]
        }
    },
    fizyka_materialow: {
        emoji: "🧪",
        nazwa: "Fizyka Materiałów",
        podnagalowki: {
            struktury_krystaliczne: [
                { temat: "Struktury krystaliczne", quiz: [{ pytanie: "Kryształ to:", odpowiedzi: ["Uporządkowany układ atomów", "Losowy układ atomów", "Struktura amorficzna"], prawidlowa: 0 }] },
                { temat: "Sieci przestrzenne", quiz: [{ pytanie: "Najprostsza sieć to:", odpowiedzi: ["Sieć kubiczna", "Sieć heksagonalna", "Sieć ortorombowa"], prawidlowa: 0 }] }
            ],
            wlasciwosci: [
                { temat: "Twardość materiału", quiz: [{ pytanie: "Twardość materiału zależy od:", odpowiedzi: ["Wiązań chemicznych", "Tylko masy", "Tylko objętości"], prawidlowa: 0 }] },
                { temat: "Przewodnictwo", quiz: [{ pytanie: "Przewodniki elektryczne zawierają:", odpowiedzi: ["Swobodne elektrony", "Brak elektronów", "Tylko jądra"], prawidlowa: 0 }] }
            ]
        }
    },
    astronomia: {
        emoji: "🌌",
        nazwa: "Astronomia",
        podnagalowki: {
            ciala_niebieskie: [
                { temat: "Gwiazdy", quiz: [{ pytanie: "Gwiazdy świecą dzięki:", odpowiedzi: ["Fuzji jądrowej", "Spalaniu paliwa", "Refleksji światła"], prawidlowa: 0 }] },
                { temat: "Planety", quiz: [{ pytanie: "Ile planet okrąża nasze Słońce?", odpowiedzi: ["8", "9", "10"], prawidlowa: 0 }] }
            ],
            ruchy_orbitalne: [
                { temat: "Prawa Keplera", quiz: [{ pytanie: "Orbita planet to:", odpowiedzi: ["Elipsa", "Koło", "Parabola"], prawidlowa: 0 }] },
                { temat: "Gravitacja", quiz: [{ pytanie: "Prawo powszechnej grawitacji to:", odpowiedzi: ["F = Gm₁m₂/r²", "F = m·a", "F = k·x"], prawidlowa: 0 }] }
            ]
        }
    }
};

// Dodatkowe ścieżki rozwijają bazę bez zmiany istniejących działów.
baza.termodynamika.podnagalowki.przemiany_gazowe = [
    { temat: "Przemiany gazowe", quiz: [] },
    { temat: "Równanie gazu doskonałego", quiz: [] },
    { temat: "Ciepło właściwe", quiz: [] }
];
baza.elektromagnetyzm.podnagalowki.obwody_pradu = [
    { temat: "Łączenie oporników", quiz: [] },
    { temat: "Moc prądu", quiz: [] },
    { temat: "Prawo Kirchhoffa", quiz: [] }
];
baza.optyka.podnagalowki.przyrzady_optyczne = [
    { temat: "Zwierciadła sferyczne", quiz: [] },
    { temat: "Soczewki i powiększenie", quiz: [] },
    { temat: "Oko jako układ optyczny", quiz: [] }
];
baza.astronomia.podnagalowki.astrofizyka = [
    { temat: "Jasność i odległość gwiazd", quiz: [] },
    { temat: "Widma gwiazd", quiz: [] },
    { temat: "Ewolucja gwiazd", quiz: [] }
];
baza.fale_drgania.podnagalowki.fale_elektromagnetyczne = [
    { temat: "Widmo elektromagnetyczne", quiz: [] },
    { temat: "Polaryzacja światła", quiz: [] },
    { temat: "Efekt Dopplera", quiz: [] }
];
baza.mechanika_kwantowa_jadrowa.podnagalowki.fizyka_czastek = [
    { temat: "Dualizm korpuskularno-falowy", quiz: [] },
    { temat: "Model Bohra", quiz: [] },
    { temat: "Cząstki elementarne", quiz: [] }
];

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

const zadaniaUniwersalne = temat => [
    { pytanie: `Które zdanie najlepiej opisuje pojęcie „${temat}”?`, odpowiedzi: ["Opisuje konkretne zjawisko lub zależność fizyczną", "Jest jednostką bez znaczenia fizycznego", "Dotyczy wyłącznie chemii"], prawidlowa: 0, poziom: 1 },
    { pytanie: `W doświadczeniu dotyczącym „${temat}” wynik wynosi 24 w jednostce SI. Co należy sprawdzić?`, odpowiedzi: ["Wzór, jednostki i sens fizyczny wyniku", "Tylko ostatnią cyfrę", "Czy wynik jest parzysty"], prawidlowa: 0, wzor: "Dane → wzór → podstawienie → jednostka", poziom: 1 },
    { pytanie: `W zadaniu o „${temat}” zmierzono wielkość dwa razy: 10 i 14. Jaka jest średnia?`, odpowiedzi: ["12", "24", "4"], prawidlowa: 0, wzor: "x̄ = (x₁ + x₂) / 2", poziom: 1 },
    { pytanie: `Jeżeli wszystkie dane w zadaniu o „${temat}” podwoimy, bez sprawdzenia wzoru możemy...`, odpowiedzi: ["Otrzymać błędny wynik, bo zależność może nie być liniowa", "Zawsze otrzymać wynik podwojony", "Zawsze otrzymać zero"], prawidlowa: 0, wzor: "Najpierw określ zależność między wielkościami", poziom: 2 },
    { pytanie: `Wybierz poprawną kolejność rozwiązania zadania o „${temat}”.`, odpowiedzi: ["Dane i szukane → wzór → jednostki → obliczenia", "Obliczenia → zgadywanie wzoru → jednostki", "Odpowiedź → dane → wzór"], prawidlowa: 0, wzor: "Dane → szukane → wzór → podstawienie", poziom: 2 },
    { pytanie: `Który wniosek wymaga interpretacji, a nie samego podstawienia do wzoru dla tematu „${temat}”?`, odpowiedzi: ["Ocena, czy wynik zgadza się z przewidywanym zachowaniem układu", "Przepisanie danych", "Zamiana przecinka na kropkę"], prawidlowa: 0, wzor: "Porównaj wynik z modelem i warunkami zadania", poziom: 3 },
    { pytanie: `Wartość 0,0045 km po przeliczeniu na metry wynosi...`, odpowiedzi: ["4,5 m", "45 m", "0,45 m"], prawidlowa: 0, wzor: "1 km = 1000 m", poziom: 1 },
    { pytanie: `Co oznacza jednostka wyniku w zadaniu fizycznym?`, odpowiedzi: ["Określa, jaką wielkość i w jakiej skali obliczono", "Jest ozdobnikiem", "Można ją zawsze pominąć"], prawidlowa: 0, wzor: "Wielkość fizyczna = liczba · jednostka", poziom: 1 }
];

const doswiadczeniaDzialow = {
    mechanika: "Ruch auta i ruch po okręgu",
    termodynamika: "Ogrzewanie i zmiana temperatury",
    elektromagnetyzm: "Obwód i natężenie prądu",
    fale_drgania: "Fala i jej częstotliwość",
    optyka: "Odbicie światła",
    mechanika_kwantowa_jadrowa: "Eksperyment z prawdopodobieństwem",
    teoria_wzglednosci: "Zegar w ruchu",
    fizyka_materialow: "Rozciąganie materiału",
    astronomia: "Orbita planety"
};

Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki).forEach(lekcje => {
    lekcje.forEach(lekcja => {
        lekcja.quiz = (zadaniaTematyczne[lekcja.temat] || zadaniaUniwersalne(lekcja.temat)).map((zadanie, index) => ({
            ...zadanie,
            poziom: zadanie.poziom || (index < 2 ? 1 : index < 5 ? 2 : 3)
        }));
        lekcja.quiz.push(
            {
                pytanie: `Który wykres lub pomiar najlepiej pozwoli zbadać temat „${lekcja.temat}”?`,
                odpowiedzi: ["Pomiar wielkości związanych z badanym zjawiskiem", "Dowolna obserwacja bez danych", "Tylko odczyt temperatury"],
                prawidlowa: 0,
                poziom: 2
            },
            {
                pytanie: `Jeśli zmienimy jeden parametr w doświadczeniu dotyczącym „${lekcja.temat}”, należy...`,
                odpowiedzi: ["Kontrolować pozostałe warunki i porównać wynik", "Zmienić wszystkie parametry naraz", "Pominąć jednostki"],
                prawidlowa: 0,
                poziom: 2
            },
            {
                pytanie: `Który wynik jest najbardziej wiarygodny dla tematu „${lekcja.temat}”?`,
                odpowiedzi: ["Zgodny ze wzorem, jednostką i przewidywanym zachowaniem", "Największy z możliwych", "Zaokrąglony bez sprawdzenia"],
                prawidlowa: 0,
                poziom: 3
            },
            {
                pytanie: `Co może być źródłem błędu podczas badania „${lekcja.temat}”?`,
                odpowiedzi: ["Niedokładny pomiar lub złe jednostki", "Samo zapisanie wyniku", "Użycie symbolu w równaniu"],
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
}

async function przywrocSesje() {
    if (!aktywnyUzytkownik) return;
    try {
        const zapisanyProfil = await znajdzUzytkownika(aktywnyUzytkownik);
        if (zapisanyProfil) {
            ekranLogowania.style.display = "none";
            ekranStartowy.style.display = "block";
            wynikGracza = Number(localStorage.getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
            pokazWynik();
        }
    } catch {
        ekranLogowania.style.display = "block";
    }
}

document.getElementById("wyloguj-uzytkownika").addEventListener("click", () => {
    localStorage.removeItem("fizyka-aktywny-uzytkownik");
    aktywnyUzytkownik = "";
    ekranDialow.style.display = "none";
    ekranLogowania.style.display = "block";
    ekranStartowy.style.display = "none";
});

function aktualizujSamochod() {
    const czas = Number(document.getElementById("czas-doswiadczenia").value);
    const predkosc = Number(document.getElementById("predkosc-doswiadczenia").value);
    const droga = Number(document.getElementById("droga-doswiadczenia").value);
    const drogaObliczona = predkosc * czas;
    const predkoscObliczona = czas === 0 ? 0 : droga / czas;
    document.getElementById("czas-wartosc").value = czas;
    document.getElementById("czas-wartosc").textContent = czas.toFixed(1);
    document.getElementById("predkosc-wartosc").textContent = predkosc;
    document.getElementById("droga-wartosc").textContent = droga;
    document.getElementById("droga-obliczona").textContent = drogaObliczona.toFixed(1);
    document.getElementById("predkosc-obliczona").textContent = predkoscObliczona.toFixed(1);
    document.getElementById("samochod").style.transform = `translateX(${Math.min(92, drogaObliczona / 1.2)}%)`;
}

function aktualizujOkrazenie() {
    const promien = Number(document.getElementById("promien-doswiadczenia").value);
    const omega = Number(document.getElementById("omega-doswiadczenia").value);
    const punkt = document.getElementById("punkt-okrazenia");
    document.getElementById("promien-wartosc").textContent = promien;
    document.getElementById("omega-wartosc").textContent = omega.toFixed(1);
    punkt.style.setProperty("--promien", `${promien}px`);
    punkt.style.setProperty("--omega", `${omega}s`);
}

["czas-doswiadczenia", "predkosc-doswiadczenia", "droga-doswiadczenia"].forEach(id => {
    document.getElementById(id).addEventListener("input", aktualizujSamochod);
});
["promien-doswiadczenia", "omega-doswiadczenia"].forEach(id => {
    document.getElementById(id).addEventListener("input", aktualizujOkrazenie);
});

document.getElementById("otworz-doswiadczenia").addEventListener("click", () => {
    ekranDialow.style.display = "none";
    ekranDoswiadczen.hidden = false;
    aktualizujSamochod();
    aktualizujOkrazenie();
});

document.getElementById("zamknij-doswiadczenia").addEventListener("click", () => {
    ekranDoswiadczen.hidden = true;
    ekranDialow.style.display = "block";
});

function otworzBazeUzytkownikow() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("fizyka-baza", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("uzytkownicy", { keyPath: "nazwa" });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function znajdzUzytkownika(nazwa) {
    const bazaUzytkownikow = await otworzBazeUzytkownikow();
    return new Promise((resolve, reject) => {
        const request = bazaUzytkownikow.transaction("uzytkownicy", "readonly").objectStore("uzytkownicy").get(nazwa);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function zapiszUzytkownika(uzytkownik) {
    const bazaUzytkownikow = await otworzBazeUzytkownikow();
    return new Promise((resolve, reject) => {
        const request = bazaUzytkownikow.transaction("uzytkownicy", "readwrite").objectStore("uzytkownicy").put(uzytkownik);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
    });
}

function prostySkrót(tekst) {
    return Array.from(tekst).reduce((suma, znak) => ((suma * 31) + znak.charCodeAt(0)) >>> 0, 7).toString(16);
}

async function zalogujUzytkownika(nazwa, haslo) {
    const skrótHasla = prostySkrót(haslo);
    const zapisanyProfil = await znajdzUzytkownika(nazwa);
    const staryProfil = JSON.parse(localStorage.getItem("fizyka-profil") || "null");
    if (zapisanyProfil && zapisanyProfil.haslo !== skrótHasla) {
        return false;
    }
    if (!zapisanyProfil && staryProfil && (staryProfil.nazwa !== nazwa || staryProfil.haslo !== skrótHasla)) {
        return false;
    }

    await zapiszUzytkownika({ nazwa, haslo: skrótHasla, ostatnieLogowanie: new Date().toISOString() });
    localStorage.setItem("fizyka-profil", JSON.stringify({ nazwa, haslo: skrótHasla }));
    localStorage.setItem("fizyka-aktywny-uzytkownik", nazwa);
    aktywnyUzytkownik = nazwa;
    wynikGracza = Number(localStorage.getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
    return true;
}

document.getElementById("formularz-logowania").addEventListener("submit", event => {
    event.preventDefault();
    const nazwa = document.getElementById("nazwa-uzytkownika").value.trim();
    const haslo = document.getElementById("haslo-uzytkownika").value;
    const blad = document.getElementById("blad-logowania");

    zalogujUzytkownika(nazwa, haslo).then(poprawneLogowanie => {
        if (!poprawneLogowanie) {
            blad.hidden = false;
            blad.textContent = "Nieprawidłowa nazwa lub hasło dla zapisanego profilu.";
            return;
        }

        blad.hidden = true;
        ekranLogowania.style.display = "none";
        ekranStartowy.style.display = "block";
    }).catch(() => {
        blad.hidden = false;
        blad.textContent = "Nie udało się otworzyć lokalnej bazy danych.";
    });
});

document.getElementById("pokaz-rejestracje").addEventListener("click", () => {
    document.getElementById("formularz-logowania").hidden = true;
    document.getElementById("formularz-rejestracji").hidden = false;
    document.getElementById("pokaz-rejestracje").hidden = true;
});

document.getElementById("formularz-rejestracji").addEventListener("submit", event => {
    event.preventDefault();
    const nazwa = document.getElementById("nowa-nazwa-uzytkownika").value.trim();
    const haslo = document.getElementById("nowe-haslo-uzytkownika").value;
    const powtorzoneHaslo = document.getElementById("powtorz-haslo-uzytkownika").value;
    const blad = document.getElementById("blad-rejestracji");

    if (haslo !== powtorzoneHaslo) {
        blad.hidden = false;
        blad.textContent = "Hasła muszą być identyczne.";
        return;
    }

    znajdzUzytkownika(nazwa).then(istniejacyUzytkownik => {
        if (istniejacyUzytkownik) {
            blad.hidden = false;
            blad.textContent = "Taka nazwa użytkownika jest już zajęta.";
            return;
        }
        return zapiszUzytkownika({ nazwa, haslo: prostySkrót(haslo), utworzono: new Date().toISOString() }).then(() => {
            aktywnyUzytkownik = nazwa;
            wynikGracza = 0;
            localStorage.setItem("fizyka-aktywny-uzytkownik", nazwa);
            localStorage.setItem(`fizyka-wynik-${nazwa}`, "0");
            ekranLogowania.style.display = "none";
            ekranStartowy.style.display = "block";
        });
    }).catch(() => {
        blad.hidden = false;
        blad.textContent = "Nie udało się zapisać profilu w lokalnej bazie danych.";
    });
});

function rozpocznijSciezke() {
    profilUcznia = {
        poziom: document.getElementById("poziom-fizyki").value,
        klasa: document.getElementById("klasa-fizyki").value,
        cel: document.getElementById("cel-fizyki").value
    };

    lekcjiWKole = 1;
    const opisyPoziomu = {
        podstawowy: "Spokojne tempo: lekcje odblokowują się po kolei w każdym temacie.",
        sredni: "Równe tempo: każda lekcja prowadzi do następnej w tym samym temacie.",
        zaawansowany: "Tryb wyzwań: kolejne lekcje tego samego tematu odblokowują się po ukończeniu poprzedniej."
    };
    const priorytetyCelu = {
        podstawy: ["mechanika", "termodynamika", "fale_drgania", "optyka"],
        sprawdzian: ["mechanika", "elektromagnetyzm", "termodynamika", "optyka"],
        egzamin: ["mechanika", "elektromagnetyzm", "optyka", "fale_drgania"],
        ciekawosc: ["astronomia", "teoria_wzglednosci", "mechanika_kwantowa_jadrowa", "fizyka_materialow"]
    };
    const kolejnosc = priorytetyCelu[profilUcznia.cel];
    const przyciskiDzialow = document.querySelector(".przyciski-dialow");
    [...przyciskiDzialow.children]
        .sort((pierwszy, drugi) => {
            const pozycjaPierwszego = kolejnosc.indexOf(pierwszy.dataset.dzial);
            const pozycjaDrugiego = kolejnosc.indexOf(drugi.dataset.dzial);
            return (pozycjaPierwszego === -1 ? 99 : pozycjaPierwszego) - (pozycjaDrugiego === -1 ? 99 : pozycjaDrugiego);
        })
        .forEach(przycisk => przyciskiDzialow.appendChild(przycisk));
    document.getElementById("opis-sciezki").textContent = `${opisyPoziomu[profilUcznia.poziom]} Klasa: ${document.getElementById("klasa-fizyki").selectedOptions[0].textContent}. Cel: ${document.getElementById("cel-fizyki").selectedOptions[0].textContent}.`;
    document.getElementById("ekran-startowy").style.display = "none";
    document.getElementById("ekran-dialow").style.display = "block";
    pokazWynik();
}

document.getElementById("formularz-startowy").addEventListener("submit", event => {
    event.preventDefault();
    rozpocznijSciezke();
});

pokazWynik();

// Obsługa przycisków działów
document.querySelectorAll("#ekran-dialow .przycisk-dzial").forEach(btn => {
    btn.addEventListener("click", () => {
        aktualnyDzial = btn.getAttribute("data-dzial");
        wyswietlPodnagalowki(aktualnyDzial);
        ekranDialow.style.display = "none";
        ekranPodnagalowkow.style.display = "block";
    });
});

// Wyświetlanie podnagłówków
function wyswietlPodnagalowki(nazwadzialu) {
    const dzial = baza[nazwadzialu];
    const nazwyPodnagalowkow = {
        ruch_obrotowy: "Ruch obrotowy",
        mechanika_plynow: "Mechanika płynów",
        przemiany_gazowe: "Przemiany gazowe",
        obwody_pradu: "Obwody prądu",
        przyrzady_optyczne: "Przyrządy optyczne",
        fale_elektromagnetyczne: "Fale elektromagnetyczne",
        fizyka_czastek: "Fizyka cząstek",
        astrofizyka: "Astrofizyka",
        fale_mechaniczne: "Fale mechaniczne",
        optyka_falowa: "Optyka falowa",
        ciala_niebieskie: "Ciała niebieskie",
        ruchy_orbitalne: "Ruchy orbitalne"
    };
    document.getElementById("nazwa-podnagalowkow").textContent = dzial.nazwa;
    
    const kontener = document.getElementById("przyciski-podnagalowkow");
    kontener.innerHTML = "";
    
    Object.keys(dzial.podnagalowki).forEach(kluczPodnagalowka => {
        const btn = document.createElement("button");
        btn.className = "przycisk-podnagalek";
        btn.setAttribute("data-podnagalek", kluczPodnagalowka);
        btn.textContent = nazwyPodnagalowkow[kluczPodnagalowka] || kluczPodnagalowka.charAt(0).toUpperCase() + kluczPodnagalowka.slice(1);
        btn.addEventListener("click", () => {
            wyswietlLekcje(kluczPodnagalowka);
            ekranPodnagalowkow.style.display = "none";
            ekranLekcji.style.display = "block";
        });
        kontener.appendChild(btn);
    });

    const doswiadczenieBtn = document.createElement("button");
    doswiadczenieBtn.className = "przycisk-doswiadczenia-dzialu";
    doswiadczenieBtn.textContent = `🧪 Doświadczenie: ${doswiadczeniaDzialow[nazwadzialu]}`;
    doswiadczenieBtn.addEventListener("click", () => {
        ekranPodnagalowkow.style.display = "none";
        ekranDoswiadczen.hidden = false;
        document.querySelector("#ekran-doswiadczen h1").textContent = doswiadczeniaDzialow[nazwadzialu];
        aktualizujSamochod();
        aktualizujOkrazenie();
    });
    kontener.appendChild(doswiadczenieBtn);
}

// Wyświetlanie lekcji
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
        btn.className = "kolko-lekcji";
        btn.textContent = index + 1;
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

function kluczPostepu(pakiet) {
    const nazwyLekcji = pakiet.map(lekcja => lekcja.temat).join("|");
    return `fizyka-postep-${aktywnyUzytkownik}-${aktualnyDzial}-${aktualnyPodnagalek}-${nazwyLekcji}`;
}

function pobierzPostep(pakiet) {
    return Number(localStorage.getItem(kluczPostepu(pakiet)) || 0);
}

function ustawPostep(pakiet, procent) {
    const zaokraglonyPostep = Math.min(100, Math.round(procent));
    localStorage.setItem(kluczPostepu(pakiet), zaokraglonyPostep);
    if (aktualnyPrzyciskLekcji) {
        aktualnyPrzyciskLekcji.style.setProperty("--postep", `${zaokraglonyPostep}%`);
        aktualnyPrzyciskLekcji.classList.toggle("ukonczona", zaokraglonyPostep === 100);
    }
}

// Start quizu
function startQuiz(pakiet, przyciskLekcji) {
    aktualnyPakiet = pakiet;
    aktualnyPrzyciskLekcji = przyciskLekcji;
    aktualnaPytanieIndex = 0;
    poziomAdaptacyjny = 2;
    seriaPoprawnych = 0;
    seriaBlednych = 0;
    pokazanePytania = [];
    aktualnePytania = pakiet.flatMap(lekcja => lekcja.quiz.map(pytanie => ({
        ...pytanie,
        pytanie: `${lekcja.temat}: ${pytanie.pytanie}`
    })));
    document.getElementById("temat-lekcji").textContent = pakiet[0].temat;
    aktualnaLiczbaPytan = Math.min(10, aktualnePytania.length);
    aktualnePytania = aktualnePytania.slice(0, aktualnaLiczbaPytan);
    ustawWizualnyPostep(0);
    ekranLekcji.style.display = "none";
    ekranQuizu.style.display = "block";
    showQuestion();
}

// Wyświetlanie pytania
function showQuestion() {
    if (aktualnaPytanieIndex < aktualnaLiczbaPytan) {
        const dostepnePytania = aktualnePytania.filter(pytanie => !pokazanePytania.includes(pytanie));
        const pytanie = dostepnePytania.sort((pierwsze, drugie) => Math.abs(pierwsze.poziom - poziomAdaptacyjny) - Math.abs(drugie.poziom - poziomAdaptacyjny))[0];
        aktualnePytanie = pytanie;
        pokazanePytania.push(pytanie);
        document.getElementById("quiz-pytanie").textContent = pytanie.pytanie;
        document.getElementById("numer-pytania").textContent = `Pytanie ${aktualnaPytanieIndex + 1} z ${aktualnaLiczbaPytan} • poziom ${pytanie.poziom}`;
        pokazPodpowiedz(pytanie);
        
        const odpowiedziDiv = document.getElementById("quiz-odpowiedzi");
        odpowiedziDiv.innerHTML = "";
        
        pytanie.odpowiedzi.forEach((odpowiedz, index) => {
            const btn = document.createElement("button");
            btn.className = "przycisk-odpowiedzi";
            btn.textContent = odpowiedz;
            btn.addEventListener("click", () => {
                if (index === pytanie.prawidlowa) {
                    odpowiedziDiv.querySelectorAll("button").forEach(odpowiedz => odpowiedz.disabled = true);
                    btn.style.background = "#4CAF50";
                    btn.style.borderColor = "#4CAF50";
                    btn.style.color = "white";
                    seriaPoprawnych += 1;
                    seriaBlednych = 0;
                    if (seriaPoprawnych >= 2) poziomAdaptacyjny = Math.min(3, poziomAdaptacyjny + 1);
                    wynikGracza += 10;
                    localStorage.setItem(`fizyka-wynik-${aktywnyUzytkownik}`, wynikGracza);
                    pokazWynik();
                    ustawWizualnyPostep(((aktualnaPytanieIndex + 1) / aktualnaLiczbaPytan) * 100);
                    ustawPostep(aktualnyPakiet, ((aktualnaPytanieIndex + 1) / aktualnaLiczbaPytan) * 100);
                    setTimeout(() => {
                        aktualnaPytanieIndex++;
                        showQuestion();
                    }, 1000);
                } else {
                    seriaBlednych += 1;
                    seriaPoprawnych = 0;
                    if (seriaBlednych >= 1) poziomAdaptacyjny = Math.max(1, poziomAdaptacyjny - 1);
                    btn.style.background = "#f44336";
                    btn.style.borderColor = "#f44336";
                    btn.style.color = "white";
                }
            });
            odpowiedziDiv.appendChild(btn);
        });
    } else {
        endQuiz();
    }
}

function pokazPodpowiedz(pytanie) {
    const podpowiedz = document.getElementById("podpowiedz-quizu");
    podpowiedz.hidden = true;
    podpowiedz.textContent = `Wzór / wskazówka: ${pytanie.wzor || "Wypisz dane, szukaną wielkość i dobierz prawo fizyczne."}`;
}

function ustawWizualnyPostep(procent) {
    const wartosc = Math.min(100, Math.round(procent));
    const wypelnienie = document.getElementById("wypelnienie-postepu");
    const pasek = document.querySelector(".pasek-postepu");
    const licznik = document.getElementById("numer-pytania");
    if (!wypelnienie || !pasek || !licznik) return;
    wypelnienie.style.width = `${wartosc}%`;
    pasek.setAttribute("aria-valuenow", wartosc);
    licznik.textContent = wartosc === 100 ? "Lekcja ukończona" : `Postęp lekcji: ${wartosc}%`;
}

document.getElementById("przycisk-podpowiedzi").addEventListener("click", () => {
    const podpowiedz = document.getElementById("podpowiedz-quizu");
    podpowiedz.hidden = !podpowiedz.hidden;
});

document.getElementById("przycisk-kalkulatora").addEventListener("click", () => {
    const kalkulator = document.getElementById("kalkulator");
    kalkulator.hidden = !kalkulator.hidden;
});

document.getElementById("oblicz-kalkulator").addEventListener("click", () => {
    const liczbaA = Number(document.getElementById("kalkulator-a").value);
    const liczbaB = Number(document.getElementById("kalkulator-b").value);
    const dzialanie = document.getElementById("kalkulator-dzialanie").value;
    const wynikElement = document.getElementById("wynik-kalkulatora");
    let wynik;

    if (!Number.isFinite(liczbaA) || !Number.isFinite(liczbaB)) {
        wynikElement.textContent = "Wynik: wpisz obie liczby";
        return;
    }

    if (dzialanie === "+") wynik = liczbaA + liczbaB;
    if (dzialanie === "-") wynik = liczbaA - liczbaB;
    if (dzialanie === "*") wynik = liczbaA * liczbaB;
    if (dzialanie === "/") wynik = liczbaB === 0 ? "nie można dzielić przez zero" : liczbaA / liczbaB;
    if (dzialanie === "^") wynik = liczbaA ** liczbaB;
    wynikElement.textContent = `Wynik: ${typeof wynik === "number" ? Number(wynik.toFixed(6)) : wynik}`;
});

// Koniec quizu
function endQuiz() {
    ustawPostep(aktualnyPakiet, 100);
    ustawWizualnyPostep(100);
    document.getElementById("quiz-pytanie").textContent = `Lekcja ukończona! Następna lekcja tego tematu jest już odblokowana. Masz ${wynikGracza} punktów.`;
    document.getElementById("quiz-odpowiedzi").innerHTML = "";
    document.getElementById("numer-pytania").textContent = "Koniec";
}

// Powrót do lekcji
if (document.getElementById("powrot-do-lekcji")) {
    document.getElementById("powrot-do-lekcji").addEventListener("click", () => {
        ekranQuizu.style.display = "none";
        ekranLekcji.style.display = "block";
        wyswietlLekcje(aktualnyPodnagalek);
    });
}

// Powrót do podnagłówków
document.getElementById("powrot-do-podnagalowkow").addEventListener("click", () => {
    ekranLekcji.style.display = "none";
    ekranPodnagalowkow.style.display = "block";
});

// Powrót do działów
document.getElementById("powrot-do-dialow").addEventListener("click", () => {
    ekranPodnagalowkow.style.display = "none";
    ekranDialow.style.display = "block";
});

przywrocSesje();
