import { ImCheckmark } from "react-icons/im";

const FormTestSwitch = ({ value, onChange, stateStyle }) => {
  const handleChange = (event) => {
    onChange(event, true);
  };

  return (
    <div className="test-paramter">
      <button
        className="moj-checkmark"
        id={value ? "active" : "inactive"}
        name="test"
        value={value}
        style={{ boxShadow: stateStyle === "changed" && "0px 0px 10px 3px rgb(45, 123, 244)" }}
        onClick={handleChange}
      >
        <ImCheckmark></ImCheckmark>
      </button>
      <span className="checkmark">Test</span>
    </div>
  );
};

export default FormTestSwitch;
