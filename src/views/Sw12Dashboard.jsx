import { Routes, Route } from "react-router-dom";
import ButtonAppBar from "../components/ButtonAppBar";
import ClonacionView from "./ClonacionView";
import ResumenView from "./ResumenView";
import HomeView from "./HomeView"
import GruposView from "./GruposView";
import EntradasView from "./EntradasView"
import FasesView from "./FasesView";
import HorariosView from "./HorariosView";
import PlanesView from "./PlanesView";
import ErroresView from "./ErroresView";
import SyncTimeView from "./SyncTimeView";
import MapaUniversalView from "./MapaUniversalView";
import DeclararControladorView from "./DeclararControladorView";
import PruebasView from "./PruebasView";
import ControlersView from "./ControlersView";
export default function Sw12Dashboard() {

    return (
        <>
            <ButtonAppBar>
            <Routes>
                <Route path="home" element={<HomeView />} />
                <Route path="clonacion" element={<ClonacionView />} />
                <Route path="resumen" element={<ResumenView />} />
                <Route path="entradas" element={<EntradasView />} />
                <Route path="fases" element={<FasesView />} />
                <Route path="horarios" element={<HorariosView />} />
                <Route path="planes" element={<PlanesView />} />
                <Route path="errores" element={<ErroresView />} />
                <Route path="grupos" element={<GruposView />} />
                <Route path="sincronizar-tiempos" element={<SyncTimeView />} />
                <Route path="mapa-universal" element={<MapaUniversalView />} />
                <Route path="pruebas" element={<PruebasView />} />
                <Route path="admin" element={<ControlersView />} />
                <Route path="declarar-controlador" element={<DeclararControladorView />} />
            </Routes>
            </ButtonAppBar>
            {/* <CardInformation/>
                <CardController/> */}
        </>
    );
}