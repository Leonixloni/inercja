import {
    baza,
    pytaniaDlaTematu,
    pulePytanDzialow,
    BANKI_JAKOSCI,
    DODATKOWE_PYTANIA_TEMATYCZNE,
    REGULY_TEMATOW,
    ZASADY_DO_WYJASNIEN,
    DODATKOWE_ZADANIA_OBLICZENIOWE,
    OTWARTE_ZADANIA_MATURALNE,
    CONTENT_SCHEMA,
    uzupelnijPodpowiedz
} from "./question-bank.js";

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
            poziom: poziomPytania(q),
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
        poziom: poziomPytania(q),
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

function typZadania(q) {
    return q?.typ === "otwarte" ? "otwarte" : "zamkniete";
}

function pytanieSamodzielne(q) {
    const t = String(q?.pytanie || '').trim();
    if (!t || t.length < 25) return false;
    if (/^.*\.{3}$/.test(t)) return false;
    if (/\b(poprzednim|poprzedniego|powyżej|poniżej|jak wyżej|jak wcześniej|w poprzednim pytaniu|w następnym pytaniu)\b/i.test(t)) return false;

    if (typZadania(q) === "otwarte") {
        const wzorcowa = String(q?.odpowiedz || "").trim();
        const akceptowane = Array.isArray(q?.akceptowane) ? q.akceptowane : [];
        return Boolean(wzorcowa || akceptowane.length);
    }

    if (!Array.isArray(q.odpowiedzi) || q.odpowiedzi.length < 3 || q.prawidlowa == null) return false;
    return q.odpowiedzi.every(a => String(a ?? '').trim().length > 0);
}

function pytanieJestDobre(q) {
    if (!pytanieSamodzielne(q)) return false;
    if (typZadania(q) === "otwarte") return true;
    const odpowiedzi = q.odpowiedzi.map(a => String(a).trim().toLocaleLowerCase("pl"));
    return new Set(odpowiedzi).size === odpowiedzi.length;
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
    {r:/podstawy opisu ruchu/i, l1:(i)=>{const x0=20+i*5, x1=80+i*10; return mkQ(`Samochód znajduje się w chwili 0 s w punkcie x = ${x0} m, a w chwili ${5+i} s w punkcie x = ${x1} m. Co oznacza współrzędna x = ${x1} m?`,[`Położenie samochodu względem przyjętego początku układu odniesienia`,`Drogę przebytą przez samochód`,`Wartość jego przyspieszenia`],0,1,'x = x(t)','Współrzędna x opisuje położenie względem początku układu odniesienia.',`W chwili ${5+i} s samochód ma współrzędną x = ${x1} m, czyli znajduje się ${x1} m od początku przyjętego układu odniesienia.`,false)}, l2:(i)=>mkQ(`Punkt materialny zmienił współrzędną z x₁ = ${i+1} m do x₂ = ${i+7} m. Jakie jest jego przemieszczenie?`,[`${6} m`,`${i+7+i+1} m`,`${i+1} m`],0,2,'Δx = x₂ − x₁','Odejmij położenie początkowe od końcowego.',`Δx = ${i+7} − ${i+1} = 6 m.`,true), l3:(i)=>mkQ(`Ciało przemieściło się z x₁ = ${-4-i} m do x₂ = ${9+i} m, a następnie wróciło do x₃ = ${2+i} m. Oblicz całkowitą drogę i wartość przemieszczenia.`,[`${20+3*i} m i ${6+i} m`,`${13+2*i} m i ${6+i} m`,`${6+i} m i ${20+3*i} m`],0,3,'s = |x₂−x₁| + |x₃−x₂|; Δx = x₃−x₁','Policz osobno oba odcinki drogi, a na końcu przemieszczenie od startu do końca.',`Droga = ${13+2*i} + ${7+i} = ${20+3*i} m; przemieszczenie = ${6+i} m.`,true)},
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
function generujAwaryjnePytania(temat, poziom, start = 0) {
    const znalezione = znajdzFormuleAwaryjna(temat);
    const formula = znalezione?.[1] || '';
    const nazwa = znalezione?.[2] || temat;
    const out = [];

    const generic = GENERIC_WIEDZA.find(x => x.r.test(temat));
    if (generic && poziom === 1) {
        generic.facts.forEach(([pytanie, odpowiedzi, prawidlowa]) => {
            uniqPush(out, mkQ(pytanie, odpowiedzi, prawidlowa, 1, '',
                'Przeczytaj wszystkie odpowiedzi i wybierz tę, która opisuje zjawisko zgodnie z fizyką.',
                'Poprawna odpowiedź wynika bezpośrednio z definicji i własności opisywanego zjawiska.', false));
        });
    }

    // Dla tematów bez własnej fabryki nie tworzymy sztucznych „wariantów”.
    // Pytania zastępcze są pełnymi mini-zadaniami i zawsze odnoszą się do konkretnej sytuacji.
    const q1 = [
        `W temacie „${nazwa}” chcesz wyznaczyć wielkość opisaną zależnością ${formula || 'podstawową zależnością tego zagadnienia'}. Co należy zrobić jako pierwszy krok?`,
        `W zadaniu dotyczącym „${nazwa}” podano wszystkie wielkości potrzebne w zależności ${formula || 'właściwym dla tego zagadnienia'}. Co należy sprawdzić przed podstawieniem liczb?`,
        `Który zapis jest zgodny z fizycznym modelem używanym w temacie „${nazwa}”${formula ? `?  ${formula}` : '?'}`,
        `Uczeń rozwiązuje zadanie z tematu „${nazwa}”. Która czynność pomaga uniknąć błędu jednostek?`,
        `W zadaniu z tematu „${nazwa}” wynik ma być podany w jednostce SI. Co należy zrobić z danymi przed obliczeniami?`,
        `Co opisuje zależność ${formula || 'używana w tym zagadnieniu'} w kontekście tematu „${nazwa}”?`,
        `Który opis sytuacji jest zgodny z tematyką „${nazwa}”?`,
        `Dlaczego w zadaniu z tematu „${nazwa}” warto najpierw wypisać dane i szukaną wielkość?`,
        `Który krok rozwiązania zadania z tematu „${nazwa}” powinien poprzedzać podstawienie wartości liczbowych?`,
        `Które stwierdzenie najlepiej opisuje znaczenie zależności ${formula || 'używanej w tym zagadnieniu'}?`,
        `Jak sprawdzić, czy wynik zadania z tematu „${nazwa}” jest fizycznie sensowny?`,
        `Która informacja jest niezbędna, aby poprawnie zastosować zależność ${formula || 'właściwą dla tego zagadnienia'}?`
    ];
    const a1 = [
        ['Wypisać dane, szukaną wielkość i dobrać właściwy model fizyczny','Podstawić liczby do pierwszego znalezionego wzoru','Pominąć jednostki'],
        ['Czy jednostki wszystkich wielkości są ze sobą zgodne','Czy liczby wyglądają podobnie','Czy można pominąć jednostkę wyniku'],
        [formula || 'zależność opisująca dane zjawisko','dowolny wzór z tego działu','wzór niezwiązany z opisywanym zjawiskiem'],
        ['Sprowadzić dane do zgodnych jednostek','Zaokrąglić wszystkie liczby do jedności','Usunąć jednostki z obliczeń'],
        ['Przeliczyć wielkości na jednostki SI, jeśli jest to potrzebne','Zamienić wszystkie liczby na procenty','Usunąć jednostki z treści'],
        ['Łączy wielkości występujące w opisywanym zjawisku','Jest tylko skrótem bez znaczenia fizycznego','Dotyczy wyłącznie matematyki, a nie fizyki'],
        ['Sytuacja, w której obowiązują prawa i pojęcia tego tematu','Dowolna sytuacja niezależna od praw fizyki','Sytuacja wymagająca wyłącznie zgadywania'],
        ['Pozwala kontrolować, czy rozwiązanie odpowiada treści zadania','Nie ma wpływu na rozwiązanie','Służy tylko do zapisania odpowiedzi'],
        ['Zapisanie modelu lub wzoru wynikającego z danych','Losowe zaokrąglenie danych','Podanie wyniku bez obliczeń'],
        ['Opisuje zależność między wielkościami istotnymi dla tego zjawiska','Jest przypadkowym zestawieniem symboli','Zastępuje wszystkie prawa fizyki'],
        ['Sprawdzić jednostkę, znak i rząd wielkości wyniku','Sprawdzić wyłącznie ostatnią cyfrę','Porównać wynik z pierwszą odpowiedzią'],
        ['Wartości i jednostki wielkości występujących w modelu','Kolor przedmiotu','Imię osoby rozwiązującej zadanie']
    ];
    const wsk1 = 'Najpierw rozpoznaj dane i szukaną wielkość, potem wybierz model fizyczny i sprawdź jednostki.';
    const rozw1 = 'Poprawne rozwiązanie zaczyna się od właściwego modelu fizycznego. Dopiero potem podstawiamy dane i kontrolujemy jednostkę wyniku.';
    while (out.length < Math.min(MIN_PYTAN_NA_POZIOM, q1.length) && poziom === 1) {
        const i = out.length;
        uniqPush(out, mkQ(q1[i], a1[i], 0, 1, formula, wsk1, rozw1, false));
    }

    if (poziom === 2 || poziom === 3) {
        const cases = generujObliczenioweZFormuly(nazwa, formula, poziom, start);
        cases.forEach(q => uniqPush(out, q));
    }

    // Jeżeli temat nie ma jeszcze 12 pytań, dobieramy tylko pytania samodzielne,
    // nigdy pytania odwołujące się do poprzedniego zadania ani sztuczne numerowane warianty.
    if (out.length < MIN_PYTAN_NA_POZIOM) {
        const dodatkowe = [
            `W zadaniu z tematu „${nazwa}” otrzymano wynik z jednostką niezgodną z szukaną wielkością. Co należy zrobić?`,
            `W zadaniu z tematu „${nazwa}” zmieniono jedną z danych. Który krok należy wykonać ponownie?`,
            `Dlaczego w zadaniu z tematu „${nazwa}” warto zapisać wzór przed podstawieniem liczb?`,
            `Która kontrola wyniku jest najbardziej użyteczna w zadaniu z tematu „${nazwa}”?`
        ];
        const odp = [
            ['Sprawdzić przekształcenie wzoru i jednostki','Uznać wynik za poprawny mimo złej jednostki','Usunąć jednostkę z odpowiedzi'],
            ['Przeliczyć rozwiązanie z nową wartością','Zostawić stare obliczenia bez zmian','Pominąć zmianę danych'],
            ['Łatwiej wtedy sprawdzić model, podstawienie i jednostkę','Ponieważ wzór nie ma znaczenia','Żeby ukryć dane'],
            ['Jednostka, znak i rząd wielkości wyniku','Tylko liczba cyfr po przecinku','Kolejność odpowiedzi']
        ];
        dodatkowe.forEach((pytanie, i) => {
            if (out.length < MIN_PYTAN_NA_POZIOM) uniqPush(out, mkQ(pytanie, odp[i], 0, poziom, formula, wsk1, rozw1, poziom > 1));
        });
    }
    return out.slice(0, MIN_PYTAN_NA_POZIOM);
}

function generujObliczenioweZFormuly(nazwa, formula, poziom, start = 0) {
    const out = [];
    const i = Math.max(0, start);
    const make = (pytanie, odpowiedzi, prawidlowa, wzor, wskazowka, rozwiazanie) => {
        uniqPush(out, mkQ(pytanie, odpowiedzi, prawidlowa, poziom, wzor, wskazowka, rozwiazanie, true));
    };
    const f = String(formula || '');
    if (/T\[K\].*=.*t\[°C\]/.test(f)) {
        for (let j=0;j<12;j++) { const c=20+j*5, k=c+273.15; make(`Temperatura w pomieszczeniu wynosi ${c}°C. Ile to kelwinów?`,[`${nformat(k)} K`,`${c} K`,`${nformat(k-273.15)} K`],0,'T[K] = t[°C] + 273,15','Dodaj 273,15 do temperatury w stopniach Celsjusza.',`T = ${c} + 273,15 = ${nformat(k)} K.`); }
    } else if (/Q = mc/.test(f)) {
        for (let j=0;j<12;j++) { const m=1+j%4, c=4200, dt=2+j%5, q=m*c*dt; make(`Do ${m} kg wody o cieple właściwym 4200 J/(kg·K) dostarczono energię potrzebną do ogrzania jej o ${dt} K. Ile energii dostarczono?`,[`${q} J`,`${m*c} J`,`${q/dt} J`],0,'Q = mcΔT','Pomnóż masę, ciepło właściwe i zmianę temperatury.',`Q = ${m} · 4200 · ${dt} = ${q} J.`); }
    } else if (/E = hf/.test(f)) {
        for (let j=0;j<12;j++) { const freq=(4+j)*1e14, h=6.63e-34, e=h*freq; make(`Foton ma częstotliwość ${(4+j)}·10¹⁴ Hz. Przyjmij h = 6,63·10⁻³⁴ J·s. Jaką ma energię?`,[`${nformat(e)} J`,`${nformat(freq*h*10)} J`,`${nformat(e/10)} J`],0,'E = hf','Pomnóż stałą Plancka przez częstotliwość fotonu.',`E = 6,63·10⁻³⁴ · ${(4+j)}·10¹⁴ ≈ ${nformat(e)} J.`); }
    } else if (/E₀ = mc²/.test(f)) {
        for (let j=0;j<12;j++) { const m=(j+1)*0.001, e=m*9e16; make(`Masa spoczynkowa obiektu wynosi ${(j+1)} g. Przyjmij c = 3·10⁸ m/s. Jaka jest jego energia spoczynkowa?`,[`${nformat(e)} J`,`${nformat(m*3e8)} J`,`${nformat(e/9)} J`],0,'E₀ = mc²','Najpierw zamień gramy na kilogramy, a następnie zastosuj kwadrat prędkości światła.',`E₀ = ${m} · (3·10⁸)² = ${nformat(e)} J.`); }
    } else if (/p = ρgh/.test(f)) {
        for (let j=0;j<12;j++) { const h=1+j, p=1000*10*h; make(`Woda ma gęstość 1000 kg/m³. Jakie ciśnienie hydrostatyczne panuje na głębokości ${h} m? Przyjmij g = 10 m/s².`,[`${p} Pa`,`${p/10} Pa`,`${p*10} Pa`],0,'p = ρgh','Pomnóż gęstość, g i głębokość.',`p = 1000 · 10 · ${h} = ${p} Pa.`); }
    } else if (/F = ma|F_w = ma/.test(f)) {
        for (let j=0;j<12;j++) { const m=2+j, a=1+(j%5), F=m*a; make(`Na ciało o masie ${m} kg działa siła wypadkowa ${F} N. Jakie ma przyspieszenie?`,[`${a} m/s²`,`${m} m/s²`,`${F} m/s²`],0,'F_w = ma','Przekształć II zasadę Newtona do postaci a = F/m.',`a = ${F}/${m} = ${a} m/s².`); }
    } else if (/W = Fs/.test(f)) {
        for (let j=0;j<12;j++) { const F=10+j*5, s=2+j%5, W=F*s; make(`Siła ${F} N przesuwa skrzynię o ${s} m w swoim kierunku. Jaką pracę wykonuje?`,[`${W} J`,`${F+s} J`,`${F/s} J`],0,'W = Fs','Siła i przemieszczenie mają ten sam kierunek, więc W = Fs.',`W = ${F} · ${s} = ${W} J.`); }
    } else if (/P = UI/.test(f)) {
        for (let j=0;j<12;j++) { const U=6+j, I=0.5+(j%4)*0.5, P=U*I; make(`Urządzenie pracuje przy napięciu ${U} V i pobiera prąd ${nformat(I)} A. Jaka jest jego moc?`,[`${nformat(P)} W`,`${nformat(U/I)} W`,`${nformat(U+I)} W`],0,'P = UI','Pomnóż napięcie przez natężenie prądu.',`P = ${U} · ${nformat(I)} = ${nformat(P)} W.`); }
    } else if (/U = IR/.test(f)) {
        for (let j=0;j<12;j++) { const I=1+(j%5), R=2+j%4, U=I*R; make(`Przez opornik ${R} Ω płynie prąd ${I} A. Jakie napięcie występuje na jego zaciskach?`,[`${U} V`,`${R/I} V`,`${I/R} V`],0,'U = IR','Pomnóż natężenie prądu przez opór.',`U = ${I} · ${R} = ${U} V.`); }
    } else if (/f = 1\/T/.test(f)) {
        for (let j=0;j<12;j++) { const T=(j+1)/2, freq=1/T; make(`Drganie ma okres ${nformat(T)} s. Jaka jest jego częstotliwość?`,[`${nformat(freq)} Hz`,`${nformat(T)} Hz`,`${nformat(T*T)} Hz`],0,'f = 1/T','Częstotliwość jest odwrotnością okresu.',`f = 1/${nformat(T)} = ${nformat(freq)} Hz.`); }
    } else if (/v = λf/.test(f)) {
        for (let j=0;j<12;j++) { const lam=1+j%6, freq=2+j%5, v=lam*freq; make(`Fala ma długość ${lam} m i częstotliwość ${freq} Hz. Z jaką prędkością się rozchodzi?`,[`${v} m/s`,`${nformat(lam/freq)} m/s`,`${nformat(freq/lam)} m/s`],0,'v = λf','Pomnóż długość fali przez częstotliwość.',`v = ${lam} · ${freq} = ${v} m/s.`); }
    } else if (/F = kΔx/.test(f)) {
        for (let j=0;j<12;j++) { const k=50+j*10, x=(j%4+1)/100, F=k*x; make(`Sprężyna ma stałą k = ${k} N/m i wydłuża się o ${nformat(x)} m. Jaką siłą jest rozciągana?`,[`${nformat(F)} N`,`${nformat(k/x)} N`,`${nformat(x/k)} N`],0,'F = kΔx','Pomnóż stałą sprężyny przez wydłużenie.',`F = ${k} · ${nformat(x)} = ${nformat(F)} N.`); }
    } else if (/σ = F\/A/.test(f)) {
        for (let j=0;j<12;j++) { const F=100+j*50, A=(1+j%5)*0.01, sig=F/A; make(`Na próbkę działa siła ${F} N na powierzchnię ${nformat(A)} m². Jakie naprężenie powstaje?`,[`${nformat(sig)} Pa`,`${nformat(F*A)} Pa`,`${nformat(A/F)} Pa`],0,'σ = F/A','Podziel siłę przez pole powierzchni.',`σ = ${F}/${nformat(A)} = ${nformat(sig)} Pa.`); }
    } else {
        // Ostateczny fallback nadal musi być samodzielny i różnorodny.
        // Każde pytanie zmienia konkretną sytuację, a uczeń ma wskazać poprawny tok rozwiązania.
        const polecenia = [
            'Wypisz dane i szukaną wielkość.',
            'Dobierz właściwy model fizyczny.',
            'Sprawdź zgodność jednostek.',
            'Przekształć wzór do szukanej wielkości.',
            'Oceń znak otrzymanego wyniku.',
            'Sprawdź rząd wielkości wyniku.',
            'Wskaż wielkość, od której zależy wynik.',
            'Określ, jak zmieni się wynik po zwiększeniu jednej z danych.',
            'Sprawdź, czy wynik ma właściwą jednostkę.',
            'Porównaj dwa przypadki opisane w zadaniu.',
            'Wskaż założenie potrzebne do zastosowania modelu.',
            'Zweryfikuj wynik na podstawie zależności fizycznej.'
        ];
        for (let j=0;j<12;j++) {
            const liczba = 2 + (j % 5);
            const pytanie = `W zadaniu z tematu „${nazwa}” podano zależność ${formula || 'właściwą dla tego zagadnienia'}. ${polecenia[j]} Która odpowiedź opisuje poprawne postępowanie?`;
            const odpowiedzi = [
                'Postępować zgodnie z podaną zależnością, danymi i jednostkami',
                'Wybrać dowolny wzór i pominąć jednostki',
                'Uznać wynik za poprawny bez sprawdzenia założeń'
            ];
            make(pytanie, odpowiedzi, 0, formula, 'Najpierw zapisz dane, model i jednostki, a następnie wykonaj obliczenia i sprawdź wynik.', `Poprawne rozwiązanie wymaga zastosowania zależności ${formula || 'właściwej dla tego zagadnienia'}, zgodnych jednostek oraz kontroli wyniku.`);
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
        return wynik;
    }
    const generic = GENERIC_WIEDZA.find(x => x.r.test(temat));
    if (generic) {
        generic.facts.forEach(([pytanie, odpowiedzi, prawidlowa]) => {
            uniqPush(wynik[1], mkQ(pytanie, odpowiedzi, prawidlowa, 1, '', 'Rozpoznaj pojęcie i sprawdź, czy odpowiedź opisuje właściwe zjawisko.', 'Poprawna odpowiedź wynika z definicji i własności tego zjawiska.', false));
        });
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

function dodajOtwarteZadaniaMaturalne() {
    for (const zadanie of OTWARTE_ZADANIA_MATURALNE) {
        for (const dzial of Object.values(baza)) {
            for (const lekcje of Object.values(dzial.podnagalowki || {})) {
                const lekcja = lekcje.find(item => item.temat === zadanie.temat);
                if (!lekcja) continue;
                const istnieje = (lekcja.quiz || []).some(q => q.pytanie === zadanie.pytanie);
                if (!istnieje) {
                    const otwarte = {
                        ...zadanie,
                        tematZrodlowy: lekcja.temat,
                        typ: "otwarte",
                        poziom: 3
                    };
                    lekcja.quiz = [otwarte, ...(lekcja.quiz || []).filter(q => q.pytanie !== zadanie.pytanie).slice(0, 11)];
                }
                break;
            }
        }
    }
}

dodajOtwarteZadaniaMaturalne();

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
    const jawny = Number(pytanie?.poziom);
    if ([1, 2, 3].includes(jawny)) return jawny;
    if (pytanie?.maturalne) return 3;

    const tekst = `${pytanie?.pytanie || ""} ${pytanie?.wzor || ""} ${pytanie?.rozwiazanie || ""}`;
    const wieloetapowe = /(?:następnie|a następnie|wyznacz.*oraz|oblicz.*i |porównaj|zapisz.*oblicz|przekształć|zależność|w dwóch etap|na podstawie.*wyznacz)/i.test(tekst);
    const zlozoneObliczeniowo = Boolean(pytanie?.obliczeniowe || pytanie?.wzor) && (
        wieloetapowe
        || (String(pytanie?.pytanie || "").length > 180)
        || /(?:\^2|²|sqrt|√|sin|cos|log|ln|\bGM\b|\bγ\b|\bΔU\b|\bR_z\b)/i.test(tekst)
    );

    if (zlozoneObliczeniowo) return 3;
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
    document.getElementById("temat-lekcji").textContent = pakiet[0].temat;
    // Każdy quiz musi mieć co najmniej 10 pełnych pytań. Banki są budowane do 12,
    // ale jeśli dane są uszkodzone, nie uruchamiamy niepełnego quizu.
    const MIN_PYTAN_W_QUIZIE = 10;
    const PREFEROWANA_LICZBA_PYTAN = 12;
    if (aktualnePytania.length < MIN_PYTAN_W_QUIZIE) {
        console.error("Niepełny bank pytań — quiz nie został uruchomiony:", pakiet.map(lekcja => lekcja.temat));
        alert(`Ten temat nie ma jeszcze wymaganych ${MIN_PYTAN_W_QUIZIE} pełnych pytań. Quiz nie został uruchomiony.`);
        return;
    }
    aktualnaLiczbaPytan = Math.min(PREFEROWANA_LICZBA_PYTAN, aktualnePytania.length);
    aktualnePytania = aktualnePytania.slice(0, aktualnaLiczbaPytan);
    ustawWizualnyPostep(0);
    ekranLekcji.style.display = "none";
    ekranQuizu.style.display = "block";
    showQuestion();
}

// Wyświetlanie pytania

function generujIlustracjePytania(pytanie) {
    const tekst = `${pytanie?.pytanie || ""} ${pytanie?.tematZrodlowy || ""} ${pytanie?.temat || ""}`.toLowerCase();
    if (/optyk|lustro|zwierciad|soczew|załam|odbici|kąt padania|normaln/.test(tekst)) {
        return `
          <div class="ilustracja-fizyczna ilustracja-optyka" role="img" aria-label="Schemat optyczny z promieniem, normalną i powierzchnią">
            <svg viewBox="0 0 620 190" aria-hidden="true">
              <line x1="70" y1="145" x2="550" y2="145" class="svg-powierzchnia"/>
              <line x1="310" y1="35" x2="310" y2="170" class="svg-normalna"/>
              <line x1="115" y1="45" x2="310" y2="145" class="svg-promien"/>
              <line x1="310" y1="145" x2="505" y2="45" class="svg-promien"/>
              <circle cx="310" cy="145" r="5" class="svg-punkt"/>
              <text x="322" y="58" class="svg-opis">normalna</text>
              <text x="390" y="137" class="svg-opis">powierzchnia</text>
              <text x="158" y="92" class="svg-opis">kąt padania</text>
              <text x="397" y="92" class="svg-opis">kąt odbicia</text>
            </svg>
            <small>Schemat pomocniczy — kąty mierzymy względem normalnej.</small>
          </div>`;
    }
    if (/wykres v\(t\)|wykres prędko|pole pod wykres|prędkość.*czas/.test(tekst)) {
        return `
          <div class="ilustracja-fizyczna" role="img" aria-label="Schemat wykresu prędkości w funkcji czasu">
            <svg viewBox="0 0 620 190" aria-hidden="true">
              <line x1="70" y1="150" x2="560" y2="150" class="svg-oś"/>
              <line x1="70" y1="150" x2="70" y2="30" class="svg-oś"/>
              <line x1="100" y1="85" x2="500" y2="85" class="svg-promien"/>
              <text x="540" y="168" class="svg-opis">t</text>
              <text x="45" y="38" class="svg-opis">v</text>
              <text x="330" y="75" class="svg-opis">v = const</text>
            </svg>
            <small>Schemat pomocniczy — pole pod wykresem v(t) odpowiada drodze.</small>
          </div>`;
    }
    if (/sił|newton|tarci|wypadkow|dynamik/.test(tekst)) {
        return `
          <div class="ilustracja-fizyczna" role="img" aria-label="Schemat sił działających na ciało">
            <svg viewBox="0 0 620 190" aria-hidden="true">
              <rect x="255" y="75" width="110" height="60" rx="8" class="svg-punkt"/>
              <line x1="310" y1="75" x2="310" y2="35" class="svg-promien"/>
              <line x1="310" y1="135" x2="310" y2="175" class="svg-promien"/>
              <line x1="255" y1="105" x2="170" y2="105" class="svg-promien"/>
              <line x1="365" y1="105" x2="450" y2="105" class="svg-promien"/>
              <text x="320" y="30" class="svg-opis">N</text>
              <text x="320" y="178" class="svg-opis">mg</text>
              <text x="135" y="98" class="svg-opis">tarcie</text>
              <text x="455" y="98" class="svg-opis">F</text>
            </svg>
            <small>Schemat pomocniczy — zaznaczono przykładowe siły działające na ciało.</small>
          </div>`;
    }
    if (/obwód|opornik|napięci|natężeni.*prąd|prawo ohma|elektryczn/.test(tekst)) {
        return `
          <div class="ilustracja-fizyczna" role="img" aria-label="Schemat prostego obwodu elektrycznego">
            <svg viewBox="0 0 620 190" aria-hidden="true">
              <line x1="120" y1="55" x2="500" y2="55" class="svg-oś"/>
              <line x1="120" y1="135" x2="500" y2="135" class="svg-oś"/>
              <line x1="120" y1="55" x2="120" y2="135" class="svg-oś"/>
              <line x1="500" y1="55" x2="500" y2="135" class="svg-oś"/>
              <rect x="285" y="42" width="70" height="26" rx="4" class="svg-punkt"/>
              <text x="305" y="61" class="svg-opis">R</text>
              <text x="75" y="102" class="svg-opis">U</text>
              <text x="370" y="48" class="svg-opis">I →</text>
            </svg>
            <small>Schemat pomocniczy — prosty obwód z opornikiem R.</small>
          </div>`;
    }
    if (/fala|drgani|amplitud|długość fali|częstotliwo/.test(tekst)) {
        return `
          <div class="ilustracja-fizyczna" role="img" aria-label="Schemat fali z amplitudą i długością fali">
            <svg viewBox="0 0 620 190" aria-hidden="true">
              <line x1="60" y1="100" x2="560" y2="100" class="svg-oś"/>
              <path d="M60 100 C90 40,120 40,150 100 S210 160,240 100 S300 40,330 100 S390 160,420 100 S480 40,510 100 S540 160,570 100" fill="none" class="svg-promien"/>
              <line x1="150" y1="100" x2="150" y2="45" class="svg-normalna"/>
              <text x="160" y="58" class="svg-opis">A</text>
              <text x="210" y="178" class="svg-opis">λ</text>
              <line x1="150" y1="165" x2="330" y2="165" class="svg-oś"/>
            </svg>
            <small>Schemat pomocniczy — A oznacza amplitudę, a λ długość fali.</small>
          </div>`;
    }
    return "";
}


function normalizujOdpowiedzOtwarta(tekst) {
    return String(tekst ?? "")
        .toLocaleLowerCase("pl")
        .replace(/[,]/g, ".")
        .replace(/[−–—]/g, "-")
        .replace(/\s+/g, " ")
        .replace(/\s*(?:°|Ω|ohm|j|w|n|pa|hz|kg|m\/s²|m\/s|cm|mm|gpa|mpa|rok(?:u|a)?|h)\b/gi, "")
        .replace(/[.;]+$/g, "")
        .trim();
}

function liczbaZOdpowiedzi(tekst) {
    const match = String(tekst ?? "").replace(",", ".").match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i);
    return match ? Number(match[0]) : NaN;
}

function odpowiedzOtwartaJestPoprawna(pytanie, odpowiedzUcznia) {
    const wpis = normalizujOdpowiedzOtwarta(odpowiedzUcznia);
    if (!wpis) return false;

    const akceptowane = [
        pytanie.odpowiedz,
        ...(Array.isArray(pytanie.akceptowane) ? pytanie.akceptowane : [])
    ].map(normalizujOdpowiedzOtwarta).filter(Boolean);

    if (akceptowane.includes(wpis)) return true;

    const tolerancja = Number(pytanie.tolerancja);
    if (Number.isFinite(tolerancja)) {
        const ucznia = liczbaZOdpowiedzi(odpowiedzUcznia);
        const wzorcowa = liczbaZOdpowiedzi(pytanie.odpowiedz);
        if (Number.isFinite(ucznia) && Number.isFinite(wzorcowa)) {
            return Math.abs(ucznia - wzorcowa) <= tolerancja;
        }
    }
    return false;
}

function pokazWyjasnienieZadaniaOtwarte(pytanie, odpowiedziDiv) {
    const stare = document.getElementById("wyjasnienie-odpowiedzi");
    if (stare) stare.remove();

    const wzor = formatujWzor(pytanie.wzor);
    const wyjasnienie = escapeHtml(wygenerujWyjasnienieOdpowiedzi(pytanie));
    const box = document.createElement("div");
    box.id = "wyjasnienie-odpowiedzi";
    box.className = "wyjasnienie-odpowiedzi";
    box.innerHTML = `
        <div class="wyjasnienie-tytul">✓ Rozwiązanie zadania otwartego</div>
        ${wzor ? `<div class="wyjasnienie-wzor">${wzor}</div>` : ""}
        <div class="wyjasnienie-rozwiazanie">
            <strong>Oczekiwana odpowiedź:</strong>
            <p>${escapeHtml(pytanie.odpowiedz || "")}</p>
            <strong>Wyjaśnienie:</strong>
            <p>${wyjasnienie}</p>
        </div>
        <button type="button" class="przycisk-nastepnego-pytania" id="przycisk-nastepnego-pytania">Następne zadanie →</button>
    `;
    odpowiedziDiv.insertAdjacentElement("afterend", box);
    document.getElementById("przycisk-nastepnego-pytania").addEventListener("click", () => {
        aktualnaPytanieIndex++;
        showQuestion();
    });
}

function renderujZadanieOtwarte(pytanie, odpowiedziDiv) {
    const wrapper = document.createElement("div");
    wrapper.className = "zadanie-otwarte";
    wrapper.innerHTML = `
        <label class="zadanie-otwarte-label" for="odpowiedz-otwarta">Twoja odpowiedź</label>
        <textarea id="odpowiedz-otwarta" class="zadanie-otwarte-input" rows="4"
            placeholder="Zapisz wynik i — jeśli zadanie tego wymaga — krótki tok obliczeń."></textarea>
        <button type="button" class="przycisk-sprawdz-otwarte" id="sprawdz-otwarte">Sprawdź odpowiedź</button>
        <div class="zadanie-otwarte-status" id="status-otwarte" aria-live="polite"></div>
    `;
    odpowiedziDiv.appendChild(wrapper);

    const pole = wrapper.querySelector("#odpowiedz-otwarta");
    const przycisk = wrapper.querySelector("#sprawdz-otwarte");
    const status = wrapper.querySelector("#status-otwarte");

    przycisk.addEventListener("click", () => {
        const odpowiedz = pole.value.trim();
        if (!odpowiedz) {
            status.textContent = "Wpisz odpowiedź, zanim ją sprawdzisz.";
            status.className = "zadanie-otwarte-status blad";
            pole.focus();
            return;
        }

        if (odpowiedzOtwartaJestPoprawna(pytanie, odpowiedz)) {
            pole.disabled = true;
            przycisk.disabled = true;
            status.textContent = "Poprawnie. Wynik został zapisany.";
            status.className = "zadanie-otwarte-status sukces";

            seriaPoprawnych += 1;
            seriaBlednych = 0;
            if (seriaPoprawnych >= 2) poziomAdaptacyjny = Math.min(3, poziomAdaptacyjny + 1);
            wynikGracza += 20;
            magazynDanych().setItem(`fizyka-wynik-${aktywnyUzytkownik}`, wynikGracza);
            pokazWynik();
            ustawWizualnyPostep(((aktualnaPytanieIndex + 1) / aktualnaLiczbaPytan) * 100);
            ustawPostep(aktualnyPakiet, ((aktualnaPytanieIndex + 1) / aktualnaLiczbaPytan) * 100);
            pokazWyjasnienieZadaniaOtwarte(pytanie, odpowiedziDiv);
        } else {
            seriaBlednych += 1;
            seriaPoprawnych = 0;
            poziomAdaptacyjny = Math.max(1, poziomAdaptacyjny - 1);
            status.textContent = "To jeszcze nie jest poprawna odpowiedź. Sprawdź jednostki, znak i kolejne kroki rozwiązania.";
            status.className = "zadanie-otwarte-status blad";
            pole.focus();
        }
    });
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
        document.getElementById("numer-pytania").textContent = `${typZadania(pytanie) === "otwarte" ? "Zadanie" : "Pytanie"} ${aktualnaPytanieIndex + 1} z ${aktualnaLiczbaPytan} • poziom ${opisPoziomuDlaUcznia(pytanie.poziom)}`;
        const etykieta = document.querySelector(".etykieta-maturalna");
        if (etykieta) etykieta.textContent = pytanie.maturalne
            ? (typZadania(pytanie) === "otwarte" ? "TRENING MATURALNY • ZADANIE OTWARTE" : "TRENING MATURALNY")
            : (typZadania(pytanie) === "otwarte" ? "ZADANIE OTWARTE" : "ĆWICZENIE");
        pokazPodpowiedz(pytanie);
        
        const odpowiedziDiv = document.getElementById("quiz-odpowiedzi");
        odpowiedziDiv.innerHTML = "";
        dodajPrzyciskZgloszenia(pytanie);

        if (typZadania(pytanie) === "otwarte") {
            renderujZadanieOtwarte(pytanie, odpowiedziDiv);
        } else {
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
        }

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
