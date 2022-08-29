const getInputStateStyle = (state) => {
  if (state === "error") {
    return { border: "2px solid red" };
  } else if (state === "changed") {
    return { border: "2px solid #2d7bf4" };
  }
  return "";
};

const getInputActiveStyle = (state) => {
  let isInactive = state === "inactive";

  return {
    color: isInactive ? "rgb(115, 115, 115)" : "",
    filter: isInactive ? "brightness(0.8)" : "",
    pointerEvents: isInactive ? "none" : "",
  };
};

export { getInputStateStyle, getInputActiveStyle };
