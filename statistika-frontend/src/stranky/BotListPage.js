import "./BotListPage.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { getFakeListData } from "../pomocky/fakeApi";
import useLoadingManager from "../customHooky/useLoadingManager";
import LoadingComponent from "../komponenty/zdielane/LoadingComponent";
import { BiUserPlus } from "react-icons/bi";
import useWindowDimensions from "../customHooky/useWindowDimensions";

import BotListComponentMemo from "../komponenty/botList/BotListComponentMemo";
import BotPowerSwitchComponent from "../komponenty/botList/BotPowerSwitchComponent";

function BotListPage() {
  const [chartData, setChData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(100, true);
  const navigate = useNavigate();

  const genFakeChartData = useCallback(async () => {
    const requestOne = axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=168&toTs=-1&agregate=1&api_key=1421fcb8f7df3e57917155b6cf1a8850b2f901bfd3c84162bc8a3b6d90194cd9`
    );
    const requestTwo = axios.get(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=USD&limit=168&toTs=-1&agregate=1&api_key=1421fcb8f7df3e57917155b6cf1a8850b2f901bfd3c84162bc8a3b6d90194cd9`
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
    setLoadingStep("render");
  }, [setLoadingStep]);

  const getFakeApiListData = useCallback(async () => {
    setLoadingStep("fetch");
    const res = await getFakeListData();
    setPageData(res);
  }, [setLoadingStep]);

  useEffect(() => {
    genFakeChartData();
    getFakeApiListData();
  }, [genFakeChartData, getFakeApiListData]);

  const height = useWindowDimensions().height;

  return (
    <div className="bot-list-main-div">
      <div className="bot-page-title-div">
        <p className="title-hori">Bot List</p>
        <BotPowerSwitchComponent />
      </div>
      <div>
        <button className="show-bot-button" onClick={(e) => navigate("/vytvorenie-bota")}>
          <BiUserPlus />
        </button>
      </div>
      <ul className="list-burza">
        {loading && <LoadingComponent background={true} height={height - 230} loadingText={loadingMessage}></LoadingComponent>}
        {!loading && <BotListComponentMemo data={{ pageData, chartData }} />}
      </ul>
    </div>
  );
}

export default BotListPage;
