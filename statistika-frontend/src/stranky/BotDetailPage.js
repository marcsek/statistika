import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BotGraf from "../komponenty/grafy/BotGraf.js";
import axios from "axios";
import "./BotDetailPage.css";

import { filterDate } from "../pomocky/datumovanie";
import ObchodyList from "../komponenty/ObchodyList.js";

const ParametreEditor = () => {
  const [buttonState, setButtonState] = useState(false);
  const [textValues, setTextValues] = useState([
    { title: "Parameter 1", v: "0.24", init: "0.24" },
    { title: "Alebo aj iny", v: "434349", init: "434349" },
    { title: "Aj text?", v: "Neviem", init: "Neviem" },
    { title: "Uvidim", v: "434", init: "434" },
    { title: "Nieco", v: "434", init: "434" },
    { title: "Daco", v: "434", init: "434" },
    { title: "Preco", v: "434", init: "434" },
    { title: "Ako", v: "434", init: "434" },
    { title: "Nevadi", v: "434", init: "434" },
    { title: "Nabuduce", v: "434", init: "434" },
  ]);

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
      <div className="bot-parametre">
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
      <button className="submit-button" id={buttonState ? "active" : "inactive"}>
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
