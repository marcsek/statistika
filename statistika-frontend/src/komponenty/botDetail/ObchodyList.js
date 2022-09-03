import "./ObchodyList.css";
import React, { useState, useCallback, useRef } from "react";

import { formatDate } from "../../pomocky/datumovanie";
import { getPage, filtrujData } from "../../pomocky/fakeApi";
import Pagination from "./Pagination";
import useLoadingManager from "../../customHooky/useLoadingManager";
import LoadingComponent from "../zdielane/LoadingComponent";
import { formatPrice } from "../../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import { defaultFilters } from "./obchodyList/DefaultFiltre";

import FiltreBotList from "./obchodyList/FiltreBotList";
import OrderFiltersBotList from "./obchodyList/OrderFiltreBotList";

const ObchodyListMemo = React.memo(({ listData }) => {
  return (
    <ul className="bot-obchody-cont">
      {listData.data.map((e, i) => {
        let bgColor = i % 2 === 0 ? "#383c4b" : "";
        return (
          <li key={i} style={{ backgroundColor: bgColor }}>
            <p className="datum" id="element">
              {formatDate(e.datum)}
            </p>
            <p className="cislo" id="element">
              {e.buy}
            </p>
            <p className="cena" id="element">
              <MdEuroSymbol className="euro-symbol" />
              {formatPrice(e.cena, ",")}
            </p>
            <p className="mnozstvo" id="element">
              {e.mnozstvo}
            </p>
            <p className="maker" id="element">
              {e.maker}
            </p>
          </li>
        );
      })}
    </ul>
  );
});

function ObchodyList() {
  const [listData, setListData] = useState({ totalItems: 0, data: [] });
  const [curPage, setCurPage] = useState(1);
  const allFilters = useRef({ ...defaultFilters });

  const [loading, setLoadingStep, loadingMessage, errorMessage] = useLoadingManager();

  const loadNewPage = useCallback(
    async (pageNumber) => {
      setLoadingStep("fetch");
      const resData = await getPage(pageNumber);

      setLoadingStep("render");
      setListData(resData);
      setCurPage(pageNumber);
    },
    [setLoadingStep]
  );

  const onFiltersServerReq = useCallback(async () => {
    setCurPage(1);
    setLoadingStep("fetch");
    const resData = await filtrujData({ ...allFilters.current });
    if (resData.totalItems === 0) {
      setLoadingStep("none");
    } else {
      setLoadingStep("render");
    }
    setListData(resData);
  }, [setLoadingStep]);

  const updateOrderFilters = useCallback(
    async (orderFilters) => {
      allFilters.current.ascend = orderFilters;
      onFiltersServerReq();
    },
    [onFiltersServerReq]
  );

  const updateFilters = useCallback(
    async (filters) => {
      allFilters.current = { ascend: allFilters.current.ascend, ...filters };
      onFiltersServerReq();
    },
    [onFiltersServerReq]
  );

  /* passuju sa Pagination.js */
  const loadNextPage = () => {
    if (curPage * 30 < listData.totalItems) {
      loadNewPage(curPage + 1);
    }
  };

  const loadPrevPage = () => {
    if (curPage > 1) {
      loadNewPage(curPage - 1);
    }
  };
  /*   */

  return (
    <div className="obchody-list-major-cont">
      <FiltreBotList updateFilters={updateFilters} parentLoading={loading && errorMessage ? false : loading} />
      <div className="flex-obchody-cont">
        <div className="obchody-cont">
          <div className="obchody-list-const">
            <OrderFiltersBotList updateOrderFilters={updateOrderFilters} parentLoading={loading && errorMessage ? false : loading} />
            <ObchodyListMemo listData={listData}> </ObchodyListMemo>
            {loading && <LoadingComponent background={true} loadingText={loadingMessage} error={errorMessage} />}
          </div>
        </div>
      </div>
      <Pagination
        paginateFront={() => loadNextPage()}
        paginateBack={() => loadPrevPage()}
        postsPerPage={30}
        totalPosts={listData.totalItems}
        currentPage={curPage}
        isLoading={loading}
      />
    </div>
  );
}

export default ObchodyList;
