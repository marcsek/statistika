import React from "react";
import "./LoadingComponent.css";

export default function LoadingComponent({ error, loadingText, background, height }) {
  return (
    <div className="loading-div" style={{ height: height }}>
      {background && <div id="background"></div>}
      {error ? (
        error
      ) : (
        <div className="loading-div" style={{ height: height }}>
          <div className="lds-dual-ring"></div>
          {loadingText ? loadingText : "Načítavam..."}
        </div>
      )}
    </div>
  );
}
