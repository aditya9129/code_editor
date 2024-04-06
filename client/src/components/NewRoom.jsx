import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
export default function NewRoom(){
    const [roomid,setroomid]=useState('');
    const [username,setusername]=useState('');
    function submit(e){
        e.preventDefault();
    } 
    function handlenewrom(){
        const newRoomId = uuidv4();
        setroomid(newRoomId);
        document.getElementById('roomInput').value = newRoomId;
    }
    console.log(roomid);
    return (
        <div className="flex justify-center bg-[#0F172A]">
            <div className="">
            <form className="w-1/2 " onSubmit={submit}>
                <input placeholder="enter id" className="rounded-md w-full" value={roomid} onChange={e=>setroomid(e.target.value)}  id="roomInput"></input>
                <input placeholder="enter username" className="rounded-md w-full" value={username} onChange={e=>setusername(e.target.value)}></input>
                <button className="">JOIN</button>
            </form>
            <button onClick={handlenewrom}>new room?</button>
            </div>    
        </div>
    )
}