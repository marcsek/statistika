import React, { useCallback } from "react";
import "./LoadingComponent.css";

// Loading manager Hook
function useLoadingManager(delay = 100, initialLoadingState = false) {
  const [loading, setLoading] = React.useState({
    isLoading: initialLoadingState,
    loadingStep: "",
    errorMessage: "",
  });

  // predom definované kroky načítavania
  const setLoadingStep = useCallback(
    (loadingStep) => {
      switch (loadingStep) {
        case "fetch":
          setLoading((prev) => ({ ...prev, isLoading: true, loadingStep: "Čakám na server...", errorMessage: "" }));
          break;
        case "transform":
          setLoading((prev) => ({ ...prev, isLoading: true, loadingStep: "Pripravujem dáta...", errorMessage: "" }));
          break;
        case "send":
          setLoading((prev) => ({ ...prev, isLoading: true, loadingStep: "Odosielam dáta...", errorMessage: "" }));
          break;
        case "none":
          setLoading((prev) => ({ ...prev, isLoading: true, errorMessage: "Žiadna zhoda", loadingStep: "" }));
          break;
        case "create":
          setLoading((prev) => ({ ...prev, isLoading: true, loadingStep: "Vytváram...", errorMessage: "" }));
          break;
        case "save":
          setLoading((prev) => ({ ...prev, isLoading: true, loadingStep: "Ukladám...", errorMessage: "" }));
          break;
        case "render":
          setLoading((prev) => ({ ...prev, isLoading: true, loadingStep: "Pripravujem dáta...", errorMessage: "" }));
          setTimeout(() => {
            setLoading((prev) => ({ ...prev, isLoading: false, loadingStep: "", errorMessage: "" }));
          }, 0);
          break;
        default:
          setLoading((prev) => ({ ...prev, isLoading: false, loadingStep: "Načítavam...", errorMessage: "" }));
          break;
      }
    },
    [delay]
  );

  return [loading.isLoading, setLoadingStep, loading.loadingStep, loading.errorMessage];
}

// komponent na renderovanie loading managera
function LoadingComponent({ error, loadingText, background, height, blur, customSpinner }) {
  return (
    <div className="loading-div" style={{ height: height }}>
      {background && <div id="background" style={{ backdropFilter: blur ? "blur(10px)" : "", backgroundColor: blur ? "transparent" : "" }}></div>}
      {error ? (
        error
      ) : (
        <div className="loading-div" style={{ height: height }}>
          <div className={true ? "loader" : "lds-dual-ring"}></div>
          {loadingText ? loadingText : "Načítavam..."}
        </div>
      )}
    </div>
  );
}

export { useLoadingManager, LoadingComponent };
