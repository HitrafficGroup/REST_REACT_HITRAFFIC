import { React, useEffect, useState } from "react";
export default function RelogActual(){
    const [tiempoActual, setTiempoActual] = useState(new Date().toLocaleTimeString())
    const horaActual = () => {
        let tiempo = new Date().toLocaleTimeString();
        setTiempoActual(tiempo);
    }

        useEffect(() => {
        setInterval(() => {
            horaActual();
        }, 1000);
    }, [])

    return(
        <>
         <p>{tiempoActual}</p>
        </>
    )

}