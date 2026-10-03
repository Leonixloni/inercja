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

// Baza danych - rozbudowana baza działów i podtematów
const baza = {
    termodynamika: { emoji: "⚙️", nazwa: "Termodynamika", podnagalowki: {
        temperatura_i_cieplo: [
            { temat: "Skale temperatur", quiz: [{ pytanie: "Temperatura 25°C odpowiada ilu kelwinom?", odpowiedzi: ["298 K", "248 K", "325 K"], prawidlowa: 0 }, { pytanie: "Temperatura 310 K to około ile °C?", odpowiedzi: ["37°C", "310°C", "-37°C"], prawidlowa: 0 }, { pytanie: "O ile kelwinów zmieni się temperatura z 280 K do 300 K?", odpowiedzi: ["20 K", "580 K", "10 K"], prawidlowa: 0 }] },
            { temat: "Pomiar temperatury", quiz: [{ pytanie: "Termometr wskazuje 18°C, a po ogrzaniu 43°C. O ile wzrosła temperatura?", odpowiedzi: ["25°C", "61°C", "18°C"], prawidlowa: 0 }, { pytanie: "Która wielkość jest bezpośrednio mierzona termometrem?", odpowiedzi: ["Temperatura", "Ciepło właściwe", "Moc"], prawidlowa: 0 }, { pytanie: "Dwa termometry pokazują 20°C i 68°F. Które wskazania odpowiadają tej samej temperaturze?", odpowiedzi: ["Są w przybliżeniu równe", "68°F to 68°C", "20°C to 20 K"], prawidlowa: 0 }] },
            { temat: "Ciepło właściwe", quiz: [{ pytanie: "Ile energii potrzeba, aby ogrzać 2 kg wody o 5°C? c=4200 J/(kg·°C).", odpowiedzi: ["42 000 J", "8 400 J", "2 100 J"], prawidlowa: 0 }, { pytanie: "Który materiał potrzebuje więcej energii do ogrzania 1 kg o 10°C, jeśli ma większe c?", odpowiedzi: ["Materiał o większym c", "Materiał o mniejszym c", "Oba zawsze tyle samo"], prawidlowa: 0 }, { pytanie: "Dostarczono 8400 J do 1 kg wody. O ile wzrośnie jej temperatura? c=4200 J/(kg·°C).", odpowiedzi: ["2°C", "0,5°C", "4°C"], prawidlowa: 0 }] }
        ],
        przemiany_i_energia: [
            { temat: "Energia wewnętrzna", quiz: [{ pytanie: "Gaz otrzymał 500 J ciepła i wykonał 200 J pracy. O ile zmieniła się jego energia wewnętrzna?", odpowiedzi: ["300 J", "700 J", "-300 J"], prawidlowa: 0 }, { pytanie: "Który proces może zwiększyć energię wewnętrzną bez dopływu ciepła?", odpowiedzi: ["Wykonanie pracy nad układem", "Tylko chłodzenie", "Tylko topnienie"], prawidlowa: 0 }, { pytanie: "Jeśli energia wewnętrzna układu wzrosła o 150 J, co oznacza znak dodatni tej zmiany?", odpowiedzi: ["Układ zwiększył swoją energię wewnętrzną", "Układ stracił 150 J", "Praca zawsze wyniosła 0"], prawidlowa: 0 }] },
            { temat: "Praca i energia cieplna", quiz: [{ pytanie: "Siła 20 N przesuwa tłok o 0,3 m w swoim kierunku. Jaką pracę wykonuje?", odpowiedzi: ["6 J", "60 J", "0,015 J"], prawidlowa: 0 }, { pytanie: "Gaz wykonał 800 J pracy, pobierając 1200 J ciepła. Jaka była zmiana energii wewnętrznej?", odpowiedzi: ["400 J", "2000 J", "-400 J"], prawidlowa: 0 }, { pytanie: "W jakiej jednostce SI podaje się pracę?", odpowiedzi: ["J", "W", "Pa"], prawidlowa: 0 }] },
            { temat: "Przemiany gazowe", quiz: [{ pytanie: "Gaz ma temperaturę 300 K. Przy stałym ciśnieniu ogrzano go do 600 K. Jak zmieni się jego objętość?", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się"], prawidlowa: 0 }, { pytanie: "W przemianie izochorycznej stała pozostaje przede wszystkim:", odpowiedzi: ["Objętość", "Ciśnienie", "Temperatura"], prawidlowa: 0 }, { pytanie: "W przemianie izotermicznej gazu stała pozostaje:", odpowiedzi: ["Temperatura", "Objętość", "Masa molowa"], prawidlowa: 0 }] }
        ]
    }},
    mechanika: { emoji: "🏃", nazwa: "Mechanika", podnagalowki: {
        kinematyka: [
            { temat: "Ruch jednostajny", quiz: [{ pytanie: "Ciało przebywa 150 m w 12 s. Jaka jest jego prędkość?", odpowiedzi: ["12,5 m/s", "1,25 m/s", "1800 m/s"], prawidlowa: 0 }, { pytanie: "Na wykresie s(t) dla ruchu jednostajnego nachylenie prostej oznacza:", odpowiedzi: ["Prędkość", "Masę", "Siłę"], prawidlowa: 0 }, { pytanie: "Pojazd jedzie 20 m/s przez 30 s. Jaką drogę pokona?", odpowiedzi: ["600 m", "60 m", "150 m"], prawidlowa: 0 }] },
            { temat: "Ruch przyspieszony", quiz: [{ pytanie: "Prędkość wzrosła z 4 do 16 m/s w 6 s. Jakie jest średnie przyspieszenie?", odpowiedzi: ["2 m/s²", "12 m/s²", "20 m/s²"], prawidlowa: 0 }, { pytanie: "Ciało startuje z v0=2 m/s i a=3 m/s². Jaka będzie prędkość po 4 s?", odpowiedzi: ["14 m/s", "12 m/s", "5 m/s"], prawidlowa: 0 }, { pytanie: "W ruchu jednostajnie przyspieszonym wykres v(t) ma kształt:", odpowiedzi: ["Prostej o stałym nachyleniu", "Okręgu", "Poziomej krzywej zawsze"], prawidlowa: 0 }] },
            { temat: "Wykresy ruchu", quiz: [{ pytanie: "Na wykresie v(t) pole pod wykresem w przedziale czasu odpowiada:", odpowiedzi: ["Przemieszczeniu", "Przyspieszeniu", "Masie"], prawidlowa: 0 }, { pytanie: "Na wykresie a(t) pozioma linia powyżej zera oznacza:", odpowiedzi: ["Stałe dodatnie przyspieszenie", "Stałą drogę", "Brak ruchu"], prawidlowa: 0 }, { pytanie: "Na wykresie s(t) pozioma linia oznacza, że ciało:", odpowiedzi: ["Spoczywa", "Ma stałe przyspieszenie", "Porusza się coraz szybciej"], prawidlowa: 0 }] }
        ],
        dynamika_i_statyka: [
            { temat: "Zasady Newtona", quiz: [{ pytanie: "Na ciało 3 kg działa wypadkowa siła 12 N. Jakie ma przyspieszenie?", odpowiedzi: ["4 m/s²", "36 m/s²", "0,25 m/s²"], prawidlowa: 0 }, { pytanie: "Jeśli wypadkowa siła działająca na ciało wynosi 0, ciało może:", odpowiedzi: ["Spoczywać lub poruszać się ruchem jednostajnym", "Zawsze przyspieszać", "Zawsze hamować"], prawidlowa: 0 }, { pytanie: "Dwie siły 8 N i 5 N działają w przeciwnych kierunkach. Wypadkowa ma wartość:", odpowiedzi: ["3 N", "13 N", "40 N"], prawidlowa: 0 }] },
            { temat: "Tarcie", quiz: [{ pytanie: "Ciało 5 kg porusza się po poziomej powierzchni. μ=0,2, g=10 m/s². Siła tarcia wynosi:", odpowiedzi: ["10 N", "2 N", "50 N"], prawidlowa: 0 }, { pytanie: "Jeśli siła nacisku wzrośnie dwukrotnie, a μ pozostanie stałe, tarcie kinetyczne:", odpowiedzi: ["Wzrośnie dwukrotnie", "Zmniejszy się dwukrotnie", "Nie zmieni się"], prawidlowa: 0 }, { pytanie: "Współczynnik tarcia jest:", odpowiedzi: ["Bezjednostkowy", "Podawany w niutonach", "Podawany w paskalach"], prawidlowa: 0 }] },
            { temat: "Równowaga i moment siły", quiz: [{ pytanie: "Siła 10 N działa prostopadle do ramienia 0,4 m. Moment siły wynosi:", odpowiedzi: ["4 N·m", "25 N·m", "0,04 N·m"], prawidlowa: 0 }, { pytanie: "Dźwignia jest w równowadze, gdy momenty sił względem osi są:", odpowiedzi: ["Równe co do wartości i przeciwne zwrotem", "Zawsze dodatnie", "Zawsze równe zeru osobno"], prawidlowa: 0 }, { pytanie: "Wydłużenie ramienia siły 2 razy przy tej samej sile powoduje moment:", odpowiedzi: ["2 razy większy", "2 razy mniejszy", "Bez zmiany"], prawidlowa: 0 }] }
        ],
        grawitacja_i_plyny: [
            { temat: "Grawitacja", quiz: [{ pytanie: "Odległość między dwiema masami wzrasta z r do 2r. Siła grawitacji:", odpowiedzi: ["Maleje 4 razy", "Maleje 2 razy", "Rośnie 4 razy"], prawidlowa: 0 }, { pytanie: "Masa ciała 5 kg przy g=10 m/s². Jaki jest jego ciężar?", odpowiedzi: ["50 N", "5 N", "500 N"], prawidlowa: 0 }, { pytanie: "Co dzieje się z siłą grawitacji, gdy jedna z mas zostaje podwojona?", odpowiedzi: ["Rośnie 2 razy", "Maleje 2 razy", "Nie zmienia się"], prawidlowa: 0 }] },
            { temat: "Ciśnienie hydrostatyczne", quiz: [{ pytanie: "Jakie ciśnienie hydrostatyczne wywiera woda na głębokości 2 m? ρ=1000 kg/m³, g=10 m/s².", odpowiedzi: ["20 000 Pa", "5 000 Pa", "2 000 Pa"], prawidlowa: 0 }, { pytanie: "Ciśnienie hydrostatyczne zależy od głębokości:", odpowiedzi: ["Wprost proporcjonalnie", "Odwrotnie proporcjonalnie", "Nie zależy"], prawidlowa: 0 }, { pytanie: "Na tej samej głębokości w tej samej cieczy ciśnienie jest:", odpowiedzi: ["Takie samo niezależnie od kształtu naczynia", "Zawsze większe w szerokim naczyniu", "Zawsze mniejsze w wąskim"], prawidlowa: 0 }] },
            { temat: "Prawo Archimedesa", quiz: [{ pytanie: "Ciało wypiera 0,002 m³ wody. Jaka jest siła wyporu? ρ=1000 kg/m³, g=10 m/s².", odpowiedzi: ["20 N", "2 N", "200 N"], prawidlowa: 0 }, { pytanie: "Siła wyporu działa na zanurzone ciało:", odpowiedzi: ["Pionowo ku górze", "Pionowo w dół", "Poziomo"], prawidlowa: 0 }, { pytanie: "Jeśli objętość wypartej cieczy wzrośnie 2 razy, siła wyporu:", odpowiedzi: ["Wzrośnie 2 razy", "Zmniejszy się 2 razy", "Nie zmieni się"], prawidlowa: 0 }] }
        ]
    }},
    elektromagnetyzm: { emoji: "⚡", nazwa: "Elektromagnetyzm", podnagalowki: {
        elektrostatyka: [
            { temat: "Ładunek elektryczny", quiz: [{ pytanie: "Przez przewodnik płynie 2 A przez 5 s. Jaki ładunek przepłynął?", odpowiedzi: ["10 C", "0,4 C", "2,5 C"], prawidlowa: 0 }, { pytanie: "Elektron ma ładunek:", odpowiedzi: ["Ujemny", "Dodatni", "Zawsze zerowy"], prawidlowa: 0 }, { pytanie: "Jednostką ładunku elektrycznego jest:", odpowiedzi: ["Kulomb", "Amper", "Wolt"], prawidlowa: 0 }] },
            { temat: "Prawo Coulomba", quiz: [{ pytanie: "Jeśli odległość między ładunkami wzrośnie 2 razy, siła Coulomba:", odpowiedzi: ["Zmaleje 4 razy", "Zmaleje 2 razy", "Wzrośnie 4 razy"], prawidlowa: 0 }, { pytanie: "Dwa ładunki mają wartości 2 μC i 3 μC. Ich iloczyn wynosi:", odpowiedzi: ["6 μC²", "5 μC", "1,5 μC²"], prawidlowa: 0 }, { pytanie: "Ładunki jednoimienne w elektrostatyce:", odpowiedzi: ["Odpychają się", "Przyciągają się", "Nie oddziałują"], prawidlowa: 0 }] },
            { temat: "Pole elektryczne", quiz: [{ pytanie: "Na ładunek 2 μC działa siła 0,01 N. Natężenie pola wynosi:", odpowiedzi: ["5000 N/C", "0,00002 N/C", "200 N/C"], prawidlowa: 0 }, { pytanie: "Linie pola elektrycznego wychodzą z ładunku dodatniego:", odpowiedzi: ["Na zewnątrz", "Do środka", "Tylko pionowo"], prawidlowa: 0 }, { pytanie: "Jednostką natężenia pola elektrycznego może być:", odpowiedzi: ["N/C", "C/N", "J/s"], prawidlowa: 0 }] }
        ],
        prad_i_obwody: [
            { temat: "Prąd elektryczny", quiz: [{ pytanie: "Przez przekrój przewodnika przepływa 12 C w 4 s. Natężenie prądu wynosi:", odpowiedzi: ["3 A", "48 A", "0,33 A"], prawidlowa: 0 }, { pytanie: "Amperomierz włącza się do obwodu:", odpowiedzi: ["Szeregowo", "Równolegle", "Poza obwodem"], prawidlowa: 0 }, { pytanie: "Konwencjonalny kierunek prądu w obwodzie zewnętrznym przyjmuje się od:", odpowiedzi: ["Bieguna dodatniego do ujemnego", "Ujemnego do dodatniego", "Środka baterii"], prawidlowa: 0 }] },
            { temat: "Prawo Ohma", quiz: [{ pytanie: "Do opornika 12 Ω przyłożono 24 V. Jaki prąd płynie?", odpowiedzi: ["2 A", "0,5 A", "36 A"], prawidlowa: 0 }, { pytanie: "Przy stałym napięciu opór wzrasta 3 razy. Natężenie prądu:", odpowiedzi: ["Maleje 3 razy", "Rośnie 3 razy", "Nie zmienia się"], prawidlowa: 0 }, { pytanie: "Woltomierz podłącza się:", odpowiedzi: ["Równolegle", "Szeregowo", "Tylko do źródła"], prawidlowa: 0 }] },
            { temat: "Moc i energia prądu", quiz: [{ pytanie: "Urządzenie pracuje przy 230 V i pobiera 2 A. Jaka jest jego moc?", odpowiedzi: ["460 W", "115 W", "232 W"], prawidlowa: 0 }, { pytanie: "Żarówka 100 W działa przez 10 s. Zużyta energia wynosi:", odpowiedzi: ["1000 J", "100 J", "10 J"], prawidlowa: 0 }, { pytanie: "Jednostką mocy elektrycznej jest:", odpowiedzi: ["W", "J", "C"], prawidlowa: 0 }] }
        ],
        magnetyzm_i_indukcja: [
            { temat: "Pole magnetyczne", quiz: [{ pytanie: "Przewodnik 0,5 m jest prostopadły do pola 0,4 T i płynie w nim 2 A. Siła magnetyczna wynosi:", odpowiedzi: ["0,4 N", "4 N", "0,1 N"], prawidlowa: 0 }, { pytanie: "Jednostką indukcji magnetycznej jest:", odpowiedzi: ["tesla", "weber na metr?", "kulomb"], prawidlowa: 0 }, { pytanie: "Bieguny magnetyczne jednoimienne:", odpowiedzi: ["Odpychają się", "Przyciągają się", "Nie oddziałują"], prawidlowa: 0 }] },
            { temat: "Siła Lorentza", quiz: [{ pytanie: "Naładowana cząstka porusza się prostopadle do pola. Po podwojeniu prędkości siła Lorentza:", odpowiedzi: ["Rośnie 2 razy", "Maleje 2 razy", "Nie zmienia się"], prawidlowa: 0 }, { pytanie: "Siła Lorentza na nieruchomy ładunek w polu magnetycznym wynosi:", odpowiedzi: ["0", "qB", "Zawsze 1 N"], prawidlowa: 0 }, { pytanie: "Gdy prędkość cząstki jest równoległa do pola magnetycznego, siła magnetyczna:", odpowiedzi: ["Wynosi 0", "Jest maksymalna", "Zależy tylko od masy"], prawidlowa: 0 }] },
            { temat: "Indukcja elektromagnetyczna", quiz: [{ pytanie: "Zmiana strumienia magnetycznego przez obwód może wywołać:", odpowiedzi: ["Siłę elektromotoryczną", "Zmianę masy przewodnika", "Zanik ładunku"], prawidlowa: 0 }, { pytanie: "Szybsza zmiana strumienia oznacza zwykle wartość SEM:", odpowiedzi: ["Większą", "Mniejszą", "Zawsze zerową"], prawidlowa: 0 }, { pytanie: "Zjawisko indukcji elektromagnetycznej wykorzystuje:", odpowiedzi: ["Generator", "Termometr rtęciowy", "Barometr"], prawidlowa: 0 }] }
        ]
    }},
    fale_drgania: { emoji: "〰️", nazwa: "Fale i Drgania", podnagalowki: {
        drgania: [
            { temat: "Ruch harmoniczny", quiz: [{ pytanie: "Oscylator ma częstotliwość 2 Hz. Okres wynosi:", odpowiedzi: ["0,5 s", "2 s", "4 s"], prawidlowa: 0 }, { pytanie: "W ruchu harmonicznym w położeniu równowagi prędkość jest:", odpowiedzi: ["Maksymalna", "Zawsze zerowa", "Równa amplitudzie"], prawidlowa: 0 }, { pytanie: "Amplituda to:", odpowiedzi: ["Maksymalne wychylenie od równowagi", "Czas jednego drgania", "Liczba drgań na sekundę"], prawidlowa: 0 }] },
            { temat: "Okres i częstotliwość", quiz: [{ pytanie: "Źródło wykonuje 120 drgań w 2 s. Częstotliwość wynosi:", odpowiedzi: ["60 Hz", "240 Hz", "0,0167 Hz"], prawidlowa: 0 }, { pytanie: "Jeśli okres wynosi 0,25 s, częstotliwość wynosi:", odpowiedzi: ["4 Hz", "0,25 Hz", "2 Hz"], prawidlowa: 0 }, { pytanie: "Zwiększenie częstotliwości 2 razy powoduje okres:", odpowiedzi: ["2 razy mniejszy", "2 razy większy", "bez zmiany"], prawidlowa: 0 }] },
            { temat: "Energia drgań", quiz: [{ pytanie: "W idealnym oscylatorze bez strat całkowita energia drgań:", odpowiedzi: ["Jest stała", "Rośnie liniowo", "Zawsze wynosi 0"], prawidlowa: 0 }, { pytanie: "W maksymalnym wychyleniu sprężyny energia potencjalna jest:", odpowiedzi: ["Maksymalna", "Zawsze zerowa", "Ujemna"], prawidlowa: 0 }, { pytanie: "Tłumienie drgań powoduje z czasem:", odpowiedzi: ["Zmniejszanie amplitudy", "Wzrost amplitudy", "Brak zmian"], prawidlowa: 0 }] }
        ],
        fale_mechaniczne: [
            { temat: "Parametry fali", quiz: [{ pytanie: "Fala ma λ=0,5 m i f=6 Hz. Prędkość wynosi:", odpowiedzi: ["3 m/s", "12 m/s", "0,083 m/s"], prawidlowa: 0 }, { pytanie: "Jeśli częstotliwość fali wzrośnie 2 razy w tym samym ośrodku, długość fali:", odpowiedzi: ["Zmniejszy się 2 razy", "Wzrośnie 2 razy", "Nie zmieni się"], prawidlowa: 0 }, { pytanie: "Jednostką długości fali jest:", odpowiedzi: ["metr", "herc", "sekunda"], prawidlowa: 0 }] },
            { temat: "Fale poprzeczne i podłużne", quiz: [{ pytanie: "Fala na sprężynie, w której zwoje zagęszczają się i rozrzedzają, jest:", odpowiedzi: ["Podłużna", "Poprzeczna", "Elektromagnetyczna"], prawidlowa: 0 }, { pytanie: "Fala na napiętej linie może być:", odpowiedzi: ["Poprzeczna", "Tylko podłużna", "Zawsze elektromagnetyczna"], prawidlowa: 0 }, { pytanie: "Fala mechaniczna wymaga do rozchodzenia się:", odpowiedzi: ["Ośrodka materialnego", "Zawsze próżni", "Wyłącznie metalu"], prawidlowa: 0 }] },
            { temat: "Interferencja i dyfrakcja fal", quiz: [{ pytanie: "Dwie fale zgodne w fazie nakładają się. Może wystąpić:", odpowiedzi: ["Wzmocnienie", "Zawsze całkowite wygaszenie", "Zmiana źródła"], prawidlowa: 0 }, { pytanie: "Dyfrakcja jest szczególnie wyraźna, gdy rozmiar przeszkody jest:", odpowiedzi: ["Porównywalny z długością fali", "Milion razy większy od fali", "Zawsze zerowy"], prawidlowa: 0 }, { pytanie: "Interferencja dotyczy:", odpowiedzi: ["Nakładania się fal", "Tylko odbicia od lustra", "Tylko fal dźwiękowych"], prawidlowa: 0 }] }
        ],
        akustyka: [
            { temat: "Dźwięk", quiz: [{ pytanie: "Dźwięk 440 Hz w powietrzu 343 m/s ma długość około:", odpowiedzi: ["0,78 m", "1,28 m", "343 m"], prawidlowa: 0 }, { pytanie: "Człowiek słyszy dźwięk o częstotliwości:", odpowiedzi: ["20 Hz–20 kHz w przybliżeniu", "1–5 Hz", "100–1000 kHz"], prawidlowa: 0 }, { pytanie: "Głośność dźwięku jest związana przede wszystkim z:", odpowiedzi: ["Amplitudą drgań", "Długością fali wyłącznie", "Masą źródła"], prawidlowa: 0 }] },
            { temat: "Efekt Dopplera", quiz: [{ pytanie: "Gdy źródło dźwięku zbliża się do obserwatora, obserwowana częstotliwość:", odpowiedzi: ["Rośnie", "Maleje", "Zawsze wynosi 0"], prawidlowa: 0 }, { pytanie: "Syrena oddala się od stojącego obserwatora. Ton staje się:", odpowiedzi: ["Niższy", "Wyższy", "Nie zmienia się"], prawidlowa: 0 }, { pytanie: "Efekt Dopplera wynika z:", odpowiedzi: ["Ruchu względnego źródła i obserwatora", "Zmiany masy fali", "Zaniku ośrodka"], prawidlowa: 0 }] },
            { temat: "Natężenie dźwięku", quiz: [{ pytanie: "Natężenie fali jest mocą przypadającą na:", odpowiedzi: ["Jednostkę powierzchni", "Jednostkę masy", "Jednostkę czasu"], prawidlowa: 0 }, { pytanie: "Jednostką natężenia dźwięku w SI jest:", odpowiedzi: ["W/m²", "W", "Hz"], prawidlowa: 0 }, { pytanie: "Oddalenie od punktowego źródła powoduje spadek natężenia zgodnie z prawem odwrotności:", odpowiedzi: ["Kwadratu odległości", "Pierwszej potęgi masy", "Czasu"], prawidlowa: 0 }] }
        ]
    }},
    optyka: { emoji: "💡", nazwa: "Optyka", podnagalowki: {
        optyka_geometryczna: [
            { temat: "Odbicie światła", quiz: [{ pytanie: "Promień pada pod kątem 35° do normalnej. Kąt odbicia wynosi:", odpowiedzi: ["35°", "55°", "70°"], prawidlowa: 0 }, { pytanie: "Kąt padania mierzy się względem:", odpowiedzi: ["Normalnej do powierzchni", "Samej powierzchni", "Kierunku pionowego zawsze"], prawidlowa: 0 }, { pytanie: "W lustrze płaskim obraz jest:", odpowiedzi: ["Pozorny i tej samej wielkości", "Rzeczywisty i pomniejszony", "Zawsze odwrócony do góry nogami"], prawidlowa: 0 }] },
            { temat: "Załamanie światła", quiz: [{ pytanie: "Światło przechodzi z powietrza do szkła. Jego prędkość:", odpowiedzi: ["Maleje", "Rośnie", "Nie zmienia się"], prawidlowa: 0 }, { pytanie: "Przy przejściu światła do ośrodka o większym współczynniku załamania kąt względem normalnej zwykle:", odpowiedzi: ["Maleje", "Rośnie", "Staje się 90°"], prawidlowa: 0 }, { pytanie: "Częstotliwość światła przy przejściu między ośrodkami:", odpowiedzi: ["Pozostaje taka sama", "Zawsze maleje 2 razy", "Rośnie do nieskończoności"], prawidlowa: 0 }] },
            { temat: "Zwierciadła sferyczne", quiz: [{ pytanie: "Zwierciadło wklęsłe może wytworzyć obraz rzeczywisty, gdy przedmiot znajduje się:", odpowiedzi: ["W odpowiednim położeniu przed ogniskiem", "Zawsze za zwierciadłem", "Tylko w ognisku"], prawidlowa: 0 }, { pytanie: "Ogniskowa zwierciadła sferycznego jest związana z promieniem krzywizny przez:", odpowiedzi: ["f=R/2", "f=2R", "f=R²"], prawidlowa: 0 }, { pytanie: "Zwierciadło wypukłe tworzy dla rzeczywistego przedmiotu obraz:", odpowiedzi: ["Pozorny, prosty i pomniejszony", "Rzeczywisty i powiększony", "Zawsze odwrócony i większy"], prawidlowa: 0 }] }
        ],
        soczewki_i_przyrzady: [
            { temat: "Soczewka skupiająca", quiz: [{ pytanie: "Soczewka skupiająca ma f=20 cm. Jej zdolność skupiająca wynosi:", odpowiedzi: ["+5 D", "+0,2 D", "-5 D"], prawidlowa: 0 }, { pytanie: "Przedmiot ustawiony dalej niż ognisko soczewki skupiającej może dać obraz:", odpowiedzi: ["Rzeczywisty", "Zawsze pozorny", "Zawsze nieistniejący"], prawidlowa: 0 }, { pytanie: "Zdolność skupiająca 2 D odpowiada ogniskowej:", odpowiedzi: ["0,5 m", "2 m", "0,02 m"], prawidlowa: 0 }] },
            { temat: "Soczewka rozpraszająca", quiz: [{ pytanie: "Soczewka rozpraszająca dla rzeczywistego przedmiotu daje obraz:", odpowiedzi: ["Pozorny, prosty i pomniejszony", "Rzeczywisty i powiększony", "Rzeczywisty i odwrócony"], prawidlowa: 0 }, { pytanie: "Zdolność skupiająca soczewki rozpraszającej ma znak:", odpowiedzi: ["Ujemny", "Dodatni", "Zawsze zerowy"], prawidlowa: 0 }, { pytanie: "Promienie równoległe po przejściu przez soczewkę rozpraszającą:", odpowiedzi: ["Rozchodzą się", "Zawsze skupiają się w ognisku rzeczywistym", "Nie zmieniają kierunku"], prawidlowa: 0 }] },
            { temat: "Oko i przyrządy optyczne", quiz: [{ pytanie: "Krótkowzroczność koryguje się najczęściej soczewką:", odpowiedzi: ["Rozpraszającą", "Skupiającą", "Płaską zawsze"], prawidlowa: 0 }, { pytanie: "Dalekowzroczność koryguje się soczewką:", odpowiedzi: ["Skupiającą", "Rozpraszającą", "Bez mocy"], prawidlowa: 0 }, { pytanie: "Lupa wykorzystuje soczewkę skupiającą do uzyskania obrazu:", odpowiedzi: ["Pozornego powiększonego", "Rzeczywistego pomniejszonego", "Zawsze odwróconego"], prawidlowa: 0 }] }
        ],
        optyka_falowa: [
            { temat: "Interferencja światła", quiz: [{ pytanie: "Dwie fale świetlne spotykają się w fazie. Może wystąpić:", odpowiedzi: ["Wzmocnienie", "Zawsze wygaszenie", "Zmiana prędkości w próżni"], prawidlowa: 0 }, { pytanie: "Warunek wzmocnienia w doświadczeniu z dwiema szczelinami obejmuje różnicę dróg równą:", odpowiedzi: ["Całkowitej wielokrotności λ", "Zawsze λ/4", "Tylko 1 m"], prawidlowa: 0 }, { pytanie: "Interferencja światła jest dowodem jego:", odpowiedzi: ["Falowej natury", "Wyłącznie cząstkowej natury", "Braku energii"], prawidlowa: 0 }] },
            { temat: "Dyfrakcja światła", quiz: [{ pytanie: "Dyfrakcja jest wyraźna, gdy szerokość szczeliny jest:", odpowiedzi: ["Porównywalna z λ", "Znacznie większa od λ", "Zawsze zerowa"], prawidlowa: 0 }, { pytanie: "Wzrost długości fali przy tej samej szczelinie zwykle powoduje dyfrakcję:", odpowiedzi: ["Silniejszą", "Słabszą", "Niemożliwą"], prawidlowa: 0 }, { pytanie: "Dyfrakcję można obserwować dla:", odpowiedzi: ["Światła", "Tylko dźwięku", "Tylko wody"], prawidlowa: 0 }] },
            { temat: "Polaryzacja", quiz: [{ pytanie: "Polaryzacja jest charakterystyczna dla fal:", odpowiedzi: ["Poprzecznych", "Wyłącznie podłużnych", "Nieprzenoszących energii"], prawidlowa: 0 }, { pytanie: "Światło niespolaryzowane przechodzące przez idealny polaryzator ma średnio natężenie:", odpowiedzi: ["Około połowy początkowego", "Takie samo zawsze", "Zero zawsze"], prawidlowa: 0 }, { pytanie: "Polaryzacja światła potwierdza jego:", odpowiedzi: ["Poprzeczny charakter fali elektromagnetycznej", "Brak pola elektrycznego", "Cząstkowość bez fali"], prawidlowa: 0 }] }
        ]
    }},
    mechanika_kwantowa_jadrowa: { emoji: "⚛️", nazwa: "Mechanika Kwantowa i Fizyka Jądrowa", podnagalowki: {
        kwanty: [
            { temat: "Energia kwantu", quiz: [{ pytanie: "Foton ma częstotliwość 5×10¹⁴ Hz. Korzystając z E=hf, jego energia jest rzędu:", odpowiedzi: ["3,3×10⁻¹⁹ J", "3,3×10⁻⁵ J", "1,0×10⁻³⁴ J"], prawidlowa: 0 }, { pytanie: "Jeśli częstotliwość fotonu wzrośnie 2 razy, jego energia:", odpowiedzi: ["Wzrośnie 2 razy", "Zmaleje 2 razy", "Nie zmieni się"], prawidlowa: 0 }, { pytanie: "Stała Plancka ma jednostkę:", odpowiedzi: ["J·s", "J/s", "C·s"], prawidlowa: 0 }] },
            { temat: "Efekt fotoelektryczny", quiz: [{ pytanie: "Aby zaszedł efekt fotoelektryczny, energia fotonu musi być:", odpowiedzi: ["Co najmniej równa pracy wyjścia", "Zawsze równa 0", "Mniejsza od pracy wyjścia"], prawidlowa: 0 }, { pytanie: "Zwiększenie częstotliwości światła powyżej progu zwiększa maksymalną energię:", odpowiedzi: ["Elektronów fotoelektrycznych", "Jąder atomowych zawsze", "Fotonów do zera"], prawidlowa: 0 }, { pytanie: "Zwiększenie natężenia światła przy częstotliwości powyżej progu zwiększa przede wszystkim:", odpowiedzi: ["Liczbę wybitych elektronów", "Ich maksymalną energię liniowo zawsze", "Pracę wyjścia metalu"], prawidlowa: 0 }] },
            { temat: "Nieoznaczoność", quiz: [{ pytanie: "Jeśli niepewność położenia maleje, minimalna niepewność pędu:", odpowiedzi: ["Rośnie", "Maleje do zera", "Nie zmienia się"], prawidlowa: 0 }, { pytanie: "Zasada nieoznaczoności dotyczy między innymi pary:", odpowiedzi: ["Położenie–pęd", "Masa–ładunek", "Temperatura–barwa"], prawidlowa: 0 }, { pytanie: "Zasada nieoznaczoności jest własnością:", odpowiedzi: ["Układów kwantowych", "Tylko ciał makroskopowych", "Tylko gazów"], prawidlowa: 0 }] }
        ],
        fizyka_jadrowa: [
            { temat: "Budowa jądra", quiz: [{ pytanie: "Jądro zawiera 6 protonów i 8 neutronów. Liczba masowa wynosi:", odpowiedzi: ["14", "8", "6"], prawidlowa: 0 }, { pytanie: "Izotopy tego samego pierwiastka mają taką samą liczbę:", odpowiedzi: ["Protonów", "Neutronów", "Nukleonów zawsze"], prawidlowa: 0 }, { pytanie: "Liczba atomowa określa liczbę:", odpowiedzi: ["Protonów", "Neutronów", "Wszystkich nukleonów"], prawidlowa: 0 }] },
            { temat: "Rozpady promieniotwórcze", quiz: [{ pytanie: "W rozpadzie alfa liczba masowa zmniejsza się o:", odpowiedzi: ["4", "2", "1"], prawidlowa: 0 }, { pytanie: "W rozpadzie β⁻ neutron zamienia się w proton, więc liczba atomowa:", odpowiedzi: ["Rośnie o 1", "Maleje o 1", "Nie zmienia się"], prawidlowa: 0 }, { pytanie: "W rozpadzie gamma jądro emituje:", odpowiedzi: ["Foton promieniowania elektromagnetycznego", "Elektron zawsze", "Helowe jądro"], prawidlowa: 0 }] },
            { temat: "Okres półtrwania", quiz: [{ pytanie: "Po jednym okresie półtrwania pozostaje:", odpowiedzi: ["50% jąder początkowych", "25%", "75%"], prawidlowa: 0 }, { pytanie: "Po dwóch okresach półtrwania pozostaje:", odpowiedzi: ["25%", "50%", "12,5%"], prawidlowa: 0 }, { pytanie: "Okres półtrwania próbki wynosi 8 dni. Po 24 dniach pozostanie:", odpowiedzi: ["1/8 początkowej ilości", "1/3", "1/24"], prawidlowa: 0 }] }
        ],
        energia_jadrowa: [
            { temat: "Energia wiązania", quiz: [{ pytanie: "Energia wiązania jądra odpowiada między innymi za jego:", odpowiedzi: ["Stabilność względem rozdzielenia nukleonów", "Temperaturę topnienia", "Kolor"], prawidlowa: 0 }, { pytanie: "Defekt masy jest związany z:", odpowiedzi: ["Energią wiązania", "Wyłącznie liczbą elektronów", "Ciśnieniem atmosferycznym"], prawidlowa: 0 }, { pytanie: "Zależność masy i energii opisuje:", odpowiedzi: ["E=mc²", "p=mv²", "F=ma²"], prawidlowa: 0 }] },
            { temat: "Rozszczepienie i synteza", quiz: [{ pytanie: "Rozszczepienie ciężkiego jądra może uwolnić:", odpowiedzi: ["Dużą ilość energii", "Tylko światło widzialne", "Wyłącznie energię chemiczną"], prawidlowa: 0 }, { pytanie: "Synteza jądrowa zachodzi w Słońcu głównie poprzez łączenie jąder:", odpowiedzi: ["Wodoru", "Żelaza", "Ołowiu"], prawidlowa: 0 }, { pytanie: "Reakcja łańcuchowa w reaktorze wymaga kontroli liczby:", odpowiedzi: ["Neutronów wywołujących kolejne rozszczepienia", "Elektronów walencyjnych", "Fotonów widzialnych"], prawidlowa: 0 }] },
            { temat: "Promieniowanie", quiz: [{ pytanie: "Promieniowanie jonizujące może powodować:", odpowiedzi: ["Jonizację materii", "Zawsze ochłodzenie materii", "Zanik grawitacji"], prawidlowa: 0 }, { pytanie: "Które promieniowanie ma największą zdolność przenikania z typowej trójki α, β, γ?", odpowiedzi: ["γ", "β", "α"], prawidlowa: 0 }, { pytanie: "Do ochrony przed promieniowaniem gamma stosuje się między innymi:", odpowiedzi: ["Grube warstwy materiałów o dużej gęstości", "Cienki papier", "Próżnię"], prawidlowa: 0 }] }
        ]
    }},
    teoria_wzglednosci: { emoji: "🚀", nazwa: "Teoria Względności", podnagalowki: {
        szczegolna_teoria_wzglednosci: [
            { temat: "Dylatacja czasu", quiz: [{ pytanie: "Dla obserwatora na Ziemi zegar poruszającego się szybko statku wskazuje upływ czasu:", odpowiedzi: ["Wolniejszy", "Szybszy", "Zawsze taki sam niezależnie od prędkości"], prawidlowa: 0 }, { pytanie: "Efekt dylatacji czasu staje się istotny przy prędkościach:", odpowiedzi: ["Bliskich prędkości światła", "Rzędu 1 m/s", "Tylko zerowych"], prawidlowa: 0 }, { pytanie: "Własny czas jest mierzony przez zegar znajdujący się:", odpowiedzi: ["W układzie, w którym mierzone zdarzenia zachodzą w tym samym miejscu", "Zawsze na Ziemi", "Zawsze w laboratorium"], prawidlowa: 0 }] },
            { temat: "Kontrakcja długości", quiz: [{ pytanie: "Przedmiot poruszający się względem obserwatora z dużą prędkością jest wzdłuż kierunku ruchu mierzony jako:", odpowiedzi: ["Krótszy", "Dłuższy", "Zawsze tej samej długości"], prawidlowa: 0 }, { pytanie: "Kontrakcja długości dotyczy kierunku:", odpowiedzi: ["Równoległego do ruchu", "Prostopadłego do ruchu wyłącznie", "Wszystkich kierunków identycznie"], prawidlowa: 0 }, { pytanie: "Dla prędkości znacznie mniejszej od c efekty relatywistyczne są:", odpowiedzi: ["Bardzo małe", "Maksymalne", "Nieskończone"], prawidlowa: 0 }] },
            { temat: "Energia spoczynkowa", quiz: [{ pytanie: "Masa spoczynkowa 2 kg ma energię E₀=mc² równą około:", odpowiedzi: ["1,8×10¹⁷ J", "6×10⁸ J", "9×10¹⁶ J"], prawidlowa: 0 }, { pytanie: "Jeśli masa spoczynkowa wzrośnie 3 razy, energia spoczynkowa:", odpowiedzi: ["Wzrośnie 3 razy", "Wzrośnie 9 razy", "Nie zmieni się"], prawidlowa: 0 }, { pytanie: "Równanie E=mc² pokazuje równoważność:", odpowiedzi: ["Masy i energii", "Masy i czasu", "Siły i temperatury"], prawidlowa: 0 }] }
        ],
        ogolna_teoria_wzglednosci: [
            { temat: "Grawitacja i czasoprzestrzeń", quiz: [{ pytanie: "Według ogólnej teorii względności grawitacja jest związana z:", odpowiedzi: ["Krzywizną czasoprzestrzeni", "Tylko siłą tarcia", "Ładunkiem elektrycznym"], prawidlowa: 0 }, { pytanie: "Zegar bliżej silnego pola grawitacyjnego względem odległego obserwatora tyka:", odpowiedzi: ["Wolniej", "Szybciej", "Tak samo zawsze"], prawidlowa: 0 }, { pytanie: "Soczewkowanie grawitacyjne polega na:", odpowiedzi: ["Uginaniu toru światła przez grawitację", "Zwiększaniu masy fotonu", "Zatrzymaniu światła w każdym polu"], prawidlowa: 0 }] },
            { temat: "Czarne dziury", quiz: [{ pytanie: "Granicą czarnej dziury, zza której światło nie może uciec, jest:", odpowiedzi: ["Horyzont zdarzeń", "Osobliwość", "Dysk akrecyjny"], prawidlowa: 0 }, { pytanie: "Promień Schwarzschilda zależy między innymi od:", odpowiedzi: ["Masy obiektu", "Koloru obiektu", "Temperatury powietrza"], prawidlowa: 0 }, { pytanie: "Materia spadająca do czarnej dziury może tworzyć:", odpowiedzi: ["Dysk akrecyjny", "Tęczę w próżni", "Lodową skorupę zawsze"], prawidlowa: 0 }] },
            { temat: "Fale grawitacyjne", quiz: [{ pytanie: "Fale grawitacyjne są zmianami:", odpowiedzi: ["Geometrii czasoprzestrzeni", "Temperatury próżni", "Ładunku fotonów"], prawidlowa: 0 }, { pytanie: "Fale grawitacyjne mogą powstawać podczas zderzeń:", odpowiedzi: ["Czarnych dziur", "Kropli wody", "Samochodów"], prawidlowa: 0 }, { pytanie: "Detektory fal grawitacyjnych mierzą niezwykle małe zmiany:", odpowiedzi: ["Długości ramion interferometru", "Masy Ziemi", "Temperatury lustra"], prawidlowa: 0 }] }
        ]
    }},
    fizyka_materialow: { emoji: "🧪", nazwa: "Fizyka Materiałów", podnagalowki: {
        struktura_materii: [
            { temat: "Struktury krystaliczne", quiz: [{ pytanie: "Kryształ charakteryzuje się:", odpowiedzi: ["Uporządkowaniem dalekiego zasięgu", "Całkowitym brakiem atomów", "Zawsze ciekłym stanem"], prawidlowa: 0 }, { pytanie: "Najmniejszy powtarzalny fragment sieci krystalicznej to:", odpowiedzi: ["Komórka elementarna", "Jądro", "Granica fazy"], prawidlowa: 0 }, { pytanie: "Monokryształ ma uporządkowanie krystaliczne:", odpowiedzi: ["Rozciągające się przez całą próbkę", "Tylko na powierzchni", "Tylko w jednym atomie"], prawidlowa: 0 }] },
            { temat: "Defekty kryształów", quiz: [{ pytanie: "Brak atomu w miejscu sieci nazywa się:", odpowiedzi: ["Wakancją", "Dyslokacją śrubową", "Fazą ciekłą"], prawidlowa: 0 }, { pytanie: "Dyslokacja jest przykładem defektu:", odpowiedzi: ["Liniowego", "Punktowego zawsze", "Powierzchniowego zawsze"], prawidlowa: 0 }, { pytanie: "Wzrost temperatury zwykle zwiększa liczbę drgań atomów w sieci:", odpowiedzi: ["Tak", "Nie", "Tylko w próżni"], prawidlowa: 0 }] },
            { temat: "Materiały amorficzne", quiz: [{ pytanie: "Szkło jest typowym przykładem materiału:", odpowiedzi: ["Amorficznego", "Monokrystalicznego", "Gazowego"], prawidlowa: 0 }, { pytanie: "Materiały amorficzne nie mają uporządkowania:", odpowiedzi: ["Dalekiego zasięgu", "Żadnego na poziomie atomowym", "Nigdy lokalnego"], prawidlowa: 0 }, { pytanie: "Polimer może być:", odpowiedzi: ["Materiałem o bardzo długich łańcuchach cząsteczek", "Wyłącznie metalem", "Zawsze kryształem idealnym"], prawidlowa: 0 }] }
        ],
        wlasciwosci_materialow: [
            { temat: "Twardość i wytrzymałość", quiz: [{ pytanie: "Jeśli minerał A rysuje minerał B, to A jest:", odpowiedzi: ["Twardszy", "Miększy", "Zawsze bardziej sprężysty"], prawidlowa: 0 }, { pytanie: "Wytrzymałość na rozciąganie opisuje odporność na:", odpowiedzi: ["Zerwanie podczas rozciągania", "Przewodzenie ciepła", "Magnesowanie"], prawidlowa: 0 }, { pytanie: "Twardość i wytrzymałość to:", odpowiedzi: ["Różne właściwości materiału", "Dokładnie to samo", "Jednostki energii"], prawidlowa: 0 }] },
            { temat: "Przewodnictwo elektryczne", quiz: [{ pytanie: "Metale dobrze przewodzą prąd głównie dzięki:", odpowiedzi: ["Swobodnym elektronom", "Swobodnym protonom", "Brakowi elektronów"], prawidlowa: 0 }, { pytanie: "Jednostką przewodności elektrycznej jest:", odpowiedzi: ["S/m", "Ω/m²", "J/C"], prawidlowa: 0 }, { pytanie: "Półprzewodnik ma przewodnictwo zwykle:", odpowiedzi: ["Pośrednie między izolatorem a dobrym przewodnikiem", "Zawsze większe od miedzi", "Zawsze równe zeru"], prawidlowa: 0 }] },
            { temat: "Sprężystość i plastyczność", quiz: [{ pytanie: "Odkształcenie sprężyste po usunięciu siły:", odpowiedzi: ["Może zaniknąć", "Zawsze pozostaje", "Zwiększa masę"], prawidlowa: 0 }, { pytanie: "Odkształcenie plastyczne jest:", odpowiedzi: ["Trwałe", "Zawsze odwracalne", "Niemożliwe w metalach"], prawidlowa: 0 }, { pytanie: "Prawo Hooke'a w zakresie sprężystym wiąże naprężenie z:", odpowiedzi: ["Odkształceniem", "Temperaturą wrzenia", "Ładunkiem"], prawidlowa: 0 }] }
        ]
    }},
    astronomia: { emoji: "🌌", nazwa: "Astronomia", podnagalowki: {
        uklad_sloneczny: [
            { temat: "Planety", quiz: [{ pytanie: "Ile planet ma Układ Słoneczny według współczesnej klasyfikacji?", odpowiedzi: ["8", "7", "9"], prawidlowa: 0 }, { pytanie: "Która planeta jest najbliżej Słońca?", odpowiedzi: ["Merkury", "Wenus", "Mars"], prawidlowa: 0 }, { pytanie: "Największą planetą Układu Słonecznego jest:", odpowiedzi: ["Jowisz", "Saturn", "Neptun"], prawidlowa: 0 }] },
            { temat: "Ruch orbitalny", quiz: [{ pytanie: "Planeta porusza się po orbicie eliptycznej. Jej prędkość jest większa:", odpowiedzi: ["Bliżej Słońca", "Dalej od Słońca", "Zawsze taka sama"], prawidlowa: 0 }, { pytanie: "Okres obiegu planety wokół Słońca rośnie wraz z odległością zgodnie z:", odpowiedzi: ["III prawem Keplera", "Prawem Ohma", "Prawem Archimedesa"], prawidlowa: 0 }, { pytanie: "Satelita na orbicie kołowej porusza się dzięki równowadze między bezwładnością a:", odpowiedzi: ["Grawitacją", "Tarciem powietrza", "Siłą elektryczną"], prawidlowa: 0 }] },
            { temat: "Grawitacja w astronomii", quiz: [{ pytanie: "Jeśli odległość między planetą i gwiazdą wzrośnie 2 razy, siła grawitacji:", odpowiedzi: ["Zmaleje 4 razy", "Zmaleje 2 razy", "Wzrośnie 2 razy"], prawidlowa: 0 }, { pytanie: "Zwiększenie masy planety 2 razy przy tej samej odległości powoduje siłę grawitacji:", odpowiedzi: ["2 razy większą", "4 razy większą", "Bez zmiany"], prawidlowa: 0 }, { pytanie: "Prędkość ucieczki z danego ciała zależy między innymi od jego:", odpowiedzi: ["Masy i promienia", "Koloru", "Liczby pierścieni"], prawidlowa: 0 }] }
        ],
        gwiazdy_i_galaktyki: [
            { temat: "Gwiazdy", quiz: [{ pytanie: "Źródłem energii gwiazd ciągu głównego podobnych do Słońca jest głównie:", odpowiedzi: ["Fuzja jąder wodoru", "Spalanie chemiczne", "Rozszczepianie żelaza"], prawidlowa: 0 }, { pytanie: "Barwa gwiazdy jest związana z jej:", odpowiedzi: ["Temperaturą powierzchni", "Odległością od Ziemi wyłącznie", "Masą Ziemi"], prawidlowa: 0 }, { pytanie: "W widmie gwiazdy linie absorpcyjne mogą informować o:", odpowiedzi: ["Składzie chemicznym", "Promieniu Ziemi", "Kształcie orbity Księżyca"], prawidlowa: 0 }] },
            { temat: "Ewolucja gwiazd", quiz: [{ pytanie: "Gwiazda podobna do Słońca po fazie ciągu głównego może stać się:", odpowiedzi: ["Czerwonym olbrzymem", "Czarną dziurą zawsze", "Planetą"], prawidlowa: 0 }, { pytanie: "Pozostałością po gwieździe podobnej do Słońca może być:", odpowiedzi: ["Biały karzeł", "Gwiazda neutronowa zawsze", "Jowisz"], prawidlowa: 0 }, { pytanie: "Supernowa może być końcowym etapem ewolucji:", odpowiedzi: ["Niektórych masywnych gwiazd", "Każdej planety", "Każdego meteoru"], prawidlowa: 0 }] },
            { temat: "Galaktyki", quiz: [{ pytanie: "Droga Mleczna jest:", odpowiedzi: ["Galaktyką", "Gromadą planet", "Pojedynczą gwiazdą"], prawidlowa: 0 }, { pytanie: "Galaktyki mogą mieć kształt:", odpowiedzi: ["Spiralny, eliptyczny lub nieregularny", "Tylko kulisty", "Tylko płaski prostokąt"], prawidlowa: 0 }, { pytanie: "Odległość do bardzo dalekich galaktyk można szacować między innymi na podstawie:", odpowiedzi: ["Przesunięcia ku czerwieni", "Koloru oceanu", "Ciśnienia atmosferycznego"], prawidlowa: 0 }] }
        ],
        obserwacje_i_kosmologia: [
            { temat: "Światło i widma", quiz: [{ pytanie: "Jeśli widmo galaktyki jest przesunięte ku czerwieni, zwykle oznacza to, że galaktyka:", odpowiedzi: ["Oddala się od nas", "Zawsze się przybliża", "Nie emituje światła"], prawidlowa: 0 }, { pytanie: "Jednostką odległości często używaną w astronomii jest:", odpowiedzi: ["Rok świetlny", "Sekunda świetlna?", "Wat"], prawidlowa: 0 }, { pytanie: "Rok świetlny jest jednostką:", odpowiedzi: ["Odległości", "Czasu", "Mocy"], prawidlowa: 0 }] },
            { temat: "Rozszerzanie Wszechświata", quiz: [{ pytanie: "Prawo Hubble'a wiąże prędkość oddalania galaktyki z:", odpowiedzi: ["Jej odległością", "Jej temperaturą wyłącznie", "Liczbą planet"], prawidlowa: 0 }, { pytanie: "Obserwowane przesunięcie ku czerwieni odległych galaktyk jest zgodne z:", odpowiedzi: ["Rozszerzaniem się Wszechświata", "Brakiem ruchu galaktyk", "Kurczeniem się wszystkich gwiazd"], prawidlowa: 0 }, { pytanie: "Mikrofalowe promieniowanie tła jest pozostałością po:", odpowiedzi: ["Wczesnym Wszechświecie", "Powierzchni Słońca", "Atmosferze Ziemi"], prawidlowa: 0 }] },
            { temat: "Grawitacja i obserwacje", quiz: [{ pytanie: "Soczewkowanie grawitacyjne może:", odpowiedzi: ["Powiększać i zniekształcać obraz odległego obiektu", "Zmieniać masę gwiazdy", "Wyłączać światło"], prawidlowa: 0 }, { pytanie: "Ruch gwiazd wokół centrum galaktyki dostarcza informacji o:", odpowiedzi: ["Rozkładzie masy w galaktyce", "Temperaturze oceanu", "Ciśnieniu na Ziemi"], prawidlowa: 0 }, { pytanie: "Egzoplanetę można wykrywać metodą tranzytu, obserwując okresowe:", odpowiedzi: ["Spadki jasności gwiazdy", "Wzrosty masy gwiazdy", "Zmiany temperatury Ziemi"], prawidlowa: 0 }] }
        ]
    }}
};

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
