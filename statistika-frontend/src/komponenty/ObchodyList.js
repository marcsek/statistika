import "./ObchodyList.css";

import React, { useState, useCallback, useEffect, useRef } from "react";

import { formatDate, getCompatibleValue } from "../pomocky/datumovanie";
import { getPage, filtrujData } from "../pomocky/fakeApi";

import Pagination from "./Pagination";
import { BiChevronsDown, BiChevronsUp, BiSearchAlt, BiReset } from "react-icons/bi";
import { useLoadingManager, LoadingComponent } from "../komponenty/LoadingManager.js";
import { formatPrice } from "../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import CalendarComp from "./CalendarComp";
import { TbCalendar } from "react-icons/tb";

const initialStart = new Date(946681200000);
const initialEnd = new Date();
const defaultFilters = {
  buy: null,
  datum: "",
  maker: null,
  ascend: { curType: "date", typeDate: false, typeNum: false, typePrice: false },
  dateStart: initialStart,
  dateEnd: initialEnd,
};

/* filtre oddelene do komponentu aby sa zbytocne nerendroval list */
const FiltreBotList = ({ updateFilters, parentLoading }) => {
  const [datePlaceholder, setDatePlaceholder] = useState(formatDate(initialStart) + " - " + formatDate(initialEnd));
  const [filters, setFilters] = useState({ ...defaultFilters });
  const calendarRef = useRef(null);

  const onSetDate = useCallback((value) => {
    setFilters((prevValues) => ({
      ...prevValues,
      dateStart: value[0] ? value[0] : prevValues.dateStart,
      dateEnd: value[1] ? value[1] : prevValues.dateEnd,
    }));
  }, []);

  const onDateButtonPress = useCallback((value) => {
    const val1 = value[0];
    const val2 = value[1];
    if (val1 && val2) {
      setDatePlaceholder(formatDate(value[0]) + " - " + formatDate(value[1]));
      setFilters((prevValues) => ({
        ...prevValues,
        dateStart: val1 ? val1 : prevValues.dateStart,
        dateEnd: val2 ? val2 : prevValues.dateEnd,
      }));
    }
    calendarRef.current.changeOpenState();
  }, []);

  const onSearchPress = useCallback(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  const onResetPress = useCallback(() => {
    setDatePlaceholder(formatDate(initialStart) + " - " + formatDate(initialEnd));
    setFilters({ ...filters, ...defaultFilters });
    updateFilters({ ...filters, ...defaultFilters });
  }, [filters, updateFilters]);

  const checkDateFormatPlaceholder = (value) => {
    if (!/[A-Za-z]/.test(value) && /(\s-\s)/.test(value) && value.split("/").length === 5 && value.split(":").length === 3) {
      return true;
    }
    return false;
  };

  return (
    <div className="obchody-filtre">
      <button className="filtre-reset-btn" onClick={parentLoading ? undefined : onResetPress}>
        <BiReset />
      </button>
      <div className="input-nadpis-cont">
        <button
          className="prepinac-maly"
          id="prepinac-lava-prava"
          name="zdroj"
          onClick={(e) => setFilters((prevValues) => ({ ...prevValues, buy: !prevValues.buy }))}
        >
          <div className={filters.buy !== null ? "isActive" : ""} id={!filters.buy == null ? "selected" : filters.buy ? "selected" : "unselected"}>
            Buy
          </div>
          <div className={filters.buy !== null ? "isActive" : ""} id={!filters.buy == null ? "unselected" : !filters.buy ? "selected" : "unselected"}>
            Sell
          </div>
        </button>
      </div>
      <div className="input-nadpis-cont">
        <button
          className="prepinac-maly"
          id="prepinac-lava-prava"
          name="zdroj"
          onClick={(e) => setFilters((prevValues) => ({ ...prevValues, maker: !prevValues.maker }))}
        >
          <div
            className={filters.maker !== null ? "isActive" : ""}
            id={!filters.maker == null ? "selected" : filters.maker ? "selected" : "unselected"}
          >
            Maker
          </div>
          <div
            className={filters.maker !== null ? "isActive" : ""}
            id={!filters.maker == null ? "unselected" : !filters.maker ? "selected" : "unselected"}
          >
            Taker
          </div>
        </button>
      </div>
      <div id="datum" className="parameter-cont">
        <div className="nadpis-obdobie">
          <span>Obdobie</span>
        </div>
        <input
          autoComplete="off"
          name="dateStart"
          id="dateStart"
          value={datePlaceholder}
          onChange={(e) => {
            if (checkDateFormatPlaceholder(e.target.value)) {
              setDatePlaceholder(e.target.value);
              let dateSpread = e.target.value.split(" - ");
              onSetDate([new Date(getCompatibleValue(dateSpread[0])), new Date(getCompatibleValue(dateSpread[1]))]);
            }
          }}
        ></input>
        <div className="calendar-div-parent">
          <CalendarComp
            ref={calendarRef}
            parentLoading={parentLoading}
            minDate={initialStart}
            maxDate={initialEnd}
            onCalendarClick={onDateButtonPress}
          />
          <button className="calendar-button-open" onClick={(e) => calendarRef.current.changeOpenState()}>
            <TbCalendar />
          </button>
        </div>
      </div>
      <button className="filtre-hladat-btn" onClick={parentLoading ? undefined : onSearchPress}>
        <BiSearchAlt></BiSearchAlt>
        Hľadať
      </button>
    </div>
  );
};

const OrderFiltersBotList = ({ updateOrderFilters, parentLoading = false }) => {
  const [orderFilters, setOrderFilters] = useState({ ...defaultFilters }.ascend);

  const onOrderFiltersSet = useCallback((changedFilter) => {
    setOrderFilters((prevFilters) => ({ ...prevFilters, ...changedFilter }));
  }, []);

  useEffect(() => {
    updateOrderFilters(orderFilters);
  }, [orderFilters, updateOrderFilters]);

  return (
    <div className="legenda-obch">
      <button
        className="datum"
        id="element"
        name="ascend"
        style={{ pointerEvents: parentLoading ? "none" : "" }}
        onClick={(e) =>
          onOrderFiltersSet({
            curType: "date",
            typeDate: !orderFilters.typeDate,
          })
        }
      >
        {orderFilters.typeDate ? (
          <BiChevronsDown style={{ color: orderFilters.curType !== "date" && "#444757" }} />
        ) : (
          <BiChevronsUp style={{ color: orderFilters.curType !== "date" && "#444757" }} />
        )}
        Dátum a Čas
      </button>
      <p className="cislo" id="element">
        Buy/Sell
      </p>
      <button
        className="cena"
        id="element"
        name="ascend"
        style={{ pointerEvents: parentLoading ? "none" : "" }}
        onClick={(e) =>
          onOrderFiltersSet({
            curType: "price",
            typePrice: !orderFilters.typePrice,
          })
        }
      >
        {orderFilters.typePrice ? (
          <BiChevronsDown style={{ color: orderFilters.curType !== "price" && "#444757" }} />
        ) : (
          <BiChevronsUp style={{ color: orderFilters.curType !== "price" && "#444757" }} />
        )}
        Cena
      </button>
      <button
        className="mnozstvo"
        id="element"
        name="ascend"
        style={{ pointerEvents: parentLoading ? "none" : "" }}
        onClick={(e) =>
          onOrderFiltersSet({
            curType: "num",
            typeNum: !orderFilters.typeNum,
          })
        }
      >
        {orderFilters.typeNum ? (
          <BiChevronsDown style={{ color: orderFilters.curType !== "num" && "#444757" }} />
        ) : (
          <BiChevronsUp style={{ color: orderFilters.curType !== "num" && "#444757" }} />
        )}
        Množstvo
      </button>
      <p className="maker" id="element">
        Maker/Taker
      </p>
    </div>
  );
};

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
