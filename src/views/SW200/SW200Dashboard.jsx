import React from "react";
import { Routes, Route } from "react-router-dom";
import HT200AppBar from "../../components/HT200AppBar";
import FasesHT200View from "../HT200/FasesHT200View";
import SecuencyHT200View from "../HT200/SecuencyHT200View";
import SplitHT200View from "../HT200/SplitHT200View";
import PatternHT200View from "../HT200/PatternHT200View";
import AccionesHT200View from "../HT200/AccionesHT200View";
import PlanHT200View from "../HT200/PlanHT200View";
import HorariosHT200View from "../HT200/HorariosHT200View";
import ChannelHT200View from "../HT200/ChannelHT200View";
import BasicSettingsHT200View from "../HT200/BasicSettingsHT200View";
import PruebasView from "../PruebasView";
import RegistroErroresHT200View from "../HT200/RegistroErroresHT200View";
import ClonacionHT200View from "../HT200/ClonacionHT200View";
import UnidadSW200View from "./UnidadSW200View";
import HomeSW200View from "./HomeSW200View";
export default function HT200Dashboard(){
    return (
        <>
        <HT200AppBar />
            <Routes>
                <Route path="home" element={<HomeSW200View />} />
                <Route path="config" element={<BasicSettingsHT200View />} />
                <Route path="unit" element={<UnidadSW200View/>} />
                <Route path="fases" element={<FasesHT200View />} />
                <Route path="sequency" element={<SecuencyHT200View />} />
                <Route path="split" element={<SplitHT200View />} />
                <Route path="pattern" element={<PatternHT200View />} />
                <Route path="action" element={<AccionesHT200View />} />
                <Route path="plan" element={<PlanHT200View />} />
                <Route path="horario" element={<HorariosHT200View />} />
                <Route path="channel" element={<ChannelHT200View />} />
                <Route path="pruebas" element={<PruebasView />} />
                <Route path="errores" element={<RegistroErroresHT200View />} />
                <Route path="clonacion" element={<ClonacionHT200View />} />
            </Routes>   
        </>
      );
}