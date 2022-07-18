import React, { useEffect, useState } from "react";
import "./Graf.css";
import axios from "axios";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
// import "chartjs-adapter-moment";
import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";

function MainGraf({ grafRequestData, newData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("1y");
  const [chartData, setchData] = useState([]);

  const [data, setData] = useState({ datasets: [] });

  useEffect(() => {
    // console.log(newData);
    setchData(newData);
  }, [newData]);

  useEffect(() => {
    grafRequestData(filter);
  }, [filter]);

  useEffect(() => {
    // timeRequest("1d");
  }, []);

  useEffect(() => {
    // console.log(chartData);
    setData({
      datasets: [
        {
          // parsing: false,
          label: "Bitcoin",
          data: chartData[0],
          borderColor: "#ffbb1f",
          borderDash: [5, 5],
        },
        {
          backgroundColor: "#2c53dd",
          label: "Bot Eur",
          data: chartData[1],
          borderColor: "#2c53dd",
        },
        {
          label: "Bot Btc",
          data: chartData[2],
          borderColor: "#00E5B0",
        },
      ],
    });
  }, [chartData]);

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
          maxTicksLimit: 10,
          maxRotation: 0,
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
            size: 13,
            weight: "bold",
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
      <div className="graf-filter">
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
