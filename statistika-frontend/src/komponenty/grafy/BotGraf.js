import React, { useEffect, useState, useMemo, useRef } from "react";
import "./BotGraf.css";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler, LineController } from "chart.js";
import { Line } from "react-chartjs-2";

import "chartjs-adapter-moment";
import "chartjs-plugin-lineheight-annotation";

import CrosshairPlugin from "chartjs-plugin-crosshair";

function BotGraf({ grafRequestData, newData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler, CrosshairPlugin);

  const [filter, setFilter] = useState("1y");
  const chartRef = useRef(null);

  useEffect(() => {
    grafRequestData(filter);
  }, [filter, grafRequestData]);

  const data = useMemo(() => {
    let ctx = chartRef.current;
    let gradient = null;
    if (ctx != null) {
      ctx = ctx.canvas.getContext("2d");
      gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, "rgba(56,97,251, 0.34)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");
    }
    return {
      datasets: [
        {
          fill: true,
          label: "Bitcoin",
          data: newData,
          borderColor: "#3861FB",
          backgroundColor: gradient,
        },
      ],
    };
  }, [newData]);

  const getChartData = (canvas) => {
    return {
      datasets: [
        {
          label: "Bitcoin",
          data: newData,
          borderColor: "#2c53dd",
          fill: "start",
          backgroundColor: "#ccd5f6",
        },
      ],
    };
  };

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 600 / 400,
    type: "line",
    responsive: true,
    pointHoverRadius: 7,
    pointRadius: 0,
    interpolate: true,
    elements: {
      line: {
        borderWidth: 3,
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
          color: "#bbbbbb",
          autoSkip: true,
          maxTicksLimit: 6,
          maxRotation: 0,
          font: {
            weight: 550,
          },
        },
      },
      y: {
        type: "linear",
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.18)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          offset: true,

          tickWidth: 0,
        },

        ticks: {
          callback: function (value, index, ticks) {
            return "$" + value;
          },
          color: "#bbbbbb",
          font: {
            weight: 550,
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
      },
    },
  };

  return (
    <div className="bot-chart-div">
      <div className="bot-graf-filter" id="graf-filter">
        <ul>
          <li style={{ backgroundColor: filter === "1d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1d")}>
            1D
          </li>
          <li style={{ backgroundColor: filter === "7d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("7d")}>
            7D
          </li>
          <li style={{ backgroundColor: filter === "1m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1m")}>
            1M
          </li>
          <li style={{ backgroundColor: filter === "3m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("3m")}>
            3M
          </li>
          <li style={{ backgroundColor: filter === "1y" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1y")}>
            1Y
          </li>
          <li style={{ backgroundColor: filter === "all" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("all")}>
            All
          </li>
        </ul>
      </div>
      <Line ref={chartRef} options={options} data={data}></Line>
    </div>
  );
}

export default BotGraf;
