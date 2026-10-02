// Zaawansowany test: Szczególna Teoria Względności (STW)
const stwQuestions = [
  {
    question: "Dwa statki kosmiczne, A i B, oddalają się od stacji kosmicznej w przeciwnych kierunkach. Stacja mierzy, że statek A porusza się w lewo z prędkością 0,8c, a statek B w prawo z prędkością 0,7c. Jaka jest prędkość statku B mierzona przez obserwatora na pokładzie statku A?",
    options: ["1,50c", "0,96c", "0,88c", "0,75c"],
    answer: 1
  },
  {
    question: "Kwadratowa tarcza o boku a w swoim układzie własnym porusza się względem ziemskiego laboratorium z prędkością v = 0,6c równolegle do jednej ze swoich przekątnych. Jaki kształt i wymiary tarczy zarejestruje obserwator w laboratorium?",
    options: [
      "Kwadrat o boku skróconym do 0,8a.",
      "Prostokąt o bokach a oraz 0,8a.",
      "Romb, którego jedna z przekątnych uległa skróceniu o czynnik 0,8.",
      "Romb, którego obie przekątne uległy skróceniu o czynnik 0,8."
    ],
    answer: 2
  },
  {
    question: "Niestabilna cząstka porusza się w akceleratorze z prędkością, dla której czynnik Lorentza wynosi gamma = 5. W układzie laboratorium detektory zarejestrowały, że cząstka przebyła drogę L od momentu powstania do rozpadu. Ile wynosił czas życia tej cząstki w jej układzie własnym?",
    options: [
      "5L / c",
      "L / (5c)",
      "L / (2*sqrt(6)*c)",
      "sqrt(24)*L / (5c)"
    ],
    answer: 2
  },
  {
    question: "Siła o stałej wartości F działa na cząstkę o masie spoczynkowej m, która początkowo znajdowała się w spoczynku (t=0). Jak zmienia się prędkość v(t) tej cząstki w funkcji czasu laboratorium?",
    options: [
      "Wzrasta liniowo zgodnie ze wzorem v(t) = Ft / m aż do osiągnięcia prędkości światła.",
      "Dąży do granicy c według zależności wykładniczej v(t) = c * (1 - e^(-Ft/mc)).",
      "Dąży asymptotycznie do c zgodnie z zależnością v(t) = Ft / sqrt(m^2 + (Ft/c)^2).",
      "Pozostaje stała, ponieważ masa relatywistyczna cząstki rośnie do nieskończoności."
    ],
    answer: 3
  },
  {
    question: "Pęd relatywistyczny cząstki o masie spoczynkowej m jest równy p = 2mc. Ile wynosi energia kinetyczna (Ek) tej cząstki?",
    options: ["2mc^2", "(sqrt(5) - 1)mc^2", "sqrt(3)mc^2", "1,5mc^2"],
    answer: 1
  },
  {
    question: "Które z poniższych wyrażeń wiążących energię całkowitą E, pęd p oraz masę spoczynkową m cząstki jest prawdziwym niezmiennikiem relatywistycznym (ma taką samą wartość w każdym inercjalnym układzie odniesienia)?",
    options: ["E - pc", "E^2 + p^2*c^2", "E^2 - p^2*c^2", "E / sqrt(1 - v^2/c^2)"],
    answer: 2
  },
  {
    question: "Oddalająca się od Ziemi galaktyka emituje światło o częstotliwości własnej f0. Jeśli prędkość oddalania wynosi v = 0,6c, jaką częstotliwość f zarejestrują astrofizycy na Ziemi?",
    options: ["0,80 f0", "0,50 f0", "0,64 f0", "2,00 f0"],
    answer: 1
  },
  {
    question: "W układzie odniesienia stacji kosmicznej dwa błyski światła (X i Y) pojawiają się jednocześnie w odległości D od siebie. Dla obserwatora lecącego w rakiecie wzdłuż linii łączącej te błyski z prędkością v:",
    options: [
      "Błyski nadal pozostaną bezwzględnie jednoczesne.",
      "Błyski nie będą jednoczesne, a odstęp czasowy między nimi wyniesie delta_t = (gamma * v * D) / c^2.",
      "Odstęp czasowy wyniesie zero, ale odległość między nimi wzrośnie do gamma * D.",
      "Błysk powstały bliżej przodu rakiety zawsze wydarzy się później o stałą wartość D / c."
    ],
    answer: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const progressElement = document.getElementById('progress');
const resultContainer = document.getElementById('result-container');
const quizContainer = document.getElementById('quiz-container');
const scoreElement = document.getElementById('score');

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = new Array(stwQuestions.length).fill(null);
  if (resultContainer) resultContainer.style.display = 'none';
  if (quizContainer) quizContainer.style.display = 'block';
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = stwQuestions[currentQuestionIndex];
  questionElement.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
  
  if (progressElement) {
    progressElement.innerText = `Pytanie ${currentQuestionIndex + 1} z ${stwQuestions.length}`;
  }

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('btn-option');
    if (userAnswers[currentQuestionIndex] === index) {
      button.classList.add('selected');
    }
    button.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(button);
  });

  if (prevButton) {
    prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
  }
  if (nextButton) {
    nextButton.innerText = currentQuestionIndex === stwQuestions.length - 1 ? 'Zakończ Test' : 'Następne';
  }
}

function resetState() {
  while (optionsContainer.firstChild) {
    optionsContainer.removeChild(optionsContainer.firstChild);
  }
}

function selectOption(index) {
  userAnswers[currentQuestionIndex] = index;
  const buttons = optionsContainer.querySelectorAll('.btn-option');
  buttons.forEach((btn, i) => {
    if (i === index) btn.classList.add('selected');
    else btn.classList.remove('selected');
  });
}

function handleNext() {
  if (userAnswers[currentQuestionIndex] == null) {
    alert('Proszę wybrać odpowiedź przed przejściem dalej!');
    return;
  }

  if (currentQuestionIndex < stwQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResults();
  }
}

function handlePrev() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

function showResults() {
  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';
  
  score = 0;
  stwQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) {
      score++;
    }
  });

  scoreElement.innerText = `Twój wynik to ${score} / ${stwQuestions.length} (${Math.round((score/stwQuestions.length)*100)}%)`;
  
  const reviewContainer = document.getElementById('review-container');
  if (reviewContainer) {
    reviewContainer.innerHTML = '<h3>Przegląd Twoich odpowiedzi:</h3>';
    stwQuestions.forEach((q, i) => {
      const qDiv = document.createElement('div');
      qDiv.classList.add('review-item');
      
      const isCorrect = userAnswers[i] === q.answer;
      qDiv.classList.add(isCorrect ? 'correct-item' : 'incorrect-item');
      
      qDiv.innerHTML = `
        <p><strong>Pytanie ${i+1}:</strong> ${q.question}</p>
        <p>Twoja odpowiedź: <span class="ans">${q.options[userAnswers[i]]}</span></p>
        <p>Poprawna odpowiedź: <span class="ans-correct">${q.options[q.answer]}</span></p>
        <hr>
      `;
      reviewContainer.appendChild(qDiv);
    });
  }
}

if (nextButton) nextButton.addEventListener('click', handleNext);
if (prevButton) prevButton.addEventListener('click', handlePrev);

document.addEventListener('DOMContentLoaded', startQuiz);
