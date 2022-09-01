import { useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./BotDetailPage.css";
import { filterDate } from "../pomocky/datumovanie";

import BotGraf from "../komponenty/grafy/BotGraf.js";
import ObchodyList from "../komponenty/botDetail/ObchodyList.js";
import ParametreEditor from "../komponenty/formParametreBota/ParametreEditor.js";
import VyberComponent from "../komponenty/botDetail/VyberComponent.js";
import StatusIndicatorComponent from "../komponenty/botDetail/StatusIndicatorComponent.js";

function BotDetail() {
  const { botId } = useParams();
  document.title = `Bot ${botId} | Highdmin`;

  const chartRequestData = useCallback(async (duration) => {
    let requestParams = filterDate(duration);

    let resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    let chartData = [];
    resData.data.Data.Data.forEach((e) => {
      chartData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(200);
    return chartData;
  }, []);

  return (
    <div className="bot-main-cont">
      <div className="title-cont">
        <p className="bot-title-main" id="title">
          Bot {botId}
        </p>
        <StatusIndicatorComponent />
      </div>
      <div className="bot-major-cont">
        <div className="bot-vyber-major-cont">
          <VyberComponent />
        </div>
        <div className="bot-graf-major-cont">
          <div className="bot-graf-cont">
            <span className="graf-bot-title" id="title">
              Graf vývoja
            </span>
            <div className="bot-samotny-graf">
              <BotGraf grafRequestData={chartRequestData} />
            </div>
          </div>
        </div>
      </div>
      <div className="parametre-div" style={{ position: "relative" }}>
        <span className="para-title" id="title">
          Parametre
        </span>
        <ParametreEditor />
      </div>
      <div className="list-obchodov-div" style={{ position: "relative" }}>
        <span className="obchody-title" id="title">
          Zoznam obchodov
        </span>
        <ObchodyList />
      </div>
    </div>
  );
}

export default BotDetail;
