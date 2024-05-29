import { useState } from "react";
import Member from "./Member";

export default function Chatbox({ clients, messages, user ,socketid}) {
    const [showParticipants, setShowParticipants] = useState(false);

    return (
        <div className="bg-[#1C1E2A] w-full h-[70vh] flex flex-col">
            <div className="flex items-center justify-center">
                <h1 className="text-white text-xl font-bold">Code Room</h1>
            </div>
            <div className="flex justify-center">
                <button
                    className={`p-2 m-2 rounded-md text-xl ${showParticipants ? 'bg-[#06CF9C] text-white' : 'bg-gray-300 text-black'}`}
                    onClick={() => setShowParticipants(true)}
                >
                    Users
                </button>
                <button
                    className={`p-2 m-2 rounded-md text-xl ${!showParticipants ? 'bg-[#06CF9C] text-white' : 'bg-gray-300 text-black'}`}
                    onClick={() => setShowParticipants(false)}
                >
                    Chat
                </button>
            </div>
            {showParticipants ? (
                <div className="grid grid-cols-1 gap-2 mt-2 p-2">
                    {clients.map((info) => (
                        <Member key={info.socketid} username={info.username} />
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col justify-end w-full">
                    <div className="overflow-auto p-2 ">
                        {messages.slice().map((msg, idx) => (
                            <div key={idx} className={`flex ${user !== msg.username ? 'justify-start' : 'justify-end'}`}>
                                <div className={`text-white mb-1 ${user !== msg.username ? 'bg-[#06CF9C]' : 'bg-green-400'} rounded-lg p-2 inline-block max-w-full break-words`}>
                                    <strong>{msg.username}: </strong>
                                    {msg.message}
                                    <div>{msg.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
