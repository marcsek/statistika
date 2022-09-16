import React, { useState, useRef } from "react";

import "./VytvorenieBotaPage.css";

import ParametreEditor from "../komponenty/formParametreBota/ParametreEditor";
import { addBot, saveTextValues } from "../pomocky/fakeApi";

import { FaRegSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";
import { TbRobot } from "react-icons/tb";
import LoadingButtonComponent from "../komponenty/zdielane/LoadingButtonComponent";
import SubHeaderComp from "../komponenty/zdielane/SubHeaderComp";

function VytvorenieBotaPage() {
  const navigate = useNavigate();
  const parametreRef = useRef();

  const [saving, setSaving] = useState(false);
  const [renderPost, setRenderPost] = useState(false);

  const onCreate = async (burza) => {
    addBot(burza);
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setRenderPost(true);
  };

  const onSave = async () => {
    setSaving(true);
    saveTextValues(parametreRef.current.getTextValues());
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(500);
    setSaving(false);
  };

  return (
    <div className="vytvorenie-bota-cont">
      <SubHeaderComp>
        <div className="vyt-bot-title-cont">
          <span>Vytvorenie bota</span>
          <LoadingButtonComponent
            buttonProps={{ className: "ulozit-bota-btn", id: renderPost ? "inactive" : "active" }}
            handleSubmitPress={onSave}
            loading={saving}
            delay={200}
          >
            <FaRegSave /> Uložiť
          </LoadingButtonComponent>
        </div>
      </SubHeaderComp>
      <div className="vyt-bot-content">
        <div>{!renderPost && <ParametreEditor ref={parametreRef} type="create" onCreate={onCreate} onSave={onSave}></ParametreEditor>}</div>
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
