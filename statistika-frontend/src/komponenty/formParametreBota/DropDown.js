import React, { useState } from "react";
import { TbCaretDown } from "react-icons/tb";

const DropDown = ({ onValueChange, name }) => {
  const [drowDownClicked, setDropDownClick] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Burza 1");
  const burzi = ["Burza 1", "Burza 2", "Burza 3", "Burza 4", "Burza 5"];

  return (
    <div
      className="drop-down"
      onClick={(e) => {
        setDropDownClick(!drowDownClicked);
      }}
      id={drowDownClicked ? "active" : "inactive"}
    >
      <span>Burza</span>
      <div className="drop-down-inside-text">
        {selectedValue}
        <TbCaretDown />
      </div>

      <div className="drop-down-menu" style={{ visibility: drowDownClicked ? "" : "hidden" }}>
        {burzi.map((burza, index) => {
          return (
            <input
              type={"button"}
              key={index}
              className="drop-down-menu-item"
              name={name}
              value={burza}
              onClick={(e) => {
                setSelectedValue(e.target.value);
                onValueChange = onValueChange(e);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DropDown;
