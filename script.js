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
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    runTransaction,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";




// Tryb tymczasowy: system gwiazdek i misji pozostaje zapisany w kodzie oraz danych,
// ale jest niewidoczny na stronie. Przywrócenie: zmień na true.
const SYSTEM_GWIAZDEK_WIDOCZNY = false;

// Motyw interfejsu jest niezależny od personalizacji nauki.
// Dostępne wartości: "jasny", "ciemny", "system".
const KLUCZ_MOTYWU = "inercja-motyw";
const DOSTEPNE_MOTYWY = new Set(["jasny", "ciemny", "system"]);

function pobierzZapisanyMotyw() {
    const zapisany = localStorage.getItem(KLUCZ_MOTYWU);
    return DOSTEPNE_MOTYWY.has(zapisany) ? zapisany : "system";
}

function zastosujMotyw(motyw = pobierzZapisanyMotyw()) {
    const wybrany = DOSTEPNE_MOTYWY.has(motyw) ? motyw : "system";
    const efektywny = wybrany === "system"
        ? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "ciemny" : "jasny")
        : wybrany;
    document.documentElement.dataset.motyw = efektywny;
    document.documentElement.style.colorScheme = efektywny;
    localStorage.setItem(KLUCZ_MOTYWU, wybrany);
    const wybor = document.getElementById("ustawienia-motywu");
    if (wybor) wybor.value = wybrany;
}

zastosujMotyw();

window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener("change", () => {
    if (pobierzZapisanyMotyw() === "system") zastosujMotyw("system");
});

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

if (!SYSTEM_GWIAZDEK_WIDOCZNY) {
    document.documentElement.dataset.systemGwiazdki = "ukryty";
}

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
let lekcjiWKole = 1;
let trybGoscia = sessionStorage.getItem("fizyka-tryb-goscia") === "true";
let aktywnyUzytkownik = trybGoscia ? "gosc" : localStorage.getItem("fizyka-aktywny-uzytkownik") || "";
let wynikGracza = Number(magazynDanych().getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
let gwiazdkiUcznia = Number(magazynDanych().getItem(`fizyka-gwiazdki-${aktywnyUzytkownik}`));
if (!Number.isFinite(gwiazdkiUcznia)) gwiazdkiUcznia = 5;
let poziomAdaptacyjny = 2;
let seriaPoprawnych = 0;
let seriaBlednych = 0;
let pokazanePytania = [];
let aktualnePytanie = null;
let zglaszanyBladWysylany = false;
const MIN_PYTAN_W_KAZDYM_QUIZIE = 12;
let aktualnaLiczbaPytan = MIN_PYTAN_W_KAZDYM_QUIZIE;
let rejestracjaWToku = false;
let kolejkaZapisuPostepu = Promise.resolve();
let zsynchronizowanyUzytkownik = "";
let aktywnaSynchronizacjaPostepu = null;
const kluczPostepuDoPrzeniesienia = "fizyka-postep-do-przeniesienia";
const maksymalnePunkty = 100000000;
const MISJE = [
    { id: "pierwsza_lekcja", ikona: "🚀", nazwa: "Pierwszy krok", opis: "Ukończ pierwszą lekcję w dowolnym dziale.", nagroda: 1, typ: "postep" },
    { id: "trzy_lekcje", ikona: "📚", nazwa: "Trzy kroki naprzód", opis: "Ukończ 3 lekcje. Sprawdź różne podtematy, zamiast powtarzać tę samą lekcję.", nagroda: 2, typ: "postep" },
    { id: "sto_punktow", ikona: "🎯", nazwa: "Pierwsza setka", opis: "Zdobądź 100 punktów za poprawne odpowiedzi.", nagroda: 1, typ: "punkty" },
    { id: "seria_poprawnych", ikona: "🔥", nazwa: "Dobra seria", opis: "Odpowiedz poprawnie na 5 pytań z rzędu.", nagroda: 1, typ: "sesja" },
    { id: "youtube_subskrypcja", ikona: "▶️", nazwa: "Subskrybuj Inercję na YouTube", opis: "Zasubskrybuj kanał Inercji na YouTube. Po powrocie kliknij „Sprawdź subskrypcję”.", nagroda: 4, typ: "youtube" }
];


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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Na jaką temperaturę w stopniach Celsjusza odpowiada około 310 K?",
                            "odpowiedzi": [
                                "37°C",
                                "310°C",
                                "-37°C"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "O ile kelwinów wzrasta temperatura przy zmianie z 280 K do 300 K?",
                            "odpowiedzi": [
                                "20 K",
                                "580 K",
                                "10 K"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Którą wielkość fizyczną termometr mierzy bezpośrednio?",
                            "odpowiedzi": [
                                "Temperatura",
                                "Ciepło właściwe",
                                "Moc"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dwa termometry pokazują 20°C i 68°F. Które wskazania odpowiadają tej samej temperaturze?",
                            "odpowiedzi": [
                                "Są w przybliżeniu równe",
                                "68°F to 68°C",
                                "20°C to 20 K"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Który materiał potrzebuje więcej energii do ogrzania 1 kg o 10°C, jeśli ma większe c?",
                            "odpowiedzi": [
                                "Materiał o większym c",
                                "Materiał o mniejszym c",
                                "Oba zawsze tyle samo"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dostarczono 8400 J do 1 kg wody. O ile wzrośnie jej temperatura? c=4200 J/(kg·°C).",
                            "odpowiedzi": [
                                "2°C",
                                "0,5°C",
                                "4°C"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Który proces może zwiększyć energię wewnętrzną bez dopływu ciepła?",
                            "odpowiedzi": [
                                "Wykonanie pracy nad układem",
                                "Tylko chłodzenie",
                                "Tylko topnienie"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli energia wewnętrzna układu wzrosła o 150 J, co oznacza znak dodatni tej zmiany?",
                            "odpowiedzi": [
                                "Układ zwiększył swoją energię wewnętrzną",
                                "Układ stracił 150 J",
                                "Praca zawsze wyniosła 0"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Gaz wykonał 800 J pracy, pobierając 1200 J ciepła. Jaka była zmiana energii wewnętrznej?",
                            "odpowiedzi": [
                                "400 J",
                                "2000 J",
                                "-400 J"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która jednostka SI jest właściwa dla pracy mechanicznej?",
                            "odpowiedzi": [
                                "J",
                                "W",
                                "Pa"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która wielkość pozostaje stała w przemianie izochorycznej?",
                            "odpowiedzi": [
                                "Objętość",
                                "Ciśnienie",
                                "Temperatura"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która wielkość pozostaje stała w przemianie izotermicznej gazu?",
                            "odpowiedzi": [
                                "Temperatura",
                                "Objętość",
                                "Masa molowa"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Ciśnienie hydrostatyczne zależy od głębokości:",
                            "odpowiedzi": [
                                "Wprost proporcjonalnie",
                                "Odwrotnie proporcjonalnie",
                                "Nie zależy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Na tej samej głębokości w tej samej cieczy ciśnienie jest:",
                            "odpowiedzi": [
                                "Takie samo niezależnie od kształtu naczynia",
                                "Zawsze większe w szerokim naczyniu",
                                "Zawsze mniejsze w wąskim"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Siła wyporu działa na zanurzone ciało:",
                            "odpowiedzi": [
                                "Pionowo ku górze",
                                "Pionowo w dół",
                                "Poziomo"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli objętość wypartej cieczy wzrośnie 2 razy, siła wyporu:",
                            "odpowiedzi": [
                                "Wzrośnie 2 razy",
                                "Zmniejszy się 2 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0
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
                    "quiz": [
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
                            "odpowiedzi": [
                                "Układ odniesienia i współrzędne położenia",
                                "Tylko masę ciała",
                                "Tylko czas"
                            ],
                            "prawidlowa": 0,
                            "wzor": "x = x(t)",
                            "wskazowka": "Najpierw ustal, względem czego opisujesz położenie. Dopiero potem możesz podać współrzędną x i jej zmianę w czasie."
                        },
                        {
                            "pytanie": "Czym jest tor ruchu?",
                            "odpowiedzi": [
                                "Linia wyznaczona przez kolejne położenia ciała",
                                "Czas trwania ruchu",
                                "Odległość od początku układu współrzędnych"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Wyobraź sobie zaznaczanie położenia ciała w kolejnych chwilach. Po połączeniu tych punktów otrzymujesz tor."
                        },
                        {
                            "pytanie": "Czym różni się droga od przemieszczenia?",
                            "odpowiedzi": [
                                "Droga jest długością przebytej trasy, a przemieszczenie łączy położenie początkowe i końcowe jako wektor",
                                "To zawsze dokładnie ta sama wielkość",
                                "Przemieszczenie zawsze jest większe od drogi"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Droga zależy od całej przebytej trasy. Przemieszczenie zależy tylko od punktu startu i końca oraz ma kierunek."
                        },
                        {
                            "pytanie": "Samochód jedzie 100 m na wschód, a następnie 100 m na zachód. Jaka jest jego droga?",
                            "odpowiedzi": [
                                "200 m",
                                "0 m",
                                "100 m"
                            ],
                            "prawidlowa": 0,
                            "wzor": "s = s₁ + s₂",
                            "wskazowka": "Droga sumuje długości wszystkich przebytych odcinków. Nie skracaj jej przez odejmowanie kierunków."
                        },
                        {
                            "pytanie": "W poprzednim ruchu samochodu wartość przemieszczenia wynosi...",
                            "odpowiedzi": [
                                "0 m",
                                "100 m",
                                "200 m"
                            ],
                            "prawidlowa": 0,
                            "wzor": "Δx = x_k − x_p",
                            "wskazowka": "Samochód wrócił do punktu startu. Porównaj położenie końcowe z początkowym."
                        },
                        {
                            "pytanie": "Czy ruch może być różnie opisany przez dwóch obserwatorów?",
                            "odpowiedzi": [
                                "Tak, zależy od układu odniesienia",
                                "Nie, opis ruchu jest zawsze identyczny",
                                "Tylko w próżni"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Pomyśl o pasażerze siedzącym w jadącym autobusie i obserwatorze stojącym na ulicy. Ten sam pasażer ma różne położenie względem obu układów."
                        },
                        {
                            "pytanie": "Wektor przemieszczenia jest skierowany...",
                            "odpowiedzi": [
                                "Od położenia początkowego do końcowego",
                                "Zawsze zgodnie z torem",
                                "Zawsze pionowo w dół"
                            ],
                            "prawidlowa": 0,
                            "wzor": "⃗Δr = ⃗r_k − ⃗r_p",
                            "wskazowka": "Narysuj punkt startowy i końcowy. Wektor przemieszczenia to prosta strzałka łącząca te punkty w odpowiednim kierunku."
                        },
                        {
                            "pytanie": "Jeżeli ciało pozostaje w tym samym położeniu względem wybranego układu, to...",
                            "odpowiedzi": [
                                "Spoczywa w tym układzie",
                                "Na pewno porusza się ruchem jednostajnym",
                                "Ma zawsze przyspieszenie"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Spoczynek oznacza brak zmiany położenia w czasie w konkretnym układzie odniesienia."
                        },
                        {
                            "pytanie": "Jaka jednostka w SI opisuje drogę?",
                            "odpowiedzi": [
                                "metr (m)",
                                "sekunda (s)",
                                "metr na sekundę (m/s)"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Droga jest długością, więc szukaj jednostki długości w układzie SI."
                        },
                        {
                            "pytanie": "Jeżeli ciało porusza się po prostej i nie zmienia kierunku, wartość drogi i przemieszczenia...",
                            "odpowiedzi": [
                                "Są sobie równe",
                                "Zawsze różnią się o połowę",
                                "Przemieszczenie jest większe"
                            ],
                            "prawidlowa": 0,
                            "wzor": "s = |Δx|",
                            "wskazowka": "Przy ruchu prostoliniowym bez zawracania cała przebyta trasa jest jednym odcinkiem między początkiem i końcem."
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
                            "wzor": "v_śr = s/Δt",
                            "wskazowka": "Szybkość mówi, jaką drogę średnio przypada na jednostkę czasu. Podziel całkowitą drogę przez całkowity czas."
                        },
                        {
                            "pytanie": "Ciało przebywa 120 m w 10 s. Jaka jest jego średnia szybkość?",
                            "odpowiedzi": [
                                "12 m/s",
                                "1200 m/s",
                                "0,083 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_śr = s/Δt",
                            "wskazowka": "Podstaw s = 120 m i Δt = 10 s do wzoru na średnią szybkość. Wynik powinien mieć jednostkę m/s."
                        },
                        {
                            "pytanie": "72 km/h to ile m/s?",
                            "odpowiedzi": [
                                "20 m/s",
                                "7,2 m/s",
                                "259,2 m/s"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Przy zamianie km/h na m/s pomnóż przez 1000 i podziel przez 3600. Możesz też użyć przybliżenia 1 m/s = 3,6 km/h."
                        },
                        {
                            "pytanie": "Co oznacza prędkość chwilowa?",
                            "odpowiedzi": [
                                "Prędkość w konkretnej chwili ruchu",
                                "Całą drogę podzieloną przez cały czas w każdym przypadku",
                                "Tylko maksymalną prędkość"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v(t) = dx/dt",
                            "wskazowka": "Nie uśredniaj całego ruchu. Prędkość chwilowa opisuje stan ruchu w wybranym momencie."
                        },
                        {
                            "pytanie": "Prędkość jest wielkością wektorową, ponieważ ma...",
                            "odpowiedzi": [
                                "Wartość, kierunek i zwrot",
                                "Tylko wartość",
                                "Tylko jednostkę"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Odróżnij prędkość od szybkości. Szybkość jest skalarem, a prędkość zawiera również informację o kierunku i zwrocie."
                        },
                        {
                            "pytanie": "Pojazd jedzie 15 m/s przez 20 s. Jaką drogę pokona przy stałej prędkości?",
                            "odpowiedzi": [
                                "300 m",
                                "35 m",
                                "0,75 m"
                            ],
                            "prawidlowa": 0,
                            "wzor": "s = vt",
                            "wskazowka": "Przy stałej prędkości droga rośnie proporcjonalnie do czasu. Pomnóż prędkość przez czas."
                        },
                        {
                            "pytanie": "Jeśli czas ruchu zwiększymy dwukrotnie przy tej samej stałej prędkości, droga...",
                            "odpowiedzi": [
                                "Zwiększy się dwukrotnie",
                                "Zmniejszy się dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "wzor": "s = vt",
                            "wskazowka": "Przy stałym v droga jest wprost proporcjonalna do czasu."
                        },
                        {
                            "pytanie": "Jaka jest jednostka prędkości w SI?",
                            "odpowiedzi": [
                                "m/s",
                                "m/s²",
                                "N"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Prędkość opisuje zmianę położenia w czasie, więc połącz jednostkę długości z jednostką czasu."
                        },
                        {
                            "pytanie": "Jeśli prędkość chwilowa wynosi 0, czy ciało musi być przez cały ruch w spoczynku?",
                            "odpowiedzi": [
                                "Nie, może mieć chwilowo v = 0",
                                "Tak, zawsze",
                                "Tylko gdy masa wynosi 0"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Prędkość chwilowa dotyczy jednej chwili. Przykładem jest najwyższy punkt rzutu pionowego."
                        },
                        {
                            "pytanie": "Ciało pokonało 50 m w pierwszych 5 s i 100 m w kolejnych 5 s. Jaka jest średnia szybkość całego ruchu?",
                            "odpowiedzi": [
                                "15 m/s",
                                "10 m/s",
                                "30 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_śr = s_całk/Δt_całk",
                            "wskazowka": "Najpierw zsumuj obie drogi, potem zsumuj oba przedziały czasu. Nie uśredniaj samych szybkości bez sprawdzenia czasów."
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
                            "wzor": "v = const, a = 0",
                            "wskazowka": "Słowo „jednostajny” oznacza stałą prędkość, a „prostoliniowy” — stały kierunek ruchu."
                        },
                        {
                            "pytanie": "Jaki wzór opisuje drogę w ruchu jednostajnym, jeśli ciało zaczyna z położenia x₀?",
                            "odpowiedzi": [
                                "x = x₀ + vt",
                                "x = x₀ + at²",
                                "x = v/t"
                            ],
                            "prawidlowa": 0,
                            "wzor": "x(t) = x₀ + vt",
                            "wskazowka": "Położenie początkowe trzeba dodać do zmiany położenia. W ruchu jednostajnym zmiana ta wynosi vt."
                        },
                        {
                            "pytanie": "Na wykresie x(t) ruchu jednostajnego nachylenie prostej oznacza...",
                            "odpowiedzi": [
                                "Prędkość",
                                "Masę",
                                "Siłę"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = Δx/Δt",
                            "wskazowka": "Nachylenie to zmiana wartości na osi pionowej podzielona przez zmianę czasu."
                        },
                        {
                            "pytanie": "Samochód jedzie 25 m/s przez 8 s. Jaką drogę pokona?",
                            "odpowiedzi": [
                                "200 m",
                                "33 m",
                                "3,125 m"
                            ],
                            "prawidlowa": 0,
                            "wzor": "s = vt",
                            "wskazowka": "Masz stałą prędkość i czas, więc użyj bezpośrednio zależności s = vt."
                        },
                        {
                            "pytanie": "Jeśli w ruchu jednostajnym prędkość wynosi 0, ciało...",
                            "odpowiedzi": [
                                "Pozostaje w spoczynku",
                                "Ma stałe dodatnie przyspieszenie",
                                "Porusza się coraz szybciej"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Stała prędkość równa zero oznacza brak zmiany położenia w czasie."
                        },
                        {
                            "pytanie": "Jak wygląda wykres v(t) dla ruchu jednostajnego?",
                            "odpowiedzi": [
                                "Linia pozioma",
                                "Parabola",
                                "Okrąg"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Skoro v nie zmienia się z czasem, wartość na osi v pozostaje stała."
                        },
                        {
                            "pytanie": "Jak wygląda wykres a(t) dla ruchu jednostajnego?",
                            "odpowiedzi": [
                                "Pokrywa się z osią czasu, czyli a = 0",
                                "Jest linią rosnącą",
                                "Jest parabolą"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = 0",
                            "wskazowka": "Brak zmiany prędkości oznacza brak przyspieszenia."
                        },
                        {
                            "pytanie": "Dwa pojazdy jadą w tym samym kierunku z prędkościami 20 m/s i 12 m/s. Jaka jest ich prędkość względna?",
                            "odpowiedzi": [
                                "8 m/s",
                                "32 m/s",
                                "240 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_wzgl = |v₁ − v₂|",
                            "wskazowka": "Przy ruchu w tym samym kierunku odejmij wartości prędkości."
                        },
                        {
                            "pytanie": "W ruchu jednostajnym droga przebyta w kolejnych równych odstępach czasu jest...",
                            "odpowiedzi": [
                                "Taka sama",
                                "Coraz większa",
                                "Coraz mniejsza"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Stała prędkość oznacza taką samą zmianę położenia w każdym równym czasie."
                        },
                        {
                            "pytanie": "Ciało pokonało 360 m z prędkością 18 m/s. Ile trwał ruch jednostajny?",
                            "odpowiedzi": [
                                "20 s",
                                "6,7 s",
                                "378 s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "t = s/v",
                            "wskazowka": "Szukasz czasu, więc przekształć s = vt względem t, a dopiero potem podstaw dane."
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
                            "wzor": "a = Δv/Δt",
                            "wskazowka": "Porównaj prędkość początkową i końcową oraz czas, w którym nastąpiła zmiana."
                        },
                        {
                            "pytanie": "Samochód zwiększa prędkość z 10 do 20 m/s w 5 s. Jakie ma średnie przyspieszenie?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "6 m/s²",
                                "50 m/s²"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = (v − v₀)/Δt",
                            "wskazowka": "Najpierw policz zmianę prędkości: v − v₀. Następnie podziel ją przez czas zmiany."
                        },
                        {
                            "pytanie": "Jaką jednostkę ma przyspieszenie?",
                            "odpowiedzi": [
                                "m/s²",
                                "m/s",
                                "m²/s"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Przyspieszenie to prędkość podzielona przez czas. Podziel jednostkę m/s przez s."
                        },
                        {
                            "pytanie": "Jeżeli prędkość maleje w czasie, przyspieszenie wzdłuż kierunku ruchu może być...",
                            "odpowiedzi": [
                                "Ujemne",
                                "Zawsze dodatnie",
                                "Zawsze równe zero"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Przyjmij kierunek ruchu jako dodatni i zobacz, czy zmiana prędkości ma zwrot przeciwny do osi dodatniej."
                        },
                        {
                            "pytanie": "Co nazywamy opóźnieniem?",
                            "odpowiedzi": [
                                "Zmniejszaniem wartości prędkości w czasie",
                                "Każdym ruchem po okręgu",
                                "Zwiększaniem drogi w czasie"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Opóźnienie opisuje sytuację, w której wartość prędkości maleje. Zwróć uwagę na kierunek osi, jeśli używasz znaku przyspieszenia."
                        },
                        {
                            "pytanie": "Ciało zmienia prędkość z 4 m/s do 16 m/s w 6 s. Jaka jest wartość średniego przyspieszenia?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "12 m/s²",
                                "20 m/s²"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = (16 − 4)/6",
                            "wskazowka": "Oblicz zmianę prędkości, czyli 16 − 4, i podziel przez 6 s."
                        },
                        {
                            "pytanie": "Czy przyspieszenie może być niezerowe, gdy szybkość jest stała?",
                            "odpowiedzi": [
                                "Tak, gdy zmienia się kierunek prędkości",
                                "Nie, nigdy",
                                "Tylko gdy masa się zmienia"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = Δ⃗v/Δt",
                            "wskazowka": "Przyspieszenie zależy od zmiany wektora prędkości. Nawet przy stałej szybkości zmiana kierunku oznacza zmianę wektora."
                        },
                        {
                            "pytanie": "Jeżeli v₀ = 5 m/s, a = 0 i t = 10 s, jaka będzie prędkość końcowa?",
                            "odpowiedzi": [
                                "5 m/s",
                                "0 m/s",
                                "50 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = v₀ + at",
                            "wskazowka": "Brak przyspieszenia oznacza, że prędkość się nie zmienia."
                        },
                        {
                            "pytanie": "Samochód hamuje od 30 m/s do 10 m/s w 4 s. Jakie jest jego średnie przyspieszenie przy osi dodatniej zgodnej z ruchem?",
                            "odpowiedzi": [
                                "−5 m/s²",
                                "5 m/s²",
                                "−20 m/s²"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = (v − v₀)/Δt",
                            "wskazowka": "Końcowa prędkość jest mniejsza od początkowej, więc licznik będzie ujemny. Dopiero potem podziel przez 4 s."
                        },
                        {
                            "pytanie": "Na wykresie v(t) nachylenie prostej odpowiada...",
                            "odpowiedzi": [
                                "Przyspieszeniu",
                                "Drodze",
                                "Masie"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = Δv/Δt",
                            "wskazowka": "Nachylenie to zmiana v podzielona przez zmianę czasu — dokładnie definicja przyspieszenia średniego."
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
                            "wzor": "a = const",
                            "wskazowka": "Słowo „jednostajnie” odnosi się tutaj do stałości przyspieszenia, a nie prędkości."
                        },
                        {
                            "pytanie": "Jak obliczyć prędkość po czasie t przy stałym przyspieszeniu?",
                            "odpowiedzi": [
                                "v = v₀ + at",
                                "v = v₀/t + a",
                                "v = at/v₀"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = v₀ + at",
                            "wskazowka": "Zacznij od prędkości początkowej. Przyspieszenie zmienia prędkość o at."
                        },
                        {
                            "pytanie": "Jaki wzór opisuje położenie przy stałym przyspieszeniu?",
                            "odpowiedzi": [
                                "x = x₀ + v₀t + ½at²",
                                "x = x₀ + vt²",
                                "x = at/v₀"
                            ],
                            "prawidlowa": 0,
                            "wzor": "x = x₀ + v₀t + ½at²",
                            "wskazowka": "Uwzględnij zarówno ruch wynikający z prędkości początkowej, jak i dodatkowe przesunięcie wywołane przyspieszeniem."
                        },
                        {
                            "pytanie": "Ciało rusza z miejsca z a = 2 m/s². Jaka będzie jego prędkość po 5 s?",
                            "odpowiedzi": [
                                "10 m/s",
                                "2,5 m/s",
                                "25 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = v₀ + at",
                            "wskazowka": "„Rusza z miejsca” oznacza v₀ = 0. Wstaw a i t do wzoru na prędkość."
                        },
                        {
                            "pytanie": "Ciało rusza z miejsca z a = 2 m/s². Jaką drogę pokona w 5 s?",
                            "odpowiedzi": [
                                "25 m",
                                "10 m",
                                "50 m"
                            ],
                            "prawidlowa": 0,
                            "wzor": "s = v₀t + ½at²",
                            "wskazowka": "Ponieważ v₀ = 0, pierwszy składnik znika. Pozostaje część zależna od a i t²."
                        },
                        {
                            "pytanie": "Jak wygląda wykres v(t) przy stałym dodatnim przyspieszeniu?",
                            "odpowiedzi": [
                                "Prosta rosnąca",
                                "Linia pozioma",
                                "Parabola zawsze"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v(t) = v₀ + at",
                            "wskazowka": "Prędkość rośnie o taką samą wartość w każdym kolejnym równym czasie, więc wykres jest liniowy."
                        },
                        {
                            "pytanie": "Jak wygląda wykres x(t) przy stałym niezerowym przyspieszeniu?",
                            "odpowiedzi": [
                                "Parabola",
                                "Linia pozioma zawsze",
                                "Okrąg"
                            ],
                            "prawidlowa": 0,
                            "wzor": "x(t) = x₀ + v₀t + ½at²",
                            "wskazowka": "W równaniu położenia występuje t². To właśnie składnik kwadratowy powoduje kształt paraboli."
                        },
                        {
                            "pytanie": "Jeśli a ma zwrot przeciwny do prędkości, ciało może...",
                            "odpowiedzi": [
                                "Zwalniać",
                                "Zawsze przyspieszać",
                                "Nie zmieniać prędkości"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Porównaj kierunki wektorów v i a. Przyspieszenie przeciwne do prędkości zmniejsza wartość szybkości."
                        },
                        {
                            "pytanie": "Po jakim czasie ciało z v₀ = 4 m/s i a = 2 m/s² osiągnie 14 m/s?",
                            "odpowiedzi": [
                                "5 s",
                                "7 s",
                                "10 s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "t = (v − v₀)/a",
                            "wskazowka": "Najpierw przekształć v = v₀ + at względem t. Potem podstaw v = 14 m/s, v₀ = 4 m/s i a = 2 m/s²."
                        },
                        {
                            "pytanie": "Czy ruch jednostajnie opóźniony ma stałe przyspieszenie?",
                            "odpowiedzi": [
                                "Tak, jeśli wartość opóźnienia jest stała",
                                "Nie, nigdy",
                                "Tylko podczas spadku swobodnego"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Jednostajnie opóźniony oznacza stałą zmianę prędkości w czasie, tylko ze zwrotem przeciwnym do ruchu."
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
                            "wzor": "v = dx/dt",
                            "wskazowka": "Sprawdź, jak szybko zmienia się położenie wraz z czasem. Nachylenie x(t) daje prędkość."
                        },
                        {
                            "pytanie": "Co oznacza nachylenie wykresu v(t)?",
                            "odpowiedzi": [
                                "Przyspieszenie",
                                "Drogę",
                                "Położenie"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = dv/dt",
                            "wskazowka": "Nachylenie to zmiana prędkości na jednostkę czasu."
                        },
                        {
                            "pytanie": "Co oznacza pole pod wykresem v(t) w czasie ruchu prostoliniowego?",
                            "odpowiedzi": [
                                "Przemieszczenie",
                                "Masę",
                                "Przyspieszenie"
                            ],
                            "prawidlowa": 0,
                            "wzor": "Δx = ∫v(t)dt",
                            "wskazowka": "Pole ma wymiar prędkość razy czas, czyli m/s · s = m. To odpowiada zmianie położenia."
                        },
                        {
                            "pytanie": "Co oznacza pozioma linia v(t) powyżej zera?",
                            "odpowiedzi": [
                                "Stałą dodatnią prędkość",
                                "Stałe dodatnie przyspieszenie",
                                "Spoczynek"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = const",
                            "wskazowka": "Pozioma linia oznacza stałą wartość na osi pionowej. Skoro jest powyżej zera, prędkość jest dodatnia."
                        },
                        {
                            "pytanie": "Co oznacza pozioma linia a(t) na poziomie zera?",
                            "odpowiedzi": [
                                "Brak przyspieszenia",
                                "Stałe przyspieszenie 10 m/s²",
                                "Ruch niemożliwy"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = 0",
                            "wskazowka": "Wartość a = 0 oznacza, że wektor prędkości się nie zmienia."
                        },
                        {
                            "pytanie": "Jeśli wykres v(t) jest prostą rosnącą, przyspieszenie jest...",
                            "odpowiedzi": [
                                "Stałe i dodatnie",
                                "Równe zero",
                                "Zawsze ujemne"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Stałe nachylenie rosnącej prostej oznacza stałe dodatnie a."
                        },
                        {
                            "pytanie": "Jeśli wykres v(t) przecina oś czasu, co może to oznaczać?",
                            "odpowiedzi": [
                                "Prędkość zmieniła znak",
                                "Masa stała się zerowa",
                                "Czas przestał płynąć"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Na osi czasu v = 0. Jeśli wykres przechodzi z wartości dodatnich na ujemne, zmienia się zwrot ruchu."
                        },
                        {
                            "pytanie": "Jak wygląda x(t) dla spoczynku?",
                            "odpowiedzi": [
                                "Linia pozioma",
                                "Linia rosnąca o stałym nachyleniu",
                                "Parabola zawsze"
                            ],
                            "prawidlowa": 0,
                            "wzor": "x = const",
                            "wskazowka": "Spoczynek oznacza, że położenie nie zmienia się wraz z czasem."
                        },
                        {
                            "pytanie": "Jeżeli wykres x(t) jest coraz bardziej stromy w dodatnim kierunku, to wartość prędkości...",
                            "odpowiedzi": [
                                "Rośnie",
                                "Maleje do zera",
                                "Jest stała"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Stromość x(t) oznacza wartość prędkości. Coraz większe nachylenie oznacza wzrost prędkości."
                        },
                        {
                            "pytanie": "Pole pod wykresem a(t) w przedziale czasu odpowiada zmianie...",
                            "odpowiedzi": [
                                "Prędkości",
                                "Położenia bezpośrednio",
                                "Masy"
                            ],
                            "prawidlowa": 0,
                            "wzor": "Δv = ∫a(t)dt",
                            "wskazowka": "Jednostka pola to m/s² · s = m/s, czyli jednostka zmiany prędkości."
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
                            "wzor": "a = g ≈ 9,81 m/s²",
                            "wskazowka": "Na ciało działa grawitacja. Przyjmij zwrot osi i odpowiednio przypisz znak przyspieszeniu g."
                        },
                        {
                            "pytanie": "Ciało spada z v₀ = 0. Jak obliczyć jego prędkość po czasie t?",
                            "odpowiedzi": [
                                "v = gt",
                                "v = g/t",
                                "v = t/g"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = v₀ + gt = gt",
                            "wskazowka": "To szczególny przypadek ruchu jednostajnie przyspieszonego z v₀ = 0 i przyspieszeniem g."
                        },
                        {
                            "pytanie": "Jaką drogę pokona ciało puszczone swobodnie po czasie t?",
                            "odpowiedzi": [
                                "h = ½gt²",
                                "h = gt",
                                "h = g/t²"
                            ],
                            "prawidlowa": 0,
                            "wzor": "h = ½gt²",
                            "wskazowka": "Użyj wzoru na drogę przy stałym przyspieszeniu i zauważ, że v₀ = 0."
                        },
                        {
                            "pytanie": "W najwyższym punkcie rzutu pionowego w górę prędkość chwilowa wynosi...",
                            "odpowiedzi": [
                                "0",
                                "g",
                                "Maksimum"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "W najwyższym punkcie ciało na moment przestaje poruszać się w górę, zanim zacznie spadać."
                        },
                        {
                            "pytanie": "Czy w najwyższym punkcie rzutu pionowego przyspieszenie jest równe zero?",
                            "odpowiedzi": [
                                "Nie, nadal działa grawitacja",
                                "Tak, zawsze",
                                "Tylko gdy ciało ma masę 0"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a = −g (oś dodatnia w górę)",
                            "wskazowka": "Prędkość może być chwilowo równa zero, ale grawitacja nadal działa."
                        },
                        {
                            "pytanie": "Ciało rzucono pionowo w górę z v₀. Jak znaleźć czas do osiągnięcia najwyższego punktu?",
                            "odpowiedzi": [
                                "t = v₀/g",
                                "t = g/v₀",
                                "t = v₀g"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = v₀ − gt; 0 = v₀ − gt",
                            "wskazowka": "W najwyższym punkcie przyjmij v = 0. Z równania prędkości wyznacz t."
                        },
                        {
                            "pytanie": "Dwa ciała spadają z tej samej wysokości bez oporu powietrza. Jedno jest cięższe. Które ma większe przyspieszenie?",
                            "odpowiedzi": [
                                "Oba mają takie samo g",
                                "Cięższe",
                                "Lżejsze"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "W modelu swobodnego spadku przyspieszenie g nie zależy od masy ciała."
                        },
                        {
                            "pytanie": "Jeśli wysokość swobodnego spadku wzrośnie czterokrotnie, czas spadania wzrośnie...",
                            "odpowiedzi": [
                                "Dwukrotnie",
                                "Czterokrotnie",
                                "Ośmiokrotnie"
                            ],
                            "prawidlowa": 0,
                            "wzor": "h = ½gt²",
                            "wskazowka": "Zależność wysokości od czasu zawiera t². Porównaj pierwiastki ze stosunku wysokości."
                        },
                        {
                            "pytanie": "Jaką prędkość ma ciało po 2 s swobodnego spadku, przyjmując g = 10 m/s²?",
                            "odpowiedzi": [
                                "20 m/s",
                                "5 m/s",
                                "40 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = gt",
                            "wskazowka": "Podstaw g = 10 m/s² i t = 2 s. Jednostka wyniku powinna wyjść m/s."
                        },
                        {
                            "pytanie": "W rzucie pionowym w górę, po minięciu najwyższego punktu ciało...",
                            "odpowiedzi": [
                                "Zaczyna zwiększać wartość prędkości w dół",
                                "Ma nadal stałą prędkość zero",
                                "Przestaje podlegać grawitacji"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Po osiągnięciu v = 0 ciało zaczyna spadać. Grawitacja nadaje mu coraz większą prędkość skierowaną w dół."
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
                            "wzor": "v_{A/B} = v_A − v_B",
                            "wskazowka": "Zamiast względem Ziemi wybierz jako obserwatora drugie ciało. Wtedy porównujesz ich prędkości wektorowo."
                        },
                        {
                            "pytanie": "Dwa samochody jadą w tym samym kierunku z 30 m/s i 20 m/s. Jaka jest szybkość względna?",
                            "odpowiedzi": [
                                "10 m/s",
                                "50 m/s",
                                "600 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_wzgl = |v₁ − v₂|",
                            "wskazowka": "Przy zgodnych kierunkach odejmij prędkości. Większa prędkość „ucieka” drugiemu pojazdowi o różnicę."
                        },
                        {
                            "pytanie": "Dwa pojazdy jadą naprzeciw siebie z 15 m/s i 10 m/s. Jaka jest szybkość zbliżania?",
                            "odpowiedzi": [
                                "25 m/s",
                                "5 m/s",
                                "150 m/s"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_wzgl = v₁ + v₂",
                            "wskazowka": "Przy ruchu w przeciwnych kierunkach odległość między pojazdami zmniejsza się w tempie będącym sumą ich szybkości."
                        },
                        {
                            "pytanie": "Pasażer siedzi w jadącym pociągu. Względem pociągu jest...",
                            "odpowiedzi": [
                                "W spoczynku",
                                "Zawsze w ruchu",
                                "W ruchu tylko na zakrętach"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Ruch zależy od układu odniesienia. Dla obserwatora siedzącego w tym samym pociągu położenie pasażera się nie zmienia."
                        },
                        {
                            "pytanie": "Jeśli deszcz pada pionowo względem Ziemi, osoba jadąca rowerem odczuwa go pod kątem. Dlaczego?",
                            "odpowiedzi": [
                                "Bo widzi prędkość deszczu względną względem siebie",
                                "Bo grawitacja zmienia kierunek deszczu",
                                "Bo deszcz przestaje być pionowy względem Ziemi"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_{deszcz/osoba} = v_{deszcz/Ziemia} − v_{osoba/Ziemia}",
                            "wskazowka": "Oblicz prędkość deszczu względem rowerzysty, odejmując wektory prędkości."
                        },
                        {
                            "pytanie": "Jeśli obserwator porusza się razem z ciałem, jego prędkość względem obserwatora wynosi...",
                            "odpowiedzi": [
                                "0",
                                "Prędkość ciała względem Ziemi",
                                "Zawsze g"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Oba obiekty mają wtedy tę samą prędkość, więc ich różnica wektorowa jest zerowa."
                        },
                        {
                            "pytanie": "W ruchu względnym znaczenie ma przede wszystkim...",
                            "odpowiedzi": [
                                "Wybór układu odniesienia",
                                "Tylko masa ciała",
                                "Tylko jego kształt"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Zawsze zapytaj: względem czego mierzymy położenie i prędkość? To podstawowe pytanie w zadaniach o ruch względny."
                        },
                        {
                            "pytanie": "Łódź płynie z prędkością względem wody, a rzeka ma własny nurt. Aby znaleźć prędkość łodzi względem brzegu, trzeba...",
                            "odpowiedzi": [
                                "Dodać odpowiednie wektory prędkości",
                                "Zawsze odjąć ich wartości bez względu na kierunek",
                                "Pomnożyć prędkości"
                            ],
                            "prawidlowa": 0,
                            "wzor": "⃗v_{łódź/brzeg} = ⃗v_{łódź/woda} + ⃗v_{woda/brzeg}",
                            "wskazowka": "Zwróć uwagę na kierunki wektorów. To dodawanie wektorowe, więc nie zawsze jest zwykłym dodawaniem liczb."
                        },
                        {
                            "pytanie": "Jeśli dwa ciała mają identyczne wektory prędkości w tym samym układzie, ich prędkość względna wynosi...",
                            "odpowiedzi": [
                                "0",
                                "Podwojoną wartość",
                                "Połowę wartości"
                            ],
                            "prawidlowa": 0,
                            "wzor": "⃗v_{A/B} = ⃗v_A − ⃗v_B = 0",
                            "wskazowka": "Odejmij identyczne wektory. Wynik jest wektorem zerowym."
                        },
                        {
                            "pytanie": "Dlaczego określenie „ciało porusza się” bez podania układu odniesienia może być niepełne?",
                            "odpowiedzi": [
                                "Bo ruch i spoczynek są względne względem wybranego obserwatora",
                                "Bo ruch zależy od temperatury",
                                "Bo każde ciało musi być w ruchu względem każdego obserwatora"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Ten sam obiekt może spoczywać względem jednego obserwatora i poruszać się względem innego."
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
                            "wzor": "ω = 2π/T",
                            "wskazowka": "Jedno pełne okrążenie odpowiada 2π radianom i trwa okres T. Podziel kąt pełnego obrotu przez czas."
                        },
                        {
                            "pytanie": "Jak związać częstotliwość z okresem ruchu?",
                            "odpowiedzi": [
                                "f = 1/T",
                                "f = T",
                                "f = T²"
                            ],
                            "prawidlowa": 0,
                            "wzor": "f = 1/T",
                            "wskazowka": "Częstotliwość mówi, ile pełnych obiegów przypada na sekundę, więc jest odwrotnością czasu jednego obiegu."
                        },
                        {
                            "pytanie": "Jak obliczyć szybkość liniową w ruchu po okręgu?",
                            "odpowiedzi": [
                                "v = ωr",
                                "v = ω/r",
                                "v = r/ω"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v = ωr",
                            "wskazowka": "Prędkość liniowa rośnie wraz z promieniem przy tej samej prędkości kątowej."
                        },
                        {
                            "pytanie": "Gdzie skierowane jest przyspieszenie dośrodkowe?",
                            "odpowiedzi": [
                                "Do środka okręgu",
                                "Wzdłuż stycznej zawsze",
                                "Na zewnątrz okręgu"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Narysuj ciało na okręgu i zaznacz środek. Przyspieszenie dośrodkowe wskazuje od ciała do środka toru."
                        },
                        {
                            "pytanie": "Czy ciało poruszające się po okręgu ze stałą szybkością ma przyspieszenie?",
                            "odpowiedzi": [
                                "Tak, bo zmienia kierunek prędkości",
                                "Nie, bo szybkość jest stała",
                                "Tylko gdy zmienia masę"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Szybkość może być stała, ale wektor prędkości stale zmienia kierunek."
                        },
                        {
                            "pytanie": "Samochód jedzie po okręgu z v = 10 m/s i r = 50 m. Jakie ma przyspieszenie dośrodkowe?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "5 m/s²",
                                "500 m/s²"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Podnieś 10 m/s do kwadratu, a następnie podziel przez promień 50 m."
                        },
                        {
                            "pytanie": "Jeśli przy tej samej prędkości promień toru zwiększymy dwukrotnie, przyspieszenie dośrodkowe...",
                            "odpowiedzi": [
                                "Zmniejszy się dwukrotnie",
                                "Wzrośnie dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Przy stałym v promień znajduje się w mianowniku. Zwiększenie r zmniejsza wartość a_d."
                        },
                        {
                            "pytanie": "Jeśli przy tym samym promieniu podwoimy prędkość, przyspieszenie dośrodkowe...",
                            "odpowiedzi": [
                                "Wzrośnie czterokrotnie",
                                "Wzrośnie dwukrotnie",
                                "Zmniejszy się dwukrotnie"
                            ],
                            "prawidlowa": 0,
                            "wzor": "a_d = v²/r",
                            "wskazowka": "Prędkość występuje w kwadracie. Podwojenie v oznacza czynnik 2²."
                        },
                        {
                            "pytanie": "Co jest okresem ruchu po okręgu?",
                            "odpowiedzi": [
                                "Czas jednego pełnego obiegu",
                                "Liczba obiegów w sekundzie",
                                "Długość promienia"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Okres oznacza czas potrzebny na wykonanie dokładnie jednego pełnego cyklu."
                        },
                        {
                            "pytanie": "Jak zmieni się częstotliwość, jeśli okres ruchu skróci się dwukrotnie?",
                            "odpowiedzi": [
                                "Wzrośnie dwukrotnie",
                                "Zmniejszy się dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0,
                            "wzor": "f = 1/T",
                            "wskazowka": "Częstotliwość i okres są odwrotnie proporcjonalne. Mniejszy okres oznacza więcej obiegów w tej samej sekundzie."
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
                            "wzor": "v_x = const",
                            "wskazowka": "Grawitacja działa pionowo, więc nie zmienia poziomej składowej prędkości w idealnym modelu."
                        },
                        {
                            "pytanie": "W rzucie poziomym jaka siła odpowiada za zmianę pionowej prędkości?",
                            "odpowiedzi": [
                                "Grawitacja",
                                "Siła pozioma o stałej wartości",
                                "Siła sprężystości"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "W idealnym rzucie po opuszczeniu wyrzutni pozostaje grawitacja, która nadaje pionowe przyspieszenie g."
                        },
                        {
                            "pytanie": "Tor rzutu poziomego bez oporu powietrza ma kształt...",
                            "odpowiedzi": [
                                "Paraboli",
                                "Okręgu",
                                "Prostej poziomej"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Poziomo ruch jest jednostajny, a pionowo jednostajnie przyspieszony. Po połączeniu obu zależności otrzymujesz parabolę."
                        },
                        {
                            "pytanie": "Czas spadania w rzucie poziomym z wysokości h zależy przede wszystkim od...",
                            "odpowiedzi": [
                                "Wysokości i grawitacji",
                                "Masy ciała",
                                "Poziomej prędkości początkowej"
                            ],
                            "prawidlowa": 0,
                            "wzor": "h = ½gt²",
                            "wskazowka": "Ruch pionowy jest niezależny od poziomej składowej. Z równania pionowego wyznacz czas."
                        },
                        {
                            "pytanie": "Zasięg rzutu poziomego można obliczyć jako...",
                            "odpowiedzi": [
                                "x = v₀t",
                                "x = gt",
                                "x = h/t"
                            ],
                            "prawidlowa": 0,
                            "wzor": "x = v₀t",
                            "wskazowka": "Poziomo ciało porusza się ze stałą prędkością v₀. Zasięg to pozioma prędkość razy czas lotu."
                        },
                        {
                            "pytanie": "W rzucie ukośnym, bez oporu powietrza, przyspieszenie poziome jest...",
                            "odpowiedzi": [
                                "Równe zero",
                                "Równe g",
                                "Zawsze ujemne"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "Grawitacja działa pionowo. W poziomie, jeśli pomijamy opór, nie ma przyspieszenia."
                        },
                        {
                            "pytanie": "W najwyższym punkcie rzutu ukośnego pionowa składowa prędkości wynosi...",
                            "odpowiedzi": [
                                "0",
                                "g",
                                "Maksimum"
                            ],
                            "prawidlowa": 0,
                            "wskazowka": "To moment, w którym pionowy ruch zmienia zwrot z wznoszenia na opadanie."
                        },
                        {
                            "pytanie": "Czy pozioma składowa prędkości w rzucie ukośnym zmienia się bez oporu powietrza?",
                            "odpowiedzi": [
                                "Nie, pozostaje stała",
                                "Tak, rośnie z g",
                                "Tak, maleje do zera"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_x = v₀ cosα = const",
                            "wskazowka": "Rozłóż prędkość początkową na składowe. Grawitacja wpływa tylko na składową pionową."
                        },
                        {
                            "pytanie": "Dla rzutu ukośnego pod kątem α składowa pionowa prędkości początkowej wynosi...",
                            "odpowiedzi": [
                                "v₀ sinα",
                                "v₀ cosα",
                                "v₀/α"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_{0y} = v₀ sinα",
                            "wskazowka": "Narysuj wektor v₀ jako przeciwprostokątną trójkąta. Składowa pionowa jest bokiem naprzeciw kąta α."
                        },
                        {
                            "pytanie": "Dla rzutu ukośnego składowa pozioma prędkości początkowej wynosi...",
                            "odpowiedzi": [
                                "v₀ cosα",
                                "v₀ sinα",
                                "v₀α"
                            ],
                            "prawidlowa": 0,
                            "wzor": "v_{0x} = v₀ cosα",
                            "wskazowka": "Składowa pozioma jest bokiem przyległym do kąta α, więc korzystasz z cosinusa."
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli wypadkowa siła działająca na ciało wynosi 0, ciało może:",
                            "odpowiedzi": [
                                "Spoczywać lub poruszać się ruchem jednostajnym",
                                "Zawsze przyspieszać",
                                "Zawsze hamować"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dwie siły 8 N i 5 N działają w przeciwnych kierunkach. Wypadkowa ma wartość:",
                            "odpowiedzi": [
                                "3 N",
                                "13 N",
                                "40 N"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        }
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
                            "odpowiedzi": [
                                "Elipsa",
                                "Koło",
                                "Parabola"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Okres obiegu planety wokół Słońca rośnie wraz z odległością zgodnie z:",
                            "odpowiedzi": [
                                "III prawem Keplera",
                                "Prawem Ohma",
                                "Prawem Archimedesa"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Satelita na orbicie kołowej porusza się dzięki równowadze między bezwładnością a:",
                            "odpowiedzi": [
                                "Grawitacją",
                                "Tarciem powietrza",
                                "Siłą elektryczną"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zwiększenie masy planety 2 razy przy tej samej odległości powoduje siłę grawitacji:",
                            "odpowiedzi": [
                                "2 razy większą",
                                "4 razy większą",
                                "Bez zmiany"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Prędkość ucieczki z danego ciała zależy między innymi od jego:",
                            "odpowiedzi": [
                                "Masy i promienia",
                                "Koloru",
                                "Liczby pierścieni"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Barwa gwiazdy jest związana z jej:",
                            "odpowiedzi": [
                                "Temperaturą powierzchni",
                                "Odległością od Ziemi wyłącznie",
                                "Masą Ziemi"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W widmie gwiazdy linie absorpcyjne mogą informować o:",
                            "odpowiedzi": [
                                "Składzie chemicznym",
                                "Promieniu Ziemi",
                                "Kształcie orbity Księżyca"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która planeta krąży najbliżej Słońca?",
                            "odpowiedzi": [
                                "Merkury",
                                "Wenus",
                                "Mars"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która planeta ma największą masę i rozmiary w Układzie Słonecznym?",
                            "odpowiedzi": [
                                "Jowisz",
                                "Saturn",
                                "Neptun"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Pozostałością po gwieździe podobnej do Słońca może być:",
                            "odpowiedzi": [
                                "Biały karzeł",
                                "Gwiazda neutronowa zawsze",
                                "Jowisz"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Supernowa może być końcowym etapem ewolucji:",
                            "odpowiedzi": [
                                "Niektórych masywnych gwiazd",
                                "Każdej planety",
                                "Każdego meteoru"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Które typy kształtów mogą mieć galaktyki?",
                            "odpowiedzi": [
                                "Spiralny, eliptyczny lub nieregularny",
                                "Tylko kulisty",
                                "Tylko płaski prostokąt"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Odległość do bardzo dalekich galaktyk można szacować między innymi na podstawie:",
                            "odpowiedzi": [
                                "Przesunięcia ku czerwieni",
                                "Koloru oceanu",
                                "Ciśnienia atmosferycznego"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jednostką odległości często używaną w astronomii jest:",
                            "odpowiedzi": [
                                "Rok świetlny",
                                "Sekunda świetlna?",
                                "Wat"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaką wielkość mierzy się w latach świetlnych?",
                            "odpowiedzi": [
                                "Odległości",
                                "Czasu",
                                "Mocy"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Obserwowane przesunięcie ku czerwieni odległych galaktyk jest zgodne z:",
                            "odpowiedzi": [
                                "Rozszerzaniem się Wszechświata",
                                "Brakiem ruchu galaktyk",
                                "Kurczeniem się wszystkich gwiazd"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Mikrofalowe promieniowanie tła jest pozostałością po:",
                            "odpowiedzi": [
                                "Wczesnym Wszechświecie",
                                "Powierzchni Słońca",
                                "Atmosferze Ziemi"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Ruch gwiazd wokół centrum galaktyki dostarcza informacji o:",
                            "odpowiedzi": [
                                "Rozkładzie masy w galaktyce",
                                "Temperaturze oceanu",
                                "Ciśnieniu na Ziemi"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaką okresową zmianę jasności gwiazdy obserwuje się podczas tranzytu egzoplanety?",
                            "odpowiedzi": [
                                "Spadki jasności gwiazdy",
                                "Wzrosty masy gwiazdy",
                                "Zmiany temperatury Ziemi"
                            ],
                            "prawidlowa": 0
                        }
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
                            "odpowiedzi": [
                                "0,5 s",
                                "2 s",
                                "4 s"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W ruchu harmonicznym w położeniu równowagi prędkość jest:",
                            "odpowiedzi": [
                                "Maksymalna",
                                "Zawsze zerowa",
                                "Równa amplitudzie"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Amplituda to:",
                            "odpowiedzi": [
                                "Maksymalne wychylenie od równowagi",
                                "Czas jednego drgania",
                                "Liczba drgań na sekundę"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli okres wynosi 0,25 s, częstotliwość wynosi:",
                            "odpowiedzi": [
                                "4 Hz",
                                "0,25 Hz",
                                "2 Hz"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zwiększenie częstotliwości 2 razy powoduje okres:",
                            "odpowiedzi": [
                                "2 razy mniejszy",
                                "2 razy większy",
                                "bez zmiany"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W maksymalnym wychyleniu sprężyny energia potencjalna jest:",
                            "odpowiedzi": [
                                "Maksymalna",
                                "Zawsze zerowa",
                                "Ujemna"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Tłumienie drgań powoduje z czasem:",
                            "odpowiedzi": [
                                "Zmniejszanie amplitudy",
                                "Wzrost amplitudy",
                                "Brak zmian"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli częstotliwość fali wzrośnie 2 razy w tym samym ośrodku, długość fali:",
                            "odpowiedzi": [
                                "Zmniejszy się 2 razy",
                                "Wzrośnie 2 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jednostką długości fali jest:",
                            "odpowiedzi": [
                                "metr",
                                "herc",
                                "sekunda"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Fala na napiętej linie może być:",
                            "odpowiedzi": [
                                "Poprzeczna",
                                "Tylko podłużna",
                                "Zawsze elektromagnetyczna"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Czego potrzebuje fala mechaniczna, aby mogła się rozchodzić?",
                            "odpowiedzi": [
                                "Ośrodka materialnego",
                                "Zawsze próżni",
                                "Wyłącznie metalu"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Kiedy dyfrakcja na przeszkodzie jest szczególnie wyraźna w porównaniu z długością fali?",
                            "odpowiedzi": [
                                "Porównywalny z długością fali",
                                "Milion razy większy od fali",
                                "Zawsze zerowy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jakie zjawisko fizyczne opisuje interferencja?",
                            "odpowiedzi": [
                                "Nakładania się fal",
                                "Tylko odbicia od lustra",
                                "Tylko fal dźwiękowych"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Człowiek słyszy dźwięk o częstotliwości:",
                            "odpowiedzi": [
                                "20 Hz–20 kHz w przybliżeniu",
                                "1–5 Hz",
                                "100–1000 kHz"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Głośność dźwięku jest związana przede wszystkim z:",
                            "odpowiedzi": [
                                "Amplitudą drgań",
                                "Długością fali wyłącznie",
                                "Masą źródła"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Syrena oddala się od stojącego obserwatora. Ton staje się:",
                            "odpowiedzi": [
                                "Niższy",
                                "Wyższy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Efekt Dopplera wynika z:",
                            "odpowiedzi": [
                                "Ruchu względnego źródła i obserwatora",
                                "Zmiany masy fali",
                                "Zaniku ośrodka"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jednostką natężenia dźwięku w SI jest:",
                            "odpowiedzi": [
                                "W/m²",
                                "W",
                                "Hz"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Oddalenie od punktowego źródła powoduje spadek natężenia zgodnie z prawem odwrotności:",
                            "odpowiedzi": [
                                "Kwadratu odległości",
                                "Pierwszej potęgi masy",
                                "Czasu"
                            ],
                            "prawidlowa": 0
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
                    "quiz": [
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
                            "odpowiedzi": [
                                "Kąt padania = kąt odbicia",
                                "Kąt padania > kąt odbicia",
                                "Kąt padania < kąt odbicia"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Ogniskowa zwierciadła sferycznego jest związana z promieniem krzywizny przez:",
                            "odpowiedzi": [
                                "f=R/2",
                                "f=2R",
                                "f=R²"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zwierciadło wypukłe tworzy dla rzeczywistego przedmiotu obraz:",
                            "odpowiedzi": [
                                "Pozorny, prosty i pomniejszony",
                                "Rzeczywisty i powiększony",
                                "Zawsze odwrócony i większy"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Przedmiot ustawiony dalej niż ognisko soczewki skupiającej może dać obraz:",
                            "odpowiedzi": [
                                "Rzeczywisty",
                                "Zawsze pozorny",
                                "Zawsze nieistniejący"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zdolność skupiająca 2 D odpowiada ogniskowej:",
                            "odpowiedzi": [
                                "0,5 m",
                                "2 m",
                                "0,02 m"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zdolność skupiająca soczewki rozpraszającej ma znak:",
                            "odpowiedzi": [
                                "Ujemny",
                                "Dodatni",
                                "Zawsze zerowy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Promienie równoległe po przejściu przez soczewkę rozpraszającą:",
                            "odpowiedzi": [
                                "Rozchodzą się",
                                "Zawsze skupiają się w ognisku rzeczywistym",
                                "Nie zmieniają kierunku"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dalekowzroczność koryguje się soczewką:",
                            "odpowiedzi": [
                                "Skupiającą",
                                "Rozpraszającą",
                                "Bez mocy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Lupa wykorzystuje soczewkę skupiającą do uzyskania obrazu:",
                            "odpowiedzi": [
                                "Pozornego powiększonego",
                                "Rzeczywistego pomniejszonego",
                                "Zawsze odwróconego"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Wzrost długości fali przy tej samej szczelinie zwykle powoduje dyfrakcję:",
                            "odpowiedzi": [
                                "Silniejszą",
                                "Słabszą",
                                "Niemożliwą"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dyfrakcję można obserwować dla:",
                            "odpowiedzi": [
                                "Światła",
                                "Tylko dźwięku",
                                "Tylko wody"
                            ],
                            "prawidlowa": 0
                        }
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
                            "odpowiedzi": [
                                "10 C",
                                "0,4 C",
                                "2,5 C"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaki znak ma ładunek elektronu?",
                            "odpowiedzi": [
                                "Ujemny",
                                "Dodatni",
                                "Zawsze zerowy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która jednostka SI odpowiada ładunkowi elektrycznemu?",
                            "odpowiedzi": [
                                "Kulomb",
                                "Amper",
                                "Wolt"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Linie pola elektrycznego wychodzą z ładunku dodatniego:",
                            "odpowiedzi": [
                                "Na zewnątrz",
                                "Do środka",
                                "Tylko pionowo"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jednostką natężenia pola elektrycznego może być:",
                            "odpowiedzi": [
                                "N/C",
                                "C/N",
                                "J/s"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dwa ładunki mają wartości 2 μC i 3 μC. Ich iloczyn wynosi:",
                            "odpowiedzi": [
                                "6 μC²",
                                "5 μC",
                                "1,5 μC²"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jak oddziałują na siebie ładunki jednoimienne?",
                            "odpowiedzi": [
                                "Odpychają się",
                                "Przyciągają się",
                                "Nie oddziałują"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Amperomierz włącza się do obwodu:",
                            "odpowiedzi": [
                                "Szeregowo",
                                "Równolegle",
                                "Poza obwodem"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Konwencjonalny kierunek prądu w obwodzie zewnętrznym przyjmuje się od:",
                            "odpowiedzi": [
                                "Bieguna dodatniego do ujemnego",
                                "Ujemnego do dodatniego",
                                "Środka baterii"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Przy stałym napięciu opór wzrasta 3 razy. Natężenie prądu:",
                            "odpowiedzi": [
                                "Maleje 3 razy",
                                "Rośnie 3 razy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Woltomierz podłącza się:",
                            "odpowiedzi": [
                                "Równolegle",
                                "Szeregowo",
                                "Tylko do źródła"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Żarówka 100 W działa przez 10 s. Zużyta energia wynosi:",
                            "odpowiedzi": [
                                "1000 J",
                                "100 J",
                                "10 J"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Która jednostka SI odpowiada mocy elektrycznej?",
                            "odpowiedzi": [
                                "W",
                                "J",
                                "C"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jednostką indukcji magnetycznej jest:",
                            "odpowiedzi": [
                                "tesla",
                                "weber na metr?",
                                "kulomb"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jak oddziałują na siebie bieguny magnetyczne jednoimienne?",
                            "odpowiedzi": [
                                "Odpychają się",
                                "Przyciągają się",
                                "Nie oddziałują"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaką siłę magnetyczną odczuwa nieruchomy ładunek w polu magnetycznym?",
                            "odpowiedzi": [
                                "0",
                                "qB",
                                "Zawsze 1 N"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Co dzieje się z siłą magnetyczną, gdy prędkość cząstki jest równoległa do pola?",
                            "odpowiedzi": [
                                "Wynosi 0",
                                "Jest maksymalna",
                                "Zależy tylko od masy"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Szybsza zmiana strumienia oznacza zwykle wartość SEM:",
                            "odpowiedzi": [
                                "Większą",
                                "Mniejszą",
                                "Zawsze zerową"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zjawisko indukcji elektromagnetycznej wykorzystuje:",
                            "odpowiedzi": [
                                "Generator",
                                "Termometr rtęciowy",
                                "Barometr"
                            ],
                            "prawidlowa": 0
                        }
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
                            "odpowiedzi": [
                                "Nie można jednocześnie dokładnie znać pęd i położenie",
                                "Energia jest zawsze nieokreślona",
                                "Czas zawsze się zmienia"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli częstotliwość fotonu wzrośnie 2 razy, jego energia:",
                            "odpowiedzi": [
                                "Wzrośnie 2 razy",
                                "Zmaleje 2 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Stała Plancka ma jednostkę:",
                            "odpowiedzi": [
                                "J·s",
                                "J/s",
                                "C·s"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zwiększenie częstotliwości światła powyżej progu zwiększa maksymalną energię:",
                            "odpowiedzi": [
                                "Elektronów fotoelektrycznych",
                                "Jąder atomowych zawsze",
                                "Fotonów do zera"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zwiększenie natężenia światła przy częstotliwości powyżej progu zwiększa przede wszystkim:",
                            "odpowiedzi": [
                                "Liczbę wybitych elektronów",
                                "Ich maksymalną energię liniowo zawsze",
                                "Pracę wyjścia metalu"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Izotopy tego samego pierwiastka mają taką samą liczbę:",
                            "odpowiedzi": [
                                "Protonów",
                                "Neutronów",
                                "Nukleonów zawsze"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Liczba atomowa określa liczbę:",
                            "odpowiedzi": [
                                "Protonów",
                                "Neutronów",
                                "Wszystkich nukleonów"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W rozpadzie β⁻ neutron zamienia się w proton, więc liczba atomowa:",
                            "odpowiedzi": [
                                "Rośnie o 1",
                                "Maleje o 1",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W rozpadzie gamma jądro emituje:",
                            "odpowiedzi": [
                                "Foton promieniowania elektromagnetycznego",
                                "Elektron zawsze",
                                "Helowe jądro"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Po dwóch okresach półtrwania pozostaje:",
                            "odpowiedzi": [
                                "25%",
                                "50%",
                                "12,5%"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Okres półtrwania próbki wynosi 8 dni. Po 24 dniach pozostanie:",
                            "odpowiedzi": [
                                "1/8 początkowej ilości",
                                "1/3",
                                "1/24"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Defekt masy jest związany z:",
                            "odpowiedzi": [
                                "Energią wiązania",
                                "Wyłącznie liczbą elektronów",
                                "Ciśnieniem atmosferycznym"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zależność masy i energii opisuje:",
                            "odpowiedzi": [
                                "E=mc²",
                                "p=mv²",
                                "F=ma²"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Synteza jądrowa zachodzi w Słońcu głównie poprzez łączenie jąder:",
                            "odpowiedzi": [
                                "Wodoru",
                                "Żelaza",
                                "Ołowiu"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Reakcja łańcuchowa w reaktorze wymaga kontroli liczby:",
                            "odpowiedzi": [
                                "Neutronów wywołujących kolejne rozszczepienia",
                                "Elektronów walencyjnych",
                                "Fotonów widzialnych"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Które promieniowanie ma największą zdolność przenikania z typowej trójki α, β, γ?",
                            "odpowiedzi": [
                                "γ",
                                "β",
                                "α"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Do ochrony przed promieniowaniem gamma stosuje się między innymi:",
                            "odpowiedzi": [
                                "Grube warstwy materiałów o dużej gęstości",
                                "Cienki papier",
                                "Próżnię"
                            ],
                            "prawidlowa": 0
                        }
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
                            "odpowiedzi": [
                                "E = mc²",
                                "E = ½mv²",
                                "E = U·q"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Efekt dylatacji czasu staje się istotny przy prędkościach:",
                            "odpowiedzi": [
                                "Bliskich prędkości światła",
                                "Rzędu 1 m/s",
                                "Tylko zerowych"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W jakim układzie odniesienia mierzy się czas własny zdarzenia?",
                            "odpowiedzi": [
                                "W układzie, w którym mierzone zdarzenia zachodzą w tym samym miejscu",
                                "Zawsze na Ziemi",
                                "Zawsze w laboratorium"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Kontrakcja długości dotyczy kierunku:",
                            "odpowiedzi": [
                                "Równoległego do ruchu",
                                "Prostopadłego do ruchu wyłącznie",
                                "Wszystkich kierunków identycznie"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dla prędkości znacznie mniejszej od c efekty relatywistyczne są:",
                            "odpowiedzi": [
                                "Bardzo małe",
                                "Maksymalne",
                                "Nieskończone"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli masa spoczynkowa wzrośnie 3 razy, energia spoczynkowa:",
                            "odpowiedzi": [
                                "Wzrośnie 3 razy",
                                "Wzrośnie 9 razy",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Równanie E=mc² pokazuje równoważność:",
                            "odpowiedzi": [
                                "Masy i energii",
                                "Masy i czasu",
                                "Siły i temperatury"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zegar bliżej silnego pola grawitacyjnego względem odległego obserwatora tyka:",
                            "odpowiedzi": [
                                "Wolniej",
                                "Szybciej",
                                "Tak samo zawsze"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Soczewkowanie grawitacyjne polega na:",
                            "odpowiedzi": [
                                "Uginaniu toru światła przez grawitację",
                                "Zwiększaniu masy fotonu",
                                "Zatrzymaniu światła w każdym polu"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Fale grawitacyjne mogą powstawać podczas zderzeń:",
                            "odpowiedzi": [
                                "Czarnych dziur",
                                "Kropli wody",
                                "Samochodów"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Detektory fal grawitacyjnych mierzą niezwykle małe zmiany:",
                            "odpowiedzi": [
                                "Długości ramion interferometru",
                                "Masy Ziemi",
                                "Temperatury lustra"
                            ],
                            "prawidlowa": 0
                        }
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
                            "odpowiedzi": [
                                "Uporządkowaniem dalekiego zasięgu",
                                "Całkowitym brakiem atomów",
                                "Zawsze ciekłym stanem"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jak nazywa się najmniejszy powtarzalny fragment sieci krystalicznej?",
                            "odpowiedzi": [
                                "Komórka elementarna",
                                "Jądro",
                                "Granica fazy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Monokryształ ma uporządkowanie krystaliczne:",
                            "odpowiedzi": [
                                "Rozciągające się przez całą próbkę",
                                "Tylko na powierzchni",
                                "Tylko w jednym atomie"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dyslokacja jest przykładem defektu:",
                            "odpowiedzi": [
                                "Liniowego",
                                "Punktowego zawsze",
                                "Powierzchniowego zawsze"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Wzrost temperatury zwykle zwiększa liczbę drgań atomów w sieci:",
                            "odpowiedzi": [
                                "Tak",
                                "Nie",
                                "Tylko w próżni"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Materiały amorficzne nie mają uporządkowania:",
                            "odpowiedzi": [
                                "Dalekiego zasięgu",
                                "Żadnego na poziomie atomowym",
                                "Nigdy lokalnego"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Polimer może być:",
                            "odpowiedzi": [
                                "Materiałem o bardzo długich łańcuchach cząsteczek",
                                "Wyłącznie metalem",
                                "Zawsze kryształem idealnym"
                            ],
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
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
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Odkształcenie plastyczne jest:",
                            "odpowiedzi": [
                                "Trwałe",
                                "Zawsze odwracalne",
                                "Niemożliwe w metalach"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Prawo Hooke'a w zakresie sprężystym wiąże naprężenie z:",
                            "odpowiedzi": [
                                "Odkształceniem",
                                "Temperaturą wrzenia",
                                "Ładunkiem"
                            ],
                            "prawidlowa": 0
                        }
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

// Usuwamy powtarzające się lekcje z mapy. To działa na tytule tematu,
// więc np. "Skale temperatur" nie pojawią się ponownie w innym podtemacie.
function oczyscPowtorzeniaLekcji() {
    const widzianeTematy = new Set();
    const aliasy = new Map([
        ["gravitacja", "grawitacja"],
        ["grawitacja", "grawitacja"]
    ]);

    Object.values(baza).forEach(dzial => {
        Object.keys(dzial.podnagalowki || {}).forEach(podklucz => {
            const lekcje = dzial.podnagalowki[podklucz] || [];
            const unikalne = [];
            lekcje.forEach(lekcja => {
                const surowy = String(lekcja.temat || "").trim().toLocaleLowerCase("pl");
                const klucz = aliasy.get(surowy) || surowy;
                if (!klucz || widzianeTematy.has(klucz)) return;
                widzianeTematy.add(klucz);
                if (surowy === "gravitacja") lekcja.temat = "Grawitacja";
                unikalne.push(lekcja);
            });
            if (unikalne.length) {
                dzial.podnagalowki[podklucz] = unikalne;
            } else {
                delete dzial.podnagalowki[podklucz];
            }
        });
    });
}

oczyscPowtorzeniaLekcji();

function wzorzecDlaTematu(temat) { return REGULY_TEMATOW.find(([r]) => r.test(temat))?.[1] || new RegExp(temat.split(/\s+/).filter(x => x.length > 3).slice(0, 3).join("|"), "i"); }
function pytaniePasujeDoTematu(zadanie, temat) { const tekst = `${zadanie?.pytanie || ""} ${zadanie?.wzor || ""}`; return wzorzecDlaTematu(temat).test(tekst); }



function zbierzPytaniaDlaLekcji(dzialKlucz, temat, oryginalne) {
    const pula = []; const widziane = new Set();
    const dodaj = zadanie => { if (!pytanieSamodzielne(zadanie) || !pytanieJestDobre(zadanie)) return; const klucz = String(zadanie.pytanie).trim().toLowerCase(); if (!widziane.has(klucz)) { widziane.add(klucz); pula.push({...zadanie}); } };
    oryginalne.forEach(dodaj);
    Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki || {}).forEach(lekcje => lekcje.filter(l => l.temat === temat).forEach(l => (l.quiz || []).forEach(dodaj))));
    const TEMATY_KINEMATYKI = new Set([
        "Podstawy opisu ruchu", "Prędkość i czas ruchu", "Ruch jednostajny prostoliniowy",
        "Przyspieszenie i opóźnienie", "Ruch jednostajnie przyspieszony i opóźniony",
        "Wykresy ruchu", "Spadek swobodny i rzuty pionowe", "Ruch względny",
        "Ruch po okręgu", "Rzuty i ruch w dwóch wymiarach"
    ]);
    // Kinematyka ma własny, zamknięty bank. Nie dokładamy tu pytań z dynamiki ani innych części mechaniki.
    if (dzialKlucz === "mechanika" && TEMATY_KINEMATYKI.has(temat)) return pula;
    (DODATKOWE_PYTANIA_TEMATYCZNE[temat] || []).forEach(dodaj);
    if (dzialKlucz === "mechanika" && /płyn|hydrostatycz|Archimed|Bernoulli/i.test(temat)) {
        (DODATKOWE_PYTANIA_TEMATYCZNE["Mechanika płynów"] || []).forEach(dodaj);
    }
    const bank = BANKI_JAKOSCI[dzialKlucz] || [];
    bank.filter(q => pytaniePasujeDoTematu(q, temat)).forEach(dodaj);
    (pulePytanDzialow[dzialKlucz] || []).filter(q => pytaniePasujeDoTematu(q, temat)).forEach(dodaj);

    return pula;
}


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

function wygenerujWyjasnienieOdpowiedzi(pytanie) {
    if (!pytanie) return "";
    const poprawna = String(pytanie.odpowiedzi?.[pytanie.prawidlowa] || "").trim();
    const temat = String(pytanie.tematZrodlowy || pytanie.temat || "").trim();
    const rozwiazanie = oczyscTekstPodpowiedzi(pytanie.rozwiazanie || "");
    const autorskie = oczyscTekstPodpowiedzi(pytanie.wyjasnienie || "");

    if (autorskie) return autorskie;
    if (rozwiazanie) return rozwiazanie;

    const zasada = ZASADY_DO_WYJASNIEN.find(([wzorzec]) => wzorzec.test(temat))?.[1]
        || ZASADY_DO_WYJASNIEN.find(([wzorzec]) => wzorzec.test(`${pytanie.pytanie || ""} ${pytanie.wzor || ""}`))?.[1]
        || "Poprawna odpowiedź spełnia warunek fizyczny opisany w treści zadania. Pozostałe odpowiedzi naruszają ten warunek albo wynikają z niewłaściwego przekształcenia danych.";

    const wzor = oczyscTekstPodpowiedzi(pytanie.wzor || "");
    if (wzor) {
        return `${zasada} W tym zadaniu właściwą zależność zapisujemy jako ${wzor}, a po podstawieniu danych otrzymujemy: ${poprawna}.`;
    }
    return `${zasada} Dlatego w podanych warunkach poprawny jest wybór „${poprawna}”.`;
}

// Nie nadpisujemy banków zbudowanych wcześniej przez uzupelnijBankiDoMinimum().
// Poprzednia wersja zastępowała duże banki z powrotem 1–3 pytaniami z curriculum.js.
Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki || {}).forEach(lekcje => lekcje.forEach(lekcja => {
    lekcja.quiz = (Array.isArray(lekcja.quiz) ? lekcja.quiz : [])
        .filter(pytanieSamodzielne)
        .map((q, i) => ({
            ...q,
            tematZrodlowy: lekcja.temat,
            poziom: q.poziom || (i < 4 ? 1 : i < 9 ? 2 : 3),
            wskazowka: q.wskazowka || uzupelnijPodpowiedz(q),
            wyjasnienie: q.wyjasnienie || q.rozwiazanie || wygenerujWyjasnienieOdpowiedzi(q)
        }));
})));

// Ostateczne uzupełnienie po wszystkich transformacjach. Każdy zwykły temat
// dostaje co najmniej 12 pytań na poziom, a trening maturalny co najmniej 12.
// UWAGA: te funkcje korzystają z FABRYKI_PYTAN / maturaFactory, więc muszą
// zostać uruchomione dopiero po ich inicjalizacji. Wcześniejsze wywołanie
// powodowało ReferenceError: Cannot access 'FABRYKI_PYTAN' before initialization.
Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki || {}).forEach(lekcje => lekcje.forEach(lekcja => {
    lekcja.quiz = (lekcja.quiz || []).filter(pytanieSamodzielne).map((q, i) => ({
        ...q,
        tematZrodlowy: lekcja.temat,
        poziom: q.poziom || (i < 4 ? 1 : i < 9 ? 2 : 3),
        wskazowka: q.wskazowka || uzupelnijPodpowiedz(q),
        wyjasnienie: q.wyjasnienie || q.rozwiazanie || wygenerujWyjasnienieOdpowiedzi(q)
    }));
})));

function pokazWynik() {
    pokazGwiazdki();
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
                    <p>Tryb gościa pozwala szybko rozpocząć naukę, ale jego postęp i stan gwiazdek są tymczasowe i mogą zniknąć po zakończeniu sesji. Po zalogowaniu na konto wynik, odblokowane lekcje i wybrana ścieżka są zapisywane w chmurze oraz synchronizowane między urządzeniami.</p>
                </details>
                <details>
                    <summary>Jak zdobywa się punkty?</summary>
                    <p>Punkty otrzymujesz za prawidłowe odpowiedzi w quizach. Ich aktualną liczbę zobaczysz w profilu oraz na ekranach nauki.</p>
                </details>
                <details>
                    <summary>Czym są gwiazdki i ile ich dostaję?</summary>
                    <p>Zalogowany uczeń zaczyna z 5 ⭐. Jedna podpowiedź w quizie kosztuje 1 ⭐. Podpowiedź nie pokazuje wyniku — prowadzi do właściwego wzoru, kolejności działań i najważniejszego założenia. Gwiazdki są wirtualnym elementem grywalizacji i zapisują się razem z postępem konta.</p>
                </details>
                <details>
                    <summary>Jak zdobyć więcej gwiazdek?</summary>
                    <p>Otwórz panel „🎯 Misje”. Możesz zdobywać gwiazdki m.in. za ukończenie pierwszej lekcji, ukończenie kilku lekcji, zdobycie 100 punktów oraz serię poprawnych odpowiedzi. Dostępna jest też prawdziwa misja YouTube. Gwiazdki nie mają limitu, a każdą misję można odebrać tylko raz.</p>
                </details>
                <details>
                    <summary>Czy misje społecznościowe są automatycznie sprawdzane?</summary>
                    <p>Nie zawsze. Obserwowania profilu w zewnętrznej platformie nie da się uczciwie potwierdzić bez odpowiedniej integracji z jej API, dlatego taka misja działa na zasadzie zgłoszenia wykonania. Misje oparte na aktywności w Inercji wynikają z postępu i punktów konta.</p>
                </details>
                <details>
                    <summary>Dlaczego jako gość nie mogę użyć podpowiedzi?</summary>
                    <p>Podpowiedzi są dostępne tylko po zalogowaniu, ponieważ ich wykorzystanie zmienia stan gwiazdek zapisywany na koncie. Jako gość możesz rozwiązywać quizy, ale po kliknięciu podpowiedzi lub licznika ⭐ zobaczysz informację o konieczności zalogowania albo utworzenia konta.</p>
                </details>
                <details>
                    <summary>Czy można dodać sobie gwiazdki przez narzędzia przeglądarki?</summary>
                    <p>Nie zmienisz w ten sposób autorytatywnego stanu konta. Liczba gwiazdek jest kontrolowana w Cloud Firestore, a użycie podpowiedzi wykonuje atomowe zużycie 1 ⭐. Pamięć przeglądarki jest tylko kopią interfejsu.</p>
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

function poprawneGwiazdki(wartosc, domyslna = 5) {
    const gwiazdki = Number(wartosc);
    if (!Number.isFinite(gwiazdki)) return domyslna;
    return Math.min(999, Math.max(0, Math.round(gwiazdki)));
}

function poprawnePostepy(wartosc) {
    if (!wartosc || typeof wartosc !== "object" || Array.isArray(wartosc)) return {};

    return Object.fromEntries(
        Object.entries(wartosc)
            .slice(0, 1000)
            .map(([klucz, postep]) => [klucz, Math.min(100, Math.max(0, Number(postep) || 0))])
    );
}

function polaczStanyPostepu(pierwszyStan = {}, drugiStan = {}) {
    const pierwszyPostep = poprawnePostepy(pierwszyStan.lekcje);
    const drugiPostep = poprawnePostepy(drugiStan.lekcje);
    const lekcje = { ...pierwszyPostep };
    const maPierwszeGwiazdki = Object.prototype.hasOwnProperty.call(pierwszyStan, "gwiazdki");
    const maDrugieGwiazdki = Object.prototype.hasOwnProperty.call(drugiStan, "gwiazdki");
    const gwiazdkiPierwsze = maPierwszeGwiazdki ? poprawneGwiazdki(pierwszyStan.gwiazdki, 5) : null;
    const gwiazdkiDrugie = maDrugieGwiazdki ? poprawneGwiazdki(drugiStan.gwiazdki, 5) : null;
    // Brak pola w starym zapisie nie oznacza 5 nowych gwiazdek. Zachowujemy stan z drugiego źródła.
    // Gwiazdki są stanem zużywalnym: po zalogowaniu chmura jest źródłem prawdy.
    // Dzięki temu zużycie podpowiedzi nie zostanie przypadkiem cofnięte przez stary localStorage.
    const gwiazdki = gwiazdkiDrugie !== null
        ? gwiazdkiDrugie
        : (gwiazdkiPierwsze === null ? 5 : gwiazdkiPierwsze);

    Object.entries(drugiPostep).forEach(([klucz, postep]) => {
        lekcje[klucz] = Math.max(lekcje[klucz] || 0, postep);
    });

    return {
        punkty: Math.max(poprawnePunkty(pierwszyStan.punkty), poprawnePunkty(drugiStan.punkty)),
        gwiazdki,
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
        gwiazdki: poprawneGwiazdki(gwiazdkiUcznia, 5),
        lekcje: pobierzLokalnePostepy(uid),
        preferencje: poprawnePreferencje(profilUcznia)
            ? { poziom: profilUcznia.poziom, zrodlo: profilUcznia.zrodlo, cel: profilUcznia.cel }
            : (pobierzLokalnePreferencje(uid) || {})
    };
}

function zapiszStanLokalnie(uid, stan) {
    wynikGracza = poprawnePunkty(stan.punkty);
    gwiazdkiUcznia = poprawneGwiazdki(stan.gwiazdki, 5);
    localStorage.setItem(`fizyka-wynik-${uid}`, String(wynikGracza));
    localStorage.setItem(`fizyka-gwiazdki-${uid}`, String(gwiazdkiUcznia));
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
        gwiazdki: poprawneGwiazdki(gwiazdkiUcznia, 5),
        lekcje: pobierzPostepyZMagazynu(sessionStorage, aktywnyUzytkownik),
        preferencje: poprawnePreferencje(profilUcznia) ? profilUcznia : {}
    };

    if (stanGoscia.punkty > 0
        || Object.keys(stanGoscia.lekcje).length > 0
        || poprawnePreferencje(stanGoscia.preferencje)
        || stanGoscia.gwiazdki !== 5) {
        sessionStorage.setItem(kluczPostepuDoPrzeniesienia, JSON.stringify(stanGoscia));
    }
}

function pobierzPostepGosciaDoPrzeniesienia() {
    try {
        const stan = JSON.parse(sessionStorage.getItem(kluczPostepuDoPrzeniesienia));
        if (!stan || typeof stan !== "object") return null;
        return {
            punkty: poprawnePunkty(stan.punkty),
            gwiazdki: poprawneGwiazdki(stan.gwiazdki, 5),
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
            if (error?.code === "permission-denied") {
                console.error("Firestore odrzucił dostęp do postępu. Sprawdź wdrożenie firestore.rules dla projektu inercja-424dd.");
            } else {
                console.warn("Nie udało się pobrać postępu z chmury. Używam danych z tego urządzenia.", error.code);
            }
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
    gwiazdkiUcznia = poprawneGwiazdki(localStorage.getItem(`fizyka-gwiazdki-${aktywnyUzytkownik}`), 5);
    localStorage.setItem(`fizyka-gwiazdki-${aktywnyUzytkownik}`, String(gwiazdkiUcznia));
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

function pobierzPostepLekcjiDoMisji() {
    return pobierzLokalnePostepy(aktywnyUzytkownik || "gosc");
}

function liczUkonczoneLekcje() {
    return Object.values(pobierzPostepLekcjiDoMisji()).filter(v => Number(v) >= 100).length;
}

function misjaSpelnionaLokalnie(misja) {
    if (misja.typ === "postep") {
        const liczba = liczUkonczoneLekcje();
        return misja.id === "pierwsza_lekcja" ? liczba >= 1 : liczba >= 3;
    }
    if (misja.typ === "punkty") return wynikGracza >= 100;
    if (misja.typ === "sesja") return seriaPoprawnych >= 5;
    return false;
}

async function pobierzWykonaneMisje() {
    const u = auth.currentUser;
    if (!u || u.isAnonymous || !aktywnyUzytkownik) return new Set();
    try {
        const snap = await getDoc(doc(firestore, "misje", u.uid));
        return snap.exists() ? new Set(Object.keys(snap.data().wykonane || {})) : new Set();
    } catch (e) {
        console.warn("Nie udało się pobrać misji.", e);
        return new Set();
    }
}

async function odbierzNagrodeMisji(misja) {
    const u = auth.currentUser;
    if (!u || u.isAnonymous || trybGoscia || !aktywnyUzytkownik) {
        pokazInformacjeOGwiazdach();
        return;
    }

    if (misja.typ === "youtube") {
        await zweryfikujYouTubeIMisje(misja);
        return;
    }

    if (!misjaSpelnionaLokalnie(misja)) {
        alert("Ta misja nie jest jeszcze ukończona.");
        return;
    }

    try {
        const postepRef = doc(firestore, "postepy", u.uid);
        const misjeRef = doc(firestore, "misje", u.uid);
        const nowyStan = await runTransaction(firestore, async tx => {
            const [postepSnap, misjeSnap] = await Promise.all([tx.get(postepRef), tx.get(misjeRef)]);
            if (!postepSnap.exists()) throw new Error("BRAK_POSTEPU");
            const postep = postepSnap.data();
            const wykonane = misjeSnap.exists() ? (misjeSnap.data().wykonane || {}) : {};
            if (wykonane[misja.id]) throw new Error("MISJA_WYKONANA");
            const aktualne = Math.max(0, Number(postep.gwiazdki) || 0);
            const nowe = aktualne + misja.nagroda;
            const wykonanePo = { ...wykonane, [misja.id]: true };
            tx.set(misjeRef, { uid: u.uid, wykonane: wykonanePo, ostatniaMisja: misja.id, zaktualizowano: serverTimestamp() }, { merge: true });
            tx.update(postepRef, { gwiazdki: nowe, misja: misja.id, zaktualizowano: serverTimestamp() });
            return nowe;
        });
        gwiazdkiUcznia = nowyStan;
        zapiszGwiazdki();
        await pokazMisje();
    } catch (e) {
        if (e?.message === "MISJA_WYKONANA") alert("Ta misja została już odebrana.");
        else if (e?.message === "BRAK_POSTEPU") alert("Nie znaleziono zsynchronizowanego postępu. Wyloguj się i zaloguj ponownie.");
        else { console.error(e); alert("Nie udało się odebrać nagrody. Spróbuj ponownie."); }
    }
}

async function zweryfikujYouTubeIMisje(misja) {
    const u = auth.currentUser;
    const btn = document.querySelector(`[data-misja="${misja.id}"]`);
    if (!u || u.isAnonymous) return;
    if (btn) { btn.disabled = true; btn.textContent = "Sprawdzam…"; }
    try {
        const firebaseIdToken = await u.getIdToken(true);
        const accessToken = await uzyskajTokenYouTube();
        const response = await fetch("/api/missions/youtube", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${firebaseIdToken}`
            },
            body: JSON.stringify({ accessToken })
        });
        const dane = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(dane.code || "YOUTUBE_WERYFIKACJA");
        gwiazdkiUcznia = Number(dane.gwiazdki);
        zapiszGwiazdki();
        alert(`🎉 Subskrypcja potwierdzona! +${misja.nagroda} ⭐`);
        await pokazMisje();
    } catch (e) {
        console.error("Weryfikacja YouTube nie powiodła się.", e);
        const komunikaty = {
            YOUTUBE_NIE_SUBSKRYBUJE: "Nie widzę jeszcze subskrypcji kanału Inercja. Zasubskrybuj kanał i spróbuj ponownie.",
            YOUTUBE_KONTO_NIEZGODNE: "Zaloguj się w YouTube na to samo konto Google, którego używasz do konta ucznia.",
            MISJA_WYKONANA: "Ta misja została już odebrana.",
            GOOGLE_AUTORYZACJA: "Google nie udzielił dostępu do sprawdzenia subskrypcji.",
            YOUTUBE_WERYFIKACJA: "Nie udało się sprawdzić subskrypcji. Spróbuj ponownie za chwilę."
        };
        alert(komunikaty[e.message] || "Nie udało się potwierdzić subskrypcji. Spróbuj ponownie.");
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Sprawdź subskrypcję"; }
    }
}

let tokenYouTubeClient = null;
let oczekujacyTokenYouTube = null;
function uzyskajTokenYouTube() {
    if (!window.google?.accounts?.oauth2) throw new Error("GOOGLE_AUTORYZACJA");
    if (oczekujacyTokenYouTube) return oczekujacyTokenYouTube;
    oczekujacyTokenYouTube = new Promise((resolve, reject) => {
        tokenYouTubeClient = window.google.accounts.oauth2.initTokenClient({
            client_id: "323982678959-9uqkdrmdupgaajf1ejkc4avpt26f0v08.apps.googleusercontent.com",
            scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
            callback: response => {
                oczekujacyTokenYouTube = null;
                if (response?.access_token) resolve(response.access_token);
                else reject(new Error("GOOGLE_AUTORYZACJA"));
            },
            error_callback: () => {
                oczekujacyTokenYouTube = null;
                reject(new Error("GOOGLE_AUTORYZACJA"));
            }
        });
        tokenYouTubeClient.requestAccessToken({ prompt: "consent" });
    });
    return oczekujacyTokenYouTube;
}

async function pokazMisje() {
    const dialog = document.getElementById("okno-misji");
    const lista = document.getElementById("lista-misji");
    if (!dialog || !lista) return;
    const zalogowany = !trybGoscia && auth.currentUser && !auth.currentUser.isAnonymous;
    if (!zalogowany) {
        lista.innerHTML = '<div class="misja-karta"><div class="misja-ikona">🔒</div><div><h3>Misje są dostępne po zalogowaniu</h3><p>Zaloguj się lub utwórz konto. Po zalogowaniu otrzymujesz 5 ⭐ na start, a wykonane misje i nagrody zapisują się na koncie.</p></div></div>';
    } else {
        const wykonane = await pobierzWykonaneMisje();
        lista.innerHTML = MISJE.map(misja => {
            const odebrana = wykonane.has(misja.id);
            const gotowa = misja.typ === "youtube" || misjaSpelnionaLokalnie(misja);
            let akcja = '';
            if (odebrana) akcja = '<span class="misja-wykonana">✓ Nagroda odebrana</span>';
            else if (misja.typ === "youtube") akcja = `<div class="misja-przyciski"><a class="misja-youtube-link" href="https://www.youtube.com/channel/UC2Wi6cHYsLz48s95HHeOptw" target="_blank" rel="noopener noreferrer">▶️ Otwórz YouTube</a><button type="button" data-misja="${misja.id}">Sprawdź subskrypcję</button></div>`;
            else if (gotowa) akcja = `<button type="button" data-misja="${misja.id}">Odbierz +${misja.nagroda} ⭐</button>`;
            else akcja = '<span class="misja-oczekuje">Jeszcze nieukończona</span>';
            return `<article class="misja-karta"><div class="misja-ikona">${misja.ikona}</div><div><h3>${misja.nazwa}</h3><p>${misja.opis}</p><div class="misja-akcja">${akcja}</div></div><div class="misja-nagroda">+${misja.nagroda} ⭐</div></article>`;
        }).join("");
        lista.querySelectorAll("[data-misja]").forEach(btn => btn.addEventListener("click", () => {
            const misja = MISJE.find(x => x.id === btn.dataset.misja);
            if (misja) odbierzNagrodeMisji(misja);
        }));
    }
    dialog.showModal();
}

function pokazInformacjeOGwiazdach() {
    const zalogowany = !trybGoscia && auth.currentUser && !auth.currentUser.isAnonymous;
    document.getElementById("tytul-informacji").textContent = "Gwiazdki i podpowiedzi";
    document.getElementById("tresc-informacji").innerHTML = zalogowany
        ? "<p>⭐ Masz <strong>" + gwiazdkiUcznia + "</strong> gwiazdek. Jedna podpowiedź kosztuje 1 ⭐.</p><p>Podpowiedź prowadzi krok po kroku do właściwego wzoru, pokazuje co ustalić jako pierwsze i przypomina o typowych pułapkach. Nie podaje gotowej odpowiedzi.</p>"
        : "<p>🔒 <strong>Gwiazdki i podpowiedzi są dostępne tylko dla zalogowanych uczniów.</strong></p><p>Zaloguj się albo utwórz konto, aby korzystać z podpowiedzi. Po utworzeniu konta otrzymasz na start 5 ⭐.</p>";
    ustawWidocznoscMenuProfilu(false);
    oknoInformacji.showModal();
}

document.getElementById("przycisk-gwiazdek")?.addEventListener("click", pokazInformacjeOGwiazdach);
document.getElementById("przycisk-misji")?.addEventListener("click", pokazMisje);

document.querySelectorAll(".gwiazdki-ucznia").forEach(element => {
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-label", "Informacje o gwiazdkach");
    element.addEventListener("click", pokazInformacjeOGwiazdach);
    element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); pokazInformacjeOGwiazdach(); }
    });
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
    const przycisk = event.submitter || document.querySelector('#formularz-logowania button[type="submit"]');

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
    const przycisk = event.submitter || document.querySelector('#formularz-rejestracji button[type="submit"]');

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
        szkola: ["mechanika", "termodynamika", "elektromagnetyzm", "fale_drgania", "optyka", "grawitacja_astronomia", "mechanika_kwantowa_jadrowa", "fizyka_materialow", "teoria_wzglednosci"],
        ciekawosc: ["grawitacja_astronomia", "optyka", "fale_drgania", "mechanika", "termodynamika", "elektromagnetyzm", "teoria_wzglednosci", "mechanika_kwantowa_jadrowa", "fizyka_materialow"],
        praca: ["elektromagnetyzm", "mechanika", "termodynamika", "optyka", "fale_drgania", "fizyka_materialow", "grawitacja_astronomia", "teoria_wzglednosci", "mechanika_kwantowa_jadrowa"],
        inne: ["mechanika", "termodynamika", "elektromagnetyzm", "optyka", "fale_drgania", "grawitacja_astronomia", "fizyka_materialow", "mechanika_kwantowa_jadrowa", "teoria_wzglednosci"]
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


const oknoUstawienNauki = document.getElementById("okno-ustawien-nauki");
const przyciskUstawienNauki = document.getElementById("otworz-ustawienia-nauki");
const wyborPoziomuUstawien = document.getElementById("ustawienia-poziomu-fizyki");
const wyborMotywuUstawien = document.getElementById("ustawienia-motywu");
const statusUstawienNauki = document.getElementById("status-ustawien-nauki");

if (przyciskUstawienNauki && oknoUstawienNauki) {
    przyciskUstawienNauki.addEventListener("click", () => {
        wyborPoziomuUstawien.value = profilUcznia?.poziom || "sredni";
        if (wyborMotywuUstawien) wyborMotywuUstawien.value = pobierzZapisanyMotyw();
        statusUstawienNauki.textContent = "";
        ustawWidocznoscMenuProfilu(false);
        oknoUstawienNauki.showModal();
    });

    document.getElementById("zapisz-ustawienia-nauki").addEventListener("click", async () => {
        const poprzedniPoziom = profilUcznia?.poziom;
        const nowyMotyw = wyborMotywuUstawien?.value || pobierzZapisanyMotyw();
        zastosujMotyw(nowyMotyw);
        profilUcznia = {
            ...(profilUcznia || {}),
            poziom: wyborPoziomuUstawien.value
        };
        magazynDanych().setItem(`fizyka-preferencje-${aktywnyUzytkownik}`, JSON.stringify({
            ...profilUcznia,
            zapisano: new Date().toISOString()
        }));
        const zapisano = await Promise.allSettled([zapiszPreferencjeWFirestore(), zapiszPostepKonta()]);
        const sukces = zapisano.some(r => r.status === "fulfilled" && r.value !== false);
        statusUstawienNauki.textContent = poprzedniPoziom === profilUcznia.poziom
            ? `Poziom pozostaje: ${opisPoziomuDlaUcznia(numerPoziomuUcznia())}.`
            : `Gotowe. Od teraz kolejne zadania będą dopasowane do poziomu: ${opisPoziomuDlaUcznia(numerPoziomuUcznia())}.`;
        if (!sukces && !trybGoscia) statusUstawienNauki.textContent += " Zapis lokalny działa, ale synchronizacja z kontem nie powiodła się.";
        setTimeout(() => oknoUstawienNauki.close(), 900);
    });
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
        ruch_orbitalny: "Ruch orbitalny",
        trening_maturalny: "🎯 Trening maturalny"
    };
    document.getElementById("nazwa-podnagalowkow").textContent = dzial.nazwa;
    
    const kontener = document.getElementById("przyciski-podnagalowkow");
    kontener.innerHTML = "";
    
    Object.keys(dzial.podnagalowki).forEach(kluczPodnagalowka => {
        const btn = document.createElement("button");
        btn.className = "przycisk-podnagalek";
        btn.setAttribute("data-podnagalek", kluczPodnagalowka);
        btn.textContent = nazwyPodnagalowkow[kluczPodnagalowka] || kluczPodnagalowka.replace(/_/g, " ").replace(/\b\w/g, litera => litera.toUpperCase());
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
    const nazwaMapy = podnagalek === "ruch_obrotowy"
        ? "Ruch obrotowy"
        : podnagalek.replace(/_/g, " ").replace(/\b\w/g, litera => litera.toUpperCase());
    document.getElementById("nazwa-lekcji").textContent = nazwaMapy;
    
    const kolkaDiv = document.getElementById("kolka-lekcji");
    kolkaDiv.innerHTML = "";
    
    for (let index = 0; index < lekcje.length; index += lekcjiWKole) {
        const pakiet = lekcje.slice(index, index + lekcjiWKole);
        const btn = document.createElement("button");
        const numerLekcji = index / lekcjiWKole;
        const odblokowany = numerLekcji === 0 || pobierzPostep(lekcje.slice(index - 1, index)) === 100;
        btn.className = "kolko-lekcji";
        btn.innerHTML = `<span class="kolko-numer">${index + 1}</span><span class="kolko-podpis">${pakiet[0].temat}</span>`;
        btn.title = odblokowany ? pakiet[0].temat : `Ta lekcja dotyczy: ${pakiet[0].temat}. Ukończ poprzednią lekcję, aby ją odblokować.`;
        btn.setAttribute("aria-label", odblokowany ? `Lekcja ${index + 1}: ${pakiet[0].temat}` : `Zablokowana lekcja ${index + 1}: ${pakiet[0].temat}`);
        btn.style.setProperty("--postep", `${pobierzPostep(pakiet)}%`);
        btn.disabled = !odblokowany;
        btn.classList.toggle("zablokowane", !odblokowany);
        if (!odblokowany) {
            btn.dataset.temat = pakiet[0].temat;
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

// Dodatkowy bank zadań obliczeniowych. Są dołączane do istniejących tematów,
// dzięki czemu quizy nie składają się wyłącznie z pytań definicyjnych.
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

function dodajZadaniaObliczenioweDoBazy() {
    for (const zadanie of DODATKOWE_ZADANIA_OBLICZENIOWE) {
        for (const dzial of Object.values(baza)) {
            for (const lekcje of Object.values(dzial.podnagalowki || {})) {
                const lekcja = lekcje.find(item => item.temat === zadanie.temat);
                if (lekcja) {
                    if (!lekcja.quiz.some(q => q.pytanie === zadanie.pytanie)) {
                        lekcja.quiz.push({...zadanie, obliczeniowe: true});
                    }
                    break;
                }
            }
        }
    }
}
dodajZadaniaObliczenioweDoBazy();


// -----------------------------------------------------------------------------
// DUŻY BANK PYTAŃ: każdy temat dostaje osobne, samodzielne pytania.
// Nie korzystamy z pytań z innych lekcji tylko po to, aby dobić do limitu.
// Generator tworzy 12 pytań na każdy poziom (36/lekcję), z innymi danymi,
// scenariuszami i poleceniami. Pytania z niepełnym kontekstem są odrzucane.
// -----------------------------------------------------------------------------
const MIN_PYTAN_NA_POZIOM = 12;
const MIN_PYTAN_MATURALNYCH = 12;

function pytanieSamodzielne(q) {
    const t = String(q?.pytanie || '').trim();
    if (!t || t.length < 25) return false;
    if (/^.*\.{3}$/.test(t)) return false;
    if (/\b(poprzednim|poprzedniego|powyżej|poniżej|jak wyżej|jak wcześniej|w poprzednim pytaniu|w następnym pytaniu)\b/i.test(t)) return false;
    if (!Array.isArray(q.odpowiedzi) || q.odpowiedzi.length < 3 || q.prawidlowa == null) return false;
    return q.odpowiedzi.every(a => String(a ?? '').trim().length > 0);
}

function mkQ(pytanie, odpowiedzi, prawidlowa, poziom, wzor, wskazowka, rozwiazanie, obliczeniowe=true) {
    return { pytanie, odpowiedzi, prawidlowa, poziom, wzor, wskazowka, rozwiazanie, obliczeniowe };
}

function nformat(n) { return String(n).replace('.', ','); }
function uniqPush(arr, q) {
    if (!pytanieSamodzielne(q)) return;
    const key = q.pytanie.trim().toLocaleLowerCase('pl');
    if (!arr.some(x => x.pytanie.trim().toLocaleLowerCase('pl') === key)) arr.push(q);
}

const FABRYKI_PYTAN = [
    {r:/podstawy opisu ruchu/i, l1:(i)=>mkQ(`Które zdanie poprawnie opisuje położenie ciała w chwili ${i+2} s?`,['Trzeba podać układ odniesienia i współrzędną położenia','Wystarczy podać masę ciała','Położenie nie zależy od układu odniesienia'],0,1,'x = x(t)','Najpierw ustal układ odniesienia; dopiero potem opisuj położenie.', 'Położenie jest wielkością zależną od przyjętego układu odniesienia, dlatego potrzebujemy układu oraz współrzędnych.',false), l2:(i)=>mkQ(`Punkt materialny zmienił współrzędną z ${i+1} m na ${i+7} m. Jaka jest wartość jego przemieszczenia?`,[`${6} m`,`${i+7+i+1} m`,`${i+1} m`],0,2,'Δx = x₂ − x₁','Odejmij położenie początkowe od końcowego.',`Δx = ${i+7} − ${i+1} = 6 m.`,true), l3:(i)=>mkQ(`Ciało przemieściło się z x₁ = ${-4-i} m do x₂ = ${9+i} m, a następnie wróciło do x₃ = ${2+i} m. Oblicz całkowitą drogę i wartość przemieszczenia.`,[`${18+2*i} m i ${6+i} m`,`${13+2*i} m i ${6+i} m`,`${6+i} m i ${18+2*i} m`],0,3,'s = |x₂−x₁| + |x₃−x₂|; Δx = x₃−x₁','Policz osobno oba odcinki drogi, a na końcu przemieszczenie od startu do końca.',`Droga = ${13+2*i} + ${7+i} = ${20+3*i} m; przemieszczenie = ${6+i} m.`,true)},
    {r:/prędkość i czas ruchu/i, l1:(i)=>mkQ(`Rowerzysta przejechał ${12+i*2} km w ${1+i/2} h. Która wartość jest jego średnią prędkością?`,[`${nformat((12+i*2)/(1+i/2))} km/h`,`${nformat((12+i*2)*(1+i/2))} km/h`,`${nformat((1+i/2)/(12+i*2))} km/h`],0,1,'v = s/t','Podziel drogę przez czas, pilnując zgodnych jednostek.',`v = ${12+i*2} / ${1+i/2} = ${nformat((12+i*2)/(1+i/2))} km/h.`,true), l2:(i)=>mkQ(`Pociąg jedzie ze stałą prędkością ${15+i} m/s przez ${8+i} s. Jaką drogę pokona?`,[`${(15+i)*(8+i)} m`,`${23+2*i} m`,`${(15+i)/(8+i)} m`],0,2,'s = vt','Przy stałej prędkości pomnóż prędkość przez czas.',`s = ${(15+i)} · ${(8+i)} = ${(15+i)*(8+i)} m.`,true), l3:(i)=>mkQ(`Samochód pokonuje ${180+i*20} m w ${9+i} s, a następnie ${120+i*10} m w ${6+i} s. Oblicz średnią prędkość na całej trasie.`,[`${nformat((180+i*20+120+i*10)/(15+2*i))} m/s`,`${nformat(((180+i*20)/(9+i)+(120+i*10)/(6+i))/2)} m/s`,`${nformat((180+i*20+120+i*10)/(9+i))} m/s`],0,3,'vśr = s_cał/t_cał','Nie uśredniaj dwóch prędkości. Dodaj wszystkie drogi i wszystkie czasy.',`vśr = s_cał/t_cał = ${180+i*20+120+i*10} / ${15+2*i} m/s.`,true)},
    {r:/ruch jednostajny prostoliniowy/i, l1:(i)=>mkQ(`Samochód porusza się ruchem jednostajnym z prędkością ${10+i} m/s. Ile metrów pokona w ${5+i} s?`,[`${(10+i)*(5+i)} m`,`${15+2*i} m`,`${(10+i)/(5+i)} m`],0,1,'s = vt','W ruchu jednostajnym droga rośnie proporcjonalnie do czasu.',`s = ${(10+i)} · ${(5+i)} = ${(10+i)*(5+i)} m.`,true), l2:(i)=>mkQ(`Ruch jednostajny opisuje zależność x(t) = ${3+i} m + ${4+i} m/s · t. Jakie jest położenie po ${5+i} s?`,[`${3+i+(4+i)*(5+i)} m`,`${(4+i)*(5+i)} m`,`${3+i} m`],0,2,'x = x₀ + vt','Podstaw czas do równania położenia.',`x = ${3+i} + ${4+i}·${5+i} = ${3+i+(4+i)*(5+i)} m.`,true), l3:(i)=>mkQ(`Dwa pojazdy startują z tego samego miejsca. Pierwszy jedzie ${12+i} m/s, drugi ${9+i} m/s w tym samym kierunku. Po ilu sekundach pierwszy będzie ${15+i*3} m przed drugim?`,[`${(15+i*3)/3} s`,`${3*(15+i*3)} s`,`${15+i*3} s`],0,3,'Δs = (v₁−v₂)t','Najpierw znajdź prędkość względną obu pojazdów.',`v_wzgl = ${12+i}−${9+i}=3 m/s, więc t = ${(15+i*3)}/3 s.`,true)},
    {r:/przyspieszenie i opóźnienie/i, l1:(i)=>mkQ(`Prędkość ciała wzrosła z ${5+i} m/s do ${11+i} m/s w czasie ${3+i} s. Jakie było przyspieszenie?`,[`${nformat(6/(3+i))} m/s²`,`${nformat((16+i)/(3+i))} m/s²`,`${nformat((3+i)/6)} m/s²`],0,1,'a = Δv/t','Najpierw oblicz zmianę prędkości.',`a = (${11+i}−${5+i})/${3+i} = ${nformat(6/(3+i))} m/s².`,true), l2:(i)=>mkQ(`Samochód zmniejsza prędkość z ${20+i} m/s do ${8+i} m/s w ${4+i} s. Jakie jest jego przyspieszenie?`,[`${nformat(-12/(4+i))} m/s²`,`${nformat(12/(4+i))} m/s²`,`${nformat((28+i)/(4+i))} m/s²`],0,2,'a = (v₂−v₁)/t','Przy hamowaniu zmiana prędkości jest ujemna.',`a = (${8+i}−${20+i})/${4+i} = ${nformat(-12/(4+i))} m/s².`,true), l3:(i)=>mkQ(`Ciało hamuje jednostajnie z ${24+i} m/s do zera w czasie ${6+i} s. Jaką drogę pokona podczas hamowania?`,[`${nformat((24+i)*(6+i)/2)} m`,`${nformat((24+i)*(6+i))} m`,`${nformat((6+i)/2)} m`],0,3,'s = (v₀+v)t/2','Przy ruchu jednostajnie opóźnionym prędkość średnia jest średnią prędkości początkowej i końcowej.',`s = (${24+i}+0)·${6+i}/2 m.`,true)},
    {r:/ruch jednostajnie przyspieszony i opóźniony/i, l1:(i)=>mkQ(`Ciało startuje z prędkością ${3+i} m/s i ma przyspieszenie ${2+i} m/s². Jaką prędkość ma po ${4+i} s?`,[`${3+i+(2+i)*(4+i)} m/s`,`${(2+i)*(4+i)} m/s`,`${3+i} m/s`],0,1,'v = v₀ + at','Dodaj do prędkości początkowej przyrost at.',`v = ${3+i}+${2+i}·${4+i} = ${3+i+(2+i)*(4+i)} m/s.`,true), l2:(i)=>mkQ(`Ciało porusza się z v₀ = ${2+i} m/s i a = ${1+i} m/s² przez ${5+i} s. Ile wynosi droga?`,[`${nformat((2+i)*(5+i)+0.5*(1+i)*(5+i)**2)} m`,`${nformat((2+i)*(5+i))} m`,`${nformat(0.5*(1+i)*(5+i)**2)} m`],0,2,'s = v₀t + ½at²','Uwzględnij zarówno drogę wynikającą z v₀, jak i z przyspieszenia.',`s = v₀t + ½at² = ${nformat((2+i)*(5+i)+0.5*(1+i)*(5+i)**2)} m.`,true), l3:(i)=>mkQ(`Pojazd rusza z miejsca z przyspieszeniem ${2+i} m/s². Jaką drogę pokona, zanim osiągnie ${20+i*2} m/s?`,[`${nformat((20+i*2)**2/(2*(2+i)))} m`,`${nformat((20+i*2)/(2+i))} m`,`${nformat((20+i*2)**2/(2+i))} m`],0,3,'v² = v₀² + 2as','W tym zadaniu nie musisz wyznaczać czasu. Połącz prędkość z drogą przez wzór bez czasu.',`s = v²/(2a) = ${(20+i*2)**2}/(2·${2+i}) m.`,true)},
    {r:/wykresy ruchu/i, l1:(i)=>mkQ(`Na wykresie v(t) prędkość jest stała i wynosi ${6+i} m/s przez ${5+i} s. Co oznacza pole pod wykresem?`,['Drogę przebytą przez ciało','Przyspieszenie','Masę ciała'],0,1,'s = pole pod wykresem v(t)','Pole pod wykresem prędkości w funkcji czasu ma jednostkę metra.',`Pole prostokąta wynosi v·t, czyli jest równe drodze.`,false), l2:(i)=>mkQ(`Na wykresie v(t) ciało ma stałą prędkość ${8+i} m/s przez ${4+i} s. Jaka jest droga?`,[`${(8+i)*(4+i)} m`,`${8+i+(4+i)} m`,`${nformat((8+i)/(4+i))} m`],0,2,'s = pole pod v(t)','Policz pole prostokąta pod wykresem.',`s = ${(8+i)}·${(4+i)} = ${(8+i)*(4+i)} m.`,true), l3:(i)=>mkQ(`Prędkość rośnie liniowo od ${4+i} m/s do ${16+i} m/s w ${5+i} s. Oblicz drogę jako pole pod wykresem v(t).`,[`${nformat(((4+i)+(16+i))*(5+i)/2)} m`,`${nformat((16+i-4)* (5+i))} m`,`${nformat(((4+i)+(16+i))*(5+i))} m`],0,3,'s = (v₀+v)t/2','Dla liniowego wzrostu prędkości wykres jest trapezem.',`s = [(${4+i}+${16+i})·${5+i}]/2 m.`,true)},
    {r:/spadek swobodny i rzuty pionowe/i, l1:(i)=>mkQ(`Ciało spada z wysokości bez prędkości początkowej przez ${2+i} s. Przyjmij g = 10 m/s². Jaką prędkość osiągnie?`,[`${20+10*i} m/s`,`${10+i} m/s`,`${5+5*i} m/s`],0,1,'v = gt','W spadku swobodnym z v₀ = 0 prędkość rośnie jak gt.',`v = 10·${2+i} = ${20+10*i} m/s.`,true), l2:(i)=>mkQ(`Ciało spada swobodnie przez ${2+i} s. Przyjmij g = 10 m/s². Jaką drogę pokona?`,[`${5*(2+i)**2} m`,`${10*(2+i)**2} m`,`${2+i} m`],0,2,'h = ½gt²','Wzór zawiera czas w drugiej potędze.',`h = ½·10·(${2+i})² = ${5*(2+i)**2} m.`,true), l3:(i)=>mkQ(`Z wysokości ${45+i*5} m ciało spada bez prędkości początkowej. Przyjmij g = 10 m/s². Oblicz czas spadania.`,[`${nformat(Math.sqrt((45+i*5)/5))} s`,`${nformat((45+i*5)/10)} s`,`${nformat(Math.sqrt((45+i*5)/10))} s`],0,3,'h = ½gt²','Przekształć wzór na czas: t = √(2h/g).',`t = √(2·${45+i*5}/10) s.`,true)},
    {r:/ruch względny/i, l1:(i)=>mkQ(`Dwa rowery jadą w tym samym kierunku z prędkościami ${12+i} m/s i ${8+i} m/s. Jaka jest ich prędkość względna?`,[`${4} m/s`,`${20+2*i} m/s`,`${nformat((12+i)/(8+i))} m/s`],0,1,'v_wzgl = |v₁−v₂|','Przy ruchu w tym samym kierunku odejmij wartości prędkości.',`v_wzgl = |${12+i}−${8+i}| = 4 m/s.`,true), l2:(i)=>mkQ(`Pociąg A jedzie ${18+i} m/s, a pociąg B ${10+i} m/s naprzeciwko. Jaka jest prędkość względna?`,[`${28+2*i} m/s`,`${8} m/s`,`${nformat((18+i)/(10+i))} m/s`],0,2,'v_wzgl = v₁ + v₂','Dla ruchu w przeciwnych kierunkach prędkości względne dodają się.',`v_wzgl = ${18+i}+${10+i} = ${28+2*i} m/s.`,true), l3:(i)=>mkQ(`Łódź płynie z prędkością ${6+i} m/s względem wody, a nurt ma ${2+i/2} m/s w bok. Oblicz wartość prędkości względem brzegu, zakładając prostopadłe kierunki.`,[`${nformat(Math.sqrt((6+i)**2+(2+i/2)**2))} m/s`,`${nformat(6+i+2+i/2)} m/s`,`${nformat(Math.abs(6+i-(2+i/2)))} m/s`],0,3,'v = √(v₁²+v₂²)','Przy prostopadłych wektorach prędkości użyj twierdzenia Pitagorasa.',`v = √[(${6+i})² + (${2+i/2})²] m/s.`,true)},
    {r:/ruch po okręgu/i, l1:(i)=>mkQ(`Koło wykonuje ${4+i} obroty w ${8+i} s. Jaka jest częstotliwość obrotów?`,[`${nformat((4+i)/(8+i))} Hz`,`${nformat((8+i)/(4+i))} Hz`,`${4+i} Hz`],0,1,'f = n/t','Częstotliwość to liczba pełnych obrotów przypadających na sekundę.',`f = ${4+i}/${8+i} Hz.`,true), l2:(i)=>mkQ(`Ciało porusza się po okręgu o promieniu ${2+i} m z prędkością ${4+i} m/s. Oblicz przyspieszenie dośrodkowe.`,[`${nformat((4+i)**2/(2+i))} m/s²`,`${nformat((4+i)/(2+i))} m/s²`,`${nformat((2+i)/(4+i))} m/s²`],0,2,'a_d = v²/r','Prędkość podnieś do kwadratu i podziel przez promień.',`a_d = (${4+i})²/${2+i} m/s².`,true), l3:(i)=>mkQ(`Satelita porusza się po orbicie kołowej o promieniu ${7+i}·10^6 m z prędkością ${7+i/2}·10^3 m/s. Oblicz okres obiegu. Przyjmij π = 3,14.`,[`około ${nformat(2*3.14*(7+i)*1e6/((7+i/2)*1e3))} s`,`około ${nformat((7+i)*1e6/((7+i/2)*1e3))} s`,`około ${nformat(3.14*(7+i)*1e6/((7+i/2)*1e3))} s`],0,3,'T = 2πr/v','Okres to czas jednego pełnego obiegu, czyli długość okręgu podzielona przez prędkość.',`T = 2πr/v.`,true)},
    {r:/prawo powszechnego ciążenia/i, l1:(i)=>mkQ(`Jak zmieni się siła grawitacji między dwoma ciałami, jeśli odległość zwiększymy ${2+i} razy?`,[`zmniejszy się ${(2+i)**2} razy`,`zmniejszy się ${2+i} razy`,`zwiększy się ${(2+i)**2} razy`],0,1,'F = GMm/r²','Odległość występuje w mianowniku w drugiej potędze.',`F jest odwrotnie proporcjonalna do r², więc wzrost odległości ${2+i}-krotny zmniejsza siłę ${(2+i)**2}-krotnie.`,false), l2:(i)=>mkQ(`Dwie masy ${5+i} kg i ${8+i} kg są oddalone o ${2+i} m. Która zależność pozwala obliczyć siłę ich wzajemnego przyciągania?`,['F = Gm₁m₂/r²','F = Gm₁m₂r²','F = r²/(Gm₁m₂)'],0,2,'F = Gm₁m₂/r²','Zwróć uwagę, że siła maleje wraz z kwadratem odległości.', 'Prawo powszechnego ciążenia ma postać F = Gm₁m₂/r².',true), l3:(i)=>mkQ(`Dwa ciała mają masy ${4+i} kg i ${9+i} kg. Jeśli odległość między nimi zmaleje z ${6+i} m do połowy, ile razy wzrośnie siła grawitacji?`,['4 razy','2 razy','8 razy'],0,3,'F ∝ 1/r²','Porównaj kwadrat odwrotności obu odległości.',`Zmniejszenie r do połowy daje F₂/F₁ = (r₁/r₂)² = 2² = 4.`,true)},
    {r:/energia w polu grawitacyjnym/i, l1:(i)=>mkQ(`Jak zmienia się energia potencjalna grawitacyjna ciała przy podnoszeniu go wyżej nad powierzchnię Ziemi?`,['Rośnie','Maleje zawsze do zera','Nie zależy od wysokości'],0,1,'ΔE_p = mgΔh','Podniesienie ciała zwiększa jego energię potencjalną w przybliżeniu przy powierzchni Ziemi.','Przy wzroście wysokości Δh energia potencjalna rośnie o mgΔh.',false), l2:(i)=>mkQ(`Ciało o masie ${3+i} kg podniesiono o ${4+i} m. Przyjmij g = 10 m/s². O ile wzrosła energia potencjalna?`,[`${(3+i)*(4+i)*10} J`,`${(3+i)+(4+i)*10} J`,`${nformat((3+i)*(4+i)/10)} J`],0,2,'ΔE_p = mgΔh','Pomnóż masę, g i przyrost wysokości.',`ΔE_p = ${(3+i)}·10·${4+i} = ${(3+i)*(4+i)*10} J.`,true), l3:(i)=>mkQ(`W pobliżu powierzchni Ziemi ciało o masie ${5+i} kg traci wysokość ${12+i} m. Jak zmienia się jego energia potencjalna?`,[`${-(5+i)*10*(12+i)} J`,`${(5+i)*10*(12+i)} J`,`0 J`],0,3,'ΔE_p = mg(h₂−h₁)','Spadek wysokości oznacza ujemną zmianę energii potencjalnej.',`ΔE_p = -mgΔh = -${5+i}·10·${12+i} J.`,true)},
    {r:/prędkość ucieczki/i, l1:(i)=>mkQ(`Od czego zależy prędkość ucieczki z powierzchni ciała niebieskiego?`,['Od masy i promienia tego ciała','Tylko od masy statku','Tylko od czasu lotu'],0,1,'vₑ = √(2GM/R)','Wzór zawiera masę i promień ciała niebieskiego.', 'Prędkość ucieczki wynika z vₑ = √(2GM/R).',false), l2:(i)=>mkQ(`Jeśli promień planety pozostaje stały, a jej masa wzrośnie czterokrotnie, jak zmieni się prędkość ucieczki?`,['Wzrośnie dwukrotnie','Wzrośnie czterokrotnie','Nie zmieni się'],0,2,'vₑ ∝ √M','Masa występuje pod pierwiastkiem.',`√4 = 2, więc prędkość ucieczki wzrośnie 2 razy.`,true), l3:(i)=>mkQ(`Planeta ma dwukrotnie większą masę i dwukrotnie większy promień niż Ziemia. Jak zmieni się jej prędkość ucieczki względem ziemskiej?`,['Pozostanie taka sama','Wzrośnie √2 razy','Wzrośnie 2 razy'],0,3,'vₑ = √(2GM/R)','Porównaj iloraz M/R dla obu planet.',`vₑ' / vₑ = √[(2M/2R)/(M/R)] = 1.`,true)},
    {r:/ciśnienie hydrostatyczne/i, l1:(i)=>mkQ(`Jak zmieni się ciśnienie hydrostatyczne, gdy głębokość w tej samej cieczy zwiększymy ${2+i} razy?`,[`Zwiększy się ${2+i} razy`,`Zwiększy się ${(2+i)**2} razy`,`Nie zmieni się`],0,1,'p = ρgh','Przy tej samej cieczy p jest proporcjonalne do głębokości.',`p ∝ h, więc wzrost h ${2+i}-krotny daje taki sam wzrost ciśnienia.`,false), l2:(i)=>mkQ(`Woda ma gęstość 1000 kg/m³. Oblicz ciśnienie hydrostatyczne na głębokości ${2+i} m, przyjmując g = 10 m/s².`,[`${10000*(2+i)} Pa`,`${1000*(2+i)} Pa`,`${10*(2+i)} Pa`],0,2,'p = ρgh','Podstaw gęstość, g i głębokość do wzoru.',`p = 1000·10·${2+i} = ${10000*(2+i)} Pa.`,true), l3:(i)=>mkQ(`W cieczy o gęstości ${800+i*50} kg/m³ różnica głębokości między punktami wynosi ${5+i} m. Przyjmij g = 10 m/s². Oblicz różnicę ciśnień.`,[`${(800+i*50)*10*(5+i)} Pa`,`${(800+i*50)*(5+i)} Pa`,`${10*(5+i)} Pa`],0,3,'Δp = ρgΔh','Liczy się różnica głębokości, nie bezwzględna głębokość każdego punktu.',`Δp = ρgΔh = ${(800+i*50)}·10·${5+i} Pa.`,true)},
    {r:/prawo archimedesa/i, l1:(i)=>mkQ(`Od czego zależy wartość siły wyporu działającej na całkowicie zanurzone ciało?`,['Od gęstości cieczy i objętości wypartej cieczy','Tylko od masy ciała','Tylko od głębokości zanurzenia'],0,1,'F_w = ρ_c g V_wyp','Prawo Archimedesa odnosi wypór do wypartej cieczy.', 'F_w = ρ_c g V_wyp.',false), l2:(i)=>mkQ(`Ciało wypiera ${0.002+i*0.001} m³ wody. Przyjmij ρ = 1000 kg/m³ i g = 10 m/s². Jaki jest wypór?`,[`${1000*10*(0.002+i*0.001)} N`,`${1000*(0.002+i*0.001)} N`,`${10*(0.002+i*0.001)} N`],0,2,'F_w = ρgV','Pomnóż gęstość cieczy, g i objętość wypartej cieczy.',`F_w = 1000·10·${0.002+i*0.001} N.`,true), l3:(i)=>mkQ(`Ciało o objętości ${0.004+i*0.001} m³ pływa tak, że zanurzona jest ${50+i*5}% jego objętości. Przyjmij ρ_wody = 1000 kg/m³. Jaka jest masa ciała?`,[`${1000*(0.004+i*0.001)*(0.5+i*0.05)} kg`,`${1000*(0.004+i*0.001)} kg`,`${1000*(0.004+i*0.001)/(0.5+i*0.05)} kg`],0,3,'mg = ρ_wody g V_zan','W stanie pływania wypór równoważy ciężar.',`m = ρ V_zan = 1000·V·ułamek zanurzenia.`,true)},
    {r:/równanie bernoulliego/i, l1:(i)=>mkQ(`W poziomej rurze idealna ciecz płynie szybciej w zwężeniu. Co dzieje się z ciśnieniem statycznym?`,['Maleje','Rośnie zawsze','Nie zależy od prędkości'],0,1,'p + ½ρv² = const','W poziomej rurze wzrost składnika ruchu musi być zrównoważony spadkiem ciśnienia.', 'Przy stałej wysokości wzrost v zwiększa ½ρv², więc p maleje.',false), l2:(i)=>mkQ(`Prędkość cieczy wzrosła z ${2+i} m/s do ${4+i} m/s. Jak zmienił się składnik ½ρv² przy stałej gęstości?`,['Wzrósł, bo zależy od v²','Wzrósł dokładnie ${nformat((4+i)/(2+i))} razy','Nie zmienił się'],0,2,'q = ½ρv²','Prędkość występuje w drugiej potędze.',`Składnik dynamiczny rośnie proporcjonalnie do kwadratu prędkości.`,true), l3:(i)=>mkQ(`W poziomej rurze ciśnienie spada o ${200+i*50} Pa, a gęstość cieczy wynosi ${1000+i*50} kg/m³. Jeśli prędkość w drugim punkcie jest większa o niewielką wartość, jaki warunek łączy zmianę ciśnienia i zmianę energii kinetycznej na jednostkę objętości?`,['Δp + ½ρΔ(v²) = 0','Δp = ρg','Δp = ½ρv'],0,3,'p + ½ρv² = const','Zastosuj Bernoulliego dla tej samej wysokości.', 'W poziomej rurze suma p + ½ρv² pozostaje stała.',true)},
    {r:/ciepło właściwe|energia cieplna/i, l1:(i)=>mkQ(`Która wielkość określa, ile energii trzeba dostarczyć, aby ogrzać ciało o danej masie o 1 K?`,['Ciepło właściwe','Moc','Ciśnienie'],0,1,'Q = mcΔT','Ciepło właściwe mówi o energii potrzebnej do ogrzania jednostki masy o 1 K.', 'Jego jednostką jest J/(kg·K).',false), l2:(i)=>mkQ(`Ciało o masie ${2+i} kg i cieple właściwym ${500+i*50} J/(kg·K) ogrzano o ${10+i} K. Ile energii pobrało?`,[`${(2+i)*(500+i*50)*(10+i)} J`,`${(2+i)+(500+i*50)+(10+i)} J`,`${nformat((2+i)*(10+i)/(500+i*50))} J`],0,2,'Q = mcΔT','Pomnóż masę, ciepło właściwe i zmianę temperatury.',`Q = ${(2+i)}·${500+i*50}·${10+i} J.`,true), l3:(i)=>mkQ(`Dwa materiały o tej samej masie otrzymują taką samą energię. Ich ciepła właściwe są w stosunku ${2+i}:1. Jak porównasz ich przyrosty temperatury?`,['Materiał o większym c ma mniejszy przyrost temperatury w tym samym stosunku','Oba ogrzeją się tak samo','Materiał o większym c ogrzeje się bardziej'],0,3,'ΔT = Q/(mc)','Przy stałych Q i m przyrost temperatury jest odwrotnie proporcjonalny do c.', 'Większe c oznacza mniejszy przyrost temperatury.',true)},
    {r:/przemiany gazowe|równanie gazu doskonałego/i, l1:(i)=>mkQ(`W przemianie izotermicznej gazu doskonałego która wielkość pozostaje stała?`,['Temperatura','Ciśnienie','Objętość'],0,1,'pV = const (T = const)','Nazwy przemian wskazują wielkość utrzymywaną na stałym poziomie.', 'Izotermiczna oznacza T = const.',false), l2:(i)=>mkQ(`Gaz ma temperaturę stałą. Jeśli jego objętość zmaleje ${2+i} razy, jak zmieni się ciśnienie?`,[`Wzrośnie ${2+i} razy`,`Zmaleje ${2+i} razy`,`Nie zmieni się`],0,2,'p₁V₁ = p₂V₂','W izotermie iloczyn pV jest stały.',`Zmniejszenie V ${2+i}-krotne wymusza wzrost p ${2+i}-krotny.`,true), l3:(i)=>mkQ(`Gaz doskonały ma p₁ = ${100+i*20} kPa i V₁ = ${2+i} L. W przemianie izotermicznej zwiększono objętość do ${4+i} L. Oblicz p₂.`,[`${nformat((100+i*20)*(2+i)/(4+i))} kPa`,`${nformat((100+i*20)*(4+i)/(2+i))} kPa`,`${100+i*20} kPa`],0,3,'p₁V₁ = p₂V₂','Przy stałej temperaturze iloczyn pV się nie zmienia.',`p₂ = p₁V₁/V₂.`,true)},
    {r:/ładunek elektryczny/i, l1:(i)=>mkQ(`Dwa ładunki mają wartości +${2+i} μC i −${2+i} μC. Jakie mają znaki?`,['Przeciwne','Takie same dodatnie','Takie same ujemne'],0,1,'q = ±|q|','Zwróć uwagę na znak zapisany przy każdym ładunku.', 'Jeden ładunek jest dodatni, drugi ujemny, więc znaki są przeciwne.',false), l2:(i)=>mkQ(`Przez przewodnik przepłynął ładunek ${4+i} C w czasie ${2+i} s. Oblicz natężenie prądu.`,[`${nformat((4+i)/(2+i))} A`,`${(4+i)*(2+i)} A`,`${nformat((2+i)/(4+i))} A`],0,2,'I = Q/t','Podziel przepływający ładunek przez czas.',`I = ${(4+i)}/${2+i} A.`,true), l3:(i)=>mkQ(`Ładunek punktowy zwiększono dwukrotnie, a odległość od niego zwiększono trzykrotnie. Jak zmieni się wartość pola elektrycznego?`,['Zmniejszy się 4,5 razy','Zmniejszy się 3 razy','Wzrośnie 2 razy'],0,3,'E = k|q|/r²','Uwzględnij jednocześnie zmianę ładunku i kwadrat odległości.',`E₂/E₁ = 2/3² = 2/9, więc pole jest 4,5 razy mniejsze.`,true)},
    {r:/prawo coulomba/i, l1:(i)=>mkQ(`Jak zmieni się siła Coulomba, jeśli odległość między ładunkami zwiększymy 2 razy?`,['Zmniejszy się 4 razy','Zmniejszy się 2 razy','Zwiększy się 4 razy'],0,1,'F = k|q₁q₂|/r²','Odległość jest w mianowniku i jest podnoszona do kwadratu.', 'Dwukrotny wzrost r daje czterokrotny spadek siły.',false), l2:(i)=>mkQ(`Dwa ładunki mają wartości ${2+i} μC i ${3+i} μC. Jakie czynniki trzeba znać, aby obliczyć ich siłę oddziaływania?`,['Wartości obu ładunków i odległość','Tylko sumę ładunków','Tylko masy ładunków'],0,2,'F = k|q₁q₂|/r²','Wzór zawiera oba ładunki oraz odległość między nimi.', 'Do obliczenia siły potrzebne są q₁, q₂ i r.',false), l3:(i)=>mkQ(`Dwa ładunki zwiększono odpowiednio ${2+i} razy i ${3+i} razy, a odległość pozostawiono bez zmian. Ile razy wzrośnie siła?`,[`${(2+i)*(3+i)} razy`,`${2+i+(3+i)} razy`,`${nformat((2+i)/(3+i))} razy`],0,3,'F ∝ q₁q₂','Przy stałym r siła jest proporcjonalna do iloczynu ładunków.',`Współczynnik wzrostu to (${2+i})·(${3+i}).`,true)},
    {r:/prawo ohma|napięcie i opór/i, l1:(i)=>mkQ(`Jeżeli napięcie na oporniku pozostaje stałe, a opór zwiększymy 2 razy, co stanie się z natężeniem?`,['Zmniejszy się 2 razy','Zwiększy się 2 razy','Nie zmieni się'],0,1,'I = U/R','Przy stałym U natężenie jest odwrotnie proporcjonalne do R.', 'Dwukrotny wzrost R daje dwukrotny spadek I.',false), l2:(i)=>mkQ(`Na oporniku jest napięcie ${12+i*2} V i opór ${3+i} Ω. Oblicz prąd.`,[`${nformat((12+i*2)/(3+i))} A`,`${(12+i*2)*(3+i)} A`,`${nformat((3+i)/(12+i*2))} A`],0,2,'I = U/R','Podziel napięcie przez opór.',`I = U/R = ${(12+i*2)}/${3+i} A.`,true), l3:(i)=>mkQ(`Dwa oporniki ${4+i} Ω i ${6+i} Ω są połączone szeregowo do źródła ${20+i*2} V. Oblicz natężenie prądu w obwodzie.`,[`${nformat((20+i*2)/(10+2*i))} A`,`${nformat((20+i*2)/(2+i))} A`,`${nformat((10+2*i)/(20+i*2))} A`],0,3,'R_z = R₁ + R₂; I = U/R_z','W połączeniu szeregowym opory dodają się.',`R_z = ${4+i}+${6+i} = ${10+2*i} Ω.`,true)},
    {r:/moc i energia prądu|moc prądu/i, l1:(i)=>mkQ(`Co opisuje moc urządzenia elektrycznego?`,['Tempo przetwarzania energii','Całkowity ładunek urządzenia','Opór właściwy materiału'],0,1,'P = W/t','Moc mówi, jak szybko przekazywana lub przetwarzana jest energia.', 'Moc to energia lub praca przypadająca na jednostkę czasu.',false), l2:(i)=>mkQ(`Urządzenie pracuje przy ${12+i} V i pobiera ${2+i} A. Jaka jest jego moc?`,[`${(12+i)*(2+i)} W`,`${nformat((12+i)/(2+i))} W`,`${12+i+2+i} W`],0,2,'P = UI','Pomnóż napięcie i natężenie.',`P = ${(12+i)}·${2+i} W.`,true), l3:(i)=>mkQ(`Grzałka o mocy ${1000+i*100} W pracuje przez ${6+i} min. Ile energii zużyje?`,[`${nformat((1000+i*100)*(6+i)*60)} J`,`${nformat((1000+i*100)*(6+i))} J`,`${nformat((1000+i*100)/(6+i))} J`],0,3,'E = Pt','Czas zamień na sekundy, ponieważ moc jest w watach.',`E = P·t = ${(1000+i*100)}·${(6+i)}·60 J.`,true)},
    {r:/łączenie oporników/i, l1:(i)=>mkQ(`Dwa oporniki połączone szeregowo mają opory ${2+i} Ω i ${3+i} Ω. Jaki jest opór zastępczy?`,[`${5+2*i} Ω`,`${nformat((2+i)*(3+i)/(5+2*i))} Ω`,`${1} Ω`],0,1,'R_z = R₁ + R₂','W szeregu opory sumują się.',`R_z = ${2+i}+${3+i} Ω.`,true), l2:(i)=>mkQ(`Dwa jednakowe oporniki ${4+i} Ω są połączone równolegle. Jaki jest opór zastępczy?`,[`${nformat((4+i)/2)} Ω`,`${2*(4+i)} Ω`,`${4+i} Ω`],0,2,'1/R_z = 1/R₁ + 1/R₂','Dla dwóch jednakowych oporników równoległych opór zastępczy jest połową pojedynczego.',`R_z = R/2 = ${(4+i)/2} Ω.`,true), l3:(i)=>mkQ(`Oporniki ${3+i} Ω i ${6+i} Ω są połączone równolegle. Jaki jest opór zastępczy?`,[`${nformat((3+i)*(6+i)/(9+2*i))} Ω`,`${9+2*i} Ω`,`${nformat((3+i)+(6+i))} Ω`],0,3,'R_z = R₁R₂/(R₁+R₂)','Dla dwóch oporników równoległych zastosuj iloczyn przez sumę.',`R_z = R₁R₂/(R₁+R₂).`,true)},
    {r:/prawo kirchhoffa/i, l1:(i)=>mkQ(`Co wynika z I prawa Kirchhoffa dla węzła obwodu?`,['Suma prądów wpływających równa się sumie prądów wypływających','Napięcia zawsze są równe zeru','Każdy prąd musi mieć tę samą wartość w całym obwodzie'],0,1,'ΣIwpł = ΣIwypł','Zastosuj zasadę zachowania ładunku w węźle.', 'W węźle nie gromadzi się ładunek w stanie ustalonym.',false), l2:(i)=>mkQ(`Do węzła wpływają prądy ${2+i} A i ${3+i} A. Jeden prąd wypływający ma ${1+i} A. Ile wynosi drugi prąd wypływający?`,[`${4} A`,`${5+2*i} A`,`${nformat((2+i)+(3+i)+(1+i))} A`],0,2,'ΣIwpł = ΣIwypł','Suma wpływających prądów musi równać się sumie wypływających.',`Drugi prąd = ${2+i}+${3+i}−${1+i} = 4 A.`,true), l3:(i)=>mkQ(`W oczku obwodu źródło ma napięcie ${24+i*2} V. Spadki napięć na dwóch elementach wynoszą ${9+i} V i ${7+i} V. Jaki musi być spadek napięcia na trzecim elemencie?`,[`${8} V`,`${16+2*i} V`,`${nformat((24+i*2)+(9+i)+(7+i))} V`],0,3,'ΣU = 0','W zamkniętym oczku algebraiczna suma zmian napięcia jest równa zeru.',`Brakujący spadek = ${24+i*2}−${9+i}−${7+i} = 8 V.`,true)},
    {r:/pole magnetyczne/i, l1:(i)=>mkQ(`Jak układają się linie pola magnetycznego wokół prostego przewodnika z prądem?`,['Tworzą okręgi wokół przewodnika','Są zawsze równoległe do przewodnika','Nie mają określonego kierunku'],0,1,'reguła prawej dłoni','Kierunek linii wyznaczysz regułą prawej dłoni.', 'Wokół prostoliniowego przewodnika linie pola są okręgami.',false), l2:(i)=>mkQ(`Jeśli natężenie prądu w przewodniku zwiększymy 3 razy, jak zmieni się pole magnetyczne w tej samej odległości?`,['Zwiększy się 3 razy','Zwiększy się 9 razy','Nie zmieni się'],0,2,'B ∝ I','Przy stałej geometrii pole jest proporcjonalne do prądu.', 'Wzrost I trzykrotny daje trzykrotny wzrost B.',false), l3:(i)=>mkQ(`W jednorodnym polu magnetycznym indukcja ma ${2+i} T. Na przewodnik długości ${0.4+i*0.1} m z prądem ${3+i} A działa siła prostopadła do przewodnika. Oblicz jej wartość.`,[`${nformat((2+i)*(0.4+i*0.1)*(3+i))} N`,`${nformat((2+i)/(0.4+i*0.1)/(3+i))} N`,`${nformat((2+i)*(3+i)/(0.4+i*0.1))} N`],0,3,'F = BIL','Dla kąta 90° sinθ = 1.',`F = B·I·L.`,true)},
    {r:/siła lorentza/i, l1:(i)=>mkQ(`Kiedy siła Lorentza działająca na poruszający się ładunek jest równa zeru?`,['Gdy prędkość jest równoległa do pola lub ładunek jest w spoczynku','Zawsze w polu magnetycznym','Tylko gdy ładunek jest dodatni'],0,1,'F = qvB sinθ','Siła zależy od sinusa kąta między v i B.', 'Dla θ = 0° lub 180° sinθ = 0.',false), l2:(i)=>mkQ(`Ładunek ${2+i} μC porusza się z prędkością ${3+i}·10^5 m/s prostopadle do pola ${0.2+i*0.1} T. Jaki wzór zastosujesz?`,['F = qvB','F = q/Bv','F = B/(qv)'],0,2,'F = qvB sinθ','Przy ruchu prostopadłym sin90° = 1.', 'Wartość siły to qvB.',true), l3:(i)=>mkQ(`Na cząstkę o ładunku ${2+i} μC działa w polu ${0.5+i*0.1} T siła ${1+i*0.2} N, a prędkość jest prostopadła do pola. Oblicz prędkość.`,[`${nformat((1+i*0.2)/((2+i)*1e-6*(0.5+i*0.1)))} m/s`,`${nformat((1+i*0.2)/((2+i)*(0.5+i*0.1)))} m/s`,`${nformat((2+i)*1e-6*(0.5+i*0.1)/(1+i*0.2))} m/s`],0,3,'v = F/(qB)','Przekształć wzór siły Lorentza względem v.',`v = F/(qB).`,true)},
    {r:/indukcja elektromagnetyczna/i, l1:(i)=>mkQ(`Kiedy w obwodzie może powstać siła elektromotoryczna indukcji?`,['Gdy zmienia się strumień pola magnetycznego przez obwód','Tylko gdy przewodnik jest nieruchomy','Tylko w stałym polu bez ruchu'],0,1,'ε = −ΔΦ/Δt','Szukaj zmiany strumienia magnetycznego.', 'Indukcja jest związana ze zmianą strumienia.',false), l2:(i)=>mkQ(`Strumień magnetyczny zmienił się o ${2+i} Wb w czasie ${1+i} s. Jaka jest wartość bezwzględna średniej SEM indukcji?`,[`${nformat((2+i)/(1+i))} V`,`${(2+i)*(1+i)} V`,`${nformat((1+i)/(2+i))} V`],0,2,'|ε| = |ΔΦ|/Δt','Podziel zmianę strumienia przez czas jej zmiany.',`|ε| = ${2+i}/${1+i} V.`,true), l3:(i)=>mkQ(`Jeżeli strumień przez zwojnicę zmienia się dwa razy szybciej, przy tej samej zmianie strumienia, jak zmieni się wartość średniej SEM?`,['Wzrośnie 2 razy','Zmaleje 2 razy','Nie zmieni się'],0,3,'|ε| = |ΔΦ|/Δt','Czas znajduje się w mianowniku.', 'Skrócenie czasu o połowę podwaja SEM.',true)},
    {r:/okres i częstotliwość|amplituda i okres/i, l1:(i)=>mkQ(`Drganie ma okres ${2+i} s. Jaka jest częstotliwość?`,[`${nformat(1/(2+i))} Hz`,`${2+i} Hz`,`${nformat(2+i)} s⁻¹`],0,1,'f = 1/T','Częstotliwość jest odwrotnością okresu.',`f = 1/T = 1/${2+i} Hz.`,true), l2:(i)=>mkQ(`Fala ma częstotliwość ${2+i} Hz. Ile wynosi jej okres?`,[`${nformat(1/(2+i))} s`,`${2+i} s`,`${nformat((2+i)*2)} s`],0,2,'T = 1/f','Odwróć częstotliwość.',`T = 1/${2+i} s.`,true), l3:(i)=>mkQ(`Częstotliwość drgań wzrosła z ${2+i} Hz do ${6+i} Hz. Jak zmienił się okres?`,['Zmalał w stosunku (2+i)/(6+i)','Wzrósł 3 razy','Nie zmienił się'],0,3,'T = 1/f','Porównaj odwrotności obu częstotliwości.',`T₂/T₁ = f₁/f₂ = ${2+i}/${6+i}.`,true)},
    {r:/równanie fali|parametry fali/i, l1:(i)=>mkQ(`Fala ma częstotliwość ${3+i} Hz i długość ${2+i} m. Co pozwala obliczyć jej prędkość?`,['v = λf','v = λ/f','v = f/λ'],0,1,'v = λf','Połącz długość fali i częstotliwość.', 'Prędkość fali jest iloczynem λ i f.',true), l2:(i)=>mkQ(`Fala ma długość ${2+i} m i częstotliwość ${4+i} Hz. Oblicz prędkość.`,[`${(2+i)*(4+i)} m/s`,`${nformat((2+i)/(4+i))} m/s`,`${nformat((4+i)/(2+i))} m/s`],0,2,'v = λf','Pomnóż długość fali przez częstotliwość.',`v = ${(2+i)}·${4+i} m/s.`,true), l3:(i)=>mkQ(`Fala przechodzi do ośrodka, w którym jej prędkość zmniejsza się ${2+i} razy, a częstotliwość pozostaje stała. Jak zmienia się długość fali?`,['Zmniejsza się proporcjonalnie do prędkości','Zwiększa się ${2+i} razy','Nie zmienia się'],0,3,'λ = v/f','Przy stałej częstotliwości długość fali jest proporcjonalna do prędkości.',`λ zmniejsza się ${2+i}-krotnie.`,true)},
    {r:/efekt dopplera/i, l1:(i)=>mkQ(`Gdy źródło dźwięku zbliża się do nieruchomego obserwatora, obserwowana częstotliwość jest...`,['większa od emitowanej','mniejsza od emitowanej','zawsze taka sama'],0,1,'efekt Dopplera','Zbliżanie źródła zwiększa częstość docierania kolejnych frontów fali.', 'Obserwowana częstotliwość rośnie.',false), l2:(i)=>mkQ(`Źródło emituje dźwięk o częstotliwości ${500+i*50} Hz i zbliża się do obserwatora. Która wartość może odpowiadać częstotliwości obserwowanej?`,[`${600+i*50} Hz`,`${400+i*50} Hz`,`${500+i*50} Hz`],0,2,'f_obs > f_źródła przy zbliżaniu','Nie potrzebujesz pełnego wzoru, aby określić kierunek zmiany.', 'Przy zbliżaniu częstotliwość obserwowana rośnie.',false), l3:(i)=>mkQ(`Obserwowana częstotliwość jest większa niż emitowana. Co możesz wnioskować o ruchu źródła względem obserwatora, jeśli to źródło porusza się względem nieruchomego obserwatora?`,['Źródło zbliża się','Źródło oddala się','Nie ma żadnego ruchu'],0,3,'efekt Dopplera','Znak przesunięcia częstotliwości wskazuje kierunek względnego ruchu.', 'Wyższa częstotliwość oznacza zbliżanie źródła.',false)},
    {r:/prawo odbicia/i, l1:(i)=>mkQ(`Promień pada na płaskie lustro pod kątem ${30+i}° do normalnej. Jaki jest kąt odbicia?`,[`${30+i}°`,`${60+i}°`,`${90-(30+i)}°`],0,1,'θᵢ = θᵣ','Kąt odbicia jest równy kątowi padania, oba mierzymy od normalnej.',`θᵣ = ${30+i}°.`,false), l2:(i)=>mkQ(`Promień pada na lustro pod kątem ${20+i}° do powierzchni. Jaki jest kąt padania względem normalnej?`,[`${70-i}°`,`${20+i}°`,`${90+i}°`],0,2,'θ = 90° − α','Kąt do normalnej i kąt do powierzchni sumują się do 90°.',`θ = 90° − (${20+i})°.`,true), l3:(i)=>mkQ(`Lustro obracamy o ${5+i}°. O ile zmieni się kierunek promienia odbitego, jeśli kierunek padającego pozostaje stały?`,[`${2*(5+i)}°`,`${5+i}°`,`${90-2*(5+i)}°`],0,3,'Δφ_odbitego = 2Δφ_lustra','Obrót normalnej o Δφ powoduje dwukrotną zmianę kierunku odbitego.',`Zmiana wynosi 2·${5+i}°.`,true)},
    {r:/prawo załamania/i, l1:(i)=>mkQ(`Przy przejściu światła z powietrza do szkła promień załamuje się ku czy od normalnej?`,['Ku normalnej','Od normalnej','Nie zmienia kierunku w żadnym przypadku'],0,1,'n₁sinθ₁ = n₂sinθ₂','Szkło ma większy współczynnik załamania niż powietrze.', 'Przy przejściu do ośrodka optycznie gęstszego promień załamuje się ku normalnej.',false), l2:(i)=>mkQ(`Dla granicy ośrodków n₁ = 1,0 i n₂ = 1,5 kąt padania wynosi 30°. Która zależność pozwoli wyznaczyć kąt załamania?`,['1,0·sin30° = 1,5·sinθ₂','1,5·sin30° = 1,0·sinθ₂','sin30° = θ₂'],0,2,'n₁sinθ₁ = n₂sinθ₂','Współczynniki stoją przy odpowiednich kątach po obu stronach granicy.', 'Zastosuj prawo Snelliusa.',true), l3:(i)=>mkQ(`Światło przechodzi z ośrodka o n₁ = 1,5 do n₂ = 1,0. Co dzieje się z kątem załamania, gdy zwiększasz kąt padania?`,['Rośnie i może osiągnąć kąt graniczny','Zawsze maleje','Pozostaje stały'],0,3,'n₁sinθ₁ = n₂sinθ₂','Przy przejściu do optycznie rzadszego ośrodka kąt załamania rośnie.', 'Dla odpowiednio dużego kąta może wystąpić całkowite wewnętrzne odbicie.',false)},
    {r:/soczewka skupiająca|soczewka rozpraszająca|soczewki i powiększenie/i, l1:(i)=>mkQ(`Soczewka skupiająca ma ogniskową ${10+i} cm. Co dzieje się z równoległymi promieniami po przejściu przez soczewkę?`,['Zbiegają się w ognisku','Rozchodzą się tak samo jak przed soczewką','Zatrzymują się w soczewce'],0,1,'f > 0','Soczewka skupiająca kieruje równoległe promienie do ogniska.', 'Promienie równoległe do osi po przejściu przez soczewkę skupiającą przechodzą przez ognisko.',false), l2:(i)=>mkQ(`Przedmiot znajduje się ${20+i*2} cm od soczewki o ogniskowej ${10+i} cm. Który wzór należy zastosować do wyznaczenia odległości obrazu?`,['1/f = 1/x + 1/y','f = x + y','y = fx'],0,2,'1/f = 1/x + 1/y','Rozpoznaj równanie soczewki cienkiej.', 'Zależność łączy ogniskową z odległością przedmiotu i obrazu.',true), l3:(i)=>mkQ(`Dla soczewki skupiającej f = ${10+i} cm, a odległość przedmiotu wynosi ${30+i*2} cm. Oblicz odległość obrazu.`,[`${nformat((10+i)*(30+i*2)/(30+i*2-(10+i)))} cm`,`${nformat((30+i*2)-(10+i))} cm`,`${nformat((10+i)+(30+i*2))} cm`],0,3,'1/f = 1/x + 1/y','Przekształć równanie soczewki względem y.',`y = fx/(x−f).`,true)},
    {r:/energia kwantu/i, l1:(i)=>mkQ(`Energia fotonu jest proporcjonalna do jego częstotliwości. Co stanie się z energią, gdy częstotliwość wzrośnie 2 razy?`,['Wzrośnie 2 razy','Wzrośnie 4 razy','Nie zmieni się'],0,1,'E = hf','W energii fotonu częstotliwość występuje w pierwszej potędze.', 'Dwukrotny wzrost częstotliwości daje dwukrotny wzrost energii.',false), l2:(i)=>mkQ(`Foton ma częstotliwość ${5+i}·10^14 Hz. Który wzór pozwala obliczyć jego energię?`,['E = hf','E = h/f','E = f/h'],0,2,'E = hf','Energia kwantu jest proporcjonalna do częstotliwości.', 'Energia fotonu wynosi E = hf.',false), l3:(i)=>mkQ(`Światło o częstotliwości ${6+i}·10^14 Hz ma energię fotonu ${nformat(6.626e-34*(6+i)*1e14)} J. Jeśli częstotliwość wzrośnie o 25%, o ile procent wzrośnie energia?`,['25%','50%','6,25%'],0,3,'E = hf','Przy stałej wartości h energia jest wprost proporcjonalna do f.', 'Zmiana procentowa energii jest taka sama jak częstotliwości: 25%.',true)},
    {r:/efekt fotoelektryczny/i, l1:(i)=>mkQ(`Od czego zależy maksymalna energia kinetyczna wybitych elektronów w efekcie fotoelektrycznym?`,['Od częstotliwości padającego promieniowania i pracy wyjścia','Tylko od natężenia światła','Tylko od czasu oświetlania'],0,1,'E_k,max = hf − W','Natężenie wpływa na liczbę wybitych elektronów, a częstotliwość na ich energię.', 'Energia maksymalna wynika z energii fotonu pomniejszonej o pracę wyjścia.',false), l2:(i)=>mkQ(`Jeśli częstotliwość światła wzrośnie, a materiał pozostanie ten sam, jak zmieni się maksymalna energia fotoelektronów?`,['Wzrośnie','Zmaleje','Pozostanie zawsze taka sama'],0,2,'E_k,max = hf − W','Praca wyjścia jest stała dla danego materiału.', 'Większa częstotliwość oznacza większą energię fotonu.',false), l3:(i)=>mkQ(`Praca wyjścia metalu wynosi ${2+i*0.2} eV, a energia fotonu ${4+i*0.2} eV. Jaka jest maksymalna energia kinetyczna elektronu?`,[`${2} eV`,`4 eV`,`${nformat(2+i*0.2+4+i*0.2)} eV`],0,3,'E_k,max = E_foton − W','Odejmij pracę wyjścia od energii fotonu.',`E_k,max = E_foton − W = 2 eV.`,true)},
    {r:/okres półtrwania|rozpady promieniotwórcze|radioaktywność/i, l1:(i)=>mkQ(`Po jednym okresie półtrwania jaka część początkowej liczby jąder pozostaje?`,['1/2','1/4','1'],0,1,'N = N₀·2^(−t/T₁/₂)','Każdy okres półtrwania zmniejsza liczbę jąder o połowę.', 'Pozostaje połowa początkowej liczby jąder.',false), l2:(i)=>mkQ(`Po ${2+i} okresach półtrwania pozostaje jaka część początkowej liczby jąder?`,[`${nformat(1/2**(2+i))}`,`${nformat(1/2**(1+i))}`,`${nformat(2**(2+i))}`],0,2,'N/N₀ = 2^(−n)','Każdy okres dzieli liczbę jąder przez 2.',`Pozostaje 1/2^${2+i}.`,true), l3:(i)=>mkQ(`Próbka ma początkowo ${800+i*100} jąder. Po ${3+i} okresach półtrwania ile średnio pozostanie?`,[`${nformat((800+i*100)/2**(3+i))}`,`${nformat((800+i*100)/2**(2+i))}`,`${nformat((800+i*100)*2**(3+i))}`],0,3,'N = N₀·2^(−n)','Liczbę początkową podziel przez 2^n.',`N = N₀/2^n.`,true)},
    {r:/energia wiązania/i, l1:(i)=>mkQ(`Co oznacza energia wiązania jądra?`,['Energię potrzebną do całkowitego rozdzielenia nukleonów','Energię kinetyczną elektronu atomu','Masę jądra'],0,1,'E_w = Δmc²','Większa energia wiązania oznacza silniej związany układ.', 'Jest to energia potrzebna do rozdzielenia jądra na swobodne nukleony.',false), l2:(i)=>mkQ(`Jeśli defekt masy jądra zwiększy się 2 razy, jak zmieni się energia wiązania?`,['Zwiększy się 2 razy','Zwiększy się 4 razy','Nie zmieni się'],0,2,'E_w = Δmc²','Energia jest proporcjonalna do defektu masy.', 'Przy stałym c wzrost Δm 2 razy daje wzrost E_w 2 razy.',false), l3:(i)=>mkQ(`Defekt masy jądra wynosi ${1+i}·10^-28 kg. Oblicz odpowiadającą mu energię wiązania, przyjmując c = 3·10^8 m/s.`,[`${nformat((1+i)*9e-12)} J`,`${nformat((1+i)*3e-20)} J`,`${nformat((1+i)*9e-20)} J`],0,3,'E = Δmc²','Podnieś prędkość światła do kwadratu i pomnóż przez defekt masy.',`E = Δm·c² = ${(1+i)}·10^-28·9·10^16 J.`,true)},
    {r:/dylatacja czasu/i, l1:(i)=>mkQ(`Dla obserwatora poruszającego się bardzo szybko względem zegara spoczywającego jak wygląda odmierzany czas własny?`,['Czas własny jest krótszy niż czas zmierzony w układzie, w którym zegar się porusza','Zawsze jest dłuższy','Nie istnieje'],0,1,'Δt = γΔt₀','Rozróżnij czas własny zegara i czas mierzony przez obserwatora, względem którego zegar się porusza.', 'Dla γ > 1 czas dylatowany jest większy od czasu własnego.',false), l2:(i)=>mkQ(`Jeżeli współczynnik Lorentza wynosi γ = ${2+i}, a czas własny wynosi ${3+i} s, ile czasu zmierzy obserwator, względem którego zegar się porusza?`,[`${(2+i)*(3+i)} s`,`${nformat((3+i)/(2+i))} s`,`${3+i} s`],0,2,'Δt = γΔt₀','Pomnóż czas własny przez γ.',`Δt = ${(2+i)}·${3+i} s.`,true), l3:(i)=>mkQ(`Jeżeli γ = ${2+i}, a zegar poruszający się względem obserwatora odmierza ${4+i} s czasu własnego, jak długo trwa to zdarzenie w układzie obserwatora?`,[`${(2+i)*(4+i)} s`,`${nformat((4+i)/(2+i))} s`,`${4+i} s`],0,3,'Δt = γΔt₀','Wybierz właściwy czas jako własny: mierzony w układzie, gdzie zdarzenia zachodzą w tym samym miejscu.',`Δt = γΔt₀.`,true)},
    {r:/kontrakcja długości/i, l1:(i)=>mkQ(`Jak wygląda długość poruszającego się pręta wzdłuż kierunku ruchu dla obserwatora, względem którego pręt się porusza?`,['Jest krótsza niż długość własna','Jest dłuższa','Nie zmienia się'],0,1,'L = L₀/γ','Kontrakcja dotyczy wymiaru równoległego do ruchu.', 'Długość obserwowana jest mniejsza od długości własnej.',false), l2:(i)=>mkQ(`Pręt ma długość własną ${10+i} m, a γ = ${2+i}. Jaka jest długość w układzie, w którym pręt się porusza?`,[`${nformat((10+i)/(2+i))} m`,`${(10+i)*(2+i)} m`,`${10+i} m`],0,2,'L = L₀/γ','Podziel długość własną przez γ.',`L = ${(10+i)}/${2+i} m.`,true), l3:(i)=>mkQ(`Pręt ma długość własną ${12+i} m. Jeśli γ = ${3+i}, o jaki ułamek długości własnej zmniejszy się długość obserwowana?`,['1 − 1/γ','γ − 1','1/γ'],0,3,'L/L₀ = 1/γ','Najpierw oblicz L/L₀, potem znajdź różnicę 1 − L/L₀.', 'Ułamek skrócenia to 1 − 1/γ.',true)},
    {r:/przewodnictwo elektryczne/i, l1:(i)=>mkQ(`W metalu nośnikami prądu są przede wszystkim...`,['swobodne elektrony','protony w jądrze','fotony'],0,1,'przewodnictwo metali','Rozpoznaj budowę przewodnika metalicznego.', 'Prąd w metalu jest związany z uporządkowanym ruchem swobodnych elektronów.',false), l2:(i)=>mkQ(`Jeżeli długość przewodnika zwiększymy 2 razy przy stałym polu przekroju, jak zmieni się jego opór?`,['Zwiększy się 2 razy','Zmniejszy się 2 razy','Nie zmieni się'],0,2,'R = ρL/A','Opór jest proporcjonalny do długości przewodnika.', 'Dwukrotny wzrost L daje dwukrotny wzrost R.',true), l3:(i)=>mkQ(`Przewodnik ma opór właściwy ${1.7}·10^-8 Ωm, długość ${20+i} m i pole przekroju ${1+i*0.2}·10^-6 m². Oblicz opór.`,[`${nformat(1.7e-8*(20+i)/((1+i*0.2)*1e-6))} Ω`,`${nformat(1.7e-8*(1+i*0.2)*1e-6/(20+i))} Ω`,`${nformat((20+i)/((1+i*0.2)))} Ω`],0,3,'R = ρL/A','Podstaw opór właściwy, długość i pole przekroju do wzoru.', 'R = ρL/A.',true)},
    {r:/sprężystość i plastyczność/i, l1:(i)=>mkQ(`Odkształcenie sprężyste oznacza, że po usunięciu obciążenia ciało...`,['wraca do pierwotnego kształtu w granicach sprężystości','zawsze pęka','pozostaje trwale odkształcone'],0,1,'prawo Hooke’a','Rozróżnij odkształcenie sprężyste od plastycznego.', 'W zakresie sprężystym ciało wraca do pierwotnego kształtu.',false), l2:(i)=>mkQ(`Jeżeli siłę rozciągającą sprężynę zwiększymy 2 razy w zakresie prawa Hooke’a, jak zmieni się wydłużenie?`,['Zwiększy się 2 razy','Zwiększy się 4 razy','Nie zmieni się'],0,2,'F = kΔx','W zakresie liniowym wydłużenie jest proporcjonalne do siły.', 'Dwukrotny wzrost siły daje dwukrotny wzrost wydłużenia.',true), l3:(i)=>mkQ(`Sprężyna ma stałą k = ${100+i*20} N/m. Działa na nią siła ${10+i} N. Oblicz wydłużenie.`,[`${nformat((10+i)/(100+i*20))} m`,`${nformat((100+i*20)/(10+i))} m`,`${(10+i)*(100+i*20)} m`],0,3,'F = kΔx','Przekształć prawo Hooke’a do postaci Δx = F/k.',`Δx = ${(10+i)}/${100+i*20} m.`,true)},
    {r:/twardość i wytrzymałość/i, l1:(i)=>mkQ(`Która cecha opisuje odporność materiału na trwałe odkształcenie powierzchni pod naciskiem?`,['Twardość','Przewodność cieplna','Gęstość'],0,1,'właściwości mechaniczne materiałów','Twardość jest cechą związaną z odpornością na zarysowanie lub odkształcenie powierzchni.', 'Twardość opisuje odporność powierzchni na odkształcenie.',false), l2:(i)=>mkQ(`Na próbkę działa siła ${100+i*20} N na powierzchnię ${0.01+i*0.002} m². Oblicz naprężenie.`,[`${nformat((100+i*20)/(0.01+i*0.002))} Pa`,`${nformat((100+i*20)*(0.01+i*0.002))} Pa`,`${nformat((0.01+i*0.002)/(100+i*20))} Pa`],0,2,'σ = F/A','Naprężenie to siła podzielona przez pole przekroju.',`σ = F/A.`,true), l3:(i)=>mkQ(`Dwa materiały wytrzymują naprężenia graniczne ${200+i*50} MPa i ${350+i*50} MPa. Który ma większą wytrzymałość i o ile procent?`,['Drugi; około 100·(150)/(200+i*50)%','Pierwszy; o większą wartość','Są takie same'],0,3,'σ_graniczne','Porównaj wartości naprężeń granicznych i policz względną różnicę.', 'Większa wartość graniczna oznacza większą wytrzymałość na dane obciążenie.',true)}
];

function znajdzFabryke(temat) { return FABRYKI_PYTAN.find(f => f.r.test(temat)); }

const GENERIC_WIEDZA = [
    {r:/gwiazd|ewolucj.*gwiazd/i, facts:[
        ['Co decyduje o głównej ścieżce ewolucji gwiazdy?',['Jej masa początkowa','Tylko kolor widziany z Ziemi','Tylko odległość od Ziemi'],0],
        ['Dlaczego masywne gwiazdy żyją krócej mimo większej ilości paliwa?',['Zużywają paliwo znacznie szybciej','Nie mają wodoru','Nie zachodzą w nich reakcje jądrowe'],0],
        ['Pozostałością po gwieździe podobnej do Słońca jest najczęściej...',['biały karzeł','czarna dziura w każdym przypadku','planeta'],0],
        ['Supernowa związana z zapadaniem jądra dotyczy przede wszystkim...',['masywnych gwiazd','każdego ciała skalistego','planet'],0]
    ]},
    {r:/galaktyk/i, facts:[
        ['Czym jest galaktyka?',['Układem gwiazd, gazu, pyłu i ciemnej materii związanym grawitacyjnie','Pojedynczą gwiazdą','Jedną planetą'],0],
        ['Co może wskazywać przesunięcie ku czerwieni widma galaktyki?',['Jej oddalanie się względem obserwatora','Jej brak grawitacji','Jej zerową temperaturę'],0],
        ['Droga Mleczna jest...',['galaktyką spiralną','planetą','gromadą pojedynczych gwiazd bez struktury'],0],
        ['Dlaczego krzywe rotacji galaktyk są ważne?',['Dostarczają przesłanek o obecności ciemnej materii','Pokazują temperaturę każdej planety','Mierzą bezpośrednio wiek każdego atomu'],0]
    ]},
    {r:/światło i widma/i, facts:[
        ['Co można wywnioskować z linii widmowych gwiazdy?',['O obecności określonych pierwiastków','O liczbie planet w każdej sytuacji','O masie obserwatora'],0],
        ['Przesunięcie ku czerwieni oznacza przesunięcie linii widmowych...',['w stronę większych długości fal','w stronę mniejszych długości fal','zawsze do ultrafioletu'],0],
        ['Widmo absorpcyjne powstaje, gdy...',['ciągłe promieniowanie przechodzi przez chłodniejszy gaz pochłaniający wybrane długości fal','ciało nie emituje żadnego promieniowania','każdy atom emituje wszystkie długości fal'],0],
        ['Temperaturę powierzchni gwiazdy można szacować m.in. na podstawie...',['widma i rozkładu promieniowania','wyłącznie jej odległości','tylko promienia orbity Ziemi'],0]
    ]},
    {r:/planety/i, facts:[
        ['Co utrzymuje planetę na orbicie wokół gwiazdy?',['Oddziaływanie grawitacyjne','Siła tarcia o próżnię','Brak jakichkolwiek sił'],0],
        ['Planeta bliżej gwiazdy ma zwykle krótszy okres obiegu. Wynika to z...',['praw ruchu orbitalnego i grawitacji','prawa Archimedesa','prawa Ohma'],0],
        ['Atmosfera planety wpływa m.in. na...',['bilans cieplny i warunki na powierzchni','wartość stałej Plancka','ładunek elektronu'],0],
        ['Która wielkość jest bezpośrednio związana z orbitą eliptyczną?',['Półoś wielka i mimośród','Tylko kolor planety','Tylko masa obserwatora'],0]
    ]},
    {r:/czarna dziura|grawitacja i czasoprzestrzeń|fale grawitacyjne/i, facts:[
        ['Co nazywamy horyzontem zdarzeń czarnej dziury?',['Granicą, zza której sygnał nie może dotrzeć do odległego obserwatora','Powierzchnią planety','Obszarem bez grawitacji'],0],
        ['Fale grawitacyjne są...',['zaburzeniami geometrii czasoprzestrzeni rozchodzącymi się z prędkością światła','falami dźwiękowymi w próżni','falami na powierzchni cieczy'],0],
        ['W pobliżu masywnego obiektu zegary mogą chodzić wolniej względem odległego obserwatora z powodu...',['grawitacyjnej dylatacji czasu','prawa Ohma','efektu Archimedesa'],0],
        ['Czarna dziura może powstać m.in. w wyniku...',['kolapsu odpowiednio masywnego jądra gwiazdy','zwykłego odbicia światła od lustra','zamarznięcia wody'],0]
    ]},
    {r:/struktury krystaliczne|sieci przestrzenne|defekty kryształów|materiały amorficzne/i, facts:[
        ['Czym wyróżnia się kryształ?',['Uporządkowaniem struktury na dużych odległościach','Całkowitym brakiem uporządkowania','Brakiem atomów'],0],
        ['Wakansja w krysztale to...',['brak atomu w miejscu sieciowym','dodatkowy elektron swobodny w próżni','pęknięcie całej próbki'],0],
        ['Materiał amorficzny nie ma...',['dalekozasięgowego uporządkowania typowego dla kryształów','żadnych atomów','żadnej energii'],0],
        ['Defekty sieci mogą wpływać na...',['własności mechaniczne i elektryczne materiału','wartość prędkości światła w próżni','masę elektronu'],0]
    ]}
];


const FALLBACK_FORMULY = [
    [/moment siły/i, 'M = F·r', 'moment siły'],
    [/prędkość kątowa/i, 'ω = Δφ/Δt', 'prędkość kątowa'],
    [/moment pędu/i, 'L = Iω', 'moment pędu'],
    [/równowaga ciał/i, 'ΣF = 0', 'równowaga sił'],
    [/zasady Newtona/i, 'F_w = ma', 'II zasada Newtona'],
    [/siła tarcia/i, 'F_t = μN', 'siła tarcia'],
    [/prawa Keplera/i, 'T²/a³ = const', 'III prawo Keplera'],
    [/ruch orbitalny/i, 'v = √(GM/r)', 'prędkość orbitalna'],
    [/gwiazdy/i, 'L = 4πR²σT⁴', 'prawo Stefana-Boltzmanna'],
    [/planety/i, 'T²/a³ = const', 'ruch planet'],
    [/światło i widma/i, 'c = λf', 'związek długości fali i częstotliwości'],
    [/rozszerzanie Wszechświata/i, 'v = H₀d', 'prawo Hubble’a'],
    [/natężenie dźwięku/i, 'I = P/A', 'natężenie fali'],
    [/widmo elektromagnetyczne/i, 'c = λf', 'widmo elektromagnetyczne'],
    [/polaryzacja światła/i, 'I = I₀cos²θ', 'prawo Malusa'],
    [/ruch harmoniczny/i, 'x = A cos(ωt)', 'ruch harmoniczny'],
    [/energia drgań/i, 'E = const', 'energia drgań'],
    [/rodzaje fal|fale poprzeczne i podłużne/i, 'v = λf', 'parametry fali'],
    [/dźwięk/i, 'v = λf', 'fala dźwiękowa'],
    [/funkcja falowa/i, '|ψ|²', 'interpretacja funkcji falowej'],
    [/zasada nieoznaczoności/i, 'ΔxΔp ≥ ħ/2', 'zasada nieoznaczoności'],
    [/budowa jądra/i, 'A = Z + N', 'liczba nukleonów'],
    [/rozszczepienie i synteza/i, 'E = Δmc²', 'energia jądrowa'],
    [/promieniowanie/i, 'E = hf', 'energia fotonu'],
    [/względność szczególna/i, 'γ = 1/√(1−v²/c²)', 'współczynnik Lorentza'],
    [/energia spoczynkowa/i, 'E₀ = mc²', 'energia spoczynkowa'],
    [/czarna dziura/i, 'r_s = 2GM/c²', 'promień Schwarzschilda'],
    [/grawitacja i czasoprzestrzeń/i, 'Δt = γΔt₀', 'dylatacja czasu'],
    [/struktury krystaliczne/i, 'ρ = m/V', 'gęstość materiału'],
    [/sieci przestrzenne/i, 'a = parametr sieci', 'parametr sieci'],
    [/defekty kryształów/i, 'c = N_def/N', 'stężenie defektów'],
    [/materiały amorficzne/i, 'ρ = m/V', 'gęstość materiału'],
    [/przewodnictwo elektryczne/i, 'R = ρL/A', 'opór przewodnika'],
    [/twardość i wytrzymałość/i, 'σ = F/A', 'naprężenie'],
    [/sprężystość i plastyczność/i, 'F = kΔx', 'prawo Hooke’a'],
    [/skale temperatur|pomiar temperatury/i, 'T[K] = t[°C] + 273,15', 'skala temperatur'],
    [/energia wewnętrzna/i, 'ΔU = Q − W', 'I zasada termodynamiki'],
    [/praca i energia/i, 'W = Fs cosα', 'praca siły'],
    [/ruch w dwóch wymiarach|rzuty/i, 'x = v₀cosα·t; y = v₀sinα·t − ½gt²', 'rzut ukośny'],
    [/opóźnienie|hamowanie/i, 's = v₀t − ½at²', 'ruch opóźniony']
];

function znajdzFormuleAwaryjna(temat) { return FALLBACK_FORMULY.find(([r]) => r.test(temat)); }
function generujAwaryjnePytania(temat, poziom, start=0) {
    const znalezione = znajdzFormuleAwaryjna(temat);
    const formula = znalezione?.[1] || 'zależność właściwa dla tego zagadnienia';
    const nazwa = znalezione?.[2] || temat;
    const out=[];
    for(let i=0;i<MIN_PYTAN_NA_POZIOM;i++) {
        const n=i+start+1;
        if(poziom===1) {
            uniqPush(out, mkQ(`Które stwierdzenie poprawnie opisuje zagadnienie „${temat}” — wariant ${n}?`, [`Kluczową zależnością jest ${formula}`, 'Zjawisko nie podlega żadnym prawom fizyki', 'Zależy wyłącznie od koloru badanego obiektu'],0,1,formula,`Rozpoznaj podstawową zależność opisującą ${nazwa}.`,`Właściwy model dla tego zagadnienia można zapisać jako ${formula}.`,false));
        } else if(poziom===2) {
            uniqPush(out, mkQ(`W zagadnieniu „${temat}” uczeń ma dobrać model do danych. Co powinien zrobić najpierw? — wariant ${n}`, ['Wypisać dane i szukaną wielkość, a następnie dobrać zależność', 'Od razu podstawić wszystkie liczby do dowolnego wzoru', 'Pominąć jednostki'],0,2,formula,'Najpierw nazwij wielkości fizyczne i ich jednostki, potem dobierz wzór.',`Dla ${nazwa} trzeba rozpocząć od identyfikacji danych i modelu: ${formula}.`,false));
        } else {
            const wsp = 2 + (i % 4);
            uniqPush(out, mkQ(`W modelu dla tematu „${temat}” wszystkie wielkości występujące w liczniku zależności ${formula} zwiększono ${wsp} razy, a pozostałe pozostawiono bez zmian. Jak zmieni się wielkość wynikowa? — wariant ${n}`, [`Można wyznaczyć ją z potęg zależności; w prostym iloczynie wzrośnie ${wsp} razy`, 'Na pewno zmaleje do zera', 'Nie można korzystać z zależności fizycznej'],0,3,formula,'Rozłóż wzór na czynniki i przeanalizuj potęgi każdej zmienianej wielkości. Następnie sprawdź jednostkę.',`W zadaniach zaawansowanych wykorzystujemy strukturę zależności ${formula}; zmiana skali wynika z potęg, z jakimi występują wielkości.`,true));
        }
    }
    return out;
}

function generujPytaniaDlaTematu(temat) {
    const fab = znajdzFabryke(temat);
    const wynik = {1:[],2:[],3:[]};
    if (fab) {
        for (let i=0; i<MIN_PYTAN_NA_POZIOM; i++) {
            uniqPush(wynik[1], fab.l1(i));
            uniqPush(wynik[2], fab.l2(i));
            uniqPush(wynik[3], fab.l3(i));
        }
    }
    const generic = GENERIC_WIEDZA.find(x => x.r.test(temat));
    if (generic) {
        for (let i=0; i<MIN_PYTAN_NA_POZIOM; i++) {
            const f = generic.facts[i % generic.facts.length];
            const indeks = i % 12;
            const wariantyPodstawowe = [
                f[0],
                `Które stwierdzenie najlepiej wyjaśnia pojęcie związane z tematem „${temat}”?`,
                `Uczeń ma wyjaśnić, czym jest zjawisko opisane w pytaniu. Która odpowiedź jest poprawna?`,
                `Która odpowiedź poprawnie rozpoznaje zjawisko występujące w temacie „${temat}”?`,
                `Które zdanie można uznać za poprawne pod względem fizycznym w temacie „${temat}”?`,
                `Jeżeli masz krótko wyjaśnić to zagadnienie koledze, którą odpowiedź wybierzesz?`,
                `Która interpretacja pojęcia z tematu „${temat}” jest właściwa?`,
                `Co należy powiedzieć o zjawisku opisanym w pytaniu?`,
                `Która odpowiedź nie zawiera błędu fizycznego w odniesieniu do tego zagadnienia?`,
                `Jak najtrafniej opisać zjawisko z pytania?`,
                `Które stwierdzenie wynika z definicji badanego pojęcia?`,
                `Który opis jest zgodny z poznaną zasadą fizyczną?`
            ];
            const wariantySrednie = [
                f[0].replace(/\?$/, ' — wybierz poprawne wyjaśnienie.'),
                `W praktycznej sytuacji związanej z tematem „${temat}” trzeba rozpoznać właściwą zasadę. Która odpowiedź jest poprawna?`,
                `Porównujesz trzy opisy zjawiska z tematu „${temat}”. Który opis jest zgodny z fizyką?`,
                `Na podstawie definicji z tematu „${temat}” wybierz poprawny wniosek.`,
                `Która zależność lub zasada pozwala poprawnie opisać sytuację z pytania?`,
                `Uczeń pomylił dwa pojęcia z tego działu. Które wyjaśnienie usuwa ten błąd?`,
                `Który wniosek można wyciągnąć z podanej sytuacji bez wykonywania dodatkowych założeń?`,
                `Która odpowiedź poprawnie łączy pojęcie z jego znaczeniem fizycznym?`,
                `Wybierz opis, który można obronić na podstawie praw fizyki.`,
                `Które rozumowanie prowadzi do poprawnego wniosku w tym zagadnieniu?`,
                `Która odpowiedź wskazuje właściwy model fizyczny dla tego problemu?`,
                `Jak należy zinterpretować podaną sytuację w ramach tego tematu?`
            ];
            const wariantyZaawansowane = [
                f[0].replace(/\?$/, ' — analiza przypadku.'),
                `Analizujesz sytuację związaną z tematem „${temat}”. Który model fizyczny należy zastosować?`,
                `W zadaniu z tematu „${temat}” zmienia się jedna wielkość. Który wniosek wynika z zależności fizycznej?`,
                `Które założenie jest konieczne, aby poprawnie rozwiązać problem z tego zagadnienia?`,
                `Który krok rozwiązania powinien zostać wykonany jako pierwszy w zadaniu z tematu „${temat}”?`,
                `Która interpretacja wyniku byłaby zgodna z modelem fizycznym tego zagadnienia?`,
                `Który argument pozwala odrzucić błędne rozwiązanie tego problemu?`,
                `W analizie zadania z tematu „${temat}” wybierz poprawny tok rozumowania.`,
                `Która zależność najlepiej opisuje zmianę wielkości w tym problemie?`,
                `Który wniosek pozostaje prawdziwy po zmianie warunków zadania?`,
                `Jak sprawdzić, czy otrzymany wynik jest zgodny z prawami fizyki?`,
                `Które rozumowanie prowadzi do poprawnego rozwiązania tego przypadku?`
            ];
            const p1 = wariantyPodstawowe[indeks];
            const p2 = wariantySrednie[indeks];
            const p3 = wariantyZaawansowane[indeks];
            uniqPush(wynik[1], mkQ(p1, f[1], f[2], 1, '', 'Najpierw rozpoznaj pojęcie i odrzuć odpowiedzi dotyczące innego działu.', `Poprawna odpowiedź wynika z definicji i własności badanego zjawiska.`, false));
            uniqPush(wynik[2], mkQ(p2, f[1], f[2], 2, '', 'Porównaj odpowiedzi z podstawową zasadą fizyczną i sprawdź, czy opisują dokładnie to zjawisko.', `Właściwe stwierdzenie jest zgodne z fizycznym znaczeniem tego pojęcia.`, false));
            uniqPush(wynik[3], mkQ(p3, f[1], f[2], 3, znalezione?.[1] || '', 'Najpierw nazwij zjawisko, wybierz model fizyczny, a następnie sprawdź zależność i jej jednostki.', `Odpowiedź wynika z modelu i obserwowanej zależności. Jeżeli używasz wzoru, sprawdź również jego jednostki.`, Boolean(znalezione?.[1])));
        }
    }
    for (const p of [1,2,3]) {
        if (wynik[p].length < MIN_PYTAN_NA_POZIOM) {
            generujAwaryjnePytania(temat, p, wynik[p].length).forEach(q => uniqPush(wynik[p], q));
        }
    }
    return wynik;
}

function uzupelnijBankiDoMinimum() {
    Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki || {}).forEach(lekcje => lekcje.forEach(lekcja => {
        const isMatura = lekcja.typ === 'maturalne';
        if (isMatura) return;
        const oryginalne = (lekcja.quiz || []).filter(pytanieSamodzielne).map(q => ({...q, poziom: poziomPytania(q)}));
        const wygenerowane = generujPytaniaDlaTematu(lekcja.temat);
        const final = [];
        for (const p of [1,2,3]) {
            const kandydaci = [...oryginalne.filter(q => q.poziom === p), ...wygenerowane[p]];
            const seen = new Set();
            for (const q of kandydaci) {
                const key = q.pytanie.trim().toLowerCase();
                if (!seen.has(key)) { seen.add(key); final.push({...q, poziom:p}); }
                if (final.filter(x => x.poziom === p).length >= MIN_PYTAN_NA_POZIOM) break;
            }
        }
        lekcja.quiz = final;
    })));
}

function uzupelnijTreningiMaturalne() {
    const maturaFactory = [
        [/mechanika/i, [
            ['Samochód zwiększa prędkość z 12 m/s do 28 m/s w 8 s. Oblicz przyspieszenie.', ['2 m/s²','3 m/s²','4 m/s²'],0,'a = Δv/t'],
            ['Klocek 5 kg jest ciągnięty siłą 18 N po poziomej powierzchni, a tarcie ma 3 N. Oblicz przyspieszenie.', ['3 m/s²','3,6 m/s²','4,2 m/s²'],0,'a = (F−T)/m'],
            ['Ciało o masie 2 kg porusza się z 6 m/s. Oblicz jego energię kinetyczną.', ['36 J','18 J','12 J'],1,'E_k = ½mv²'],
            ['Pocisk zmienia pęd o 12 kg·m/s w czasie 0,03 s. Oblicz średnią siłę.', ['400 N','40 N','360 N'],0,'F = Δp/Δt'],
            ['Dźwignia ma ramię 0,4 m i działa na nią siła 50 N prostopadle. Oblicz moment.', ['20 N·m','125 N·m','50 N·m'],0,'M = Fr'],
            ['Ciało rusza z miejsca z a = 3 m/s². Jaką drogę pokona w 6 s?', ['54 m','18 m','108 m'],0,'s = ½at²'],
            ['W ruchu po okręgu v = 10 m/s i r = 5 m. Oblicz a_d.', ['20 m/s²','2 m/s²','50 m/s²'],0,'a_d = v²/r'],
            ['Dwa pojazdy jadą w przeciwnych kierunkach z 15 m/s i 20 m/s. Oblicz prędkość względną.', ['35 m/s','5 m/s','300 m/s'],0,'v_wzgl = v₁+v₂'],
            ['Ciało o masie 4 kg ma pęd 28 kg·m/s. Oblicz prędkość.', ['7 m/s','112 m/s','24 m/s'],0,'p = mv'],
            ['Piłka o masie 0,5 kg spada z wysokości 8 m. Przyjmij g = 10 m/s². Jaka jest jej energia potencjalna względem podłoża?', ['40 J','80 J','4 J'],0,'E_p = mgh'],
            ['Na ciało działają siły 12 N i 5 N w przeciwnych kierunkach. Jaka jest wartość siły wypadkowej?', ['7 N','17 N','60 N'],0,'F_w = |F₁−F₂|'],
            ['Praca siły 25 N na drodze 4 m, gdy siła jest równoległa do ruchu, wynosi...', ['100 J','29 J','6,25 J'],0,'W = Fs']
        ]],
        [/grawitacja/i, [
            ['Dwie masy są oddalone o 2r. W porównaniu z odległością r siła grawitacji jest...', ['4 razy mniejsza','2 razy mniejsza','4 razy większa'],0,'F ∝ 1/r²'],
            ['Na orbicie kołowej promień zwiększono 4 razy. Jak zmienia się prędkość orbitalna?', ['Zmniejsza się 2 razy','Zmniejsza się 4 razy','Rośnie 2 razy'],0,'v_orb = √(GM/r)'],
            ['Jak zmieni się przyspieszenie grawitacyjne, gdy odległość od środka planety zwiększymy 3 razy?', ['Zmniejszy się 9 razy','Zmniejszy się 3 razy','Zwiększy się 9 razy'],0,'g = GM/r²'],
            ['Ciało o masie 2 kg podniesiono o 15 m. Przyjmij g = 10 m/s². Przyrost energii potencjalnej wynosi...', ['300 J','30 J','150 J'],0,'ΔE_p = mgΔh'],
            ['Prędkość ucieczki z planety zależy od...', ['M i R planety','tylko masy statku','tylko czasu lotu'],0,'v_e = √(2GM/R)'],
            ['Satelita obiega planetę po orbicie kołowej. Która siła zapewnia przyspieszenie dośrodkowe?', ['grawitacja','tarcie','siła wyporu'],0,'GMm/r² = mv²/r'],
            ['Jeżeli masa planety wzrośnie 4 razy przy stałym promieniu, g na powierzchni...', ['wzrośnie 4 razy','wzrośnie 2 razy','nie zmieni się'],0,'g = GM/R²'],
            ['Dla orbity kołowej energia mechaniczna satelity jest...', ['ujemna','zawsze dodatnia','równa zeru'],0,'E = −GMm/(2r)'],
            ['Okres obiegu planety zależy od półosi wielkiej orbity zgodnie z...', ['T² ∝ a³','T ∝ a³','T² ∝ 1/a³'],0,'T²/a³ = const'],
            ['Ciało spada z wysokości h bez oporu. Jak zmienia się jego energia mechaniczna?', ['Pozostaje stała','Rośnie','Maleje'],0,'E_mech = const'],
            ['Jeżeli promień orbity wzrośnie 9 razy, okres obiegu wzrośnie...', ['27 razy','9 razy','3 razy'],0,'T ∝ r^(3/2)'],
            ['Na powierzchni planety g = 4 m/s². Przy tym samym R, po zwiększeniu M 3 razy g wyniesie...', ['12 m/s²','7 m/s²','4/3 m/s²'],0,'g ∝ M']
        ]],
        [/termodynamika|własności materii/i, [
            ['2 kg wody ogrzano o 10 K. Przy c = 4200 J/(kg·K). Ile energii dostarczono?', ['84 kJ','8,4 kJ','840 kJ'],0,'Q = mcΔT'],
            ['Gaz w przemianie izotermicznej zmniejszył objętość 3 razy. Ciśnienie...', ['wzrosło 3 razy','zmalało 3 razy','nie zmieniło się'],0,'pV = const'],
            ['W przemianie izochorycznej gaz ogrzano. Jak zmienia się ciśnienie?', ['rośnie wraz z temperaturą bezwzględną','maleje','nie zmienia się'],0,'p/T = const'],
            ['Ciało o objętości 0,01 m³ jest całkowicie zanurzone w wodzie. Przyjmij ρ=1000 kg/m³ i g=10 m/s². Wypór wynosi...', ['100 N','10 N','1000 N'],0,'F_w = ρgV'],
            ['Ciśnienie hydrostatyczne w wodzie na 3 m wynosi przy g=10 m/s²...', ['30 kPa','3 kPa','300 kPa'],0,'p = ρgh'],
            ['Jeśli ciało pływa, to jego średnia gęstość jest...', ['mniejsza od gęstości cieczy','większa','zawsze równa zeru'],0,'ρ_ciała < ρ_cieczy'],
            ['Ciało pobrało 15 kJ ciepła i wykonało pracę 4 kJ. ΔU wynosi...', ['11 kJ','19 kJ','4 kJ'],0,'ΔU = Q − W'],
            ['Gaz doskonały ma n moli, temperaturę T i objętość V. Ciśnienie opisuje...', ['pV = nRT','p = nVRT','pV = RT/n'],0,'pV = nRT'],
            ['Współczynnik rozszerzalności cieplnej opisuje zmianę...', ['wymiarów pod wpływem temperatury','ładunku elektronu','okresu rozpadu'],0,'ΔL = αL₀ΔT'],
            ['Woda i olej mają tę samą masę i otrzymują tyle samo ciepła. Materiał o większym c ma...', ['mniejszy przyrost temperatury','większy przyrost temperatury','zawsze ten sam przyrost'],0,'ΔT = Q/(mc)'],
            ['W przepływie idealnej cieczy w zwężeniu prędkość...', ['rośnie, a ciśnienie statyczne może maleć','maleje, a ciśnienie zawsze rośnie','nie zmienia się'],0,'A₁v₁=A₂v₂; Bernoulli'],
            ['Przy stałej masie gazu w przemianie izobarycznej objętość jest proporcjonalna do...', ['temperatury w kelwinach','temperatury w °C','odwrotności temperatury'],0,'V/T = const']
        ]],
        [/fale|drgania/i, [
            ['Drganie ma T=0,25 s. Częstotliwość wynosi...', ['4 Hz','0,25 Hz','2 Hz'],0,'f=1/T'],
            ['Fala ma λ=2 m i f=5 Hz. Prędkość wynosi...', ['10 m/s','2,5 m/s','7 m/s'],0,'v=λf'],
            ['Zwiększenie amplitudy fali przy tej samej częstotliwości wpływa przede wszystkim na...', ['energię/intensywność drgań','prędkość światła w próżni','okres, który musi się zmienić'],0,'A — amplituda'],
            ['Fala podłużna charakteryzuje się drganiami ośrodka...', ['wzdłuż kierunku rozchodzenia się fali','prostopadle do niego','bez drgań'],0,'fala podłużna'],
            ['Przy stałej prędkości fali wzrost częstotliwości 2 razy powoduje...', ['spadek długości fali 2 razy','wzrost λ 2 razy','brak zmiany λ'],0,'λ=v/f'],
            ['W rezonansie amplituda drgań wymuszonych może...', ['znacznie wzrosnąć przy odpowiedniej częstotliwości wymuszającej','zawsze spaść do zera','nie zależeć od częstotliwości'],0,'rezonans'],
            ['Źródło zbliża się do obserwatora. Efekt Dopplera daje częstotliwość...', ['większą','mniejszą','równą zero'],0,'efekt Dopplera'],
            ['Interferencja konstruktywna występuje, gdy fale...', ['wzmacniają się w wyniku zgodnej fazy','zawsze mają przeciwne fazy','nie mają żadnej zależności fazowej'],0,'Δr = kλ'],
            ['Dyfrakcja jest szczególnie wyraźna, gdy rozmiar szczeliny jest...', ['porównywalny z długością fali','milion razy większy od λ','równy zeru'],0,'a ~ λ'],
            ['Energia drgania harmonicznego jest w idealnym modelu...', ['stała w czasie','zawsze rosnąca','zawsze malejąca'],0,'E = const'],
            ['Jeżeli częstotliwość wzrośnie 4 razy, okres...', ['zmaleje 4 razy','wzrośnie 4 razy','nie zmieni się'],0,'T=1/f'],
            ['Prędkość dźwięku w gazie zależy m.in. od...', ['właściwości ośrodka i temperatury','tylko amplitudy','ładunku źródła'],0,'v_dźwięku']
        ]],
        [/optyka/i, [
            ['Kąt odbicia jest równy...', ['kątowi padania względem normalnej','kątowi do powierzchni','zawsze 90°'],0,'θᵢ=θᵣ'],
            ['Przy przejściu do optycznie gęstszego ośrodka promień załamuje się...', ['ku normalnej','od normalnej','zawsze prostopadle'],0,'n₁sinθ₁=n₂sinθ₂'],
            ['Soczewka skupiająca dla promieni równoległych powoduje...', ['ich skupienie w ognisku','ich całkowite pochłonięcie','ich rozbieganie'],0,'soczewka skupiająca'],
            ['Dla soczewki cienkiej zachodzi...', ['1/f=1/x+1/y','f=x+y','f=xy'],0,'1/f=1/x+1/y'],
            ['Zwiększenie odległości przedmiotu od soczewki może zmienić...', ['położenie i rozmiar obrazu','prędkość światła w próżni','ładunek fotonu'],0,'równanie soczewki'],
            ['Całkowite wewnętrzne odbicie jest możliwe, gdy światło przechodzi...', ['z ośrodka optycznie gęstszego do rzadszego i kąt jest dostatecznie duży','z powietrza do szkła przy dowolnym kącie','z próżni do powietrza'],0,'sinθ_gr=n₂/n₁'],
            ['W interferencji światła prążki powstają w wyniku...', ['nakładania się fal','zatrzymania fotonów','zmiany masy światła'],0,'interferencja'],
            ['Dyfrakcja pokazuje, że światło...', ['ma właściwości falowe','nie może się rozchodzić','jest wyłącznie cząstką klasyczną'],0,'dyfrakcja'],
            ['Współczynnik załamania można wiązać z prędkością światła w ośrodku przez...', ['n=c/v','n=v/c','n=cv'],0,'n=c/v'],
            ['Powiększenie liniowe obrazu jest związane ze stosunkiem...', ['wysokości obrazu do wysokości przedmiotu','mas obrazu i przedmiotu','częstotliwości światła i czasu'],0,'m=h_i/h_o'],
            ['Oko krótkowzroczne koryguje się soczewką...', ['rozpraszającą','skupiającą','cylindryczną w każdym przypadku'],0,'korekcja krótkowzroczności'],
            ['Światło o krótszej długości fali ma w próżni...', ['większą częstotliwość','mniejszą częstotliwość','taką samą częstotliwość'],0,'c=λf']
        ]],
        [/elektromagnetyzm|elektryczność/i, [
            ['Prawo Ohma ma postać...', ['U=IR','U=I/R','U=R/I'],0,'U=IR'],
            ['Moc urządzenia o U=20 V i I=2 A wynosi...', ['40 W','10 W','22 W'],0,'P=UI'],
            ['Dwa oporniki 4 Ω i 6 Ω szeregowo mają...', ['10 Ω','2,4 Ω','24 Ω'],0,'R_z=R₁+R₂'],
            ['Dwa jednakowe oporniki R połączone równolegle mają...', ['R/2','2R','R'],0,'R_z=R/2'],
            ['Siła Lorentza jest prostopadła do...', ['prędkości i pola magnetycznego w odpowiedniej konfiguracji','zawsze tylko do ładunku','czasu'],0,'F=qvB sinθ'],
            ['Indukcja elektromagnetyczna powstaje przy zmianie...', ['strumienia magnetycznego','masy elektronu','temperatury absolutnej w każdym przypadku'],0,'ε=-ΔΦ/Δt'],
            ['Pole elektryczne punktowego ładunku maleje z odległością jak...', ['1/r²','1/r','r²'],0,'E=kq/r²'],
            ['W węźle obwodu suma prądów wpływających...', ['równa się sumie wypływających','zawsze jest większa','zawsze jest mniejsza'],0,'I prawo Kirchhoffa'],
            ['Napięcie jest pracą przypadającą na...', ['jednostkę ładunku','jednostkę masy','jednostkę czasu'],0,'U=W/q'],
            ['Praca pola elektrycznego przy przenoszeniu ładunku wiąże się z...', ['różnicą potencjałów','gęstością wody','okresem fali mechanicznej'],0,'W=qU'],
            ['Jeśli napięcie wzrośnie 3 razy przy stałym R, prąd...', ['wzrośnie 3 razy','zmaleje 3 razy','nie zmieni się'],0,'I=U/R'],
            ['Siła na przewodnik z prądem w polu magnetycznym zależy od...', ['B, I, L i kąta','tylko temperatury','tylko masy przewodnika'],0,'F=BIL sinθ']
        ]],
        [/fizyka atomowa|jądrowa|kwantowa/i, [
            ['Energia fotonu jest równa...', ['E=hf','E=h/f','E=f/h'],0,'E=hf'],
            ['Efekt fotoelektryczny potwierdza...', ['kwantową naturę oddziaływania światła z materią','brak energii fotonów','że światło nie ma częstotliwości'],0,'E_k,max=hf−W'],
            ['Po dwóch okresach półtrwania pozostaje...', ['1/4 próbki','1/2 próbki','3/4 próbki'],0,'N=N₀/2ⁿ'],
            ['Czas połowicznego rozpadu jest...', ['charakterystyczny dla danego izotopu','zależny wyłącznie od masy próbki','zawsze równy 1 s'],0,'T₁/₂'],
            ['Jądro atomowe składa się z...', ['protonów i neutronów','elektronów i fotonów','samych elektronów'],0,'A=Z+N'],
            ['W rozpadzie alfa emitowana jest...', ['cząstka ⁴₂He','pojedynczy elektron','foton widzialny'],0,'α=⁴₂He'],
            ['W rozpadzie beta minus neutron przechodzi w...', ['proton, elektron i antyneutrino','elektron i proton bez zachowania ładunku','foton'],0,'n→p+e⁻+ν̄'],
            ['Energia wiązania wynika z...', ['defektu masy','koloru jądra','promienia elektronu'],0,'E=Δmc²'],
            ['Rozszczepienie ciężkiego jądra może uwolnić...', ['energię','wyłącznie światło widzialne bez energii','masę bez energii'],0,'E=Δmc²'],
            ['Długość fali de Broglie’a jest odwrotnie proporcjonalna do...', ['pędu','masy spoczynkowej wyłącznie','czasu'],0,'λ=h/p'],
            ['Zasada nieoznaczoności ogranicza jednoczesną dokładność pomiaru...', ['położenia i pędu','masy i ładunku zawsze','temperatury i czasu'],0,'ΔxΔp ≥ ħ/2'],
            ['W atomie absorpcja fotonu może prowadzić do...', ['przejścia elektronu na wyższy poziom energii','zniknięcia jądra w każdym przypadku','zmiany stałej Plancka'],0,'ΔE=hf']
        ]],
        [/względność/i, [
            ['Energia spoczynkowa ciała wynosi...', ['E₀=mc²','E₀=mv','E₀=m/c²'],0,'E₀=mc²'],
            ['Dla obserwatora poruszający się zegar chodzi...', ['wolniej','szybciej bez ograniczeń','tak samo w każdym układzie'],0,'Δt=γΔt₀'],
            ['Długość poruszającego się pręta wzdłuż ruchu...', ['ulega skróceniu','ulega wydłużeniu','nie zależy od prędkości'],0,'L=L₀/γ'],
            ['Współczynnik Lorentza jest...', ['γ=1/√(1−v²/c²)','γ=1−v²/c²','γ=√(1−v²/c²)'],0,'γ=1/√(1−v²/c²'],
            ['Dla v << c teoria względności...', ['przechodzi w przybliżeniu klasycznym','zabrania ruchu','daje nieskończoną energię'],0,'granica klasyczna'],
            ['Masa spoczynkowa jest...', ['niezmiennikiem układu odniesienia','zawsze zależna od prędkości obserwatora','równa pędowi'],0,'m=const'],
            ['Prędkość światła w próżni jest...', ['taka sama dla inercjalnych obserwatorów','zależna od ruchu źródła','większa dla cięższych obserwatorów'],0,'c=const'],
            ['Zależność E²=(pc)²+(mc²)² łączy...', ['energię, pęd i masę spoczynkową','tylko energię cieplną','ładunek i temperaturę'],0,'E²=p²c²+m²c⁴'],
            ['Dylatacja czasu jest istotna...', ['przy prędkościach porównywalnych z c','tylko dla nieruchomych zegarów','wyłącznie w gazach'],0,'efekty relatywistyczne'],
            ['Kontrakcja długości dotyczy wymiaru...', ['równoległego do ruchu','prostopadłego do ruchu','każdego wymiaru w ten sam sposób'],0,'L=L₀/γ'],
            ['Zasada względności mówi, że prawa fizyki...', ['mają tę samą postać w układach inercjalnych','zmieniają się losowo','obowiązują tylko na Ziemi'],0,'zasada względności'],
            ['Wzrost prędkości do wartości bliskiej c powoduje γ...', ['rosnące bez ograniczenia','malejące do zera','stałe równe 1'],0,'γ→∞ dla v→c']
        ]],
        [/mechanika materiałów|fizyka materiałów/i, []]
    ];
    Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki || {}).forEach(lekcje => lekcje.forEach(lekcja => {
        if (lekcja.typ !== 'maturalne') return;
        const fab = maturaFactory.find(([r]) => r instanceof RegExp && r.test(lekcja.temat));
        if (!fab) {
            const base = (lekcja.quiz || []).filter(pytanieSamodzielne);
            const generated = generujAwaryjnePytania(lekcja.temat, 3, base.length);
            lekcja.quiz = [...base, ...generated].filter(pytanieSamodzielne).slice(0, MIN_PYTAN_MATURALNYCH);
            lekcja.quiz.forEach(q => q.maturalne = true);
            return;
        }
        const bank = fab[1];
        const base = bank.map((x, i) => mkQ(x[0], x[1], x[2], 3, x[3], 'Wypisz dane, wybierz zależność i wykonaj obliczenia. Zwróć uwagę na jednostki.', 'Zacznij od wypisania danych i szukanej wielkości. Następnie dobierz wzór, przekształć go i dopiero podstaw liczby.', true));
        const uzupelnienie = generujAwaryjnePytania(lekcja.temat, 3, base.length);
        const pula = [...base, ...uzupelnienie].filter(pytanieSamodzielne);
        const seen = new Set();
        lekcja.quiz = [];
        for (const q of pula) {
            const key = q.pytanie.trim().toLocaleLowerCase('pl');
            if (seen.has(key)) continue;
            seen.add(key);
            lekcja.quiz.push(q);
            if (lekcja.quiz.length >= MIN_PYTAN_MATURALNYCH) break;
        }
        lekcja.quiz.forEach(q=>{ q.maturalne=true; q.zrodlo = 'Trening maturalny Inercja — zadanie autorskie w stylu CKE'; });
    })));
}

// Uruchom przed filtrowaniem banków. Dzięki temu późniejszy quiz ma zawsze pełną pulę.
uzupelnijBankiDoMinimum();
uzupelnijTreningiMaturalne();

const POWIAZANE_OBSZARY = {
    mechanika: { kinematyka: ["kinematyka", "dynamika"], dynamika: ["dynamika", "statyka_i_bryla"], statyka_i_bryla: ["statyka_i_bryla", "dynamika"], },
    termodynamika: { temperatura_i_cieplo: ["temperatura_i_cieplo", "energia_i_przemiany"], energia_i_przemiany: ["energia_i_przemiany", "gazy_i_przemiany"], hydrostatyka_i_aerostatyka: ["hydrostatyka_i_aerostatyka", "energia_i_przemiany"] },
    grawitacja_astronomia: { grawitacja: ["grawitacja", "ruch_orbitalny"], ruch_orbitalny: ["ruch_orbitalny", "grawitacja"], ciala_niebieskie: ["ciala_niebieskie", "gwiazdy_galaktyki"], gwiazdy_galaktyki: ["gwiazdy_galaktyki", "obserwacje_kosmologia"] },
    optyka: { optyka_geometryczna: ["optyka_geometryczna", "soczewki_i_przyrzady"], soczewki_i_przyrzady: ["soczewki_i_przyrzady", "optyka_geometryczna"], optyka_falowa: ["optyka_falowa", "fale_drgania"] },
    elektromagnetyzm: { elektrostatyka: ["elektrostatyka", "prad_i_obwody"], prad_i_obwody: ["prad_i_obwody", "magnetyzm_i_indukcja"], magnetyzm_i_indukcja: ["magnetyzm_i_indukcja", "prad_i_obwody"] },
    fale_drgania: { drgania: ["drgania", "fale_mechaniczne"], fale_mechaniczne: ["fale_mechaniczne", "akustyka"], akustyka: ["akustyka", "fale_mechaniczne"], fale_elektromagnetyczne: ["fale_elektromagnetyczne", "optyka"] },
    mechanika_kwantowa_jadrowa: { podstawy_fizyki_atomowej: ["podstawy_fizyki_atomowej", "fizyka_jadrowa"], fizyka_jadrowa: ["fizyka_jadrowa", "podstawy_fizyki_atomowej"] },
    teoria_wzglednosci: { szczegolna: ["szczegolna", "ogolna"], ogolna: ["ogolna", "szczegolna"] },
    fizyka_materialow: { struktura_materii: ["struktura_materii", "wlasciwosci_materialow"], wlasciwosci_materialow: ["wlasciwosci_materialow", "struktura_materii"] }
};


function numerPoziomuUcznia() {
    return ({ podstawowy: 1, sredni: 2, zaawansowany: 3 })[profilUcznia?.poziom] || 2;
}

function poziomPytania(pytanie) {
    if (Number.isFinite(Number(pytanie?.poziom))) return Number(pytanie.poziom);
    if (pytanie?.obliczeniowe || pytanie?.wzor) return 2;
    return 1;
}

function dopasujPytaniaDoPoziomu(pytania, poziom) {
    const zPoziomem = pytania.map(p => ({ ...p, poziom: poziomPytania(p) }));
    const idealne = wymieszaj(zPoziomem.filter(p => p.poziom === poziom));
    const sasiednie = wymieszaj(zPoziomem.filter(p => Math.abs(p.poziom - poziom) === 1));
    const dalsze = wymieszaj(zPoziomem.filter(p => Math.abs(p.poziom - poziom) === 2));
    // Profil ma pierwszeństwo. Ponieważ każdy temat ma >=12 pytań na poziom,
    // quiz nie musi schodzić do innych poziomów.
    if (idealne.length >= 12) return idealne;
    return [...idealne, ...sasiednie, ...dalsze];
}

function opisPoziomuDlaUcznia(poziom) {
    return poziom === 1 ? "podstawowy" : poziom === 2 ? "średni" : "zaawansowany";
}

function startQuiz(pakiet, przyciskLekcji) {
    aktualnyPakiet = pakiet;
    aktualnyPrzyciskLekcji = przyciskLekcji;
    aktualnaPytanieIndex = 0;
    poziomAdaptacyjny = numerPoziomuUcznia();
    seriaPoprawnych = 0;
    seriaBlednych = 0;
    pokazanePytania = [];
    const poziomUcznia = numerPoziomuUcznia();
    aktualnePytania = pakiet.flatMap(lekcja => lekcja.quiz.map(pytanie => ({
        ...pytanie,
        pytanie: pytanie.pytanie,
        poziom: poziomPytania(pytanie)
    })));
    aktualnePytania = dopasujPytaniaDoPoziomu(aktualnePytania, poziomUcznia);
    // Nie dokładamy pytań z innych lekcji tylko po to, żeby sztucznie uzyskać 10 pozycji.
    // Każdy quiz ma być merytorycznie spójny z konkretnym tematem. Jeśli bank jest krótszy,
    // pokazujemy wszystkie dostępne pytania i nie udajemy, że są one z innego zakresu.
    document.getElementById("temat-lekcji").textContent = pakiet[0].temat;
    // Ponownie porządkujemy po uzupełnieniu banku: najpierw preferowany poziom,
    // potem poziomy sąsiednie. Dzięki temu wybór z profilu faktycznie steruje quizem.
    aktualnePytania = dopasujPytaniaDoPoziomu(aktualnePytania, poziomUcznia);
    if (aktualnePytania.length < MIN_PYTAN_W_KAZDYM_QUIZIE) {
        console.error("BŁĄD BANKU: quiz ma mniej niż 12 pytań", pakiet.map(lekcja => lekcja.temat), aktualnePytania.length);
        throw new Error(`Niepełny bank quizu: ${pakiet.map(lekcja => lekcja.temat).join(", ")}`);
    }
    // 15 pytań w każdym quizie — 12 to twarde minimum.
    aktualnaLiczbaPytan = Math.min(15, aktualnePytania.length);
    aktualnePytania = aktualnePytania.slice(0, aktualnaLiczbaPytan);
    ustawWizualnyPostep(0);
    ekranLekcji.style.display = "none";
    ekranQuizu.style.display = "block";
    showQuestion();
}

// Wyświetlanie pytania

function generujIlustracjePytania(pytanie) {
    const tekst = `${pytanie?.pytanie || ""} ${pytanie?.tematZrodlowy || ""}`.toLowerCase();
    const diagram = (aria, svg, opis) => `
      <div class="ilustracja-fizyczna" role="img" aria-label="${aria}">
        <svg viewBox="0 0 620 190" aria-hidden="true">${svg}</svg>
        <small>${opis}</small>
      </div>`;

    if (/soczew|zwierciad|lustro|załam|odbici|kąt padania|normaln|optyk/.test(tekst)) {
        return diagram('Schemat optyczny z promieniami i osią główną', `
          <line x1="55" y1="95" x2="565" y2="95" class="svg-normalna"/>
          <line x1="310" y1="25" x2="310" y2="165" class="svg-soczewka"/>
          <circle cx="220" cy="95" r="4" class="svg-punkt"/><circle cx="400" cy="95" r="4" class="svg-punkt"/>
          <text x="200" y="82" class="svg-opis">F</text><text x="405" y="82" class="svg-opis">F</text>
          <line x1="95" y1="55" x2="310" y2="55" class="svg-promien"/><line x1="310" y1="55" x2="470" y2="115" class="svg-promien"/>
          <line x1="95" y1="130" x2="470" y2="130" class="svg-promien"/>
          <text x="322" y="35" class="svg-opis">soczewka</text><text x="70" y="82" class="svg-opis">oś główna</text>`,
          'Schemat pomocniczy. Zaznacz oś, ognisko i promienie konstrukcyjne przed analizą obrazu.');
    }
    if (/wykres|prędkość.*czas|v\(t\)|droga.*czas|ruch jednostajn|przyspieszen/.test(tekst)) {
        return diagram('Schemat wykresu prędkości w funkcji czasu', `
          <line x1="70" y1="155" x2="555" y2="155" class="svg-osi"/><line x1="70" y1="155" x2="70" y2="25" class="svg-osi"/>
          <polyline points="70,130 260,75 470,45" class="svg-wykres" fill="none"/>
          <text x="540" y="176" class="svg-opis">t</text><text x="45" y="35" class="svg-opis">v</text>
          <text x="275" y="70" class="svg-opis">pole pod v(t) → droga</text>`,
          'Schemat pomocniczy. Wykres v(t) pozwala odczytywać prędkość, przyspieszenie i drogę z pola pod wykresem.');
    }
    if (/sił|dynamik|newton|tarci|równowag|ciężar|napręż/.test(tekst)) {
        return diagram('Schemat sił działających na ciało', `
          <rect x="275" y="75" width="70" height="55" rx="6" class="svg-cialo"/>
          <line x1="310" y1="75" x2="310" y2="30" class="svg-wektor"/><polygon points="310,22 304,35 316,35" class="svg-strzalka"/>
          <line x1="310" y1="130" x2="310" y2="172" class="svg-wektor"/><polygon points="310,180 304,167 316,167" class="svg-strzalka"/>
          <line x1="275" y1="102" x2="220" y2="102" class="svg-wektor"/><polygon points="212,102 225,96 225,108" class="svg-strzalka"/>
          <line x1="345" y1="102" x2="400" y2="102" class="svg-wektor"/><polygon points="408,102 395,96 395,108" class="svg-strzalka"/>
          <text x="320" y="25" class="svg-opis">N</text><text x="320" y="174" class="svg-opis">mg</text>
          <text x="218" y="94" class="svg-opis">F₁</text><text x="400" y="94" class="svg-opis">F₂</text>`,
          'Schemat sił. Zanim użyjesz II zasady Newtona, zaznacz wszystkie siły działające na rozpatrywane ciało.');
    }
    if (/obwód|prąd|napięci|opór|prawo ohma|rezyst|elektro/.test(tekst)) {
        return diagram('Schemat prostego obwodu elektrycznego', `
          <line x1="120" y1="45" x2="500" y2="45" class="svg-przewod"/><line x1="120" y1="145" x2="500" y2="145" class="svg-przewod"/>
          <line x1="120" y1="45" x2="120" y2="75" class="svg-przewod"/><line x1="120" y1="115" x2="120" y2="145" class="svg-przewod"/>
          <line x1="500" y1="45" x2="500" y2="145" class="svg-przewod"/>
          <line x1="108" y1="78" x2="132" y2="78" class="svg-bateria"/><line x1="102" y1="112" x2="138" y2="112" class="svg-bateria"/>
          <rect x="285" y="32" width="70" height="26" rx="4" class="svg-opornik"/><text x="308" y="51" class="svg-opis">R</text>
          <circle cx="410" cy="45" r="5" class="svg-punkt"/><text x="400" y="28" class="svg-opis">I</text>`,
          'Schemat obwodu. Zaznacz kierunek prądu i rozpoznaj, które wielkości są dane: U, I lub R.');
    }
    if (/fala|dźwięk|drgan|częstotliwo|długość fali|amplitud/.test(tekst)) {
        return diagram('Schemat fali z zaznaczoną długością fali i amplitudą', `
          <line x1="55" y1="95" x2="565" y2="95" class="svg-normalna"/>
          <path d="M55 95 C90 35,125 35,160 95 S230 155,265 95 S335 35,370 95 S440 155,475 95 S545 35,565 70" class="svg-fala" fill="none"/>
          <line x1="95" y1="170" x2="265" y2="170" class="svg-wymiar"/><text x="160" y="188" class="svg-opis">λ</text>
          <line x1="120" y1="95" x2="120" y2="40" class="svg-wymiar"/><text x="128" y="62" class="svg-opis">A</text>`,
          'Schemat fali. λ oznacza długość fali, a A — amplitudę.');
    }
    return '';
}

function showQuestion() {
    const stareWyjasnienie = document.getElementById("wyjasnienie-odpowiedzi");
    if (stareWyjasnienie) stareWyjasnienie.remove();
    if (aktualnaPytanieIndex < aktualnaLiczbaPytan) {
        const dostepnePytania = aktualnePytania.filter(pytanie => !pokazanePytania.includes(pytanie));
        const pytanie = dostepnePytania.sort((pierwsze, drugie) => Math.abs(pierwsze.poziom - poziomAdaptacyjny) - Math.abs(drugie.poziom - poziomAdaptacyjny))[0];
        aktualnePytanie = pytanie;
        pokazanePytania.push(pytanie);
        const polePytania = document.getElementById("quiz-pytanie");
        polePytania.innerHTML = `${generujIlustracjePytania(pytanie)}<p>${escapeHtml(pytanie.pytanie)}</p>`;
        document.getElementById("numer-pytania").textContent = `Pytanie ${aktualnaPytanieIndex + 1} z ${aktualnaLiczbaPytan} • poziom ${opisPoziomuDlaUcznia(pytanie.poziom)}`;
        pokazPodpowiedz(pytanie);
        
        const odpowiedziDiv = document.getElementById("quiz-odpowiedzi");
        odpowiedziDiv.innerHTML = "";
        dodajPrzyciskZgloszenia(pytanie);
        
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
                    pokazWyjasnieniePoprawnejOdpowiedzi(pytanie, odpowiedziDiv);
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
    podpowiedz.innerHTML = wygenerujLepszaPodpowiedz(pytanie);
    podpowiedz.dataset.zuzyta = "false";
}

function pokazWyjasnieniePoprawnejOdpowiedzi(pytanie, odpowiedziDiv) {
    const stare = document.getElementById("wyjasnienie-odpowiedzi");
    if (stare) stare.remove();

    const poprawna = escapeHtml(pytanie.odpowiedzi[pytanie.prawidlowa]);
    const wyjasnienie = escapeHtml(wygenerujWyjasnienieOdpowiedzi(pytanie));
    const wzor = formatujWzor(pytanie.wzor);

    const box = document.createElement("div");
    box.id = "wyjasnienie-odpowiedzi";
    box.className = "wyjasnienie-odpowiedzi";
    box.innerHTML = `
        <div class="wyjasnienie-tytul">✓ Dlaczego ta odpowiedź jest poprawna?</div>
        <div class="wyjasnienie-poprawna"><strong>Poprawna odpowiedź:</strong> ${poprawna}</div>
        ${wzor ? `<div class="wyjasnienie-wzor">${wzor}</div>` : ""}
        <div class="wyjasnienie-rozwiazanie">
            <strong>Wyjaśnienie:</strong>
            <p>${wyjasnienie}</p>
        </div>
        <div class="wyjasnienie-uwaga">Podpowiedź ma naprowadzić Cię przed odpowiedzią. To wyjaśnienie ma pokazać, <strong>dlaczego</strong> wynik jest poprawny.</div>
        <button type="button" class="przycisk-nastepnego-pytania" id="przycisk-nastepnego-pytania">Następne pytanie →</button>
    `;
    odpowiedziDiv.insertAdjacentElement("afterend", box);
    document.getElementById("przycisk-nastepnego-pytania").addEventListener("click", () => {
        aktualnaPytanieIndex++;
        showQuestion();
    });
}

function zapiszGwiazdki() {
    // Lokalny zapis jest tylko pamięcią interfejsu. Prawdziwe zużycie gwiazdki wykonuje runTransaction().
    gwiazdkiUcznia = Math.max(0, Math.round(gwiazdkiUcznia));
    magazynDanych().setItem(`fizyka-gwiazdki-${aktywnyUzytkownik}`, String(gwiazdkiUcznia));
    document.querySelectorAll(".gwiazdki-ucznia").forEach(el => el.textContent = gwiazdkiUcznia);
}

function pokazGwiazdki() {
    document.querySelectorAll(".gwiazdki-ucznia").forEach(el => el.textContent = gwiazdkiUcznia);
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

function escapeHtml(tekst) {
    return String(tekst ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatujWzor(wzor) {
    if (!wzor) return "";
    let html = escapeHtml(oczyscTekstPodpowiedzi(wzor));
    html = html
        .replace(/⃗/g, "→")
        .replace(/\_\{([^}]+)\}/g, "<sub>$1</sub>")
        .replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>")
        .replace(/([A-Za-zΔθωΩ])_([A-Za-z0-9]+)/g, "$1<sub>$2</sub>")
        .replace(/\^([0-9]+)/g, "<sup>$1</sup>")
        .replace(/\bpi\b/g, "π")
        .replace(/\bDelta\b/g, "Δ")
        .replace(/\btheta\b/g, "θ")
        .replace(/\bomega\b/g, "ω")
        .replace(/\bsqrt\(([^)]+)\)/g, "√($1)")
        .replace(/\s+/g, " ")
        .replace(/\_+/g, "");
    return `<span class="wzor-matematyczny" aria-label="Wzór">${html}</span>`;
}

function wywnioskujDaneZPytania(pytanie) {
    const tekst = String(pytanie?.pytanie || "");
    const liczby = tekst.match(/(?:−|-)?\d+(?:[,.]\d+)?\s*(?:m\/s²|m\/s|m|s|N|kg|Hz|rad|km\/h|Ω|V|A)?/g) || [];
    return liczby.slice(0, 7).join(", ");
}

function wygenerujLepszaPodpowiedz(pytanie) {
    if (!pytanie) {
        return `<div class="podpowiedz-tresc"><div class="podpowiedz-tytul">💡 Podpowiedź</div><p>Przeczytaj treść jeszcze raz i zaznacz, jaka wielkość jest szukana.</p></div>`;
    }

    const wskazowka = oczyscTekstPodpowiedzi(pytanie.wskazowka || "");
    const kroki = wskazowka.split(/\n+/).map(t => t.trim()).filter(Boolean).slice(0, numerPoziomuUcznia() === 3 ? 4 : 3);
    const wzor = formatujWzor(pytanie.wzor);
    const poziom = numerPoziomuUcznia();
    const personalizacja = poziom === 1
        ? "Zaczniemy od rozpoznania danych i jednej zależności — bez przeskakiwania kroków."
        : poziom === 2
            ? "Spróbuj samodzielnie połączyć dane ze wzorem; jeśli utkniesz, kolejne kroki naprowadzą Cię dalej."
            : "Potraktuj to jak zadanie treningowe: najpierw wybierz model fizyczny, potem przekształć wzór i dopiero podstaw liczby.";

    return `<div class="podpowiedz-tresc">
        <div class="podpowiedz-tytul">💡 Podpowiedź dopasowana do poziomu: ${opisPoziomuDlaUcznia(poziom)}</div>
        <p class="podpowiedz-personalna">${escapeHtml(personalizacja)}</p>
        <div class="podpowiedz-blok podpowiedz-krok">
            <div class="podpowiedz-blok-etykieta">Jak podejść do tego zadania?</div>
            <ol class="podpowiedz-lista">${kroki.map((krok, i) => `<li><strong>Krok ${i + 1}:</strong> ${escapeHtml(krok)}</li>`).join("")}</ol>
        </div>
        ${wzor ? `<div class="podpowiedz-blok podpowiedz-wzor"><div class="podpowiedz-blok-etykieta">Zależność potrzebna w tym zadaniu</div>${wzor}</div>` : ""}
        <div class="podpowiedz-koniec">Podpowiedź prowadzi do rozwiązania, ale nie podaje poprawnej odpowiedzi.</div>
    </div>`;
}

document.getElementById("przycisk-podpowiedzi").addEventListener("click", () => {
    const podpowiedz = document.getElementById("podpowiedz-quizu");
    if (podpowiedz.dataset.zuzyta === "true") {
        podpowiedz.hidden = false;
        return;
    }

    // Tymczasowo podpowiedzi są całkowicie darmowe. Mechanizm gwiazdek
    // pozostaje zachowany i można go przywrócić razem z flagą powyżej.
    podpowiedz.dataset.zuzyta = "true";
    podpowiedz.innerHTML = wygenerujLepszaPodpowiedz(aktualnePytanie);
    podpowiedz.hidden = false;
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

function dodajPrzyciskZgloszenia(pytanie) {
    const stary = document.getElementById("zgloszenie-bledu-quizu");
    if (stary) stary.remove();
    const odpowiedziDiv = document.getElementById("quiz-odpowiedzi");
    if (!odpowiedziDiv) return;

    const wrapper = document.createElement("div");
    wrapper.id = "zgloszenie-bledu-quizu";
    wrapper.className = "zgloszenie-bledu-wrapper";
    wrapper.innerHTML = `
        <button type="button" class="przycisk-zglos-blad" id="przycisk-zglos-blad">⚑ Zgłoś błąd w tym pytaniu</button>
    `;
    odpowiedziDiv.insertAdjacentElement("afterend", wrapper);
    wrapper.querySelector("#przycisk-zglos-blad").addEventListener("click", () => otworzZgloszenieBledu(pytanie));
}

function otworzZgloszenieBledu(pytanie) {
    const dialog = document.getElementById("okno-zgloszenia-bledu");
    const textarea = document.getElementById("tresc-zgloszenia-bledu");
    const status = document.getElementById("status-zgloszenia-bledu");
    if (!dialog || !textarea) return;
    textarea.value = "";
    textarea.dataset.pytanie = pytanie?.pytanie || "";
    textarea.dataset.temat = aktualnyPodnagalek || "";
    status.textContent = "";
    status.className = "status-zgloszenia-bledu";
    zglaszanyBladWysylany = false;
    dialog.showModal();
    setTimeout(() => textarea.focus(), 50);
}

async function wyslijZgloszenieBledu() {
    if (zglaszanyBladWysylany) return;
    const textarea = document.getElementById("tresc-zgloszenia-bledu");
    const status = document.getElementById("status-zgloszenia-bledu");
    const dialog = document.getElementById("okno-zgloszenia-bledu");
    const tresc = String(textarea?.value || "").trim();
    if (tresc.length < 5) {
        status.textContent = "Napisz proszę trochę dokładniej, co jest nie tak.";
        status.className = "status-zgloszenia-bledu blad";
        return;
    }
    if (tresc.length > 1500) {
        status.textContent = "Zgłoszenie może mieć maksymalnie 1500 znaków.";
        status.className = "status-zgloszenia-bledu blad";
        return;
    }

    const uzytkownik = auth.currentUser;
    if (!uzytkownik) {
        status.textContent = "Nie udało się ustalić sesji. Odśwież stronę i spróbuj ponownie.";
        status.className = "status-zgloszenia-bledu blad";
        return;
    }

    zglaszanyBladWysylany = true;
    const przycisk = document.getElementById("wyslij-zgloszenie-bledu");
    if (przycisk) { przycisk.disabled = true; przycisk.textContent = "Wysyłanie…"; }
    status.textContent = "";

    try {
        await addDoc(collection(firestore, "zgloszenia"), {
            tresc,
            pytanie: String(textarea.dataset.pytanie || "").slice(0, 2000),
            dzial: String(aktualnyDzial || "").slice(0, 100),
            podtemat: String(textarea.dataset.temat || "").slice(0, 100),
            lekcja: String(aktualnaLekcja?.temat || aktualnyPakiet?.[0]?.temat || "").slice(0, 200),
            uid: uzytkownik.uid,
            anonimowe: Boolean(uzytkownik.isAnonymous),
            status: "nowe",
            utworzono: serverTimestamp()
        });
        status.textContent = "Dziękuję! Zgłoszenie zostało wysłane.";
        status.className = "status-zgloszenia-bledu sukces";
        textarea.value = "";
        setTimeout(() => dialog.close(), 900);
    } catch (error) {
        console.error("Nie udało się wysłać zgłoszenia błędu.", error);
        status.textContent = "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.";
        status.className = "status-zgloszenia-bledu blad";
        zglaszanyBladWysylany = false;
    } finally {
        if (przycisk) { przycisk.disabled = false; przycisk.textContent = "Wyślij zgłoszenie"; }
    }
}

document.getElementById("wyslij-zgloszenie-bledu")?.addEventListener("click", wyslijZgloszenieBledu);

// Koniec quizu
function endQuiz() {
    ustawPostep(aktualnyPakiet, 100);
    ustawWizualnyPostep(100);
    document.getElementById("quiz-pytanie").textContent = `Lekcja ukończona! Następna lekcja tego tematu jest już odblokowana. Masz ${wynikGracza} punktów.`;
    document.getElementById("quiz-odpowiedzi").innerHTML = "";
    document.getElementById("numer-pytania").textContent = "Koniec";
}

// Nawigacja Wstecz — centralna obsługa wszystkich ekranów.
function pokazEkran(ekranDoPokazania, ...ekranyDoUkrycia) {
    ekranyDoUkrycia.forEach(ekran => { if (ekran) ekran.style.display = "none"; });
    if (ekranDoPokazania) ekranDoPokazania.style.display = "block";
}

document.getElementById("powrot-do-lekcji")?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    pokazEkran(ekranLekcji, ekranQuizu, ekranPodnagalowkow, ekranDialow);
    if (aktualnyPodnagalek) wyswietlLekcje(aktualnyPodnagalek);
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("powrot-do-podnagalowkow")?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    pokazEkran(ekranPodnagalowkow, ekranLekcji, ekranQuizu, ekranDialow);
    if (aktualnyDzial) wyswietlPodnagalowki(aktualnyDzial);
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("powrot-do-dialow")?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    pokazEkran(ekranDialow, ekranPodnagalowkow, ekranLekcji, ekranQuizu);
    window.scrollTo({ top: 0, behavior: "smooth" });
});

if (window.location.hash === "#rejestracja") {
    document.getElementById("pokaz-rejestracje").click();
}

obserwujSesje();
