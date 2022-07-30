import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./MainGraf.css";

import { Chart, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Line } from "react-chartjs-2";

import { CrosshairPlugin, Interpolate } from "chartjs-plugin-crosshair";
import zoomPlugin from "chartjs-plugin-zoom";

import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import LoadingComponent from "../LoadingComponent";

import CalendarComp from "../CalendarComp";

import Highcharts from "highcharts/highstock";
// import stockTools from "highcharts/modules/stock-tools";
import HighchartsReact from "highcharts-react-official";
import DarkUnica from 'highcharts/themes/dark-unica';
// stockTools(Highcharts);
import Test from "./test";
DarkUnica(Highcharts);

Highcharts.theme = {
  colors: ['#ffbb1f', '#3861FB', '#00E5B0', '#DDDF00', '#24CBE5', '#64E572',
           '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: 'Open Sans'
    }
  },
  title: {
      style: {
          color: '#000',
          font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
      }
  },
  subtitle: {
      style: {
          color: '#666666',
          font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
      }
  },
  legend: {
      itemStyle: {
          font: '9pt Trebuchet MS, Verdana, sans-serif',
          color: 'black'
      },
      itemHoverStyle:{
          color: 'gray'
      }
  }
};
Highcharts.setOptions(Highcharts.theme)

function MainGraf({ grafRequestData }) {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, CrosshairPlugin, zoomPlugin);
  Interaction.modes.interpolate = Interpolate;
  const childRef = useRef(null);

  const getData1 = (newDataa)=>{
    let newData = [[],[],[]];

    for(let i = 0; i < newDataa.length; i++){
      for(let j = 0; j < newDataa[i].length; j++){
      newData[i][j]=([newDataa[i][j].x.getTime(), newDataa[i][j].cena]) ;
      }
    }

  console.log(newData);
  return newData;
  }

  const getData2 = (newDataa)=>{
    let newData = [[],[],[]];
  newDataa.forEach((el2,index2) => {
    el2.forEach((element, index)=>{
      newData[index2] = {...newData[index], data:element.cena};
    })
    });
  console.log(newData);
  return newData;
  }

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

  const handleCalClick = useCallback((state) => {
    const value = childRef.current.dajData();
    if (state === true && value[0] && value[1]) {
      const newValues = { dateStart: value[0] ? value[0] : "", dateEnd: value[1] ? value[1] : "" };
      setFilter(newValues);
    }
    clicked(!state);
  }, []);

  const optionss = useMemo(() => {
    if(chartData.length > 0){
    return{
      rangeSelector: {
        enabled:false,
        selected: 4,
        inputEnabled: false,
        scrollbar: { enabled: false },
    },
    xAxis:{
      type:'datetime',
    },
    scrollbar: {
      enabled: false,
      visible: false,
  },
    // navigator: {
    //   handles: {
    //     backgroundColor: 'grey',
    //     borderColor: 'black',
    //     radius: 25,
    //     borderRadius:25,
    //     innerLines: {
    //       color: 'blue',
    //       height: 15
    //     }
    //   }
    // },

    yAxis: {
      labels: {
          formatter: function () {
              return (this.value > 0 ? ' + ' : '') + this.value + '%';
          }
      },
      plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
      }]
  },

  plotOptions: {
      series: {
          compare: 'percent',
          // title:[...getData1(chartData)],
          showInNavigator: true
      }
  },

  tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
      valueDecimals: 2,
      split: true
  },
      series:[
        {
          name:'Btc',
          data: getData1(chartData)[0]
        },
        {
          name:'Bot Eur',
          data: getData1(chartData)[1]
        },        {
          name:'Bot Btc',
          data: getData1(chartData)[2]
        }
      ],
    }
  }
  }, [chartData]);

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
      zoom: {
        limits: {
          x: { min: "original" },
        },
        pan: {
          enabled: false,

          overScaleMode: "y",
        },
        zoom: {
          onZoomStart: function ({ chart, event, point }) {
            // console.log(Math.round(366 / chart.chart.getZoomLevel()));
          },
          wheel: {
            enabled: false,
          },
          drag: {
            enabled: true,
            threshold: 100,
          },
          mode: "x",
        },
      },
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
          enabled: false,
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
        <CalendarComp minDate={new Date(1627628652305)} maxDate={new Date()} display={button} ref={childRef} />
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
      {/* <Line style={{ display: loading.isLoading ? "none" : "" }} options={options} data={data}></Line> */}
      <div style={{paddingTop:"150px",display: loading.isLoading ? "none" : "", height:"100%" }}>
     {/* <Test></Test> */}
     <HighchartsReact constructorType={"stockChart"} highcharts={Highcharts} options={optionss} />
      </div>
      {console.log(optionss )}
    </div>
  );
}

export default MainGraf;
