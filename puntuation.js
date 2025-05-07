// Recuperamos los datos de localStorage
const stored = localStorage.getItem('quizHistory');

// Parseamos los datos del localStorage
const parsed = stored ? JSON.parse(stored) : [];

// Obtenemos el último resultado del array
const lastEntry = parsed.length > 0 ? parsed[parsed.length - 1] : {};

// Extraemos el número de respuestas correctas
const correctAnswers = lastEntry.gameStats?.correct || 0;

// Referencias a los elementos del DOM
const imageElement = document.getElementById('result-image');
const messageElement = document.getElementById('result-message');

// Array con las rutas de las imágenes según el número de respuestas correctas (de 0 a 10)
const imagePaths = [
  'images/Number0.png',
  'images/Number1.png',
  'images/Number2.png',
  'images/Number3.png',
  'images/Number4.png',
  'images/Number5.png',
  'images/Number6.png',
  'images/Number7.png',
  'images/Number8.png',
  'images/Number9.png',
  'images/Number10.png'
];

// Mensajes motivacionales
const messages = [
  "¡No te desanimes! Inténtalo de nuevo.",
  "¡Ánimo! Puedes hacerlo mejor.",
  "¡Vas por buen camino!",
  "¡Sigue practicando!",
  "¡Ya casi lo tienes!",
  "¡Bien hecho!",
  "¡Muy bien!",
  "¡Estás mejorando mucho!",
  "¡Impresionante!",
  "¡Excelente trabajo!",
  "¡Perfecto! ¡Lo has logrado todo!"
];

// Verifica que el valor esté dentro del rango (0 a 10)
const numAnswers = Math.max(0, Math.min(correctAnswers, 10));

// Cambia la imagen y el mensaje según el número de respuestas correctas
imageElement.src = imagePaths[numAnswers];
messageElement.textContent = messages[numAnswers];