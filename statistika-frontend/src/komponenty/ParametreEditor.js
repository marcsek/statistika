import React, { useState, useCallback, useEffect } from "react";
import "../stranky/BotDetailPage.css";

import { getTextValues, setNewTextValues } from "../pomocky/fakeApi.js";
import LoadingComponent from "./LoadingComponent.js";
import { MdOutlinePowerOff } from "react-icons/md";
import "./VyberComp.css";
import { isPositiveInteger } from "../pomocky/cislovacky";

const ParametreEditor = ({ type }) => {
  const [buttonState, setButtonState] = useState(false);
  const [textValues, setTextValues] = useState({
    obPar: { value: "ETH/USDT", init: "ETH/USDT" },
    poznamka: { value: "", init: "" },
    prepinac: { value: true, init: true },
    zapnuty: { value: true, init: true },
    test: { value: true, init: false },
    maker: { value: true, init: false },
    feeCoin: { value: true, init: false },
    prepoc: { value: true, init: false },
    hodnota: { value: "USDC", init: "USDC" },
    zdroj: { value: true, init: true },
    nazov: { value: "ETH", init: "ETH" },
    minMnozstvo: { value: "48", init: "48" },
    desatina: { value: "8", init: "8" },
    percento: { value: "89", init: "89" },
    odchylka: { value: "12", init: "12" },
    postOnly: { value: true, init: true },
    desMiestaCen: { value: "3", init: "3" },
    desMiestaMnoz: { value: "5", init: "5" },
    minHod: { value: "0.2", init: "0.2" },
    testFee: { value: "0.003", init: "0.003" },
    minProfit: { value: "430", init: "430" },
    zvysTrad: { value: "32", init: "32" },
  });
  const [loading, setLoading] = useState({ isLoading: false, msg: "", hasError: { status: false, msg: "" } });

  const textValuesRequest = useCallback(async () => {
    setLoading((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const textValuess = await getTextValues();
    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });

    setTextValues((prevState) => {
      const stateCopy = { ...prevState };
      for (const key in textValues) {
        stateCopy[key].value = textValuess[key];
        stateCopy[key].init = textValuess[key];
      }
      return stateCopy;
    });
  }, []);

  const textValuesSend = useCallback(async (textValues) => {
    setButtonState(false);

    setLoading({ isLoading: true, msg: "Posielam...", hasError: { status: false } });
    const valuesToSend = {};
    for (const key in textValues) {
      valuesToSend[key] = textValues[key].value;
    }
    const response = await setNewTextValues(valuesToSend);
    setLoading((prevState) => {
      return { ...prevState, isLoading: false };
    });

    const stateCopy = { ...textValues };
    for (const key in stateCopy) {
      stateCopy[key].init = response[key];
    }

    setTextValues(stateCopy);
  }, []);

  useEffect(() => {
    textValuesRequest();
  }, [textValuesRequest]);

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
      // stateCopy.small[evt.target.name].v = evt.target.value;
      stateCopy[evt.target.name].value = value;

      let oneChanged = false;
      let error = false;

      for (const key in stateCopy) {
        if (
          (key !== "poznamka" && typeof stateCopy[key].value !== "boolean" && stateCopy[key].value === "") ||
          (key === "obPar" && stateCopy[key].value === "/")
        ) {
          error = true;
          break;
        } else if (stateCopy[key].value !== stateCopy[key].init) {
          oneChanged = true;
        }
      }
      setButtonState(error ? false : oneChanged);
      setTextValues({ ...stateCopy });
    },
    [textValues]
  );

  // const onSmallTextChange = useCallback((evt, id) => {
  //   let stateCopy = { ...textValues };
  //   stateCopy.small[id].value = evt.target.value;

  //   setTextValues({ ...stateCopy });
  // });

  // const onPodTextChange = useCallback((evt, par, name) => {
  //   let stateCopy = { ...textValues.pod };
  //   // stateCopy[par][name].value = evt.target.value;
  // });

  const onOtherTextChange = useCallback((evt, id) => {});

  const getBorderColor = useCallback(
    (meno, baseText) => {
      if (textValues[meno].value === (baseText ? baseText : "")) {
        return "2px solid red";
      } else if (textValues[meno].value !== textValues[meno].init) {
        return "2px solid #2c53dd";
      }
      return "";
    },
    [textValues]
  );

  return (
    <div className="bot-parametre-cont" style={{ height: loading.isLoading ? "300px" : "" }}>
      {/* <div className="parametre-title-divider" id="devider"></div>
        <span className="parametre-title" id="title">
          Paremetre
        </span> */}
      {loading.isLoading && <LoadingComponent loadingText={loading.msg}></LoadingComponent>}
      <div style={{ display: loading.isLoading ? "none" : "" }} className="bot-parametre">
        <div className="important-parametre-cont">
          <button id="bot-parametre" className="vypinac">
            <MdOutlinePowerOff />
          </button>
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
                  style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init ? "#2c53dd" : "" }}
                  id={textValues.prepinac.value ? "selected" : "unselected"}
                >
                  ETH
                </div>
                <div
                  style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init ? "#2c53dd" : "" }}
                  id={!textValues.prepinac.value ? "selected" : "unselected"}
                >
                  USDT
                </div>
              </button>
            </div>
            <textarea
              placeholder="Poznámka"
              value={textValues.poznamka.value}
              name="poznamka"
              style={{ border: textValues.poznamka.value !== textValues.poznamka.init ? "2px solid #2c53dd" : "" }}
              onChange={(e) => onTextChange(e)}
            ></textarea>
          </div>
          <div className="submit-button-cont">
            <button
              className="submit-button"
              onClick={(e) => {
                textValuesSend(textValues);
              }}
              id={buttonState ? "active" : "inactive"}
            >
              {type === "create" ? "Vytvoriť" : "Updatnuť"}
            </button>
          </div>
        </div>
        <div className="divider-parametre" id="devider"></div>
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
                <span>Testovana Fee</span>
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
                <div className="nadpis-podzlozka">
                  <span>Maker</span>
                </div>
                <input
                  className="enable-podpolozku"
                  type="checkbox"
                  checked={textValues.maker.value}
                  name="maker"
                  onChange={(e) => onTextChange(e, true)}
                ></input>
                <div className="input-nadpis-cont">
                  <span>% Bal. Maker</span>
                  <input
                    autoComplete="off"
                    name="percento"
                    value={textValues.percento.value}
                    style={{ border: getBorderColor("percento"), filter: !textValues.maker.value ? "brightness(0.5)" : "" }}
                    onChange={(e) => {
                      if ((isPositiveInteger(e.target.value) && parseInt(e.target.value) <= 100) || e.target.value === "") onTextChange(e);
                    }}
                  ></input>
                </div>
                <div className="input-nadpis-cont">
                  <span>Odchylka</span>
                  <input
                    autoComplete="off"
                    value={textValues.odchylka.value}
                    style={{ border: getBorderColor("odchylka"), filter: !textValues.maker.value ? "brightness(0.5)" : "" }}
                    name="odchylka"
                    onChange={(e) => {
                      if (isPositiveInteger(e.target.value)) onTextChange(e);
                    }}
                  ></input>
                </div>
                <div className="input-nadpis-cont" id="checkmark">
                  <span id="nadpis-prepinac">Post Only</span>
                  <button
                    className="prepinac-mensi"
                    id="prepinac-lava-prava"
                    style={{ filter: !textValues.maker.value ? "brightness(0.5)" : "" }}
                    name="postOnly"
                    onClick={(e) => onTextChange(e, true)}
                  >
                    <div
                      style={{ backgroundColor: textValues.postOnly.value !== textValues.postOnly.init ? "#2c53dd" : "" }}
                      id={textValues.postOnly.value ? "selected" : "unselected"}
                    >
                      Áno
                    </div>
                    <div
                      style={{ backgroundColor: textValues.postOnly.value !== textValues.postOnly.init ? "#2c53dd" : "" }}
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
                <div className="nadpis-podzlozka">
                  <span>Fee Coin</span>
                </div>
                <input
                  className="enable-podpolozku"
                  type="checkbox"
                  checked={textValues.feeCoin.value}
                  name="feeCoin"
                  onChange={(e) => onTextChange(e, true)}
                ></input>
                <div className="input-nadpis-cont">
                  <span>Coin Názov</span>
                  <input
                    autoComplete="off"
                    value={textValues.nazov.value}
                    name="nazov"
                    style={{ border: getBorderColor("nazov"), filter: !textValues.feeCoin.value ? "brightness(0.5)" : "" }}
                    onChange={(e) => {
                      if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") onTextChange(e, false, true);
                    }}
                  ></input>
                </div>
                <div className="input-nadpis-cont">
                  <span>Min. Množstvo</span>
                  <input
                    autoComplete="off"
                    value={textValues.minMnozstvo.value}
                    name="minMnozstvo"
                    style={{ border: getBorderColor("minMnozstvo"), filter: !textValues.feeCoin.value ? "brightness(0.5)" : "" }}
                    onChange={(e) => {
                      if (isPositiveInteger(e.target.value)) onTextChange(e);
                    }}
                  ></input>
                </div>
                <div className="input-nadpis-cont">
                  <span>Des. Miesta</span>
                  <input
                    autoComplete="off"
                    value={textValues.desatina.value}
                    name="desatina"
                    style={{ border: getBorderColor("desatina"), filter: !textValues.feeCoin.value ? "brightness(0.5)" : "" }}
                    onChange={(e) => {
                      if (isPositiveInteger(e.target.value)) onTextChange(e);
                    }}
                  ></input>
                </div>
              </div>
            </div>
            <div className="parametre-input-cont">
              <div id="podzlozka" className="parametre-input">
                <div className="nadpis-podzlozka">
                  <span>Prepočítavanie</span>
                </div>
                <input
                  className="enable-podpolozku"
                  type="checkbox"
                  name="prepoc"
                  checked={textValues.prepoc.value}
                  onChange={(e) => onTextChange(e, true)}
                ></input>
                <div className="input-nadpis-cont">
                  <span>Prepo. Hodnota</span>
                  <input
                    autoComplete="off"
                    value={textValues.hodnota.value}
                    name="hodnota"
                    style={{ border: getBorderColor("hodnota"), filter: !textValues.prepoc.value ? "brightness(0.5)" : "" }}
                    onChange={(e) => {
                      if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") onTextChange(e, false, true);
                    }}
                  ></input>
                </div>
                <div className="input-nadpis-cont">
                  <span id="nadpis-prepinac">Zdroj Prepo.</span>
                  <button
                    className="prepinac-maly"
                    id="prepinac-lava-prava"
                    name="zdroj"
                    value={textValues.zdroj.value}
                    style={{ filter: !textValues.prepoc.value ? "brightness(0.5)" : "" }}
                    onClick={(e) => onTextChange(e, true)}
                  >
                    <div
                      style={{ backgroundColor: textValues.zdroj.value !== textValues.zdroj.init ? "#2c53dd" : "" }}
                      id={textValues.zdroj.value ? "selected" : "unselected"}
                    >
                      Akt. Bur.
                    </div>
                    <div
                      style={{ backgroundColor: textValues.zdroj.value !== textValues.zdroj.init ? "#2c53dd" : "" }}
                      id={!textValues.zdroj.value ? "selected" : "unselected"}
                    >
                      Malá Bur.
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="test-paramter">
              <input
                className="enable-test"
                type="checkbox"
                name="test"
                checked={textValues.test.value}
                onChange={(e) => onTextChange(e, true)}
              ></input>
              <span className="checkmark">Test</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametreEditor;
