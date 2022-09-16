import { useState, useEffect } from "react";

const useStickyHeader = ({ element, topOffset }) => {
  const [isSticky, setSticky] = useState(false);

  const handleScroll = () => {
    if (!element.current) {
      return;
    }
    window.scrollY > element.current.getBoundingClientRect().top - topOffset ? setSticky(true) : setSticky(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", () => handleScroll);
    };
  }, []);

  return isSticky;
};

export default useStickyHeader;
