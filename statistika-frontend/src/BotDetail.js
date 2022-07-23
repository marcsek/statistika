import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import BotGraf from "./komponenty/grafy/BotGraf.js";
import axios from "axios";
import "./BotDetail.css";

import { filterDate } from "./pomocky/datumovanie";
import ObchodyList from "./komponenty/ObchodyList.js";

function BotDetail() {
  const { botId } = useParams();

  const [chartsData, setChData] = useState([]);

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
  const [buttonChange, setButtonChange] = useState(true);

  const chartRequestData = useCallback((duration) => {
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
  }, []);
  const handeTextChange = (evt) => {
    let stateCopy = [...textValues];

    stateCopy[evt.target.accessKey].v = evt.target.value;
    let oneWrong = false;
    textValues.forEach((e) => {
      if (e.v !== e.init) {
        oneWrong = true;
      }
    });
    if (oneWrong) {
      setButtonChange(false);
    } else {
      setButtonChange(true);
    }

    setTextValues([...stateCopy]);
  };

  return (
    <div className="bot-main-cont">
      <div className="bot-major-cont">
        <p id="title">Bot {botId}</p>
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
                    accessKey={i}
                    style={{ border: e.v !== e.init ? "2px solid #2c53dd" : "" }}
                    value={e.v}
                    id={e.init}
                    onChange={handeTextChange}
                  ></input>
                </div>
              );
            })}
          </div>
          <button className="submit-button" id={buttonChange ? "inactive" : "active"}>
            Updatnuť
          </button>
        </div>
        <div className="divider-graf-para" id="devider"></div>
        <div className="bot-graf-cont">
          <div className="graf-bot-title-divider" id="devider"></div>
          <span className="graf-bot-title" id="title">
            Graf vývoja
          </span>
          <div className="bot-samotny-graf">
            <BotGraf grafRequestData={chartRequestData} newData={chartsData}></BotGraf>
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div className="obchody-devider" id="devider"></div>
        <span className="obchody-title" id="title">
          List obchodov
        </span>
        <ObchodyList></ObchodyList>
      </div>
    </div>
  );
}

export default BotDetail;
