import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { collection, updateDoc, onSnapshot, doc, getDocs, setDoc } from "firebase/firestore";
import CardUniversal from '../components/CardUniversal';
import { db } from "../firebase/firebase-config";
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import Fab from '@mui/material/Fab';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { getFasesFromRestApi, postFasesFromRestApi } from '../js/apiFunctions'
import { updateFasesSamplingTime, getCheckDataFases } from '../js/gestionSolicitudes';
import "../css/MapaUniversalView.css";
import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import '../css/FasesView.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


export default function MapaUniversalView() {
    const [semaforos, setSemaforos] = useState([]);
    const [controladores,setControladores] = useState([]);
    const [play,setPlay] = useState(false)
    const getData = async () => {
        console.log("trayendo datos")
        let items_db = []
        let semaforos_aux = [];
        const querySnapshot = await getDocs(collection(db, "controladores"));
        querySnapshot.forEach((doc) => {
            items_db.push(doc.data());
        });
        for (let i = 0; i < items_db.length; i++) {
            let temp = items_db[i].resumen
            for (let j = 0; j < temp.length; j++) {
                let obj_semaforo = JSON.parse(JSON.stringify(temp[j]))
                obj_semaforo.icon = semaforo
                obj_semaforo["mac"] = items_db[i].mac
                semaforos_aux.push(obj_semaforo)
                
            }
        }
        
        setSemaforos(semaforos_aux)
        console.log(semaforos_aux)
        setControladores(items_db)

    }
    const botonPlay = ()=>{
        parametrosCorriendo()
        setPlay(!play)
        console.log(play)
    }
    
    
    // const iniciarAnimacion = () =>{
    //     let g1;
    //     let g2;
    //     let g3;
    //     let g4;
    //     let dataUpdated;
    //     let aux;
   
    //     if(modoControlador.current ===  'Destello' ){
            
    //         if(timer1.current > 1){
    //             g1 = amarillo
    //             g2 = amarillo
    //             g3 = amarillo
    //             g4 = amarillo
    //             timer1.current = 0
              
    //         }else{
    //             g1 = apagado
    //             g2 = apagado
    //             g3 = apagado
    //             g4 = apagado
          
    //         }
    //         setFaseexec(1)
    //         setPasoexec('Paso 2')
    //         aux = semaforos2.current
    //         dataUpdated = aux.map((item) => {
    //                         if (item.grupo === "g1") {
    //                             item['icon'] = g1;
    //                         } else if (item.grupo === "g2") {
    //                             item['icon'] = g2;
    //                         } else if (item.grupo === "g3") {
    //                             item['icon'] = g3;
    //                         } else if (item.grupo === "g4") {
    //                             item['icon'] = g4;
    //                         }
    //                         return item
    //                     })
    //         setSemaforos(dataUpdated);
            
    //     }else if(modoControlador.current ===  'Todo en Rojo'){
    //         if(timer1.current > 1){
               
    //             timer1.current = 0
              
    //         }
    //         g1 = rojo
    //         g2 = rojo
    //         g3 = rojo
    //         g4 = rojo
    //         setFaseexec(1)
    //         setPasoexec('Paso 2')
    //         aux = semaforos2.current
    //         dataUpdated = aux.map((item) => {
    //                         if (item.grupo === "g1") {
    //                             item['icon'] = g1;
    //                         } else if (item.grupo === "g2") {
    //                             item['icon'] = g2;
    //                         } else if (item.grupo === "g3") {
    //                             item['icon'] = g3;
    //                         } else if (item.grupo === "g4") {
    //                             item['icon'] = g4;
    //                         }
    //                         return item
    //                     })
    //         setSemaforos(dataUpdated);
            
    //     }
    //     else{

    //         g1 = devolverColor(faseActual.current[timer2.current].grupos[0].colorDescripcion);
    //         g2 = devolverColor(faseActual.current[timer2.current].grupos[1].colorDescripcion);
    //         g3 = devolverColor(faseActual.current[timer2.current].grupos[2].colorDescripcion);
    //         g4 = devolverColor(faseActual.current[timer2.current].grupos[3].colorDescripcion);
    //         aux = semaforos2.current
    //         setFaseexec(faseActual.current[timer2.current].fase)
    //         setPasoexec(faseActual.current[timer2.current].name)
    //         dataUpdated = aux.map((item) => {
    //                         if (item.grupo === "g1") {
    //                             item['icon'] = g1;
    //                         } else if (item.grupo === "g2") {
    //                             item['icon'] = g2;
    //                         } else if (item.grupo === "g3") {
    //                             item['icon'] = g3;
    //                         } else if (item.grupo === "g4") {
    //                             item['icon'] = g4;
    //                         }
    //                         return item
    //                     })
    //         setSemaforos(dataUpdated);
    //         if(timer1.current >= faseActual.current[timer2.current].duracion){
    //             timer2.current= timer2.current + 1
    //             if(timer2.current === faseActual.current.length){
    //                 timer2.current = 0
    //             }
    //             timer1.current = 0     
    //         }
    //     }
    // }
    const parametrosCorriendo = () => {
        let controladores_aux = JSON.parse(JSON.stringify(controladores))

        for(let i = 0;i<controladores_aux.length;i++){
        let dia_ordinario = controladores_aux[i].horarios.dia_ordinario;
        let planes = controladores_aux[i].planes
        // let planes = todaInformacion.current.planes
        // let hora_actual = new Date();
        // let horas = hora_actual.getHours();
        // let minutos = hora_actual.getMinutes();
        // let aux;
        // let aux2;
        // let temp;
        // let ref;
        // let plan;
        // let nro_horario;
            console.log(planes)
    
    //     let dias_ordenados = dia_ordinario.slice()
    //     dias_ordenados.sort(function(a,b){
    //         let a_aux = parseInt(a.horas)
    //         let a_aux2 = parseInt(a.minutos)
    //         let b_aux = parseInt(b.horas)
    //         let b_aux2 = parseInt(b.minutos)
    //         a = a_aux*100 + a_aux2
    //         b = b_aux*100 + b_aux2
    //         return b-a
    //     })
    //     console.log(dias_ordenados)
    //     for(let i=0;i<dias_ordenados.length;i++) {
    //          aux = parseInt(dias_ordenados[i].horas)
    //          aux2 = parseInt(dias_ordenados[i].minutos)
    //          temp = aux*100 + aux2
    //          ref = horas*100 + minutos
    //          //console.log("tiempo controlador: ",temp)
    //          //console.log("tiempo referencia: ",ref)
    //         if(ref > temp){
    //             nro_horario = dias_ordenados[i].nro
    //             //console.log("plan obtenido: ",plan)
    //             break
    //         }
            
    //         }

        
    //     let horario_activo = dias_ordenados.find(item => item.nro === nro_horario)
    //     console.log("horario filtrado: ",horario_activo)
    //     setHorarioexec(horario_activo);
    //     let modo = returnModo(horario_activo.mod)
    //     setModoexec(modo)
    //     modoControlador.current = modo
    //     let plan_activo = horario_activo.plan
    //     let planname = `plan${plan_activo}`
    //     let plan_filter = planes.filter(_plan => _plan.numPlan === planname)
    //     let pasos = plan_filter[0].pasos
    //     var pasos_habilitados = pasos.filter((item) => {
    //         if (item.duracion > 0) {
    //             return item;
    //         }
    //     })
       
    //     let fases = todaInformacion.current.fases.slice()

    //     var pasos_temp = pasos_habilitados
    //     var fases_pasos = pasos_temp.map((item) =>{
    //         let aux2 = fases.find(_item => _item.faseNum === item.fase)
    //         let obj_mod = {
    //             duracion: item.duracion,
    //             fase: item.fase,
    //             grupos: item.grupos,
    //             name: item.name
    //         }
    //         let grupos_aux = aux2.grupos
    
        
    //         if(modo === 'Destello'){
    //             grupos_aux  = aux2.grupos.map(item=>({
    //                 colorDescripcion:"amarillo",
    //                 faseNum:item.faseNum,
    //                 id:item.id,
    //                 grupoNum:item.grupoNum,
    //                 color:item.color
    //             }))
    //             obj_mod['grupos'] = grupos_aux
            
    //         }else if(modo === 'Todo en Rojo'){
    //             grupos_aux  = aux2.grupos.map(item=>({
    //                 colorDescripcion:"rojo",
    //                 faseNum:item.faseNum,
    //                 id:item.id,
    //                 grupoNum:item.grupoNum,
    //                 color:item.color
    //             }))
    //             obj_mod['grupos'] = grupos_aux
    //         }
    //         else{
                
    //             obj_mod['grupos'] = grupos_aux
    //         }
    //         return obj_mod
            
    // })
    
    //     let resumen ={
    //         horas: horario_activo.horas,
    //         minutos: horario_activo.minutos,
    //         plan: horario_activo.plan,
    //         pasos:fases_pasos,
    //         modo: modo,
    //     }
    //     //dispatch(setResumen(resumen));

    //     let auxg1;
    //     let auxg2;
    //     let auxg3;
    //     let auxg4;
    //     let objg1 = {verde:0,rojo:0}
    //     let objg2 = {verde:0,rojo:0}
    //     let objg3 = {verde:0,rojo:0}
    //     let objg4 = {verde:0,rojo:0}
        
    //     for(let i1 = 0 ;i1 < pasos_habilitados.length;i1++){
    //         auxg1 = fases_pasos[i1].grupos[0].color
    //         auxg2 = fases_pasos[i1].grupos[1].color
    //         auxg3 = fases_pasos[i1].grupos[2].color
    //         auxg4 = fases_pasos[i1].grupos[3].color
    //         if(auxg1 === 1){
    //             objg1.verde = objg1.verde + fases_pasos[i1].duracion
    //         }else{
    //             objg1.rojo = objg1.rojo + fases_pasos[i1].duracion 
    //         }
    //         if(auxg2 === 1){
    //             objg2.verde = objg2.verde + fases_pasos[i1].duracion
    //         }else{
    //             objg2.rojo = objg2.rojo + fases_pasos[i1].duracion 
    //         }
    //         if(auxg3 === 1){
    //             objg3.verde = objg3.verde + fases_pasos[i1].duracion
    //         }else{
    //             objg3.rojo = objg3.rojo + fases_pasos[i1].duracion 
    //         }
    //         if(auxg4 === 1){
    //             objg4.verde = objg4.verde + fases_pasos[i1].duracion
    //         }else{
    //             objg4.rojo = objg4.rojo + fases_pasos[i1].duracion 
    //         }
    //     }
    //     var ejemplo = semaforos2.current.slice()
    //     var t_amarillo = allInfo.current.otros_parametros.tiempo_amarillo_vehicular

    //     var newDataUpdate = ejemplo.map((item) =>{
    //         if(item.grupo === 'g1'){
    //             item['rojo'] = objg1.rojo
    //             item['verde'] = objg1.verde
    //             item['amarillo'] = t_amarillo
    //             item['modo'] = modo
    //         }else if(item.grupo === 'g2'){
    //             item['rojo'] = objg2.rojo
    //             item['verde'] = objg2.verde
    //             item['amarillo'] = t_amarillo
    //             item['modo'] = modo
    //         }else if(item.grupo === 'g3'){
    //             item['rojo'] = objg3.rojo
    //             item['verde'] = objg3.verde
    //             item['amarillo'] = t_amarillo
    //             item['modo'] = modo
    //         }else{
    //             item['rojo'] = objg4.rojo
    //             item['verde'] = objg4.verde
    //             item['amarillo'] = t_amarillo
    //             item['modo'] = modo
    //         }
    //        //item['icon'] = {}
    //         return item
    //     })
     
    //     setSemaforos3(newDataUpdate)

      
    //     timer1.current = 0

    //     dispatch(setPasosActivos(fases_pasos));
    //     //setPasosActivos(fases_pasos)
    //     faseActual.current = fases_pasos

    //     //setSemaforo()
       
     }
    }

    const iniciarSimulacion =() =>{
        let icon; 
        let aux_semaforos = JSON.parse(JSON.stringify(semaforos))
        if(play){
            console.log("empieza las simulaciones")
            icon = verde
        }else{
            icon = rojo
        }
        for(let i = 0;i<aux_semaforos.length;i++){
            let temp = aux_semaforos[i]
            temp.icon = icon
        }
        setSemaforos(aux_semaforos)
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            {/* <Container maxWidth="lg" > */}
            <div >
                <MapContainer center={[-2.9002025261800206, -78.99967753716173]} zoom={14} scrollWheelZoom={false} className={"leaflet-container-2"}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {semaforos.map((item, index) => (

                        <Marker position={item.position} key={index} icon={item.icon} >
                            <Popup>
                                Semaforo {item.nombre} - Grupo: {item.grupo}
                            </Popup>
                        </Marker>
                    ))}
                    <Fab color="primary" variant="extended" sx={{ position: "absolute", bottom: 50, right: 70 }} disabled={!play}  onClick={botonPlay} >
                        <PauseCircleOutlineIcon sx={{mr:1}} />
                        Pause
                    </Fab>
                    <Fab color="secondary" variant="extended" sx={{ position: "absolute", bottom: 50, right: 200 }} disabled={play}  onClick={botonPlay} >
                        <PlayCircleOutlineIcon sx={{mr:1}} />
                        Play
                    </Fab>
                    <CardUniversal/>
                </MapContainer>
            </div>
            {/* </Container> */}

        </>
    );

}


const semaforo = new L.Icon({
    iconUrl: require('../assets/semaforo3.png'),
    iconRetinaUrl: require('../assets/semaforo3.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]

});


const rojo = new L.Icon({
    iconUrl: require('../assets/semaforo3.png'),
    iconRetinaUrl: require('../assets/rojo.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});

const verde = new L.Icon({
    iconUrl: require('../assets/semaforo3.png'),
    iconRetinaUrl: require('../assets/verde.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});
const amarillo = new L.Icon({
    iconUrl: require('../assets/semaforo3.png'),
    iconRetinaUrl: require('../assets/amarillo.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});
const apagado = new L.Icon({
    iconUrl: require('../assets/semaforo3.png'),
    iconRetinaUrl: require('../assets/apagado.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});