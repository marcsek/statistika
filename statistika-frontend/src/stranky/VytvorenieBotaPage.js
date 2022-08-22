import React, { useState, useRef, useEffect } from "react";

import "./VytvorenieBotaPage.css";

import ParametreEditor from "../komponenty/ParametreEditor";
import { addBot } from "../pomocky/fakeApi";
import LoadingComponent from "../komponenty/LoadingComponent";
import { saveTextValues } from "../pomocky/fakeApi";

import { FaRegSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { BiBadgeCheck } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdKeyboardReturn } from "react-icons/md";
import { TbRobot } from "react-icons/tb";

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
      <div className="vyt-bot-content" style={{ paddingLeft: loading.isLoading ? 0 : "" }}>
        {loading.isLoading && <LoadingComponent loadingText={loading.msg} background={true}></LoadingComponent>}
        <div style={{ display: renderPost ? "none" : "" }}>
          <ParametreEditor ref={childRef} type="create" onCreate={onCreate} onSave={onSave}></ParametreEditor>
        </div>
        <div
          className="post-bot-create-cont"
          style={{ height: !renderPost ? "0px" : "", visibility: !renderPost ? "hidden" : "", overflow: !renderPost ? "hidden" : "" }}
        >
          <h1>Bota Sa Podarilo Vytvoriť</h1>
          <IoCheckmarkDoneSharp className="checkmark" id={renderPost ? "active" : "inactive"} />
          <button className="bot-button" onClick={(e) => navigate("/bot-detail/3232")}>
            {" "}
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
