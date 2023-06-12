import { React, useEffect, useState } from "react";
export default function RelogActual(){
    const [tiempoActual, setTiempoActual] = useState(new Date().toLocaleTimeString("es-EC"))
    const horaActual = () => {
        let tiempo = new Date().toLocaleTimeString("es-EC");
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