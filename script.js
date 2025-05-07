// ======================
//  CONSTANTS & SELECTORS
// ======================
const DOM = {
  quizOption: document.getElementById("quiz"),
  graphicsOption: document.getElementById("graphics"),
  categorySelect: document.getElementById("category"),
  difficultySelect: document.getElementById("difficulty"),
  btnStartQuiz: document.getElementById("btnComenzarQuizz"),
  modal: document.getElementById("modalQuizzConfig"),
<<<<<<< Updated upstream
=======
  languageSelect: document.getElementById("language"),
  LANGUAGE_CODES: {
    en: "English",
    es: "Spanish",
    fr: "French",
  },
>>>>>>> Stashed changes
};

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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
//  QUIZ LOGIC
// ======================
async function getQuizQuestions(filters) {
  try {
    const url = new URL("https://opentdb.com/api.php");
    url.searchParams.append("amount", "10");
    if (filters.category) url.searchParams.append("category", filters.category);
    if (filters.difficulty !== "Random")
      url.searchParams.append("difficulty", filters.difficulty);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (data.response_code !== 0) throw new Error("API returned no results");

    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
=======
//  TRANSLATION FUNCTION
// ======================

async function translateText(text, targetLang) {
  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
        // api_key: LIBRETRANSLATE_API_KEY
      }),
    });

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Traduction error:", error);
    return text;
>>>>>>> Stashed changes
  }
}

// ======================
//  EVENT HANDLERS
// ======================
function setupEventListeners() {
  DOM.quizOption.addEventListener("click", () => {
    DOM.modal.style.display = "flex";
  });

  DOM.graphicsOption.addEventListener("click", () => {
    window.location.href = "graphics.html"; //cambiar nombre al correcto
  });

  DOM.btnStartQuiz.addEventListener("click", handleStartQuiz);

  DOM.modal.addEventListener("click", (e) => {
    if (e.target === DOM.modal) DOM.modal.style.display = "none";
  });
}

<<<<<<< Updated upstream
=======
// ======================
// QUIZ LOGIC
// ======================
async function getTranslatedQuizQuestions(filters) {
  try {
    const originalQuestions = (await getQuizQuestions(filters)).results;
    const targetLang = DOM.languageSelect.value;

    if (targetLang === "en") return originalQuestions;

    const translatedQuestions = [];

    for (const question of originalQuestions) {
      translatedQuestions.push({
        ...question,
        question: await translateText(question.question, targetLang),
        correct_answer: await translateText(
          question.correct_answer,
          targetLang
        ),
        incorrect_answers: await Promise.all(
          question.incorrect_answers.map((ans) =>
            translateText(ans, targetLang)
          )
        ),
      });
    }

    return translatedQuestions;
  } catch (error) {
    console.error("Translating error: ", error);
    throw error;
  }
}
function decodeSimple(text) {
  return text
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
// ======================
// START QUIZ HANDLER
// ======================
>>>>>>> Stashed changes
async function handleStartQuiz() {
  try {
    const filters = {
      category: DOM.categorySelect.value,
      difficulty: DOM.difficultySelect.value,
<<<<<<< Updated upstream
    };

    const questionsData = await getQuizQuestions(filters);

    sessionStorage.setItem("quizFilters", JSON.stringify(filters));
    sessionStorage.setItem(
      "quizQuestions",
      JSON.stringify(questionsData.results)
    );

    window.location.href = "question.html";
  } catch (error) {
    handleQuizError(error);
  } finally {
    DOM.modal.style.display = "none";
  }
}
=======
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
>>>>>>> Stashed changes

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
