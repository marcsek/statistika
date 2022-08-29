import React, { useState, useCallback, useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import "../../stranky/BotDetailPage.css";

import ExtraParametre from "./ExtraParametre";
import Parametre from "./Parametre";

import { getTextValues, setNewTextValues, getSavedTextValues } from "../../pomocky/fakeApi.js";
import { useLoadingManager, LoadingComponent } from "../LoadingManager.js";
import "../VyberComp.css";
import defaultParaValues from "./DefaultHodnotyParametrov";

// *** neviem ako budem robit initial loady, ak bude kazdy element robit requesty sam tak to nepojde cez forwardRef
// *** alebo bude robit parent velky load a posielat to do childov

const ParametreEditor = forwardRef(({ type, onCreate, loadingParent }, ref) => {
  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(100, true);
  const extraParemetreRef = useRef(null);
  const parametreRef = useRef(null);
  const [shouldDisplaySubmit, setShouldDisplaySubmit] = useState(false);

  const textValuesRequest = useCallback(async () => {
    setLoadingStep("fetch");
    const textValues = await (type === "create" ? getSavedTextValues() : getTextValues());

    let initValueCopy = { ...defaultParaValues };
    for (const key in defaultParaValues) {
      initValueCopy[key].value = textValues[key];
      initValueCopy[key].init = textValues[key];
    }
    setLoadingStep("render");

    // parametreRef.current.setSavedTextValues(initValueCopy);
  }, [type, setLoadingStep]);

  const textValuesSend = useCallback(
    async (textValues) => {
      const valuesToSend = {};
      for (const key in textValues) {
        valuesToSend[key] = textValues[key].value;
      }
      const response = await setNewTextValues(valuesToSend);

      const stateCopy = { ...textValues };
      for (const key in stateCopy) {
        stateCopy[key].init = response[key];
      }
      // parametreRef.current.setSavedTextValues({ ...stateCopy });
    },
    [setLoadingStep]
  );

  useImperativeHandle(ref, () => ({
    getTextValues() {
      const valuesToSend = {};
      const textValues = parametreRef.current.getTextValues();
      for (const key in textValues) {
        valuesToSend[key] = textValues[key].value;
      }
      return valuesToSend;
    },
  }));

  useEffect(() => {
    // console.log("render parent");
  });

  useEffect(() => {
    textValuesRequest();
  }, [textValuesRequest]);

  const checkError = useCallback(() => {
    if ((type === "create" ? extraParemetreRef.current?.getCurrentErrorState() : true) && parametreRef.current?.getCurrentErrorState()) {
      setShouldDisplaySubmit(true);
    } else {
      setShouldDisplaySubmit(false);
    }
  }, [type]);

  const onSubmitPress = useCallback(
    (textValues) => {
      if (type === "create") {
        onCreate(extraParemetreRef.current.getSelectedBurza());
      } else {
        textValuesSend(textValues);
      }
    },
    [type, onCreate, textValuesSend]
  );

  return (
    <>
      {(loading || loadingParent) && <LoadingComponent background={true} loadingText={loadingMessage}></LoadingComponent>}
      <div className="bot-parametre-cont" style={{ visibility: loading ? "" : "" || loadingParent ? "none" : "" }}>
        {type === "create" && <ExtraParametre checkError={checkError} ref={extraParemetreRef} />}
        <Parametre checkError={checkError} ref={parametreRef} onSubmitPress={onSubmitPress} shouldDisplaySubmit={shouldDisplaySubmit} type={type} />
      </div>
    </>
  );
});

export default ParametreEditor;
