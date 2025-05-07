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
  LANGUAGE_CODES : {
    en: "English",
    es: "Spanish",
    fr: "French"
  }
};

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
          correct_answer: await translateText(question.correct_answer, targetLang),
          incorrect_answers: await Promise.all(
            question.incorrect_answers.map(ans => 
              translateText(ans, targetLang))
          )
        });
      }
  
      return translatedQuestions;
    } catch (error) {
      console.error("Translating error: ", error);
      throw error;
    }
  }

// ======================
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
      })
    });
    
    const data = await response.json();
    return data.translatedText || text; 
  } catch (error) {
    console.error("Traduction error:", error);
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
        language: DOM.languageSelect.value 
      };
  
      const questionsData = await getTranslatedQuizQuestions(filters);

      sessionStorage.setItem("quizFilters", JSON.stringify(filters));
      sessionStorage.setItem("quizQuestions", JSON.stringify(questionsData));
  
      window.location.href = "quiz.html";
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
