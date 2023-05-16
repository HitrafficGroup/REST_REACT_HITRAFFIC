import React from "react";
import { Routes, Route } from "react-router-dom";

import HT200AppBar from "../components/HT200AppBar";
import Home200 from "./Home200";
export default function HT200Dashboard(){
    return (
        <>
        <HT200AppBar />
            <Routes>
                <Route path="home" element={<Home200 />} />
            </Routes>   
        </>
      );
}