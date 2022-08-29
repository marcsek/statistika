import React from "react";
import { ImCheckmark } from "react-icons/im";

const FormSubParent = ({ name, title, value, onChange, validate, stateStyle, children }) => {
  const handleChange = (event) => {
    if (typeof validate === "undefined" || validate(event)) {
      onChange(event, true);
    }
  };

  const changedChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, { activeStyle: value ? "active" : "inactive", onChange })
  );

  return (
    <div className="parametre-input-cont">
      <div id="podzlozka" className="parametre-input">
        <div className="nadpis-podzlozka" style={{ backgroundColor: stateStyle === "changed" && "rgb(45, 123, 244)" }}>
          <span>{title}</span>
        </div>
        <label className="container">
          <button className="moj-checkmark" id={value ? "active" : "inactive"} name={name} value={value} onClick={handleChange}>
            <ImCheckmark></ImCheckmark>
          </button>
        </label>
        {changedChildren}
      </div>
    </div>
  );
};

export default FormSubParent;
