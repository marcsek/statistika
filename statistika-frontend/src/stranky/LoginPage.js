import React from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/", { replace: true });
        }}
        className="login-box"
      >
        <div className="logo-box-login">
          <span className="logo-lg">
            <img alt="logo" src="/logo-dark.png"></img>
          </span>
        </div>
        <div className="login-form">
          <div className="login-title">Prihlásenie</div>
          <div className="login-input">
            <span>Meno</span>
            <input type="text" placeholder="Zadajte Meno"></input>
          </div>
          <div className="login-input">
            <span>Heslo</span>
            <input type="password" placeholder="Zadajte Heslo"></input>
          </div>
          <div className="login-button">
            <button type="submit">Prihlásiť sa</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
