import React, { useState } from "react";

const InputButton = ({ onValueChange, name }) => {
  const [value, setValue] = useState("");

  const validate = (e) => {
    if (!/\s/.test(e.target.value) || e.target.value === "") {
      onValueChange(e);
      setValue(e.target.value);
    }
  };
  return (
    <div id="input-small" className="parametre-input-cont">
      <div id="input-small" className="parametre-input">
        <span>Key</span>
        <input
          type="text"
          id="ob-par-input"
          autoComplete="off"
          placeholder="Povinné"
          name={name}
          value={value}
          onChange={(e) => {
            if (!/\s/.test(e.target.value) || e.target.value === "") validate(e);
          }}
        ></input>
      </div>
    </div>
  );
};

export default InputButton;
