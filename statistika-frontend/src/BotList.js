import "./BotList.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";

import ListGraf from "./ListGraf";
import { faker } from "@faker-js/faker";

function BotList() {
  const navigate = useNavigate();

  const [click, setClick] = useState(false);

  const [chartData, setchData] = useState([]);
  const [pageData, setPageData] = useState([]);

  useEffect(() => {
    getFakeData();

    let docData = [];
    for (let i = 0; i < 5; i++) {
      let d = [];
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        d.push({
          bMeno: `Bot ${i + 1}`,
          cena: {
            e: faker.datatype.float({
              min: 1000,
              max: 500000,
            }),
            b: faker.datatype.float({
              min: 0.00025,
              max: 10.0,
              precision: 0.0001,
            }),
          },
          botPar: "ETH - USDT",
          zmena: {
            h24: faker.datatype.float({
              min: 0.025,
              max: 100.0,
              precision: 0.01,
            }),
            d7: faker.datatype.float({
              min: 0.025,
              max: 100.0,
              precision: 0.01,
            }),
            d30: faker.datatype.float({
              min: 0.025,
              max: 100.0,
              precision: 0.01,
            }),
            cc: faker.datatype.float({
              min: 0.025,
              max: 100.0,
              precision: 0.01,
            }),
          },
        });
      }
      docData.push({
        burza: { meno: `Burza ${i + 1}`, boti: [...d] },
      });
    }
    setPageData([...docData]);
  }, []);

  const getFakeData = () => {
    const requestOne = axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=168&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    const requestTwo = axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=USD&limit=168&toTs=-1&agregate=1&api_key=YOURKEYHER`
    );
    axios.all([requestOne, requestTwo]).then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        let dataOne = [];
        responseOne.data.Data.Data.forEach((e) => {
          dataOne.push({ x: new Date(e.time * 1000), y: e.high });
        });
        let dataTwo = [];
        responseTwo.data.Data.Data.forEach((e) => {
          dataTwo.push({ x: new Date(e.time * 1000), y: e.high });
        });

        setchData([dataOne, dataTwo]);
      })
    );
  };

  const BurzaList = () => {
    let page = pageData.map((b) => {
      return (
        <li className="li-burza">
          <p id="burza-meno">{b.burza.meno}</p>
          <ol className="bot-list">
            <div id="divider"></div>
            <div className="legenda">
              <p id="bot-meno">Meno</p>
              <p id="bot-mena">Hodnota</p>
              <p id="bot-par">Ob. pár</p>
              <span className="zmena">24h</span>
              <span className="zmena">7d</span>
              <span className="zmena">30d</span>
              <span className="zmena">celý-čas</span>
              <span className="zmena" id="graf">
                Pos. 7 Dní
              </span>
            </div>
            {b.burza.boti.map((e) => {
              function numberWithSpaces(x) {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                return parts.join(".");
              }
              return (
                <li>
                  <p id="bot-meno" onClick={() => navigate("../bot-detail/3232")}>
                    {e.bMeno}
                  </p>
                  <i id="bot-mena">
                    <p>
                      <i>$ </i>
                      {numberWithSpaces(e.cena.e)}
                    </p>
                    <p id="btc">
                      <i>₿ </i>
                      {e.cena.b}
                    </p>
                  </i>
                  <p id="bot-par">{e.botPar}</p>
                  <span style={{ color: "#16c784" }} className="zmena">
                    <VscTriangleUp />
                    {e.zmena.h24}%
                  </span>
                  <span style={{ color: "#ea3943" }} className="zmena">
                    <VscTriangleDown />
                    {e.zmena.d7}%
                  </span>
                  <span style={{ color: "#ea3943" }} className="zmena">
                    <VscTriangleDown />
                    {e.zmena.d30}%
                  </span>
                  <span style={{ color: "#ea3943" }} className="zmena">
                    <VscTriangleDown />
                    {e.zmena.cc}%
                  </span>
                  <div className="list-graf">
                    <ListGraf newData={chartData[Math.round(Math.random())]} />
                  </div>
                </li>
              );
            })}
            <div className="legenda" id="sucet">
              <p id="sucet-text">Súčet</p>
              <p id="bot-meno">---</p>
              <i id="bot-mena">
                <p>
                  <i>$ </i>7403.34
                </p>
                <p id="btc">
                  <i>₿ </i>0.25435
                </p>
              </i>
              <p id="bot-par">---</p>
              <span style={{ color: "#16c784" }} className="zmena">
                <VscTriangleUp />
                0.24%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                <VscTriangleUp />
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                5.07545%
              </span>
              <span className="zmena">---</span>
              <span className="zmena" id="graf">
                ---
              </span>
            </div>
          </ol>
        </li>
      );
    });

    return page;
  };

  return (
    <div>
      <button className="vypinac" id={!click ? "red" : "green"} onClick={() => setClick(!click)}>
        {!click ? "Vypnúť botov" : "Zapnúť Botov"}
      </button>
      <ul className="list-burza">{BurzaList()}</ul>
    </div>
  );
}

export default BotList;
