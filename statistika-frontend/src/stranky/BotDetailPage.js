import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BotGraf from "../komponenty/grafy/BotGraf.js";
import axios from "axios";
import "./BotDetailPage.css";

import { filterDate, formatDate } from "../pomocky/datumovanie";
import ObchodyList from "../komponenty/ObchodyList.js";
import LoadingComponent from "../komponenty/LoadingComponent.js";
import { MdEuroSymbol } from "react-icons/md";
import "../komponenty/VyberComp.css";
import { formatPrice } from "../pomocky/cislovacky.js";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import ParametreEditor from "../komponenty/ParametreEditor.js";
import { VscCircleFilled } from "react-icons/vsc";

const VyberComponent = () => {
  const [tranList, setTranList] = useState([
    { suma: "232434.32", datum: new Date() },
    { suma: "232434", datum: new Date() },
    { suma: "232434", datum: new Date() },
    { suma: "232434", datum: new Date() },
  ]);
  const [priceValue, setPriceValue] = useState("");
  const [loading, setLoading] = useState({
    isLoading: false,
    msg: "",
    hasError: { status: false, msg: "" },
  });

  const onBtnClick = useCallback(async () => {
    if (priceValue === "") {
      return;
    }
    setLoading({ isLoading: true, msg: "Posielam...", hasError: { status: false, msg: "" } });
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setTranList([...tranList, { suma: priceValue, datum: new Date() }]);
    setPriceValue("");
    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });
  }, [priceValue, tranList]);

  return (
    <div className="vyber-cont-major">
      {/* <div className="vyber-bot-title-divider" id="devider"></div> */}
      <span className="vyber-bot-title" id="title">
        Výber
      </span>
      {loading.isLoading && <LoadingComponent error={loading.hasError.msg} />}
      <div style={{ display: loading.isLoading ? "none" : "" }} className="vyber-cont-main">
        <div className="vyber-form-cont">
          <div className="vyber-input-cont">
            <input
              className="vyber-input"
              value={priceValue}
              onChange={(e) => {
                let value = e.target.value.replace(/^\s+|\s+$/gm, "");
                if (!isNaN(value) && value.split(".").length < 2 ? true : value.split(".")[1]?.length <= 2) {
                  setPriceValue(value);
                }
              }}
            ></input>
            <RiMoneyEuroCircleLine></RiMoneyEuroCircleLine>
          </div>
          <button id={priceValue.length !== 0 ? "active" : "inactive"} className="vyber-button" onClick={(e) => onBtnClick()}>
            Vybrať
          </button>
        </div>
        <div className="cont-legenda-list">
          <div className="vyber-legenda">
            <span className="vyber-datum">Dátum</span>
            <span className="vyber-suma">Výber</span>
          </div>
          <ul className="list-vyber">
            {tranList.map((e, index) => (
              <li key={index} style={{ backgroundColor: index % 2 === 0 ? "#393c4a" : "" }} className="element-list-vyber">
                <span className="vyber-datum">{formatDate(e.datum)}</span>
                <span className="vyber-suma">
                  <MdEuroSymbol></MdEuroSymbol>
                  {formatPrice(parseFloat(e.suma), ",")}
                </span>
              </li>
            ))}
          </ul>
          <div id="footer" className="vyber-legenda">
            <span className="vyber-nadpis">Vybraté spolu: </span>
            <span className="vyber-suma">
              <MdEuroSymbol></MdEuroSymbol>
              {formatPrice("2312312", ",")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function BotDetail() {
  const { botId } = useParams();
  const [botActive, setBotActive] = useState(true);

  const chartRequestData = useCallback(async (duration) => {
    let requestParams = filterDate(duration);

    let resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    let chartData = [];
    resData.data.Data.Data.forEach((e) => {
      chartData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(200);
    return chartData;
  }, []);

  return (
    <div className="bot-main-cont">
      <div className="title-cont">
        <p className="bot-title-main" id="title">
          Bot {botId}
        </p>
        <div className="bot-status-indicator">
          <span>Status</span>
          <VscCircleFilled style={{ color: botActive ? "rgb(22, 199, 132)" : "rgb(234, 57, 67)" }}></VscCircleFilled>
        </div>
      </div>
      <div className="bot-major-cont">
        <div className="bot-vyber-major-cont">
          <VyberComponent />
        </div>
        {/* <div className="divider-graf-para" id="devider"></div> */}
        <div className="bot-graf-major-cont">
          <div className="bot-graf-cont">
            {/* <div className="graf-bot-title-divider" id="devider"></div> */}
            <span className="graf-bot-title" id="title">
              Graf vývoja
            </span>
            <div className="bot-samotny-graf">
              <BotGraf grafRequestData={chartRequestData} />
            </div>
          </div>
        </div>
      </div>
      <div className="parametre-div" style={{ position: "relative" }}>
        {/* <div className="para-devider" id="devider"></div> */}
        <span className="para-title" id="title">
          Parametre
        </span>
        <ParametreEditor />
      </div>
      <div className="list-obchodov-div" style={{ position: "relative" }}>
        {/* <div className="obchody-devider" id="devider"></div> */}
        <span className="obchody-title" id="title">
          Zoznam obchodov
        </span>
        <ObchodyList />
      </div>
    </div>
  );
}

export default BotDetail;
