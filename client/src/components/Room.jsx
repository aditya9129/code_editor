import { Link } from "react-router-dom"
export default function Room(){
    return (
        <div className=" bg-[#1C1E2A] h-[100px]">
          <Link to={'/whiteboard'} className="bg-[#06CF9C] rounded-md m-2 p-2">Whiteboard</Link>
        </div>
    )
} 