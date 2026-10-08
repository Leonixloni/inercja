/**
 * LEGACY / NIEAKTYWNY W INTERFEJSIE
 *
 * Aktualna aplikacja jest uruchamiana przez index.html -> script.js.
 * Treść pytań edytuj w curriculum.js oraz BANK_PYTAN_MATURALNYCH.js.
 */
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
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
    runTransaction,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import { auth, firestore, firebaseReady } from "./firebase.js";
import {
    baza,
    pulePytanDzialow,
    BANKI_JAKOSCI,
    WZORCE_SLABYCH_PYTAN,
    WZORCE_ABSURDALNYCH_ODPOWIEDZI,
    DODATKOWE_PYTANIA_TEMATYCZNE,
    REGULY_TEMATOW
} from "../data/curriculum.js";
import { APP_CONFIG, FEATURE_FLAGS } from "./config.js";
import { MISJE, POWIAZANE_OBSZARY } from "../data/missions.js";

// Tryb tymczasowy: system gwiazdek i misji pozostaje zapisany w kodzie oraz danych,
// ale jest niewidoczny na stronie. Przywrócenie: zmień na true.
if (!FEATURE_FLAGS.starsVisible) {
    document.documentElement.dataset.systemGwiazdki = "ukryty";
}

const gotowoscFirebase = firebaseReady;

// ─────────────────────────────────────────────────────────────────────────────
// DOM + runtime state
// ─────────────────────────────────────────────────────────────────────────────
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
let trybGoscia = sessionStorage.getItem(APP_CONFIG.guestSessionKey) === "true";
let aktywnyUzytkownik = trybGoscia ? "gosc" : localStorage.getItem(APP_CONFIG.activeUserKey) || "";
let wynikGracza = Number(magazynDanych().getItem(`fizyka-wynik-${aktywnyUzytkownik}`) || 0);
let gwiazdkiUcznia = Number(magazynDanych().getItem(`fizyka-gwiazdki-${aktywnyUzytkownik}`));
if (!Number.isFinite(gwiazdkiUcznia)) gwiazdkiUcznia = 5;
let poziomAdaptacyjny = 2;
let seriaPoprawnych = 0;
let seriaBlednych = 0;
let pokazanePytania = [];
let aktualnePytanie = null;
let zglaszanyBladWysylany = false;
let aktualnaLiczbaPytan = 10;
let rejestracjaWToku = false;
let kolejkaZapisuPostepu = Promise.resolve();
let zsynchronizowanyUzytkownik = "";
let aktywnaSynchronizacjaPostepu = null;
const kluczPostepuDoPrzeniesienia = APP_CONFIG.transferProgressKey;
const maksymalnePunkty = APP_CONFIG.maxScore;



// ─────────────────────────────────────────────────────────────────────────────
// Session + local persistence
// ─────────────────────────────────────────────────────────────────────────────
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
// ─────────────────────────────────────────────────────────────────────────────
// Question selection + quality control
// ─────────────────────────────────────────────────────────────────────────────
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

function wzorzecDlaTematu(temat) { return REGULY_TEMATOW.find(([r]) => r.test(temat))?.[1] || new RegExp(temat.split(/\s+/).filter(x => x.length > 3).slice(0, 3).join("|"), "i"); }
function pytaniePasujeDoTematu(zadanie, temat) { const tekst = `${zadanie?.pytanie || ""} ${zadanie?.wzor || ""}`; return wzorzecDlaTematu(temat).test(tekst); }



function zbierzPytaniaDlaLekcji(dzialKlucz, temat, oryginalne) {
    const pula = []; const widziane = new Set();
    const dodaj = zadanie => { if (!pytanieJestDobre(zadanie)) return; const klucz = String(zadanie.pytanie).trim().toLowerCase(); if (!widziane.has(klucz)) { widziane.add(klucz); pula.push({...zadanie}); } };
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

// ─────────────────────────────────────────────────────────────────────────────
// Profile + account UI
// ─────────────────────────────────────────────────────────────────────────────
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
    localStorage.setItem(APP_CONFIG.activeUserKey, aktywnyUzytkownik);
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

// ─────────────────────────────────────────────────────────────────────────────
// Missions + rewards
// ─────────────────────────────────────────────────────────────────────────────
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
    sessionStorage.setItem(APP_CONFIG.guestSessionKey, "true");
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

// ─────────────────────────────────────────────────────────────────────────────
// Learning flow
// ─────────────────────────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────────────────────────
// Quiz engine
// ─────────────────────────────────────────────────────────────────────────────
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
    if (aktualnePytania.length < 10 && aktualnyPodnagalek !== "kinematyka") {
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
    const stareWyjasnienie = document.getElementById("wyjasnienie-odpowiedzi");
    if (stareWyjasnienie) stareWyjasnienie.remove();
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
    const wskazowka = String(pytanie.wskazowka || "").trim();
    const wzor = formatujWzor(pytanie.wzor);

    const box = document.createElement("div");
    box.id = "wyjasnienie-odpowiedzi";
    box.className = "wyjasnienie-odpowiedzi";
    box.innerHTML = `
        <div class="wyjasnienie-tytul">✓ Dlaczego to jest poprawna odpowiedź?</div>
        <div class="wyjasnienie-poprawna"><strong>Poprawna odpowiedź:</strong> ${poprawna}</div>
        ${wzor ? `<div class="wyjasnienie-wzor">${wzor}</div>` : ""}
        ${wskazowka ? `<p>${escapeHtml(wskazowka)}</p>` : `<p>Ta odpowiedź wynika bezpośrednio z zależności opisanej w treści zadania.</p>`}
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
    const kroki = wskazowka.split(/\n+/).map(t => t.trim()).filter(Boolean).slice(0, 3);
    const wzor = formatujWzor(pytanie.wzor);

    return `<div class="podpowiedz-tresc">
        <div class="podpowiedz-tytul">💡 Podpowiedź do tego pytania</div>
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

// ─────────────────────────────────────────────────────────────────────────────
// Feedback / error reporting
// ─────────────────────────────────────────────────────────────────────────────
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
