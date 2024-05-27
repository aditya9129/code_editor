import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
const notify = () => toast('Room Id generated');
// const copy = () => toast('RoomId copied');
export default function NewRoom(){

    const [roomid,setroomid]=useState('');
    const [username,setusername]=useState('');
    const navigate = useNavigate();
    const [roomform,setroomform]=useState(true);

    function submit(e){
        e.preventDefault();
        navigate(`/room/${roomid}`,{
           state:{
            username,
           }

        });
    } 

    function handleform(){
        setroomform(!roomform);
    }
    function handlenewrom(){
        const newRoomId = uuidv4();
        setroomid(newRoomId);
        document.getElementById('roomInput').value = newRoomId;
        notify();
    }
    console.log(roomid);


    if(roomform===true){
        return (
            <div className=" bg-[#1C1E2A] flex justify-center items-center h-screen">
            <div className="m-2 p-2 flex flex-col items-center">
               
              <div className='flex'> <button className='bg-red-200 justify-around' onClick={handleform}>cross</button> </div>
               <form className="p-2" onSubmit={submit}>
                  <h1 className='text-white text-2xl m-2'>ROOM</h1>
                      <input placeholder="enter id" className="rounded-md w-full m-2 p-2" value={roomid} onChange={e => setroomid(e.target.value)} id="roomInput" required></input>
                      <input placeholder="enter username" className="rounded-md w-full m-2 p-2" value={username} onChange={e => setusername(e.target.value)} required></input>
                       <button className="bg-[#06CF9C] p-2 m-2 rounded-md text-white text-xl">JOIN</button>
              </form>
             <p className='text-white'>Dont have room id? <button onClick={handlenewrom} className='text-[#06CF9C]'>New room</button>  <Toaster /></p>
            </div>
            
            </div>
        )
    }else{
        
            return (
                <div className="flex flex-col space-y-10 bg-gradient-to-b from-slate-800 via-bgpink to-bgdark min-h-screen text-white justify-center items-center">
                  <div>
                    <title>Code Online</title>
                    <meta
                      name="description"
                      content="Code Online is an online community for testing and showcasing user-created HTML, CSS and JavaScript code snippets. It functions as an online code editor and open-source learning environment, where developers can create code snippets, "
                    />
                    <link rel="icon" href="/favicon.ico" />
                  </div>
                  
                  <div className="flex justify-center items-center mx-5 space-x-8">
                    <div className=" flex flex-col justify-center items-center space-y-4 ">
                      <h1 className="font-extrabold text-5xl md:text-6xl text-center">
                        Code Here.{" "} 
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-textpink to-textblue">
                          Code Now.
                        </span>
                      </h1>
            
                     
                    </div>
            
                    <div className=" rounded-lg border-2 overflow-hidden">
                      {/* <Image
                        src="/ww1.png"
                        width="800px"
                        className="aspect-square"
                        height="500px"
                      /> */}
                    </div>
                  </div>
            
                  <footer className="fixed bottom-2">
                    Made with 💛 by{" "}
                    <a
                      className="text-primary ml-2 font-bold"
                      href=""
                    >
                      {" "}
                      Nayan Patil
                    </a>
                  </footer>
                </div>
              );
        
    }
}





