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
        data: [2, 5, 8, 6, 5, 9, 2, 3, 7, 10, 4, 8]
      }
    ],
    stroke: {
      curve:"smooth",
      width: [4, 4]
    },
    xaxis: {
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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