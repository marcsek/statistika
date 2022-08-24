import React, { useState, useRef } from "react";

import "./VytvorenieBotaPage.css";

import ParametreEditor from "../komponenty/ParametreEditor";
import { addBot } from "../pomocky/fakeApi";
import { saveTextValues } from "../pomocky/fakeApi";

import { FaRegSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";
import { TbRobot } from "react-icons/tb";
import { useLoadingManager, LoadingComponent } from "../komponenty/LoadingManager";

function VytvorenieBotaPage() {
  const navigate = useNavigate();
  const parametreRef = useRef();

  const [loading, setLoadingStep, loadingMessage] = useLoadingManager(0, false);
  const [renderPost, setRenderPost] = useState(false);

  const onCreate = async (burza) => {
    setLoadingStep("send");
    addBot(burza);
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setLoadingStep("render");
    setRenderPost(true);
  };

  const onSave = async () => {
    setLoadingStep("save");
    saveTextValues(parametreRef.current.getTextValues());
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setLoadingStep("render");
  };

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
      <div className="vyt-bot-content" style={{ paddingLeft: loading ? 0 : "" }}>
        {loading && <LoadingComponent loadingText={loadingMessage} background={true}></LoadingComponent>}
        <div style={{ display: renderPost ? "none" : "" }}>
          <ParametreEditor ref={parametreRef} type="create" onCreate={onCreate} onSave={onSave}></ParametreEditor>
        </div>
        <div
          className="post-bot-create-cont"
          style={{ height: !renderPost ? "0px" : "", opacity: !renderPost ? 0 : 100, overflow: !renderPost ? "hidden" : "" }}
        >
          <h1>Bota Sa Podarilo Vytvoriť</h1>
          <IoCheckmarkDoneSharp className="checkmark" id={renderPost ? "active" : "inactive"} />
          <button className="bot-button" onClick={(e) => navigate("/bot-detail/3232")}>
            <TbRobot /> Detail vytvoreného bota
          </button>
          <button
            className="return-button"
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
