import React, { useState, useCallback } from "react";
import "./GrafPage.css";
import axios from "axios";
import MainGraf from "../komponenty/grafy/MainGraf";
import BurzaGraf from "../komponenty/grafy/BurzaGraf";

import { VscTriangleUp, VscTriangleDown, VscCircleFilled } from "react-icons/vsc";

import { faker } from "@faker-js/faker";
import { filterDate } from "../pomocky/datumovanie";
import { MdEuroSymbol } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";

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
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high / 1.2 + faker.datatype.number({ min: 1000, max: 2000 }) });
    });
    dataToUpdate[1].push(...docData);

    docData = [];
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high / 2.5 + faker.datatype.number({ min: 1000, max: 5000 }) });
    });
    dataToUpdate[2].push(...docData);
    return dataToUpdate;
  }, []);

  const subChartRequestData = useCallback(async (duration, index) => {
    let requestParams = filterDate(duration);

    let resData = [];
    let docData = [];
    let dataToUpdate = [[], [], [], []];

    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );

    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });

    return docData;
  }, []);

  return (
    <div className="graf-page-div">
      <div className="celkovy-stav-cont">
        <div className="devider-vyvin" id="devider"></div>
        <p className="vyvin-title" id="title">
          Celkový vývin
        </p>
        <ul>
          <li className="stav-element">
            <VscCircleFilled id="indikator" />
            <p>Zmena 24H</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> +1 300.45
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> +0.24544
            </p>
            <span id="perc-zmena">
              <VscTriangleUp /> 10%
            </span>
          </li>
          <li className="stav-element">
            <VscCircleFilled id="indikator" />
            <p>Zmena 7D</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> +16 433.35
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> +0.24544
            </p>
            <span id="perc-zmena">
              <VscTriangleUp /> 10%
            </span>
          </li>
          <li className="stav-element">
            <VscCircleFilled style={{ color: "#ea3943" }} id="indikator" />
            <p>Zmena 3M</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> -344 333.64
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> -0.24544
            </p>
            <span style={{ color: "#ea3943" }} id="perc-zmena">
              <VscTriangleDown /> 10%
            </span>
          </li>
          <li className="stav-element">
            <p>Celkové prostriedky</p>
            <span id="eur-zmena">
              <MdEuroSymbol /> 143 300
            </span>
            <p id="btc-zmena">
              <BsCurrencyBitcoin /> 3.24544
            </p>
          </li>
        </ul>
      </div>
      <div id="graf-burza-cont">
        <div className="devider-graf" id="devider"></div>
        <p className="graf-title" id="title">
          Graf vývoja
        </p>
        <MainGraf grafRequestData={mainGrafRequestData}></MainGraf>
      </div>
      <div className="graf-burzy-cont">
        <ul>
          <li className="burza">
            <div className="burza-cont">
              <div className="devider" id="devider"></div>
              <p id="title">Burza 1</p>
              <BurzaGraf grafRequestData={subChartRequestData} index={0}></BurzaGraf>
            </div>
          </li>
          <li className="burza">
            <div className="burza-cont">
              <div className="devider" id="devider"></div>
              <p id="title">Burza 2</p>
              <BurzaGraf grafRequestData={subChartRequestData} farbaCiary={{ c: "#FF6384", g: "rgba(255,99,132, 0.34)" }} index={1}></BurzaGraf>
            </div>
          </li>
          <li className="burza">
            <div className="burza-cont">
              <div className="devider" id="devider"></div>
              <p id="title">Burza 3</p>
              <BurzaGraf grafRequestData={subChartRequestData} farbaCiary={{ c: "#FF6384", g: "rgba(255,99,132, 0.34)" }} index={2}></BurzaGraf>
            </div>
          </li>
          <li className="burza">
            {" "}
            <div className="burza-cont">
              <div className="devider" id="devider"></div>
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
