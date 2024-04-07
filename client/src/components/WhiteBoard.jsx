import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function WhiteBoard() {
  return (
    <div className="fixed inset-0 flex flex-row-reverse" >
      <div className="h-screen w-2/3 ">
        <Tldraw />
      </div>
    </div>
  );
}
