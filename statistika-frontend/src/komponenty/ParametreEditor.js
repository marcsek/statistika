import React, { useState, useCallback, useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import "../stranky/BotDetailPage.css";

import { getTextValues, setNewTextValues, getSavedTextValues } from "../pomocky/fakeApi.js";
import LoadingComponent from "./LoadingComponent.js";
import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";
import "./VyberComp.css";
import { isPositiveInteger } from "../pomocky/cislovacky";
import { TbCaretDown } from "react-icons/tb";
import { ImCheckmark } from "react-icons/im";

//ked bude api tak loading brat iba od parenta
const ParametreEditor = forwardRef((props, ref) => {
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
    const textValuess = await (props.type === "create" ? getSavedTextValues() : getTextValues());
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

  const textValuesRequestTwo = useCallback(async () => {
    setLoading((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const textValuess = await getSavedTextValues();
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

  useImperativeHandle(ref, () => ({
    getTextValues() {
      const valuesToSend = {};
      for (const key in textValues) {
        valuesToSend[key] = textValues[key].value;
      }
      return valuesToSend;
    },

    setTextValues() {
      // textValuesRequestTwo();
    },
  }));

  useEffect(() => {
    textValuesRequest();
  }, [textValuesRequest]);

  const checkError = useCallback(
    (mainn, extraa) => {
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
        if (extra[key] === "" && props.type === "create") {
          error = true;
          break;
        }
      }
      setCanShowbutton(error ? false : props.type === "create" ? true : oneChanged);
    },
    [extraValues, textValues, props.type]
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
      // stateCopy.small[evt.target.name].v = evt.target.value;
      stateCopy[evt.target.name].value = value;
      checkError(stateCopy, extraValues);
      setTextValues({ ...stateCopy });
    },
    [textValues, extraValues, checkError]
  );

  const getBorderColor = useCallback(
    (meno, baseText) => {
      if (textValues[meno].value === (baseText ? baseText : "")) {
        return "2px solid red";
      } else if (textValues[meno].value !== textValues[meno].init && props.type !== "create") {
        return "2px solid #2d7bf4";
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

  const getInactiveStyle = useCallback((meno) => {
    return {
      color: !textValues[meno].value ? "rgb(115, 115, 115)" : "",
      filter: !textValues[meno].value ? "brightness(0.8)" : "",
      pointerEvents: !textValues[meno].value ? "none" : "",
    };
  });

  return (
    <div className="bot-parametre-cont" style={{ height: loading.isLoading || props.loadingParent ? "300px" : "" }}>
      {/* <div className="parametre-title-divider" id="devider"></div>
        <span className="parametre-title" id="title">
          Paremetre
        </span> */}
      <div style={{ display: props.type !== "create" || props.loadingParent ? "none" : "" }} className="bot-extra-create-cont">
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
      {(loading.isLoading || props.loadingParent) && <LoadingComponent loadingText={loading.msg}></LoadingComponent>}
      <div style={{ display: loading.isLoading || props.loadingParent ? "none" : "" }} className="bot-parametre">
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
                  style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init && props.type !== "create" ? "#2d7bf4" : "" }}
                  id={textValues.prepinac.value ? "selected" : "unselected"}
                >
                  {textValues.obPar.value.split("/")[0]}
                </div>
                <div
                  style={{ backgroundColor: textValues.prepinac.value !== textValues.prepinac.init && props.type !== "create" ? "#2d7bf4" : "" }}
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
                border: textValues.poznamka.value !== textValues.poznamka.init && props.type !== "create" ? "2px solid #2d7bf4" : "",
              }}
              onChange={(e) => onTextChange(e)}
            ></textarea>
          </div>
          <div className="submit-button-cont">
            <button
              className="submit-button"
              onClick={(e) => {
                if (props.type === "create") {
                  props.onCreate(extraValues.burza);
                  // textValuesSend(textValues);
                } else {
                  textValuesSend(textValues);
                }
              }}
              id={canShowbutton ? "active" : "inactive"}
            >
              {props.type === "create" ? "Vytvoriť" : "Updatnuť"}
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
                <div className="nadpis-podzlozka">
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
                        backgroundColor:
                          textValues.postOnly.value !== textValues.postOnly.init && props.type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
                        color: !textValues.maker.value && "rgb(115, 115, 115)",
                      }}
                      id={textValues.postOnly.value ? "selected" : "unselected"}
                    >
                      Áno
                    </div>
                    <div
                      style={{
                        backgroundColor:
                          textValues.postOnly.value !== textValues.postOnly.init && props.type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
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
                <div className="nadpis-podzlozka">
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
                <div className="nadpis-podzlozka">
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
                        backgroundColor:
                          textValues.zdroj.value !== textValues.zdroj.init && props.type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
                        color: !textValues.prepoc.value && "rgb(115, 115, 115)",
                      }}
                      id={textValues.zdroj.value ? "selected" : "unselected"}
                    >
                      Akt. Bur.
                    </div>
                    <div
                      style={{
                        backgroundColor:
                          textValues.zdroj.value !== textValues.zdroj.init && props.type !== "create" ? "#2d7bf4" : "" ? "#2d7bf4" : "",
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
                onClick={(e) => onTextChange(e, true)}
              >
                <ImCheckmark></ImCheckmark>
              </button>
              <span className="checkmark">Test</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ParametreEditor;
