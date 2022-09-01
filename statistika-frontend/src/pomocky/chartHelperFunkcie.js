const normalize = (val, extremeOne, extremeTwo) => {
  let min = Math.min(extremeOne, extremeTwo);
  let max = Math.max(extremeOne, extremeTwo);
  if (max - min === 0) {
    return 1;
  }

  return (val - min) / (max - min);
};

var gradient;
const calculateCrossLineGradient = (ctx) => {
  let firstLinePoint = ctx.p0.parsed.y;
  let secondLinePoint = ctx.p1.parsed.y;
  let chart = ctx.chart;
  let firstPoint = ctx.chart.getDatasetMeta(0).data[0];
  let chartContext = chart.canvas.getContext("2d");
  let chartData = chart.data.datasets[0].data;

  let aboveColor = "rgba(13, 207, 151)";
  let belowColor = "rgba(241, 85, 108)";

  if (firstLinePoint < chartData[0]?.y && secondLinePoint > chartData[0]?.y) {
    gradient = chartContext.createLinearGradient(0, ctx.p0.y, 0, ctx.p1.y);

    let midPoint = 1 - normalize(firstPoint.y, ctx.p0.y, ctx.p1.y);
    if (midPoint < 0 || midPoint > 1) {
      midPoint = 0;
    }
    gradient.addColorStop(midPoint, belowColor);
    gradient.addColorStop(midPoint, aboveColor);
    return gradient;
  }

  if (firstLinePoint > chartData[0]?.y && secondLinePoint < chartData[0]?.y) {
    gradient = chartContext.createLinearGradient(0, ctx.p0.y, 0, ctx.p1.y);
    let midPoint = normalize(firstPoint.y, ctx.p0.y, ctx.p1.y);
    if (midPoint < 0 || midPoint > 1) {
      midPoint = 0;
    }
    gradient.addColorStop(midPoint, aboveColor);
    gradient.addColorStop(midPoint, belowColor);
    return gradient;
  }

  firstLinePoint = chartData[ctx.p0.$context.dataIndex + 1]?.y;
  let farba = firstLinePoint >= chartData[0]?.y ? aboveColor : firstLinePoint <= chartData[0]?.y ? belowColor : "";
  return farba;
};

var subChartLineGradient, upChartLinearGradient, firstPoint;
const getGradients = (ctx) => {
  let chartArea = ctx.chart.chartArea;
  let currentFirstPoint = ctx.chart.getDatasetMeta(0).data[0]?.y;
  if (!chartArea) return;
  if (!currentFirstPoint) return;

  // ak sa zmenila vyska zaciatocneho bodu, tak sa vytvori novy gradient
  if (firstPoint !== currentFirstPoint) {
    firstPoint = currentFirstPoint;

    let chartContext = ctx.chart.canvas.getContext("2d");
    subChartLineGradient = chartContext.createLinearGradient(0, chartArea.top, 0, firstPoint);
    subChartLineGradient.addColorStop(0, "rgba(	13, 207, 151, 0.25)");
    subChartLineGradient.addColorStop(0.5, "rgba(	13, 207, 151, 0.25)");
    subChartLineGradient.addColorStop(0.8, "rgba(	13, 207, 151, 0.05)");
    subChartLineGradient.addColorStop(1, "rgba(	13, 207, 151, 0)");

    upChartLinearGradient = chartContext.createLinearGradient(0, firstPoint, 0, chartArea.bottom);
    upChartLinearGradient.addColorStop(1, "rgba(	241, 85, 108, 0.25)");
    upChartLinearGradient.addColorStop(0.7, "rgba(	241, 85, 108, 0.25)");
    upChartLinearGradient.addColorStop(0, "rgba(	241, 85, 108, 0)");
    ctx.chart.update();
  }

  return {
    target: { value: ctx.chart.data.datasets[0].data[0]?.y },
    above: subChartLineGradient,
    below: upChartLinearGradient,
  };
};

const getPointBackgroundColor = (ctx) => {
  let chart = ctx.chart;
  if (chart.data.datasets[0].data[ctx.index]?.y >= chart.data.datasets[0].data[0]?.y) {
    return "rgba(	13, 207, 151)";
  }
  return "rgba(	241, 85, 108)";
};

export { calculateCrossLineGradient, getGradients, getPointBackgroundColor };
