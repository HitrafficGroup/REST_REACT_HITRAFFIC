import React from "react";
import { Container,Grid,Typography,Button } from "@mui/material";
import { useState } from "react";
import { CloudDownload } from "@mui/icons-material";
import { useSelector } from 'react-redux';
export default function  ResumenHT200View(){
    const controlerState = useSelector(state => state.controlerht200);
    const [horarios,setHorarios] = useState([])
    const cargarMapa = async () => {
        let data_horarios = []
        let aux_plan_inicial = controlerState.plan[0].data
        aux_plan_inicial.forEach(element => {
            let aux_accion = controlerState.acciones.find(item=> item.number === element.action)
            let aux_patron = controlerState.pattern.find(item=> item.number === aux_accion.patron)
            let splits_aux = controlerState.split.find(item => item.id === "split-" + aux_patron.splitnumber).data
            let sequency_aux = controlerState.secuencias.find(item => item.id === "seq-" + aux_patron.sequencenumber)
            let aux_long = 0
        let domain_seq = []
        for (let j = 0; j < 4; j++) {
            let long = sequency_aux[`ring${j + 1}`].length
            if (long > aux_long) {
                aux_long = long
                domain_seq = sequency_aux[`ring${j + 1}`]
            }
            
        }
        let data_formated = domain_seq.map((item, index) => {
                let duracion = splits_aux.filter(temp => temp.fase === item.value)[0].tiempo
                let fases = [sequency_aux.ring1[index], sequency_aux.ring2[index], sequency_aux.ring3[index], sequency_aux.ring4[index]].filter(item => item !== undefined)
                let values = fases.map(item => (item.value))
                let aux_data = {
                    paso: index + 1,
                    fase: values,
                    duracion: duracion,
                    amarillo: 3,
                    rojo: 2,
                    verde: duracion - 5,
                }
    
                return aux_data
            })

            let table_data = data_formated.map((item, index) => {
            let paso_data = {
                g1: false,
                g2: false,
                g3: false,
                g4: false,
                duracion: item.duracion,
                id: index + 1,
            }
            item.fase.forEach((fas) => {
                paso_data[`g${fas}`] = true
            })
            return paso_data
        
        }) 
            let t_ciclo = 0
            table_data.forEach(item=>{
                t_ciclo = t_ciclo + item.duracion
            })
           
      
            let plan = {
                data:table_data,
                ciclo: t_ciclo
            }
            data_horarios.push(plan)
        });
        console.log(data_horarios)
        setHorarios(data_horarios)
    }
    const factor2 = 2
    const sf = 20
    return(
        <>
            <Container maxWidth="lg" sx={{ paddingTop: 3 }}>
            <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Resumen del Controlador
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Button variant="contained" color='verde2' fullWidth  onClick={cargarMapa} startIcon={<CloudDownload />}>
                            LEER DATOS
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                       
                                <div className='tabla-resumen'>
                                    <h5>Programación semanal</h5>
                                    <table id="tabla_resumen" className="table table-bordered">
                                        <thead id="fecha_dia">
                                        </thead>
                                        <thead>
                                            <tr>
                                                <th id="columna_0" scope="col">Hora</th>
                                                <th id="columna_1" scope="col">Lunes/Martes/Miercoles/Jueves/Viernes</th>
                                            </tr>
                                            {horarios.map((item, index) => (
                                                <tr key={index} >
                                                    <td><strong>{'10:10'}</strong></td>
                                                    <td className={`mod1`}><strong>Plan 1 tiempo-ciclo: {item.ciclo}s</strong>
                                                        <div className='container-resumen-fases'>
                                                            <div className='fase-resumen'>
                                                                {'G:     '}
                                                                <div className={`g-resumen r-n`}>
                                                                    G1
                                                                </div>
                                                                <div className={`g-resumen r-n`}>
                                                                    G2
                                                                </div>
                                                                <div className={`g-resumen r-n`}>
                                                                    G3
                                                                </div>
                                                                <div className={`g-resumen r-n`}>
                                                                    G4
                                                                </div>
                                                            </div>
                                                            {item.data.map((item,index)=> (
                                                                <div className='fase-resumen'>
                                                                    Paso-{index+1}
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen ${item.g1? "r-verde":"r-rojo"}`} style={{ width: factor2 + (10 * sf) }}>
                                                                        {item.g1 ? "verde":"rojo"}  {item.duracion}s
                                                                        </div>
                                                            
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen ${item.g2? "r-verde":"r-rojo"}`} style={{ width: factor2 + (10* sf) }}>
                                                                        {item.g2 ? "verde":"rojo"}    {item.duracion}s
                                                                        </div>
                                                            
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen ${item.g3? "r-verde":"r-rojo"}`} style={{ width: factor2 + (10* sf) }}>
                                                                        {item.g3 ? "verde":"rojo"}    {item.duracion}s
                                                                        </div>
                                                                   
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen ${item.g4? "r-verde":"r-rojo"}`} style={{ width: factor2 + (10* sf) }}>
                                                                        {item.g4 ? "verde":"rojo"}    {item.duracion}s
                                                                        </div>
                                                                 
                                                                    </div>
                                                                </div>
                                                                  ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                                 ))}
                                        </thead>
                                    </table>

                                </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ height: 10 }}>

                        </div>
                    </Grid>
            </Grid>
            </Container>
        </>
    );
}