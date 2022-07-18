import React, { useEffect, useState } from "react";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import "chartjs-adapter-moment";

function ListGraf({ newData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

  const [data, setData] = useState({ datasets: [] });

  useEffect(() => {
    setData({
      datasets: [
        {
          data: newData,
          borderColor: /*grafData.data[0] > grafData.data.slice(-1)[0] ?*/ "rgb(214,69,93)" /*: "rgb(79,194,128)",*/,
        },
      ],
    });
  }, [newData]);

  const options = {
    responsive: true,
    aspectRatio: 2,
    elements: {
      point: {
        radius: 0,
      },
      line: { borderWidth: 1.5 },
    },
    tooltips: { enabled: false },
    hover: { mode: null },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        type: "time",
      },
      y: {
        type: "linear",
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    newData != null && (
      <div className="chart-div">
        <Line options={options} data={data}></Line>
      </div>
    )
  );
}

export default ListGraf;
