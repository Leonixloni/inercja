import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    browserLocalPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore
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

const aplikacja = initializeApp(firebaseConfig);
const auth = getAuth(aplikacja);
const firestore = getFirestore(aplikacja);
const gotowoscFirebase = setPersistence(auth, browserLocalPersistence);

const komunikat = document.getElementById("komunikat-panelu");
const logowanie = document.getElementById("logowanie-panelu");
const tresc = document.getElementById("tresc-panelu");

const etykiety = {
    poziom: {
        podstawowy: "Dopiero zaczyna naukę",
        sredni: "Zna podstawy",
        zaawansowany: "Rozwiązuje trudniejsze zadania"
    },
    cel: {
        szkola: "Szkoła",
        ciekawosc: "Ciekawość",
        praca: "Praca",
        inne: "Inne"
    },
    zrodlo: {
        wyszukiwarka: "Wyszukiwarka",
        "social-media": "Media społecznościowe",
        szkola: "Szkoła lub nauczyciel",
        znajomi: "Znajomi lub rodzina",
        inne: "Inne"
    }
};

function pokazKomunikat(tekst, blad = false) {
    komunikat.textContent = tekst;
    komunikat.classList.toggle("blad", blad);
    komunikat.hidden = false;
}

function najczestszaWartosc(odpowiedzi, pole) {
    const licznik = odpowiedzi.reduce((wynik, odpowiedz) => {
        const wartosc = odpowiedz[pole];
        if (wartosc) wynik[wartosc] = (wynik[wartosc] || 0) + 1;
        return wynik;
    }, {});
    return Object.entries(licznik).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function formatujDate(wartosc) {
    const data = wartosc?.toDate?.();
    return data
        ? new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium", timeStyle: "short" }).format(data)
        : "—";
}

function dodajKomorke(wiersz, tekst) {
    const komorka = document.createElement("td");
    komorka.textContent = tekst;
    wiersz.appendChild(komorka);
}

function wyswietlOdpowiedzi(odpowiedzi) {
    odpowiedzi.sort((a, b) => (b.zapisano?.seconds || 0) - (a.zapisano?.seconds || 0));
    document.getElementById("liczba-odpowiedzi").textContent = odpowiedzi.length;

    const powod = najczestszaWartosc(odpowiedzi, "cel");
    const zrodlo = najczestszaWartosc(odpowiedzi, "zrodlo");
    document.getElementById("najczestszy-powod").textContent = etykiety.cel[powod] || "—";
    document.getElementById("najczestsze-zrodlo").textContent = etykiety.zrodlo[zrodlo] || "—";

    const tabela = document.getElementById("wiersze-odpowiedzi");
    tabela.replaceChildren();
    document.getElementById("brak-odpowiedzi").hidden = odpowiedzi.length !== 0;

    odpowiedzi.forEach(odpowiedz => {
        const wiersz = document.createElement("tr");
        const typ = odpowiedz.typKonta === "gosc" ? "Gość" : "Konto";
        dodajKomorke(wiersz, `${odpowiedz.nazwa || "Użytkownik"} · ${typ}`);
        dodajKomorke(wiersz, etykiety.poziom[odpowiedz.poziom] || odpowiedz.poziom || "—");
        dodajKomorke(wiersz, etykiety.cel[odpowiedz.cel] || odpowiedz.cel || "—");
        dodajKomorke(wiersz, etykiety.zrodlo[odpowiedz.zrodlo] || odpowiedz.zrodlo || "—");
        dodajKomorke(wiersz, formatujDate(odpowiedz.zapisano));
        tabela.appendChild(wiersz);
    });
}

async function wczytajPanel(uzytkownik) {
    pokazKomunikat("Sprawdzam uprawnienia…");
    const administrator = await getDoc(doc(firestore, "administratorzy", uzytkownik.uid));
    if (!administrator.exists()) {
        tresc.hidden = true;
        await signOut(auth);
        logowanie.hidden = false;
        pokazKomunikat("To konto nie ma uprawnień administratora.", true);
        return;
    }

    const dokumenty = await getDocs(collection(firestore, "odpowiedzi"));
    wyswietlOdpowiedzi(dokumenty.docs.map(dokument => dokument.data()));
    komunikat.hidden = true;
    tresc.hidden = false;
}

async function obsluzUzytkownika(uzytkownik) {
    if (!uzytkownik) {
        tresc.hidden = true;
        komunikat.hidden = true;
        logowanie.hidden = false;
        return;
    }
    if (uzytkownik.isAnonymous || !uzytkownik.emailVerified) {
        await signOut(auth);
        pokazKomunikat("Panel wymaga potwierdzonego konta administratora.", true);
        logowanie.hidden = false;
        return;
    }

    logowanie.hidden = true;
    try {
        await wczytajPanel(uzytkownik);
    } catch (error) {
        await signOut(auth);
        logowanie.hidden = false;
        pokazKomunikat("Nie udało się pobrać odpowiedzi. Sprawdź konfigurację Firestore i reguły dostępu.", true);
        console.error(error);
    }
}

document.getElementById("formularz-logowania-panelu").addEventListener("submit", async event => {
    event.preventDefault();
    const przycisk = event.submitter;
    przycisk.disabled = true;
    przycisk.textContent = "Logowanie…";
    try {
        await gotowoscFirebase;
        await signInWithEmailAndPassword(
            auth,
            document.getElementById("email-panelu").value.trim().toLowerCase(),
            document.getElementById("haslo-panelu").value
        );
    } catch (error) {
        pokazKomunikat("Nieprawidłowy email lub hasło.", true);
    } finally {
        przycisk.disabled = false;
        przycisk.textContent = "Zaloguj →";
    }
});

document.getElementById("odswiez-panel").addEventListener("click", () => {
    if (auth.currentUser) obsluzUzytkownika(auth.currentUser);
});

document.getElementById("wyloguj-panel").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, obsluzUzytkownika);
