import "../ObchodyList.css";
import React, { useState, useCallback, useEffect } from "react";
import { defaultFilters } from "./DefaultFiltre";
import { BiChevronsDown, BiChevronsUp } from "react-icons/bi";

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

export default OrderFiltersBotList;
