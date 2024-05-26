import Member from "./Member";

export default function Chatbox({clients,messages}){
    return(
    <div className="bg-[#202C33] w-full h-screen flex flex-col">
    <div className="flex"> <h1 className="text-white mx-auto">Code Room</h1></div>  
       <p className="text-white p-2 m-1 mx-auto">Connected Users</p>
       <div className=" bg-gray-800 p-2">
           {clients.map((info) => (
               <Member key={info.socketid} username={info.username} />
           ))}
            </div>
           <div className="h-full flex flex-col justify-end">
               <div className="overflow-y-auto max-h-[80vh]">
                   {messages.map((msg, idx) => (
                       <div key={idx} className="text-white mb-1">
                           <strong>{msg.username}: </strong>
                           {msg.message}
                       </div>
                   ))}
               </div>
           </div>
      
       
   </div>
    )
}