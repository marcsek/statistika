import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";
import { MdKeyboardReturn } from "react-icons/md";

function ErrorPage() {
  const navigate = useNavigate();
  document.title = "Error 404 | Highdmin";

  return (
    <div className="error-page-cont">
      <div className="logo-box-login">
        <span className="logo-lg">
          <img alt="logo" src="/logo-dark.png"></img>
        </span>
      </div>
      <h1 className="text-error">Error 404</h1>
      <h4 className="sub-text-error">Stránka nebola nájdená</h4>
      <button
        className="return-button"
        onClick={(e) => {
          e.preventDefault();
          navigate("/", { replace: true });
        }}
      >
        <MdKeyboardReturn />
        Prejsť na Dashboard
      </button>
    </div>
  );
}

export default ErrorPage;
