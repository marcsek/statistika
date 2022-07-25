import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import BotGraf from "../komponenty/grafy/BotGraf.js";
import axios from "axios";
import "./BotDetailPage.css";

import { filterDate } from "../pomocky/datumovanie";
import ObchodyList from "../komponenty/ObchodyList.js";
import { getTextValues, setNewTextValues } from "../pomocky/fakeApi.js";
import LoadingComponent from "../komponenty/LoadingComponent.js";

const ParametreEditor = () => {
  const [buttonState, setButtonState] = useState(false);
  const [textValues, setTextValues] = useState([
    { title: "Parameter 1", v: "", init: "0.24" },
    { title: "Alebo aj iny", v: "", init: "434349" },
    { title: "Aj text?", v: "", init: "Neviem" },
    { title: "Uvidim", v: "", init: "434" },
    { title: "Nieco", v: "", init: "434" },
    { title: "Daco", v: "", init: "434" },
    { title: "Preco", v: "", init: "434" },
    { title: "Ako", v: "", init: "434" },
    { title: "Nevadi", v: "", init: "434" },
    { title: "Nabuduce", v: "", init: "434" },
  ]);
  const [loading, setLoading] = useState({ isLoading: true, msg: "", hasError: { status: false, msg: "" } });

  const textValuesRequest = useCallback(async () => {
    setLoading((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const textValuess = await getTextValues();
    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });
    setTextValues((prevState) => {
      const stateCopy = [...prevState];
      for (let i = 0; i < stateCopy.length; i++) {
        stateCopy[i].v = textValuess[i];
        stateCopy[i].init = textValuess[i];
      }
      return stateCopy;
    });
  }, []);

  const textValuesSend = useCallback(async (textValues) => {
    setButtonState(false);

    setLoading({ isLoading: true, msg: "Posielam...", hasError: { status: false } });
    const valuesToSend = textValues.map((e) => e.v);
    const response = await setNewTextValues(valuesToSend);
    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });

    const stateCopy = [...textValues];
    stateCopy.forEach((element, index) => {
      element.init = response[index];
    });
    setTextValues(stateCopy);
  }, []);

  useEffect(() => {
    textValuesRequest();
  }, [textValuesRequest]);

  const onTextChange = useCallback(
    (evt) => {
      let stateCopy = [...textValues];
      stateCopy[evt.target.name].v = evt.target.value;

      let oneChanged = false;
      textValues.forEach((e) => {
        if (e.v !== e.init) {
          oneChanged = true;
        }
      });
      setButtonState(oneChanged);
      setTextValues([...stateCopy]);
    },
    [textValues]
  );

  return (
    <div className="bot-parametre-cont">
      <div className="parametre-title-divider" id="devider"></div>
      <span className="parametre-title" id="title">
        Paremetre
      </span>
      {loading.isLoading && <LoadingComponent loadingText={loading.msg}></LoadingComponent>}
      <div style={{ display: loading.isLoading ? "none" : "" }} className="bot-parametre">
        {textValues.map((e, i) => {
          return (
            <div className="parametre-input" key={i}>
              <span>{e.title}</span>
              <input
                autoComplete="off"
                name={i}
                style={{ border: e.v !== e.init ? "2px solid #2c53dd" : "" }}
                value={e.v}
                id={e.init}
                onChange={onTextChange}
              ></input>
            </div>
          );
        })}
      </div>
      <button
        className="submit-button"
        onClick={(e) => {
          textValuesSend(textValues);
        }}
        id={buttonState ? "active" : "inactive"}
      >
        Updatnuť
      </button>
    </div>
  );
};

function BotDetail() {
  const { botId } = useParams();

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
      <div className="bot-major-cont">
        <p id="title">Bot {botId}</p>
        <ParametreEditor />
        <div className="divider-graf-para" id="devider"></div>
        <div className="bot-graf-cont">
          <div className="graf-bot-title-divider" id="devider"></div>
          <span className="graf-bot-title" id="title">
            Graf vývoja
          </span>
          <div className="bot-samotny-graf">
            <BotGraf grafRequestData={chartRequestData} />
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div className="obchody-devider" id="devider"></div>
        <span className="obchody-title" id="title">
          List obchodov
        </span>
        <ObchodyList />
      </div>
    </div>
  );
}

export default BotDetail;
