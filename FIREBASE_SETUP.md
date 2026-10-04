# Konfiguracja Firebase — Inercja

Projekt korzysta z Firebase Authentication i Cloud Firestore projektu `inercja-424dd`. Logowanie nie zostało zmienione.

## 1. Authentication

W Firebase Console → Authentication → Sign-in method włącz:
- Email/Password — konta uczniów,
- Anonymous — tylko tryb gościa.

W Authorized domains dodaj domenę, z której uruchamiasz aplikację.

## 2. Firestore

Utwórz bazę Firestore w trybie produkcyjnym, a następnie opublikuj **dokładnie** plik `firestore.rules` z tego projektu. Reguły są ważne również dla gwiazdek: klient nie może zwiększyć ich stanu przez DevTools ani bezpośredni zapis do Firestore.

Jeżeli widzisz w konsoli `permission-denied` przy pobieraniu postępu, najczęściej oznacza to, że reguły z ZIP-a nie zostały jeszcze opublikowane w projekcie Firebase. W katalogu projektu wykonaj:

```bash
npx firebase-tools@latest login
npx firebase-tools@latest deploy --only firestore:rules,hosting --project inercja-424dd
```

Plik `.firebaserc` wskazuje już projekt `inercja-424dd`.

## 3. Gwiazdki

Nowe konto zaczyna z 5 ⭐. Jedna podpowiedź kosztuje 1 ⭐. Zużycie gwiazdki jest wykonywane transakcją Firestore, więc zmiana wartości w `localStorage` nie daje dodatkowej gwiazdki. Reguły Firestore dodatkowo zabraniają zwiększania stanu gwiazdek z poziomu klienta.

## 4. Ważne o DevTools

Frontend jest uruchamiany w przeglądarce, więc sam kod HTML/JS zawsze może zostać obejrzany w DevTools. Nie przechowujemy jednak w localStorage autorytatywnego stanu gwiazdek: przy użyciu podpowiedzi wymagany jest zapis atomowy w Firestore. Pełne ukrycie klucza odpowiedzi i treści podpowiedzi przed osobą mającą dostęp do kodu przeglądarki wymaga przeniesienia sprawdzania odpowiedzi i treści podpowiedzi do backendu.
