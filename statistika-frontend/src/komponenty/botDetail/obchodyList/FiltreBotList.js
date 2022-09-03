import "../ObchodyList.css";

import React, { useState, useCallback, useRef } from "react";
import { formatDate, getCompatibleValue } from "../../../pomocky/datumovanie";
import { BiSearchAlt, BiReset } from "react-icons/bi";
import CalendarComp from "../../zdielane/CalendarComp.js";
import { TbCalendar } from "react-icons/tb";
import { defaultFilters, initialStart, initialEnd } from "./DefaultFiltre";

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

export default FiltreBotList;
