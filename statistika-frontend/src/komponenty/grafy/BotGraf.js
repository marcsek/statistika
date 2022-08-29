import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./BotGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import { useLoadingManager, LoadingComponent } from "../LoadingManager";
import NastaveniaBotGrafu from "./grafNastavenia/BotGrafNastavenia";

function BotGraf({ grafRequestData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin, Filler);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("1y");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(100, true);
  const botChartRef = useRef(null);

  const getDataFromParent = useCallback(
    async (filter) => {
      setChartData(await grafRequestData(filter));
      setLoadingStep("render");
    },
    [grafRequestData, setLoadingStep]
  );

  useEffect(() => {
    getDataFromParent(filter);
  }, [filter, getDataFromParent]);

  //stateful chartjs data
  const data = useMemo(() => {
    let subChartLineGradient = null;
    if (botChartRef.current != null) {
      let chartContext = botChartRef.current;
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
  useEffect(() => {
    console.log("render");
  });

  //component infa o zmene nad grafom
  const PercZmenaData = ({ style }) => {
    let perc = getPercentageChange(chartData[0]?.y, chartData?.at(-1)?.y);
    let cena = formatPrice(chartData?.at(-1)?.y - chartData[0]?.y);
    return (
      <div style={{ position: "relative", ...style }}>
        <div className="perc-zmena-chart-burza">
          <p id="eur-zmena">
            <MdEuroSymbol /> {(chartData?.at(-1)?.y - chartData[0]?.y < 0 ? "" : "+") + cena}
          </p>
          <span style={{ color: perc < 0 ? "#f1556c" : "#0acf97", backgroundColor: perc > 0 ? "rgba(10,207,151,.18)" : "" }} id="perc-zmena">
            {perc < 0 ? <VscTriangleDown /> : <VscTriangleUp />} {Math.abs(perc)}%
          </span>
        </div>
      </div>
    );
  };

  //helper funkcia na style filterov
  const getFilterElementBGColor = (filterType) => {
    if (filter === filterType && typeof filter !== "object") {
      return "rgba(255, 255, 255, 0.29)";
    }
  };

  return (
    <div className="bot-chart-main">
      {loading && <LoadingComponent background={true} blur={true} customSpinner={true} loadingText={loadingMessage} />}
      <PercZmenaData style={{ visibility: loading ? "hidden" : "" }} />
      <div className="bot-chart-div" style={{ display: loading ? "" : "" }}>
        <Line ref={botChartRef} options={NastaveniaBotGrafu} data={data}></Line>
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
      </div>
    </div>
  );
}

export default BotGraf;
