import { Sticky } from "react-sticky";

const SubHeaderComp = ({ children }) => {
  return (
    <div className="title-cont">
      <Sticky stickyStyle={{ width: "100%" }} className="daco" topOffset={-136}>
        {({ style, isSticky }) => (
          <div
            id={isSticky ? "sticky-title" : ""}
            style={{ ...style, top: isSticky ? "126px" : "", width: "", left: "" }}
            // className="sticky-title-cont"
          >
            {children}
          </div>
        )}
      </Sticky>
    </div>
  );
};

export default SubHeaderComp;
