import React, { useEffect, useState } from "react";

const LoadingButtonComponent = ({ loading, handleSubmitPress, children, buttonProps, delay }) => {
  const [delayedLoading, setDelayedLoading] = useState(false);
  let myDelay = delay;
  if (typeof delay === "undefined") {
    myDelay = 200;
  }

  useEffect(() => {
    if (!loading) {
      var timer1 = setTimeout(() => setDelayedLoading(loading), myDelay);
    } else {
      setDelayedLoading(loading);
    }
    return () => {
      clearTimeout(timer1);
    };
  }, [loading, myDelay]);

  const renderChildren = () => {
    if (!delayedLoading) {
      return children;
    }
  };

  return (
    <div className="submit-button-cont">
      <button
        {...buttonProps}
        style={{ pointerEvents: loading ? "none" : "", fontSize: (typeof delay !== "undefined" ? delayedLoading : loading) ? "0px" : "" }}
        onClick={handleSubmitPress}
      >
        <div style={{ transform: loading ? "scale(1)" : "" }} className="lds-dual-ring"></div>
        {renderChildren()}
      </button>
    </div>
  );
};

export default LoadingButtonComponent;
