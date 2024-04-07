import { useState } from "react"
import { Link } from "react-router-dom"
import Member from "./Member"
export default function Chat(){
    // const [member,setmember]=useState(['']);
    const member= [ {socketID:1,
        username:"Aditya"
        },
        {socketID:2,
        username:"Khatana"
        }];
    
    return (
    <div className=" bg-[#202C33]  w-full h-screen ">
    <h1 className="text-white">Code Room</h1>
   
    <p className="text-white p-2 m-1">Connected</p>
    {
       member.map((info)=>(
        
           <Member key={info.socketID} username={info.username}/>
           
       ))
    }
     <Link to={'/livewhiteboard'} className="bg-[#06CF9C] rounded-md m-2 p-2">Whiteboard</Link>
    <button className="bg-red-600 rounded-md m-2 p-2">Leave Room</button>
  </div>
  )
}