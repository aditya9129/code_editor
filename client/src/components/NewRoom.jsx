import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const notify = () => toast("Room Id generated");
// const copy = () => toast('RoomId copied');
export default function NewRoom() {
  const [roomid, setroomid] = useState("");
  const [username, setusername] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    navigate(`/room/${roomid}`, {
      state: {
        username,
      },
    });
  }

  function handlenewrom() {
    const newRoomId = uuidv4();
    setroomid(newRoomId);
    document.getElementById("roomInput").value = newRoomId;
    notify();
  }
  console.log(roomid);

  return (
    <div className=" bg-[#1C1E2A] flex justify-center items-center h-screen">
      <div className="m-2 p-2 flex flex-col items-center">
        <form className="p-2" onSubmit={submit}>
          <h1 className="text-white text-2xl m-2">ROOM</h1>
          <input
            placeholder="enter id"
            className="rounded-md w-full m-2 p-2"
            value={roomid}
            onChange={(e) => setroomid(e.target.value)}
            id="roomInput"
            required
          ></input>
          <input
            placeholder="enter username"
            className="rounded-md w-full m-2 p-2"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
          ></input>
          <button className="bg-[#06CF9C] p-2 m-2 rounded-md text-white text-xl">
            JOIN
          </button>
        </form>
        <p className="text-white">
          Dont have room id?{" "}
          <button onClick={handlenewrom} className="text-[#06CF9C]">
            New room
          </button>{" "}
          <Toaster />
        </p>
      </div>
    </div>
  );
}
