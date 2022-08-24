import React, { useState, useCallback, useEffect, forwardRef, useRef, useImperativeHandle, useLayoutEffect } from "react";
import "../stranky/BotDetailPage.css";

import { getTextValues, setNewTextValues, getSavedTextValues } from "../pomocky/fakeApi.js";
import { useLoadingManager, LoadingComponent } from "../komponenty/LoadingManager.js";
import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";
import "./VyberComp.css";
import { isPositiveInteger } from "../pomocky/cislovacky";
import { TbCaretDown } from "react-icons/tb";
import { ImCheckmark } from "react-icons/im";

const formValuesInit = {
  obPar: { value: "ETH/USDT", init: "ETH/USDT" },
  poznamka: { value: "", init: "" },
  prepinac: { value: true, init: true },
  zapnuty: { value: false, init: false },
  test: { value: true, init: true },
  maker: { value: true, init: true },
  feeCoin: { value: true, init: true },
  prepoc: { value: true, init: true },
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
};

const ExtraParametre = forwardRef((props, ref) => {
  const [extraValues, setExtraValues] = useState({
    burza: "Burza 1",
    key: "",
    secret: "",
    password: "",
  });
  const [drowDownClicked, setDropDownClick] = useState(false);
  const burzi = ["Burza 1", "Burza 2", "Burza 3", "Burza 4", "Burza 5"];

  const checkForError = useCallback((newValues) => {
    let extraValuesCopy = { ...newValues };
    delete extraValuesCopy.burza;

    extraValuesCopy = Object.values(extraValuesCopy);

    return extraValuesCopy.some((value) => value === "");
  }, []);

  const onExtraTextChange = useCallback(
    (evt) => {
      let stateCopy = { ...extraValues };

      stateCopy[evt.target.name] = evt.target.value;

      setExtraValues({ ...stateCopy });
    },
    [extraValues]
  );

  useEffect(() => {
    props.checkError(checkForError(extraValues));
  }, [extraValues, props, checkForError]);

  useImperativeHandle(ref, () => ({
    getSelectedBurza() {
      return extraValues.burza;
    },
  }));

  return (
    <div className="bot-extra-create-cont">
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
  );
});

//ked bude api tak loading brat iba od parenta

// *** neviem ako budem robit initial loady, ak bude kazdy element robit requesty sam tak to nepojde cez forwardRef
// *** alebo bude robit parent velky load a posielat to do childov

//prerobit to tak aby boli obaja childi

const ParametreEditor = forwardRef((props, ref) => {
  const [textValues, setTextValues] = useState(formValuesInit);
  const [canShowbutton, setCanShowbutton] = useState(false);
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(100, true);
  const extraParemetreRef = useRef(null);

  const textValuesRequest = useCallback(async () => {
    setLoadingStep("fetch");
    const textValues = await (props.type === "create" ? getSavedTextValues() : getTextValues());
    setLoadingStep("transform");

    setTextValues((prevState) => {
      const stateCopy = { ...prevState };
      for (const key in formValuesInit) {
        stateCopy[key].value = textValues[key];
        stateCopy[key].init = textValues[key];
      }
      setLoadingStep("render");
      return stateCopy;
    });
  }, [props.type, setLoadingStep]);

  const textValuesSend = useCallback(
    async (textValues) => {
      setCanShowbutton(false);

      setLoadingStep("send");
      const valuesToSend = {};
      for (const key in textValues) {
        valuesToSend[key] = textValues[key].value;
      }
      const response = await setNewTextValues(valuesToSend);
      setLoadingStep("render");

      const stateCopy = { ...textValues };
      for (const key in stateCopy) {
        stateCopy[key].init = response[key];
      }

      setTextValues(stateCopy);
    },
    [setLoadingStep]
  );

  useImperativeHandle(ref, () => ({
    getTextValues() {
      const valuesToSend = {};
      for (const key in textValues) {
        valuesToSend[key] = textValues[key].value;
      }
      return valuesToSend;
    },
  }));

  useEffect(() => {
    textValuesRequest();
  }, [textValuesRequest]);

  const checkError = useCallback(
    (optionalOutcomeFromExtra) => {
      console.log("check in");
      let oneChanged = false;
      let error = false;
      let errorFromExtra = optionalOutcomeFromExtra ? optionalOutcomeFromExtra : false;

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

      setCanShowbutton(error || errorFromExtra ? false : props.type === "create" ? true : oneChanged);
    },
    [textValues, props.type]
  );

  useEffect(() => {
    checkError();
    // console.log("check");
  }, [checkError, textValues]);

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
      setTextValues({ ...stateCopy });
    },
    [textValues]
  );

  const getBorderColor = (meno, baseText) => {
    if (textValues[meno].value === (baseText ? baseText : "")) {
      return "2px solid red";
    } else if (textValues[meno].value !== textValues[meno].init && props.type !== "create") {
      return "2px solid #2d7bf4";
    }
    return "";
  };

  const getInactiveStyle = (meno) => {
    return {
      color: !textValues[meno].value ? "rgb(115, 115, 115)" : "",
      filter: !textValues[meno].value ? "brightness(0.8)" : "",
      pointerEvents: !textValues[meno].value ? "none" : "",
    };
  };

  return (
    <>
      {(loading || props.loadingParent) && <LoadingComponent background={true} loadingText={loadingMessage}></LoadingComponent>}
      <div className="bot-parametre-cont" style={{ visibility: loading ? "" : "" || props.loadingParent ? "none" : "" }}>
        {props.type === "create" && <ExtraParametre checkError={checkError} ref={extraParemetreRef} />}
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
                    props.onCreate(extraParemetreRef.current.getSelectedBurza());
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
    </>
  );
});

export default ParametreEditor;
