import "./LoadingComponent.css";

function LoadingComponent({ error, loadingText, background, height, blur }) {
  return (
    <div className="loading-div" style={{ height: height }}>
      {background && <div id="background" style={{ backdropFilter: blur ? "blur(10px)" : "", backgroundColor: blur ? "transparent" : "" }}></div>}
      {error ? (
        <div className="loading-div" style={{ height: height }}>
          {error}
        </div>
      ) : (
        <div className="loading-div" style={{ height: height }}>
          <div className={true ? "loader" : "lds-dual-ring"}></div>
          {loadingText ? loadingText : "Načítavam..."}
        </div>
      )}
    </div>
  );
}

export default LoadingComponent;
