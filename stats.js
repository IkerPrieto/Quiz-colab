const DOMINE = {
  chartContainer: document.querySelector("#chart"),
  quizHistory: JSON.parse(localStorage.getItem("quizHistory")) || [],
};

// ======================
//  CHART CONFIGURATION
// ======================

document.addEventListener("DOMContentLoaded", function () {
  try {
    if (DOMINE.quizHistory.length === 0) {
      DOMINE.chartContainer.innerHTML =
        '<p class="no-data">No quiz data available yet. Complete a quiz to see your stats!</p>';
      return;
    }

    // Procesar datos para el gráfico
    const dailyStats = processQuizHistory(DOMINE.quizHistory);

    // Configurar y renderizar el gráfico
    renderProgressChart(dailyStats);
  } catch (error) {
    console.error("Error loading chart:", error);
    DOMINE.chartContainer.innerHTML =
      '<p class="error">Could not load statistics chart. Please try again later.</p>';
  }
});

function processQuizHistory(history) {
  const dailyData = {};

  // Agrupar resultados por fecha
  history.forEach((game) => {
    const gameDate = game.date.split("T")[0]; // Formato YYYY-MM-DD
    if (!dailyData[gameDate]) {
      dailyData[gameDate] = {
        scores: [],
        correct: 0,
        total: 0,
      };
    }

    const correctAnswers = game.gameStats.correct;
    dailyData[gameDate].scores.push(correctAnswers);
    dailyData[gameDate].correct += correctAnswers;
    dailyData[gameDate].total += game.gameStats.correct + game.gameStats.wrong;
  });

  // Preparar datos para el gráfico
  const categories = [];
  const averages = [];
  const successRates = [];

  Object.keys(dailyData)
    .sort()
    .forEach((date) => {
      const day = dailyData[date];
      const avgScore =
        day.scores.reduce((a, b) => a + b, 0) / day.scores.length;
      const successRate = (day.correct / day.total) * 100;

      categories.push(date);
      averages.push(parseFloat(avgScore.toFixed(1)));
      successRates.push(parseFloat(successRate.toFixed(1)));
    });

  return { categories, averages, successRates };
}

function renderProgressChart({ categories, averages, successRates }) {
  const options = {
    chart: {
      type: "line",
      height: 280,
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Average Score",
        data: averages,
        type: "line",
      },
      {
        name: "Success Rate (%)",
        data: successRates,
        type: "area",
      },
    ],
    stroke: {
      curve: "smooth",
      width: [3, 1],
      dashArray: [0, 3],
    },
    colors: ["#528cf2", "#4CAF50"],

    xaxis: {
      categories: categories,
      labels: {
        formatter: function (value) {
          return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Score",
          style: {
            color: "#528cf2",
          },
        },
        min: 0,
        max: 10,
        tickAmount: 5,
        labels: {
          formatter: function (value) {
            return value.toFixed(0);
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Success %",
          style: {
            color: "#4CAF50",
          },
        },
        min: 0,
        max: 100,
        tickAmount: 5,
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter: function (value) {
          return new Date(value).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
      y: [
        {
          formatter: function (value) {
            return `${value}/10 correct answers`;
          },
        },
        {
          formatter: function (value) {
            return `${value}% success rate`;
          },
        },
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}
