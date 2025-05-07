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
