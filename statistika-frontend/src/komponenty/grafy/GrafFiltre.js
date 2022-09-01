import { useEffect, useState, useRef } from "react";

const GrafFiltre = ({ getDataFromParent, render, defaultFilter }) => {
  const [filter, setFilter] = useState(defaultFilter);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (!defaultFilter) return;

    getDataFromParent(defaultFilter);
  }, [defaultFilter, getDataFromParent]);

  const getFilterElementBGColor = (filterType) => {
    if (filter === filterType && typeof filter !== "object") {
      return "rgba(255, 255, 255, 0.29)";
    }
  };
  const onFiltersChange = (filterString) => {
    setFilter(filterString);
    getDataFromParent(filterString);
  };

  const onCalendarNewDate = (value) => {
    if (!calendarRef.current) return;

    if (value[0] && value[1]) {
      const newValues = { dateStart: value[0] ? value[0] : "", dateEnd: value[1] ? value[1] : "" };
      onFiltersChange(newValues);
    }
    calendarRef.current.changeOpenState();
  };

  const handleCalendarClick = () => {
    if (!calendarRef.current) return;
    calendarRef.current.changeOpenState();
  };

  const isCalendarOpen = () => {
    if (!calendarRef.current) return;
    return calendarRef.current.isCalendarOpen();
  };

  return render({
    getFilterElementBGColor,
    onFiltersChange,
    onCalendarNewDate,
    calendarRef,
    currentFilter: filter,
    handleCalendarClick,
    isCalendarOpen: isCalendarOpen(),
  });
};

export { GrafFiltre };
