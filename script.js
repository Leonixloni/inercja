(function () {
  const STORAGE_KEYS = {
    user: 'inercja-user-profile',
    stars: 'inercja-stars',
    guest: 'inercja-guest-mode'
  };
  const SECRET = 'inercja-protected-v1';

  function hashValue(value) {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16);
  }

  function readSecure(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const payload = JSON.parse(raw);
      if (!payload || typeof payload !== 'object') return fallback;
      if (payload.sign === hashValue(`${JSON.stringify(payload.value)}${SECRET}`)) {
        return payload.value;
      }
    } catch (error) {
      console.warn('Błąd odczytu danych zabezpieczonych:', error);
    }
    return fallback;
  }

  function writeSecure(key, value) {
    localStorage.setItem(key, JSON.stringify({
      value,
      sign: hashValue(`${JSON.stringify(value)}${SECRET}`)
    }));
  }

  function getStars() {
    const value = Number(readSecure(STORAGE_KEYS.stars, 5));
    return Number.isFinite(value) ? Math.max(0, value) : 5;
  }

  function setStars(value) {
    const stars = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 5;
    writeSecure(STORAGE_KEYS.stars, stars);

    document.querySelectorAll('[data-star-display]').forEach((node) => {
      node.textContent = `⭐ ${stars}`;
    });
  }

  function ensureStarDisplay() {
    let display = document.getElementById('licznik-gwiazdek');
    if (!display) {
      display = document.createElement('div');
      display.id = 'licznik-gwiazdek';
      display.setAttribute('data-star-display', 'true');
      display.className = 'licznik-gwiazdek';
      const target = document.getElementById('quiz-info');
      if (target) {
        target.appendChild(display);
      }
    }
    display.textContent = `⭐ ${getStars()}`;
  }

  function removeExperiments() {
    const button = document.getElementById('otworz-doswiadczenia');
    if (button) button.remove();

    const screen = document.getElementById('ekran-doswiadczen');
    if (screen) screen.remove();
  }

  function initAuthFlow() {
    const loginForm = document.getElementById('formularz-logowania');
    const registerForm = document.getElementById('formularz-rejestracji');
    const showRegister = document.getElementById('pokaz-rejestracje');
    const backToLogin = document.getElementById('powrot-do-logowania');
    const guestBtn = document.getElementById('kontynuuj-jako-gosc');

    const showError = (id, message) => {
      const node = document.getElementById(id);
      if (!node) return;
      node.hidden = false;
      node.textContent = message;
    };

    if (showRegister && loginForm && registerForm) {
      showRegister.addEventListener('click', () => {
        loginForm.hidden = true;
        registerForm.hidden = false;
      });
    }

    if (backToLogin && loginForm && registerForm) {
      backToLogin.addEventListener('click', () => {
        registerForm.hidden = true;
        loginForm.hidden = false;
      });
    }

    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        writeSecure(STORAGE_KEYS.guest, true);
        writeSecure(STORAGE_KEYS.user, {
          username: 'Gość',
          email: 'guest@inercja.local',
          password: ''
        });
        setStars(5);
        const startScreen = document.getElementById('ekran-startowy');
        if (startScreen) {
          startScreen.style.display = '';
        }
        const loginScreen = document.getElementById('ekran-logowania');
        if (loginScreen) {
          loginScreen.style.display = 'none';
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email-uzytkownika')?.value.trim().toLowerCase() || '';
        const password = document.getElementById('haslo-uzytkownika')?.value || '';
        const saved = readSecure(STORAGE_KEYS.user, null);

        if (!saved || saved.email !== email || saved.password !== password) {
          showError('blad-logowania', 'Nieprawidłowy email lub hasło. Zarejestruj konto lub sprawdź dane logowania.');
          return;
        }

        const startScreen = document.getElementById('ekran-startowy');
        if (startScreen) {
          startScreen.style.display = '';
        }
        const loginScreen = document.getElementById('ekran-logowania');
        if (loginScreen) {
          loginScreen.style.display = 'none';
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('nowa-nazwa-uzytkownika')?.value.trim() || '';
        const email = document.getElementById('nowy-email-uzytkownika')?.value.trim().toLowerCase() || '';
        const password = document.getElementById('nowe-haslo-uzytkownika')?.value || '';
        const repeatPassword = document.getElementById('powtorz-haslo-uzytkownika')?.value || '';
        const consent = document.getElementById('akceptacja-regulaminu');

        if (username.length < 2) {
          showError('blad-rejestracji', 'Nazwa użytkownika musi mieć co najmniej 2 znaki.');
          return;
        }

        if (!email || !email.includes('@')) {
          showError('blad-rejestracji', 'Podaj poprawny adres email.');
          return;
        }

        if (password.length < 8) {
          showError('blad-rejestracji', 'Hasło musi mieć co najmniej 8 znaków.');
          return;
        }

        if (password !== repeatPassword) {
          showError('blad-rejestracji', 'Hasła nie są identyczne.');
          return;
        }

        if (!consent || !consent.checked) {
          showError('blad-rejestracji', 'Musisz zaakceptować regulamin, aby utworzyć profil.');
          return;
        }

        const profile = { username, email, password };
        writeSecure(STORAGE_KEYS.user, profile);
        writeSecure(STORAGE_KEYS.guest, false);
        setStars(5);

        const startScreen = document.getElementById('ekran-startowy');
        if (startScreen) {
          startScreen.style.display = '';
        }
        const registerScreen = document.getElementById('ekran-logowania');
        if (registerScreen) {
          registerScreen.style.display = 'none';
        }
      });
    }
  }

  function initCalculator() {
    const calc = document.getElementById('kalkulator');
    if (!calc) return;

    calc.innerHTML = `
      <div class="kalkulator-toolbar">
        <label for="kalkulator-formula">Działanie</label>
        <select id="kalkulator-formula">
          <option value="+">Dodawanie</option>
          <option value="-">Odejmowanie</option>
          <option value="*">Mnożenie</option>
          <option value="/">Dzielenie</option>
          <option value="^">Potęga</option>
        </select>
      </div>
      <div class="kalkulator-inputy">
        <input id="kalkulator-a" type="number" step="any" placeholder="Liczba A">
        <input id="kalkulator-b" type="number" step="any" placeholder="Liczba B">
      </div>
      <button id="oblicz-kalkulator" type="button">= Oblicz</button>
      <strong id="wynik-kalkulatora">Wynik: -</strong>
    `;

    const button = document.getElementById('oblicz-kalkulator');
    if (button) {
      button.addEventListener('click', () => {
        const formula = document.getElementById('kalkulator-formula')?.value || '+';
        const a = Number(document.getElementById('kalkulator-a')?.value ?? 0);
        const b = Number(document.getElementById('kalkulator-b')?.value ?? 0);
        const resultNode = document.getElementById('wynik-kalkulatora');

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
          resultNode.textContent = 'Wynik: wpisz poprawne liczby';
          return;
        }

        let result = 0;
        switch (formula) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': result = a * b; break;
          case '/': result = b === 0 ? NaN : a / b; break;
          case '^': result = a ** b; break;
          default: result = NaN;
        }

        if (!Number.isFinite(result)) {
          resultNode.textContent = 'Wynik: nie da się policzyć';
          return;
        }

        resultNode.textContent = `Wynik: ${Number(result).toFixed(2).replace(/\.00$/, '')}`;
      });
    }
  }

  function initHintSystem() {
    const hintButton = document.getElementById('przycisk-podpowiedzi');
    const hintBox = document.getElementById('podpowiedz-quizu');

    if (!hintButton) return;

    hintButton.addEventListener('click', () => {
      let stars = getStars();
      const currentQuestion = typeof window.aktualnePytania !== 'undefined' && typeof window.aktualnaPytanieIndex !== 'undefined'
        ? window.aktualnePytania[window.aktualnaPytanieIndex]
        : null;

      if (stars <= 0) {
        if (hintBox) {
          hintBox.hidden = false;
          hintBox.textContent = 'Brak gwiazdek. Ukończ poprawnie pytanie, by zdobyć kolejną podpowiedź.';
        }
        return;
      }

      if (hintBox) {
        const hintText = currentQuestion?.hint || currentQuestion?.wzor || 'Najpierw wpisz dane, potem zidentyfikuj wzór i sprawdź jednostki.';
        hintBox.hidden = false;
        hintBox.textContent = `Podpowiedź: ${hintText}`;
      }

      stars -= 1;
      setStars(stars);
    });
  }

  function initStartState() {
    const loginScreen = document.getElementById('ekran-logowania');
    const startScreen = document.getElementById('ekran-startowy');
    if (loginScreen) loginScreen.style.display = '';
    if (startScreen) startScreen.style.display = 'none';

    const savedStars = getStars();
    setStars(savedStars);
    ensureStarDisplay();
  }

  function attachSafeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .licznik-gwiazdek {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        padding: 7px 12px;
        border-radius: 999px;
        background: #fff4d6;
        border: 1px solid #f8d98a;
        color: #8a5d00;
        font-weight: 700;
      }
      .kalkulator-toolbar {
        display: grid;
        gap: 8px;
        margin-bottom: 12px;
      }
      .kalkulator-inputy {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .kalkulator-inputy input,
      .kalkulator-toolbar select {
        width: 100%;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid #dfe7f5;
        background: #fff;
        color: #21314d;
      }
      #oblicz-kalkulator {
        width: 100%;
        margin-top: 12px;
        padding: 10px 12px;
        border: 0;
        border-radius: 10px;
        background: linear-gradient(135deg, #7b2ff7, #5b5cf6);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
      }
      #wynik-kalkulatora {
        display: block;
        margin-top: 12px;
        color: #1f7a5b;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }

  function safeInit() {
    removeExperiments();
    initAuthFlow();
    initCalculator();
    initHintSystem();
    initStartState();
    attachSafeStyles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit, { once: true });
  } else {
    safeInit();
  }
})();
