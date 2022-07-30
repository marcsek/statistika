import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official"
const Test = () =>{

    const optionss = {
    //     rangeSelector: {
    //         enabled:false,
    //         selected: 4,
    //         inputEnabled: false,
    //     },
    //     yAxis: {
    //       labels: {
    //           formatter: function () {
    //               return (this.value > 0 ? ' + ' : '') + this.value + '%';
    //           }
    //       },
    //       plotLines: [{
    //           value: 0,
    //           width: 2,
    //           color: 'silver'
    //       }]
    //   },
    
    //   plotOptions: {
    //       series: {
    //           compare: 'percent',
    //           // title:[...getData1(chartData)],
    //           showInNavigator: true
    //       }
    //   },
    
    //   tooltip: {
    //       pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
    //       valueDecimals: 2,
    //       split: true
    //   },
    //       xAxis:{
    //         title:[1,2,3]
    //       },

    rangeSelector: {
        selected: 4
    },

    yAxis: {
        labels: {
            formatter: function () {
                return (this.value > 0 ? ' + ' : '') + this.value + '%';
            }
        },
        plotLines: [{
            value: 0,
            width: 2,
            color: 'silver'
        }]
    },

    plotOptions: {
        series: {
            compare: 'percent',
            showInNavigator: true
        }
    },

    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
    },
      series: [{
        data: [[1333456260000,16],[1433456260000,120],[Date.parse(2020),142]],
        name:"2015"
      },
      {
        data: [ 1, 2, 3],
        name:"2016"
      }]
    }
    return(
        <HighchartsReact  constructorType={"stockChart"} highcharts={Highcharts} options={optionss}>{console.log(Date.now())}</HighchartsReact>
    );
}

export default Test