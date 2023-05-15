import { Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import MultiView from "./views/MultiView.jsx"
import DeclararControladorView from "./views/DeclararControladorView";
import ControlersView from "./views/ControlersView";
function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<LoginView/>} />
          <Route path="/equipos" element={<ControlersView/>} />
          <Route path="/crear_equipo" element={<DeclararControladorView/>} />
          <Route path="/controlador/*" element={<MultiView/>} />
        </Routes>
    </div>
  );
}

export default App;
