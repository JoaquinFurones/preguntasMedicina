const subjects = [
  "Matemáticas",
  "Ciencias",
  "Historia",
  "Geografía",
  "Literatura",
  "Arte",
  "Deporte",
];
const questions = {
  Matemáticas: [
    {
      question: "¿Cuánto es 2 + 2?",
      answers: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      question: "¿Cuánto es 5 * 6?",
      answers: ["11", "30", "56", "40"],
      correct: 1,
    },
    // más preguntas
  ],
  Ciencias: [
    {
      question: "¿Cuál es la fórmula del agua?",
      answers: ["CO2", "O2", "H2O", "H2O2"],
      correct: 2,
    },
    {
      question: "¿Qué planeta es conocido como el planeta rojo?",
      answers: ["Marte", "Júpiter", "Saturno", "Venus"],
      correct: 0,
    },
    // más preguntas
  ],
  Historia: [
    {
      question: "¿Quién descubrió América?",
      answers: [
        "Cristóbal Colón",
        "Fernando de Magallanes",
        "Hernán Cortés",
        "Amerigo Vespucci",
      ],
      correct: 0,
    },
    {
      question: "¿En qué año comenzó la Segunda Guerra Mundial?",
      answers: ["1939", "1941", "1935", "1945"],
      correct: 0,
    },
    // más preguntas
  ],
  Geografía: [
    {
      question: "¿Cuál es el río más largo del mundo?",
      answers: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
      correct: 0,
    },
    // más preguntas
  ],
  Literatura: [
    {
      question: "¿Quién escribió 'Don Quijote de la Mancha'?",
      answers: [
        "Miguel de Cervantes",
        "William Shakespeare",
        "Gabriel García Márquez",
        "J.K. Rowling",
      ],
      correct: 0,
    },
    // más preguntas
  ],
  Arte: [
    {
      question: "¿Quién pintó la Mona Lisa?",
      answers: [
        "Leonardo da Vinci",
        "Vincent van Gogh",
        "Pablo Picasso",
        "Claude Monet",
      ],
      correct: 0,
    },
    // más preguntas
  ],
  Deporte: [
    {
      question: "¿Cuántos jugadores hay en un equipo de fútbol?",
      answers: ["11", "9", "10", "12"],
      correct: 0,
    },
    // más preguntas
  ],
};

let currentSubject = null;
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  const subjectPanel = document.getElementById("subject-panel");
  subjects.forEach((subject) => {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4"; // Ajusta el tamaño de la columna para las tarjetas

    const card = document.createElement("div");
    card.className = "card subject-card card-hover";
    card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${subject}</h5>
            </div>
        `;
    card.addEventListener("click", () => chooseSubject(subject));
    col.appendChild(card);
    subjectPanel.appendChild(col);
  });

  document
    .getElementById("next-button")
    .addEventListener("click", nextQuestion);

  document.getElementById("ask-chatgpt").addEventListener("click", askChatGPT);

  document
    .getElementById("confirm-reset-button")
    .addEventListener("click", () => {
      resetCacheForCurrentSubject();
    });

  document
    .getElementById("back-to-subjects-from-summary")
    .addEventListener("click", () => {
      document.getElementById("summary-panel").classList.add("d-none");
      document.getElementById("subject-panel").classList.remove("d-none");
    });
});

function chooseSubject(subject) {
  currentSubject = subject;
  currentQuestionIndex = 0;
  document.getElementById("subject-panel").classList.add("d-none");
  document.getElementById("question-panel").classList.remove("d-none");
  loadQuestion();
}

function loadQuestion() {
  const question = questions[currentSubject][currentQuestionIndex];
  const totalQuestions = questions[currentSubject].length;

  document.getElementById("question-header").innerText = `Pregunta ${
    currentQuestionIndex + 1
  } / ${totalQuestions}`;
  document.getElementById("question-text").innerText = question.question;

  const answersElement = document.getElementById("answers");
  answersElement.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "list-group-item list-group-item-action";
    button.innerText = answer;
    button.addEventListener("click", () => checkAnswer(index));
    answersElement.appendChild(button);

    // Marca la respuesta correcta si está almacenada en caché
    const cacheKey = `${currentSubject}_question_${currentQuestionIndex}`;
    const cachedAnswer = localStorage.getItem(cacheKey);
    if (cachedAnswer && parseInt(cachedAnswer) === index) {
      button.classList.add("selected-answer");
    }

    // Aplicar la animación de aparición
    document
      .getElementById("question-panel")
      .classList.add("question-animation");

    // Quitar la clase de animación después de que la animación se haya completado
    setTimeout(() => {
      document
        .getElementById("question-panel")
        .classList.remove("question-animation");
    }, 500); // 500ms es la duración de la animación
  });

  document.getElementById("chatgpt-response").innerText = ""; // Limpiar respuesta previa

  // Verificar si la pregunta ha sido respondida anteriormente
  const cacheKey = `${currentSubject}_question_${currentQuestionIndex}`;
  const cachedAnswer = localStorage.getItem(cacheKey);
  if (cachedAnswer !== null) {
    showCachedAnswer(parseInt(cachedAnswer));
  }
  if (currentQuestionIndex > 0) {
    document.getElementById("prev-button").disabled = false;
  } else {
    document.getElementById("prev-button").disabled = true;
  }
}

function checkAnswer(selectedIndex) {
  const question = questions[currentSubject][currentQuestionIndex];
  const answerButtons = document.getElementById("answers").children;

  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].classList.add("disabled-answer");

    if (i === question.correct) {
      answerButtons[i].classList.add("correct");
    } else {
      answerButtons[i].classList.add("incorrect");
    }
  }

  // Guardar la respuesta en el almacenamiento local
  const cacheKey = `${currentSubject}_question_${currentQuestionIndex}`;
  localStorage.setItem(cacheKey, selectedIndex);

  document.getElementById("next-button").disabled = false;
  // Aplicar la clase de respuesta seleccionada
  Array.from(answerButtons).forEach((button) => {
    if (parseInt(button.dataset.index) === selectedIndex) {
      button.classList.add("selected-answer");
    } else {
      button.classList.remove("selected-answer");
    }
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions[currentSubject].length) {
    loadQuestion();
  } else {
    showSummary();
  }
}

function showSummary() {
  const totalQuestions = questions[currentSubject].length;
  let correctCount = 0;
  let incorrectCount = 0;
  let notAnsweredCount = 0;

  for (let i = 0; i < totalQuestions; i++) {
    const cacheKey = `${currentSubject}_question_${i}`;
    const cachedAnswer = localStorage.getItem(cacheKey);

    if (cachedAnswer === null) {
      notAnsweredCount++;
    } else {
      const correctAnswer = questions[currentSubject][i].correct;
      if (parseInt(cachedAnswer) === correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  }

  const finalGrade = correctCount - 0.25 * incorrectCount;
  const finalGradeOutOf10 = Math.max(
    0,
    Math.min(10, (finalGrade / totalQuestions) * 10)
  );

  document.getElementById(
    "correct-answers"
  ).innerText = `Correctas: ${correctCount}`;
  document.getElementById(
    "incorrect-answers"
  ).innerText = `Incorrectas: ${incorrectCount}`;
  document.getElementById(
    "not-answered"
  ).innerText = `No respondidas: ${notAnsweredCount}`;
  document.getElementById(
    "final-grade"
  ).innerText = `Nota: ${finalGradeOutOf10.toFixed(2)}`;

  document.getElementById("question-panel").classList.add("d-none");
  document.getElementById("summary-panel").classList.remove("d-none");

  // Aplicar la animación de aparición
  document.getElementById("summary-panel").classList.add("question-animation");

  // Quitar la clase de animación después de que la animación se haya completado
  setTimeout(() => {
    document
      .getElementById("summary-panel")
      .classList.remove("question-animation");
  }, 500); // 500ms es la duración de la animación
}

const apiKey = "sk-proj-0tWijRYV9lUD8Xfc6sI8T3BlbkFJaQI8WLN1dEwsMaKc8qOE"; // Reemplaza con tu clave API de OpenAI

function askChatGPT() {
  const questionText = document.getElementById("question-text").innerText;
  const answers = Array.from(document.getElementById("answers").children).map(
    (button) => button.innerText
  );

  const responseDiv = document.getElementById("chatgpt-response");

  responseDiv.innerText = `Cual de las siguientes respuestas sería correcta para el siguiente enunciado:
  Enunciado: ${questionText}
  Posibles respuestas:
  ${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n")}`;
}

function showCachedAnswer(selectedIndex) {
  const question = questions[currentSubject][currentQuestionIndex];
  const answerButtons = document.getElementById("answers").children;

  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].classList.add("disabled-answer");

    if (i === question.correct) {
      answerButtons[i].classList.add("correct");
    } else {
      answerButtons[i].classList.add("incorrect");
    }
  }

  document.getElementById("next-button").disabled = false;
}

function resetCacheForCurrentSubject() {
  const totalQuestions = questions[currentSubject].length;

  for (let i = 0; i < totalQuestions; i++) {
    const cacheKey = `${currentSubject}_question_${i}`;
    localStorage.removeItem(cacheKey);
  }

  loadQuestion(); // Recargar la pregunta actual
}

document
  .getElementById("back-to-subjects-button")
  .addEventListener("click", () => {
    // Ocultar el panel de preguntas
    document.getElementById("question-panel").classList.add("d-none");
    // Mostrar el panel de asignaturas
    document.getElementById("subject-panel").classList.remove("d-none");
    // Desactivar el botón "Siguiente"
    document.getElementById("next-button").disabled = true;
    // Limpiar la respuesta de ChatGPT
    document.getElementById("chatgpt-response").innerHTML = "";
  });

document.getElementById("prev-button").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});
