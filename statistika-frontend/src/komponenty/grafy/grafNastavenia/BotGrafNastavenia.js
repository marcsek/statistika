import { formatPrice } from "../../../pomocky/cislovacky";
const NastaveniaBotGrafu = {
  maintainAspectRatio: false,
  // aspectRatio: 600 / 350,
  type: "line",
  responsive: true,
  responsiveAnimationDuration: 0,
  pointHoverRadius: 7,
  pointRadius: 0,
  interpolate: true,
  elements: {
    line: {
      borderWidth: 2,
    },
  },

  interaction: {
    mode: "index",
    intersect: false,
  },
  transitions: {
    duration: 0,
  },
  animation: {
    duration: 0,
  },
  scales: {
    x: {
      type: "time",
      display: true,
      grid: {
        color: "rgba(0, 0, 0, 0)",
        borderColor: "transparent",
      },
      ticks: {
        color: "#8c98a5",
        autoSkip: true,
        maxTicksLimit: 6,
        maxRotation: 0,
        font: {
          weight: 500,
          family: "Roboto, sans-serif",
          size: 11,
        },
      },
    },
    y: {
      type: "linear",
      display: true,
      // grace: 20000,
      grid: {
        circular: true,

        color: "#3E4852",
        borderColor: "transparent",
        offset: true,
        // zeroLineColor: "#ffcc33",
        tickWidth: 0,
      },

      ticks: {
        callback: function (value, index, ticks) {
          return "€ " + formatPrice(value, ",");
        },
        color: "#8c98a5",
        font: {
          weight: 500,
          family: "Roboto, sans-serif",
          size: 11,
        },
        maxTicksLimit: 8,
        minTickLimit: 8,
      },
    },
  },
  plugins: {
    autocolors: false,
    annotation: {
      annotations: {
        line1: {
          type: "line",
          yMin: (e) => {
            return e.chart.config.data.datasets[0].data[0]?.y;
          },
          yMax: (e) => {
            return e.chart.config.data.datasets[0].data[0]?.y;
          },
          borderColor: "white",
          backgroundColor: "transparent",
          borderWidth: 1,
          borderDash: [1, 8],
        },
      },
    },
    legend: {
      display: false,
    },
    crosshair: {
      line: {
        color: "#bbbbbb",
        width: 0,
        dashPattern: [3, 3],
      },
      sync: {
        enabled: false,
      },
      pan: {
        incrementer: 3,
      },
      zoom: {
        enabled: false,
      },
      snap: {
        enabled: true,
      },
    },
    tooltip: {
      // mode: "interpolate",
      caretPadding: 12,
      usePointStyle: true,
      backgroundColor: "#272933da",
      titleColor: "#b5c6cc",
    },
  },
};

export default NastaveniaBotGrafu;
