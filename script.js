let timeLeft = 120;
let timer;
const audio = document.getElementById("timerAudio");
// audio.playbackRate = 0.5;
let score = 0;
let result = "Failed";
let currentQuestionIndex = 0;
let quiz = [];
let incorrectAnswers = [];
const PASSING_SCORE = 20;

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  audio.play();

  fetchQuizQuestion();

  startTimer();
});

document.getElementById("restart-btn").addEventListener("click", () => {
  timeLeft = 120;
  score = 0;
  currentQuestionIndex = 0;
  incorrectAnswers = [];

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
    quiz = shuffledQuestion.slice(0, 10);
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
  if (currentQuestionIndex >= quiz.length) return; // No more questions

  const question = quiz[currentQuestionIndex];
  if (!question) return;

  document.getElementById(
    "question"
  ).innerHTML = `<h2>${question.question}</h2>`;
  const optionsDiv = document.querySelector(".options");
  optionsDiv.innerHTML = ""; // Clear existing options

  switch (question.type) {
    case "text":
      optionsDiv.innerHTML = `
        <input type="text" id="text-answer" placeholder="Type your answer here">
      `;
      break;

    case "options":
      question.options.forEach((option) => {
        optionsDiv.innerHTML += `
          <label>
            <input type="radio" name="answer" value="${option}">
            ${option}
          </label><br>
        `;
      });
      break;

    case "image":
      question.options.forEach((option) => {
        optionsDiv.innerHTML += `
          <label>
            <input type="radio" name="answer" value="${option.answer}">
            <img src="${option.src}" alt="${option.answer}" style="width: 100px; height: 100px; margin: 5px; border: 1px solid #ddd; border-radius: 5px;">
          </label><br>
        `;
      });
      break;

    default:
      console.error("Unknown question type:", question.type);
      break;
  }
};
const checkAnswer = () => {
  const question = quiz[currentQuestionIndex];
  let isCorrect = false;
  let userAnswer = "";

  if (question.type === "text") {
    const answerField = document.getElementById("text-answer");
    userAnswer = answerField.value.trim().toLowerCase();
    isCorrect = userAnswer === question.answer.toLowerCase();
  } else if (question.type === "options" || question.type === "image") {
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked'
    );
    if (selectedOption) {
      userAnswer = selectedOption.value;
      isCorrect = userAnswer === question.answer;
    }
  } else {
    console.error("Unknown question type:", question.type);
  }

  if (isCorrect) {
    score += 5;
  } else if (userAnswer) {
    // Only record incorrect answers if an answer was provided
    incorrectAnswers.push({
      question: question.question,
      answer: userAnswer,
      correct: question.answer,
    });
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

  let incorrectAnswersHTML = "";
  incorrectAnswers.forEach((item) => {
    incorrectAnswersHTML += `
      <p><strong>Question:</strong> ${item.question}<br>
      <strong>Your Answer:</strong> ${item.answer}<br>
      <strong>Correct Answer:</strong> ${item.correct}</p>
    `;
  });

  document.getElementById(
    "score"
  ).innerHTML = `Your score is: ${score}<br>Status: ${result}<br><br>Incorrect Answers:<br>${incorrectAnswersHTML}`;
};

document.getElementById("submit-btn").addEventListener("click", checkAnswer);
