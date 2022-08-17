import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./BurzaGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import LoadingComponent from "../LoadingComponent";
import NastaveniaBurzaGrafu from "./grafNastavenia/BurzaGrafNastavenia";

function BurzaGraf({ grafRequestData, farbaCiary, index }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin, Filler);
  Interaction.modes.interpolate = Interpolate;

  const [filter, setFilter] = useState("all");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({ isLoading: true, hasError: { status: false, msg: "" } });
  const burzaChartRef = useRef(null);

  const getDataFromParent = useCallback(
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
    getDataFromParent(filter, index);
  }, [filter, index, getDataFromParent]);

  //stateful chartjs data
  const data = useMemo(() => {
    let chartContext = burzaChartRef.current;
    let subChartLineGradient = null;
    if (chartContext != null) {
      chartContext = chartContext.canvas.getContext("2d");
      subChartLineGradient = chartContext.createLinearGradient(0, 0, 0, 1000);
      subChartLineGradient.addColorStop(0, farbaCiary ? farbaCiary.g : "rgba(	44, 122, 244, 0.2)");
    }
    return {
      datasets: [
        {
          fill: true,
          label: "Hodnota",
          data: chartData,
          borderColor: farbaCiary ? farbaCiary.c : "#2C7AF4",
          backgroundColor: subChartLineGradient,
          pointStyle: "cross",
          pointHoverRadius: 10,
        },
      ],
    };
  }, [chartData, farbaCiary]);

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
    <div className="burza-chart-main">
      {loading.isLoading && <LoadingComponent height={300} error={loading.hasError.msg} />}
      <PercZmenaData style={{ visibility: loading.isLoading ? "hidden" : "" }} />
      <div className="burza-chart-div">
        <Line style={{ display: loading.isLoading ? "none" : "" }} ref={burzaChartRef} options={NastaveniaBurzaGrafu} data={data}></Line>
        <div className="burza-graf-filter" id="graf-filter">
          <ul>
            <li style={{ backgroundColor: getFilterElementBGColor("1d") }} onClick={() => setFilter("1d")}>
              1D
            </li>
            <li style={{ backgroundColor: getFilterElementBGColor("7d") }} onClick={() => setFilter("7d")}>
              7D
            </li>
            <li style={{ backgroundColor: getFilterElementBGColor("3m") }} onClick={() => setFilter("3m")}>
              3M
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

export default BurzaGraf;
