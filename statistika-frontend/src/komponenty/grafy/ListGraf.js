import React, { useMemo } from "react";

import { Chart, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import CrosshairPlugin from "chartjs-plugin-crosshair";

function ListGraf({ newData }) {
  Chart.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);

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
    type: "line",
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
      line: { borderWidth: 2 },
    },
    // animation: {
    //   duration: 0,
    // },
    tooltips: { enabled: false },
    hover: { mode: null },
    scales: {
      x: {
        grid: {
          display: false,
          borderWidth: 0,
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
          borderWidth: 0,
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
      <div style={{ width: "100%", height: "100%" }} className="chart-div">
        <Line options={options} data={data}></Line>
      </div>
    )
  );
}

export default ListGraf;
