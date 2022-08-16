import { formatPrice } from "../../../pomocky/cislovacky";
import { formatDate } from "../../../pomocky/datumovanie";

const NastaveniaMainGraf = {
  colors: ["#ffbb1f", "#2C7AF4", "#0DCF97", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "Rubik, sans-serif",
    },
  },
  rangeSelector: {
    enabled: false,
    inputEnabled: false,
    scrollbar: { enabled: false },
  },
  xAxis: {
    lineColor: "transparent",
    lineWidth: 1,
    offset: 0,
    tickHeight: 50,
    type: "datetime",
    dateTimeLabelFormats: {
      minute: {
        range: true,
      },
    },
    tickColor: "transparent",
    crosshair: {
      color: "#bbbbbb",
    },
    labels: {
      padding: 10,
      style: {
        color: "#8c98a5",
        fontSize: 11.2,
      },
    },
  },

  scrollbar: {
    enabled: true,
    barBorderWidth: 0,
    barHeight: 0,
    buttonBackgroundColor: "transparent",
    buttonArrowColor: "transparent",
    height: 0,
    buttonBorderWidth: 0,
    trackBackgroundColor: "none",
    trackBorderWidth: 0,
  },

  navigator: {
    series: {
      type: "areaspline",
      lineWidth: 2,
      lineColor: "#4677FF",
      color: "rgb(27,31,49)",
      fillOpacity: 0.2,
      compare: "price",
    },
    xAxis: {
      gridZIndex: 3,
      endOnTick: false,
      gridLineColor: "#e7e7e7",
      labels: {
        align: "center",
        style: {
          color: "rgba(255, 255, 255,0.4)",
        },
        zIndex: 4,
      },
    },
    outlineColor: "none",
    maskFill: "rgba(56, 98, 251, 0.08)",
    handles: {
      symbols: ["url(/handles.svg)", "url(/handles.svg)"],
      lineWidth: 1,
      width: 20,
      height: 30,
    },
  },

  yAxis: {
    tickInterval: 20,
    lineColor: "rgba(255, 255, 255, 0.18)",
    lineWidth: 1,
    gridLineWidth: 1,
    gridLineColor: "rgba(255, 255, 255, 0.18)",
    tickColor: "transparent",

    labels: {
      reserveSpace: true,
      padding: 10,
      x: 6,
      style: {
        color: "#8c98a5",
        fontWeight: 550,
        fontSize: 11.2,
      },
      formatter: function () {
        return (this.value > 0 ? "+" : "") + this.value + "%";
      },
    },

    plotLines: [
      {
        value: 0,
        width: 1,
        dashStyle: "dash",
      },
    ],
  },

  plotOptions: {
    series: {
      compare: "percent",
      lineWidth: 2.5,
      states: {
        hover: {
          enabled: true,
          lineWidth: 3,
        },
      },
    },
  },

  legend: {
    layout: "horizontal",
    align: "top",
    verticalAlign: "right",
    style: {
      color: "black",
    },
    backgroundColor: "transparent",
    itemStyle: {
      color: "#b5c6cc",
      fontSize: 12,
    },
    itemHoverStyle: {
      color: "gray",
    },
  },

  tooltip: {
    hideDelay: 50,
    useHTML: true,
    formatter: function () {
      return [`<div class="tooltip-cont-bot"><b>${formatDate(new Date(this.x))} </b></div>`].concat(
        this.points
          ? this.points.map(function (point) {
              let percentChange = Math.round(point.point.change * 100) / 100;

              return [
                `<div class="tooltip-cont"><span class="dot" style="background-color: ${point.series.color}"></span><span class="tooltip-name">${
                  point.series.name
                }:</span> <b class="tooltip-price">€${formatPrice(point.y, ",")}</b> <b class="tooltip-perc">(${
                  (percentChange > 0 ? "+" : "") + percentChange
                }%)</b></div>`,
              ];
            })
          : []
      );
    },
    valueDecimals: 2,
    padding: 0,
    split: true,
    // backgroundColor: "transparent",
    borderWidth: 1,
    // backgroundColor: "red",
    // backgroundColor: "rgba(0, 0, 0, 0.8)",
    // backgroundColor: "white",
    borderRadius: 5,
    // fontSize: 50,
    style: {
      fontSize: 20,
    },
    borderColor: "transparent",
    // borderWidth: 1,
    backgroundColor: "transparent",
    shadow: false,
    distance: 25,
  },
};

export default NastaveniaMainGraf;
