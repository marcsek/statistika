import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import "../../stranky/BotDetailPage.css";

import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";
import "../VyberComp.css";
import { isPositiveInteger } from "../../pomocky/cislovacky";
import { ImCheckmark } from "react-icons/im";
import defaultParaValues from "./DefaultHodnotyParametrov";
import LoadingButtonComponent from "./LoadingButtonComponent";

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
      // setError((prevState) => {
      //   if (prevState.error !== _error || prevState.oneChanged !== oneChanged) {
      //     return { error: _error, oneChanged: oneChanged };
      //   }
      //   return prevState;
      // });
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
    // console.log("render");
  });

  useEffect(() => {
    checkError();
  }, [error.error, error.oneChanged, checkError]);

  const getBorderColor = useCallback(
    (meno, baseText) => {
      if (textValues[meno].value === (baseText ? baseText : "")) {
        return "2px solid red";
      } else if (textValues[meno].value !== textValues[meno].init && type !== "create") {
        return "2px solid #2d7bf4";
      }
      return "";
    },
    [textValues, type]
  );

  const getInactiveStyle = useCallback(
    (meno) => {
      return {
        color: !textValues[meno].value ? "rgb(115, 115, 115)" : "",
        filter: !textValues[meno].value ? "brightness(0.8)" : "",
        pointerEvents: !textValues[meno].value ? "none" : "",
      };
    },
    [textValues]
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
        <button
          id="bot-parametre"
          className="vypinac"
          style={{ backgroundColor: textValues.zapnuty.value ? "#2d7bf4" : "#f1556c" }}
          name="zapnuty"
          onClick={(e) => onTextChange(e, true)}
        >
          {!textValues.zapnuty.value ? <MdOutlinePowerOff /> : <MdOutlinePower />}
        </button>
        <div className="divider-parametre" id="devider"></div>
        <div className="important-para-input-cont">
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Obchodný Pár</span>
              <input
                id="ob-par-input"
                autoComplete="off"
                value={textValues.obPar.value}
                name="obPar"
                style={{ border: getBorderColor("obPar", "/") }}
                onChange={(e) => {
                  if (/^[a-zA-Z/]+$/.test(e.target.value) && e.target.value.split("/").length === 2) onTextChange(e, false, true);
                }}
              ></input>
            </div>
          </div>
          <div>
            <button
              className="prepinac-velky"
              id="prepinac-lava-prava"
              value={textValues.prepinac.value}
              name="prepinac"
              onClick={(e) => onTextChange(e, true)}
            >
              <div
                style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init && type !== "create" ? "#2d7bf4" : "" }}
                id={textValues.prepinac.value ? "selected" : "unselected"}
              >
                {textValues.obPar.value.split("/")[0]}
              </div>
              <div
                style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init && type !== "create" ? "#2d7bf4" : "" }}
                id={!textValues.prepinac.value ? "selected" : "unselected"}
              >
                {textValues.obPar.value.split("/")[1]}
              </div>
            </button>
          </div>
          <textarea
            placeholder="Poznámka"
            value={textValues.poznamka.value}
            name="poznamka"
            style={{
              border: textValues.poznamka.value !== textValues.poznamka.init && type !== "create" ? "2px solid #2d7bf4" : "",
            }}
            onChange={(e) => onTextChange(e)}
          ></textarea>
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
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Des. m. Cena</span>
              <input
                id="choose-inacitve"
                autoComplete="off"
                name="desMiestaCen"
                value={textValues.desMiestaCen.value}
                style={{ border: getBorderColor("desMiestaCen") }}
                onChange={(e) => {
                  if (isPositiveInteger(e.target.value)) onTextChange(e);
                }}
              ></input>
            </div>
          </div>
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Des. m. Množstvo</span>
              <input
                id="choose-inacitve"
                autoComplete="off"
                name="desMiestaMnoz"
                value={textValues.desMiestaMnoz.value}
                style={{ border: getBorderColor("desMiestaMnoz") }}
                onChange={(e) => {
                  if (isPositiveInteger(e.target.value)) onTextChange(e);
                }}
              ></input>
            </div>
          </div>
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Min. Hodnota</span>
              <input
                id="choose-inacitve"
                autoComplete="off"
                value={textValues.minHod.value}
                name="minHod"
                style={{ border: getBorderColor("minHod") }}
                onChange={(e) => {
                  if (!isNaN(e.target.value)) onTextChange(e);
                }}
              ></input>
            </div>
          </div>
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Testovaná Fee</span>
              <input
                id="choose-inacitve"
                autoComplete="off"
                value={textValues.testFee.value}
                name="testFee"
                style={{ border: getBorderColor("testFee") }}
                onChange={(e) => {
                  if (!isNaN(e.target.value)) onTextChange(e);
                }}
              ></input>
            </div>
          </div>
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Min. Profit</span>
              <input
                id="choose-inacitve"
                autoComplete="off"
                value={textValues.minProfit.value}
                name="minProfit"
                style={{ border: getBorderColor("minProfit") }}
                onChange={(e) => {
                  if (isPositiveInteger(e.target.value)) onTextChange(e);
                }}
              ></input>
            </div>
          </div>
          <div id="input-small" className="parametre-input-cont">
            <div id="input-small" className="parametre-input">
              <span>Zvýšit o % z Prof.</span>
              <input
                id="choose-inacitve"
                autoComplete="off"
                value={textValues.zvysTrad.value}
                name="zvysTrad"
                style={{ border: getBorderColor("zvysTrad") }}
                onChange={(e) => {
                  if ((isPositiveInteger(e.target.value) && parseInt(e.target.value) <= 100) || e.target.value === "") onTextChange(e);
                }}
              ></input>
            </div>
          </div>
          {/* {textValues.small.map((e, index) => {
          return (
            <div id="input-small" className="parametre-input-cont">
              <div id="input-small" className="parametre-input">
                <span>{e.title}</span>
                <input
                  tabIndex={e.index}
                  id="choose-inacitve"
                  autoComplete="off"
                  value={e.value}
                  onChange={(e) => onSmallTextChange(e, e.target.tabIndex)}
                ></input>
              </div>
            </div>
          );
        })} */}
        </div>
        <div className="podzlozka-cont">
          <div className="parametre-input-cont">
            <div id="podzlozka" className="parametre-input">
              <div className="nadpis-podzlozka" style={{ backgroundColor: textValues.maker.value !== textValues.maker.init && "rgb(45, 123, 244)" }}>
                <span>Maker</span>
              </div>
              <label className="container">
                {/* <input props.type="checkbox" class="chb chb-1" id="chb-1" /> */}
                <button
                  className="moj-checkmark"
                  id={textValues.maker.value ? "active" : "inactive"}
                  name="maker"
                  value={textValues.maker.value}
                  onClick={(e) => {
                    if (textValues.maker.value) {
                      let children = [textValues.percento, textValues.odchylka, textValues.postOnly];
                      children.forEach((child) => {
                        if (child.value === "") {
                          child.value = child.init;
                        }
                      });
                    }

                    onTextChange(e, true);
                  }}
                >
                  <ImCheckmark></ImCheckmark>
                </button>
              </label>

              <div className="input-nadpis-cont">
                <span style={{ color: !textValues.maker.value && "#737373" }}>% Bal. Maker</span>
                <input
                  autoComplete="off"
                  name="percento"
                  value={textValues.percento.value}
                  style={{ border: getBorderColor("percento"), ...getInactiveStyle("maker") }}
                  onChange={(e) => {
                    if ((isPositiveInteger(e.target.value) && parseInt(e.target.value) <= 100) || e.target.value === "") onTextChange(e);
                  }}
                ></input>
              </div>
              <div className="input-nadpis-cont">
                <span style={{ color: !textValues.maker.value && "#737373" }}>Odchýlka</span>
                <input
                  autoComplete="off"
                  value={textValues.odchylka.value}
                  style={{ border: getBorderColor("odchylka"), ...getInactiveStyle("maker") }}
                  name="odchylka"
                  onChange={(e) => {
                    if (isPositiveInteger(e.target.value)) onTextChange(e);
                  }}
                ></input>
              </div>
              <div className="input-nadpis-cont" id="checkmark">
                <span style={{ color: !textValues.maker.value && "#737373" }} id="nadpis-prepinac">
                  Post Only
                </span>
                <button
                  className="prepinac-mensi"
                  id="prepinac-lava-prava"
                  style={{ ...getInactiveStyle("maker") }}
                  name="postOnly"
                  onClick={(e) => onTextChange(e, true)}
                >
                  <div
                    style={{
                      backgroundColor: textValues.postOnly.value !== textValues.postOnly.init && type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
                      color: !textValues.maker.value && "rgb(115, 115, 115)",
                    }}
                    id={textValues.postOnly.value ? "selected" : "unselected"}
                  >
                    Áno
                  </div>
                  <div
                    style={{
                      backgroundColor: textValues.postOnly.value !== textValues.postOnly.init && type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
                      color: !textValues.maker.value && "rgb(115, 115, 115)",
                    }}
                    id={!textValues.postOnly.value ? "selected" : "unselected"}
                  >
                    Nie
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="parametre-input-cont">
            <div id="podzlozka" className="parametre-input">
              <div
                className="nadpis-podzlozka"
                style={{ backgroundColor: textValues.feeCoin.value !== textValues.feeCoin.init && "rgb(45, 123, 244)" }}
              >
                <span>Fee Coin</span>
              </div>
              <button
                className="moj-checkmark"
                id={textValues.feeCoin.value ? "active" : "inactive"}
                name="feeCoin"
                value={textValues.feeCoin.value}
                onClick={(e) => {
                  if (textValues.feeCoin.value) {
                    let children = [textValues.nazov, textValues.minMnozstvo, textValues.desatina];
                    children.forEach((child) => {
                      if (child.value === "") {
                        child.value = child.init;
                      }
                    });
                  }
                  onTextChange(e, true);
                }}
              >
                <ImCheckmark></ImCheckmark>
              </button>
              <div className="input-nadpis-cont">
                <span style={{ color: !textValues.feeCoin.value && "#737373" }}>Coin Názov</span>
                <input
                  autoComplete="off"
                  value={textValues.nazov.value}
                  name="nazov"
                  style={{ border: getBorderColor("nazov"), ...getInactiveStyle("feeCoin") }}
                  onChange={(e) => {
                    if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") onTextChange(e, false, true);
                  }}
                ></input>
              </div>
              <div className="input-nadpis-cont">
                <span style={{ color: !textValues.feeCoin.value && "#737373" }}>Min. Množstvo</span>
                <input
                  autoComplete="off"
                  value={textValues.minMnozstvo.value}
                  name="minMnozstvo"
                  style={{ border: getBorderColor("minMnozstvo"), ...getInactiveStyle("feeCoin") }}
                  onChange={(e) => {
                    if (isPositiveInteger(e.target.value)) onTextChange(e);
                  }}
                ></input>
              </div>
              <div className="input-nadpis-cont">
                <span style={{ color: !textValues.feeCoin.value && "#737373" }}>Des. Miesta</span>
                <input
                  autoComplete="off"
                  value={textValues.desatina.value}
                  name="desatina"
                  style={{ border: getBorderColor("desatina"), ...getInactiveStyle("feeCoin") }}
                  onChange={(e) => {
                    if (isPositiveInteger(e.target.value)) onTextChange(e);
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="parametre-input-cont">
            <div id="podzlozka" className="parametre-input">
              <div
                className="nadpis-podzlozka"
                style={{ backgroundColor: textValues.prepoc.value !== textValues.prepoc.init && "rgb(45, 123, 244)" }}
              >
                <span>Prepočítavanie</span>
              </div>
              <button
                className="moj-checkmark"
                id={textValues.prepoc.value ? "active" : "inactive"}
                name="prepoc"
                value={textValues.prepoc.value}
                onClick={(e) => {
                  if (textValues.prepoc.value) {
                    let children = [textValues.hodnota, textValues.zdroj];
                    children.forEach((child) => {
                      if (child.value === "") {
                        child.value = child.init;
                      }
                    });
                  }
                  onTextChange(e, true);
                }}
              >
                <ImCheckmark></ImCheckmark>
              </button>
              <div className="input-nadpis-cont">
                <span style={{ color: !textValues.prepoc.value && "#737373" }}>Prepo. Hodnota</span>
                <input
                  autoComplete="off"
                  value={textValues.hodnota.value}
                  name="hodnota"
                  style={{ border: getBorderColor("hodnota"), ...getInactiveStyle("prepoc") }}
                  onChange={(e) => {
                    if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") onTextChange(e, false, true);
                  }}
                ></input>
              </div>
              <div className="input-nadpis-cont">
                <span id="nadpis-prepinac" style={{ color: !textValues.prepoc.value && "#737373" }}>
                  Zdroj Prepo.
                </span>
                <button
                  className="prepinac-maly"
                  id="prepinac-lava-prava"
                  name="zdroj"
                  value={textValues.zdroj.value}
                  style={{ ...getInactiveStyle("prepoc") }}
                  onClick={(e) => onTextChange(e, true)}
                >
                  <div
                    style={{
                      backgroundColor: textValues.zdroj.value !== textValues.zdroj.init && type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
                      color: !textValues.prepoc.value && "rgb(115, 115, 115)",
                    }}
                    id={textValues.zdroj.value ? "selected" : "unselected"}
                  >
                    Akt. Bur.
                  </div>
                  <div
                    style={{
                      backgroundColor: textValues.zdroj.value !== textValues.zdroj.init && type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
                      color: !textValues.prepoc.value && "rgb(115, 115, 115)",
                    }}
                    id={!textValues.zdroj.value ? "selected" : "unselected"}
                  >
                    Malá Bur.
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="test-paramter">
            <button
              className="moj-checkmark"
              id={textValues.test.value ? "active" : "inactive"}
              name="test"
              value={textValues.test.value}
              style={{ boxShadow: textValues.test.value !== textValues.test.init && "0px 0px 10px 3px rgb(45, 123, 244)" }}
              onClick={(e) => onTextChange(e, true)}
            >
              <ImCheckmark></ImCheckmark>
            </button>
            <span className="checkmark">Test</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Parametre;
