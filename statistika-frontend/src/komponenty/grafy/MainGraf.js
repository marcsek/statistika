import React, { useEffect, useState, useMemo } from "react";
import "./MainGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";

function MainGraf({ grafRequestData, newData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("1y");

  useEffect(() => {
    grafRequestData(filter);
  }, [filter, grafRequestData]);

  const data = useMemo(() => {
    return {
      datasets: [
        {
          label: "Bitcoin",
          data: newData[0],
          borderColor: "#ffbb1f",
          borderDash: [5, 5],
        },
        {
          backgroundColor: "#2c53dd",
          label: "Bot Eur",
          data: newData[1],
          borderColor: "#3861FB",
        },
        {
          label: "Bot Btc",
          data: newData[2],
          borderColor: "#00E5B0",
        },
      ],
    };
  }, [newData]);

  const options = {
    type: "line",
    responsive: true,
    pointHoverRadius: 7,
    pointRadius: 0,
    lineTension: 0,
    interpolate: true,

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
          borderWidth: 0,
        },
        ticks: {
          color: "#bbbbbb",
          autoSkip: true,
          maxTicksLimit: 15,
          minTicksLimit: 15,
          maxRotation: 0,
          font: {
            weight: 550,
            size: 13,
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
            size: 13,
          },
        },
      },
    },
    plugins: {
      legend: {
        align: "start",
        position: "top",
        fullSize: false,
        labels: {
          // usePointStyle: true,
          color: "#bbbbbb",
          padding: 50,
          font: {
            size: 14,
            weight: 550,
          },
        },
      },
      crosshair: {
        line: {
          color: "#bbbbbb",
          width: 1,
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
    <div className="main-chart-div">
      <div className="main-graf-filter" id="graf-filter">
        <ul>
          <li style={{ backgroundColor: filter == "1d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1d")}>
            1D
          </li>
          <li style={{ backgroundColor: filter == "7d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("7d")}>
            7D
          </li>
          <li style={{ backgroundColor: filter == "1m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1m")}>
            1M
          </li>
          <li style={{ backgroundColor: filter == "3m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("3m")}>
            3M
          </li>
          <li style={{ backgroundColor: filter == "1y" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1y")}>
            1Y
          </li>
          <li style={{ backgroundColor: filter == "all" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("all")}>
            All
          </li>
        </ul>
      </div>
      <Line options={options} data={data}></Line>
    </div>
  );
}

export default MainGraf;
