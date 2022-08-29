import { getInputStateStyle } from "../StateStyles";

const FormSmallInput = ({ name, title, value, onChange, validate, stateStyle, id = "choose-inactive", upperCase }) => {
  const handleChange = (event) => {
    if (typeof validate === "undefined" || validate(event)) {
      onChange(event, false, upperCase);
    }
  };

  return (
    <div id="input-small" className="parametre-input-cont">
      <div id="input-small" className="parametre-input">
        <span>{title}</span>
        <input id={id} autoComplete="off" name={name} value={value} style={{ ...getInputStateStyle(stateStyle) }} onChange={handleChange}></input>
      </div>
    </div>
  );
};

export default FormSmallInput;
