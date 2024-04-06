import NewRoom from "./components/NewRoom";
import White_board from "./components/White_board";
import { Routes ,Route} from 'react-router-dom'
function App() {
  return (
    <Routes>
    <Route path="/" element={<NewRoom/>}>
    <Route path='/whiteboard' element={<White_board/>}/>
    
    </Route>
 </Routes>
  );
};

export default App;
