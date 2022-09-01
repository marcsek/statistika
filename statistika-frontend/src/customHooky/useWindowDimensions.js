import { useEffect, useRef } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const windowDimensions = useRef(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      windowDimensions.current = getWindowDimensions();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions.current;
}
