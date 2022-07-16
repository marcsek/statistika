import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function BotDetail() {
  const { botId } = useParams();
  return (
    <div>
      <p>BotDetail</p>
      <p>{botId}</p>
    </div>
  );
}

export default BotDetail;
