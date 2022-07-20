import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BotGraf from "./BotGraf.js";
import axios from "axios";
import "./BotDetail.css";

import filterDate from "./pomocky/FilterDate.js";

function BotDetail() {
  const { botId } = useParams();

  const [chartsData, setChData] = useState([]);

  const chartRequestData = (duration) => {
    let requestParams = filterDate(duration);

    var docData = [];
    axios
      .get(
        `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
      )
      .then((res) => {
        res.data.Data.Data.forEach((e) => {
          docData.push({ x: new Date(e.time * 1000), y: e.high });
        });

        setChData(docData);
      });
  };

  return (
    <div className="bot-main-cont">
      <div className="bot-major-cont">
        <p id="title">Bot {botId}</p>
        <div className="bot-parametre-cont">
          <span>Paremetre</span>
        </div>
        <div className="divider-graf-para" id="devider"></div>
        <div className="bot-graf-cont">
          <BotGraf grafRequestData={chartRequestData} newData={chartsData}></BotGraf>
        </div>
      </div>
      <ul className="bot-obchody-cont">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}

export default BotDetail;
