import { useCallback } from "react";
import "./GrafPage.css";
import axios from "axios";
import MainGraf from "../komponenty/grafy/MainGraf";
import BurzaGraf from "../komponenty/grafy/BurzaGraf";

import { filterDate } from "../pomocky/datumovanie";
import CelkovyVyvinComponent from "../komponenty/grafPage/CelkovyVyvinComponent";

function Graf() {
  const mainGrafRequestData = useCallback(async (duration) => {
    let requestParams = filterDate(duration);
    let resData = [];
    let docData = [];
    let dataToUpdate = [[], [], []];
    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    dataToUpdate[0].push(...docData);

    docData = [];
    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=ETH&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    dataToUpdate[1].push(...docData);

    docData = [];
    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=LTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );
    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });
    dataToUpdate[2].push(...docData);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(150);
    return dataToUpdate;
  }, []);

  const subChartRequestData = useCallback(async (duration, index) => {
    let requestParams = filterDate(duration);

    let resData = [];
    let docData = [];
    // let dataToUpdate = [[], [], [], []];

    resData = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histo${requestParams.tick}?fsym=BTC&tsym=USD&limit=${requestParams.amount}&toTs=-1&agregate=1&api_key=YOURKEYHERE`
    );

    resData.data.Data.Data.forEach((e) => {
      docData.push({ x: new Date(e.time * 1000), y: e.high });
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    return docData;
  }, []);

  let shouldPutTwo = true;
  let shouldPutTwoCount = 0;
  return (
    <div className="graf-page-div">
      <div className="graf-page-title-div">
        <p className="title-hori">Dashboard</p>
      </div>
      <CelkovyVyvinComponent />
      <div id="graf-burza-cont">
        <MainGraf grafRequestData={mainGrafRequestData}></MainGraf>
      </div>
      <div className="graf-burzy-cont">
        <ul>
          {["SH", "BTC", "ETH", "LTC"].map((e, i) => {
            let farbaCiary = undefined;

            if (i > 0) {
              shouldPutTwoCount++;
            }

            if (i > 0 && shouldPutTwo) {
              farbaCiary = { c: "#0DCF97", g: "rgba(	13, 207, 151, 0.25)" };

              if (shouldPutTwoCount === 2) {
                shouldPutTwo = false;
                shouldPutTwoCount = 0;
              }
            }
            if (!shouldPutTwo && shouldPutTwoCount === 2) {
              shouldPutTwoCount = 0;
              shouldPutTwo = true;
            }

            return (
              <li key={i} className="burza">
                <div className="burza-cont">
                  <p id="title">{"Burza " + (i + 1)}</p>
                  <BurzaGraf grafRequestData={subChartRequestData} index={i} farbaCiary={farbaCiary}></BurzaGraf>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Graf;
