import "./BotListPage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
import { MdEuroSymbol } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";

import ListGraf from "../komponenty/grafy/ListGraf";
import { faker } from "@faker-js/faker";
import { formatPrice, formatCrypto } from "../pomocky/cislovacky.js";

function BotList() {
  const navigate = useNavigate();

  const [buttonClicked, setButtonClick] = useState(false);
  const [chartData, setChData] = useState([]);
  const [pageData, setPageData] = useState([]);

  const getFakeListData = useCallback(() => {
    let burzi = [];
    for (let i = 0; i < 5; i++) {
      let boti = [];
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        boti.push({
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
          botPar: "ETH-USDT",
          zmena: {
            h24: faker.datatype.float({
              min: -100,
              max: 100.0,
              precision: 0.01,
            }),
            d7: faker.datatype.float({
              min: -100,
              max: 100.0,
              precision: 0.01,
            }),
            d30: faker.datatype.float({
              min: -100,
              max: 100.0,
              precision: 0.01,
            }),
            cc: faker.datatype.float({
              min: -100,
              max: 100.0,
              precision: 0.01,
            }),
          },
          chart: Math.round(Math.random()),
        });
      }
      burzi.push({ meno: `Burza ${i + 1}`, boti: [...boti] });
    }
    console.log(burzi);
    return burzi;
  }, []);

  const genFakeChartData = useCallback(() => {
    const requestOne = axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=168&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    const requestTwo = axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=USD&limit=168&toTs=-1&agregate=1&api_key=YOURKEYHER`
    );
    let dataOne = [];
    let dataTwo = [];
    axios.all([requestOne, requestTwo]).then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        dataOne = [];
        responseOne.data.Data.Data.forEach((e) => {
          dataOne.push({ x: new Date(e.time * 1000), y: e.high });
        });
        dataTwo = [];
        responseTwo.data.Data.Data.forEach((e) => {
          dataTwo.push({ x: new Date(e.time * 1000), y: e.high });
        });
        setChData([dataOne, dataTwo]);
      })
    );
  }, []);

  useEffect(() => {
    genFakeChartData();
    setPageData(getFakeListData());
  }, [genFakeChartData, getFakeListData]);

  return (
    <div>
      <button className="vypinac" id={!buttonClicked ? "red" : "green"} onClick={() => setButtonClick(!buttonClicked)}>
        {!buttonClicked ? "Vypnúť botov" : "Zapnúť Botov"}
      </button>
      {/* list vsetkych burzi */}
      <ul className="list-burza">
        {pageData.map((burza, i) => {
          return (
            <li key={i} className="li-burza">
              <p id="burza-meno">{burza.meno}</p>
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
                {/* list vsetkych botov v burze */}
                {burza.boti.map((bot, i) => {
                  return (
                    <li key={i}>
                      <p id="bot-meno" onClick={() => navigate("../bot-detail/3232")}>
                        {bot.bMeno}
                      </p>
                      <i id="bot-mena">
                        <p id="euro">
                          <i>
                            <MdEuroSymbol />
                          </i>
                          {formatPrice(bot.cena.e, ",")}
                        </p>
                        <p id="btc">
                          <i>
                            <BsCurrencyBitcoin />
                          </i>
                          {formatCrypto(bot.cena.b)}
                        </p>
                      </i>
                      <p id="bot-par">{bot.botPar}</p>
                      <span style={{ color: bot.zmena.h24 >= 0 ? "#16c784" : "#ea3943" }} className="zmena">
                        {bot.zmena.h24 >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                        {bot.zmena.h24}%
                      </span>
                      <span style={{ color: bot.zmena.d7 >= 0 ? "#16c784" : "#ea3943" }} className="zmena">
                        {bot.zmena.d7 >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                        {bot.zmena.d7}%
                      </span>
                      <span style={{ color: bot.zmena.d30 >= 0 ? "#16c784" : "#ea3943" }} className="zmena">
                        {bot.zmena.d30 >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                        {bot.zmena.d30}%
                      </span>
                      <span style={{ color: bot.zmena.cc >= 0 ? "#16c784" : "#ea3943" }} className="zmena">
                        {bot.zmena.cc >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                        {bot.zmena.cc}%
                      </span>
                      <div className="list-graf">
                        <ListGraf newData={chartData[bot.chart]} />
                      </div>
                    </li>
                  );
                })}
                <div className="legenda" id="sucet">
                  <p id="sucet-text">Súčet</p>
                  <p id="bot-meno">---</p>
                  <i id="bot-mena">
                    <p id="euro">
                      <i>
                        <MdEuroSymbol />
                      </i>
                      {formatPrice(
                        burza.boti.reduce((a, c) => a + c.cena.e, 0),
                        ","
                      )}
                    </p>
                    <p id="btc">
                      <i>
                        <BsCurrencyBitcoin />
                      </i>
                      {formatCrypto(burza.boti.reduce((a, c) => a + c.cena.b, 0))}
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
        })}
      </ul>
    </div>
  );
}

export default BotList;
