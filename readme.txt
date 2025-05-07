Estructura de el historial de juegos
{
  "quizHistory": [
    {
      "date": "2024-05-06T14:30:00.000Z"
      "questions": [
        {
          "question": "lalala",
          "correctAnswer": "True",
          "userAnswer": "True",
          "isCorrect": true
        }
        // ... más preguntas
      ],
      "gameStats": {
        "correct": 8,
        "wrong": 2
      }
    }
    // ... más juegos
  ],
  "quizStats": {
    "totalCorrect": 25, //Estos datos son de todos los juegos
    "totalWrong": 10
  }
}

Formatear el date para mayor legibilidad

const gameDate = new Date(lastGame.date).toLocaleString();



Ejemplos para popular el js de gráficas 

function showGameStats(gameIndex) {
  const history = JSON.parse(localStorage.getItem("quizHistory"));
  const game = history[gameIndex];
  
  document.getElementById("game-correct").textContent = game.gameStats.correct;
  document.getElementById("game-wrong").textContent = game.gameStats.wrong;
}

Opción para poner los resultados de la última partida

const history = JSON.parse(localStorage.getItem("quizHistory"));
const lastGame = history[history.length - 1];
(sería ver en home.html en el div de quizz dónde podría encajar si se hace)



  /* ESTO EN EL MAIN HTML! Ventana emergente para seleccionar categoria y dificultad
    <div id="modalQuizzConfig" class="modal" style="display: none;">
        <div class="modal-content">
            <h2>Configura tu Quizz</h2>
            
            <!-- Dropdown Categoría -->
           <label for="category">Category:</label>
            <select id="category">
                <!-- Las opciones se llenarán con JS -->
            </select>

            <!-- Dropdown Dificultad -->
            <label for="dificultad">Dificultad:</label>
            <select id="difficulty">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
            </select>
    
            <!-- Botón para redirigir -->
            <button id="btnComenzarQuizz">Comenzar</button>
        </div>
    </div>

    //EN EL CSS

    .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
}

.modal-content select, .modal-content button {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
}



*/

EJEMPLO PREGUNTAS (no hacer caso) 


  questions = {
    response_code: 0,
    results: [
      {
        category: "Entertainment: Board Games",
        correct_answer: "House",
        difficulty: "easy",
        incorrect_answers: ["Custom", "Extra", "Change"],
        question:
          "In board games, an additional or ammended rule that applies to a certain group or place is informally known as a &quot;what&quot; rule?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "True",
        difficulty: "easy",
        incorrect_answers: ["False"],
        question:
          "In the Dungeons and Dragons universe, Beshaba is the deity of bad luck. ",
        type: "boolean",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Europa Universalis",
        difficulty: "medium",
        incorrect_answers: [
          "Europe and the Universe",
          "Europa!",
          "Power in Europe",
        ],
        question:
          "Europa Universalis is a strategy video game based on which French board game?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Berlin",
        difficulty: "hard",
        incorrect_answers: ["Ho Chi Minh City", "Lagos", "Karachi"],
        question:
          "Which of these cities is NOT featured in the Pandemic board game?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Carcassonne",
        difficulty: "easy",
        incorrect_answers: ["Paris", "Marseille", "Clermont-Ferrand"],
        question: "Carcassonne is based on which French town?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Senet",
        difficulty: "hard",
        incorrect_answers: ["Chess", "Checkers", "Go"],
        question: "What is the world&#039;s oldest board game?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Go",
        difficulty: "medium",
        incorrect_answers: ["Chess", "Mahjong", "Shogi"],
        question: "Which of the following tabletop games is the oldest?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "21",
        difficulty: "easy",
        incorrect_answers: ["24", "15", "18"],
        question: "How many dots are on a single die?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Bishop and Rook",
        difficulty: "medium",
        incorrect_answers: [
          "Rook and King",
          "Knight and Bishop",
          "King and Knight",
        ],
        question:
          "In Chess, the Queen has the combined movement of which two pieces?",
        type: "multiple",
      },
      {
        category: "Entertainment: Board Games",
        correct_answer: "Go to jail",
        difficulty: "medium",
        incorrect_answers: [
          "Get paid $200",
          "Pay $200",
          "Move to Free Parking",
        ],
        question: "What happens when you roll 3 doubles in a row in Monopoly?",
        type: "multiple",
      },
    ],
  };
