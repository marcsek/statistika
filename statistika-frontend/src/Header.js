import "./Header.css";
import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TiChartLineOutline } from "react-icons/ti";
import { RiListCheck2 } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import useWindowDimensions from "./pomocky/window";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clicked, setClicked] = useState("");
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setClicked("graf");
      document.title = "Dashboard | Highdmin";
    } else if (location.pathname === "/bot-list") {
      setClicked("list");
      document.title = "Bot-List | Highdmin";
    } else if (location.pathname === "/login") {
      setClicked("");
      document.title = "Login | Highdmin";
    } else {
      setClicked("");
    }
  }, [location]);

  // listener na zmenu šírky kvôli resizu výšky grafu
  const windowDimensions = useWindowDimensions();
  const [windowIsSmall, setWindowIsSmall] = useState(false);
  useLayoutEffect(() => {
    if (windowDimensions.width < 350) {
      setWindowIsSmall(true);
    } else {
      setWindowIsSmall(false);
    }
  }, [windowDimensions]);

  return (
    <div className="header" style={{ display: location.pathname === "/login" && "none" }}>
      <div className="upper-header">
        <div className="upper-fluid">
          <div className="logo-box">
            <span
              className={windowIsSmall ? "logo-sm" : "logo-lg"}
              onClick={() => {
                navigate("../");
              }}
            >
              <img alt="logo" src={windowIsSmall ? "/logo-sm.png" : "/logo-dark.png"}></img>
            </span>
          </div>
          <div className="account-box" id={dropdown ? "clicked" : ""} onClick={() => setDropdown(!dropdown)}>
            <HiOutlineUserCircle className="user"></HiOutlineUserCircle>
            <span>Účet</span>
            <RiArrowDropDownLine className="drop"></RiArrowDropDownLine>
            <div
              className="account-dropdown"
              id={dropdown ? "visible" : "invisible"}
              onClick={(e) => {
                e.preventDefault();
                navigate("../login");
              }}
            >
              <FiLogOut />
              Odhlásiť
            </div>
          </div>
        </div>
      </div>
      <div className="sub-header">
        <div className="sub-fluid">
          <button
            id={clicked === "graf" ? "active" : "inactive"}
            onClick={() => {
              navigate("../");
              setClicked("graf");
            }}
          >
            <TiChartLineOutline />
            Dashboard
          </button>
          <button
            id={clicked === "list" ? "active" : "inactive"}
            onClick={() => {
              navigate("../bot-list");
              setClicked("list");
            }}
          >
            <RiListCheck2 />
            Bot List
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
