import React, { useState, useCallback, useEffect } from "react";
import "./GrafPage.css";
import axios from "axios";
import MainGraf from "../komponenty/grafy/MainGraf";
import BurzaGraf from "../komponenty/grafy/BurzaGraf";

import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";

import { filterDate } from "../pomocky/datumovanie";
import { MdEuroSymbol } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { getCelkovyVyvinData } from "../pomocky/fakeApi";
import { useLoadingManager, LoadingComponent } from "../komponenty/LoadingManager.js";
import { formatCrypto, formatPrice } from "../pomocky/cislovacky";
import { ImStack } from "react-icons/im";
import { BiChevronDownCircle, BiChevronUpCircle } from "react-icons/bi";
import { motion } from "framer-motion";

const CelkovyVyvin = () => {
  const [data, setData] = useState({});
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(30, true);

  useEffect(() => {
    // console.log(loading);
  }, [loading]);

  const celkovyVyvinRequest = useCallback(async () => {
    setLoadingStep("fetch");
    const newData = await getCelkovyVyvinData();
    setLoadingStep();
    setData(newData);
  }, [setLoadingStep]);

  useEffect(() => {
    celkovyVyvinRequest();
  }, [celkovyVyvinRequest]);

  return (
    <div className="celkovy-cont-title">
      <div className="celkovy-stav-cont">
        {loading && <LoadingComponent loadingText={loadingMessage}></LoadingComponent>}
        <ul style={{ opacity: loading ? 0 : 100 }}>
          <li className="stav-element">
            <BiChevronUpCircle id="indikator" />
            <p>Zmena 24H</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> +{formatPrice(data.h24?.e, ",")}
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> +{formatCrypto(data.h24?.b)}
            </p>
            <span id="perc-zmena" style={{ backgroundColor: "rgba(10,207,151,.18)" }}>
              <VscTriangleUp /> {data.h24?.p}%
            </span>
          </li>
          <li className="stav-element">
            <BiChevronUpCircle id="indikator" />
            <p>Zmena 7D</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> +{formatPrice(data.d7?.e, ",")}
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> +{formatCrypto(data.d7?.b)}
            </p>
            <span id="perc-zmena" style={{ backgroundColor: "rgba(10,207,151,.18)" }}>
              <VscTriangleUp /> {data.d7?.p}%
            </span>
          </li>
          <li className="stav-element">
            <BiChevronDownCircle style={{ color: "#f1556c" }} id="indikator" />
            <p>Zmena 3M</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> {formatPrice(data.m3?.e, ",")}
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> {formatCrypto(data.m3?.b)}
            </p>
            <span style={{ color: "#f1556c" }} id="perc-zmena">
              <VscTriangleDown /> {data.m3?.p}%
            </span>
          </li>
          <li className="stav-element">
            <ImStack className="h" />
            <p>Celkové prostriedky</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> {formatPrice(data.cc?.e, ",")}
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> {formatCrypto(data.cc?.b)}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

function Graf() {
  const mainGrafRequestData = useCallback(async (duration) => {
    let requestParams = filterDate(duration);
    let resData = [];
    let docData = [];
    let dataToUpdate = [[], [], []];
    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    dataToUpdate[0].push(...docData);

    docData = [];
    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=ETH&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    dataToUpdate[1].push(...docData);

    docData = [];
    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=LTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    dataToUpdate[2].push(...docData);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(150);
    return dataToUpdate;
  }, []);

  const subChartRequestData = useCallback(async (duration, index) => {
    let requestParams = filterDate(duration);

    let resData = [];
    let docData = [];
    // let dataToUpdate = [[], [], [], []];

    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );

    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    return docData;
  }, []);

  return (
    <div className="graf-page-div">
      <div className="graf-page-title-div">
        <p className="title-hori">Dashboard</p>
      </div>
      <CelkovyVyvin />
      <div id="graf-burza-cont">
        <MainGraf grafRequestData={mainGrafRequestData}></MainGraf>
      </div>
      <div className="graf-burzy-cont">
        <ul>
          <li className="burza">
            <div className="burza-cont">
              <p id="title">Burza 1</p>
              <BurzaGraf grafRequestData={subChartRequestData} index={0}></BurzaGraf>
            </div>
          </li>
          <li className="burza">
            <div className="burza-cont">
              <p id="title">Burza 2</p>
              <BurzaGraf grafRequestData={subChartRequestData} farbaCiary={{ c: "#0DCF97", g: "rgba(	13, 207, 151, 0.20)" }} index={1}></BurzaGraf>
            </div>
          </li>
          <li className="burza">
            <div className="burza-cont">
              <p id="title">Burza 3</p>
              <BurzaGraf grafRequestData={subChartRequestData} farbaCiary={{ c: "#0DCF97", g: "rgba(	13, 207, 151, 0.2)" }} index={2}></BurzaGraf>
            </div>
          </li>
          <li className="burza">
            <div className="burza-cont">
              <p id="title">Burza 4</p>
              <BurzaGraf grafRequestData={subChartRequestData} index={3}></BurzaGraf>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Graf;
