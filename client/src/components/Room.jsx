import { Link } from "react-router-dom"
import CodeEditor from "./CodeEditor"
import Chat from "./Chat"
export default function Room(){
    return (
        <div className="w-full flex h-screen">
        
        <div className="w-1/3">
            <Chat/>
        </div>
        <div className="bg-[#1C1E2A] w-2/3">
            <CodeEditor/>
        </div>
        </div>
    )
} 