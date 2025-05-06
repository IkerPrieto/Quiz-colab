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

async function handleStartQuiz() {
  try {
    const filters = {
      category: DOM.categorySelect.value,
      difficulty: DOM.difficultySelect.value,
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
