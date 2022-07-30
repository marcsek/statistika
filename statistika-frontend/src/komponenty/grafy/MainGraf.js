import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./MainGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import zoomPlugin from "chartjs-plugin-zoom";

import { formatPrice } from "../../pomocky/cislovacky";
import LoadingComponent from "../LoadingComponent";

import CalendarComp from "../CalendarComp";

function MainGraf({ grafRequestData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin);
  Interaction.modes.interpolate = Interpolate;
  const childRed = useRef(null);

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

      function getPercentageChange(newNumber, oldNumber) {
        var decreaseValue = oldNumber - newNumber;

        return (decreaseValue / oldNumber) * 100;
      }

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

  const handleCalClick = useCallback((state) => {
    const value = childRed.current.dajData();
    if (state === true && value[0] && value[1]) {
      const newValues = { dateStart: value[0] ? value[0] : "", dateEnd: value[1] ? value[1] : "" };
      setFilter(newValues);
    }
    clicked(!state);
  }, []);

  const data = useMemo(() => {
    return {
      datasets: [
        {
          label: "Bitcoin",
          data: chartData[0],
          borderColor: "#ffbb1f",
          borderDash: [5, 5],
        },
        {
          backgroundColor: "#2c53dd",
          label: "Bot Eur",
          data: chartData[1],
          borderColor: "#3861FB",
        },
        {
          label: "Bot Btc",
          data: chartData[2],
          borderColor: "#00E5B0",
        },
      ],
    };
  }, [chartData]);

  const options = {
    type: "line",
    maintainAspectRatio: false,
    responsive: true,
    pointHoverRadius: 7,
    pointRadius: 0,
    lineTension: 0,
    interpolate: true,

    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
        },
        type: "time",
        display: true,
        grid: {
          color: "rgba(0, 0, 0, 0)",
          borderWidth: 0,
        },
        ticks: {
          color: "#bbbbbb",
          autoSkip: true,
          maxTicksLimit: 15,
          // maxTicksLimit: 55,
          // minTicksLimit: 55,
          maxRotation: 0,
          font: {
            weight: 500,
            family: "Open Sans",
            size: 11,
          },
        },
      },
      y: {
        type: "linear",
        display: true,
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return "#ababab";
            }
            return "rgba(255, 255, 255, 0.18)";
          },
          borderColor: "rgba(255, 255, 255, 0.18)",
          offset: false,
          tickWidth: 0,
        },

        ticks: {
          callback: function (value, index, ticks) {
            return formatPrice(value, ",") + "%";
          },
          color: "#bbbbbb",
          font: {
            weight: 500,
            family: "Open Sans",
            size: 11,
          },
          beginAtZero: true,
        },
      },
    },
    plugins: {
      // zoom: {
      //   limits: {
      //     x: { min: "original", max: "original" },
      //   },
      //   pan: {
      //     enabled: true,

      //     overScaleMode: "y",
      //   },
      //   zoom: {
      //     onZoomStart: function ({ chart, event, point }) {
      //       // console.log(Math.round(366 / chart.chart.getZoomLevel()));
      //     },
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: false,
      //     },
      //     mode: "x",
      //   },
      // },
      legend: {
        align: "start",
        position: "top",
        fullSize: false,
        labels: {
          // usePointStyle: true,
          color: "#bbbbbb",
          padding: 50,
          font: {
            size: 13,
            weight: 550,
          },
        },
      },
      crosshair: {
        enabled: true,
        line: {
          color: "#bbbbbb",
          width: 1,
          dashPattern: [3, 3],
        },
        sync: {
          enabled: false,
        },
        pan: {
          incrementer: 3,
        },
        zoom: {
          enabled: true,
        },
        snap: {
          enabled: true,
        },
        callbacks: function (start, end) {
          // console.log(start.chart, end);
        },
      },
      tooltip: {
        // mode: "interpolate",
        caretPadding: 12,
        itemSort: function (a, b) {
          return b.raw.y - a.raw.y;
        },
        callbacks: {
          label: function (context) {
            function getPercentageChange(newNumber, oldNumber) {
              var decreaseValue = oldNumber - newNumber;

              return formatPrice((decreaseValue / oldNumber) * 100);
            }
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(context.raw.cena);
              label += " (" + formatPrice(context.parsed.y) + " %)";
            }
            // label += " (" + formatPrice(getPercentageChange(context.dataset.data[0].y, context.parsed.y)) + "%)";
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="main-chart-div">
      <div className="main-graf-filter" id="graf-filter">
        <CalendarComp minDate={new Date(1627628652305)} maxDate={new Date()} display={button} ref={childRed} />
        <ul>
          <li style={{ backgroundColor: filter === "1d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1d")}>
            1D
          </li>
          <li style={{ backgroundColor: filter === "7d" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("7d")}>
            7D
          </li>
          <li style={{ backgroundColor: filter === "1m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1m")}>
            1M
          </li>
          <li style={{ backgroundColor: filter === "3m" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("3m")}>
            3M
          </li>
          <li style={{ backgroundColor: filter === "1y" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("1y")}>
            1R
          </li>
          <li onClick={() => handleCalClick(button)}>Cal </li>
          <li style={{ backgroundColor: filter === "all" && "rgba(255, 255, 255, 0.29)" }} onClick={() => setFilter("all")}>
            All
          </li>
        </ul>
      </div>
      {loading.isLoading && <LoadingComponent error={loading.hasError.msg} />}
      <Line style={{ display: loading.isLoading ? "none" : "" }} options={options} data={data}></Line>
    </div>
  );
}

export default MainGraf;
