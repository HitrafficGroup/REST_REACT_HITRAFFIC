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
import MemoryIcon from '@mui/icons-material/Memory';
import WifiIcon from '@mui/icons-material/Wifi';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
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
    const controladores = useRef([]);
    const semaforosCompletos = useRef([]);
    const timer1 = useRef(0);
    const ciclos = useRef([]);
    const timer2 = useRef(0);
    const paso = useRef(0);
    const simulacion = useRef(false);
    const datosActuales = useRef([]);
    const [play, setPlay] = useState(false)
    const getData = async () => {

        let items_db = []
        let semaforos_db = []
        let semaforos_aux = [];
        const querySnapshot = await getDocs(collection(db, "controladores"));
        querySnapshot.forEach((doc) => {
            items_db.push(doc.data());
            semaforos_db.push(doc.data().resumen);
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
        controladores.current = items_db
        setSemaforos(semaforos_aux)
        semaforosCompletos.current = semaforos_db


    }
    const botonPlay = async () => {
        await parametrosCorriendo()
        simulacion.current = true
        timer1.current = 0
        setPlay(true)
    }
    const botonPause = () => {
        simulacion.current = false
        timer1.current = 0
        setPlay(false)
    }
    const recursionSemaforo = (_data) => {
        let semaforos_aux = []
        for (let i = 0; i < _data.length; i++) {
            let temp = _data[i]
            for (let j = 0; j < temp.length; j++) {
                let obj_semaforo = temp[j]
                semaforos_aux.push(obj_semaforo)
            }
        }
        return semaforos_aux
    }
    const devolverColor = (_data) => {
        if (_data === "verde") {
            return verde
        } else if (_data === "rojo") {
            return rojo
        } else {
            return amarillo
        }

    }

    const devolverPaso = (_datos) => {
        const referencia = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()
        let datos_interes = _datos

        let paso_actual
        for (let i = 0; i < datos_interes.length; i++) {
            let temp = datos_interes[i].valores
            let busqueda = temp.find(element => element === referencia)
            if (busqueda === referencia) {
                paso_actual = datos_interes[i].paso
            }
        }
        return paso_actual
    }

    const iniciarAnimacion = () => {

        let aux_datos_actuales = JSON.parse(JSON.stringify(datosActuales.current));
        let semaforos_temp = JSON.parse(JSON.stringify(semaforosCompletos.current));

        let g1;
        let g2;
        let g3;
        let g4;
        let tiempos = [];
        let valores = [];
        let dataUpdated = [];
        let semaforos_unidos = [];
        console.log(aux_datos_actuales)
        for (let i = 0; i < aux_datos_actuales.length; i++) {

            let paso_actual = devolverPaso(aux_datos_actuales[i].calculo);
           
            // if(aux_datos_actuales[i].modo ===  'Tiempo Fijo' ){
            // console.log("estamos en modo fijo")
            //primero debemos ver en que paso estamos y en que tiempo 
            g1 = devolverColor(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[0].colorDescripcion);
            g2 = devolverColor(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[1].colorDescripcion);
            g3 = devolverColor(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[2].colorDescripcion);
            g4 = devolverColor(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[3].colorDescripcion);


            dataUpdated = semaforos_temp[i].map((item) => {
                if (item.grupo === "g1") {
                    item['icon'] = g1;
                } else if (item.grupo === "g2") {
                    item['icon'] = g2;
                } else if (item.grupo === "g3") {
                    item['icon'] = g3;
                } else if (item.grupo === "g4") {
                    item['icon'] = g4;
                }
                return item
            })

            semaforos_unidos.push(dataUpdated)

        }
        let newData = recursionSemaforo(semaforos_unidos)

        setSemaforos(newData)
        //setSemaforos(newData)
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
    const parametrosCorriendo = async () => {
        let datos_para_simular = []
        let controladores_aux = JSON.parse(JSON.stringify(controladores.current))
       
        let objNuevoDatos = {}
        for (let i = 0; i < controladores_aux.length; i++) {
            let datos_controlador = JSON.parse(JSON.stringify(controladores_aux[i]))
            let dia_ordinario = datos_controlador.horarios.dia_ordinario;
            let planes = datos_controlador.planes
            let parametros_operativos = datos_controlador.otros_parametros
            let tiempo_amarillo = parseInt(parametros_operativos.tiempo_amarillo_vehicular)
            let hora_actual = new Date();
            let horas = hora_actual.getHours();
            let minutos = hora_actual.getMinutes();
            let aux;
            let aux2;
            let temp;
            let ref;
            let nro_horario;
            let pas_activos = []
            let dias_ordenados = dia_ordinario
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
                    nro_horario = dias_ordenados[i].nro
                    nro_horario_sig = dias_ordenados[i - 1].nro
                    //console.log("plan obtenido: ",nro_horario)
                    break
                }
                nro_horario = dias_ordenados[0].nro
                nro_horario_sig = dias_ordenados[i].nro
            }

            let horario_activo = dias_ordenados.find(item => item.nro === nro_horario)
            let horario_siguiente = dias_ordenados.find(item => item.nro === nro_horario_sig)
            //setHorarioexec(horario_activo);
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
            // esta parte del codigo se encarga de animar los ciclos en amarillo
            if (tiempo_amarillo > 0) {
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
                        duracion: tiempo_amarillo,
                        fase: item.fase,
                        grupos: grupos_aux,
                        name: item.name,
                    }
                    return paso_editado
                })

                let nuevos_pasos_2 = fases_pasos_aux2.map(item => (
                    {
                        duracion: item.duracion - tiempo_amarillo,
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
            let fases_pasos_3 = []
            if (tiempo_amarillo > 0) {
                pas_activos = JSON.parse(JSON.stringify(datos_amarillo))
                fases_pasos_3 = datos_amarillo
            } else {
                pas_activos = JSON.parse(JSON.stringify(fases_pasos))
                fases_pasos_3 = fases_pasos
            }

            
        let horas_1 = parseInt(horario_activo.horas)
        let minutos_1 = parseInt(horario_activo.minutos)
        let horas_2 = parseInt(horario_siguiente.horas)
        let minutos_2 = parseInt(horario_siguiente.minutos)
        let t_inicio = horas_1 * 3600 + minutos_1 * 60 + 5
        let t_final = horas_2 * 3600 + minutos_2 * 60 + 5
        let ciclo = 0
        let segundos_pasos = []
        let pasos_duracion = []
      
    
        for (let i = 0; i < pas_activos.length; i++) {
            let aux = pas_activos[i].duracion
            pasos_duracion.push(aux)
            ciclo += aux
        }

        let seguntos_totales = t_final - t_inicio
        let desfase = seguntos_totales % ciclo

        let frequencia = parseInt(seguntos_totales / ciclo)
        let index_periodicidad = 0
        let temp_i = t_inicio

        for (let i = 0; i < pas_activos.length; i++) {
            let aux = {
                paso: i,
                name: `Paso ${i + 1}`,
                valores: []
            }
            segundos_pasos.push(aux)
        }

        for (let i1 = 0; i1 < frequencia; i1++) {
            let index = 0
            for (let j1 = 0; j1 < pasos_duracion.length; j1++) {
                let aux_7 = pasos_duracion[j1]
                for (let k = 0; k < aux_7; k++) {
                    temp_i += 1
                    segundos_pasos[j1].valores.push(temp_i)
                }
            }
        }

            objNuevoDatos = {
                mac: datos_controlador.mac,
                horario_activo: horario_activo,
                horario_siguiente: horario_siguiente,
                fases_pasos: fases_pasos_3,
                modo: modo,
                pasos: pasos_habilitados,
                calculo:segundos_pasos
            }
            datos_para_simular.push(objNuevoDatos)

        }

        datosActuales.current = datos_para_simular
        
    }



    useEffect(() => {
        const interval = setInterval(() => {

            if (simulacion.current) {
                //cambiarSemaforo();
                iniciarAnimacion();
                timer1.current = timer1.current + 1;

            }

        }, 1000);
        getData();
        return () => clearInterval(interval);
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
                                <div className='card-structure-universal'>
                                <div className='titulo-card'>
                                    <h5 className='title-c' style={{color:"white"}}>Controlador Activo</h5>
                                    <MemoryIcon fontSize="large" sx={{color:"white"}}/>
                                </div>
                                <div className='card-body'>
                                    Semaforo {item.nombre} - Grupo: {item.grupo}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    <Fab color="primary" variant="extended" sx={{ position: "absolute", bottom: 50, right: 70 }} disabled={!play} onClick={botonPause} >
                        <PauseCircleOutlineIcon sx={{ mr: 1 }} />
                        Pause
                    </Fab>
                    <Fab color="secondary" variant="extended" sx={{ position: "absolute", bottom: 50, right: 200 }} disabled={play} onClick={botonPlay} >
                        <PlayCircleOutlineIcon sx={{ mr: 1 }} />
                        Play
                    </Fab>
                    {/* <CardUniversal /> */}
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
    iconUrl: require('../assets/rojo.png'),
    iconRetinaUrl: require('../assets/rojo.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});

const verde = new L.Icon({
    iconUrl: require('../assets/verde.png'),
    iconRetinaUrl: require('../assets/verde.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});
const amarillo = new L.Icon({
    iconUrl: require('../assets/amarillo.png'),
    iconRetinaUrl: require('../assets/amarillo.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});
const apagado = new L.Icon({
    iconUrl: require('../assets/apagado.png'),
    iconRetinaUrl: require('../assets/apagado.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});