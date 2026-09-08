# Konfiguracja Firestore i panelu

Kod strony jest gotowy, ale bazę i uprawnienia trzeba jednorazowo włączyć w projekcie Firebase `inercja-424dd`.

## 1. Utwórz bazę Firestore

1. Otwórz Firebase Console.
2. Wejdź w **Bazy danych i przechowywanie → Firestore Database**.
3. Kliknij **Utwórz bazę danych** i wybierz tryb produkcyjny.

## 2. Włącz zapisywanie odpowiedzi gości

W **Authentication → Sign-in method** włącz dostawcę **Anonymous / Anonimowe**. Bez tego strona nadal działa, ale odpowiedzi gości zostają tylko w ich przeglądarce.

## 3. Wgraj bezpieczne reguły

W zakładce **Firestore Database → Reguły** wklej zawartość pliku `firestore.rules` i kliknij **Opublikuj**.

Alternatywnie, po zalogowaniu w Firebase CLI, uruchom w katalogu projektu:

```bash
firebase deploy --only firestore:rules --project inercja-424dd
```

## 4. Nadaj sobie dostęp do panelu

1. W **Authentication → Users** skopiuj swoje `User UID`.
2. W **Firestore Database → Dane** utwórz kolekcję `administratorzy`.
3. Dodaj dokument, którego identyfikatorem jest dokładnie skopiowany UID. Możesz dodać pole `rola` typu string z wartością `admin`.

Panel znajduje się pod adresem `panel.html`. Zwykłe konta nie mogą odczytać odpowiedzi innych osób.
