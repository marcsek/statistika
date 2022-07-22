import React, { useEffect, useState, useCallback, useMemo } from "react";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";

import CrosshairPlugin from "chartjs-plugin-crosshair";

function ListGraf({ newData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);

  const data = useMemo(() => {
    let dataCopy = [...(newData ?? [])];

    return {
      datasets: [
        {
          data: dataCopy,
          borderColor: dataCopy[0] > dataCopy.slice(-1)[0] ? "rgb(214,69,93)" : "rgb(79,194,128)",
        },
      ],
    };
  }, [newData]);

  const options = {
    responsive: true,
    aspectRatio: 2,
    elements: {
      point: {
        radius: 0,
      },
      line: { borderWidth: 2 },
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
      crosshair: {
        sync: {
          enabled: false,
        },
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
