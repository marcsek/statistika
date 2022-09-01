import React, { useState, useMemo, useRef, useCallback } from "react";
import "./BotGraf.css";

import { Chart, Interaction, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

import NastaveniaBotGrafu from "./grafNastavenia/BotGrafNastavenia";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useLoadingManager from "../../customHooky/useLoadingManager";
import LoadingComponent from "../zdielane/LoadingComponent";

import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import { calculateCrossLineGradient, getGradients, getPointBackgroundColor } from "../../pomocky/chartHelperFunkcie";
import { GrafFiltre } from "./GrafFiltre";

function BotGraf({ grafRequestData }) {
  Chart.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler, CrosshairPlugin, annotationPlugin);
  Interaction.modes.interpolate = Interpolate;

  const [chartData, setChartData] = useState([]);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(0, true);
  const botChartRef = useRef(null);

  const getDataFromParent = useCallback(
    async (filter) => {
      setLoadingStep("fetch");
      setChartData(await grafRequestData(filter));
      setLoadingStep("render");
    },
    [grafRequestData, setLoadingStep]
  );

  //stateful chartjs data
  const data = useMemo(() => {
    return {
      datasets: [
        {
          fill: getGradients,
          label: "Hodnota",
          data: chartData,
          borderColor: "#ffffff",
          backgroundColor: getPointBackgroundColor,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointBorderWidth: 0,
          segment: {
            borderColor: calculateCrossLineGradient,
          },
          borderJoinStyle: "bevel",
        },
      ],
    };
  }, [chartData]);

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

  return (
    <div className="bot-chart-main">
      {loading && <LoadingComponent background={true} blur={true} customSpinner={true} loadingText={loadingMessage} />}
      <PercZmenaData style={{ visibility: loading ? "hidden" : "" }} />
      <div className="bot-chart-div" style={{ display: chartData.length === 0 ? "none" : "" }}>
        <Line
          style={{ display: Object.keys(Chart.instances).length === 0 ? "none" : "" }}
          ref={botChartRef}
          options={NastaveniaBotGrafu}
          data={data}
          plugins={[ChartDataLabels]}
        ></Line>
        <GrafFiltre
          defaultFilter="1y"
          getDataFromParent={getDataFromParent}
          render={(data) => {
            return (
              <div className="bot-graf-filter" id="graf-filter">
                <ul>
                  <li style={{ backgroundColor: data.getFilterElementBGColor("1d") }} onClick={() => data.onFiltersChange("1d")}>
                    1D
                  </li>
                  <li style={{ backgroundColor: data.getFilterElementBGColor("7d") }} onClick={() => data.onFiltersChange("7d")}>
                    7D
                  </li>
                  <li style={{ backgroundColor: data.getFilterElementBGColor("1m") }} onClick={() => data.onFiltersChange("1m")}>
                    1M
                  </li>
                  <li style={{ backgroundColor: data.getFilterElementBGColor("3m") }} onClick={() => data.onFiltersChange("3m")}>
                    3M
                  </li>
                  <li style={{ backgroundColor: data.getFilterElementBGColor("1y") }} onClick={() => data.onFiltersChange("1y")}>
                    1R
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
  );
}

export default BotGraf;
