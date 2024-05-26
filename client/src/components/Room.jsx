// import { Link } from "react-router-dom"
import {  useRef} from "react";
import CodeEditor from "./CodeEditor"
import Chat from "./Chat"
export default function Room(){
    const socketRef = useRef(null);
    return (
        <div className="w-full flex ">
        
        <div className="w-1/3">
            <Chat socketRef={socketRef}/>
        </div>
        <div className="bg-[#1C1E2A] w-2/3 h-full">
            <CodeEditor/>
        </div>
        </div>
    )
} 