import { Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import MultiView from "./views/MultiView.jsx"
function App() {
  return (

    <div className="App">
      <Routes>
          <Route path="/" element={<LoginView/>} />
          <Route path="/david-diaz/*" element={<MultiView/>} />
        </Routes>
    </div>
  );
}

export default App;
