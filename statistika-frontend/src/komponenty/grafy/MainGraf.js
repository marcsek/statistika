import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./MainGraf.css";

import { getPercentageChange } from "../../pomocky/cislovacky";
import LoadingComponent from "../LoadingComponent";

import CalendarComp from "../CalendarComp";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { TbCalendar } from "react-icons/tb";
import NastaveniaMainGraf from "./grafNastavenia/MainGrafNastavenia";

Highcharts.setOptions(NastaveniaMainGraf);

function MainGraf({ grafRequestData }) {
  //pravdepodobne iba docasny refactor uvidim podla api
  const refactorDataFormat = (newDataa) => {
    let newData = [[], [], []];

    for (let i = 0; i < newDataa.length; i++) {
      for (let j = 0; j < newDataa[i].length; j++) {
        newData[i][j] = [newDataa[i][j].x.getTime(), newDataa[i][j].cena];
      }
    }
    return newData;
  };

  // listener na zmenu šírky kvôli resizu výšky grafu
  const [windowIsSmall, setWindowIsSmall] = useState(false);
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
  }, []);

  const [calendarActive, setCalendarActive] = useState(false);
  const [filter, setFilter] = useState("1y");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({ isLoading: true, hasError: { status: false, msg: "" } });

  const getDataFromParent = useCallback(
    async (filter) => {
      setLoading((prevState) => {
        return { ...prevState, isLoading: true };
      });

      const newChartData = await grafRequestData(filter);
      for (let data of newChartData) {
        data.forEach((element, index) => {
          data[index] = { ...element, cena: element.y, y: getPercentageChange(index === 0 ? data[0].y : data[0].cena, element.y) };
        });
      }
      setChartData(newChartData);
      setLoading((prevState) => {
        return { ...prevState, isLoading: false };
      });
    },
    [grafRequestData]
  );

  useEffect(() => {
    getDataFromParent(filter);
  }, [filter, getDataFromParent]);

  const onCalendarNewDate = useCallback((value) => {
    if (value[0] && value[1]) {
      const newValues = { dateStart: value[0] ? value[0] : "", dateEnd: value[1] ? value[1] : "" };
      setFilter(newValues);
    }
    setCalendarActive(false);
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
        <CalendarComp minDate={new Date(1627628652305)} maxDate={new Date()} display={calendarActive} onCalendarClick={onCalendarNewDate} />
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
            style={{ backgroundColor: (typeof filter === "object" || calendarActive) && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => {
              setCalendarActive(!calendarActive);
            }}
          >
            <TbCalendar />
          </li>
        </ul>
      </div>
      {loading.isLoading && <LoadingComponent error={loading.hasError.msg} height={windowIsSmall ? 450 : 600} />}
      <div className="heightchart-cont" style={{ display: loading.isLoading ? "none" : "" }}>
        <HighchartsReact
          containerProps={{ style: { height: windowIsSmall ? "400px" : "550px" } }}
          constructorType={"stockChart"}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
}

export default MainGraf;
