import { forwardRef, useRef, useImperativeHandle, useState } from "react";
import "./CalendarComp.css";

import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

const CalendarComp = forwardRef((props, ref) => {
  const [value, onChange] = useState(new Date());

  useImperativeHandle(ref, () => ({
    dajData() {
      console.log(value);
      return value;
    },
  }));

  return (
    <div style={{ display: props.display ? "" : "none" }} className="calendar-div">
      <Calendar minDate={props.minDate} maxDate={props.maxDate} selectRange={true} onChange={onChange} value={value} />
    </div>
  );
});

export default CalendarComp;
