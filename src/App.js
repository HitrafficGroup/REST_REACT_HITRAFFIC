import { Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import Sw12Dashboard from "./views/SW12/Sw12Dashboard";
import HT200Dashboard from "./views/HT200/HT200Dashboard";
import DeclararControladorView from "./views/DeclararControladorView";
import ControlersView from "./views/ControlersView";
import VistaMaestraView from "./views/VistaMaestraView";
import PruebasInterfaz from "./views/PruebasInterfaz";
function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<LoginView/>} />
          <Route path="/equipos" element={<ControlersView/>} />
          <Route path="/crear_equipo" element={<DeclararControladorView/>} />
          <Route path="/controlador_SW12/*" element={<Sw12Dashboard/>} /> 
          <Route path="/controlador_HT200/*" element={<HT200Dashboard/>} />
          <Route path="/vista_maestra" element={<VistaMaestraView/>} />
          <Route path="/pruebas_interfaz" element={<PruebasInterfaz/>} />
        </Routes>
    </div>
  );
}

export default App;
// pendiente programar en caso de que se requiera una vista con la configuracion de los controladores por origen