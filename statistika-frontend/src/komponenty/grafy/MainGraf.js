import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./MainGraf.css";

import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import { formatDate } from "../../pomocky/datumovanie";
import LoadingComponent from "../LoadingComponent";

import CalendarComp from "../CalendarComp";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from "highcharts/themes/dark-unica";
import { TbCalendar } from "react-icons/tb";

DarkUnica(Highcharts);

Highcharts.theme = {
  colors: ["#ffbb1f", "#3861FB", "#00E5B0", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "Open Sans",
    },
  },
  title: {
    style: {
      color: "#000",
      font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
    },
  },
  subtitle: {
    style: {
      color: "#666666",
      font: 'bold 12px "Trebuchet MS", Verdana, sans-serif',
    },
  },
  legend: {
    // layout: "vertical",
    align: "right",
    verticalAlign: "top",
    backgroundColor: "transparent",
    itemStyle: {
      // font: "9pt Trebuchet MS, Verdana, sans-serif",
      // color: "black",
      color: "#b5c6cc",
      fontSize: 12,
    },
    itemHoverStyle: {
      color: "gray",
    },
  },
};
Highcharts.setOptions(Highcharts.theme);

function MainGraf({ grafRequestData }) {
  const getData1 = (newDataa) => {
    let newData = [[], [], []];

    for (let i = 0; i < newDataa.length; i++) {
      for (let j = 0; j < newDataa[i].length; j++) {
        newData[i][j] = [newDataa[i][j].x.getTime(), newDataa[i][j].cena];
      }
    }

    return newData;
  };

  const [button, clicked] = useState(false);
  const [filter, setFilter] = useState("1y");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({ isLoading: true, hasError: { status: false, msg: "" } });

  const onParentRequestEnd = useCallback(
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
    onParentRequestEnd(filter);
  }, [filter, onParentRequestEnd]);

  const onCalendarNewDate = useCallback((value) => {
    if (value[0] && value[1]) {
      const newValues = { dateStart: value[0] ? value[0] : "", dateEnd: value[1] ? value[1] : "" };
      setFilter(newValues);
    }
    clicked(false);
  }, []);

  const options = useMemo(() => {
    if (chartData.length > 0) {
      return {
        accessibility: {
          enabled: false,
        },
        chart: {
          height: 550,
          style: {
            fontFamily: "Rubik, sans-serif",
          },
        },
        rangeSelector: {
          enabled: false,
          inputEnabled: false,
          scrollbar: { enabled: false },
        },
        xAxis: {
          lineColor: "transparent",
          lineWidth: 1,
          offset: 0,
          tickHeight: 50,
          type: "datetime",
          dateTimeLabelFormats: {
            minute: {
              range: true,
            },
          },
          tickColor: "transparent",
          crosshair: {
            color: "#bbbbbb",
            // dashStyle: "shortdash",
          },
          max: chartData[0][chartData[0].length - 1].x.getTime(),
          min: chartData[0][0].x.getTime(),
          range: chartData[0][chartData[0].length - 1].x.getTime() - chartData[0][0].x.getTime(),
          labels: {
            padding: 10,
            style: {
              color: "#8c98a5",
              fontSize: 11.2,
            },
          },
        },
        scrollbar: {
          enabled: true,
          barBackgroundColor: "gray",
          barBorderRadius: 7,
          barBorderWidth: 0,
          barHeight: 0,
          buttonBackgroundColor: "transparent",
          buttonArrowColor: "transparent",
          height: 0,
          buttonBorderWidth: 0,
          buttonBorderRadius: 7,
          trackBackgroundColor: "none",
          trackBorderWidth: 0,
          trackBorderRadius: 8,
          trackBorderColor: "#CCC",
        },

        legend: {
          enabled: true,
          // align: "top",
          layout: "horizontal",
          align: "top",
          verticalAlign: "right",
          style: {
            color: "black",
          },
        },
        navigator: {
          series: {
            type: "areaspline",
            lineWidth: 2,
            lineColor: "#4677FF",
            color: "rgb(27,31,49)",
            fillOpacity: 0.2,
            compare: "price",
          },
          xAxis: {
            // tickColor: "transparent",
            max: chartData[0][chartData[0].length - 1].x.getTime(),
            min: chartData[0][0].x.getTime(),
            range: chartData[0][chartData[0].length - 1].x.getTime() - chartData[0][0].x.getTime(),
            gridZIndex: 3,
            endOnTick: false,
            gridLineColor: "#e7e7e7",
            labels: {
              align: "center",
              style: {
                color: "rgba(255, 255, 255,0.4)",
              },
              zIndex: 4,
            },
            events: {
              afterSetExtremes: function (event) {
                // console.log(new Date(event.max));
                // console.log(new Date(event.min));
                // console.log(event);
                // console.log("cau");
              },
            },
          },
          outlineColor: "none",
          maskFill: "rgba(56, 98, 251, 0.08)",
          // margin: 5,
          handles: {
            symbols: ["url(/handles.svg)", "url(/handles.svg)"],
            lineWidth: 1,
            width: 20,
            height: 30,
            innerLines: {
              color: "#314B93",
              height: 5,
            },
          },
        },

        yAxis: {
          tickInterval: 20,
          lineColor: "rgba(255, 255, 255, 0.18)",
          lineWidth: 1,
          gridLineWidth: 1,
          gridLineColor: "rgba(255, 255, 255, 0.18)",
          tickColor: "transparent",

          labels: {
            reserveSpace: true,
            padding: 10,
            x: 6,
            style: {
              color: "#8c98a5",
              fontWeight: 550,
              fontSize: 11.2,
            },
            formatter: function () {
              return (this.value > 0 ? "+" : "") + this.value + "%";
            },
          },

          plotLines: [
            {
              value: 0,
              width: 1,
              dashStyle: "dash",
            },
          ],
          plotBands: {
            color: "red",
          },
        },

        plotOptions: {
          series: {
            compare: "percent",
            // title:[...getData1(chartData)],
            lineWidth: 2.5,
            states: {
              hover: {
                enabled: true,
                lineWidth: 3,
              },
            },
          },
        },

        tooltip: {
          hideDelay: 50,
          useHTML: true,
          formatter: function () {
            // The first returned item is the header, subsequent items are the
            // points
            // <span style="color:{series.color}">{series.name}</span>: <b>€ {point.y}</b> ({point.change}%)<br/>'
            return [`<div class="tooltip-cont-bot"><b>${formatDate(new Date(this.x))} </b></div>`].concat(
              this.points
                ? this.points.map(function (point) {
                    return [
                      `<div class="tooltip-cont"><span class="dot" style="background-color: ${
                        point.series.color
                      }"></span><span class="tooltip-name">${point.series.name}:</span> <b class="tooltip-price">€${formatPrice(
                        point.y,
                        ","
                      )}</b> <b class="tooltip-perc">(${Math.round(point.point.change * 100) / 100}%)</b></div>`,
                      // '<span class="dot" style="background-color:"' + point.series.color + "></span><b>" + point.series.name + "</b>: " + point.y,
                    ];
                  })
                : []
            );
          },
          valueDecimals: 2,
          padding: 0,
          split: true,
          // backgroundColor: "transparent",
          borderWidth: 1,
          // backgroundColor: "red",
          // backgroundColor: "rgba(0, 0, 0, 0.8)",
          // backgroundColor: "white",
          borderRadius: 5,
          // fontSize: 50,
          style: {
            fontSize: 20,
          },
          borderColor: "transparent",
          // borderWidth: 1,
          backgroundColor: "transparent",
          shadow: false,
          distance: 25,
        },
        series: [
          {
            tooltip: {
              style: {
                fontSize: 50,
              },
              backgroundColor: "red", // Specific shape for series
            },
            name: "Btc",
            data: getData1(chartData)[0],
            // dashStyle: "dash",
          },
          {
            name: "Bot Eur",
            data: getData1(chartData)[1],
          },
          {
            name: "Bot Btc",
            data: getData1(chartData)[2],
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

  return (
    <div className="main-chart-div">
      <p className="graf-title" id="title">
        Graf vývoja
      </p>
      <div className="main-graf-filter" id="graf-filter">
        <CalendarComp minDate={new Date(1627628652305)} maxDate={new Date()} display={button} onCalendarClick={onCalendarNewDate} />
        <ul>
          <li
            style={{ backgroundColor: filter === "1d" && typeof filter !== "object" && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => setFilter("1d")}
          >
            1D
          </li>
          <li
            style={{ backgroundColor: filter === "7d" && typeof filter !== "object" && !button && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => setFilter("7d")}
          >
            7D
          </li>
          <li
            style={{ backgroundColor: filter === "1m" && typeof filter !== "object" && !button && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => setFilter("1m")}
          >
            1M
          </li>
          <li
            style={{ backgroundColor: filter === "3m" && typeof filter !== "object" && !button && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => setFilter("3m")}
          >
            3M
          </li>
          <li
            style={{ backgroundColor: filter === "1y" && typeof filter !== "object" && !button && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => setFilter("1y")}
          >
            1R
          </li>
          <li
            style={{ backgroundColor: filter === "all" && typeof filter !== "object" && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => setFilter("all")}
          >
            All
          </li>
          <li
            style={{ backgroundColor: (typeof filter === "object" || button) && "rgba(255, 255, 255, 0.29)" }}
            onClick={() => {
              clicked(!button);
            }}
          >
            <TbCalendar />
          </li>
        </ul>
      </div>
      {loading.isLoading && <LoadingComponent error={loading.hasError.msg} />}
      <div className="heightchart-cont" style={{ display: loading.isLoading ? "none" : "" }}>
        <HighchartsReact constructorType={"stockChart"} highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default MainGraf;
