import React from "react";
import "./LoadingComponent.css";

export default function LoadingComponent({ error, loadingText, background }) {
  return (
    <div className="loading-div">
      {background && <div id="background"></div>}
      {error ? (
        error
      ) : (
        <div className="loading-div">
          <div className="lds-dual-ring"></div>
          {loadingText ? loadingText : "Načítavam..."}
        </div>
      )}
    </div>
  );
}
