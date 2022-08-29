import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";

const FormButtonVypinac = ({ value, onChange }) => {
  const handleChange = (event) => {
    onChange(event, true);
  };

  return (
    <button id="bot-parametre" className="vypinac" style={{ backgroundColor: value ? "#2d7bf4" : "#f1556c" }} name="zapnuty" onClick={handleChange}>
      {!value ? <MdOutlinePowerOff /> : <MdOutlinePower />}
    </button>
  );
};

export default FormButtonVypinac;
