import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
export default function WhiteBoard() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
}

