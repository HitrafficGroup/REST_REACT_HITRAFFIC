import React, { useState } from 'react';
import "../css/ResumenView.css"



export default function CalendarSemaforo(){

    return(
        <>
    <div class="table-responsive">
        <h5>Programación semanal</h5>
        <table id="tabla_resumen" class="table table-bordered">
            <thead id="fecha_dia">
            </thead>
            <thead>
              <tr>
                <th id = "columna_0" scope="col">Hora</th>
                <th id = "columna_1" scope="col">Lunes</th>
                <th id = "columna_2" scope="col">Martes</th>
                <th id = "columna_3" scope="col">Miercoles</th>
                <th id = "columna_4" scope="col">Jueves</th>
                <th id = "columna_5" scope="col">Viernes</th>
                <th id = "columna_6" scope="col">Sabado</th>
                <th id = "columna_7" scope="col">Domingo</th>
              </tr>
            </thead>
            
        </table>

    </div>

        </>
    )

}