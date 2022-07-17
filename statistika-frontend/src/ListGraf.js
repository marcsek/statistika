import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import "chartjs-adapter-moment";

function ListGraf(grafData) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

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
          display: false, //this will remove only the label
        },
        type: "time",
        time: {
          unit: "year",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false, //this will remove only the label
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const labels = faker.date.betweens("2015-01-01", "2015-01-30", 50);

  const data = {
    labels: grafData.labels,
    datasets: [
      {
        data: grafData.data,
        borderColor: grafData.data[0] > grafData.data.slice(-1)[0] ? "rgb(214,69,93)" : "rgb(79,194,128)",
      },
    ],
  };

  return (
    grafData != null && (
      <div className="chart-div">
        <Line options={options} data={data}></Line>
      </div>
    )
  );
}

export default ListGraf;
