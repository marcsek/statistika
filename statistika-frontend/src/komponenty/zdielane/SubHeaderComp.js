import { useRef } from "react";

import useStickyHeader from "../../customHooky/useStickyHeader";

const SubHeaderComp = ({ children }) => {
  const element = useRef(null);
  const isSticky = useStickyHeader({ element, topOffset: 126 });

  return (
    <div ref={element} className="title-cont">
      <div id={isSticky ? "sticky-title" : ""}>{children}</div>
    </div>
  );
};

export default SubHeaderComp;
