# Konfiguracja Firestore

Kod strony jest gotowy, ale bazę i uprawnienia trzeba jednorazowo włączyć w projekcie Firebase `inercja-424dd`.

## 1. Utwórz bazę Firestore

1. Otwórz Firebase Console.
2. Wejdź w **Bazy danych i przechowywanie → Firestore Database**.
3. Kliknij **Utwórz bazę danych** i wybierz tryb produkcyjny.

## 2. Włącz logowanie i zapisywanie odpowiedzi gości

W **Authentication → Sign-in method** włącz dostawców **Email/Password** oraz **Anonymous / Anonimowe**. Pierwszy jest potrzebny do kont i synchronizacji postępu między urządzeniami, a drugi do trybu gościa.

W **Authentication → Settings → Authorized domains** dodaj domenę, pod którą publikowana jest strona (na przykład `leonixloni.github.io`). Bez tego logowanie w opublikowanej wersji może zostać odrzucone przez Firebase.

## 3. Wgraj bezpieczne reguły

W zakładce **Firestore Database → Reguły** wklej zawartość pliku `firestore.rules` i kliknij **Opublikuj**.

Alternatywnie, po zalogowaniu w Firebase CLI, uruchom w katalogu projektu:

```bash
firebase deploy --only firestore:rules --project inercja-424dd
```

## 4. Sprawdź synchronizację postępu

Po opublikowaniu reguł zaloguj się na to samo potwierdzone konto na dwóch urządzeniach. Punkty, ukończone lekcje i wybrana ścieżka będą zapisywane w kolekcji `postepy` w Cloud Firestore. Przy pierwszym logowaniu istniejący postęp lokalny jest łączony z postępem zapisanym w chmurze — zachowywany jest wyższy wynik oraz dalszy postęp każdej lekcji.

## 5. Wyświetl zapisane odpowiedzi

W **Firestore Database → Dane** otwórz kolekcję `odpowiedzi`. Każdy dokument zawiera odpowiedzi jednego użytkownika. Reguły nie pozwalają odczytywać tych danych ze strony — są widoczne tylko dla osób mających dostęp do projektu w konsoli Firebase.
