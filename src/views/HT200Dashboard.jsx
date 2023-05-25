import React from "react";
import { Routes, Route } from "react-router-dom";
import HT200AppBar from "../components/HT200AppBar";
import Home200 from "./Home200";
import UnidadHT200View from "./UnidadHT200View";
import FasesHT200View from "./FasesHT200View";
import SecuencyHT200View from "./SecuencyHT200View";
import SplitHT200View from "./SplitHT200View";
import PatternHT200View from "./PatternHT200View";
import AccionesHT200View from "./AccionesHT200View";
import PlanHT200View from "./PlanHT200View";
import HorariosHT200View from "./HorariosHT200View";
export default function HT200Dashboard(){
    return (
        <>
        <HT200AppBar />
            <Routes>
                <Route path="home" element={<Home200 />} />
                <Route path="unit" element={<UnidadHT200View />} />
                <Route path="fases" element={<FasesHT200View />} />
                <Route path="sequency" element={<SecuencyHT200View />} />
                <Route path="split" element={<SplitHT200View />} />
                <Route path="pattern" element={<PatternHT200View />} />
                <Route path="action" element={<AccionesHT200View />} />
                <Route path="plan" element={<PlanHT200View />} />
                <Route path="horario" element={<HorariosHT200View />} />
            </Routes>   
        </>
      );
}