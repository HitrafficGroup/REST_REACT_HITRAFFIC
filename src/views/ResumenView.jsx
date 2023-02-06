import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React, { useState,useEffect, useRef } from 'react';
import "../css/ResumenView.css";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import CalendarSemaforo from '../components/CalendarSemaforo';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomProgress from "../components/CustomProgress";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import {getAllDataIp} from "../js/apiFunctions";
import { db } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useSelector } from 'react-redux';
export default function ResumenView() {
    const controlerState = useSelector(state => state.controlers);
    const [horarios,setHorarios] = useState([]);
    const todaInformacion = useRef();
    const tiempo_amarillo = useRef();
    const datos_amarillo_aux = useRef();
    const getDataFromFirebase = async()=>{  
        console.log("do something")
    }
    const datosDePrueba = async() =>{
        console.log(controlerState.mac)
        let docRef = doc(db, "controladores", `${controlerState.mac}`);
        let document = await getDoc(docRef);
        let datos = document.data()
        let planes = datos.planes
        todaInformacion.current = datos
        
        let dias_ordenados = JSON.parse(JSON.stringify(datos.horarios.dia_ordinario))
        dias_ordenados.sort(function (a, b) {
            let a_aux = parseInt(a.horas)
            let a_aux2 = parseInt(a.minutos)
            let b_aux = parseInt(b.horas)
            let b_aux2 = parseInt(b.minutos)
            a = a_aux * 100 + a_aux2
            b = b_aux * 100 + b_aux2
            return  a - b
        })
        let dias_ordenados_filtrados = dias_ordenados.filter(item => item.mod !== 0)
        let planes_format = []
        for(let i=0; i<planes.length; i++){
            let aux = planes[i].pasos
            let fases_disponibles = []
            for(let j=0; j<aux.length;j++){
                let  aux_pasos = aux[j].fase;
                if(aux_pasos !== 0){
                    fases_disponibles.push(aux_pasos)
                }
                
            }
           planes[i]["planes_pasos"] = fases_disponibles
        }
        
        console.log(planes)
        dias_ordenados_filtrados.map((item) =>{
            let aux = planes.filter(data=> data.numPlan === `plan${item.plan}`)
          
            item['fases'] = aux[0].planes_pasos
        })
        console.log(dias_ordenados_filtrados)
        setHorarios(dias_ordenados_filtrados)
    
        
    }
    const returnModo = (data) => {
        if (data === 1) {
            return 'Tiempo Fijo'
        }
        else if (data === 2) {
            return 'Pulsante'
        }
        else if (data === 3) {
            return 'Destello'
        }
        else if (data === 4) {
            return 'Todo en Rojo'
        }
        else {
            return 'Apagado'
        }
    }
    const parametrosCorriendo = () => {
        let datos_controlador = JSON.parse(JSON.stringify(todaInformacion.current))
        let dia_ordinario = datos_controlador.horarios.dia_ordinario
        let planes = datos_controlador.planes
        let parametros_operativos = datos_controlador.otros_parametros
        tiempo_amarillo.current = parseInt(parametros_operativos.tiempo_amarillo_vehicular)
        let hora_actual = new Date();
        let horas = hora_actual.getHours();
        let minutos = hora_actual.getMinutes();
        let ultimo_horario = false
        let aux;
        let aux2;
        let temp;
        let ref;
        let nro_horario;
        let dias_ordenados = JSON.parse(JSON.stringify(dia_ordinario))
        dias_ordenados.sort(function (a, b) {
            let a_aux = parseInt(a.horas)
            let a_aux2 = parseInt(a.minutos)
            let b_aux = parseInt(b.horas)
            let b_aux2 = parseInt(b.minutos)
            a = a_aux * 100 + a_aux2
            b = b_aux * 100 + b_aux2
            return b - a
        })
        let dias_ordenados_filtrados = dias_ordenados.filter(item => item.mod !== 0)
        let nro_horario_sig = 0
        for (let i = 0; i < dias_ordenados_filtrados.length; i++) {
            aux = parseInt(dias_ordenados[i].horas)
            aux2 = parseInt(dias_ordenados[i].minutos)
            temp = aux * 100 + aux2
            ref = horas * 100 + minutos
            //console.log("ref: ",ref)
            //console.log("temp: ",temp)
            if (ref > temp) {
                if (i === 0) {
                    nro_horario = dias_ordenados[0].nro
                    nro_horario_sig = dia_ordinario[0].nro
                    ultimo_horario = true
                } else {
                    nro_horario = dias_ordenados[i].nro
                    nro_horario_sig = dias_ordenados[i - 1].nro
                    ultimo_horario = false
                }

                break
            }
            if (i === 0) {
                nro_horario = dias_ordenados[0].nro
                nro_horario_sig = dia_ordinario[0].nro
                ultimo_horario = true
            } else {
                nro_horario = dias_ordenados[0].nro
                nro_horario_sig = dias_ordenados[i].nro
                ultimo_horario = false
            }

        }


        let horario_activo = dias_ordenados.find(item => item.nro === nro_horario)
        let modo = returnModo(horario_activo.mod)
        let plan_activo = horario_activo.plan
        let planname = `plan${plan_activo}`
        let plan_filter = planes.filter(_plan => _plan.numPlan === planname)
        let pasos = plan_filter[0].pasos
        var pasos_habilitados = pasos.filter((item) => {
            if (item.duracion > 0) {
                return item;
            }
        })

        let fases = datos_controlador.fases
        var pasos_temp = pasos_habilitados
        var fases_pasos = pasos_temp.map((item) => {
            let aux2 = fases.find(_item => _item.faseNum === item.fase)
            let obj_mod = {
                duracion: item.duracion,
                fase: item.fase,
                grupos: item.grupos,
                name: item.name
            }
            let grupos_aux = aux2.grupos


            if (modo === 'Destello') {
                grupos_aux = aux2.grupos.map(item => ({
                    colorDescripcion: "amarillo",
                    faseNum: item.faseNum,
                    id: item.id,
                    grupoNum: item.grupoNum,
                    color: item.color
                }))
                obj_mod['grupos'] = grupos_aux

            } else if (modo === 'Todo en Rojo') {
                grupos_aux = aux2.grupos.map(item => ({
                    colorDescripcion: "rojo",
                    faseNum: item.faseNum,
                    id: item.id,
                    grupoNum: item.grupoNum,
                    color: item.color
                }))
                obj_mod['grupos'] = grupos_aux
            }
            else {

                obj_mod['grupos'] = grupos_aux
            }
            return obj_mod

        })
        let datos_amarillo = []

        if (tiempo_amarillo.current > 0 && modo === "Tiempo Fijo") {
            let fases_pasos_aux2 = JSON.parse(JSON.stringify(fases_pasos))
            let fases_pasos_aux = JSON.parse(JSON.stringify(fases_pasos))
            let aux_copias = fases_pasos.length * 2
            let nuevos_pasos = fases_pasos_aux.map((item) => {
                let grupos_aux = item.grupos.map(item2 => {
                    let grupo_temp = {}
                    if (item2.colorDescripcion === "rojo") {
                        grupo_temp = { faseNum: item2.faseNum, colorDescripcion: item2.colorDescripcion, color: item2.color, grupoNum: item2.grupoNum, id: item2.id }
                    } else {
                        grupo_temp = { faseNum: item2.faseNum, colorDescripcion: "amarillo", color: 2, grupoNum: item2.grupoNum, id: item2.id }
                    }
                    return grupo_temp
                })
                let paso_editado = {
                    duracion: tiempo_amarillo.current,
                    fase: item.fase,
                    grupos: grupos_aux,
                    name: item.name,
                }
                return paso_editado
            })

            let nuevos_pasos_2 = fases_pasos_aux2.map(item => (
                {
                    duracion: item.duracion - tiempo_amarillo.current,
                    fase: item.fase,
                    grupos: item.grupos,
                    name: item.name,
                }
            ))
            let index_aux = 0
            let index_aux2 = 0
            for (let i = 0; i < aux_copias; i++) {
                let aux_resi = i % 2
                if (aux_resi !== 0) {
                    datos_amarillo.push(nuevos_pasos[index_aux])
                    index_aux += 1
                } else {
                    datos_amarillo.push(nuevos_pasos_2[index_aux2])
                    index_aux2 += 1
                }
            }
            datos_amarillo.map((item, index) => (item.name = `Paso ${index + 1}`))
        }
        datos_amarillo_aux.current = datos_amarillo
        let resumen = {
            horas: horario_activo.horas,
            minutos: horario_activo.minutos,
            plan: horario_activo.plan,
            pasos: fases_pasos,
            modo: modo,
        }

    }
   
    useEffect(() => {
        getDataFromFirebase()
        
        // eslint-disable-next-line
    }, []); 
    return (
        <>
            <Container  >
                <div className='titulos-resumen'>
                    <h4>Resumen del Controlador</h4>
                </div>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                    <div>
                    <h5>Programación semanal</h5>
                    <table id="tabla_resumen" className="table table-bordered">
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
                        {horarios.map((item,index)=>(
                               <tr key={index} >
                                <td><strong>{item.horas+':'+item.minutos}</strong></td>
                                <td className={`mod${item.mod}`} >
                                <strong>Plan {item.plan}</strong>
                                <div style={{display:"flex"}}>
                                Fase:{item.fases.map(item=> (
                                    <p style={{marginLeft:4}}>
                                        {item}
                                    </p>
                                ))}
                                    </div>
                                </td>
                                <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div style={{display:"flex"}}>
                                Fase:{item.fases.map(item=> (
                                    <p style={{marginLeft:4}}>
                                        {item}
                                    </p>
                                ))}
                                    </div>
                                </td>
                                <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div style={{display:"flex"}}>
                                Fase:{item.fases.map(item=> (
                                    <p style={{marginLeft:4}}>
                                        {item}
                                    </p>
                                ))}
                                    </div>
                                </td>
                                <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div style={{display:"flex"}}>
                                Fase:{item.fases.map(item=> (
                                    <p style={{marginLeft:4}}>
                                        {item}
                                    </p>
                                ))}
                                    </div>
                                </td>
                                <td className={`mod${item.mod}`}><strong>Plan {item.plan}</strong>
                                <div style={{display:"flex"}}>
                                Fase:{item.fases.map(item=> (
                                    <p style={{marginLeft:4}}>
                                        {item}
                                    </p>
                                ))}
                                    </div>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>

                            ))
                        }
                 
                        </thead>
                        
                    </table>

                </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className='contenedor-modos'>
                           <div className='disposicion'>
                                <p style={{margin:0}}>Modo Tiempo Fijo: </p> <div className='fijo'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Modo Pulsante: </p> <div className='pulsante'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Modo Destello: </p> <div className='destello'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Modo Todo en Rojo: </p> <div className='rojo'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Apagado: </p> <div className='apagado'></div>
                            </div> 
                        </div>
                    </Grid>
                    
                    <Grid item xs={12}>   
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
                    <Grid item xs={12}>   
                        <Button variant="outlined" onClick={datosDePrueba} startIcon={<DeleteIcon />}>
                            LEER DATOS
                        </Button>
                    </Grid>
            
                    
                    <Grid item xs={12}>   
                        <div style={{height:70}}>
                            
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </>
    );

}