import React, { useEffect, useState } from "react";
import "./Graf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
// import "chartjs-adapter-moment";
import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";

function Graf() {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("1h");
  const [labels, setLabels] = useState(faker.date.betweens("2014-01-01", "2015-01-1", 10));

  useEffect(() => {}, [filter]);

  const options = {
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
        },
        ticks: {
          color: "#bbbbbb",
        },
      },
      y: {
        type: "linear",
        time: {
          unit: "minute",
        },
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.18)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          offset: true,
          tickWidth: 0,
        },
        min: 0,
        max: 100,

        ticks: {
          callback: function (val, index) {
            return index % 2 === 0 ? this.getLabelForValue(val) : "";
          },
          callback: function (value, index, ticks) {
            return "$" + value;
          },
          color: "#bbbbbb",
        },
      },
    },
    plugins: {
      legend: {
        align: "start",
        position: "top",
        labels: {
          // usePointStyle: true,
          color: "#bbbbbb",
          padding: 50,
          font: {
            size: 13,
            weight: "bold",
            fontColor: ["blue", "blue", "blue"],
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
          enabled: false,
        },
      },
    },
    tooltip: {
      mode: "interpolate",
    },
  };
  // const labels = faker.date.betweens("2014-01-01", "2015-01-1", 10);

  const data = {
    labels,
    datasets: [
      {
        label: "Bitcoin",
        data: labels.map(() => faker.datatype.number({ min: 1, max: 30 })),
        borderColor: "#ffbb1f",
        borderDash: [5, 5],
      },
      {
        backgroundColor: "#2c53dd",
        label: "Bot Eur",
        data: labels.map(() => faker.datatype.number({ min: 1, max: 30 })),
        borderColor: "#2c53dd",
      },
      {
        label: "Bot Btc",
        data: labels.map(() => faker.datatype.number({ min: 1, max: 30 })),
        borderColor: "#00E5B0",
      },
    ],
  };

  return (
    <div className="main-chart-div">
      <div className="graf-filter">
        <ul>
          <li onClick={() => setFilter("1d")}>1D</li>
          <li onClick={() => setFilter("7d")}>7D</li>
          <li onClick={() => setFilter("1m")}>1M</li>
          <li onClick={() => setFilter("3m")}>3M</li>
          <li onClick={() => setFilter("1y")}>1Y</li>
          <li onClick={() => setFilter("all")}>ALL</li>
        </ul>
      </div>
      <Line options={options} data={data}></Line>
    </div>
  );
}

export default Graf;
