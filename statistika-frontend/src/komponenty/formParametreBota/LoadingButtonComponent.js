import React, { useEffect, useState } from "react";

const LoadingButtonComponent = ({ loading, handleSubmitPress, children, buttonProps, delay = 200 }) => {
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      var timer1 = setTimeout(() => setDelayedLoading(loading), delay);
    } else {
      setDelayedLoading(loading);
    }
    return () => {
      clearTimeout(timer1);
    };
  }, [loading, delay]);

  const renderChildren = () => {
    if (!delayedLoading) {
      return children;
    }
  };

  return (
    <div className="submit-button-cont">
      <button {...buttonProps} style={{ pointerEvents: loading ? "none" : "", fontSize: delayedLoading ? "0px" : "" }} onClick={handleSubmitPress}>
        <div style={{ transform: loading ? "scale(1)" : "" }} className="lds-dual-ring"></div>
        {renderChildren()}
      </button>
    </div>
  );
};

export default LoadingButtonComponent;
