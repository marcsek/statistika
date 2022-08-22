import "./BotListPage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { VscTriangleUp, VscTriangleDown, VscCircleFilled } from "react-icons/vsc";
import { MdEuroSymbol } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";

import ListGraf from "../komponenty/grafy/ListGraf";
import { getFakeListData } from "../pomocky/fakeApi";
import { formatPrice, formatCrypto } from "../pomocky/cislovacky.js";
import LoadingComponent from "../komponenty/LoadingComponent";
import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import useWindowDimensions from "../pomocky/window";

function ButtonComponent() {
  const [buttonClicked, setButtonClick] = useState(false);

  return (
    <button className="vypinac" id={!buttonClicked ? "red" : "green"} onClick={() => setButtonClick(!buttonClicked)}>
      {!buttonClicked ? <MdOutlinePowerOff /> : <MdOutlinePower />}
      {!buttonClicked ? "Vypnúť botov" : "Zapnúť Botov"}
    </button>
  );
}

function NovyBotComp() {
  const navigate = useNavigate();

  return (
    <div>
      <button className="show-bot-button" onClick={(e) => navigate("/vytvorenie-bota")}>
        <BiUserPlus />
      </button>
    </div>
  );
}

function BotList() {
  const navigate = useNavigate();

  const [chartData, setChData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: true,
    msg: "",
    hasError: { status: false, msg: "" },
  });

  const genFakeChartData = useCallback(async () => {
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
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });
  }, []);

  const getFakeApiListData = useCallback(async () => {
    setLoading((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const res = await getFakeListData();
    // setLoading((prevState) => {
    //   return { ...prevState, isLoading: false };
    // });
    setPageData(res);
  }, []);

  useEffect(() => {
    genFakeChartData();
    getFakeApiListData();
  }, [genFakeChartData, getFakeApiListData]);

  const height = useWindowDimensions().height;

  return (
    <div className="bot-list-main-div">
      <div className="bot-page-title-div">
        <p className="title-hori">Bot List</p>
        <ButtonComponent />
      </div>
      <NovyBotComp requestData={getFakeApiListData} />
      {/* list vsetkych burzi */}
      <ul style={{ display: loading.isLoading ? "" : "" }} className="list-burza">
        {loading.isLoading && <LoadingComponent background={true} height={height - 225} loadingText={loading.msg}></LoadingComponent>}
        {!loading.isLoading &&
          pageData.map((burza, i) => {
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
      </ul>
    </div>
  );
}

export default BotList;
