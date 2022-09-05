import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import "../../stranky/BotDetailPage.css";

import defaultParaValues from "./DefaultHodnotyParametrov";
import { obParValidation, isPositiveInt, isNumber, isNonNullString, isPercent } from "./FormValidation";

import LoadingButtonComponent from "../zdielane/LoadingButtonComponent";
import FormSmallInput from "./formElementy/FormSmallInput";
import FormSubSmallInput from "./formElementy/FormSubSmallInput";
import FormSubSmallSwitch from "./formElementy/FormSubSwitch";
import FormSubParent from "./formElementy/FormSubParent";
import FormPoznamkaInput from "./formElementy/FormPoznamkaInput";
import FormButtonVypinac from "./formElementy/FormButtonVypinac";
import FormTestSwitch from "./formElementy/FormTestSwitch";

const Parametre = forwardRef(({ type, checkError, shouldDisplaySubmit, onSubmitPress }, ref) => {
  const [textValues, setTextValues] = useState(defaultParaValues);
  const [error, setError] = useState({ error: false, oneChanged: type === "create" ? true : false });
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    getCurrentErrorState() {
      return error.error ? false : error.oneChanged;
    },

    setSavedTextValues(newValues) {
      setLoading(false);
      setTextValues({ ...newValues });
    },

    getTextValues() {
      return textValues;
    },
  }));

  const checkForError = useCallback(
    (textValues) => {
      let error = false;
      let oneChanged = type === "create" ? true : false;

      for (const key in textValues) {
        if (
          (key !== "poznamka" && typeof textValues[key].value !== "boolean" && textValues[key].value === "") ||
          (key === "obPar" && textValues[key].value === "/")
        ) {
          error = true;
          break;
        } else if (textValues[key].value !== textValues[key].init) {
          oneChanged = true;
        }
      }

      setError({ error, oneChanged });
    },
    [type]
  );

  const onTextChange = useCallback(
    (evt, shouldSwap, upperCase) => {
      let stateCopy = { ...textValues };
      let value = evt.target.value;
      if (upperCase) {
        value = value.toUpperCase();
      }
      if (shouldSwap) {
        value = !textValues[evt.target.name].value;
      }
      stateCopy[evt.target.name].value = value;
      checkForError(stateCopy);
      setTextValues({ ...stateCopy });
    },
    [textValues, checkForError]
  );

  useEffect(() => {
    checkError();
  }, [error.error, error.oneChanged, checkError]);

  const getStateStyle = useCallback(
    (meno, baseText) => {
      if (textValues[meno].value === (baseText ? baseText : "")) {
        return "error";
      } else if (textValues[meno].value !== textValues[meno].init && type !== "create") {
        return "changed";
      }
      return "";
    },
    [textValues, type]
  );

  const handleSubmitPress = useCallback(
    (e) => {
      setError({ error: false, oneChanged: false });
      setLoading(true);
      onSubmitPress(textValues);
    },
    [onSubmitPress, textValues]
  );

  return (
    <div className="bot-parametre">
      <div className="important-parametre-cont">
        <FormButtonVypinac value={textValues.zapnuty.value} onChange={onTextChange} />
        <div className="divider-parametre" id="devider"></div>
        <div className="important-para-input-cont">
          <FormSmallInput
            name="obPar"
            title="Obchodný Pár"
            value={textValues.obPar.value}
            onChange={onTextChange}
            validate={obParValidation}
            stateStyle={getStateStyle("obPar")}
            upperCase={true}
            id="ob-par-input"
          />
          <div>
            <FormSubSmallSwitch
              name="prepinac"
              value={textValues.prepinac.value}
              stateStyle={getStateStyle("prepinac")}
              onChange={onTextChange}
              switchNames={[textValues.obPar.value.split("/")[0], textValues.obPar.value.split("/")[1]]}
              type="velky"
            />
          </div>
          <FormPoznamkaInput value={textValues.poznamka.value} onChange={onTextChange} stateStyle={getStateStyle("poznamka")} />
        </div>
        <LoadingButtonComponent
          buttonProps={{ className: "submit-button", id: shouldDisplaySubmit || loading ? "active" : "inactive" }}
          handleSubmitPress={handleSubmitPress}
          loading={loading}
        >
          <span>{type === "create" ? "Vytvoriť" : "Updatnuť"}</span>
        </LoadingButtonComponent>
      </div>
      <div className="sub-parametre">
        <div className="small-input-cont">
          <FormSmallInput
            name="desMiestaCen"
            title="Des. m. Cena"
            value={textValues.desMiestaCen.value}
            onChange={onTextChange}
            validate={isPositiveInt}
            stateStyle={getStateStyle("desMiestaCen")}
          />
          <FormSmallInput
            name="desMiestaMnoz"
            title="Des. m. Množstvo"
            value={textValues.desMiestaMnoz.value}
            onChange={onTextChange}
            validate={isPositiveInt}
            stateStyle={getStateStyle("desMiestaMnoz")}
          />
          <FormSmallInput
            name="minHod"
            title="Min. Hodnota"
            value={textValues.minHod.value}
            onChange={onTextChange}
            validate={isNumber}
            stateStyle={getStateStyle("minHod")}
          />
          <FormSmallInput
            name="testFee"
            title="Testovaná Fee"
            value={textValues.testFee.value}
            onChange={onTextChange}
            validate={isNumber}
            stateStyle={getStateStyle("testFee")}
          />
          <FormSmallInput
            name="minProfit"
            title="Min. Profit"
            value={textValues.minProfit.value}
            onChange={onTextChange}
            validate={isPositiveInt}
            stateStyle={getStateStyle("minProfit")}
          />
          <FormSmallInput
            name="zvysTrad"
            title="Zvýšit o % z Prof."
            value={textValues.zvysTrad.value}
            onChange={onTextChange}
            validate={isPercent}
            stateStyle={getStateStyle("zvysTrad")}
          />
        </div>
        <div className="podzlozka-cont">
          <FormSubParent name="maker" title="Maker" value={textValues.maker.value} onChange={onTextChange} stateStyle={getStateStyle("maker")}>
            <FormSubSmallInput
              name="percento"
              title="% Bal. Maker"
              value={textValues.percento.value}
              validate={isPercent}
              stateStyle={getStateStyle("percento")}
            />
            <FormSubSmallInput
              name="odchylka"
              title="Odchýlka"
              value={textValues.odchylka.value}
              validate={isPositiveInt}
              stateStyle={getStateStyle("odchylka")}
            />
            <FormSubSmallSwitch
              name="postOnly"
              title="Post Only"
              value={textValues.postOnly.value}
              stateStyle={getStateStyle("postOnly")}
              switchNames={["Áno", "Nie"]}
            />
          </FormSubParent>

          <FormSubParent
            name="feeCoin"
            title="Fee Coin"
            value={textValues.feeCoin.value}
            onChange={onTextChange}
            stateStyle={getStateStyle("feeCoin")}
          >
            <FormSubSmallInput
              name="nazov"
              title="Coin Názov"
              value={textValues.nazov.value}
              validate={isNonNullString}
              stateStyle={getStateStyle("nazov")}
              upperCase={true}
            />
            <FormSubSmallInput
              name="minMnozstvo"
              title="Min. Množstvo"
              value={textValues.minMnozstvo.value}
              validate={isPositiveInt}
              stateStyle={getStateStyle("minMnozstvo")}
            />
            <FormSubSmallInput
              name="desatina"
              title="Des. Miesta"
              value={textValues.desatina.value}
              validate={isPositiveInt}
              stateStyle={getStateStyle("desatina")}
            />
          </FormSubParent>

          <FormSubParent
            name="prepoc"
            title="Prepočítavanie"
            value={textValues.prepoc.value}
            onChange={onTextChange}
            stateStyle={getStateStyle("prepoc")}
          >
            <FormSubSmallInput
              name="hodnota"
              title="Prepo. Hodnota"
              value={textValues.hodnota.value}
              validate={isNonNullString}
              stateStyle={getStateStyle("hodnota")}
              upperCase={true}
            />
            <FormSubSmallSwitch
              name="zdroj"
              title="Zdroj Prepo."
              value={textValues.zdroj.value}
              stateStyle={getStateStyle("zdroj")}
              switchNames={["Akt. Bur.", "Malá Bur."]}
              type="maly"
            />
          </FormSubParent>
          <FormTestSwitch value={textValues.test.value} onChange={onTextChange} stateStyle={getStateStyle("test")} />
        </div>
      </div>
    </div>
  );
});

export default Parametre;
