import "./ObchodyList.css";

import { faker } from "@faker-js/faker";
import { useState, useMemo, useCallback, useEffect } from "react";

import { formatDate } from "../pomocky/datumovanie";
import { getPage } from "../pomocky/fakeApi";

import Pagination from "./Pagination";
import { BiChevronsDown, BiChevronsUp, BiSearchAlt } from "react-icons/bi";

// const data = [
//   {
//     cislo: "1",
//     datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
//     obPar: "ETH - USDT",
//   },
//   {
//     cislo: "2",
//     datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
//     obPar: "LTC - USDT",
//   },
//   {
//     cislo: "35",
//     datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
//     obPar: "LTC - USDT",
//   },
//   {
//     cislo: "34",
//     datum: faker.datatype.datetime({ min: 1047500000000, max: 1658500000000 }),
//     obPar: "ETC - USDT",
//   },
// ];

function ObchodyList() {
  const [data, setData] = useState({ data: [] });
  const [curPage, setCurPage] = useState(1);
  const [listData, setListData] = useState([]);

  const [filters, setFilters] = useState({
    cislo: "",
    datum: "",
    obPar: "",
    ascend: { curType: "num", typeDate: false, typeNum: false },
    dateStart: "07/22/1977",
    dateEnd: formatDate(new Date()),
  });
  const onSetFilters = useCallback((e, value) => {
    // console.log(value);
    setFilters((prevValues) => ({ ...prevValues, [e.target.name]: value }));
  }, []);

  const loadNewPage = useCallback(async (pageNumber) => {
    const data = await getPage(pageNumber);
    // console.log(data);
    setData(data);
    setListData([...data.data]);
  }, []);

  useEffect(() => {
    loadNewPage(curPage);
  }, [loadNewPage]);

  const filtrujData = useCallback((filters) => {
    let newData = [];
    newData = data.data.filter(({ obPar }) => obPar.toLowerCase().includes(filters.obPar.toLowerCase()));
    newData = newData.filter(({ cislo }) => cislo.includes(filters.cislo));
    newData = newData.filter(({ datum }) => {
      let filterPass = true;
      const date = new Date(datum);
      const dateStart = new Date(filters.dateStart ? filters.dateStart : "07/22/1977");
      const dateEnd = new Date(filters.dateEnd ? filters.dateEnd : formatDate(new Date()));

      if (dateStart) {
        filterPass = filterPass && dateStart < date;
      }
      if (dateEnd && filterPass) {
        filterPass = filterPass && dateEnd > date;
      }
      return filterPass;
    });

    if (filters.ascend.curType === "date") {
      newData = newData.sort((a, b) => (filters.ascend.typeDate ? Number(a.datum) - Number(b.datum) : Number(b.datum) - Number(a.datum)));
    } else if (filters.ascend.curType === "num") {
      console.log(filters.ascend.typeNum);
      newData = newData.sort((a, b) =>
        !filters.ascend.typeNum ? parseFloat(a.cislo) - parseFloat(b.cislo) : parseFloat(b.cislo) - parseFloat(a.cislo)
      );
    }
    return newData;
  });

  const loadNextPage = () => {
    if (curPage * 10 >= data.totalItems) {
      return;
    }
    loadNewPage(curPage + 1);
    setCurPage(curPage + 1);
  };

  const loadPrevPage = () => {
    if (curPage <= 1) {
      return;
    }
    loadNewPage(curPage - 1);
    setCurPage(curPage - 1);
  };

  const onSearchPress = useCallback(() => {
    setListData(filtrujData(filters));
  }, [filters, filtrujData]);

  useEffect(() => {
    setListData(filtrujData(filters));
  }, [filters.ascend]);

  return (
    <div className="obchody-cont">
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
      <ul className="bot-obchody-cont">
        <div className="legenda-obch">
          <button
            className="cislo"
            id="element"
            type="button"
            name="ascend"
            value={filters.ascend.pos}
            onClick={(e) => onSetFilters(e, { curType: "num", typeNum: !filters.ascend.typeNum, typeDate: filters.ascend.typeDate })}
          >
            {filters.ascend.typeNum ? <BiChevronsDown></BiChevronsDown> : <BiChevronsUp></BiChevronsUp>}
            Cislo
          </button>
          <button
            className="datum"
            id="element"
            type="radio"
            name="ascend"
            value={filters.ascend.pos}
            onClick={(e) => onSetFilters(e, { curType: "date", typeNum: filters.ascend.typeNum, typeDate: !filters.ascend.typeDate })}
          >
            {filters.ascend.typeDate ? <BiChevronsDown></BiChevronsDown> : <BiChevronsUp></BiChevronsUp>}
            Datum
          </button>
          <p className="obpar" id="element">
            Ob.par
          </p>
        </div>
        {listData.map((e, i) => {
          let bgColor = i % 2 == 0 ? "#13131357" : "";
          return (
            <li style={{ backgroundColor: bgColor }}>
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
        totalPosts={data.totalItems}
        currentPage={curPage}
      ></Pagination>
    </div>
  );
}

export default ObchodyList;
