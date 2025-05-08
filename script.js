// ======================
//  CONSTANTS & SELECTORS
// ======================

const DOM = {
  quizOption: document.getElementById("btnStart"),
  categorySelect: document.getElementById("category"),
  difficultySelect: document.getElementById("difficulty"),
  btnStartQuiz: document.getElementById("btnComenzarQuizz"),
  modal: document.getElementById("modalQuizzConfig"),
  languageSelect: document.getElementById("language"),
  LANGUAGE_CODES: {
    en: "English",
    es: "Spanish",
    fr: "French",
  },
};
const HTML_ENTITIES = {
  "&#039;": "'",
  "&quot;": '"',
  "&amp;": "&",
  "&ntilde;": "ñ",
  "&Ntilde;": "Ñ",
  "&lt;": "<",
  "&gt;": ">",
  "&iacute;": "í",
  "&eacute;": "é",
  "&oacute;": "ó",
  "&aacute;": "á",
  "&uacute;": "ú",
  "&uuml;": "ü",
  "&Uuml;": "Ü",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&hellip;": "...",
}; //La API de openDB devuelve los textos como htmlEntityes para evitar CORS

const decodeHtmlEntities = (() => {
  const entityRegex = /&[^;]+;/g;
  return (text) =>
    text
      ? text.replace(entityRegex, (match) => HTML_ENTITIES[match] || match)
      : text;
})();

const LIBRETRANSLATE_API_KEY = "conseguirapikey";
const LIBRETRANSLATE_URL = "https://libretranslate.com/translate";

// ======================
//  INITIALIZATION
// ======================

async function initApp() {
  try {
    await loadDropdowns();
    setupEventListeners();
  } catch (error) {
    handleCriticalError(error);
  }
}

// ======================
//  DROPDOWNS LOADING
// ======================

async function loadDropdowns() {
  try {
    const categoriesResponse = await fetch(
      "https://opentdb.com/api_category.php"
    );

    if (!categoriesResponse.ok) throw new Error("API Error");
    const categoriesData = await categoriesResponse.json();

    setupSelect(
      DOM.categorySelect,
      categoriesData.trivia_categories,
      "id",
      "name",
      "-- Select category--"
    );
    setupSelect(
      DOM.difficultySelect,
      [
        { id: "any", name: "Random" },
        { id: "easy", name: "Easy" },
        { id: "medium", name: "Medium" },
        { id: "hard", name: "Hard" },
      ],
      "id",
      "name",
      "-- Select difficulty --"
    );
  } catch (error) {
    console.error("Error loading dropdowns:", error);
    throw error;
  }
}

function setupSelect(selectElement, items, valueKey, textKey, placeholderText) {
  selectElement.replaceChildren();

  const placeholderOption = new Option(placeholderText, "");
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  selectElement.add(placeholderOption);

  items.forEach((item) => {
    selectElement.add(new Option(item[textKey], item[valueKey]));
  });
}

// ======================
//  API FUNCTIONS
// ======================

async function getQuizQuestions(filters) {
  try {
    let apiUrl = "https://opentdb.com/api.php?amount=10";

    if (filters.category && filters.category !== "any") {
      apiUrl += `&category=${filters.category}`;
    }

    if (filters.difficulty && filters.difficulty !== "any") {
      apiUrl += `&difficulty=${filters.difficulty}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error("API Error");
    return await response.json();
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
}

// ======================
// QUIZ LOGIC
// ======================

async function getTranslatedQuizQuestions(filters) {
  try {
    const { results: questions } = await getQuizQuestions(filters);
    const targetLang = DOM.languageSelect.value;

    return targetLang === "en"
      ? processQuestions(questions, (q) => q)
      : processQuestions(questions, translateQuestionTexts(targetLang));
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

// ======================
//  TRANSLATION FUNCTION
// ======================

function translateQuestionTexts(targetLang) {
  return async (question) => {
    const [questionText, correctAnswer, ...incorrectAnswers] =
      await Promise.all([
        translateText(decodeHtmlEntities(question.question), targetLang),
        translateText(decodeHtmlEntities(question.correct_answer), targetLang),
        ...question.incorrect_answers.map((ans) =>
          translateText(decodeHtmlEntities(ans), targetLang)
        ),
      ]);

    return {
      ...question,
      question: questionText,
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
    };
  };
}

async function processQuestions(questions, processor) {
  return Promise.all(questions.map(processor));
}

async function translateText(text, targetLang) {
  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { translatedText } = await response.json();
    const result = translatedText || text;

    return result;
  } catch (error) {
    console.error(`Translation failed for "${text}" to ${targetLang}:`, error);
    return text;
  }
}

// ======================
//  EVENT HANDLERS
// ======================

function setupEventListeners() {
  DOM.quizOption.addEventListener("click", () => {
    DOM.modal.style.display = "flex";
  });

  DOM.btnStartQuiz.addEventListener("click", handleStartQuiz);

  DOM.modal.addEventListener("click", (e) => {
    if (e.target === DOM.modal) DOM.modal.style.display = "none";
  });
}

// ======================
// START QUIZ HANDLER
// ======================

async function handleStartQuiz() {
  try {
    const filters = {
      category: DOM.categorySelect.value,
      difficulty: DOM.difficultySelect.value,
      language: DOM.languageSelect.value,
    };

    const questionsData = await getTranslatedQuizQuestions(filters);

    sessionStorage.setItem("quizFilters", JSON.stringify(filters));
    sessionStorage.setItem("quizQuestions", JSON.stringify(questionsData));

    window.location.href = "question.html";
  } catch (error) {
    console.error("Error starting quiz:", error);
    alert("Error starting quiz. Try again");
  }
}

// ======================
//  ERROR HANDLING
// ======================

function handleQuizError(error) {
  console.error("Quiz error:", error);
  alert("Quiz error.");
}

function handleCriticalError(error) {
  console.error("App initialization error:", error);
  alert("App initialization error, reloading page...");
  window.location.reload();
}

// ======================
//  INIT APP
// ======================

document.addEventListener("DOMContentLoaded", initApp);
