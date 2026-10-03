import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    setPersistence,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD9Lvu2lIws2zwWK8V7DEqJ6lpm32QbO-Q",
    authDomain: "inercja-424dd.firebaseapp.com",
    projectId: "inercja-424dd",
    storageBucket: "inercja-424dd.firebasestorage.app",
    messagingSenderId: "842907283931",
    appId: "1:842907283931:web:1842e39ca0413520b937fe",
    measurementId: "G-MSEYW7W658"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
auth.languageCode = "pl";
const gotowoscFirebase = setPersistence(auth, browserLocalPersistence);

// Ekrany
const ekranDialow = document.getElementById("ekran-dialow");
const ekranPodnagalowkow = document.getElementById("ekran-podnagalowkow");
const ekranLekcji = document.getElementById("ekran-lekcji");
const ekranQuizu = document.getElementById("ekran-quizu");
const ekranLogowania = document.getElementById("ekran-logowania");
const ekranStartowy = document.getElementById("ekran-startowy");
const profilUzytkownika = document.getElementById("profil-uzytkownika");
const przyciskProfilu = document.getElementById("otworz-profil");
const menuProfilu = document.getElementById("menu-profilu");
const oknoInformacji = document.getElementById("okno-informacji");

let aktualnyDzial = null;
let aktualnyPodnagalek = null;
let aktualnaPytanieIndex = 0;
let aktualnaLekcja = null;
let aktualnyPrzyciskLekcji = null;
let aktualnyPakiet = [];
let aktualnePytania = [];
let profilUcznia = null;
let lekcjiWKole = 2;
let trybGoscia = sessionStorage.getItem("fizyka-tryb-goscia") === "true";
let aktywnyUzytkownik = trybGoscia ? "gosc" : localStorage.getItem("fizyka-aktywny-uzytkownik") || "";
let wynikGracza = Number(magazynDanych().getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
let poziomAdaptacyjny = 2;
let seriaPoprawnych = 0;
let seriaBlednych = 0;
let pokazanePytania = [];
let aktualnePytanie = null;
let aktualnaLiczbaPytan = 10;
let rejestracjaWToku = false;
let kolejkaZapisuPostepu = Promise.resolve();
let zsynchronizowanyUzytkownik = "";
let aktywnaSynchronizacjaPostepu = null;
const kluczPostepuDoPrzeniesienia = "fizyka-postep-do-przeniesienia";
const maksymalnePunkty = 100000000;

function magazynDanych() {
    return trybGoscia ? sessionStorage : localStorage;
}

function wyczyscSesjeGoscia(zachowajPostepDoPrzeniesienia = false) {
    Object.keys(sessionStorage)
        .filter(klucz => klucz.startsWith("fizyka-")
            && (!zachowajPostepDoPrzeniesienia || klucz !== kluczPostepuDoPrzeniesienia))
        .forEach(klucz => sessionStorage.removeItem(klucz));
}

// Baza danych - 9 głównych działów
const baza = {
    termodynamika: {
        emoji: "⚙️",
        nazwa: "Termodynamika",
        podnagalowki: {
            temperatura: [
                { temat: "Skale temperatur", quiz: [{ pytanie: "Temperatura 27°C odpowiada ilu kelwinom?", odpowiedzi: ["300 K", "246 K", "327 K"], prawidlowa: 0 }] },
                { temat: "Pomiar temperatury", quiz: [{ pytanie: "Termometr wskazuje 18°C. O ile stopni trzeba podnieść temperaturę, aby osiągnąć 43°C?", odpowiedzi: ["25°C", "61°C", "18°C"], prawidlowa: 0 }] }
            ],
            energia: [
                { temat: "Energia cieplna", quiz: [{ pytanie: "Ile energii trzeba dostarczyć 2 kg wody, aby ogrzać ją o 5°C? Przyjmij c = 4200 J/(kg·°C).", odpowiedzi: ["42 000 J", "8 400 J", "2 100 J"], prawidlowa: 0 }] },
                { temat: "Praca i energia", quiz: [{ pytanie: "Siła 20 N przesuwa ciało o 3 m w swoim kierunku. Jaką pracę wykonuje?", odpowiedzi: ["60 J", "6,7 J", "23 J"], prawidlowa: 0 }] }
            ]
        }
    },
    mechanika: {
        emoji: "🏃",
        nazwa: "Mechanika",
        podnagalowki: {
            kinematyka: [
                { temat: "Ruch jednostajny prostoliniowy", quiz: [{ pytanie: "Samochód przejeżdża 120 m w 10 s ruchem jednostajnym. Jaka jest jego prędkość?", odpowiedzi: ["12 m/s", "1200 m/s", "0,083 m/s"], prawidlowa: 0 }] },
                { temat: "Ruch jednostajnie przyspieszony", quiz: [{ pytanie: "Prędkość ciała wzrosła z 4 m/s do 10 m/s w 3 s. Jakie było jego średnie przyspieszenie?", odpowiedzi: ["2 m/s²", "4,7 m/s²", "6 m/s²"], prawidlowa: 0 }] },
                { temat: "Prędkość i przyspieszenie", quiz: [{ pytanie: "Ciało ma prędkość początkową 3 m/s i przyspieszenie 2 m/s². Jaką prędkość osiągnie po 5 s?", odpowiedzi: ["13 m/s", "10 m/s", "25 m/s"], prawidlowa: 0 }] },
                { temat: "Wykresy ruchu", quiz: [] },
                { temat: "Ruch względny", quiz: [] },
                { temat: "Droga, prędkość i czas", quiz: [] },
                { temat: "Opóźnienie i hamowanie", quiz: [] }
            ],
            dynamika: [
                { temat: "Zasady Newtona", quiz: [{ pytanie: "Na ciało o masie 3 kg działa wypadkowa siła 12 N. Jakie ma przyspieszenie?", odpowiedzi: ["4 m/s²", "36 m/s²", "0,25 m/s²"], prawidlowa: 0 }] },
                { temat: "Siła tarcia", quiz: [{ pytanie: "Ciało o masie 5 kg porusza się po poziomej powierzchni. μ = 0,2, g = 10 m/s². Ile wynosi siła tarcia?", odpowiedzi: ["10 N", "2 N", "50 N"], prawidlowa: 0 }] }
            ],
            statyka: [
                { temat: "Równowaga ciał", quiz: [{ pytanie: "Na ciało działają siły 8 N w prawo i 3 N w lewo. Jaka siła równoważy te siły?", odpowiedzi: ["5 N w lewo", "5 N w prawo", "11 N w lewo"], prawidlowa: 0 }] },
                { temat: "Moment siły", quiz: [{ pytanie: "Siła 10 N działa prostopadle do ramienia o długości 0,4 m. Jaki moment siły powstaje?", odpowiedzi: ["4 N·m", "25 N·m", "0,04 N·m"], prawidlowa: 0 }] }
            ],
            ruch_obrotowy: [
                { temat: "Prędkość kątowa", quiz: [{ pytanie: "Koło wykonuje 5 pełnych obrotów w 10 s. Jaka jest jego średnia prędkość kątowa?", odpowiedzi: ["π rad/s", "0,5π rad/s", "10π rad/s"], prawidlowa: 0 }] },
                { temat: "Ruch po okręgu", quiz: [{ pytanie: "Punkt porusza się po okręgu o promieniu 0,5 m z prędkością kątową 4 rad/s. Jaka jest prędkość liniowa?", odpowiedzi: ["2 m/s", "8 m/s", "0,125 m/s"], prawidlowa: 0 }] },
                { temat: "Przyspieszenie dośrodkowe", quiz: [{ pytanie: "Ciało porusza się z prędkością 6 m/s po okręgu o promieniu 3 m. Jakie ma przyspieszenie dośrodkowe?", odpowiedzi: ["12 m/s²", "2 m/s²", "18 m/s²"], prawidlowa: 0 }] },
                { temat: "Moment pędu", quiz: [{ pytanie: "Punkt ma pęd 4 kg·m/s, a jego odległość od osi wynosi 0,5 m. Pęd jest prostopadły do promienia. Jaki jest moment pędu?", odpowiedzi: ["2 kg·m²/s", "8 kg·m²/s", "4,5 kg·m²/s"], prawidlowa: 0 }] }
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
                { temat: "Ładunek elektryczny", quiz: [{ pytanie: "Prąd 2 A płynie przez przewodnik przez 5 s. Jaki ładunek przepłynął przez przewodnik?", odpowiedzi: ["10 C", "0,4 C", "2,5 C"], prawidlowa: 0 }] },
                { temat: "Pole elektryczne", quiz: [{ pytanie: "Na ładunek 2 μC działa siła 0,01 N. Jakie jest natężenie pola elektrycznego?", odpowiedzi: ["5000 N/C", "0,00002 N/C", "200 N/C"], prawidlowa: 0 }] }
            ],
            prad: [
                { temat: "Prąd elektryczny", quiz: [{ pytanie: "Przez opornik 6 Ω płynie prąd 2 A. Jakie napięcie występuje na jego końcach?", odpowiedzi: ["12 V", "3 V", "8 V"], prawidlowa: 0 }] },
                { temat: "Napięcie i opór", quiz: [{ pytanie: "Do opornika przyłożono napięcie 12 V, a płynie przez niego prąd 3 A. Jaki jest jego opór?", odpowiedzi: ["4 Ω", "36 Ω", "0,25 Ω"], prawidlowa: 0 }] }
            ],
            magnetyzm: [
                { temat: "Pole magnetyczne", quiz: [{ pytanie: "Przewodnik długości 0,5 m jest prostopadły do pola 0,4 T. Płynie przez niego prąd 2 A. Jaka siła magnetyczna na niego działa?", odpowiedzi: ["0,4 N", "4 N", "0,1 N"], prawidlowa: 0 }] },
                { temat: "Siła Lorentza", quiz: [{ pytanie: "Naładowana cząstka porusza się prostopadle do pola magnetycznego. Jeśli jej prędkość wzrośnie dwukrotnie, jak zmieni się siła magnetyczna?", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się"], prawidlowa: 0 }] }
            ]
        }
    },
    fale_drgania: {
        emoji: "〰️",
        nazwa: "Fale i Drgania",
        podnagalowki: {
            drgania: [
                { temat: "Ruch harmoniczny", quiz: [{ pytanie: "Oscylator wykonuje drgania o częstotliwości 2 Hz. Jaki jest okres tych drgań?", odpowiedzi: ["0,5 s", "2 s", "4 s"], prawidlowa: 0 }] },
                { temat: "Amplituda i okres", quiz: [{ pytanie: "Wychylenie oscylatora zmienia się od −4 cm do +4 cm. Jaka jest amplituda drgań?", odpowiedzi: ["4 cm", "8 cm", "2 cm"], prawidlowa: 0 }] }
            ],
            fale_mechaniczne: [
                { temat: "Równanie fali", quiz: [{ pytanie: "Fala ma długość 0,5 m i częstotliwość 6 Hz. Z jaką prędkością się rozchodzi?", odpowiedzi: ["3 m/s", "12 m/s", "0,083 m/s"], prawidlowa: 0 }] },
                { temat: "Rodzaje fal", quiz: [{ pytanie: "Która z fal może rozchodzić się w próżni?", odpowiedzi: ["Światło", "Dźwięk w powietrzu", "Fala na linie"], prawidlowa: 0 }] }
            ],
            optyka_falowa: [
                { temat: "Interferencja światła", quiz: [{ pytanie: "Dwie fale świetlne spotykają się w fazie. Jaki efekt może wtedy wystąpić?", odpowiedzi: ["Wzmocnienie światła", "Całkowite pochłonięcie każdej fali", "Zmiana częstotliwości źródła"], prawidlowa: 0 }] },
                { temat: "Dyfrakcja", quiz: [{ pytanie: "Szczelina ma szerokość porównywalną z długością fali. Co można wtedy zaobserwować?", odpowiedzi: ["Wyraźną dyfrakcję", "Brak ugięcia fali", "Zmianę prędkości światła w próżni"], prawidlowa: 0 }] }
            ],
            akustyka: [
                { temat: "Prędkość dźwięku", quiz: [{ pytanie: "Dźwięk ma częstotliwość 440 Hz i porusza się w powietrzu z prędkością 343 m/s. Jaka jest jego długość fali?", odpowiedzi: ["Około 0,78 m", "Około 1,28 m", "Około 440 m"], prawidlowa: 0 }] },
                { temat: "Częstotliwość dźwięku", quiz: [{ pytanie: "Źródło wykonuje 120 drgań w ciągu 2 s. Jaka jest częstotliwość drgań?", odpowiedzi: ["60 Hz", "240 Hz", "0,0167 Hz"], prawidlowa: 0 }] }
            ]
        }
    },
    optyka: {
        emoji: "💡",
        nazwa: "Optyka",
        podnagalowki: {
            optyka_geometryczna: [
                { temat: "Prawo odbicia", quiz: [{ pytanie: "Promień pada na płaskie zwierciadło pod kątem 35° do normalnej. Jaki jest kąt odbicia mierzony od normalnej?", odpowiedzi: ["35°", "55°", "70°"], prawidlowa: 0 }] },
                { temat: "Prawo załamania", quiz: [{ pytanie: "Światło przechodzi z powietrza do szkła. Co dzieje się z jego prędkością?", odpowiedzi: ["Maleje", "Rośnie", "Pozostaje taka sama"], prawidlowa: 0 }] }
            ],
            soczewki: [
                { temat: "Soczewka skupiająca", quiz: [{ pytanie: "Soczewka skupiająca ma ogniskową 20 cm. Jaka jest jej zdolność skupiająca?", odpowiedzi: ["+5 D", "+0,2 D", "−5 D"], prawidlowa: 0 }] },
                { temat: "Soczewka rozpraszająca", quiz: [{ pytanie: "Jaki obraz przedmiotu wytwarza typowa soczewka rozpraszająca?", odpowiedzi: ["Pozorny, prosty i pomniejszony", "Rzeczywisty i powiększony", "Rzeczywisty i odwrócony"], prawidlowa: 0 }] }
            ]
        }
    },
    mechanika_kwantowa_jadrowa: {
        emoji: "⚛️",
        nazwa: "Mechanika Kwantowa i Fizyka Jądrowa",
        podnagalowki: {
            podstawy_kwantowe: [
                { temat: "Zasada nieoznaczoności", quiz: [{ pytanie: "Jeżeli niepewność położenia cząstki maleje, co dzieje się z minimalną możliwą niepewnością jej pędu?", odpowiedzi: ["Rośnie", "Maleje do zera", "Nie zmienia się"], prawidlowa: 0 }] },
                { temat: "Funkcja falowa", quiz: [{ pytanie: "W mechanice kwantowej wielkość |ψ|² w danym miejscu jest związana z czym?", odpowiedzi: ["Prawdopodobieństwem znalezienia cząstki", "Energią spoczynkową", "Ładunkiem elektrycznym"], prawidlowa: 0 }] }
            ],
            fizyka_jadrowa: [
                { temat: "Budowa jądra", quiz: [{ pytanie: "W przemianie β⁻ neutron w jądrze zamienia się w proton. Jak zmienia się liczba protonów jądra?", odpowiedzi: ["Rośnie o 1", "Maleje o 1", "Nie zmienia się"], prawidlowa: 0 }] },
                { temat: "Radioaktywność", quiz: [{ pytanie: "Podczas rozpadu alfa jądro emituje cząstkę zawierającą 2 protony i 2 neutrony. O ile zmniejsza się liczba masowa?", odpowiedzi: ["O 4", "O 2", "O 8"], prawidlowa: 0 }] }
            ]
        }
    },
    teoria_wzglednosci: {
        emoji: "🚀",
        nazwa: "Teoria Względności",
        podnagalowki: {
            szczegolna: [
                { temat: "Względność szczególna", quiz: [{ pytanie: "Ciało ma masę spoczynkową 2 kg. Korzystając z E₀ = mc², jaka jest jego energia spoczynkowa?", odpowiedzi: ["1,8 × 10¹⁷ J", "6 × 10⁸ J", "9 × 10¹⁶ J"], prawidlowa: 0 }] },
                { temat: "Dylatacja czasu", quiz: [{ pytanie: "Statek porusza się względem Ziemi z prędkością bliską prędkości światła. Jak czas na statku jest mierzony przez obserwatora na Ziemi?", odpowiedzi: ["Upływa wolniej", "Upływa szybciej", "Płynie wstecz"], prawidlowa: 0 }] }
            ],
            ogolna: [
                { temat: "Grawitacja", quiz: [{ pytanie: "Dwa ciała oddalone od siebie o r zwiększają odległość do 2r. Jak zmieni się siła grawitacji?", odpowiedzi: ["Zmniejszy się 4 razy", "Zmniejszy się 2 razy", "Zwiększy się 4 razy"], prawidlowa: 0 }] },
                { temat: "Czarna dziura", quiz: [{ pytanie: "Jak nazywa się granica czarnej dziury, zza której światło nie może już uciec?", odpowiedzi: ["Horyzont zdarzeń", "Osobliwość", "Dysk akrecyjny"], prawidlowa: 0 }] }
            ]
        }
    },
    fizyka_materialow: {
        emoji: "🧪",
        nazwa: "Fizyka Materiałów",
        podnagalowki: {
            struktury_krystaliczne: [
                { temat: "Struktury krystaliczne", quiz: [{ pytanie: "Jaka cecha odróżnia kryształ od typowego ciała amorficznego?", odpowiedzi: ["Uporządkowana struktura dalekiego zasięgu", "Brak atomów", "Zawsze ciekły stan skupienia"], prawidlowa: 0 }] },
                { temat: "Sieci przestrzenne", quiz: [{ pytanie: "Jak nazywa się najmniejszy powtarzalny fragment sieci krystalicznej, z którego można odtworzyć cały kryształ?", odpowiedzi: ["Komórka elementarna", "Jądro atomowe", "Granica ziarna"], prawidlowa: 0 }] }
            ],
            wlasciwosci: [
                { temat: "Twardość materiału", quiz: [{ pytanie: "Który materiał jest twardszy według skali Mohsa, jeśli minerał A rysuje minerał B?", odpowiedzi: ["Minerał A", "Minerał B", "Oba mają taką samą twardość"], prawidlowa: 0 }] },
                { temat: "Przewodnictwo", quiz: [{ pytanie: "Dlaczego metale zwykle dobrze przewodzą prąd elektryczny?", odpowiedzi: ["Mają swobodne elektrony", "Nie zawierają elektronów", "Ich protony przemieszczają się przez przewodnik"], prawidlowa: 0 }] }
            ]
        }
    },
    astronomia: {
        emoji: "🌌",
        nazwa: "Astronomia",
        podnagalowki: {
            ciala_niebieskie: [
                { temat: "Gwiazdy", quiz: [{ pytanie: "Źródłem energii gwiazd podobnych do Słońca w głównej sekwencji jest przede wszystkim:", odpowiedzi: ["Fuzja jąder wodoru", "Spalanie chemiczne", "Rozszczepianie żelaza"], prawidlowa: 0 }] },
                { temat: "Planety", quiz: [{ pytanie: "Ile planet znajduje się obecnie w Układzie Słonecznym według współczesnej klasyfikacji?", odpowiedzi: ["8", "7", "9"], prawidlowa: 0 }] }
            ],
            ruchy_orbitalne: [
                { temat: "Prawa Keplera", quiz: [{ pytanie: "Planeta porusza się po orbicie eliptycznej. W którym miejscu jej prędkość orbitalna jest większa?", odpowiedzi: ["Bliżej Słońca", "Dalej od Słońca", "Jest zawsze taka sama"], prawidlowa: 0 }] },
                { temat: "Gravitacja", quiz: [{ pytanie: "Dwie masy przyciągają się siłą F. Jeśli jedną z mas zwiększymy dwukrotnie, a odległość pozostanie bez zmian, jaka będzie nowa siła?", odpowiedzi: ["2F", "F/2", "4F"], prawidlowa: 0 }] }
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
    { pytanie: "Samochód przejechał 150 m w czasie 10 s. Jaka była jego średnia prędkość?", odpowiedzi: ["15 m/s", "1500 m/s", "1,5 m/s"], prawidlowa: 0, wzor: "v = s / t = 150 / 10", poziom: 1 },
    { pytanie: "Ciało zwiększyło prędkość z 4 m/s do 16 m/s w ciągu 3 s. Oblicz przyspieszenie.", odpowiedzi: ["4 m/s²", "12 m/s²", "6 m/s²"], prawidlowa: 0, wzor: "a = (v - v₀) / t = (16 - 4) / 3", poziom: 2 },
    { pytanie: "Na ciało o masie 5 kg działa siła wypadkowa 20 N. Jakie ma przyspieszenie?", odpowiedzi: ["4 m/s²", "100 m/s²", "0,25 m/s²"], prawidlowa: 0, wzor: "a = F / m = 20 / 5", poziom: 1 },
    { pytanie: "Ciało o masie 2 kg porusza się z prędkością 6 m/s. Jaki ma pęd?", odpowiedzi: ["12 kg·m/s", "3 kg·m/s", "8 kg·m/s"], prawidlowa: 0, wzor: "p = mv = 2 · 6", poziom: 1 },
    { pytanie: "Podniesiono ciało o masie 3 kg na wysokość 4 m. Przyjmij g = 10 m/s². Jaka jest zmiana energii potencjalnej?", odpowiedzi: ["120 J", "12 J", "7,5 J"], prawidlowa: 0, wzor: "Eₚ = mgh = 3 · 10 · 4", poziom: 2 },
    { pytanie: "Silnik wykonał pracę 6000 J w czasie 20 s. Jaka była jego średnia moc?", odpowiedzi: ["300 W", "120 000 W", "30 W"], prawidlowa: 0, wzor: "P = W / t = 6000 / 20", poziom: 2 },
    { pytanie: "Ciało ma masę 540 g i objętość 200 cm³. Jaka jest jego gęstość?", odpowiedzi: ["2,7 g/cm³", "0,37 g/cm³", "108 g/cm³"], prawidlowa: 0, wzor: "ρ = m / V = 540 / 200", poziom: 2 },
    { pytanie: "Siła 80 N działa prostopadle do powierzchni o polu 0,4 m². Jakie ciśnienie wywiera?", odpowiedzi: ["200 Pa", "32 Pa", "20 Pa"], prawidlowa: 0, wzor: "p = F / S = 80 / 0,4", poziom: 2 }
];

Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki).forEach(lekcje => {
    lekcje.forEach(lekcja => {
        lekcja.quiz = (zadaniaTematyczne[lekcja.temat] || zadaniaUniwersalne(lekcja.temat)).map((zadanie, index) => ({
            ...zadanie,
            poziom: zadanie.poziom || (index < 2 ? 1 : index < 5 ? 2 : 3)
        }));
        lekcja.quiz.push(
            {
                pytanie: "Rowerzysta przejechał 2,4 km w 8 min. Jaka była jego średnia prędkość w m/s?",
                odpowiedzi: ["5 m/s", "18 m/s", "0,3 m/s"],
                prawidlowa: 0,
                wzor: "v = s / t = 2400 / 480",
                poziom: 2
            },
            {
                pytanie: "Na ciało działa siła 30 N, a jego masa wynosi 6 kg. Jakie przyspieszenie nadaje mu ta siła, jeśli jest siłą wypadkową?",
                odpowiedzi: ["5 m/s²", "180 m/s²", "0,2 m/s²"],
                prawidlowa: 0,
                wzor: "a = F / m = 30 / 6",
                poziom: 2
            },
            {
                pytanie: "Piłka o masie 0,5 kg porusza się z prędkością 10 m/s. Oblicz jej energię kinetyczną.",
                odpowiedzi: ["25 J", "5 J", "50 J"],
                prawidlowa: 0,
                wzor: "Eₖ = ½mv² = ½ · 0,5 · 10²",
                poziom: 2
            },
            {
                pytanie: "W obwodzie płynie prąd 2 A przy napięciu 12 V. Jaki jest opór odbiornika?",
                odpowiedzi: ["6 Ω", "24 Ω", "0,17 Ω"],
                prawidlowa: 0,
                wzor: "R = U / I = 12 / 2",
                poziom: 2
            },
            {
                pytanie: "Ciało spada swobodnie przez 2 s. Przyjmij g = 10 m/s² i pomiń opór powietrza. Jaką osiągnie prędkość?",
                odpowiedzi: ["20 m/s", "5 m/s", "40 m/s"],
                prawidlowa: 0,
                wzor: "v = gt = 10 · 2",
                poziom: 2
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

const informacjeProfilu = {
    kontakt: {
        tytul: "Kontakt",
        tresc: `<p>Masz pytanie, problem z kontem albo chcesz zgłosić błąd? Napisz na <a href="mailto:Inercjaup@gmail.com">Inercjaup@gmail.com</a>.</p><p>W wiadomości opisz krótko problem. Nigdy nie wysyłaj swojego hasła.</p>`
    },
    pomoc: {
        tytul: "Centrum pomocy",
        tresc: `
            <p class="wstep-pomocy">Inercja jest stale ulepszana i aktualizowana. Jeżeli nie znajdziesz tutaj odpowiedzi, napisz na <a href="mailto:Inercjaup@gmail.com">Inercjaup@gmail.com</a>.</p>
            <div class="lista-faq">
                <details>
                    <summary>Jak utworzyć konto?</summary>
                    <p>Na ekranie logowania wybierz „Utwórz nowy profil”, wpisz nazwę, adres email i hasło, a następnie potwierdź adres przez link otrzymany w wiadomości.</p>
                </details>
                <details>
                    <summary>Nie dostałem wiadomości z potwierdzeniem. Co zrobić?</summary>
                    <p>Sprawdź folder Spam lub Oferty i upewnij się, że podany adres jest poprawny. Dostarczenie wiadomości może potrwać kilka minut.</p>
                </details>
                <details>
                    <summary>Nie pamiętam hasła. Jak je odzyskać?</summary>
                    <p>Wybierz „Nie pamiętasz hasła?” na ekranie logowania i podaj email przypisany do konta. Otrzymasz wiadomość umożliwiającą ustawienie nowego hasła.</p>
                </details>
                <details>
                    <summary>Czym różni się tryb gościa od konta?</summary>
                    <p>Tryb gościa pozwala szybko rozpocząć naukę, ale jego postęp znika po zakończeniu sesji. Po zalogowaniu na konto wynik, odblokowane lekcje i wybrana ścieżka są zapisywane w chmurze oraz synchronizowane między urządzeniami.</p>
                </details>
                <details>
                    <summary>Jak zdobywa się punkty?</summary>
                    <p>Punkty otrzymujesz za prawidłowe odpowiedzi w quizach. Ich aktualną liczbę zobaczysz w profilu oraz na ekranach nauki.</p>
                </details>
                <details>
                    <summary>Dlaczego niektóre lekcje są zablokowane?</summary>
                    <p>Lekcje w danym temacie odblokowują się po kolei. Ukończ dostępną lekcję, aby przejść do następnej.</p>
                </details>
                <details>
                    <summary>Czy postęp przenosi się na inne urządzenie?</summary>
                    <p>Tak. Po zalogowaniu na konto punkty, odblokowane lekcje i wybrana ścieżka są synchronizowane przez Cloud Firestore. Na innym urządzeniu zaloguj się tym samym adresem email. Postęp gościa pozostaje tylko w bieżącej sesji.</p>
                </details>
                <details>
                    <summary>Jak usunąć konto i swoje dane?</summary>
                    <p>Wyślij wiadomość z adresu przypisanego do konta na <a href="mailto:Inercjaup@gmail.com?subject=Usuni%C4%99cie%20konta%20i%20danych">Inercjaup@gmail.com</a> z tematem „Usunięcie konta i danych”. Podaj jedynie adres konta — nie wysyłaj hasła. Właściciel serwisu potwierdzi przyjęcie prośby w wiadomości zwrotnej, a następnie ręcznie usunie konto z Firebase Authentication oraz powiązane odpowiedzi i zsynchronizowany postęp z Cloud Firestore. Dane zapisane w przeglądarce usuń samodzielnie, czyszcząc dane tej witryny.</p>
                </details>
                <details>
                    <summary>Jak zgłosić błąd lub zaproponować zmianę?</summary>
                    <p>Napisz na <a href="mailto:Inercjaup@gmail.com">Inercjaup@gmail.com</a>. Opisz, co się stało, z jakiego urządzenia korzystasz i na którym ekranie wystąpił problem.</p>
                </details>
            </div>`
    }
};

function ustawWidocznoscMenuProfilu(widoczne) {
    menuProfilu.hidden = !widoczne;
    przyciskProfilu.setAttribute("aria-expanded", String(widoczne));
}

function aktualizujProfil(uzytkownik) {
    const gosc = trybGoscia || uzytkownik?.isAnonymous || !uzytkownik;
    const nazwa = gosc ? "Gość" : (uzytkownik.displayName || "Użytkownik");
    const podpis = gosc ? "Sesja tymczasowa" : (uzytkownik.email || "Konto ucznia");
    const inicjal = nazwa.trim().charAt(0).toLocaleUpperCase("pl-PL") || "U";

    document.getElementById("sekcja-konta-profilu").hidden = gosc;
    document.getElementById("sekcja-goscia-profilu").hidden = !gosc;
    document.getElementById("nazwa-profilu").textContent = nazwa;
    document.getElementById("email-profilu").textContent = podpis;
    const inicjalProfilu = document.getElementById("inicjal-profilu");
    inicjalProfilu.textContent = gosc ? "" : inicjal;
    inicjalProfilu.classList.toggle("ikona-osoby", gosc);
    document.getElementById("inicjal-menu-profilu").textContent = inicjal;
    document.getElementById("wyloguj-uzytkownika").hidden = gosc;
    document.getElementById("wyloguj-uzytkownika").textContent = "Wyloguj";
    przyciskProfilu.setAttribute("aria-label", gosc ? "Zaloguj się lub utwórz konto" : "Otwórz swój profil");
    profilUzytkownika.hidden = false;
    pokazWynik();
}

function pokazKomunikat(element, tekst, sukces = false) {
    element.textContent = tekst;
    element.classList.toggle("sukces", sukces);
    element.hidden = false;
}

function ukryjKomunikat(element) {
    element.hidden = true;
    element.classList.remove("sukces");
}

function poprawnePreferencje(wartosc) {
    return wartosc
        && ["podstawowy", "sredni", "zaawansowany"].includes(wartosc.poziom)
        && ["wyszukiwarka", "social-media", "szkola", "znajomi", "inne"].includes(wartosc.zrodlo)
        && ["szkola", "ciekawosc", "praca", "inne"].includes(wartosc.cel);
}

function poprawnePunkty(wartosc) {
    const punkty = Number(wartosc);
    if (!Number.isFinite(punkty)) return 0;
    return Math.min(maksymalnePunkty, Math.max(0, Math.round(punkty)));
}

function poprawnePostepy(wartosc) {
    if (!wartosc || typeof wartosc !== "object" || Array.isArray(wartosc)) return {};

    return Object.fromEntries(
        Object.entries(wartosc)
            .slice(0, 1000)
            .map(([klucz, postep]) => [klucz, Math.min(100, Math.max(0, Number(postep) || 0))])
    );
}

function polaczStanyPostepu(pierwszyStan, drugiStan) {
    const pierwszyPostep = poprawnePostepy(pierwszyStan.lekcje);
    const drugiPostep = poprawnePostepy(drugiStan.lekcje);
    const lekcje = { ...pierwszyPostep };

    Object.entries(drugiPostep).forEach(([klucz, postep]) => {
        lekcje[klucz] = Math.max(lekcje[klucz] || 0, postep);
    });

    return {
        punkty: Math.max(poprawnePunkty(pierwszyStan.punkty), poprawnePunkty(drugiStan.punkty)),
        lekcje,
        preferencje: poprawnePreferencje(pierwszyStan.preferencje)
            ? pierwszyStan.preferencje
            : (poprawnePreferencje(drugiStan.preferencje) ? drugiStan.preferencje : {})
    };
}

function pobierzPostepyZMagazynu(magazyn, uid) {
    const prefiks = `fizyka-postep-${uid}-`;
    const postepy = {};
    for (let index = 0; index < magazyn.length; index++) {
        const klucz = magazyn.key(index);
        if (!klucz?.startsWith(prefiks)) continue;
        postepy[klucz.slice(prefiks.length)] = magazyn.getItem(klucz);
    }
    return poprawnePostepy(postepy);
}

function pobierzLokalnePreferencje(uid) {
    try {
        const zapisane = JSON.parse(localStorage.getItem(`fizyka-preferencje-${uid}`));
        return poprawnePreferencje(zapisane)
            ? { poziom: zapisane.poziom, zrodlo: zapisane.zrodlo, cel: zapisane.cel }
            : null;
    } catch {
        return null;
    }
}

function pobierzLokalnePostepy(uid) {
    return pobierzPostepyZMagazynu(localStorage, uid);
}

function przygotujStanKonta(uid = aktywnyUzytkownik) {
    return {
        uid,
        punkty: poprawnePunkty(wynikGracza),
        lekcje: pobierzLokalnePostepy(uid),
        preferencje: poprawnePreferencje(profilUcznia)
            ? { poziom: profilUcznia.poziom, zrodlo: profilUcznia.zrodlo, cel: profilUcznia.cel }
            : (pobierzLokalnePreferencje(uid) || {})
    };
}

function zapiszStanLokalnie(uid, stan) {
    wynikGracza = poprawnePunkty(stan.punkty);
    localStorage.setItem(`fizyka-wynik-${uid}`, String(wynikGracza));
    Object.entries(poprawnePostepy(stan.lekcje)).forEach(([klucz, postep]) => {
        localStorage.setItem(`fizyka-postep-${uid}-${klucz}`, String(postep));
    });
    if (poprawnePreferencje(stan.preferencje)) {
        profilUcznia = { ...stan.preferencje };
        localStorage.setItem(`fizyka-preferencje-${uid}`, JSON.stringify({
            ...profilUcznia,
            zapisano: new Date().toISOString()
        }));
    }
}

function zapiszPostepGosciaDoPrzeniesienia() {
    const stanGoscia = {
        punkty: poprawnePunkty(wynikGracza),
        lekcje: pobierzPostepyZMagazynu(sessionStorage, aktywnyUzytkownik),
        preferencje: poprawnePreferencje(profilUcznia) ? profilUcznia : {}
    };

    if (stanGoscia.punkty > 0
        || Object.keys(stanGoscia.lekcje).length > 0
        || poprawnePreferencje(stanGoscia.preferencje)) {
        sessionStorage.setItem(kluczPostepuDoPrzeniesienia, JSON.stringify(stanGoscia));
    }
}

function pobierzPostepGosciaDoPrzeniesienia() {
    try {
        const stan = JSON.parse(sessionStorage.getItem(kluczPostepuDoPrzeniesienia));
        if (!stan || typeof stan !== "object") return null;
        return {
            punkty: poprawnePunkty(stan.punkty),
            lekcje: poprawnePostepy(stan.lekcje),
            preferencje: poprawnePreferencje(stan.preferencje) ? stan.preferencje : {}
        };
    } catch {
        return null;
    }
}

function zapiszPostepKonta() {
    const uzytkownik = auth.currentUser;
    if (trybGoscia
        || !uzytkownik
        || uzytkownik.isAnonymous
        || uzytkownik.uid !== aktywnyUzytkownik
        || zsynchronizowanyUzytkownik !== uzytkownik.uid) {
        return Promise.resolve(false);
    }
    const stan = przygotujStanKonta(uzytkownik.uid);
    kolejkaZapisuPostepu = kolejkaZapisuPostepu
        .catch(() => undefined)
        .then(async () => {
            await setDoc(doc(firestore, "postepy", uzytkownik.uid), {
                ...stan,
                zaktualizowano: serverTimestamp()
            }, { merge: true });
            return true;
        })
        .catch(error => {
            console.warn("Nie udało się zsynchronizować postępu.", error.code);
            return false;
        });
    return kolejkaZapisuPostepu;
}

function synchronizujPostepKonta(uzytkownik) {
    if (aktywnaSynchronizacjaPostepu?.uid === uzytkownik.uid) {
        return aktywnaSynchronizacjaPostepu.obietnica;
    }

    const obietnica = (async () => {
        const lokalny = przygotujStanKonta(uzytkownik.uid);
        try {
            const migawka = await getDoc(doc(firestore, "postepy", uzytkownik.uid));
            const zdalny = migawka.exists() ? migawka.data() : {};
            const polaczonyStan = polaczStanyPostepu(zdalny, lokalny);
            zapiszStanLokalnie(uzytkownik.uid, polaczonyStan);
            zsynchronizowanyUzytkownik = uzytkownik.uid;
            const zapisanoWChmurze = await zapiszPostepKonta();
            return {
                preferencje: pobierzLokalnePreferencje(uzytkownik.uid),
                zapisanoWChmurze
            };
        } catch (error) {
            if (zsynchronizowanyUzytkownik === uzytkownik.uid) zsynchronizowanyUzytkownik = "";
            console.warn("Nie udało się pobrać postępu z chmury. Używam danych z tego urządzenia.", error.code);
            zapiszStanLokalnie(uzytkownik.uid, lokalny);
            return {
                preferencje: pobierzLokalnePreferencje(uzytkownik.uid),
                zapisanoWChmurze: false
            };
        }
    })();

    aktywnaSynchronizacjaPostepu = { uid: uzytkownik.uid, obietnica };
    return obietnica.finally(() => {
        if (aktywnaSynchronizacjaPostepu?.obietnica === obietnica) {
            aktywnaSynchronizacjaPostepu = null;
        }
    });
}

function synchronizujLubZapiszPostepKonta() {
    const uzytkownik = auth.currentUser;
    if (trybGoscia || !uzytkownik || uzytkownik.isAnonymous) return Promise.resolve(false);
    return zsynchronizowanyUzytkownik === uzytkownik.uid
        ? zapiszPostepKonta()
        : synchronizujPostepKonta(uzytkownik);
}

async function pokazEkranNauki(uzytkownik) {
    trybGoscia = false;
    aktywnyUzytkownik = uzytkownik.uid;
    zsynchronizowanyUzytkownik = "";
    profilUcznia = pobierzLokalnePreferencje(aktywnyUzytkownik);
    wynikGracza = Number(localStorage.getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
    localStorage.setItem("fizyka-aktywny-uzytkownik", aktywnyUzytkownik);
    const postepGoscia = pobierzPostepGosciaDoPrzeniesienia();
    if (postepGoscia) {
        zapiszStanLokalnie(aktywnyUzytkownik, polaczStanyPostepu(przygotujStanKonta(), postepGoscia));
    }
    const wynikSynchronizacji = await synchronizujPostepKonta(uzytkownik)
        .catch(error => {
            console.warn("Nie udało się zsynchronizować postępu konta.", error.code);
            return {
                preferencje: pobierzLokalnePreferencje(aktywnyUzytkownik),
                zapisanoWChmurze: false
            };
        });
    if (postepGoscia && wynikSynchronizacji.zapisanoWChmurze) {
        sessionStorage.removeItem(kluczPostepuDoPrzeniesienia);
    }
    aktualizujProfil(uzytkownik);
    ekranLogowania.style.display = "none";
    if (wynikSynchronizacji.preferencje) {
        profilUcznia = wynikSynchronizacji.preferencje;
        zastosujSciezke();
    } else {
        ekranStartowy.style.display = "block";
    }
    pokazWynik();
}

function pokazEkranLogowania() {
    ekranDialow.style.display = "none";
    ekranPodnagalowkow.style.display = "none";
    ekranLekcji.style.display = "none";
    ekranQuizu.style.display = "none";
    ekranStartowy.style.display = "none";
    ekranLogowania.style.display = "block";
    profilUzytkownika.hidden = true;
    ustawWidocznoscMenuProfilu(false);
}

function obserwujSesje() {
    onAuthStateChanged(auth, async uzytkownik => {
        if (trybGoscia) {
            if (uzytkownik && !uzytkownik.isAnonymous) {
                await signOut(auth);
                return;
            }
            aktywnyUzytkownik = uzytkownik?.uid || "gosc";
            aktualizujProfil(uzytkownik);
            ekranLogowania.style.display = "none";
            ekranStartowy.style.display = "block";
            return;
        }
        if (rejestracjaWToku) return;
        if (!uzytkownik) {
            aktywnyUzytkownik = "";
            return;
        }
        if (!uzytkownik.emailVerified) {
            await signOut(auth);
            pokazEkranLogowania();
            pokazKomunikat(document.getElementById("blad-logowania"), "Potwierdź adres email, korzystając z wiadomości od Firebase.");
            return;
        }
        await pokazEkranNauki(uzytkownik);
    });
}

document.getElementById("wyloguj-uzytkownika").addEventListener("click", async () => {
    if (trybGoscia) {
        wyczyscSesjeGoscia();
        trybGoscia = false;
        await signOut(auth);
    } else {
        await synchronizujLubZapiszPostepKonta();
        await signOut(auth);
    }
    aktywnyUzytkownik = "";
    wynikGracza = 0;
    profilUcznia = null;
    zsynchronizowanyUzytkownik = "";
    pokazEkranLogowania();
});

przyciskProfilu.addEventListener("click", () => {
    ustawWidocznoscMenuProfilu(menuProfilu.hidden);
});

document.addEventListener("click", event => {
    if (!profilUzytkownika.contains(event.target)) ustawWidocznoscMenuProfilu(false);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menuProfilu.hidden) {
        ustawWidocznoscMenuProfilu(false);
        przyciskProfilu.focus();
    }
});

document.querySelectorAll("[data-informacja]").forEach(przycisk => {
    przycisk.addEventListener("click", event => {
        event.preventDefault();
        const informacja = informacjeProfilu[przycisk.dataset.informacja];
        document.getElementById("tytul-informacji").textContent = informacja.tytul;
        document.getElementById("tresc-informacji").innerHTML = informacja.tresc;
        ustawWidocznoscMenuProfilu(false);
        oknoInformacji.showModal();
    });
});

oknoInformacji.addEventListener("click", event => {
    if (event.target === oknoInformacji) oknoInformacji.close();
});

async function przejdzZGosciaDoKonta(rejestracja = false) {
    zapiszPostepGosciaDoPrzeniesienia();
    wyczyscSesjeGoscia(true);
    trybGoscia = false;
    await signOut(auth);
    aktywnyUzytkownik = "";
    wynikGracza = 0;
    pokazEkranLogowania();
    if (rejestracja) document.getElementById("pokaz-rejestracje").click();
}

document.getElementById("zaloguj-z-profilu").addEventListener("click", () => {
    przejdzZGosciaDoKonta();
});

document.getElementById("zarejestruj-z-profilu").addEventListener("click", () => {
    przejdzZGosciaDoKonta(true);
});

document.getElementById("formularz-logowania").addEventListener("submit", async event => {
    event.preventDefault();
    const email = document.getElementById("email-uzytkownika").value.trim().toLowerCase();
    const haslo = document.getElementById("haslo-uzytkownika").value;
    const blad = document.getElementById("blad-logowania");
    const przycisk = event.submitter;

    ukryjKomunikat(blad);
    przycisk.disabled = true;
    przycisk.textContent = "Logowanie…";
    try {
        await gotowoscFirebase;
        const daneLogowania = await signInWithEmailAndPassword(auth, email, haslo);
        if (!daneLogowania.user.emailVerified) {
            await signOut(auth);
            pokazKomunikat(blad, "Najpierw potwierdź adres email, korzystając z otrzymanej wiadomości.");
        }
    } catch (error) {
        const komunikat = error.code === "auth/too-many-requests"
            ? "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie."
            : error.code === "auth/operation-not-allowed"
                ? "Logowanie Email/Hasło nie jest jeszcze włączone w Firebase."
                : "Nieprawidłowy email lub hasło.";
        pokazKomunikat(blad, komunikat);
    } finally {
        przycisk.disabled = false;
        przycisk.textContent = "Zaloguj i rozpocznij →";
    }
});

document.getElementById("resetuj-haslo").addEventListener("click", async () => {
    const emailPole = document.getElementById("email-uzytkownika");
    const blad = document.getElementById("blad-logowania");
    const email = emailPole.value.trim().toLowerCase();
    if (!emailPole.checkValidity()) {
        pokazKomunikat(blad, "Najpierw wpisz poprawny adres email.");
        emailPole.focus();
        return;
    }
    try {
        await gotowoscFirebase;
        await sendPasswordResetEmail(auth, email);
        pokazKomunikat(blad, "Jeśli konto istnieje, wiadomość do zmiany hasła została wysłana.", true);
    } catch (error) {
        const komunikat = error.code === "auth/too-many-requests"
            ? "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie."
            : "Nie udało się wysłać wiadomości. Spróbuj ponownie później.";
        pokazKomunikat(blad, komunikat);
    }
});

document.getElementById("kontynuuj-jako-gosc").addEventListener("click", async () => {
    await gotowoscFirebase;
    trybGoscia = true;
    sessionStorage.setItem("fizyka-tryb-goscia", "true");
    await signOut(auth);
    try {
        const daneGoscia = await signInAnonymously(auth);
        aktywnyUzytkownik = daneGoscia.user.uid;
    } catch (error) {
        aktywnyUzytkownik = "gosc";
        console.warn("Anonimowe logowanie Firebase nie jest dostępne.", error.code);
    }
    wynikGracza = 0;
    aktualizujProfil(auth.currentUser);
    ekranLogowania.style.display = "none";
    ekranStartowy.style.display = "block";
});

document.getElementById("pokaz-rejestracje").addEventListener("click", () => {
    document.getElementById("formularz-logowania").hidden = true;
    document.getElementById("formularz-rejestracji").hidden = false;
    document.getElementById("opcje-logowania").hidden = true;
    document.getElementById("tytul-profilu").textContent = "Utwórz profil";
    document.getElementById("opis-profilu").textContent = "Załóż profil, aby synchronizować wynik i odblokowane lekcje między urządzeniami.";
    document.getElementById("nowa-nazwa-uzytkownika").focus();
});

document.getElementById("powrot-do-logowania").addEventListener("click", () => {
    document.getElementById("formularz-rejestracji").hidden = true;
    document.getElementById("formularz-logowania").hidden = false;
    document.getElementById("opcje-logowania").hidden = false;
    document.getElementById("blad-rejestracji").hidden = true;
    document.getElementById("tytul-profilu").textContent = "Zaloguj się";
    document.getElementById("opis-profilu").textContent = "Twój profil synchronizuje wynik i odblokowane lekcje między urządzeniami.";
    document.getElementById("email-uzytkownika").focus();
});

document.getElementById("formularz-rejestracji").addEventListener("submit", async event => {
    event.preventDefault();
    const nazwa = document.getElementById("nowa-nazwa-uzytkownika").value.trim();
    const email = document.getElementById("nowy-email-uzytkownika").value.trim().toLowerCase();
    const haslo = document.getElementById("nowe-haslo-uzytkownika").value;
    const powtorzoneHaslo = document.getElementById("powtorz-haslo-uzytkownika").value;
    const blad = document.getElementById("blad-rejestracji");
    const przycisk = event.submitter;

    if (haslo !== powtorzoneHaslo) {
        pokazKomunikat(blad, "Hasła muszą być identyczne.");
        return;
    }

    ukryjKomunikat(blad);
    przycisk.disabled = true;
    przycisk.textContent = "Tworzenie profilu…";
    rejestracjaWToku = true;
    try {
        await gotowoscFirebase;
        const daneRejestracji = await createUserWithEmailAndPassword(auth, email, haslo);
        await updateProfile(daneRejestracji.user, { displayName: nazwa });
        await sendEmailVerification(daneRejestracji.user);
        await signOut(auth);
        document.getElementById("formularz-rejestracji").reset();
        document.getElementById("powrot-do-logowania").click();
        pokazKomunikat(document.getElementById("blad-logowania"), "Konto utworzone. Sprawdź email i potwierdź rejestrację.", true);
    } catch (error) {
        const komunikaty = {
            "auth/email-already-in-use": "Nie udało się utworzyć konta. Sprawdź dane lub spróbuj się zalogować.",
            "auth/invalid-email": "Podaj poprawny adres email.",
            "auth/weak-password": "Hasło jest zbyt słabe. Użyj co najmniej 8 znaków.",
            "auth/operation-not-allowed": "Rejestracja Email/Hasło nie jest jeszcze włączona w Firebase.",
            "auth/too-many-requests": "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie."
        };
        pokazKomunikat(blad, komunikaty[error.code] || "Nie udało się utworzyć konta. Spróbuj ponownie później.");
    } finally {
        rejestracjaWToku = false;
        przycisk.disabled = false;
        przycisk.textContent = "Utwórz profil →";
    }
});

async function zapiszPreferencjeWFirestore() {
    const uzytkownik = auth.currentUser;
    if (!uzytkownik) return false;

    try {
        await setDoc(doc(firestore, "odpowiedzi", uzytkownik.uid), {
            uid: uzytkownik.uid,
            nazwa: uzytkownik.isAnonymous ? "Gość" : (uzytkownik.displayName || "Użytkownik"),
            typKonta: uzytkownik.isAnonymous ? "gosc" : "konto",
            ...profilUcznia,
            zapisano: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.warn("Nie udało się zapisać odpowiedzi w Firestore.", error.code);
        return false;
    }
}

async function rozpocznijSciezke() {
    profilUcznia = {
        poziom: document.getElementById("poziom-fizyki").value,
        zrodlo: document.getElementById("zrodlo-strony").value,
        cel: document.getElementById("cel-fizyki").value
    };

    magazynDanych().setItem(`fizyka-preferencje-${aktywnyUzytkownik}`, JSON.stringify({
        ...profilUcznia,
        zapisano: new Date().toISOString()
    }));
    await Promise.all([zapiszPreferencjeWFirestore(), zapiszPostepKonta()]);
    zastosujSciezke();
}

function zastosujSciezke() {
    lekcjiWKole = 1;
    const priorytetyCelu = {
        szkola: ["mechanika", "termodynamika", "fale_drgania", "optyka"],
        ciekawosc: ["astronomia", "teoria_wzglednosci", "mechanika_kwantowa_jadrowa", "fizyka_materialow"],
        praca: ["mechanika", "elektromagnetyzm", "termodynamika", "fizyka_materialow"],
        inne: ["mechanika", "termodynamika", "optyka", "astronomia"]
    };
    const kolejnosc = priorytetyCelu[profilUcznia.cel] || priorytetyCelu.inne;
    const przyciskiDzialow = document.querySelector(".przyciski-dialow");
    [...przyciskiDzialow.children]
        .sort((pierwszy, drugi) => {
            const pozycjaPierwszego = kolejnosc.indexOf(pierwszy.dataset.dzial);
            const pozycjaDrugiego = kolejnosc.indexOf(drugi.dataset.dzial);
            return (pozycjaPierwszego === -1 ? 99 : pozycjaPierwszego) - (pozycjaDrugiego === -1 ? 99 : pozycjaDrugiego);
        })
        .forEach(przycisk => przyciskiDzialow.appendChild(przycisk));
    document.getElementById("ekran-startowy").style.display = "none";
    document.getElementById("ekran-dialow").style.display = "block";
    pokazWynik();
}

document.getElementById("formularz-startowy").addEventListener("submit", async event => {
    event.preventDefault();
    const przycisk = event.submitter;
    przycisk.disabled = true;
    przycisk.textContent = "Zapisywanie…";
    await rozpocznijSciezke();
    przycisk.disabled = false;
    przycisk.textContent = "Ułóż moją ścieżkę →";
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
    return Number(magazynDanych().getItem(kluczPostepu(pakiet)) || 0);
}

function ustawPostep(pakiet, procent) {
    const zaokraglonyPostep = Math.min(100, Math.round(procent));
    magazynDanych().setItem(kluczPostepu(pakiet), zaokraglonyPostep);
    void synchronizujLubZapiszPostepKonta();
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
        
        wymieszaj(pytanie.odpowiedzi.map((odpowiedz, index) => ({ odpowiedz, index }))).forEach(({ odpowiedz, index }) => {
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
                    magazynDanych().setItem(`fizyka-wynik-${aktywnyUzytkownik}`, wynikGracza);
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

function wymieszaj(tablica) {
    for (let i = tablica.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tablica[i], tablica[j]] = [tablica[j], tablica[i]];
    }
    return tablica;
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

const kalkulatorButton = document.getElementById("przycisk-kalkulatora");
const kalkulatorPanel = document.getElementById("kalkulator");
const kalkulatorDisplay = document.getElementById("kalkulator-wyswietlacz");
const kalkulatorWynik = document.getElementById("wynik-kalkulatora");
const kalkulatorHistoria = document.getElementById("kalkulator-historia");
let kalkulatorTryb = "deg";

if (kalkulatorButton && kalkulatorPanel) {
    kalkulatorButton.addEventListener("click", () => {
        kalkulatorPanel.hidden = !kalkulatorPanel.hidden;
        if (!kalkulatorPanel.hidden && kalkulatorDisplay) kalkulatorDisplay.focus();
    });
}

function dodajDoKalkulatora(wartosc) {
    if (!kalkulatorDisplay) return;
    const start = kalkulatorDisplay.selectionStart ?? kalkulatorDisplay.value.length;
    const end = kalkulatorDisplay.selectionEnd ?? kalkulatorDisplay.value.length;
    kalkulatorDisplay.value = kalkulatorDisplay.value.slice(0, start) + wartosc + kalkulatorDisplay.value.slice(end);
    kalkulatorDisplay.setSelectionRange(start + wartosc.length, start + wartosc.length);
    kalkulatorDisplay.focus();
}

function tokenizujWyrazenie(tekst) {
    const tokens = [];
    let i = 0;
    while (i < tekst.length) {
        const c = tekst[i];
        if (/\s/.test(c)) { i++; continue; }
        if (/[0-9.]/.test(c)) {
            const fragment = tekst.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
            if (!fragment) throw new Error("Nieprawidłowa liczba");
            tokens.push({type:"number", value:Number(fragment[0])}); i += fragment[0].length; continue;
        }
        if (/[a-zA-Zπ]/.test(c)) {
            const fragment = tekst.slice(i).match(/^(?:sqrt|sin|cos|tan|log|ln|abs|pi|π|e)/i);
            if (!fragment) throw new Error("Nieznana funkcja lub stała");
            tokens.push({type:"name", value:fragment[0].toLowerCase()}); i += fragment[0].length; continue;
        }
        if ("+-*/^()%".includes(c)) { tokens.push({type:"op", value:c}); i++; continue; }
        throw new Error("Niedozwolony znak");
    }
    return tokens;
}

function obliczWyrazenie(tekst) {
    const t = tokenizujWyrazenie(tekst);
    let p = 0;
    const peek = () => t[p];
    const match = (v) => peek()?.value === v ? (p++, true) : false;
    const funkcja = (name, x) => {
        const kat = kalkulatorTryb === "deg" ? x * Math.PI / 180 : x;
        if (name === "sqrt") return Math.sqrt(x);
        if (name === "sin") return Math.sin(kat);
        if (name === "cos") return Math.cos(kat);
        if (name === "tan") return Math.tan(kat);
        if (name === "log") return Math.log10(x);
        if (name === "ln") return Math.log(x);
        if (name === "abs") return Math.abs(x);
        throw new Error("Nieznana funkcja");
    };
    const primary = () => {
        if (match("+")) return primary();
        if (match("-")) return -primary();
        if (match("(")) { const x = expression(); if (!match(")")) throw new Error("Brakuje )"); return x; }
        const x = peek();
        if (!x) throw new Error("Niepełne wyrażenie");
        if (x.type === "number") { p++; return x.value; }
        if (x.type === "name") {
            p++;
            if (x.value === "pi" || x.value === "π") return Math.PI;
            if (x.value === "e") return Math.E;
            if (!match("(")) throw new Error("Po funkcji użyj (");
            const arg = expression();
            if (!match(")")) throw new Error("Brakuje )");
            return funkcja(x.value, arg);
        }
        throw new Error("Nieprawidłowe wyrażenie");
    };
    const power = () => { let x = primary(); if (match("^")) x = Math.pow(x, power()); return x; };
    const term = () => { let x = power(); while (peek() && (peek().value === "*" || peek().value === "/")) { const op=peek().value; p++; const y=power(); if(op==="/"&&y===0) throw new Error("Nie można dzielić przez zero"); x=op==="*"?x*y:x/y; } return x; };
    const expression = () => { let x=term(); while(peek()&&(peek().value==="+"||peek().value==="-")){const op=peek().value;p++;const y=term();x=op==="+"?x+y:x-y;} return x; };
    let wynik = expression();
    while (match("%")) wynik /= 100;
    if (p !== t.length) throw new Error("Sprawdź składnię wyrażenia");
    if (!Number.isFinite(wynik)) throw new Error("Wynik jest poza zakresem");
    return wynik;
}

function pokazWynikKalkulatora() {
    if (!kalkulatorDisplay || !kalkulatorWynik) return;
    try {
        const wynik = obliczWyrazenie(kalkulatorDisplay.value);
        const zaokraglony = Math.abs(wynik) < 1e-12 ? 0 : Number(wynik.toPrecision(12));
        kalkulatorWynik.textContent = `Wynik: ${zaokraglony}`;
        if (kalkulatorHistoria) kalkulatorHistoria.textContent = `${kalkulatorDisplay.value} = ${zaokraglony}`;
        kalkulatorDisplay.value = String(zaokraglony);
        kalkulatorDisplay.setSelectionRange(kalkulatorDisplay.value.length, kalkulatorDisplay.value.length);
    } catch (blad) {
        kalkulatorWynik.textContent = `Błąd: ${blad.message}`;
    }
}

document.querySelectorAll("#kalkulator .kalkulator-klawiatura [data-wartosc]").forEach((przycisk) => {
    przycisk.addEventListener("click", () => dodajDoKalkulatora(przycisk.dataset.wartosc));
});

document.getElementById("oblicz-kalkulator")?.addEventListener("click", pokazWynikKalkulatora);
document.getElementById("kalkulator-wyczysc")?.addEventListener("click", () => {
    kalkulatorDisplay.value = "";
    kalkulatorWynik.textContent = "Wynik pojawi się tutaj.";
    kalkulatorHistoria.textContent = "Gotowy";
    kalkulatorDisplay.focus();
});
document.getElementById("kalkulator-backspace")?.addEventListener("click", () => {
    const start=kalkulatorDisplay.selectionStart ?? kalkulatorDisplay.value.length;
    const end=kalkulatorDisplay.selectionEnd ?? start;
    if(start!==end) kalkulatorDisplay.setRangeText("",start,end,"start");
    else if(start>0) kalkulatorDisplay.setRangeText("",start-1,start,"start");
    kalkulatorDisplay.focus();
});

document.getElementById("kalkulator-stopnie")?.addEventListener("click", () => {
    kalkulatorTryb="deg";
    document.getElementById("kalkulator-stopnie").classList.add("aktywny");
    document.getElementById("kalkulator-radiany")?.classList.remove("aktywny");
});
document.getElementById("kalkulator-radiany")?.addEventListener("click", () => {
    kalkulatorTryb="rad";
    document.getElementById("kalkulator-radiany").classList.add("aktywny");
    document.getElementById("kalkulator-stopnie")?.classList.remove("aktywny");
});
kalkulatorDisplay?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); pokazWynikKalkulatora(); }
    if (event.key === "Escape") { kalkulatorDisplay.value=""; kalkulatorWynik.textContent="Wynik pojawi się tutaj."; }
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

if (window.location.hash === "#rejestracja") {
    document.getElementById("pokaz-rejestracje").click();
}

obserwujSesje();
