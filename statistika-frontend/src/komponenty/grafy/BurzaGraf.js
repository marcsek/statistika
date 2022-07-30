import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./BurzaGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import { VscTriangleUp, VscTriangleDown, VscCircleFilled } from "react-icons/vsc";
import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import LoadingComponent from "../LoadingComponent";

function BurzaGraf({ grafRequestData, farbaCiary, index }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin, Filler);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("all");
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const [loading, setLoading] = useState({ isLoading: true, hasError: { status: false, msg: "" } });

  const onParentRequestEnd = useCallback(
    async (filter, index) => {
      setLoading((prevState) => {
        return { ...prevState, isLoading: true };
      });
      setChartData(await grafRequestData(filter, index));
      setLoading((prevState) => {
        return { ...prevState, isLoading: false };
      });
    },
    [grafRequestData]
  );

  useEffect(() => {
    onParentRequestEnd(filter, index);
  }, [filter, index, onParentRequestEnd]);

  const data = useMemo(() => {
    let ctx = chartRef.current;
    let gradient = null;
    if (ctx != null) {
      ctx = ctx.canvas.getContext("2d");
      gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, farbaCiary ? farbaCiary.g : "rgba(56,97,251, 0.34)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");
    }
    return {
      datasets: [
        {
          label: "Hodnota",
          data: chartData,
          borderColor: farbaCiary ? farbaCiary.c : "#3861FB",
          backgroundColor: gradient,
          fill: true,
        },
      ],
    };
  }, [chartData, farbaCiary]);

  const options = {
    type: "line",
    responsive: true,
    pointHoverRadius: 7,
    keepAspectRatio: false,
    pointRadius: 0,
    lineTension: 0,
    interpolate: true,

    interaction: {
      mode: "index",
      intersect: false,
    },

    elements: {
      line: {
        borderWidth: 2,
      },
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
            family: "Open Sans",
            size: 10,
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
            return "€ " + formatPrice(value, ",");
          },
          color: "#bbbbbb",
          font: {
            weight: 550,
            family: "Open Sans",
            size: 10,
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
        caretPadding: 12,
      },
    },
  };

  const PercZmenaData = ({ style }) => {
    let perc = getPercentageChange(chartData[0]?.y, chartData?.at(-1)?.y);
    let cena = formatPrice(chartData?.at(-1)?.y - chartData[0]?.y);
    return (
      <div style={style} className="perc-zmena-chart-burza">
        <p id="eur-zmena">
          <MdEuroSymbol /> {(chartData?.at(-1)?.y - chartData[0]?.y < 0 ? "" : "+") + cena}
        </p>
        <span style={{ color: perc < 0 ? "#ea3943" : "" }} id="perc-zmena">
          {perc < 0 ? <VscTriangleDown /> : <VscTriangleUp />} {Math.abs(perc)}%
        </span>
      </div>
    );
  };

  return (
    <div className="burza-chart-main">
      <PercZmenaData style={{ visibility: loading.isLoading ? "hidden" : "" }} />
      {loading.isLoading && <LoadingComponent error={loading.hasError.msg} />}
      <div className="burza-chart-div">
        <Line style={{ display: loading.isLoading ? "none" : "" }} ref={chartRef} options={options} data={data}></Line>
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
      </div>
    </div>
  );
}

export default BurzaGraf;
