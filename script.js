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
const ekranDoswiadczen = document.getElementById("ekran-doswiadczen");
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

function magazynDanych() {
    return trybGoscia ? sessionStorage : localStorage;
}

function wyczyscSesjeGoscia() {
    Object.keys(sessionStorage)
        .filter(klucz => klucz.startsWith("fizyka-"))
        .forEach(klucz => sessionStorage.removeItem(klucz));
}

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
    document.getElementById("punkty-profilu").textContent = wynikGracza;
}

const informacjeProfilu = {
    regulamin: {
        tytul: "Regulamin",
        tresc: `<p>Regulamin jest przygotowywany. Przed publikacją uzupełnimy dane właściciela strony oraz zasady korzystania z kont, punktów i materiałów edukacyjnych.</p>`
    },
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
                    <p>Tryb gościa pozwala szybko rozpocząć naukę, ale jego postęp znika po zakończeniu sesji. Konto pozwala ponownie się zalogować, natomiast wynik i postęp są obecnie zapisywane w używanej przeglądarce.</p>
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
                    <p>Jeszcze nie. Wynik, odblokowane lekcje i część ustawień są przechowywane lokalnie w przeglądarce, dlatego mogą nie być widoczne na innym urządzeniu lub po wyczyszczeniu danych przeglądarki.</p>
                </details>
                <details>
                    <summary>Jak usunąć konto i swoje dane?</summary>
                    <p>Wyślij wiadomość z adresu przypisanego do konta na <a href="mailto:Inercjaup@gmail.com?subject=Usuni%C4%99cie%20konta%20i%20danych">Inercjaup@gmail.com</a> z tematem „Usunięcie konta i danych”. Podaj jedynie adres konta — nie wysyłaj hasła. Właściciel serwisu potwierdzi przyjęcie prośby w wiadomości zwrotnej, a następnie ręcznie usunie konto z Firebase Authentication oraz powiązane odpowiedzi z Cloud Firestore. Dane zapisane w przeglądarce usuń samodzielnie, czyszcząc dane tej witryny.</p>
                </details>
                <details>
                    <summary>Jak zgłosić błąd lub zaproponować zmianę?</summary>
                    <p>Napisz na <a href="mailto:Inercjaup@gmail.com">Inercjaup@gmail.com</a>. Opisz, co się stało, z jakiego urządzenia korzystasz i na którym ekranie wystąpił problem.</p>
                </details>
            </div>`
    },
    prywatnosc: {
        tytul: "Polityka prywatności",
        tresc: `
            <p><strong>Ostatnia aktualizacja: 9 września 2026 r.</strong></p>
            <h3>1. Administrator i kontakt</h3>
            <p>Administratorką danych serwisu Inercja jest Małgorzata Majchrzak, prowadząca serwis za zgodą przedstawiciela ustawowego. W sprawach dotyczących prywatności napisz na <a href="mailto:Inercjaup@gmail.com">Inercjaup@gmail.com</a>.</p>
            <h3>2. Jakie dane są przetwarzane?</h3>
            <p>Przy zakładaniu konta przetwarzane są nazwa użytkownika, adres email, identyfikator konta oraz dane niezbędne do logowania. Zapisywane są również odpowiedzi z formularza startowego: poziom fizyki, powód nauki i informacja, skąd użytkownik dowiedział się o stronie.</p>
            <p>Wynik, odblokowane lekcje, preferencje i część postępu są przechowywane lokalnie w pamięci przeglądarki. W trybie gościa dane sesji są tymczasowe.</p>
            <h3>3. Cele i podstawy przetwarzania</h3>
            <p>Dane są wykorzystywane do utworzenia i zabezpieczenia konta, logowania, dopasowania kolejności materiałów oraz działania i ulepszania serwisu. Dane nie są sprzedawane. Ich przetwarzanie jest niezbędne do świadczenia wybranych funkcji serwisu oraz wynika z uzasadnionego interesu polegającego na zapewnieniu bezpieczeństwa i rozwoju strony.</p>
            <h3>4. Usługi zewnętrzne</h3>
            <p>Inercja korzysta z Firebase Authentication i Cloud Firestore firmy Google do obsługi kont oraz odpowiedzi startowych, a także z GitHub Pages do udostępniania strony. Dostawcy mogą przetwarzać dane techniczne zgodnie z własnymi zasadami i lokalizacją swoich usług.</p>
            <h3>5. Jak długo przechowujemy dane?</h3>
            <p>Dane konta i powiązane odpowiedzi są przechowywane tak długo, jak konto jest używane, albo do otrzymania prośby o ich usunięcie. Dane lokalne pozostają w przeglądarce do czasu ich wyczyszczenia przez użytkownika. Niektóre informacje mogą być przechowywane dłużej wyłącznie wtedy, gdy wymagają tego przepisy lub jest to konieczne do zabezpieczenia roszczeń.</p>
            <h3>6. Usunięcie danych i pozostałe prawa</h3>
            <p>Aby poprosić o dostęp, poprawienie, ograniczenie przetwarzania, przeniesienie, sprzeciw albo usunięcie danych, wyślij wiadomość z adresu przypisanego do konta na <a href="mailto:Inercjaup@gmail.com?subject=Usuni%C4%99cie%20konta%20i%20danych">Inercjaup@gmail.com</a>. W temacie wpisz „Usunięcie konta i danych”. Nie podawaj hasła. Prośba zostanie potwierdzona w wiadomości zwrotnej, a usunięcie konta z Firebase Authentication i powiązanej odpowiedzi z Cloud Firestore zostanie wykonane ręcznie przez właściciela serwisu. Dane zapisane lokalnie użytkownik usuwa przez wyczyszczenie danych witryny w przeglądarce. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.</p>
            <h3>7. Osoby poniżej 16 lat</h3>
            <p>Z serwisu mogą korzystać osoby poniżej 16 lat. Jeśli w przypadku konkretnej funkcji wymagana będzie zgoda na przetwarzanie danych, zgodę powinien wyrazić lub zatwierdzić rodzic albo opiekun prawny zgodnie z obowiązującymi przepisami.</p>
            <h3>8. Reklamy i analityka</h3>
            <p>Obecnie serwis nie używa reklam, newslettera ani narzędzi analitycznych. Jeżeli zostaną dodane w przyszłości, ta polityka zostanie wcześniej zaktualizowana, a tam, gdzie będzie to wymagane, użytkownik zostanie poproszony o zgodę.</p>`
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

function pokazEkranNauki(uzytkownik) {
    trybGoscia = false;
    aktywnyUzytkownik = uzytkownik.uid;
    wynikGracza = Number(localStorage.getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
    aktualizujProfil(uzytkownik);
    ekranLogowania.style.display = "none";
    ekranStartowy.style.display = "block";
    pokazWynik();
}

function pokazEkranLogowania() {
    ekranDialow.style.display = "none";
    ekranPodnagalowkow.style.display = "none";
    ekranLekcji.style.display = "none";
    ekranQuizu.style.display = "none";
    ekranDoswiadczen.hidden = true;
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
        pokazEkranNauki(uzytkownik);
    });
}

document.getElementById("wyloguj-uzytkownika").addEventListener("click", async () => {
    if (trybGoscia) {
        wyczyscSesjeGoscia();
        trybGoscia = false;
        await signOut(auth);
    } else {
        await signOut(auth);
    }
    aktywnyUzytkownik = "";
    wynikGracza = 0;
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
    przycisk.addEventListener("click", () => {
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
    wyczyscSesjeGoscia();
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
    document.getElementById("opis-profilu").textContent = "Załóż lokalny profil, aby zapisywać wynik i odblokowane lekcje w tej przeglądarce.";
    document.getElementById("nowa-nazwa-uzytkownika").focus();
});

document.getElementById("powrot-do-logowania").addEventListener("click", () => {
    document.getElementById("formularz-rejestracji").hidden = true;
    document.getElementById("formularz-logowania").hidden = false;
    document.getElementById("opcje-logowania").hidden = false;
    document.getElementById("blad-rejestracji").hidden = true;
    document.getElementById("tytul-profilu").textContent = "Zaloguj się";
    document.getElementById("opis-profilu").textContent = "Twój profil zapisuje wynik i odblokowane lekcje w tej przeglądarce.";
    document.getElementById("nazwa-uzytkownika").focus();
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
    await zapiszPreferencjeWFirestore();

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
    return Number(magazynDanych().getItem(kluczPostepu(pakiet)) || 0);
}

function ustawPostep(pakiet, procent) {
    const zaokraglonyPostep = Math.min(100, Math.round(procent));
    magazynDanych().setItem(kluczPostepu(pakiet), zaokraglonyPostep);
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

obserwujSesje();
