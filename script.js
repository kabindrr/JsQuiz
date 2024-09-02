let timeLeft = 60;
let timer;
const audio = document.getElementById("timerAudio");
audio.playbackRate = 0.5;
let score = 0;
let result = "Failed";
let currentQuestionIndex = 0;
let quiz = [];
const PASSING_SCORE = 10;

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  audio.play();

  fetchQuizQuestion();

  startTimer();
});

document.getElementById("restart-btn").addEventListener("click", () => {
  timeLeft = 60;
  score = 0;
  currentQuestionIndex = 0;

  document.getElementById("result").style.display = "none";
  document.getElementById("home-page").style.display = "block";

  audio.pause();
  audio.currentTime = 0;
});

const fetchQuizQuestion = async () => {
  try {
    const response = await fetch("quiz.json");
    const data = await response.json();
    const allQuestions = data.quiz;

    const shuffledQuestion = allQuestions.sort(() => Math.random() - 0.5);
    quiz = shuffledQuestion.slice(0, 5);
    console.log(quiz);
    displayQuestion();
  } catch (error) {
    console.log("Error fetching quiz from json");
  }
};

const startTimer = () => {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);

      showResult();
    }
  }, 1000);
};

const displayQuestion = () => {
  if (currentQuestionIndex >= quiz.length) return;

  const question = quiz[currentQuestionIndex];
  if (!question) return;

  document.getElementById(
    "question"
  ).innerHTML = `<h2>${question.question}</h2>`;

  const optionsDiv = document.querySelector(".options");
  optionsDiv.innerHTML = "";
  question.options.forEach((option) => {
    optionsDiv.innerHTML += `
      <label>
        <input type="radio" name="answer" value="${option}">
        ${option}
      </label><br>
    `;
  });

  if (question.type === "text") {
    optionsDiv.innerHTML = `    <input
        type="text"
        id="text-answer"
        placeholder="type your answer here"
      >`;
  } else if (question.type === "image") {
    question.options.forEach((option) => {
      optionsDiv.innerHTML += `
        <label>
          <input type="radio" name="answer" value="${option.answer}">
          <img src="${option.src}" alt="${option.answer}" style="width: 100px; height: 100px;">
        </label><br>
      `;
    });
  }
};

const checkAnswer = () => {
  const question = quiz[currentQuestionIndex];

  let isCorrect = false;

  if (question.type === "text") {
    const answerField = document.getElementById("text-answer");
    const userAnswer = answerField.value.trim();
    isCorrect = userAnswer === question.answer;
  } else if (question.type === "options") {
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked'
    );
    if (selectedOption) {
      const selectedAnswer = selectedOption.value;
      isCorrect = selectedAnswer === question.answer;
    }
  } else if (question.type === "image") {
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked'
    );
    if (selectedOption) {
      const selectedAnswer = selectedOption.value;
      isCorrect = selectedAnswer === question.answer;
    }
  } else {
    console.error("Unknown question type:", question.type);
  }

  if (isCorrect) {
    score += 5;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < quiz.length) {
    displayQuestion();
  } else {
    showResult();
  }
};

const showResult = () => {
  audio.pause();
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";

  if (score >= PASSING_SCORE) {
    result = "Passed";
  } else {
    result = "Failed";
  }

  document.getElementById(
    "score"
  ).innerHTML = `Your score is: ${score}<br/> status: ${result}`;
};

document.getElementById("submit-btn").addEventListener("click", checkAnswer);
