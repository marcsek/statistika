import React, { useState, useMemo, useCallback } from "react";
import "./MainGraf.css";

import { getPercentageChange } from "../../pomocky/cislovacky";
import useLoadingManager from "../../customHooky/useLoadingManager";
import LoadingComponent from "../zdielane/LoadingComponent";
import CalendarComp from "../zdielane/CalendarComp";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { TbCalendar } from "react-icons/tb";
import NastaveniaMainGraf from "./grafNastavenia/MainGrafNastavenia";
import { GrafFiltre } from "./GrafFiltre";
import useWindowIsSmall from "../../customHooky/useWindowIsSmall";

Highcharts.setOptions(NastaveniaMainGraf);

function MainGraf({ grafRequestData }) {
  //pravdepodobne iba docasny refactor uvidim podla api
  const refactorDataFormat = (newData) => {
    let newDataToReturn = [[], [], []];

    for (let i = 0; i < newData.length; i++) {
      for (let j = 0; j < newData[i].length; j++) {
        newDataToReturn[i][j] = [newData[i][j].x.getTime(), newData[i][j].cena];
      }
    }
    return newDataToReturn;
  };

  const windowIsSmall = useWindowIsSmall(850);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(true, 50);

  const getDataFromParent = useCallback(
    async (filter) => {
      setLoadingStep("fetch");

      const newChartData = await grafRequestData(filter);
      for (let data of newChartData) {
        data.forEach((element, index) => {
          data[index] = { ...element, cena: element.y, y: getPercentageChange(index === 0 ? data[0].y : data[0].cena, element.y) };
        });
      }
      setChartData(newChartData);
      setLoadingStep("render");
    },
    [grafRequestData, setLoadingStep]
  );

  // stateful highcharts options
  const options = useMemo(() => {
    let options = {
      accessibility: {
        enabled: false,
      },
    };
    if (chartData.length > 0) {
      let lastChartDataTime = chartData[0][chartData[0].length - 1].x.getTime();
      let firstChartDataTime = chartData[0][0].x.getTime();

      options = {
        ...options,
        xAxis: {
          max: lastChartDataTime,
          min: firstChartDataTime,
          range: lastChartDataTime - firstChartDataTime,
        },

        legend: {
          enabled: true,
        },

        series: [
          {
            name: "Btc",
            data: refactorDataFormat(chartData)[0],
          },
          {
            name: "Bot Eur",
            data: refactorDataFormat(chartData)[1],
          },
          {
            name: "Bot Btc",
            data: refactorDataFormat(chartData)[2],
          },
        ],
      };
    }

    return options;
  }, [chartData]);

  return (
    <div className="main-chart-div">
      <p className="graf-title" id="title">
        Graf vývoja
      </p>
      <GrafFiltre
        defaultFilter="1y"
        getDataFromParent={getDataFromParent}
        render={(data) => {
          return (
            <div className="main-graf-filter" id="graf-filter">
              <CalendarComp
                ref={data.calendarRef}
                parentLoading={loading}
                minDate={new Date(1627628652305)}
                maxDate={new Date()}
                onCalendarClick={data.onCalendarNewDate}
              />
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
                <li
                  style={{
                    backgroundColor: (typeof data.currentFilter === "object" || data.isCalendarOpen) && "rgba(255, 255, 255, 0.29)",
                  }}
                  onClick={data.handleCalendarClick}
                >
                  <TbCalendar />
                </li>
              </ul>
            </div>
          );
        }}
      />
      <div className="heightchart-cont">
        {loading && (
          <LoadingComponent loadingText={loadingMessage} background={true} blur={true} customSpinner={true} height={windowIsSmall ? 450 : 500} />
        )}
        <HighchartsReact
          containerProps={{ style: { height: windowIsSmall ? "400px" : "450px", pointerEvents: loading ? "none" : "" } }}
          constructorType={"stockChart"}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
}

export default MainGraf;
