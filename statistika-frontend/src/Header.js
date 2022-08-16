import "./Header.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TiChartLineOutline } from "react-icons/ti";
import { RiListCheck2 } from "react-icons/ri";
import { HiOutlineUserCircle } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clicked, setClicked] = useState("");
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setClicked("graf");
    } else if (location.pathname === "/bot-list") {
      setClicked("list");
    } else {
      setClicked("");
    }
  }, [location]);

  // listener na zmenu šírky kvôli resizu výšky grafu
  const [windowIsSmall, setWindowIsSmall] = useState(false);
  useEffect(() => {
    function handleWindowResize() {
      let windowWidth = window.innerWidth;
      if (windowWidth < 1001) {
        setWindowIsSmall(true);
      } else {
        setWindowIsSmall(false);
      }
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="header">
      <div className="upper-header">
        <div className="upper-fluid">
          <div className="logo-box">
            <span className={windowIsSmall ? "logo-sm" : "logo-lg"}>
              <img alt="logo" src={windowIsSmall ? "/logo-sm.png" : "/logo-dark.png"}></img>
            </span>
          </div>
          <div className="account-box" id={dropdown ? "clicked" : ""} onClick={() => setDropdown(!dropdown)}>
            <HiOutlineUserCircle className="user"></HiOutlineUserCircle>
            <span>Účet</span>
            <RiArrowDropDownLine className="drop"></RiArrowDropDownLine>
            <div className="account-dropdown" id={dropdown ? "visible" : "invisible"}>
              <FiLogOut /> Odhlásiť
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
