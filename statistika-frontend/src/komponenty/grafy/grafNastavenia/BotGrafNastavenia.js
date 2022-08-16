import { formatPrice } from "../../../pomocky/cislovacky";

const NastaveniaBotGrafu = {
  maintainAspectRatio: true,
  aspectRatio: 600 / 350,
  type: "line",
  responsive: true,
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
  scales: {
    x: {
      type: "time",
      display: true,
      grid: {
        color: "rgba(0, 0, 0, 0)",
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
      grid: {
        color: "#3E4852",
        borderColor: "transparent",
        offset: true,

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