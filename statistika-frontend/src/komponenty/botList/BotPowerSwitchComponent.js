import React, { useState } from "react";

import { MdOutlinePowerOff, MdOutlinePower } from "react-icons/md";
import LoadingButtonComponent from "../zdielane/LoadingButtonComponent";

const BotPowerSwitchComponent = () => {
  const [buttonClicked, setButtonClick] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setButtonClick(!buttonClicked);
    }, 500);
  };

  return (
    <LoadingButtonComponent
      buttonProps={{ className: "vypinac", id: !buttonClicked ? "red" : "green" }}
      handleSubmitPress={handleSubmit}
      loading={loading}
      delay={200}
    >
      {!buttonClicked ? <MdOutlinePowerOff /> : <MdOutlinePower />}
      {!buttonClicked ? "Vypnúť botov" : "Zapnúť Botov"}
    </LoadingButtonComponent>
  );
};

export default BotPowerSwitchComponent;
