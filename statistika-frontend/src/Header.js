import "./Header.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TiChartLineOutline } from "react-icons/ti";
import { RiListCheck2 } from "react-icons/ri";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clicked, setClicked] = useState("");

  useEffect(() => {
    if (location.pathname === "/") {
      setClicked("graf");
    } else if (location.pathname === "/bot-list") {
      setClicked("list");
    } else {
      setClicked("");
    }
  }, [location]);

  return (
    <div className="header">
      <button id={clicked === "graf" ? "active" : "inactive"} onClick={() => navigate("../")}>
        <TiChartLineOutline />
        Graf
      </button>
      <button id={clicked === "list" ? "active" : "inactive"} onClick={() => navigate("../bot-list")}>
        <RiListCheck2 />
        List
      </button>
    </div>
  );
}

export default Header;
