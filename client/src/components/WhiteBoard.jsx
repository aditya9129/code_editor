import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function WhiteBoard() {
  return (
    <div className="  flex flex-row-reverse">
      <div className="h-[70vh] w-2/3 ">
        <Tldraw />
      </div>
    </div>
  );
}
