import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./CalendarComp.css";

import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

const CalendarComp = forwardRef(({ parentLoading, minDate, maxDate, onCalendarClick }, ref) => {
  const [value, onChange] = useState(new Date());
  const [dateRange, setDateRange] = useState("Spolu 000 dni");
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (value.length > 1) {
      const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
      let difference = diffDays(value[0], value[1]);
      let koncovka = difference === 1 ? "deň" : difference <= 4 ? "dni" : "dní";
      setDateRange(`Spolu ${difference} ${koncovka}`);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    changeOpenState() {
      setCalendarOpen(!calendarOpen);
    },

    isCalendarOpen() {
      return calendarOpen;
    },
  }));

  return (
    <>
      {!parentLoading && (
        <div id={calendarOpen ? "show" : "hidden"} className="calendar-div">
          <Calendar minDate={minDate} maxDate={maxDate} selectRange={true} onChange={onChange} value={value} />
          <div className="sub-calendar-comp">
            <span style={{ visibility: value.length > 1 ? "" : "hidden" }} className="calendar-day-count">
              {dateRange}
            </span>
            <button
              style={{ backgroundColor: value.length > 1 ? "" : "#3c3f50" }}
              className="calendar-button"
              onClick={(e) => onCalendarClick(value)}
            >
              Použiť
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default CalendarComp;
