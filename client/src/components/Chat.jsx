import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Member from "./Member";
import { initSocket } from "../../socket.js";
import { Toaster } from "react-hot-toast";

export default function Chat() {
    const [clients, setClients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomid } = useParams();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                navigate('/');
            }

            socketRef.current.emit('join', {
                roomid,
                username: location.state?.username,
            });

            socketRef.current.on('joined', ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined`);
                }
                setClients(clients);
                console.log(clients);
            });

            socketRef.current.on('disconnected', ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((client) => client.socketid !== socketId));
            });

            socketRef.current.on('message', (message) => {
                setMessages((prev) => [...prev, message]);
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const handleMessageSend = () => {
        if (message.trim()) {
            socketRef.current.emit('message', {
                username: location.state?.username,
                message,
                roomid,
            });
            
            // setMessages((prev) => [...prev, { username: location.state?.username, message }]);
            console.log(messages);
            setMessage('');
        }
    };

    const handleLeaveRoom = () => {
        navigate('/');
    };

    return (
        
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
           
            <div className="flex p-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 rounded-l-md"
                />
                <button onClick={handleMessageSend} className="bg-[#06CF9C] rounded-r-md p-2">Send</button>
            </div>
            <button onClick={handleLeaveRoom} className="bg-red-600 rounded-md m-2 p-2">Leave Room <Toaster/></button>
        </div>
        
    );
}
