import "./BotList.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";

import ListGraf from "./ListGraf";

function BotList() {
  const navigate = useNavigate();

  const [click, setClick] = useState(false);

  const [chartData, setchData] = useState([]);

  useEffect(() => {
    getFakeData();
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
              <i id="bot-mena">
                <p>
                  <i>$ </i>7403.34
                </p>
                <p id="btc">
                  <i>₿ </i>0.25435
                </p>
              </i>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#16c784" }} className="zmena">
                <VscTriangleUp />
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                1400.3%
              </span>
              <div className="list-graf">
                <ListGraf newData={chartData[0]} />
              </div>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <i id="bot-mena">
                <p>
                  <i>$ </i>7403.34
                </p>
                <p id="btc">
                  <i>₿ </i>0.25435
                </p>
              </i>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                2.44%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                <VscTriangleUp />
                5.077%
              </span>
              <span style={{ color: "#16c784" }} className="zmena">
                <VscTriangleUp />
                1400.3%
              </span>
              <div className="list-graf">{<ListGraf newData={chartData[1]} />}</div>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <i id="bot-mena">
                <p>
                  <i>$ </i>7403.34
                </p>
                <p id="btc">
                  <i>₿ </i>0.25435
                </p>
              </i>
              <p id="bot-par">ETH - USDT</p>
              <span style={{ color: "#16c784" }} className="zmena">
                <VscTriangleUp />
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                1400.3%
              </span>
              <div className="list-graf">{<ListGraf newData={chartData[0]} />}</div>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <i id="bot-mena">
                <p>
                  <i>$ </i>740334.34
                </p>
                <p id="btc">
                  <i>₿ </i>0.25323
                </p>
              </i>
              <p id="bot-par">ETH - USDT</p>
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
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} className="zmena">
                <VscTriangleDown />
                1400.3%
              </span>
              <div className="list-graf">{<ListGraf newData={chartData[1]} />}</div>
            </li>
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
