import "./ObchodyList.css";

import { useState, useCallback, useEffect, useMemo } from "react";

import { formatDate } from "../pomocky/datumovanie";
import { getPage, filtrujData } from "../pomocky/fakeApi";

import Pagination from "./Pagination";
import { BiChevronsDown, BiChevronsUp, BiSearchAlt } from "react-icons/bi";

/* filtre oddelene do komponentu aby sa zbytocne nerendroval list */
const FiltreBotList = ({ updateFilters, orderFilters }) => {
  const [filters, setFilters] = useState({
    cislo: "",
    datum: "",
    obPar: "",
    ascend: { curType: "num", typeDate: false, typeNum: false },
    dateStart: "07/22/1977",
    dateEnd: formatDate(new Date()),
  });

  const onSetFilters = useCallback((e, value) => {
    setFilters((prevValues) => ({ ...prevValues, [e.target.name]: value }));
  }, []);

  const onSearchPress = useCallback(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  useEffect(() => {
    setFilters((prevValues) => ({ ...prevValues, ascend: orderFilters }));
  }, [orderFilters]);

  useEffect(() => {
    updateFilters(filters);
  }, [filters.ascend, updateFilters]);

  return (
    <div className="obchody-filtre">
      <div className="parameter-cont">
        <span>Ob. par</span>
        <input autoComplete="off" name="obPar" defaultValue={filters.obPar} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <div className="parameter-cont">
        <span>Meno</span>
        <input name="cislo" defaultValue={filters.cislo} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <div className="parameter-cont">
        <span>Zaciatok</span>
        <input name="dateStart" defaultValue={filters.dateStart} onChange={(e) => onSetFilters(e, e.target.value)}></input>
      </div>
      <div className="parameter-cont">
        <span>Koniec</span>
        <input name="dateEnd" defaultValue={filters.dateEnd} onChange={(e) => onSetFilters(e, e.target.value)}></input>
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
  const [orderFilter, setOrderFilter] = useState({ curType: "num", typeDate: false, typeNum: false });

  const onOrderFilterSet = useCallback((filters) => {
    setOrderFilter(filters);
  }, []);

  const loadNewPage = useCallback(async (pageNumber) => {
    const resData = await getPage(pageNumber);
    setListData(resData);
  }, []);

  const filterData = useCallback(async (filters) => {
    const resData = await filtrujData({ ...filters });
    setListData(resData);
    setCurPage(1);
  }, []);

  useEffect(() => {
    loadNewPage(curPage);
  }, [loadNewPage, curPage]);

  /* passuju sa Pagination.js */
  const loadNextPage = () => {
    if (curPage * 15 < listData.totalItems) {
      setCurPage(curPage + 1);
    }
  };

  const loadPrevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };
  /*   */

  return (
    <div className="obchody-cont">
      <FiltreBotList updateFilters={filterData} orderFilters={orderFilter} />
      <ul className="bot-obchody-cont">
        <div className="legenda-obch">
          <button
            className="cislo"
            id="element"
            name="ascend"
            onClick={(e) => onOrderFilterSet({ curType: "num", typeNum: !orderFilter.typeNum, typeDate: orderFilter.typeDate })}
          >
            {orderFilter.typeNum ? <BiChevronsDown /> : <BiChevronsUp />}
            Cislo
          </button>
          <button
            className="datum"
            id="element"
            name="ascend"
            onClick={(e) => onOrderFilterSet({ curType: "date", typeNum: orderFilter.typeNum, typeDate: !orderFilter.typeDate })}
          >
            {orderFilter.typeDate ? <BiChevronsDown /> : <BiChevronsUp />}
            Datum
          </button>
          <p className="obpar" id="element">
            Ob.par
          </p>
        </div>
        {listData.data.map((e, i) => {
          let bgColor = i % 2 === 0 ? "#13131357" : "";
          return (
            <li key={i} style={{ backgroundColor: bgColor }}>
              <p className="cislo" id="element">
                {e.cislo}
              </p>
              <p className="datum" id="element">
                {formatDate(e.datum)}
              </p>
              <p className="obpar" id="element">
                {e.obPar}
              </p>
            </li>
          );
        })}
      </ul>
      <Pagination
        paginateFront={() => loadNextPage()}
        paginateBack={() => loadPrevPage()}
        postsPerPage={15}
        totalPosts={listData.totalItems}
        currentPage={curPage}
      />
    </div>
  );
}

export default ObchodyList;
