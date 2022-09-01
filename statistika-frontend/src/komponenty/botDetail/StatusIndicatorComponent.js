import { useState } from "react";
import { VscCircleFilled } from "react-icons/vsc";

const StatusIndicatorComponent = () => {
  const [botActive /* setBotActive */] = useState(true);

  return (
    <div className="bot-status-indicator">
      <span>Status</span>
      <VscCircleFilled style={{ color: botActive ? "rgb(22, 199, 132)" : "rgb(234, 57, 67)" }}></VscCircleFilled>
    </div>
  );
};

export default StatusIndicatorComponent;
