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
    runTransaction,
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
let aktualnaLiczbaPytan = 10;
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
    { id: "social", ikona: "📣", nazwa: "Wesprzyj Inercję", opis: "Zaobserwuj oficjalny profil Inercji w mediach społecznościowych i zgłoś wykonanie misji. To misja deklaratywna — bez integracji z API platformy nie da się automatycznie potwierdzić obserwowania.", nagroda: 1, typ: "spoleczna" }
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
        "nazwa": "Termodynamika",
        "podnagalowki": {
            "temperatura": [
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
                }
            ],
            "energia": [
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
                }
            ],
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
            "przemiany_i_energia": [
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
            ]
        }
    },
    "mechanika": {
        "emoji": "🏃",
        "nazwa": "Mechanika",
        "podnagalowki": {
            "kinematyka": [
                {
                    "temat": "Ruch jednostajny prostoliniowy",
                    "quiz": [
                        {
                            "pytanie": "Jak definiuje się prędkość w ruchu jednostajnym?",
                            "odpowiedzi": [
                                "Stała",
                                "Zmienna",
                                "Zerowa"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Ruch jednostajnie przyspieszony",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej opisuje przyspieszenie jako zmianę wektora prędkości w czasie?",
                            "odpowiedzi": [
                                "Zmiana prędkości w czasie",
                                "Szybkość",
                                "Siła"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Prędkość i przyspieszenie",
                    "quiz": [
                        {
                            "pytanie": "Która jednostka SI opisuje przyspieszenie?",
                            "odpowiedzi": [
                                "m/s²",
                                "m/s",
                                "m"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Wykresy ruchu",
                    "quiz": [
                        {
                            "pytanie": "Na wykresie v(t) pole pod wykresem w przedziale czasu odpowiada:",
                            "odpowiedzi": [
                                "Przemieszczeniu",
                                "Przyspieszeniu",
                                "Masie"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Co oznacza pozioma linia powyżej zera na wykresie a(t)?",
                            "odpowiedzi": [
                                "Stałe dodatnie przyspieszenie",
                                "Stałą drogę",
                                "Brak ruchu"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Co oznacza pozioma linia na wykresie s(t) dla ruchu ciała?",
                            "odpowiedzi": [
                                "Spoczywa",
                                "Ma stałe przyspieszenie",
                                "Porusza się coraz szybciej"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Ruch względny",
                    "quiz": []
                },
                {
                    "temat": "Droga, prędkość i czas",
                    "quiz": []
                },
                {
                    "temat": "Opóźnienie i hamowanie",
                    "quiz": []
                },
                {
                    "temat": "Ruch jednostajny",
                    "quiz": [
                        {
                            "pytanie": "Ciało przebywa 150 m w 12 s. Jaka jest jego prędkość?",
                            "odpowiedzi": [
                                "12,5 m/s",
                                "1,25 m/s",
                                "1800 m/s"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Co fizycznie oznacza nachylenie prostej na wykresie s(t) w ruchu jednostajnym?",
                            "odpowiedzi": [
                                "Prędkość",
                                "Masę",
                                "Siłę"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Pojazd jedzie 20 m/s przez 30 s. Jaką drogę pokona?",
                            "odpowiedzi": [
                                "600 m",
                                "60 m",
                                "150 m"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Ruch przyspieszony",
                    "quiz": [
                        {
                            "pytanie": "Prędkość wzrosła z 4 do 16 m/s w 6 s. Jakie jest średnie przyspieszenie?",
                            "odpowiedzi": [
                                "2 m/s²",
                                "12 m/s²",
                                "20 m/s²"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Ciało startuje z v0=2 m/s i a=3 m/s². Jaka będzie prędkość po 4 s?",
                            "odpowiedzi": [
                                "14 m/s",
                                "12 m/s",
                                "5 m/s"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaki kształt ma wykres v(t) w ruchu jednostajnie przyspieszonym?",
                            "odpowiedzi": [
                                "Prostej o stałym nachyleniu",
                                "Okręgu",
                                "Poziomej krzywej zawsze"
                            ],
                            "prawidlowa": 0
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
            "statyka": [
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
                }
            ],
            "ruch_obrotowy": [
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
                    "temat": "Ruch po okręgu",
                    "quiz": [
                        {
                            "pytanie": "Punkt porusza się po okręgu o promieniu 0,5 m z ω = 4 rad/s. Oblicz prędkość liniową.",
                            "odpowiedzi": [
                                "2 m/s",
                                "8 m/s",
                                "0,125 m/s"
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
            "mechanika_plynow": [
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
            "dynamika_i_statyka": [
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
                    "temat": "Tarcie",
                    "quiz": [
                        {
                            "pytanie": "Ciało 5 kg porusza się po poziomej powierzchni. μ=0,2, g=10 m/s². Siła tarcia wynosi:",
                            "odpowiedzi": [
                                "10 N",
                                "2 N",
                                "50 N"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jeśli siła nacisku wzrośnie dwukrotnie, a μ pozostanie stałe, tarcie kinetyczne:",
                            "odpowiedzi": [
                                "Wzrośnie dwukrotnie",
                                "Zmniejszy się dwukrotnie",
                                "Nie zmieni się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Współczynnik tarcia jest:",
                            "odpowiedzi": [
                                "Bezjednostkowy",
                                "Podawany w niutonach",
                                "Podawany w paskalach"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Równowaga i moment siły",
                    "quiz": [
                        {
                            "pytanie": "Siła 10 N działa prostopadle do ramienia 0,4 m. Moment siły wynosi:",
                            "odpowiedzi": [
                                "4 N·m",
                                "25 N·m",
                                "0,04 N·m"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Dźwignia jest w równowadze, gdy momenty sił względem osi są:",
                            "odpowiedzi": [
                                "Równe co do wartości i przeciwne zwrotem",
                                "Zawsze dodatnie",
                                "Zawsze równe zeru osobno"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Wydłużenie ramienia siły 2 razy przy tej samej sile powoduje moment:",
                            "odpowiedzi": [
                                "2 razy większy",
                                "2 razy mniejszy",
                                "Bez zmiany"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                }
            ],
            "grawitacja_i_plyny": [
                {
                    "temat": "Grawitacja",
                    "quiz": [
                        {
                            "pytanie": "Odległość między dwiema masami wzrasta z r do 2r. Siła grawitacji:",
                            "odpowiedzi": [
                                "Maleje 4 razy",
                                "Maleje 2 razy",
                                "Rośnie 4 razy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Masa ciała 5 kg przy g=10 m/s². Jaki jest jego ciężar?",
                            "odpowiedzi": [
                                "50 N",
                                "5 N",
                                "500 N"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Co dzieje się z siłą grawitacji, gdy jedna z mas zostaje podwojona?",
                            "odpowiedzi": [
                                "Rośnie 2 razy",
                                "Maleje 2 razy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
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
                }
            ]
        }
    },
    "elektromagnetyzm": {
        "emoji": "⚡",
        "nazwa": "Elektromagnetyzm",
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
            "prad": [
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
                }
            ],
            "magnetyzm": [
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
            ]
        }
    },
    "fale_drgania": {
        "emoji": "〰️",
        "nazwa": "Fale i Drgania",
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
            "optyka_falowa": [
                {
                    "temat": "Interferencja światła",
                    "quiz": [
                        {
                            "pytanie": "Jaki efekt może wystąpić, gdy dwie fale świetlne spotykają się w tej samej fazie?",
                            "odpowiedzi": [
                                "Wzmocnienie",
                                "Zawsze wygaszenie",
                                "Zmiana prędkości w próżni"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaki warunek różnicy dróg odpowiada wzmocnieniu w doświadczeniu z dwiema szczelinami?",
                            "odpowiedzi": [
                                "Całkowitej wielokrotności λ",
                                "Zawsze λ/4",
                                "Tylko 1 m"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaką właściwość światła potwierdza występowanie interferencji?",
                            "odpowiedzi": [
                                "Falowej natury",
                                "Wyłącznie cząstkowej natury",
                                "Braku energii"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Dyfrakcja",
                    "quiz": [
                        {
                            "pytanie": "Które stwierdzenie najlepiej opisuje zjawisko dyfrakcji?",
                            "odpowiedzi": [
                                "Ugięcie fali przy przeszkodzie",
                                "Odbicie fali",
                                "Pochłanianie fali"
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
            ]
        }
    },
    "optyka": {
        "emoji": "💡",
        "nazwa": "Optyka",
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
                    "temat": "Odbicie światła",
                    "quiz": [
                        {
                            "pytanie": "Promień pada pod kątem 35° do normalnej. Kąt odbicia wynosi:",
                            "odpowiedzi": [
                                "35°",
                                "55°",
                                "70°"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Kąt padania mierzy się względem:",
                            "odpowiedzi": [
                                "Normalnej do powierzchni",
                                "Samej powierzchni",
                                "Kierunku pionowego zawsze"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "W lustrze płaskim obraz jest:",
                            "odpowiedzi": [
                                "Pozorny i tej samej wielkości",
                                "Rzeczywisty i pomniejszony",
                                "Zawsze odwrócony do góry nogami"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Załamanie światła",
                    "quiz": [
                        {
                            "pytanie": "Światło przechodzi z powietrza do szkła. Jego prędkość:",
                            "odpowiedzi": [
                                "Maleje",
                                "Rośnie",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Przy przejściu światła do ośrodka o większym współczynniku załamania kąt względem normalnej zwykle:",
                            "odpowiedzi": [
                                "Maleje",
                                "Rośnie",
                                "Staje się 90°"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Częstotliwość światła przy przejściu między ośrodkami:",
                            "odpowiedzi": [
                                "Pozostaje taka sama",
                                "Zawsze maleje 2 razy",
                                "Rośnie do nieskończoności"
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
            "soczewki": [
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
                }
            ],
            "optyka_falowa": [
                {
                    "temat": "Interferencja światła",
                    "quiz": [
                        {
                            "pytanie": "Jaki efekt może wystąpić, gdy dwie fale świetlne spotykają się w tej samej fazie?",
                            "odpowiedzi": [
                                "Wzmocnienie",
                                "Zawsze wygaszenie",
                                "Zmiana prędkości w próżni"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaki warunek różnicy dróg odpowiada wzmocnieniu w doświadczeniu z dwiema szczelinami?",
                            "odpowiedzi": [
                                "Całkowitej wielokrotności λ",
                                "Zawsze λ/4",
                                "Tylko 1 m"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaką właściwość światła potwierdza występowanie interferencji?",
                            "odpowiedzi": [
                                "Falowej natury",
                                "Wyłącznie cząstkowej natury",
                                "Braku energii"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Dyfrakcja światła",
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
                },
                {
                    "temat": "Polaryzacja",
                    "quiz": [
                        {
                            "pytanie": "Dla jakiego rodzaju fal charakterystyczne jest zjawisko polaryzacji?",
                            "odpowiedzi": [
                                "Poprzecznych",
                                "Wyłącznie podłużnych",
                                "Nieprzenoszących energii"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Światło niespolaryzowane przechodzące przez idealny polaryzator ma średnio natężenie:",
                            "odpowiedzi": [
                                "Około połowy początkowego",
                                "Takie samo zawsze",
                                "Zero zawsze"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jaką właściwość światła potwierdza zjawisko polaryzacji?",
                            "odpowiedzi": [
                                "Poprzeczny charakter fali elektromagnetycznej",
                                "Brak pola elektrycznego",
                                "Cząstkowość bez fali"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                }
            ]
        }
    },
    "mechanika_kwantowa_jadrowa": {
        "emoji": "⚛️",
        "nazwa": "Mechanika Kwantowa i Fizyka Jądrowa",
        "podnagalowki": {
            "podstawy_kwantowe": [
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
                }
            ],
            "kwanty": [
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
                },
                {
                    "temat": "Nieoznaczoność",
                    "quiz": [
                        {
                            "pytanie": "Jeśli niepewność położenia maleje, minimalna niepewność pędu:",
                            "odpowiedzi": [
                                "Rośnie",
                                "Maleje do zera",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zasada nieoznaczoności dotyczy między innymi pary:",
                            "odpowiedzi": [
                                "Położenie–pęd",
                                "Masa–ładunek",
                                "Temperatura–barwa"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Zasada nieoznaczoności jest własnością:",
                            "odpowiedzi": [
                                "Układów kwantowych",
                                "Tylko ciał makroskopowych",
                                "Tylko gazów"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                }
            ],
            "energia_jadrowa": [
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
            ]
        }
    },
    "teoria_wzglednosci": {
        "emoji": "🚀",
        "nazwa": "Teoria Względności",
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
                }
            ],
            "ogolna": [
                {
                    "temat": "Grawitacja",
                    "quiz": [
                        {
                            "pytanie": "Odległość między dwiema masami wzrasta z r do 2r. Siła grawitacji:",
                            "odpowiedzi": [
                                "Maleje 4 razy",
                                "Maleje 2 razy",
                                "Rośnie 4 razy"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Masa ciała 5 kg przy g=10 m/s². Jaki jest jego ciężar?",
                            "odpowiedzi": [
                                "50 N",
                                "5 N",
                                "500 N"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Co dzieje się z siłą grawitacji, gdy jedna z mas zostaje podwojona?",
                            "odpowiedzi": [
                                "Rośnie 2 razy",
                                "Maleje 2 razy",
                                "Nie zmienia się"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
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
                }
            ],
            "szczegolna_teoria_wzglednosci": [
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
            "ogolna_teoria_wzglednosci": [
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
                    "temat": "Czarne dziury",
                    "quiz": [
                        {
                            "pytanie": "Granicą czarnej dziury, zza której światło nie może uciec, jest:",
                            "odpowiedzi": [
                                "Horyzont zdarzeń",
                                "Osobliwość",
                                "Dysk akrecyjny"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Promień Schwarzschilda zależy między innymi od:",
                            "odpowiedzi": [
                                "Masy obiektu",
                                "Koloru obiektu",
                                "Temperatury powietrza"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Materia spadająca do czarnej dziury może tworzyć:",
                            "odpowiedzi": [
                                "Dysk akrecyjny",
                                "Tęczę w próżni",
                                "Lodową skorupę zawsze"
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
            ]
        }
    },
    "fizyka_materialow": {
        "emoji": "🧪",
        "nazwa": "Fizyka Materiałów",
        "podnagalowki": {
            "struktury_krystaliczne": [
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
                }
            ],
            "wlasciwosci": [
                {
                    "temat": "Twardość materiału",
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
                    "temat": "Przewodnictwo",
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
                }
            ],
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
                            "pytanie": "Jeśli minerał A rysuje minerał B, to A jest:",
                            "odpowiedzi": [
                                "Twardszy",
                                "Miększy",
                                "Zawsze bardziej sprężysty"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Wytrzymałość na rozciąganie opisuje odporność na:",
                            "odpowiedzi": [
                                "Zerwanie podczas rozciągania",
                                "Przewodzenie ciepła",
                                "Magnesowanie"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Twardość i wytrzymałość to:",
                            "odpowiedzi": [
                                "Różne właściwości materiału",
                                "Dokładnie to samo",
                                "Jednostki energii"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                },
                {
                    "temat": "Przewodnictwo elektryczne",
                    "quiz": [
                        {
                            "pytanie": "Metale dobrze przewodzą prąd głównie dzięki:",
                            "odpowiedzi": [
                                "Swobodnym elektronom",
                                "Swobodnym protonom",
                                "Brakowi elektronów"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Jednostką przewodności elektrycznej jest:",
                            "odpowiedzi": [
                                "S/m",
                                "Ω/m²",
                                "J/C"
                            ],
                            "prawidlowa": 0
                        },
                        {
                            "pytanie": "Półprzewodnik ma przewodnictwo zwykle:",
                            "odpowiedzi": [
                                "Pośrednie między izolatorem a dobrym przewodnikiem",
                                "Zawsze większe od miedzi",
                                "Zawsze równe zeru"
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
            ]
        }
    },
    "astronomia": {
        "emoji": "🌌",
        "nazwa": "Astronomia",
        "podnagalowki": {
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
            "ruchy_orbitalne": [
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
                    "temat": "Gravitacja",
                    "quiz": [
                        {
                            "pytanie": "Prawo powszechnej grawitacji to:",
                            "odpowiedzi": [
                                "F = Gm₁m₂/r²",
                                "F = m·a",
                                "F = k·x"
                            ],
                            "prawidlowa": 0
                        }
                    ]
                }
            ],
            "uklad_sloneczny": [
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
                    "temat": "Grawitacja w astronomii",
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
            "gwiazdy_i_galaktyki": [
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
            "obserwacje_i_kosmologia": [
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
            ]
        }
    }
};;

// Wszystkie działy pozostają dostępne na mapie. Nie usuwamy żadnej istniejącej ścieżki z bazy.
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
baza.fale_drgania.podnagalowki.fale_elektromagnetyczne = [
    { temat: "Widmo elektromagnetyczne", quiz: [] },
    { temat: "Polaryzacja światła", quiz: [] },
    { temat: "Efekt Dopplera", quiz: [] }
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
    if (/(gwiazd|planet|kepler|galakty|wszechświat|widm|astronom|kosmolog|orbita|czarne dziur)/.test(t)) return "astronomia";
    if (/(odbici|załam|soczew|zwierciad|optycz|oko|polaryzacj|światł)/.test(t)) return "optyka";
    if (/(fala|drgan|dźwięk|doppler|interferencj|dyfrakcj|częstotliwość|amplitud|okres)/.test(t)) return "fale_drgania";
    if (/(temperatur|ciepł|gaz|termodynam|energia wewnętrz|przemian)/.test(t)) return "termodynamika";
    if (/(ładunek|pole elektry|coulomba|prąd|napięcie|opór|ohm|moc.*prąd|kirchhoff|opornik|magnetycz|lorentza|indukcj)/.test(t)) return "elektromagnetyzm";
    return "mechanika";
}

function uzupelnijPodpowiedz(zadanie) {
    const pytanie = String(zadanie?.pytanie || "").trim();
    const wzor = String(zadanie?.wzor || "").trim();
    const istniejaca = String(zadanie?.wskazowka || "").trim();
    const tekst = `${pytanie} ${wzor}`.toLowerCase();
    const kroki = [];

    if (wzor) {
        kroki.push(`Zacznij od zależności: ${wzor}.`);
        kroki.push("Najpierw wypisz dane i wielkość szukaną, a dopiero potem przekształć wzór do szukanej wielkości.");
    }

    if (/v\s*[=]|prędkość|droga|czas|przyspieszenie|ruch/.test(tekst)) {
        kroki.push("Uważaj na jednostki czasu i prędkości; jeśli używasz SI, sprowadź sekundy, metry i m/s do wspólnego układu.");
    }
    if (/sił|newton|moment|pęd|energia kinetyczna|energia potencjalna|tarci/.test(tekst)) {
        kroki.push("Zastanów się najpierw, jaka wielkość jest przyczyną zmiany: siła wypadkowa, moment, praca czy energia. Nie podstawuj siły lub energii tylko dlatego, że pojawia się w treści.");
    }
    if (/kąt|odbici|załam|soczew|zwierciad|ognisk|polaryzacj/.test(tekst)) {
        kroki.push("Zrób mały szkic i zaznacz normalną, oś optyczną albo ognisko — zależnie od zadania. W optyce łatwo pomylić kąt względem normalnej z kątem względem powierzchni.");
    }
    if (/gaz|ciśn|temperatur|ciepł|topn|wrzen|termodynam/.test(tekst)) {
        kroki.push("Sprawdź, która wielkość pozostaje stała w opisanej przemianie. Przy gazie używaj temperatury bezwzględnej w kelwinach, a przy ΔT nie dodawaj 273.");
    }
    if (/fala|drgan|dźwięk|częstotliwość|amplitud|doppler|dyfrakcj|interferencj/.test(tekst)) {
        kroki.push("Oddziel częstotliwość od amplitudy: częstotliwość decyduje m.in. o okresie i wysokości tonu, a amplituda o energii/intensywności. Dla fali sprawdź też relację v = λf.");
    }
    if (/ładunek|prąd|napięcie|opór|ohm|moc|kirchhoff|indukcj|magnetycz|coulomb/.test(tekst)) {
        kroki.push("Ustal kierunek prądu i biegunowość napięcia, a przy obwodzie rozdziel gałęzie. Potem wybierz prawo Ohma, moc, Kirchhoffa albo indukcję — zależnie od tego, czego szukasz.");
    }
    if (/grawitac|orbita|kepler|planeta|gwiazd|galakty|wszechświat|kosm/.test(tekst)) {
        kroki.push("Sprawdź, czy porównujesz siłę, okres, odległość czy jasność obserwowaną. W zależnościach potęgowych zwróć uwagę, czy odległość występuje w mianowniku i w jakiej potędze.");
    }

    if (istniejaca) {
        // Zachowujemy merytoryczną wskazówkę autora pytania, ale dokładamy konkretny plan działania.
        const bezWzor = wzor && istniejaca.endsWith(wzor) ? istniejaca.slice(0, -wzor.length).trim() : istniejaca;
        kroki.unshift(bezWzor);
    }

    if (!kroki.length) {
        kroki.push("Najpierw nazwij wielkość, której szukasz, i wypisz wszystkie dane z jednostkami.");
        kroki.push("Następnie wybierz prawo fizyczne, które łączy te wielkości. Sprawdź sens fizyczny odpowiedzi, zanim zaznaczysz wariant.");
    }

    const lista = kroki.slice(0, 4).map((krok, index) => `<li><strong>Krok ${index + 1}:</strong> ${krok}</li>`).join("");
    const wzorHTML = wzor ? `<div class="wzor-podpowiedzi"><strong>Wzór / zależność:</strong> <code>${wzor}</code></div>` : "";
    return `<div class="podpowiedz-tresc"><strong>💡 Podpowiedź — prowadzi do rozwiązania, ale nie zdradza odpowiedzi</strong>${wzorHTML}<ol>${lista}</ol><div class="kontrola-podpowiedzi"><strong>Na koniec:</strong> sprawdź jednostkę wyniku i czy jego kierunek / znak / rząd wielkości ma sens fizyczny.</div></div>`;
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
function wzorzecDlaTematu(temat) { return REGULY_TEMATOW.find(([r]) => r.test(temat))?.[1] || new RegExp(temat.split(/\s+/).filter(x => x.length > 3).slice(0, 3).join("|"), "i"); }
function pytaniePasujeDoTematu(zadanie, temat) { const tekst = `${zadanie?.pytanie || ""} ${zadanie?.wzor || ""}`; return wzorzecDlaTematu(temat).test(tekst); }



function zbierzPytaniaDlaLekcji(dzialKlucz, temat, oryginalne) {
    const pula = []; const widziane = new Set();
    const dodaj = zadanie => { if (!pytanieJestDobre(zadanie)) return; const klucz = String(zadanie.pytanie).trim().toLowerCase(); if (!widziane.has(klucz)) { widziane.add(klucz); pula.push({...zadanie}); } };
    oryginalne.forEach(dodaj);
    Object.values(baza).forEach(dzial => Object.values(dzial.podnagalowki || {}).forEach(lekcje => lekcje.filter(l => l.temat === temat).forEach(l => (l.quiz || []).forEach(dodaj))));
    (DODATKOWE_PYTANIA_TEMATYCZNE[temat] || []).forEach(dodaj);
    if (dzialKlucz === "mechanika" && /płyn|hydrostatycz|Archimed|Bernoulli/i.test(temat)) {
        (DODATKOWE_PYTANIA_TEMATYCZNE["Mechanika płynów"] || []).forEach(dodaj);
    }
    const bank = BANKI_JAKOSCI[dzialKlucz] || [];
    bank.filter(q => pytaniePasujeDoTematu(q, temat)).forEach(dodaj);
    (pulePytanDzialow[dzialKlucz] || []).filter(q => pytaniePasujeDoTematu(q, temat)).forEach(dodaj);

    return pula;
}

Object.values(baza).forEach(dzial => Object.entries(dzial.podnagalowki).forEach(([podklucz, lekcje]) => {
    const dzialKlucz = Object.keys(baza).find(k => baza[k] === dzial) || dzialDlaTematu(lekcje[0]?.temat || "");
    // Najpierw budujemy bank dla każdego konkretnego tematu. Nie dopuszczamy pytań z innych działów.
    lekcje.forEach(lekcja => {
        const pula = zbierzPytaniaDlaLekcji(dzialKlucz, lekcja.temat, lekcja.quiz || []);
        lekcja.quiz = pula.slice(0, 14).map((q, i) => ({...q, tematZrodlowy: lekcja.temat, poziom: q.poziom || (i < 4 ? 1 : i < 9 ? 2 : 3), wskazowka: uzupelnijPodpowiedz(q)}));
    });
}));

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
                    <p>Otwórz panel „🎯 Misje”. Możesz zdobywać gwiazdki m.in. za ukończenie pierwszej lekcji, ukończenie kilku lekcji, zdobycie 100 punktów oraz serię poprawnych odpowiedzi. Dostępna jest też misja społecznościowa związana z obserwowaniem Inercji. Łącznie możesz mieć maksymalnie 5 ⭐, a każdą misję można odebrać tylko raz.</p>
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
    const gwiazdki = gwiazdkiPierwsze === null
        ? (gwiazdkiDrugie === null ? 5 : gwiazdkiDrugie)
        : (gwiazdkiDrugie === null ? gwiazdkiPierwsze : Math.min(gwiazdkiPierwsze, gwiazdkiDrugie));

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
    if (misja.typ !== "spoleczna" && !misjaSpelnionaLokalnie(misja)) {
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
            const aktualne = Math.max(0, Math.min(5, Number(postep.gwiazdki) || 0));
            const nowe = Math.min(5, aktualne + misja.nagroda);
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
        else if (e?.message === "BRAK_POSTEPU") alert("Najpierw otwórz profil ucznia i zsynchronizuj postęp.");
        else { console.error(e); alert("Nie udało się odebrać nagrody. Spróbuj ponownie."); }
    }
}

async function pokazMisje() {
    const dialog = document.getElementById("okno-misji");
    const lista = document.getElementById("lista-misji");
    if (!dialog || !lista) return;
    const zalogowany = !trybGoscia && auth.currentUser && !auth.currentUser.isAnonymous;
    if (!zalogowany) {
        lista.innerHTML = '<div class="misja-karta"><div class="misja-ikona">🔒</div><div><h3>Misje są dostępne po zalogowaniu</h3><p>Zaloguj się lub utwórz konto. Konto zaczyna z 5 ⭐, a podpowiedzi i nagrody z misji zapisują się na Twoim profilu.</p></div></div>';
    } else {
        const wykonane = await pobierzWykonaneMisje();
        lista.innerHTML = MISJE.map(misja => {
            const gotowa = misjaSpelnionaLokalnie(misja) || misja.typ === "spoleczna";
            const odebrana = wykonane.has(misja.id);
            return `<article class="misja-karta"><div class="misja-ikona">${misja.ikona}</div><div><h3>${misja.nazwa}</h3><p>${misja.opis}</p><div class="misja-akcja">${odebrana ? '<span class="misja-wykonana">✓ Nagroda odebrana</span>' : gotowa ? `<button type="button" data-misja="${misja.id}">Odbierz +${misja.nagroda} ⭐</button>` : '<span>Jeszcze nieukończona</span>'}</div></div><div class="misja-nagroda">+${misja.nagroda} ⭐</div></article>`;
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
        szkola: ["mechanika", "termodynamika", "elektromagnetyzm", "fale_drgania", "optyka", "astronomia", "mechanika_kwantowa_jadrowa", "fizyka_materialow", "teoria_wzglednosci"],
        ciekawosc: ["astronomia", "optyka", "fale_drgania", "mechanika", "termodynamika", "elektromagnetyzm", "teoria_wzglednosci", "mechanika_kwantowa_jadrowa", "fizyka_materialow"],
        praca: ["elektromagnetyzm", "mechanika", "termodynamika", "optyka", "fale_drgania", "fizyka_materialow", "astronomia", "teoria_wzglednosci", "mechanika_kwantowa_jadrowa"],
        inne: ["mechanika", "termodynamika", "elektromagnetyzm", "optyka", "fale_drgania", "astronomia", "fizyka_materialow", "mechanika_kwantowa_jadrowa", "teoria_wzglednosci"]
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
const POWIAZANE_OBSZARY = {
    mechanika: { statyka: ["statyka", "dynamika", "dynamika_i_statyka"], ruch_obrotowy: ["ruch_obrotowy", "dynamika_i_statyka"], grawitacja: ["grawitacja", "grawitacja_i_plyny"], mechanika_plynow: ["mechanika_plynow", "grawitacja_i_plyny"] },
    optyka: { przyrzady_optyczne: ["przyrzady_optyczne", "soczewki_i_przyrzady"], soczewki: ["soczewki", "soczewki_i_przyrzady"], optyka_falowa: ["optyka_falowa", "optyka_geometryczna"] },
    elektromagnetyzm: { prad: ["prad", "prad_i_obwody"], magnetyzm: ["magnetyzm", "magnetyzm_i_indukcja"], obwody_pradu: ["obwody_pradu", "prad_i_obwody"] },
    fale_drgania: { optyka_falowa: ["optyka_falowa", "fale_mechaniczne"], fale_elektromagnetyczne: ["fale_elektromagnetyczne", "optyka_falowa", "fale_mechaniczne"] },
    mechanika_kwantowa_jadrowa: { podstawy_kwantowe: ["podstawy_kwantowe", "kwanty"], fizyka_jadrowa: ["fizyka_jadrowa", "energia_jadrowa"], kwanty: ["kwanty", "podstawy_kwantowe"], energia_jadrowa: ["energia_jadrowa", "fizyka_jadrowa"] },
    teoria_wzglednosci: { szczegolna: ["szczegolna", "szczegolna_teoria_wzglednosci"], ogolna: ["ogolna", "ogolna_teoria_wzglednosci"] },
    fizyka_materialow: { struktury_krystaliczne: ["struktury_krystaliczne", "struktura_materii"], wlasciwosci: ["wlasciwosci", "wlasciwosci_materialow"] },
    termodynamika: { temperatura: ["temperatura", "temperatura_i_cieplo"], energia: ["energia", "przemiany_i_energia"], przemiany_gazowe: ["przemiany_gazowe", "przemiany_i_energia"] },
    astronomia: { ciala_niebieskie: ["ciala_niebieskie", "uklad_sloneczny"], ruchy_orbitalne: ["ruchy_orbitalne", "uklad_sloneczny"], uklad_sloneczny: ["uklad_sloneczny", "ruchy_orbitalne"], gwiazdy_i_galaktyki: ["gwiazdy_i_galaktyki", "obserwacje_i_kosmologia"], obserwacje_i_kosmologia: ["obserwacje_i_kosmologia", "gwiazdy_i_galaktyki"] }
};

function startQuiz(pakiet, przyciskLekcji) {
    aktualnyPakiet = pakiet;
    aktualnyPrzyciskLekcji = przyciskLekcji;
    aktualnaPytanieIndex = 0;
    poziomAdaptacyjny = 2;
    seriaPoprawnych = 0;
    seriaBlednych = 0;
    pokazanePytania = [];
    aktualnePytania = pakiet.flatMap(lekcja => lekcja.quiz.map(pytanie => ({ ...pytanie, pytanie: pytanie.pytanie })));
    // Każdy quiz ma minimum 10 pytań. Jeśli pojedyncza lekcja ma krótszy bank, dobieramy
    // wyłącznie z innych lekcji tego samego podtematu (tej samej mapy), nigdy z innego działu.
    if (aktualnePytania.length < 10) {
        const dzial = baza[aktualnyDzial];
        const juz = new Set(aktualnePytania.map(q => q.pytanie.trim().toLowerCase()));
        const podklucze = [aktualnyPodnagalek, ...(POWIAZANE_OBSZARY[aktualnyDzial]?.[aktualnyPodnagalek] || [])];
        podklucze.forEach(podklucz => {
            (dzial?.podnagalowki?.[podklucz] || []).forEach(lekcja => lekcja.quiz.forEach(q => {
                if (aktualnePytania.length >= 14) return;
                const k = q.pytanie.trim().toLowerCase();
                if (!juz.has(k)) { juz.add(k); aktualnePytania.push({ ...q, pytanie: q.pytanie }); }
            }));
        });
    }
    document.getElementById("temat-lekcji").textContent = pakiet[0].temat;
    aktualnePytania = wymieszaj([...aktualnePytania]);
    aktualnaLiczbaPytan = Math.min(12, aktualnePytania.length);
    if (aktualnaLiczbaPytan < 10) {
        console.warn("Quiz ma mniej niż 10 pytań:", pakiet.map(lekcja => lekcja.temat));
    }
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
    podpowiedz.innerHTML = `<div class="podpowiedz-tresc"><strong>💡 Podpowiedź krok po kroku</strong><p>Po wydaniu 1 ⭐ dostaniesz wskazanie <strong>co wypisać z treści</strong>, <strong>jaki wzór wybrać</strong>, <strong>jak go przekształcić</strong> oraz <strong>co sprawdzić na końcu</strong>. Nie pokażę gotowej odpowiedzi.</p></div>`;
    podpowiedz.dataset.zuzyta = "false";
}

function zapiszGwiazdki() {
    // Lokalny zapis jest tylko pamięcią interfejsu. Prawdziwe zużycie gwiazdki wykonuje runTransaction().
    gwiazdkiUcznia = Math.max(0, Math.min(5, Math.round(gwiazdkiUcznia)));
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

document.getElementById("przycisk-podpowiedzi").addEventListener("click", async () => {
    const podpowiedz = document.getElementById("podpowiedz-quizu");
    if (trybGoscia || auth.currentUser?.isAnonymous) {
        podpowiedz.textContent = "🔒 Podpowiedzi są dostępne tylko dla zalogowanych uczniów. Zaloguj się lub utwórz konto, aby korzystać z podpowiedzi za 1 ⭐.";
        podpowiedz.hidden = false;
        return;
    }
    if (podpowiedz.dataset.zuzyta === "true") { podpowiedz.hidden = false; return; }
    if (gwiazdkiUcznia < 1) {
        podpowiedz.innerHTML = "<strong>⭐ Brak gwiazdek.</strong><br>Masz 0 ⭐, więc ta podpowiedź nie może zostać odblokowana.";
        podpowiedz.hidden = false;
        return;
    }
    const uzytkownik = auth.currentUser;
    if (!uzytkownik || uzytkownik.isAnonymous || !aktywnyUzytkownik) return;
    try {
        // Gwiazdka jest zużywana atomowo w Firestore. Zmiana localStorage/DevTools nie wystarcza.
        const ref = doc(firestore, "postepy", uzytkownik.uid);
        const nowyStan = await runTransaction(firestore, async transaction => {
            const snap = await transaction.get(ref);
            if (!snap.exists()) throw new Error("BRAK_POSTEPU");
            const dane = snap.data();
            const aktualne = Math.max(0, Math.min(5, Number(dane.gwiazdki) || 0));
            if (aktualne < 1) throw new Error("BRAK_GWIAZDKI");
            const pozostalo = aktualne - 1;
            transaction.update(ref, { gwiazdki: pozostalo, zaktualizowano: serverTimestamp() });
            return pozostalo;
        });
        gwiazdkiUcznia = nowyStan;
        localStorage.setItem(`fizyka-gwiazdki-${aktywnyUzytkownik}`, String(gwiazdkiUcznia));
        pokazGwiazdki();
        podpowiedz.dataset.zuzyta = "true";
        podpowiedz.innerHTML = aktualnePytanie?.wskazowka || "<strong>💡 Podpowiedź</strong><br>Najpierw wypisz dane i szukaną wielkość. Następnie wybierz prawo fizyczne łączące te wielkości i przekształć wzór przed podstawieniem.";
        podpowiedz.hidden = false;
    } catch (error) {
        if (error?.message === "BRAK_GWIAZDKI") {
            gwiazdkiUcznia = 0;
            pokazGwiazdki();
            podpowiedz.innerHTML = "<strong>⭐ Brak gwiazdek.</strong><br>Na koncie nie ma już gwiazdek na tę podpowiedź.";
        } else {
            podpowiedz.innerHTML = "<strong>⚠️ Nie udało się pobrać gwiazdki.</strong><br>Podpowiedź nie została pokazana ani pobrana z konta. Spróbuj ponownie za chwilę.";
            console.error("Nie udało się atomowo zużyć gwiazdki.", error);
        }
        podpowiedz.hidden = false;
    }
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

if (window.location.hash === "#rejestracja") {
    document.getElementById("pokaz-rejestracje").click();
}

obserwujSesje();
