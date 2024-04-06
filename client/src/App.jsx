import NewRoom from "./components/NewRoom";
import WhiteBoard from "./components/WhiteBoard";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<NewRoom />}></Route>
      <Route path="/whiteboard" element={<WhiteBoard />} />
    </Routes>
  );
}

export default App;
