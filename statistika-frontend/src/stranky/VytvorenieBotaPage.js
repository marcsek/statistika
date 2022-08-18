import React, { useState, useRef, useEffect } from "react";

import "./VytvorenieBotaPage.css";

import ParametreEditor from "../komponenty/ParametreEditor";
import { addBot } from "../pomocky/fakeApi";
import LoadingComponent from "../komponenty/LoadingComponent";
import { saveTextValues } from "../pomocky/fakeApi";

import { FaRegSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdKeyboardReturn } from "react-icons/md";

function VytvorenieBotaPage() {
  const navigate = useNavigate();
  const childRef = useRef();
  const [loading, setLoading] = useState({
    isLoading: false,
    msg: "",
    hasError: { status: false, msg: "" },
  });
  const [renderPost, setRenderPost] = useState(false);

  const onCreate = async (burza) => {
    setLoading({ isLoading: true, msg: "Vytváram...", hasError: { status: false, msg: "" } });
    addBot(burza);
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setLoading({ isLoading: false, msg: "Vytváram...", hasError: { status: false, msg: "" } });
    setRenderPost(true);
  };

  const onSave = async () => {
    setLoading({ isLoading: true, msg: "Ukladám...", hasError: { status: false, msg: "" } });
    saveTextValues(childRef.current.getTextValues());
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setLoading({ isLoading: false, msg: "Ukladám...", hasError: { status: false, msg: "" } });
  };

  useEffect(() => {
    childRef.current.setTextValues();
  }, []);

  return (
    <div className="vytvorenie-bota-cont">
      <div className="vyt-bot-title-cont">
        <span>Vytvorenie bota</span>
        <button
          className="ulozit-bota-btn"
          id={renderPost ? "inactive" : "active"}
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <FaRegSave /> Uložiť
        </button>
      </div>
      <div className="vyt-bot-content">
        {loading.isLoading && <LoadingComponent loadingText={loading.msg} height={517}></LoadingComponent>}
        <div style={{ display: loading.isLoading || renderPost ? "none" : "" }}>
          <ParametreEditor ref={childRef} type="create" onCreate={onCreate} onSave={onSave}></ParametreEditor>
        </div>
        <div className="post-bot-create-cont" style={{ display: !renderPost ? "none" : "" }}>
          <h1>Bota Sa Podarilo Vytvoriť</h1>
          <IoMdCheckmarkCircleOutline className="checkmark" />
          <a onClick={(e) => navigate("/bot-detail/3232")}>Detail vytvoreného bota</a>
          <button
            onClick={(e) => {
              e.preventDefault();
              setRenderPost(false);
            }}
          >
            <MdKeyboardReturn />
            Vytvoriť ďaľšieho bota
          </button>
        </div>
      </div>
    </div>
  );
}

export default VytvorenieBotaPage;
