// Recuperamos los datos de localStorage
const stored = localStorage.getItem("quizHistory");

// Parseamos los datos del localStorage
const parsed = stored ? JSON.parse(stored) : [];

// Obtenemos el último resultado del array
const lastEntry = parsed.length > 0 ? parsed[parsed.length - 1] : {};

// Extraemos el número de respuestas correctas
const correctAnswers = lastEntry.gameStats?.correct || 0;

// Referencias a los elementos del DOM
const imageElement = document.getElementById("result-image");
const messageElement = document.getElementById("result-message");
const btnPlayAgain = document.getElementById("btnPlayAgain");
const modal = document.getElementById("modalQuizzConfig");

// Array con las rutas de las imágenes según el número de respuestas correctas (de 0 a 10) y mensajes motivacionales
const imagePaths = {
  0: {
    image: "images/Number0.png",
    message: "¡No te desanimes! Inténtalo de nuevo.",
  },
  1: {
    image: "images/Number1.png",
    message: "¡Ánimo! Puedes hacerlo mejor.",
  },
  2: {
    image: "images/Number2.png",
    message: "¡Sigue intentándolo!",
  },
  3: {
    image: "images/Number3.png",
    message: "¡Sigue practicando!",
  },
  4: {
    image: "images/Number4.png",
    message: "¡Ya casi lo tienes!",
  },
  5: {
    image: "images/Number5.png",
    message: "¡Bien hecho!",
  },
  6: {
    image: "images/Number6.png",
    message: "¡Muy bien!",
  },
  7: {
    image: "images/Number7.png",
    message: "¡Estás mejorando mucho!",
  },
  8: {
    image: "images/Number8.png",
    message: "¡Impresionante!",
  },
  9: {
    image: "images/Number9.png",
    message: "¡Excelente trabajo!",
  },
  10: {
    image: "images/Number10.png",
    message: "¡Perfecto! ¡Lo has logrado todo!",
  },
};

// Verifica que el valor esté dentro del rango (0 a 10)
const numAnswers = Math.max(0, Math.min(correctAnswers, 10));

// Cambia la imagen y el mensaje según el número de respuestas correctas
imageElement.src = imagePaths[numAnswers].image;
messageElement.textContent = imagePaths[numAnswers].message;

btnPlayAgain.addEventListener("click", () => {
  window.location.href = "question.html";
});
