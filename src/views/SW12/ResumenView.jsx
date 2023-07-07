
import CardController from "../../components/CardController";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React, { useState, useRef } from 'react';
import "../../css/ResumenView.css";

import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';

import { db } from "../../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function ResumenView() {
    const controlerState = useSelector(state => state.controlers);
    const [horarios, setHorarios] = useState([]);
    const [horariosFinSemana, setHorariosFinSemana] = useState([]);
    const [horariosFestivo, setHorariosFestivo] = useState([]);

    const todaInformacion = useRef();
    const [value, setValue] = useState('1');
    const amarillo = useRef(0);
    const factor2 = 10
    const sf = 8.5
    const datosDePrueba = async () => {

        let docRef = doc(db, "controladores", `${controlerState.id}`);
        let document = await getDoc(docRef);
        todaInformacion.current = document.data()
        let horarios_ordinarios = calcularHorarios(todaInformacion.current.horario_ordinario)
        let horarios_fin_semana = calcularHorarios(todaInformacion.current.horario_finsemana)
        let horarios_festivos = calcularHorarios(todaInformacion.current.horario_festivo)
        setHorarios(horarios_ordinarios)
        setHorariosFinSemana(horarios_fin_semana)
        setHorariosFestivo(horarios_festivos)
    }


    const calcularHorarios = (horario) => {
        let datos = JSON.parse(JSON.stringify(todaInformacion.current))
        let fases = datos.fases
        let o_parametros = datos.otros_parametros
        let dias_ordenados = JSON.parse(JSON.stringify(horario))
        let t_amarillo = o_parametros.tiempo_amarillo_vehicular
        amarillo.current = t_amarillo
        dias_ordenados.sort(function (a, b) {
            let a_aux = parseInt(a.horas)
            let a_aux2 = parseInt(a.minutos)
            let b_aux = parseInt(b.horas)
            let b_aux2 = parseInt(b.minutos)
            a = a_aux * 100 + a_aux2
            b = b_aux * 100 + b_aux2
            return a - b
        })
        let dias_ordenados_filtrados = dias_ordenados.filter(item => item.mod !== 0)
        dias_ordenados_filtrados.forEach(item => {
            let plan_activo = datos[`plan_${item.plan}`]
            let pasos = plan_activo.filter(item => item.duracion !== 0)
            pasos.map(element => {
                let fase = fases.find(item => item.faseNum === element.fase)
                element.grupos = fase.grupos
            })
            let aux_pasos = []
            if (item.mod_descriptor === "Tiempo Fijo") {
                for (let i = 0; i < pasos.length; i++) {
                    if (i < pasos.length - 1) {

                        fase_amarilla.duracion = t_amarillo
                        aux_pasos.push(pasos[i])
                        aux_pasos.push(fase_amarilla)
                    }
                    else {
                        aux_pasos.push(pasos[i])
                    }
                }
                item.fases_grupo = aux_pasos
            }else if(item.mod_descriptor === "Todo en Rojo"){
                item.fases_grupo = [todo_rojo]
            }else if(item.mod_descriptor === "Destello"){
                item.fases_grupo = [destello]
            }
            else {

                item.fases_grupo = pasos
            }
        });

        console.log(dias_ordenados_filtrados)
        return dias_ordenados_filtrados


    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Container maxWidth="md" >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <div className='titulos-resumen'>
                            <h4>Resumen del Controlador</h4>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Button variant="contained" color='verde2' fullWidth onClick={datosDePrueba} startIcon={<CloudIcon />}>
                            LEER DATOS
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Dias Ordinario" value="1" />
                                    <Tab label="Fines de Semana" value="2" />
                                    <Tab label="Dias Festivos" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
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
                                                    <td><strong>{item.horas + ':' + item.minutos}</strong></td>
                                                    <td className={`mod${item.mod}`}><strong>Plan {item.plan} tiempo-ciclo: 45s</strong>
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
                                                            {item.fases_grupo.map((item, index) => (
                                                                <div key={index} className='fase-resumen'>
                                                                    F{item.fase}
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{ width: factor2 + (item.duracion * sf) }}>
                                                                            {item.grupos[0].colorDescripcion}  {item.duracion}s
                                                                        </div>
                                                            
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{ width: factor2 + (item.duracion * sf) }}>
                                                                            {item.grupos[1].colorDescripcion}  {item.duracion}s
                                                                        </div>
                                                            
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{ width: factor2 + (item.duracion * sf) }}>
                                                                            {item.grupos[2].colorDescripcion}  {item.duracion}s
                                                                        </div>
                                                                   
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{ width: factor2 + (item.duracion * sf) }}>
                                                                            {item.grupos[3].colorDescripcion}  {item.duracion}s
                                                                        </div>
                                                                 
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    {/* <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div className='container-resumen-fases'>
                                <div className='fase-resumen'>
                                        {'G:'+'  '}
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
                                    {item.fases_grupo.map((item,index)=> (
                                   <div key={index} className='fase-resumen'>
                                        F{item.faseNum}
                                        <div style={{display:'flex'}}>
                                            <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                {item.grupos[0].colorDescripcion}  {item.duracion}s
                                            </div>
                                            <div className={`g-r-${item.grupos[0].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[1].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >

                                        </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[2].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[2].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[3].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >
                                                    
                                                </div>
                                        </div>
                                    </div>
                                ))}
                                    </div>
                                </td> */}
                                                    {/* <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div className='container-resumen-fases'>
                                <div className='fase-resumen'>
                                        {'G:'+'  '}
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
                                    {item.fases_grupo.map((item,index)=> (
                                   <div key={index} className='fase-resumen'>
                                        F{item.faseNum}
                                        <div style={{display:'flex'}}>
                                            <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                {item.grupos[0].colorDescripcion}  {item.duracion}s
                                            </div>
                                            <div className={`g-r-${item.grupos[0].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[1].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >

                                        </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[2].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[2].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[3].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >
                                                    
                                                </div>
                                        </div>
                                    </div>
                                ))}
                                    </div>
                                </td> */}
                                                    {/* <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div className='container-resumen-fases'>
                                <div className='fase-resumen'>
                                        {'G:'+'  '}
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
                                    {item.fases_grupo.map((item,index)=> (
                                   <div key={index} className='fase-resumen'>
                                        F{item.faseNum}
                                        <div style={{display:'flex'}}>
                                            <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                {item.grupos[0].colorDescripcion}  {item.duracion}s
                                            </div>
                                            <div className={`g-r-${item.grupos[0].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[1].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >

                                        </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[2].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[2].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[3].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >
                                                    
                                                </div>
                                        </div>
                                    </div>
                                ))}
                                    </div>
                                </td>
                                <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div className='container-resumen-fases'>
                                <div className='fase-resumen'>
                                        {'G:'+'  '}
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
                                    {item.fases_grupo.map((item,index)=> (
                                   <div key={index} className='fase-resumen'>
                                        F{item.faseNum}
                                        <div style={{display:'flex'}}>
                                            <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                {item.grupos[0].colorDescripcion}  {item.duracion}s
                                            </div>
                                            <div className={`g-r-${item.grupos[0].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[1].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >

                                        </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[2].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[2].colorDescripcion}`} >

                                            </div>
                                        </div>
                                        <div style={{display:'flex'}}>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                            {item.grupos[3].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-r-${item.grupos[1].colorDescripcion}`} >
                                                    
                                                </div>
                                        </div>
                                    </div>
                                ))}
                                    </div>
                                </td> */}

                                                </tr>
                                            ))
                                            }
                                        </thead>
                                    </table>

                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <div className='tabla-resumen'>
                                    <h5>Fines de Semana</h5>
                                    <table id="tabla_resumen" className="table table-bordered">
                                        <thead id="fecha_dia">
                                        </thead>
                                        <thead>
                                            <tr>
                                                <th id="columna_0" scope="col">Hora</th>
                                                <th id="columna_1" scope="col">Sabado/Domingo</th>
                                                {/* <th id = "columna_2" scope="col">Domingo</th> */}


                                            </tr>
                                            {horariosFinSemana.map((item, index) => (
                                                <tr key={index} >
                                                    <td><strong>{item.horas + ':' + item.minutos}</strong></td>
                                                    <td className={`mod${item.mod}`}>
                                                        <strong>Plan {item.plan}</strong><p> <strong>tiempo total del ciclo:</strong> {item.duracion_ciclo} <strong>tiempo en amarillo:</strong> {amarillo.current}s</p>
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
                                                                                        {item.fases_grupo.map((item,index)=> (
                                                            <div key={index} className='fase-resumen'>
                                                                    F{item.fase}
                                                                    <div style={{display:'flex'}}>
                                                                        <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                                            {item.grupos[0].colorDescripcion}  {item.duracion}s
                                                                        </div>
                                                                   
                                                                    </div>
                                                                    <div style={{display:'flex'}}>
                                                                    <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                                        {item.grupos[1].colorDescripcion} 
                                                                            <div>
                                                                            {item.duracion}s
                                                                            </div>
                                                                    </div>
                                                              
                                                                    </div>
                                                                    <div style={{display:'flex'}}>
                                                                    <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                                        {item.grupos[2].colorDescripcion}  {item.duracion}s
                                                                    </div>
                                                               
                                                                    </div>
                                                                    <div style={{display:'flex'}}>
                                                                    <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                                        {item.grupos[3].colorDescripcion}  {item.duracion}s
                                                                    </div>
                                                                
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                  
                                                </tr>
                                            ))
                                            }
                                        </thead>
                                    </table>
                                </div>
                            </TabPanel>
                            <TabPanel value="3">
                                <div className='tabla-resumen'>
                                    <h5>Dias Festivos</h5>
                                    <table id="tabla_resumen" className="table table-bordered">
                                        <thead id="fecha_dia">
                                        </thead>
                                        <thead>
                                            <tr>
                                                <th id="columna_0" scope="col">Hora</th>
                                                <th id="columna_1" scope="col">Dia Festivo</th>
                                            </tr>
                                            {horariosFestivo.map((item, index) => (
                                                <tr key={index} >
                                                    <td><strong>{item.horas + ':' + item.minutos}</strong></td>
                                                    <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
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
                                                                                {item.fases_grupo.map((item,index)=> (
                                                        <div key={index} className='fase-resumen'>
                                                            F{item.fase}
                                                            <div className={`g-resumen  r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                            {item.grupos[0].colorDescripcion}  {item.duracion}s
                                                            </div>
                                                            <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                            {item.grupos[1].colorDescripcion}  {item.duracion}s
                                                            </div>
                                                            <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                            {item.grupos[2].colorDescripcion}  {item.duracion}s
                                                            </div>
                                                            <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                                            {item.grupos[3].colorDescripcion}  {item.duracion}s
                                                            </div>
                                                        </div>
                                                    ))}
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))
                                            }
                                        </thead>
                                    </table>
                                </div>


                            </TabPanel>
                        </TabContext>
                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                    <Grid item xs={12}>
                        <div className='contenedor-modos'>
                            <div className='disposicion'>
                                <p style={{ margin: 0 }}>Tiempo Fijo: </p> <div className='fijo-r'></div>
                            </div>
                            <div className='disposicion'>
                                <p style={{ margin: 0 }}>Pulsante: </p> <div className='pulsante-r'></div>
                            </div>
                            <div className='disposicion'>
                                <p style={{ margin: 0 }}>Destello: </p> <div className='destello-r'></div>
                            </div>
                            <div className='disposicion'>
                                <p style={{ margin: 0 }}>Todo en Rojo: </p> <div className='rojo-r'></div>
                            </div>
                            <div className='disposicion'>
                                <p style={{ margin: 0 }}>Apagado: </p> <div className='apagado-r'></div>
                            </div>
                        </div>
                    </Grid>

                    {/* <Grid item xs={12}>   
                        <h5> Fases en Ejecucion</h5>
                    </Grid>
                    <Grid item xs={12}> 
                    <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Paso</Th>
                                    <Th className='home-t-th'>Duracion</Th>
                                    <Th className='home-t-th'>Fase</Th>
                                    <Th className='home-t-th'>Grupos</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {controlerState.pasos_activos.map((dato, index) => (
                                    <Tr className={"tablas-focus"} key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td >
                                            {dato.name}
                                        </Td>
                                        <Td >
                                            {dato.duracion}
                                        </Td>
                                        <Td >
                                            {dato.fase}
                                        </Td>
                                        <Td className='home-t-th' >
                                            <Table>
                                                <Thead>
                                                    <Tr>
                                                        <Th>G1</Th>
                                                        <Th>G2</Th>
                                                        <Th>G3</Th>
                                                        <Th>G4</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    <Tr >
                                                        <Td> <Chip label={dato.grupos[0].colorDescripcion} sx={{ width: 110, marginRight: 1 }} color={dato.grupos[0].colorDescripcion} /></Td>
                                                        <Td> <Chip label={dato.grupos[1].colorDescripcion} sx={{ width: 110, marginRight: 1 }} color={dato.grupos[1].colorDescripcion} /></Td>
                                                        <Td> <Chip label={dato.grupos[2].colorDescripcion} sx={{ width: 110, marginRight: 1 }} color={dato.grupos[2].colorDescripcion} /></Td>
                                                        <Td> <Chip label={dato.grupos[3].colorDescripcion} sx={{ width: 110, marginRight: 1 }} color={dato.grupos[3].colorDescripcion} /></Td>
                                                    </Tr>
                                                </Tbody>
                                            </Table>
                                        </Td>

                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    */}




                    <Grid item xs={12}>
                        <div style={{ height: 10 }}>

                        </div>
                    </Grid>
                </Grid>
            </Container>
            <CardController />
        </>
    );

}
const fase_amarilla = {
    duracion: 4,
    faseNum: 'A',
    grupos: [
        { id: 'g1_fase_6', grupoNum: 1, color: 0, faseNum: 6, colorDescripcion: '' },
        { id: 'g2_fase_6', grupoNum: 2, color: 1, faseNum: 6, colorDescripcion: '' },
        { id: 'g3_fase_6', grupoNum: 3, color: 0, faseNum: 6, colorDescripcion: '' },
        { id: 'g4_fase_6', grupoNum: 4, color: 1, faseNum: 6, colorDescripcion: '' }
    ]
}


const destello = {
    duracion: 40,
    faseNum: 'A',
    grupos: [
        { id: 'g1_fase_6', grupoNum: 1, color: 0, faseNum: 6, colorDescripcion: 'amarillo' },
        { id: 'g2_fase_6', grupoNum: 2, color: 1, faseNum: 6, colorDescripcion: 'amarillo' },
        { id: 'g3_fase_6', grupoNum: 3, color: 0, faseNum: 6, colorDescripcion: 'amarillo' },
        { id: 'g4_fase_6', grupoNum: 4, color: 1, faseNum: 6, colorDescripcion: 'amarillo' }
    ]
}
const todo_rojo = {
    duracion: 40,
    faseNum: 'A',
    grupos: [
        { id: 'g1_fase_6', grupoNum: 1, color: 0, faseNum: 6, colorDescripcion: 'rojo' },
        { id: 'g2_fase_6', grupoNum: 2, color: 1, faseNum: 6, colorDescripcion: 'rojo' },
        { id: 'g3_fase_6', grupoNum: 3, color: 0, faseNum: 6, colorDescripcion: 'rojo' },
        { id: 'g4_fase_6', grupoNum: 4, color: 1, faseNum: 6, colorDescripcion: 'rojo' }
    ]
}
const apagado = {
    duracion: 4,
    faseNum: 'A',
    grupos: [
        { id: 'g1_fase_6', grupoNum: 1, color: 0, faseNum: 6, colorDescripcion: '' },
        { id: 'g2_fase_6', grupoNum: 2, color: 1, faseNum: 6, colorDescripcion: '' },
        { id: 'g3_fase_6', grupoNum: 3, color: 0, faseNum: 6, colorDescripcion: '' },
        { id: 'g4_fase_6', grupoNum: 4, color: 1, faseNum: 6, colorDescripcion: '' }
    ]
}