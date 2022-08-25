import React, { useState } from "react";

const InputButton = ({ onValueChange, name }) => {
  return (
    <div id="input-small" className="parametre-input-cont">
      <div id="input-small" className="parametre-input">
        <span>Key</span>
        <input
          id="ob-par-input"
          autoComplete="off"
          placeholder="Povinné"
          name={name}
          onChange={(e) => {
            if (!/\s/.test(e.target.value) || e.target.value === "") onValueChange(e);
          }}
        ></input>
      </div>
    </div>
  );
};

export default InputButton;
