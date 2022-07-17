import "./BotList.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ListGraf from "./ListGraf";

import { faker } from "@faker-js/faker";

function BotList() {
  const navigate = useNavigate();

  const [click, setClick] = useState(false);

  const getFakeData = () => {
    const labels = faker.date.betweens("2056-06-16T21:15:47.998Z", "2066-11-07T14:49:54.185Z", 50);

    const fakeObj = { labels: labels, data: labels.map(() => faker.datatype.number({ min: 1, max: 30 })) };

    return fakeObj;
  };

  return (
    <div>
      <button className="vypinac" id={!click ? "red" : "green"} onClick={() => setClick(!click)}>
        {!click ? "Vypnúť botov" : "Zapnúť Botov"}
      </button>
      <ul className="list-burza">
        <li className="li-burza">
          <p id="burza-meno">Burza 1</p>
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
            <li>
              <p id="bot-meno" onClick={() => navigate("../bot-detail/3232")}>
                Bot 1
              </p>
              <p id="bot-mena">
                <p>
                  <text>$ </text>7403.34
                </p>
                <p id="btc">
                  <text>₿ </text>0.25435
                </p>
              </p>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#16c784" }} className="zmena">
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                1400.3%
              </span>
              <div className="list-graf">
                <ListGraf {...getFakeData()} />
              </div>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">
                <p>
                  <text>$ </text>7403.34
                </p>
                <p id="btc">
                  <text>₿ </text>0.25435
                </p>
              </p>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#ea3943" }} className="zmena">
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                2.44%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                5.07777%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                1400.3%
              </span>
              <div className="list-graf">
                <ListGraf {...getFakeData()} />
              </div>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">
                <p>
                  <text>$ </text>7403.34
                </p>
                <p id="btc">
                  <text>₿ </text>0.25435
                </p>
              </p>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#16c784" }} className="zmena">
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                1400.3%
              </span>
              <div className="list-graf">
                <ListGraf {...getFakeData()} />
              </div>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">
                <p>
                  <text>$ </text>740334.34
                </p>
                <p id="btc">
                  <text>₿ </text>0.25323
                </p>
              </p>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#16c784" }} className="zmena">
                0.24%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                1400.3%
              </span>
              <div className="list-graf">
                <ListGraf {...getFakeData()} />
              </div>
            </li>
            <div className="legenda" id="sucet">
              <p id="sucet-text">Súčet</p>
              <p id="bot-meno">---</p>
              <p id="bot-mena">
                <p>
                  <text>$ </text>7403.34
                </p>
                <p id="btc">
                  <text>₿ </text>0.25435
                </p>
              </p>
              <p id="bot-par">---</p>
              <span style={{ color: "#16c784" }} className="zmena">
                0.24%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                5.07777%
              </span>
              <span className="zmena">---</span>
              <span className="zmena" id="graf">
                ---
              </span>
            </div>
          </ol>
        </li>
        <li className="li-burza">
          <p id="burza-meno">Burza 2</p>
          <ol className="bot-list">
            <div id="divider"></div>
            <li className="legenda">
              <p id="bot-meno">Meno</p>
              <p id="bot-mena">Stav</p>
              <span className="zmena">24h</span>
              <span className="zmena">7d</span>
              <span className="zmena">30d</span>
              <span className="zmena">all-time</span>
            </li>
            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span className="zmena">0.24%</span>
              <span className="zmena">2.44%</span>
              <span className="zmena">5.07777%</span>
              <span className="zmena">1400.3%</span>
            </li>
            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span className="zmena">0.24%</span>
              <span className="zmena">2.44%</span>
              <span className="zmena">5.07777%</span>
              <span className="zmena">1400.3%</span>
            </li>
          </ol>
        </li>
        <li className="li-burza">
          <p id="burza-meno">Burza 3</p>
          <ol className="bot-list">
            <div id="divider"></div>
            <li className="legenda">
              <p id="bot-meno">Meno</p>
              <p id="bot-mena">Stav</p>
              <span className="zmena">24h</span>
              <span className="zmena">7d</span>
              <span className="zmena">30d</span>
              <span className="zmena">all-time</span>
            </li>
            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span className="zmena">0.24%</span>
              <span className="zmena">2.44%</span>
              <span className="zmena">5.07777%</span>
              <span className="zmena">1400.3%</span>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  );
}

export default BotList;
