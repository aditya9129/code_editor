import { useState } from "react";
import NewRoom from "./components/NewRoom";
function App() {
  return (
    <Routes>
    <Route path="/" element={<Layout/>}>
    <Route index element={<Index/>}/>
    <Route path='/login' element={<Loginpage/>}/>
    
    </Route>
 </Routes>
  );
};

export default App;
