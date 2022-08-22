import "./ObchodyList.css";

import { useState, useCallback, useEffect } from "react";

import { formatDate, getCompatibleValue } from "../pomocky/datumovanie";
import { getPage, filtrujData } from "../pomocky/fakeApi";

import Pagination from "./Pagination";
import { BiChevronsDown, BiChevronsUp, BiSearchAlt, BiReset } from "react-icons/bi";
import LoadingComponent from "./LoadingComponent";
import { useLoadingManager, LoadingComponentT } from "../komponenty/LoadingManager.js";
import { formatPrice } from "../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";
import CalendarComp from "./CalendarComp";
import { TbCalendar } from "react-icons/tb";

/* filtre oddelene do komponentu aby sa zbytocne nerendroval list */
const FiltreBotList = ({ updateFilters, orderFilters, parentLoading }) => {
  const initialStart = new Date(946684800);
  const initialEnd = new Date();

  const [datePlaceholder, setDatePlaceholder] = useState(formatDate(initialStart) + " - " + formatDate(initialEnd));
  const [button, clicked] = useState(false);

  const [filters, setFilters] = useState({
    buy: null,
    datum: "",
    maker: null,
    ascend: { curType: "date", typeDate: false, typeNum: false },
    dateStart: initialStart,
    dateEnd: initialEnd,
  });

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
    clicked(false);
  }, []);

  const onSearchPress = useCallback(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  const onResetPress = useCallback(() => {
    setDatePlaceholder(formatDate(initialStart) + " - " + formatDate(initialEnd));
    setFilters({ ...filters, buy: null, datum: "", maker: null, dateStart: initialStart, dateEnd: initialEnd });
    updateFilters({ ...filters, buy: null, datum: "", maker: null, dateStart: initialStart, dateEnd: initialEnd });
  }, [filters, updateFilters]);

  useEffect(() => {
    setFilters((prevValues) => ({ ...prevValues, ascend: orderFilters }));
  }, [orderFilters]);

  useEffect(() => {
    updateFilters(filters);
  }, [filters.ascend, updateFilters]);

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
          <div id={!filters.buy == null ? "selected" : filters.buy ? "selected" : "unselected"}>Buy</div>
          <div id={!filters.buy == null ? "unselected" : !filters.buy ? "selected" : "unselected"}>Sell</div>
        </button>
      </div>
      <div className="input-nadpis-cont">
        <button
          className="prepinac-maly"
          id="prepinac-lava-prava"
          name="zdroj"
          onClick={(e) => setFilters((prevValues) => ({ ...prevValues, maker: !prevValues.maker }))}
        >
          <div id={!filters.maker == null ? "selected" : filters.maker ? "selected" : "unselected"}>Maker</div>
          <div id={!filters.maker == null ? "unselected" : !filters.maker ? "selected" : "unselected"}>Taker</div>
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
            if (
              !/[A-Za-z]/.test(e.target.value) &&
              /(\s-\s)/.test(e.target.value) &&
              e.target.value.split("/").length === 5 &&
              e.target.value.split(":").length === 3
            ) {
              setDatePlaceholder(e.target.value);
              let dateSpread = e.target.value.split(" - ");
              onSetDate([new Date(getCompatibleValue(dateSpread[0])), new Date(getCompatibleValue(dateSpread[1]))]);
            }
          }}
        ></input>
        <div className="calendar-div-parent">
          <CalendarComp minDate={new Date(946684800)} maxDate={new Date()} display={button} onCalendarClick={onDateButtonPress} />
          <button className="calendar-button-open" onClick={(e) => clicked(!button)}>
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

function ObchodyList() {
  const [listData, setListData] = useState({ totalItems: 0, data: [] });
  const [curPage, setCurPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState({ curType: "date", typeDate: false, typeNum: false, typePrice: false });

  const [loading, setLoadingStep, loadingMessage, errorMessage] = useLoadingManager();

  const onOrderFilterSet = useCallback((filters) => {
    setOrderFilter(filters);
  }, []);

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

  const filterData = useCallback(
    async (filters) => {
      setCurPage(1);
      setLoadingStep("fetch");
      const resData = await filtrujData({ ...filters });
      if (resData.totalItems === 0) {
        setLoadingStep("none");
      } else {
        setLoadingStep("render");
      }
      setListData(resData);
    },
    [setLoadingStep]
  );

  /* passuju sa Pagination.js */
  const loadNextPage = () => {
    if (curPage * 15 < listData.totalItems) {
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
      <FiltreBotList updateFilters={filterData} orderFilters={orderFilter} parentLoading={loading && errorMessage ? false : loading} />
      <div className="flex-obchody-cont">
        <div className="obchody-cont">
          <div className="obchody-list-const">
            <div className="legenda-obch">
              <button
                className="datum"
                id="element"
                name="ascend"
                style={{ pointerEvents: loading ? "none" : "" }}
                onClick={(e) =>
                  onOrderFilterSet({
                    curType: "date",
                    typeNum: orderFilter.typeNum,
                    typeDate: !orderFilter.typeDate,
                    typePrice: orderFilter.typePrice,
                  })
                }
              >
                {orderFilter.typeDate ? <BiChevronsDown /> : <BiChevronsUp />}
                Dátum a čas
              </button>
              <p className="cislo" id="element">
                Buy/Sell
              </p>
              <button
                className="cena"
                id="element"
                name="ascend"
                style={{ pointerEvents: loading ? "none" : "" }}
                onClick={(e) =>
                  onOrderFilterSet({
                    curType: "price",
                    typeNum: orderFilter.typeNum,
                    typeDate: orderFilter.typeDate,
                    typePrice: !orderFilter.typePrice,
                  })
                }
              >
                {orderFilter.typePrice ? <BiChevronsDown /> : <BiChevronsUp />}
                Cena
              </button>
              <button
                className="mnozstvo"
                id="element"
                name="ascend"
                style={{ pointerEvents: loading ? "none" : "" }}
                onClick={(e) =>
                  onOrderFilterSet({
                    curType: "num",
                    typeNum: !orderFilter.typeNum,
                    typeDate: orderFilter.typeDate,
                    typePrice: orderFilter.typePrice,
                  })
                }
              >
                {orderFilter.typeNum ? <BiChevronsDown /> : <BiChevronsUp />}
                Množstvo
              </button>
              <p className="maker" id="element">
                Maker/Taker
              </p>
            </div>
            <ul className="bot-obchody-cont">
              {listData.data.map((e, i) => {
                let bgColor = i % 2 === 0 ? "rgb(57, 60, 74)" : "";
                return (
                  <li key={i} style={{ backgroundColor: bgColor, display: loading ? "none" : "" }}>
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
              {loading && <LoadingComponent loadingText={loadingMessage} error={errorMessage} />}
            </ul>
          </div>
        </div>
      </div>
      <Pagination
        paginateFront={() => loadNextPage()}
        paginateBack={() => loadPrevPage()}
        postsPerPage={15}
        totalPosts={listData.totalItems}
        currentPage={curPage}
        isLoading={loading}
      />
    </div>
  );
}

export default ObchodyList;
