import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import "./MainGraf.css";

import { getPercentageChange } from "../../pomocky/cislovacky";
import { useLoadingManager, LoadingComponent } from "../LoadingManager.js";

import CalendarComp from "../CalendarComp";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { TbCalendar } from "react-icons/tb";
import NastaveniaMainGraf from "./grafNastavenia/MainGrafNastavenia";

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

  // listener na zmenu šírky kvôli resizu výšky grafu
  const [windowIsSmall, setWindowIsSmall] = useState(() => {
    let windowWidth = window.innerWidth;
    if (windowWidth < 850) {
      return true;
    } else {
      return false;
    }
  });
  useEffect(() => {
    function handleWindowResize() {
      let windowWidth = window.innerWidth;
      if (windowWidth < 850) {
        setWindowIsSmall(true);
      } else {
        setWindowIsSmall(false);
      }
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowIsSmall]);

  const [filter, setFilter] = useState("1y");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(50);
  const calendarRef = useRef(null);

  const getDataFromParent = useCallback(
    async (filter) => {
      setLoadingStep("fetch");

      const newChartData = await grafRequestData(filter);

      setLoadingStep("transform");
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

  useEffect(() => {
    getDataFromParent(filter);
  }, [filter, getDataFromParent]);

  const onCalendarNewDate = useCallback((value) => {
    if (value[0] && value[1]) {
      const newValues = { dateStart: value[0] ? value[0] : "", dateEnd: value[1] ? value[1] : "" };
      setFilter(newValues);
    }
    calendarRef.current.changeOpenState();
  }, []);

  // stateful highcharts options
  const options = useMemo(() => {
    if (chartData.length > 0) {
      let lastChartDataTime = chartData[0][chartData[0].length - 1].x.getTime();
      let firstChartDataTime = chartData[0][0].x.getTime();

      return {
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
    return {
      accessibility: {
        enabled: false,
      },
    };
  }, [chartData]);

  //helper funkcia na style filterov
  const getFilterElementBGColor = (filterType) => {
    if (filter === filterType && typeof filter !== "object") {
      return "rgba(255, 255, 255, 0.29)";
    }
  };

  return (
    <div className="main-chart-div">
      <p className="graf-title" id="title">
        Graf vývoja
      </p>
      <div className="main-graf-filter" id="graf-filter">
        <CalendarComp
          ref={calendarRef}
          parentLoading={loading}
          minDate={new Date(1627628652305)}
          maxDate={new Date()}
          onCalendarClick={onCalendarNewDate}
        />
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
          <li
            style={{ backgroundColor: (typeof filter === "object" || calendarRef.current?.isCalendarOpen()) && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => {
              calendarRef.current.changeOpenState();
            }}
          >
            <TbCalendar />
          </li>
        </ul>
      </div>
      <div className="heightchart-cont">
        {loading && (
          <LoadingComponent loadingText={loadingMessage} background={true} blur={true} customSpinner={true} height={windowIsSmall ? 450 : 500} />
        )}
        <HighchartsReact
          containerProps={{ style: { height: windowIsSmall ? "400px" : "450px" } }}
          constructorType={"stockChart"}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
}

export default MainGraf;
