import { getInputStateStyle, getInputActiveStyle } from "../StateStyles";

const FormSubSmallInput = ({ name, title, value, onChange, validate, stateStyle, activeStyle, upperCase }) => {
  const handleChange = (event) => {
    if (typeof validate === "undefined" || validate(event)) {
      onChange(event, false, upperCase);
    }
  };

  return (
    <div className="input-nadpis-cont">
      <span style={{ color: activeStyle === "inactive" && "#949494" }}>{title}</span>
      <input
        autoComplete="off"
        name={name}
        value={value}
        style={{ ...getInputStateStyle(stateStyle), ...getInputActiveStyle(activeStyle) }}
        onChange={handleChange}
      ></input>
    </div>
  );
};

export default FormSubSmallInput;
