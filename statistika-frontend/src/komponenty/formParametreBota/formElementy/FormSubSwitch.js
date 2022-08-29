import { getInputActiveStyle } from "../StateStyles";

const FormSubSwitch = ({ name, title, value, onChange, validate, stateStyle, activeStyle, switchNames, type = "mensi" }) => {
  const handleChange = (event) => {
    if (typeof validate === "undefined" || validate(event)) {
      onChange(event, true);
    }
  };

  return (
    <div className="input-nadpis-cont" id="checkmark">
      {title && (
        <span style={{ color: activeStyle === "inactive" && "#737373" }} id="nadpis-prepinac">
          {title}
        </span>
      )}
      <button
        className={"prepinac-" + type}
        id="prepinac-lava-prava"
        style={{ ...getInputActiveStyle(activeStyle) }}
        name={name}
        onClick={handleChange}
      >
        <div
          style={{
            backgroundColor: stateStyle === "changed" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
            color: activeStyle === "inactive" && "rgb(115, 115, 115)",
          }}
          id={value ? "selected" : "unselected"}
        >
          {switchNames[0]}
        </div>
        <div
          style={{
            backgroundColor: stateStyle === "changed" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
            color: activeStyle === "inactive" && "rgb(115, 115, 115)",
          }}
          id={!value ? "selected" : "unselected"}
        >
          {switchNames[1]}
        </div>
      </button>
    </div>
  );
};

export default FormSubSwitch;
