# Misja YouTube — wdrożenie Inercji

## Co zostało zrobione
- Misja `youtube_subskrypcja` prowadzi do kanału `UC2Wi6cHYsLz48s95HHeOptw`.
- Google Identity Services prosi ucznia o zakres `https://www.googleapis.com/auth/youtube.readonly`.
- Serwer wysyła autoryzowane zapytanie do YouTube Data API i sprawdza subskrypcję kanału.
- Dopiero serwer, po pozytywnym wyniku, zapisuje nagrodę do Firestore przez Firebase Admin SDK.
- Misji YouTube nie można odebrać bezpośrednim zapisem z przeglądarki, ponieważ reguły Firestore nie dopuszczają `youtube_subskrypcja` jako misji klienta.
- Limit gwiazdek wynosi 10; konto nadal startuje z 5.
- Istniejące logowanie email/hasło, rejestracja, reset hasła i tryb gościa zostały pozostawione bez zmian.

## Render — wymagane
Environment Variable:

`FIREBASE_SERVICE_ACCOUNT_JSON`

Wartość: pełna zawartość prywatnego klucza Firebase Admin SDK. Nie umieszczaj jej w repozytorium.

Po wdrożeniu sprawdź:

`https://inercja.onrender.com/api/health`

Powinno pojawić się JSON z `ok: true`, `youtubeMission: true` oraz `firebaseAdminConfigured: true`.

## Google Cloud
Autoryzowane źródło JavaScript:

`https://inercja.onrender.com`

Zakres OAuth:

`https://www.googleapis.com/auth/youtube.readonly`

Client ID używany przez aplikację znajduje się w `script.js`.
