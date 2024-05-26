import NewRoom from "./components/NewRoom";
import WhiteBoard from "./components/WhiteBoard";
import Room from "./components/Room";
import { Routes, Route } from "react-router-dom";
import LiveWhiteBoard from "./components/LiveWhiteboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewRoom />}></Route>
      <Route path="/whiteboard" element={<WhiteBoard />} />
      <Route path="/livewhiteboard/:roomid" element={<LiveWhiteBoard />} />
      <Route path="/room/:roomid" element={<Room />} />
    </Routes>
  );
}

export default App;
