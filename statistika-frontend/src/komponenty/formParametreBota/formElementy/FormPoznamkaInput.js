const FormPoznamkaInput = ({ value, onChange, stateStyle }) => {
  const handleChange = (event) => {
    onChange(event, false);
  };

  return (
    <textarea
      placeholder="Poznámka"
      value={value}
      onChange={handleChange}
      name="poznamka"
      style={{
        border: stateStyle === "changed" ? "2px solid #2d7bf4" : "",
      }}
    ></textarea>
  );
};

export default FormPoznamkaInput;
