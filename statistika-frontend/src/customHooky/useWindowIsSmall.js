import { useState, useEffect } from "react";

const useWindowIsSmall = (windowWidthThreshold) => {
  const [windowIsSmall, setWindowIsSmall] = useState(() => {
    let windowWidth = window.innerWidth;
    if (windowWidth < windowWidthThreshold) {
      return true;
    } else {
      return false;
    }
  });
  useEffect(() => {
    function handleWindowResize() {
      let windowWidth = window.innerWidth;
      if (windowWidth < windowWidthThreshold) {
        setWindowIsSmall(true);
      } else {
        setWindowIsSmall(false);
      }
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowIsSmall, windowWidthThreshold]);

  return windowIsSmall;
};

export default useWindowIsSmall;
