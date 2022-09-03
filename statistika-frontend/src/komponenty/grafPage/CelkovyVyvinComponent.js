import React, { useState, useCallback, useEffect } from "react";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";

import { MdEuroSymbol } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { getCelkovyVyvinData } from "../../pomocky/fakeApi";
import useLoadingManager from "../../customHooky/useLoadingManager";
import LoadingComponent from "../zdielane/LoadingComponent";
import { formatCrypto, formatPrice } from "../../pomocky/cislovacky";
import { ImStack } from "react-icons/im";
import { BiChevronDownCircle, BiChevronUpCircle } from "react-icons/bi";
import Icon from "../icon";

const CelkovyVyvinComponent = () => {
  const [data, setData] = useState({});
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(30, true);

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
            <BiChevronDownCircle style={{ d: "#f1556c" }} id="indikator" />
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

export default CelkovyVyvinComponent;
