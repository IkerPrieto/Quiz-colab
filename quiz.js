const DOM = {
  questionTitle: document.querySelector(".questions-container h2"),
  optionButtons: Array.from({ length: 4 }, (_, i) =>
    document.getElementById(`btnOption${i + 1}`)
  ),
  questionNum: document.getElementById("question-number"),
};

const state = {
  currentQuestionIndex: 0,
  questions: [],
  correctAnswer: "",
  allAnswers: [],
};

const Storage = {
  async init() {
    if (!localStorage.getItem("quizHistory")) {
      localStorage.setItem("quizHistory", JSON.stringify([]));
    }
    if (!localStorage.getItem("quizStats")) {
      localStorage.setItem(
        "quizStats",
        JSON.stringify({ totalCorrect: 0, totalWrong: 0 })
      );
    }
  },

  async saveResult(questionObj, userAnswer) {
    try {
      const history = JSON.parse(localStorage.getItem("quizHistory"));
      const stats = JSON.parse(localStorage.getItem("quizStats"));
      const isCorrect = userAnswer === questionObj.correct_answer;

      if (state.currentQuestionIndex === 0) {
        history.push({
          date: new Date().toISOString(),
          questions: [],
          gameStats: { correct: 0, wrong: 0 },
        });
      }

      const currentGame = history.at(-1);

      currentGame.questions.push({
        question: questionObj.question,
        correctAnswer: questionObj.correct_answer,
        userAnswer,
        isCorrect,
      });

      if (isCorrect) {
        currentGame.gameStats.correct++;
        stats.totalCorrect++;
      } else {
        currentGame.gameStats.wrong++;
        stats.totalWrong++;
      }

      localStorage.setItem("quizHistory", JSON.stringify(history));
      localStorage.setItem("quizStats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving result: ", error);
      throw error;
    }
  },
};

const Quiz = {
  async loadQuestion(index) {
    try {
      const question = state.questions[index];
      DOM.questionTitle.textContent = question.question;
      state.correctAnswer = question.correct_answer;

      DOM.optionButtons.forEach((btn) => {
        btn.style.display = "none";
        btn.style.backgroundColor = "";
        btn.style.opacity = "1";
        btn.onclick = null;
      });

      if (question.type === "multiple") {
        state.allAnswers = [
          ...question.incorrect_answers,
          question.correct_answer,
        ];
        this.shuffleArray(state.allAnswers);

        DOM.optionButtons.forEach((btn, i) => {
          btn.style.display = "block";
          btn.textContent = state.allAnswers[i];
          btn.onclick = async () =>
            await this.handleAnswer(state.allAnswers[i]);
        });
      } else {
        DOM.optionButtons[0].style.display = "block";
        DOM.optionButtons[0].textContent = "True";
        DOM.optionButtons[0].onclick = async () =>
          await this.handleAnswer("True");

        DOM.optionButtons[1].style.display = "block";
        DOM.optionButtons[1].textContent = "False";
        DOM.optionButtons[1].onclick = async () =>
          await this.handleAnswer("False");
      }
      DOM.questionNum.textContent = `${index + 1}/10`;
    } catch (error) {
      console.error("Error loading question: ", error);
      alert("Error loading question, reloading...");
      window.location.reload();
    }
  },

  async handleAnswer(selectedAnswer) {
    try {
      DOM.optionButtons.forEach((btn) => {
        btn.onclick = null;
      });

      DOM.optionButtons.forEach((btn) => {
        if (btn.textContent === state.correctAnswer) {
          btn.style.backgroundColor = "#4CAF50";
        } else if (
          btn.textContent === selectedAnswer &&
          selectedAnswer !== state.correctAnswer
        ) {
          btn.style.backgroundColor = "#F44336";
        } else {
          btn.style.opacity = "0.5";
        }
      });

      await Storage.saveResult(
        state.questions[state.currentQuestionIndex],
        selectedAnswer
      );

      setTimeout(async () => {
        await this.nextQuestion();
      }, 1000);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  },

  async nextQuestion() {
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < state.questions.length) {
      await this.loadQuestion(state.currentQuestionIndex);
    } else {
      window.location.href = "results.html";
    }
  },

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
};

async function initQuiz() {
  try {
    await Storage.init();

    const quizData = JSON.parse(sessionStorage.getItem("quizQuestions"));
    if (!quizData) {
      alert("No questions loaded...");
      window.location.href = "index.html";
      return;
    }

    state.questions = quizData;
    await Quiz.loadQuestion(0);
  } catch (error) {
    console.error("Error initializing quiz:", error);
    alert("Error, reloading page...");
    window.location.reload();
  }
}

document.addEventListener("DOMContentLoaded", initQuiz);
