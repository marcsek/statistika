import { useState, useCallback, useEffect, useRef } from "react";

import { formatDate } from "../../pomocky/datumovanie";
import "./VyberComponent.css";
import { formatCrypto } from "../../pomocky/cislovacky.js";
import { getTextValues } from "../../pomocky/fakeApi.js";
import { GrMoney } from "react-icons/gr";
import useLoadingManager from "../../customHooky/useLoadingManager";
import LoadingComponent from "../zdielane/LoadingComponent";
import LoadingButtonComponent from "../zdielane/LoadingButtonComponent";

const VyberComponent = () => {
  const [tranList, setTranList] = useState([
    { mena: "ETH", suma: "34.3223", datum: new Date() },
    { mena: "USDT", suma: "0.6523", datum: new Date() },
    { mena: "ETH", suma: "0.2", datum: new Date() },
    { mena: "ETH", suma: "3.243", datum: new Date() },
  ]);
  const [priceValue, setPriceValue] = useState("");
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(0, true);
  const initLoad = useRef(true);

  const onBtnClick = useCallback(async () => {
    if (priceValue === "") return;

    setLoadingStep("fetch");
    const textValue = await getTextValues();
    const mena = textValue.obPar.split("/")[!textValue.prepinac | 0];
    // setLoadingStep("transform");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setTranList([{ mena: mena, suma: priceValue, datum: new Date() }, ...tranList]);
    setLoadingStep("render");
    setPriceValue("");
  }, [priceValue, tranList, setLoadingStep]);

  const initialFetch = useCallback(async () => {
    setLoadingStep("fetch");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    setLoadingStep("render");
    // initLoad.current = false;
  }, [setLoadingStep]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  useEffect(() => {
    if (!loading) {
      initLoad.current = false;
    }
  }, [loading]);

  const FooterVyber = () => {
    let sucetTran = [];

    tranList.forEach((e) => {
      let najdenyElement = sucetTran.find((e2) => e2.mena === e.mena);
      if (!najdenyElement) {
        sucetTran.push({ mena: e.mena, suma: e.suma });
      } else {
        najdenyElement.suma = Number(najdenyElement.suma) + Number(e.suma);
      }
    });

    return sucetTran.map((e, index) => (
      <div key={index} className="footer-vyber">
        <span className="vyber-suma">
          <span className="vyber-suma-text">{formatCrypto(parseFloat(e.suma), 4)}</span>
          <span className="vyber-mena">{e.mena}</span>
          {index !== sucetTran.length - 1 && <span className="vyber-separator">•</span>}
        </span>
      </div>
    ));
  };

  return (
    <div className="vyber-cont-major">
      <span className="vyber-bot-title" id="title">
        Výber
      </span>
      <div className="vyber-cont-main">
        <div className="vyber-form-cont">
          <div className="vyber-input-cont">
            <div className="gr-money-box">
              <GrMoney />
            </div>
            <input
              className="vyber-input"
              placeholder="Množstvo"
              value={priceValue}
              onChange={(e) => {
                let value = e.target.value.replace(/^\s+|\s+$/gm, "");
                if (isNaN(value) || value.split(".").length > 2 ? false : value.length === 1 && value === "." ? false : true) {
                  setPriceValue(value);
                }
              }}
            ></input>
          </div>
          <LoadingButtonComponent
            buttonProps={{ className: "vyber-button", id: priceValue.length !== 0 || (loading && !initLoad.current) ? "active" : "inactive" }}
            handleSubmitPress={onBtnClick}
            loading={loading && !initLoad.current}
          >
            Vybrať
          </LoadingButtonComponent>
        </div>
        <div className="cont-legenda-list">
          {loading && initLoad.current && <LoadingComponent background={true} loadingText={loadingMessage} />}
          <div className="vyber-legenda">
            <span className="vyber-datum">Dátum</span>
            <span className="vyber-suma">Výber</span>
          </div>
          <ul className="list-vyber">
            {tranList.map((e, index) => (
              <li key={index} style={{ backgroundColor: index % 2 === 0 ? "#383c4b" : "" }} className="element-list-vyber">
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
              <FooterVyber />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VyberComponent;
