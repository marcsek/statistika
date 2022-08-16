import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./BotGraf.css";

import { Chart, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import "chartjs-adapter-moment";
import NastaveniaBotGrafu from "./grafNastavenia/BotGrafNastavenia";

import CrosshairPlugin from "chartjs-plugin-crosshair";
import LoadingComponent from "../LoadingComponent";

function BotGraf({ grafRequestData }) {
  Chart.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler, CrosshairPlugin);

  const [filter, setFilter] = useState("1y");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({ isLoading: true, hasError: { status: false, msg: "" } });
  const botChartRef = useRef(null);

  const getDataFromParent = useCallback(
    async (filter) => {
      setLoading((prevState) => {
        return { ...prevState, isLoading: true };
      });
      setChartData(await grafRequestData(filter));
      setLoading((prevState) => {
        return { ...prevState, isLoading: false };
      });
    },
    [grafRequestData]
  );

  useEffect(() => {
    getDataFromParent(filter);
  }, [filter, getDataFromParent]);

  //stateful chartjs data
  const data = useMemo(() => {
    let chartContext = botChartRef.current;
    let subChartLineGradient = null;
    if (chartContext != null) {
      chartContext = chartContext.canvas.getContext("2d");
      subChartLineGradient = chartContext.createLinearGradient(0, 0, 0, 1000);
      subChartLineGradient.addColorStop(0, "rgba(	13, 207, 151, 0.2)");
    }
    return {
      datasets: [
        {
          fill: true,
          label: "Hodnota",
          data: chartData,
          borderColor: "#0DCF97",
          backgroundColor: subChartLineGradient,
          pointStyle: "cross",
          pointHoverRadius: 10,
        },
      ],
    };
  }, [chartData]);

  //helper funkcia na style filterov
  const getFilterElementBGColor = (filterType) => {
    if (filter === filterType && typeof filter !== "object") {
      return "rgba(255, 255, 255, 0.29)";
    }
  };

  return (
    <div className="bot-chart-div">
      <div className="bot-graf-filter" id="graf-filter">
        <ul>
          <li style={{ backgroundColor: getFilterElementBGColor("1d") }} onClick={() => setFilter("1d")}>
            1D
          </li>
          <li style={{ backgroundColor: getFilterElementBGColor("7d") }} onClick={() => setFilter("7d")}>
            7D
          </li>
          <li style={{ backgroundColor: getFilterElementBGColor("1m") }} onClick={() => setFilter("1m")}>
            1M
          </li>
          <li style={{ backgroundColor: getFilterElementBGColor("3m") }} onClick={() => setFilter("3m")}>
            3M
          </li>
          <li style={{ backgroundColor: getFilterElementBGColor("1y") }} onClick={() => setFilter("1y")}>
            1R
          </li>
          <li style={{ backgroundColor: getFilterElementBGColor("all") }} onClick={() => setFilter("all")}>
            All
          </li>
        </ul>
      </div>
      {loading.isLoading && <LoadingComponent error={loading.hasError.msg} />}
      <Line style={{ display: loading.isLoading ? "none" : "" }} ref={botChartRef} options={NastaveniaBotGrafu} data={data}></Line>
    </div>
  );
}

export default BotGraf;
