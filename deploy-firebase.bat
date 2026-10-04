@echo off
setlocal
cd /d "%~dp0"
echo === Inercja: wdrozenie Firebase ===
echo Najpierw zaloguj sie do Firebase, jesli jeszcze tego nie zrobiles.
call npx firebase-tools@latest login
if errorlevel 1 goto :blad
call npx firebase-tools@latest deploy --only firestore:rules,hosting --project inercja-424dd
if errorlevel 1 goto :blad
echo.
echo Gotowe. Reguly Firestore i hosting zostaly opublikowane.
pause
exit /b 0
:blad
echo.
echo Wdrozenie nie powiodlo sie. Sprawdz logowanie Firebase i projekt inercja-424dd.
pause
exit /b 1
