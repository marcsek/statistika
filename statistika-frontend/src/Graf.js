import React, { useEffect, useState } from "react";
import "./Graf.css";
import axios from "axios";
import MainGraf from "./MainGraf";

import { faker } from "@faker-js/faker";

function Graf() {
  const [chartData, setchData] = useState([]);

  const grafRequestData = (duration) => {
    let day = "";
    let amount = "";

    if (duration == "1d") {
      day = "hour";
      amount = "24";
    }
    if (duration == "7d") {
      day = "hour";
      amount = "168";
    }
    if (duration == "1m") {
      day = "day";
      amount = "30";
    }
    if (duration == "3m") {
      day = "day";
      amount = "90";
    }
    if (duration == "1y") {
      day = "day";
      amount = "360";
    }
    var docData = [];
    var dataToUpdate = [[], [], []];
    axios
      .get(`https://min-api.cryptocompare.com/data/v2/histo${day}?fsym=BTC&tsym=USD&limit=${amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`)
      .then((res) => {
        console.log(res);
        res.data.Data.Data.forEach((e) => {
          docData.push({ x: new Date(e.time * 1000), y: e.high });
          // console.log(new Date(e.time));
        });
        dataToUpdate[0].push(...docData);
        docData = [];
        res.data.Data.Data.forEach((e) => {
          docData.push({ x: new Date(e.time * 1000), y: e.high / 1.2 + faker.datatype.number({ min: 1000, max: 2000 }) });
          // console.log(new Date(e.time));
        });
        // console.log(docData);
        dataToUpdate[1].push(...docData);
        docData = [];
        res.data.Data.Data.forEach((e) => {
          docData.push({ x: new Date(e.time * 1000), y: e.high / 2.5 + faker.datatype.number({ min: 1000, max: 5000 }) });
          // console.log(new Date(e.time));
        });
        // console.log(docData);
        dataToUpdate[2].push(...docData);

        setchData(dataToUpdate);
      });
  };

  return (
    <div>
      <MainGraf grafRequestData={grafRequestData} newData={chartData}></MainGraf>
    </div>
  );
}

export default Graf;
