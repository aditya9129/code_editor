import { useState,  useEffect } from "react";
import {  useLocation, useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Chatbox from "./Chatbox.jsx";
import { initSocket } from "../../socket.js";
import { Toaster } from "react-hot-toast";

export default function Chat({socketRef}) {
    const [clients, setClients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
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
            socketRef.current.on('chat_history', (chatHistory) => {
                setMessages(chatHistory);
            });
        };

        init();
         //when we return from useEffect it is cleaning function
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('joined');
                socketRef.current.off('disconnected')
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
            
            console.log(messages);
            setMessage('');
        }
    };

    const handleLeaveRoom = () => {
        navigate('/');
    };

    return (
        
        <div className="bg-[#202C33] w-full h-screen flex flex-col">
            
            <Chatbox clients={clients} messages={messages}/>
            <div className="flex p-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 rounded-l-md"
                />
                <button onClick={handleMessageSend} className="bg-[#06CF9C] rounded-r-md p-2 text-white">Send</button>
            </div>
            <button onClick={handleLeaveRoom} className="bg-red-600 rounded-md m-2 p-2 text-white">Leave Room <Toaster/></button>
        </div>
        
    );
}
