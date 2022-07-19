import React, { useEffect, useState } from "react";
import "./BurzaGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";

function BurzaGraf({ grafRequestData, newData, farbaCiary, index }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("all");
  const [data, setData] = useState({ datasets: [] });

  useEffect(() => {
    grafRequestData(filter, index);
  }, [filter]);

  useEffect(() => {
    setData({
      datasets: [
        {
          label: "Bitcoin",
          data: newData,
          borderColor: farbaCiary ? farbaCiary : "#2c53dd",
        },
      ],
    });
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
          //   display: false,
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
    <div className="burza-chart-div">
      <div className="burza-graf-filter" id="graf-filter">
        <ul>
          <li style={{ backgroundColor: filter === "1d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1d")}>
            1D
          </li>
          <li style={{ backgroundColor: filter === "7d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("7d")}>
            7D
          </li>
          <li style={{ backgroundColor: filter === "3m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("3m")}>
            3M
          </li>
          <li style={{ backgroundColor: filter === "all" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("all")}>
            All
          </li>
        </ul>
      </div>
      <Line options={options} data={data}></Line>
    </div>
  );
}

export default BurzaGraf;
