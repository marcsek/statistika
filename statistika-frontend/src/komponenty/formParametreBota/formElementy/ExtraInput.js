import { useState } from "react";
import { isVarChar } from "../FormValidation";

const ExtraInput = ({ onValueChange, name, title }) => {
  const [value, setValue] = useState("");

  const validate = (e) => {
    if (isVarChar(e)) {
      onValueChange(e);
      setValue(e.target.value);
    }
  };
  return (
    <div id="input-small" className="parametre-input-cont">
      <div id="input-small" className="parametre-input">
        <span>{title}</span>
        <input type="text" id="ob-par-input" autoComplete="off" placeholder="Povinné" name={name} value={value} onChange={validate}></input>
      </div>
    </div>
  );
};

export default ExtraInput;
