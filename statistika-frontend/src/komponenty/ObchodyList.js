import "./ObchodyList.css";

import { useState, useCallback, useEffect } from "react";

import { formatDate } from "../pomocky/datumovanie";
import { getPage, filtrujData } from "../pomocky/fakeApi";

import Pagination from "./Pagination";
import { BiChevronsDown, BiChevronsUp, BiSearchAlt, BiReset } from "react-icons/bi";
import LoadingComponent from "./LoadingComponent";
import { formatPrice } from "../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";

/* filtre oddelene do komponentu aby sa zbytocne nerendroval list */
const FiltreBotList = ({ updateFilters, orderFilters }) => {
  const [filters, setFilters] = useState({
    cislo: "",
    datum: "",
    obPar: "",
    ascend: { curType: "num", typeDate: false, typeNum: false },
    dateStart: "01/01/2000",
    dateEnd: formatDate(new Date()),
  });

  const onSetFilters = useCallback((e, value) => {
    setFilters((prevValues) => ({ ...prevValues, [e.target.name]: value }));
  }, []);

  const onSearchPress = useCallback(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  const onResetPress = useCallback(() => {
    setFilters({ ...filters, cislo: "", datum: "", obPar: "", dateStart: "01/01/2000", dateEnd: formatDate(new Date()) });
    updateFilters({ ...filters, cislo: "", datum: "", obPar: "", dateStart: "01/01/2000", dateEnd: formatDate(new Date()) });
  }, [filters, updateFilters]);

  useEffect(() => {
    setFilters((prevValues) => ({ ...prevValues, ascend: orderFilters }));
  }, [orderFilters]);

  useEffect(() => {
    updateFilters(filters);
  }, [filters.ascend, updateFilters]);

  return (
    <div className="obchody-filtre">
      <button className="filtre-reset-btn" onClick={onResetPress}>
        <BiReset />
      </button>
      <div className="parameter-cont">
        <span>Číslo</span>
        <input autoComplete="off" name="cislo" value={filters.cislo} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <div className="parameter-cont">
        <span>Ob. pár</span>
        <input autoComplete="off" name="obPar" value={filters.obPar} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <div className="parameter-cont">
        <div className="nadpis-obdobie">
          <span>Obdobie</span>
        </div>
        <span>Začiatok</span>
        <input autoComplete="off" name="dateStart" value={filters.dateStart} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <div className="parameter-cont">
        <span>Koniec</span>
        <input autoComplete="off" name="dateEnd" value={filters.dateEnd} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <button className="filtre-hladat-btn" onClick={onSearchPress}>
        <BiSearchAlt></BiSearchAlt>
        Hľadať
      </button>
    </div>
  );
};

function ObchodyList() {
  const [listData, setListData] = useState({ totalItems: 0, data: [] });
  const [curPage, setCurPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState({ curType: "num", typeDate: false, typeNum: false, typePrice: false });

  const [loading, setLoading] = useState({ isLoading: false, msg: "" });

  const onOrderFilterSet = useCallback((filters) => {
    setOrderFilter(filters);
  }, []);

  const loadNewPage = useCallback(async (pageNumber) => {
    setLoading({ isLoading: true, msg: "" });
    const resData = await getPage(pageNumber);

    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });

    setListData(resData);
    setCurPage(pageNumber);
  }, []);

  const filterData = useCallback(async (filters) => {
    setCurPage(1);
    setLoading({ isLoading: true, msg: "" });
    const resData = await filtrujData({ ...filters });

    if (resData.totalItems === 0) {
      setLoading({ isLoading: true, msg: "Žiadna zhoda" });
    } else {
      setLoading((prevState) => {
        return { ...prevState, isLoading: false };
      });
    }

    setListData(resData);
  }, []);

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
    <div className="obchody-cont">
      <FiltreBotList updateFilters={filterData} orderFilters={orderFilter} />
      <div className="obchody-list-const">
        <div className="legenda-obch">
          <button
            className="cislo"
            id="element"
            name="ascend"
            style={{ pointerEvents: loading.isLoading ? "none" : "" }}
            onClick={(e) =>
              onOrderFilterSet({ curType: "num", typeNum: !orderFilter.typeNum, typeDate: orderFilter.typeDate, typePrice: orderFilter.typePrice })
            }
          >
            {orderFilter.typeNum ? <BiChevronsDown /> : <BiChevronsUp />}
            Číslo
          </button>
          <button
            className="datum"
            id="element"
            name="ascend"
            style={{ pointerEvents: loading.isLoading ? "none" : "" }}
            onClick={(e) =>
              onOrderFilterSet({ curType: "date", typeNum: orderFilter.typeNum, typeDate: !orderFilter.typeDate, typePrice: orderFilter.typePrice })
            }
          >
            {orderFilter.typeDate ? <BiChevronsDown /> : <BiChevronsUp />}
            Dátum
          </button>
          <button
            className="cena"
            id="element"
            name="ascend"
            style={{ pointerEvents: loading.isLoading ? "none" : "" }}
            onClick={(e) =>
              onOrderFilterSet({ curType: "price", typeNum: orderFilter.typeNum, typeDate: orderFilter.typeDate, typePrice: !orderFilter.typePrice })
            }
          >
            {orderFilter.typePrice ? <BiChevronsDown /> : <BiChevronsUp />}
            Cena
          </button>
          <p className="obpar" id="element">
            Ob.pár
          </p>
        </div>
        <ul className="bot-obchody-cont">
          {listData.data.map((e, i) => {
            let bgColor = i % 2 === 0 ? "#13131357" : "";
            return (
              <li key={i} style={{ backgroundColor: bgColor, display: loading.isLoading ? "none" : "" }}>
                <p className="cislo" id="element">
                  {e.cislo}
                </p>
                <p className="datum" id="element">
                  {formatDate(e.datum)}
                </p>
                <p className="cena" id="element">
                  <MdEuroSymbol className="euro-symbol" />
                  {formatPrice(e.cena, ",")}
                </p>
                <p className="obpar" id="element">
                  {e.obPar}
                </p>
              </li>
            );
          })}
          {loading.isLoading && <LoadingComponent background={true} error={loading.msg} />}
        </ul>
      </div>
      <Pagination
        paginateFront={() => loadNextPage()}
        paginateBack={() => loadPrevPage()}
        postsPerPage={15}
        totalPosts={listData.totalItems}
        currentPage={curPage}
        isLoading={loading.isLoading}
      />
    </div>
  );
}

export default ObchodyList;
