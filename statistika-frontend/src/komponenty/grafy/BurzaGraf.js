import React, { useState, useMemo, useRef, useCallback } from "react";
import "./BurzaGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import "chartjs-adapter-moment";
import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import useLoadingManager from "../../customHooky/useLoadingManager";
import LoadingComponent from "../zdielane/LoadingComponent";
import NastaveniaBurzaGrafu from "./grafNastavenia/BurzaGrafNastavenia";
import { GrafFiltre } from "./GrafFiltre";
import PercZmenaGrafHeader from "./PercZmenaGrafHeader";

function BurzaGraf({ grafRequestData, farbaCiary, index }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin, Filler);
  Interaction.modes.interpolate = Interpolate;

  const [chartData, setChartData] = useState([]);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(0, true);
  const burzaChartRef = useRef(null);

  const getDataFromParent = useCallback(
    async (filter, index) => {
      setLoadingStep("fetch");
      setChartData(await grafRequestData(filter, index));
      setLoadingStep("render");
    },
    [grafRequestData, setLoadingStep]
  );

  //stateful chartjs data
  const data = useMemo(() => {
    let chartContext = burzaChartRef.current;
    let subChartLineGradient = null;
    if (chartContext != null) {
      chartContext = chartContext.canvas.getContext("2d");
      subChartLineGradient = chartContext.createLinearGradient(0, 0, 0, 230);
      subChartLineGradient.addColorStop(0, typeof farbaCiary != "undefined" ? farbaCiary.g : "rgba(	44, 122, 244, 0.5)");
      subChartLineGradient.addColorStop(1, typeof farbaCiary === "undefined" ? "rgba(	75,0,130, 0)" : "rgba(	44, 122, 244, 0)");
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

  return (
    <>
      <div className="burza-chart-main">
        {loading && <LoadingComponent background={true} blur={true} customSpinner={true} loadingText={loadingMessage} height={325} />}
        <PercZmenaGrafHeader style={{ visibility: loading ? "hidden" : "" }} chartData={chartData} />
        <div className="burza-chart-div" style={{ display: chartData.length === 0 ? "none" : "" }}>
          <Line
            ref={burzaChartRef}
            style={{ display: Object.keys(Chart.instances).length === 0 ? "none" : "", pointerEvents: loading ? "none" : "" }}
            options={NastaveniaBurzaGrafu}
            data={data}
          ></Line>
          <GrafFiltre
            defaultFilter="all"
            getDataFromParent={getDataFromParent}
            render={(data) => {
              return (
                <div className="burza-graf-filter" id="graf-filter">
                  <ul>
                    <li style={{ backgroundColor: data.getFilterElementBGColor("1d") }} onClick={() => data.onFiltersChange("1d")}>
                      1D
                    </li>
                    <li style={{ backgroundColor: data.getFilterElementBGColor("7d") }} onClick={() => data.onFiltersChange("7d")}>
                      7D
                    </li>
                    <li style={{ backgroundColor: data.getFilterElementBGColor("3m") }} onClick={() => data.onFiltersChange("3m")}>
                      3M
                    </li>
                    <li style={{ backgroundColor: data.getFilterElementBGColor("all") }} onClick={() => data.onFiltersChange("all")}>
                      All
                    </li>
                  </ul>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}

export default BurzaGraf;
