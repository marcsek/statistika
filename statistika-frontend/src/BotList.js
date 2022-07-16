import "./BotList.css";
import { useNavigate } from "react-router-dom";

function BotList() {
  const navigate = useNavigate();

  return (
    <div>
      <button className="vypinac">Vypnut botov</button>
      <ul className="list-burza">
        <li className="li-burza">
          <p id="burza-meno">Burza 1</p>
          <ol className="bot-list">
            <div id="divider"></div>
            <div className="legenda">
              <p id="bot-meno">Meno</p>
              <p id="bot-mena">Stav</p>
              <span id="zmena">24h</span>
              <span id="zmena">7d</span>
              <span id="zmena">30d</span>
              <span id="zmena">all-time</span>
            </div>
            <li>
              <p id="bot-meno" onClick={() => navigate("../bot-detail/3232")}>
                Bot 1
              </p>
              <p id="bot-mena">$7403.34</p>
              <span style={{ color: "#16c784" }} id="zmena">
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                1400.3%
              </span>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span style={{ color: "#ea3943" }} id="zmena">
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                2.44%
              </span>
              <span style={{ color: "#16c784" }} id="zmena">
                5.07777%
              </span>
              <span style={{ color: "#16c784" }} id="zmena">
                1400.3%
              </span>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span style={{ color: "#16c784" }} id="zmena">
                0.24%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                1400.3%
              </span>
            </li>

            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span style={{ color: "#16c784" }} id="zmena">
                0.24%
              </span>
              <span style={{ color: "#16c784" }} id="zmena">
                2.44%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                5.07777%
              </span>
              <span style={{ color: "#ea3943" }} id="zmena">
                1400.3%
              </span>
            </li>
          </ol>
        </li>
        <li className="li-burza">
          <p id="burza-meno">Burza 2</p>
          <ol className="bot-list">
            <div id="divider"></div>
            <li className="legenda">
              <p id="bot-meno">Meno</p>
              <p id="bot-mena">Stav</p>
              <span id="zmena">24h</span>
              <span id="zmena">7d</span>
              <span id="zmena">30d</span>
              <span id="zmena">all-time</span>
            </li>
            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span id="zmena">0.24%</span>
              <span id="zmena">2.44%</span>
              <span id="zmena">5.07777%</span>
              <span id="zmena">1400.3%</span>
            </li>
            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span id="zmena">0.24%</span>
              <span id="zmena">2.44%</span>
              <span id="zmena">5.07777%</span>
              <span id="zmena">1400.3%</span>
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
              <span id="zmena">24h</span>
              <span id="zmena">7d</span>
              <span id="zmena">30d</span>
              <span id="zmena">all-time</span>
            </li>
            <li>
              <p id="bot-meno">Bot 1</p>
              <p id="bot-mena">ETH</p>
              <span id="zmena">0.24%</span>
              <span id="zmena">2.44%</span>
              <span id="zmena">5.07777%</span>
              <span id="zmena">1400.3%</span>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  );
}

export default BotList;
