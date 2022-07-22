import "./ObchodyList.css";

import { faker } from "@faker-js/faker";
import { useState, useMemo, useCallback, useEffect } from "react";

import { formatDate } from "../pomocky/datumovanie";
import { getPage } from "../pomocky/fakeApi";

import Pagination from "./Pagination";

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
    ascend: { type: "date", pos: true },
    dateStart: "07/22/1977",
    dateEnd: formatDate(new Date()),
  });
  const onSetFilters = useCallback((e, value) => {
    setFilters((prevValues) => ({ ...prevValues, [e.target.name]: value }));
  }, []);

  const loadNewPage = useCallback(async (pageNumber) => {
    const data = await getPage(pageNumber);
    console.log(data);
    setData(data);
    setListData([...data.data]);
  }, []);

  useEffect(() => {
    loadNewPage(curPage);
  }, [loadNewPage]);

  const filtrujData = (filters) => {
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

    newData =
      filters.ascend.type === "date"
        ? newData.sort((a, b) => (filters.ascend.pos ? Number(a.datum) - Number(b.datum) : Number(b.datum) - Number(a.datum)))
        : (newData = newData.sort((a, b) =>
            filters.ascend.pos ? parseFloat(a.cislo) - parseFloat(b.cislo) : parseFloat(b.cislo) - parseFloat(a.cislo)
          ));
    return newData;
  };

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

  useEffect(() => {
    setListData(filtrujData(filters));
  }, [filters]);

  return (
    <div className="obchody-cont">
      <div className="obchody-filtre">
        <div className="parameter-cont">
          <span>Ob. par</span>
          <input name="obPar" defaultValue={filters.obPar} onChange={(e) => onSetFilters(e, e.target.value)}></input>
        </div>
        <div className="parameter-cont">
          <span>Meno</span>
          <input name="cislo" defaultValue={filters.cislo} onChange={(e) => onSetFilters(e, e.target.value)}></input>
        </div>

        {/* <input
        type="radio"
        name="ascend"
        defaultChecked={filters.ascend.pos}
        onClick={(e) => onSetFilters(e, { type: "num", pos: !filters.ascend.pos })}
      ></input>
      <input
        type="radio"
        name="ascend"
        defaultChecked={filters.ascend.pos}
        onClick={(e) => onSetFilters(e, { type: "date", pos: !filters.ascend.pos })}
      ></input> */}
        <div className="parameter-cont">
          <span>Zaciatok</span>
          <input name="dateStart" defaultValue={filters.dateStart} onChange={(e) => onSetFilters(e, e.target.value)}></input>
        </div>
        <div className="parameter-cont">
          <span>Koniec</span>
          <input name="dateEnd" defaultValue={filters.dateEnd} onChange={(e) => onSetFilters(e, e.target.value)}></input>
        </div>
      </div>
      <ul className="bot-obchody-cont">
        <div className="legenda-obch">
          <p className="cislo" id="element">
            Cislo
          </p>
          <p className="datum" id="element">
            Datum
          </p>
          <p className="obpar" id="element">
            Ob.par
          </p>
        </div>
        {listData.map((e) => {
          return (
            <li>
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
        postsPerPage={10}
        totalPosts={data.totalItems}
        currentPage={curPage}
      ></Pagination>
    </div>
  );
}

export default ObchodyList;
