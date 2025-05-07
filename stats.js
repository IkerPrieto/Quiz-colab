// Guardar múltiples intentos por día

const today = new Date().toISOString().split("T")[0]; // Por ejemplo: "2025-05-07"
const score = parseInt(localStorage.getItem("quizHistory")) || 0;

let history = JSON.parse(localStorage.getItem("scoreHistory")) || [];

history.push({ date: today, score });

localStorage.setItem("scoreHistory", JSON.stringify(history));


// Calcular medias por día

// Agrupar por fecha
let grouped = {};

history.forEach(entry => {
  if (!grouped[entry.date]) {
    grouped[entry.date] = [];
  }
  grouped[entry.date].push(entry.score);
});

// Calcular media por fecha
let categories = [];
let data = [];

for (let date in grouped) {
  const scores = grouped[date];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  categories.push(date);
  data.push(parseFloat(avg.toFixed(1))); // Redondeo a 1 decimal
}


// Pintar el gráfico

// Pintar el gráfico
let options = {
  chart: {
    type: "line",
    stacked: false
  },
  dataLabels: {
    enabled: false
  },
  colors: ["#528cf2"],
  series: [
    {
      name: "Result",
      data: data // Aquí se cargan los promedios
    }
  ],
  stroke: {
    curve: "smooth",
    width: [4, 4]
  },
  xaxis: {
    categories: categories // Aquí se cargan las fechas
  },
  yaxis: [
    {
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
        color: "black"
      },
      labels: {
        style: {
          colors: "black"
        }
      }
    }
  ]
};
  
let chart = new ApexCharts(document.querySelector("#chart"), options);
  
chart.render();