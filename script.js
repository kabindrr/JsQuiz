let timeLeft = 100;
let timer;
const audio = document.getElementById("timerAudio");
audio.playbackRate = 0.5;
let score = 0;
let currentQuestionIndex = 0;
let quiz = [];

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  audio.play();

  fetchQuizQuestion();

  startTimer();
});

const fetchQuizQuestion = async () => {
  try {
    const response = await fetch("quiz.json");
    const data = await response.json();
    quiz = data.quiz;
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
  question.options.forEach((option) => {
    optionsDiv.innerHTML += `
      <label>
        <input type="radio" name="answer" value="${option}">
        ${option}
      </label><br>
    `;
  });
};

const checkAnswer = () => {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    const selectedAnswer = selectedOption.value;
    const question = quiz[currentQuestionIndex];
    if (selectedAnswer === question.answer) {
      score += 5;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quiz.length) {
      displayQuestion();
    } else {
      showResult();
    }
  } else {
    console.log("No options selected");
  }
};
const showResult = () => {
  audio.pause();
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").textContent = `Your score is: ${score}`;
};

document.getElementById("submit-btn").addEventListener("click", checkAnswer);
