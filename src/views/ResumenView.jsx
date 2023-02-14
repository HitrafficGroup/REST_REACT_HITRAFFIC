import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React, { useState,useEffect, useRef } from 'react';
import "../css/ResumenView.css";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import {getAllDataIp} from "../js/apiFunctions";
import { db } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function ResumenView() {
    const controlerState = useSelector(state => state.controlers);
    const [horarios,setHorarios] = useState([]);
    const todaInformacion = useRef();
    const [value, setValue] = useState('1');
    const tiempo_amarillo = useRef();
    const datos_amarillo_aux = useRef();
    const factor2 = 10
    const sf = 8.5
    const datosDePrueba = async() =>{
        
        let docRef = doc(db, "controladores", `${controlerState.mac}`);
        let document = await getDoc(docRef);
        let datos = document.data()
        let planes = datos.planes
        let fases = datos.fases
        let o_parametros = datos.otros_parametros
        console.log(o_parametros)
        fase_amarilla.duracion = o_parametros.tiempo_amarillo_vehicular

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
        let plan_aux = JSON.parse(JSON.stringify(planes))
        let dias_ordenados_filtrados = dias_ordenados.filter(item => item.mod !== 0)
        for(let i=0; i<planes.length; i++){
            let aux = plan_aux[i].pasos
            let fases_disponibles = []
            for(let j=0; j<aux.length;j++){
                let  aux_pasos = aux[j].fase;
                let aux_duracion = aux[j].duracion
                if(aux_pasos !== 0){
                    fases_disponibles.push(
                        {fase:aux_pasos,
                        duracion:aux_duracion})
                }
                
            }
            plan_aux[i]["planes_pasos"] = fases_disponibles
        }
        
        dias_ordenados_filtrados.map((item) =>{
            let aux = plan_aux.filter(data=> data.numPlan === `plan${item.plan}`)
            
            item['fases'] = aux[0].planes_pasos
        })
        let aux_5 = JSON.parse(JSON.stringify(dias_ordenados_filtrados))
        
        aux_5.map(item =>{
            let aux_fases = item.fases.map(item =>
                (fases.filter(fase=> {
                   if( fase.faseNum === item.fase){
                    return fase
                   }
                    
                })[0])
            )
            
            
            item['fases_grupo'] = aux_fases
            
        })

        //aqui agregamos la duracion de cada fase
        for(let i = 0;i<aux_5.length;i++){
            let fases_temp = aux_5[i].fases // estas son las fases que contienen la duracion
            //console.log(fases_temp)
            let data_modified = aux_5[i].fases_grupo.map(element => {
                let duracion_aux = fases_temp.filter(temp=> temp.fase === element.faseNum)[0].duracion
             
                let n_objet = {
                    duracion: duracion_aux,
                    faseNum: element.faseNum,
                    grupos: element.grupos
                }
                return n_objet
            });
            //console.log(data_modified)
            aux_5[i].fases_grupo = data_modified

      
        //  console.log(aux_5[i])
        }
        for(let i = 0;i<aux_5.length;i++){
            let aux_data = []
            let temp = aux_5[i].fases_grupo
      
            for(let j = 0;j<temp.length;j++){
                let fase_aux = temp[j]
                aux_data.push(fase_aux)
                if(j !== temp.length-1){
                    aux_data.push(fase_amarilla)
                }
            }
            aux_5[i].fases_grupo = aux_data
        }

        console.log('con fases amarillas: ',aux_5)
        setHorarios(aux_5)
    
        
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <>
            <Container  >
             
                <Grid container spacing={1}>
                <Grid item xs={12}>
                <div className='titulos-resumen'>
                    <h4>Resumen del Controlador</h4>
                </div>
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
                            <th id = "columna_0" scope="col">Hora</th>
                            <th id = "columna_1" scope="col">Lunes</th>
                            <th id = "columna_2" scope="col">Martes</th>
                            <th id = "columna_3" scope="col">Miercoles</th>
                            <th id = "columna_4" scope="col">Jueves</th>
                            <th id = "columna_5" scope="col">Viernes</th>
                         
                        </tr>
                        {horarios.map((item,index)=>(
                               <tr key={index} >
                                <td><strong>{item.horas+':'+item.minutos}</strong></td>
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
                                        <div className={`g-resumen  r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[0].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[1].colorDescripcion} {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[2].colorDescripcion} {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[3].colorDescripcion} {item.duracion}s
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
                                        <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
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
                                        <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
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
                                        <div className={`g-resumen r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
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
                    <TabPanel value="2">
                    <div className='tabla-resumen'>
                    <h5>Fines de Semana</h5>
                    <table id="tabla_resumen" className="table table-bordered">
                        <thead id="fecha_dia">
                        </thead>
                        <thead>
                        <tr>
                            <th id = "columna_0" scope="col">Hora</th>
                            <th id = "columna_1" scope="col">Sabado</th>
                            <th id = "columna_2" scope="col">Domingo</th>
                        
                         
                        </tr>
                        {horarios.map((item,index)=>(
                               <tr key={index} >
                                <td><strong>{item.horas+':'+item.minutos}</strong></td>
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
                                        <div className={`g-resumen  r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[0].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[1].colorDescripcion} {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[2].colorDescripcion} {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[3].colorDescripcion} {item.duracion}s
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
                            <th id = "columna_0" scope="col">Hora</th>
                            <th id = "columna_1" scope="col">Sabado</th>
                            <th id = "columna_2" scope="col">Domingo</th>
                        
                         
                        </tr>
                        {horarios.map((item,index)=>(
                               <tr key={index} >
                                <td><strong>{item.horas+':'+item.minutos}</strong></td>
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
                                        <div className={`g-resumen  r-${item.grupos[0].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[0].colorDescripcion}  {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[1].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[1].colorDescripcion} {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[2].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[2].colorDescripcion} {item.duracion}s
                                        </div>
                                        <div className={`g-resumen r-${item.grupos[3].colorDescripcion}`} style={{width:factor2+(item.duracion*sf)}}>
                                        {item.grupos[3].colorDescripcion} {item.duracion}s
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
                                <p style={{margin:0}}>Modo Tiempo Fijo: </p> <div className='fijo-r'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Modo Pulsante: </p> <div className='pulsante-r'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Modo Destello: </p> <div className='destello-r'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Modo Todo en Rojo: </p> <div className='rojo-r'></div>
                            </div> 
                            <div className='disposicion'>
                                <p style={{margin:0}}>Apagado: </p> <div className='apagado-r'></div>
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
                    <Grid item xs={12} md={4} >   
                        <Button variant="outlined" color='verde2' fullWidth onClick={datosDePrueba} startIcon={<CloudIcon />}>
                            LEER DATOS
                        </Button>
                    </Grid>
                
            
                    
                    <Grid item xs={12}>   
                        <div style={{height:10}}>
                            
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </>
    );

}
const fase_amarilla = { 
duracion: 4,
faseNum:'A',
grupos:[
{id: 'g1_fase_6', grupoNum: 1, color: 0, faseNum: 6, colorDescripcion: ''},
{id: 'g2_fase_6', grupoNum: 2, color: 1, faseNum: 6, colorDescripcion: ''},
{id: 'g3_fase_6', grupoNum: 3, color: 0, faseNum: 6, colorDescripcion: ''},
{id: 'g4_fase_6', grupoNum: 4, color: 1, faseNum: 6, colorDescripcion: ''}
]
}