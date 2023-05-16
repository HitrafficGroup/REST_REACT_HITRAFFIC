import { Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import Sw12Dashboard from "./views/Sw12Dashboard.jsx"
import HT200Dashboard from "./views/HT200Dashboard";
import DeclararControladorView from "./views/DeclararControladorView";
import ControlersView from "./views/ControlersView";
function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<LoginView/>} />
          <Route path="/equipos" element={<ControlersView/>} />
          <Route path="/crear_equipo" element={<DeclararControladorView/>} />
          <Route path="/controlador_SW12/*" element={<Sw12Dashboard/>} />
          <Route path="/controlador_HT200/*" element={<HT200Dashboard/>} />
        </Routes>
    </div>
  );
}

export default App;
