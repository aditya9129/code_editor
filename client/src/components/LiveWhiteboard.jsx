import React from "react";
import Chat from "./Chat";
import WhiteBoard from "./WhiteBoard";

export default function LiveWhiteBoard() {
  return (
    <div className="w-full flex">
      <div className="w-1/3">
        <Chat />
      </div>
      <div className="inset-0  w-2/3">
        <WhiteBoard />
      </div>
    </div>
  );
}
