import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import BotGraf from "../komponenty/grafy/BotGraf.js";
import axios from "axios";
import "./BotDetailPage.css";

import { filterDate, formatDate } from "../pomocky/datumovanie";
import ObchodyList from "../komponenty/ObchodyList.js";
import { MdEuroSymbol } from "react-icons/md";
import "../komponenty/VyberComp.css";
import { formatCrypto, formatPrice } from "../pomocky/cislovacky.js";
import ParametreEditor from "../komponenty/ParametreEditor.js";
import { VscCircleFilled } from "react-icons/vsc";
import { getTextValues } from "../pomocky/fakeApi.js";
import { GrMoney } from "react-icons/gr";
import { useLoadingManager, LoadingComponent } from "../komponenty/LoadingManager.js";

const VyberComponent = () => {
  const [tranList, setTranList] = useState([
    { mena: "ETH", suma: "34.3223", datum: new Date() },
    { mena: "USDT", suma: "0.6523", datum: new Date() },
    { mena: "ETH", suma: "0.2", datum: new Date() },
    { mena: "ETH", suma: "3.243", datum: new Date() },
  ]);
  const [priceValue, setPriceValue] = useState("");
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(100, true);

  const onBtnClick = useCallback(async () => {
    if (priceValue === "") {
      return;
    }
    setLoadingStep("fetch");
    const textValue = await getTextValues();
    const mena = textValue.obPar.split("/")[!textValue.prepinac | 0];
    setLoadingStep("transform");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setTranList([{ mena: mena, suma: priceValue, datum: new Date() }, ...tranList]);
    setPriceValue("");
    setLoadingStep("render");
  }, [priceValue, tranList, setLoadingStep]);

  const initialFetch = useCallback(async () => {
    setLoadingStep("fetch");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    setLoadingStep("render");
  }, [setLoadingStep]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  return (
    <div className="vyber-cont-major">
      <span className="vyber-bot-title" id="title">
        Výber
      </span>
      {loading && <LoadingComponent background={true} loadingText={loadingMessage} />}
      <div style={{ display: loading ? "" : "" }} className="vyber-cont-main">
        <div className="vyber-form-cont">
          <div className="vyber-input-cont">
            <input
              className="vyber-input"
              value={priceValue}
              onChange={(e) => {
                let value = e.target.value.replace(/^\s+|\s+$/gm, "");
                if (isNaN(value) || value.split(".").length > 2 ? false : value.length === 1 && value === "." ? false : true) {
                  setPriceValue(value);
                }
              }}
            ></input>
            <GrMoney />
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
                  {formatCrypto(parseFloat(e.suma), 7)}
                  <span className="vyber-mena">{e.mena}</span>
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
  document.title = `Bot ${botId} | Highdmin`;

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
        <div className="bot-graf-major-cont">
          <div className="bot-graf-cont">
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
        <span className="para-title" id="title">
          Parametre
        </span>
        <ParametreEditor />
      </div>
      <div className="list-obchodov-div" style={{ position: "relative" }}>
        <span className="obchody-title" id="title">
          Zoznam obchodov
        </span>
        <ObchodyList />
      </div>
    </div>
  );
}

export default BotDetail;
