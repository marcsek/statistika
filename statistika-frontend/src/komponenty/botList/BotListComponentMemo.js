import React from "react";
import { useNavigate } from "react-router-dom";

import { VscTriangleUp, VscTriangleDown, VscCircleFilled } from "react-icons/vsc";
import { MdEuroSymbol } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { formatPrice, formatCrypto } from "../../pomocky/cislovacky.js";

import ListGraf from "../grafy/ListGraf";

const BotListComponentMemo = ({ data }) => {
  const navigate = useNavigate();
  console.log(data);
  return (
    <>
      {data.pageData.map((burza, i) => {
        return (
          <li key={i} className="li-burza">
            <p id="burza-meno">{burza.meno}</p>
            <ol className="bot-list">
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
                      <VscCircleFilled style={{ color: bot.status ? "rgb(22, 199, 132)" : "#f1556c" }}></VscCircleFilled>
                      {"" + bot.bMeno}
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
                    <span
                      style={{
                        color: bot.zmena.h24 >= 0 ? "#16c784" : "#f1556c",
                      }}
                      className="zmena"
                    >
                      {bot.zmena.h24 >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                      {bot.zmena.h24}%
                    </span>
                    <span
                      style={{
                        color: bot.zmena.d7 >= 0 ? "#16c784" : "#f1556c",
                      }}
                      className="zmena"
                    >
                      {bot.zmena.d7 >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                      {bot.zmena.d7}%
                    </span>
                    <span
                      style={{
                        color: bot.zmena.d30 >= 0 ? "#16c784" : "#f1556c",
                      }}
                      className="zmena"
                    >
                      {bot.zmena.d30 >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                      {bot.zmena.d30}%
                    </span>
                    <span
                      style={{
                        color: bot.zmena.cc >= 0 ? "#16c784" : "#f1556c",
                      }}
                      className="zmena"
                    >
                      {bot.zmena.cc >= 0 ? <VscTriangleUp /> : <VscTriangleDown />}
                      {bot.zmena.cc}%
                    </span>
                    <div className="list-graf">
                      {console.log(data.chartData[bot.chart])}
                      <ListGraf newData={[...data.chartData[bot.chart]].splice(70, 150)} />
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
                <span style={{ color: "#f1556c" }} className="zmena">
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
    </>
  );
};

export default React.memo(BotListComponentMemo);
