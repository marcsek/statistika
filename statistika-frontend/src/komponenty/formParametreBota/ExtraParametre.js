import { useCallback, forwardRef, useImperativeHandle, useRef } from "react";
import "../../stranky/BotDetailPage.css";

import "../VyberComp.css";

import InputButton from "./formElementy/ExtraInput.js";
import DropDown from "./formElementy/ExtraDropDown.js";

const ExtraParametre = forwardRef(({ checkError }, ref) => {
  const extraValues = useRef({
    burza: "Burza 1",
    key: "",
    secret: "",
    password: "",
  });

  const checkForError = useCallback((newValues) => {
    let extraValuesCopy = { ...newValues };
    delete extraValuesCopy.burza;

    extraValuesCopy = Object.values(extraValuesCopy);
    return !extraValuesCopy.some((value) => value === "");
  }, []);

  useImperativeHandle(ref, () => ({
    getSelectedBurza() {
      return extraValues.current.burza;
    },

    getCurrentErrorState() {
      return checkForError(extraValues.current);
    },
  }));

  const onValueChange = useCallback(
    (event) => {
      extraValues.current[event.target.name] = event.target.value;
      if (checkForError(extraValues.current)) {
        checkError();
      }
    },
    [checkError, checkForError]
  );

  return (
    <div className="bot-extra-create-cont">
      <DropDown name={"burza"} onValueChange={onValueChange} />
      <InputButton name={"key"} title={"Key"} onValueChange={onValueChange} />
      <InputButton name={"secret"} title={"Secret"} onValueChange={onValueChange} />
      <InputButton name={"password"} title={"Password"} onValueChange={onValueChange} />
    </div>
  );
});

export default ExtraParametre;
