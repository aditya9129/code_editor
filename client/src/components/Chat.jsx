import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Chatbox from "./Chatbox.jsx";
import { initSocket } from "../../socket.js";
import { Toaster } from "react-hot-toast";

export default function Chat({ socketRef ,clients,messages,user,roomid,socketid}) {
  // const [clients, setClients] = useState([]);
  // const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState("");
  // const [user, setuser] = useState("");
   const navigate = useNavigate();
   const location = useLocation();
  //  const { roomid } = useParams();

 
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }
  const handleMessageSend = () => {
    console.log(socketRef);
    let time = getCurrentTime();
    if (message.trim()) {
      socketRef.current.emit("message", {
        username: location.state?.username,
        message,
        roomid,
        time,
        socketid
        
      });

      setMessage("");
    }
  };

  const handleLeaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="bg-[#1C1E2A] w-full  flex flex-col">
      <Chatbox clients={clients} messages={messages} user={user} socketid={socketid}/>
      <div className="flex p-2 mx-auto w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-l-md"
        />
        <button
          onClick={handleMessageSend}
          className="bg-[#06CF9C] rounded-r-md p-2 text-white "
        >
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios-glyphs/30/filled-sent.png"
            alt="filled-sent"
          />
        </button>
      </div>
      <button
        onClick={handleLeaveRoom}
        className="bg-red-600 rounded-md m-2 p-2 text-white"
      >
        Leave Room <Toaster />
      </button>
    </div>
  );
}






