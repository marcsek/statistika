import React, { useState, useCallback, useEffect } from "react";
import "../stranky/BotDetailPage.css";

import { getTextValues, setNewTextValues } from "../pomocky/fakeApi.js";
import LoadingComponent from "./LoadingComponent.js";
import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";
import "./VyberComp.css";
import { isPositiveInteger } from "../pomocky/cislovacky";
import { TbCaretDown } from "react-icons/tb";

//ked bude api tak loading brat iba od parenta
const ParametreEditor = ({ type, onCreate, loadingParent }) => {
  const [buttonState, setButtonState] = useState(false);
  const [textValues, setTextValues] = useState({
    obPar: { value: "ETH/USDT", init: "ETH/USDT" },
    poznamka: { value: "", init: "" },
    prepinac: { value: true, init: true },
    zapnuty: { value: false, init: false },
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

  const [extraValues, setExtraValues] = useState({
    burza: "Burza 1",
    key: "",
    secret: "",
    password: "",
  });

  const [canShowbutton, setCanShowbutton] = useState(false);

  const [drowDownClicked, setDropDownClick] = useState(false);

  const burzi = ["Burza 1", "Burza 2", "Burza 3", "Burza 4", "Burza 5"];

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
    setCanShowbutton(false);

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
      checkError(stateCopy, extraValues);
      setTextValues({ ...stateCopy });
    },
    [textValues, extraValues]
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
      } else if (textValues[meno].value !== textValues[meno].init && type !== "create") {
        return "2px solid #2c53dd";
      }
      return "";
    },
    [textValues]
  );

  const onExtraTextChange = useCallback(
    (evt, id) => {
      let stateCopy = { ...extraValues };

      // stateCopy.small[evt.target.name].v = evt.target.value;
      stateCopy[evt.target.name] = evt.target.value;

      checkError(textValues, stateCopy);
      setExtraValues({ ...stateCopy });
    },
    [extraValues, textValues]
  );

  const checkError = useCallback((mainn, extraa) => {
    let oneChanged = false;
    let error = false;
    let main = mainn ? mainn : textValues;
    let extra = extraa ? extraa : extraValues;

    for (const key in main) {
      if ((key !== "poznamka" && typeof main[key].value !== "boolean" && main[key].value === "") || (key === "obPar" && main[key].value === "/")) {
        error = true;
        break;
      } else if (main[key].value !== main[key].init) {
        oneChanged = true;
      }
    }
    for (const key in extra) {
      if (extra[key] === "" && type === "create") {
        error = true;
        break;
      }
    }
    setCanShowbutton(error ? false : type === "create" ? true : oneChanged);
  });

  const getInactiveStyle = useCallback((meno) => {
    return { filter: !textValues[meno].value ? "brightness(0.5)" : "", pointerEvents: !textValues[meno].value ? "none" : "" };
  });

  return (
    <div className="bot-parametre-cont" style={{ height: loading.isLoading || loadingParent ? "300px" : "" }}>
      {/* <div className="parametre-title-divider" id="devider"></div>
        <span className="parametre-title" id="title">
          Paremetre
        </span> */}
      <div style={{ display: type !== "create" || loadingParent ? "none" : "" }} className="bot-extra-create-cont">
        <div
          className="drop-down"
          onClick={(e) => {
            setDropDownClick(!drowDownClicked);
          }}
          id={drowDownClicked ? "active" : "inactive"}
        >
          <span>Burza</span>
          <div className="drop-down-inside-text">
            {extraValues.burza}
            <TbCaretDown />
          </div>

          <div className="drop-down-menu" style={{ visibility: drowDownClicked ? "" : "hidden" }}>
            {burzi.map((burza, index) => {
              return (
                <div key={index} className="drop-down-menu-item" onClick={(e) => setExtraValues({ ...extraValues, burza: burzi[index] })}>
                  {burza}
                </div>
              );
            })}
          </div>
        </div>

        <div id="input-small" className="parametre-input-cont">
          <div id="input-small" className="parametre-input">
            <span>Key</span>
            <input
              id="ob-par-input"
              autoComplete="off"
              placeholder="Povinné"
              value={extraValues.key}
              name="key"
              onChange={(e) => {
                if (!/\s/.test(e.target.value) || e.target.value === "") onExtraTextChange(e);
              }}
            ></input>
          </div>
        </div>

        <div id="input-small" className="parametre-input-cont">
          <div id="input-small" className="parametre-input">
            <span>Secret</span>
            <input
              id="ob-par-input"
              autoComplete="off"
              value={extraValues.secret}
              placeholder="Povinné"
              name="secret"
              onChange={(e) => {
                if (!/\s/.test(e.target.value) || e.target.value === "") onExtraTextChange(e);
              }}
            ></input>
          </div>
        </div>
        <div id="input-small" className="parametre-input-cont">
          <div id="input-small" className="parametre-input">
            <span>Password</span>
            <input
              id="ob-par-input"
              autoComplete="off"
              value={extraValues.password}
              placeholder="Povinné"
              name="password"
              onChange={(e) => {
                if (/^[a-zA-Z/]+$/.test(e.target.value) || e.target.value === "") onExtraTextChange(e);
              }}
            ></input>
          </div>
        </div>
      </div>
      {(loading.isLoading || loadingParent) && <LoadingComponent loadingText={loading.msg}></LoadingComponent>}
      <div style={{ display: loading.isLoading || loadingParent ? "none" : "" }} className="bot-parametre">
        <div className="important-parametre-cont">
          <button
            id="bot-parametre"
            className="vypinac"
            style={{ backgroundColor: textValues.zapnuty.value ? "#2c53dd" : "#cc3333" }}
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
                  style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init && type !== "create" ? "#2c53dd" : "" }}
                  id={textValues.prepinac.value ? "selected" : "unselected"}
                >
                  ETH
                </div>
                <div
                  style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init && type !== "create" ? "#2c53dd" : "" }}
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
              style={{
                border: textValues.poznamka.value !== textValues.poznamka.init && type !== "create" ? "2px solid #2c53dd" : "",
              }}
              onChange={(e) => onTextChange(e)}
            ></textarea>
          </div>
          <div className="submit-button-cont">
            <button
              className="submit-button"
              onClick={(e) => {
                if (type === "create") {
                  onCreate(extraValues.burza);
                  // textValuesSend(textValues);
                } else {
                  textValuesSend(textValues);
                }
              }}
              id={canShowbutton ? "active" : "inactive"}
            >
              {type === "create" ? "Vytvoriť" : "Updatnuť"}
            </button>
          </div>
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
                <label className="container">
                  {/* <input type="checkbox" class="chb chb-1" id="chb-1" /> */}
                  <input
                    className="enable-podpolozku"
                    type="checkbox"
                    id={textValues.maker.value ? "active" : "inactive"}
                    checked={textValues.maker.value}
                    name="maker"
                    onChange={(e) => onTextChange(e, true)}
                  ></input>
                  <span class="checkmark"></span>
                </label>

                <div className="input-nadpis-cont">
                  <span>% Bal. Maker</span>
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
                  <span>Odchylka</span>
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
                  <span id="nadpis-prepinac">Post Only</span>
                  <button
                    className="prepinac-mensi"
                    id="prepinac-lava-prava"
                    style={{ ...getInactiveStyle("maker") }}
                    name="postOnly"
                    onClick={(e) => onTextChange(e, true)}
                  >
                    <div
                      style={{
                        backgroundColor:
                          textValues.postOnly.value !== textValues.postOnly.init && type !== "create" ? "#2c53dd" : "" ? "#2c53dd" : "",
                      }}
                      id={textValues.postOnly.value ? "selected" : "unselected"}
                    >
                      Áno
                    </div>
                    <div
                      style={{
                        backgroundColor:
                          textValues.postOnly.value !== textValues.postOnly.init && type !== "create" ? "#2c53dd" : "" ? "#2c53dd" : "",
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
                <div className="nadpis-podzlozka">
                  <span>Fee Coin</span>
                </div>
                <input
                  className="enable-podpolozku"
                  type="checkbox"
                  id={textValues.feeCoin.value ? "active" : "inactive"}
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
                    style={{ border: getBorderColor("nazov"), ...getInactiveStyle("feeCoin") }}
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
                    style={{ border: getBorderColor("minMnozstvo"), ...getInactiveStyle("feeCoin") }}
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
                <div className="nadpis-podzlozka">
                  <span>Prepočítavanie</span>
                </div>
                <input
                  className="enable-podpolozku"
                  type="checkbox"
                  id={textValues.prepoc.value ? "active" : "inactive"}
                  checked={textValues.prepoc.value}
                  name="prepoc"
                  onChange={(e) => onTextChange(e, true)}
                ></input>
                <div className="input-nadpis-cont">
                  <span>Prepo. Hodnota</span>
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
                  <span id="nadpis-prepinac">Zdroj Prepo.</span>
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
                        backgroundColor: textValues.zdroj.value !== textValues.zdroj.init && type !== "create" ? "#2c53dd" : "" ? "#2c53dd" : "",
                      }}
                      id={textValues.zdroj.value ? "selected" : "unselected"}
                    >
                      Akt. Bur.
                    </div>
                    <div
                      style={{
                        backgroundColor: textValues.zdroj.value !== textValues.zdroj.init && type !== "create" ? "#2c53dd" : "" ? "#2c53dd" : "",
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
              <input
                className="enable-podpolozku"
                type="checkbox"
                id={textValues.test.value ? "active" : "inactive"}
                checked={textValues.test.value}
                name="test"
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
