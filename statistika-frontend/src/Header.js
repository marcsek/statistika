import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="header">
      <button onClick={() => navigate("../")}>Graf</button>
      <button onClick={() => navigate("../bot-list")}>List</button>
      <button onClick={() => navigate("../bot-detail/3232")}>Bot</button>
    </div>
  );
}

export default Header;
