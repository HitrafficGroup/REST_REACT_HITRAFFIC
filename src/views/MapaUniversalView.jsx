import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MemoryIcon from '@mui/icons-material/Memory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { collection, getDocs} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Fab from '@mui/material/Fab';
import "../css/MapaUniversalView.css";
import '../css/FasesView.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup} from "react-leaflet";

export default function MapaUniversalView() {
    const [semaforos, setSemaforos] = useState([]);
    const controladores = useRef([]);
    const semaforosCompletos = useRef([]);
    const timer1 = useRef(0);
    const simulacion = useRef(false);
    const tiempo_amarillo  = useRef(0)
    const datos_amarillo_aux = useRef(0)
    const modoControlador = useRef('Tiempo Fijo');
    const faseActual = useRef(0);
    const fases_pasos_aux = useRef([])
    const [reloadMap, setReloadMap] = useState(false)
    const [zoomMap, setZoomMap] = useState(14)
    const [centerMap, setCenterMap] = useState([-2.9002025261800206, -78.99967753716173])
    const datosActuales = useRef([]);
    const [controlers, setControlers] = useState([]);
    const [controlerIcon,setControlerIcon] = useState([]);
    const [play, setPlay] = useState(false)
    //variables para mapear por areas
    const [areas, setAreas] = useState([]);
    
    const getData = async () => {

        let items_db = []
        let semaforos_db = []
        let semaforos_aux = [];
        let icons_controler = []
        const querySnapshot = await getDocs(collection(db, "controladores"));
        querySnapshot.forEach((doc) => {
            items_db.push(doc.data());
            semaforos_db.push(doc.data().semaforos);
        });
        for (let i = 0; i < items_db.length; i++) {
            let temp = items_db[i].semaforos
            let position = [items_db[i].latitud,items_db[i].longitud]
            icons_controler.push(position)
            for (let j = 0; j < temp.length; j++) {
                let obj_semaforo = JSON.parse(JSON.stringify(temp[j]))
                obj_semaforo["mac"] = items_db[i].mac
                    let puntos_aux = obj_semaforo.points
                    obj_semaforo["points"] = [puntos_aux[0].pos, puntos_aux[1].pos, puntos_aux[2].pos, puntos_aux[3].pos]
                    semaforos_aux.push(obj_semaforo)
            }
        }
        controladores.current = items_db
        setControlerIcon(icons_controler)
        setAreas(semaforos_aux)
        console.log(semaforos_aux)
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
        } else if (_data === "apagado") {
            return apagado
        } else if (_data === "destello") {
            return destello
        } else {
            return amarillo
        }
    }
    const localizarIntereseccion = (_datos) => {
        let aux = JSON.parse(JSON.stringify(_datos))
        let pos = aux.position
        console.log(pos)
        setCenterMap(pos)
        setZoomMap(19)
        setReloadMap(!reloadMap)

    }

    const centrarMapa = () => {
        setCenterMap([-2.9002025261800206, -78.99967753716173])
        setZoomMap(14)
        setReloadMap(!reloadMap)
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
    const devolverColor2 = (_data) => {
        if (_data === "verde") {
            return { color: 'green' }
        } else if (_data === "rojo") {
            return { color: 'red' }
        } else if (_data === "apagado") {
            return { color: 'black' }
        } else if (_data === "destello") {
            return { color: 'cyan' }
        } else {
            return { color: 'yellow' }
        }
    }
    const iniciarAnimacion = () => {
        let aux_datos_actuales = JSON.parse(JSON.stringify(datosActuales.current));
        let semaforos_temp = JSON.parse(JSON.stringify(semaforosCompletos.current));
        let g1;
        let g2;
        let g3;
        let g4;
        let dataUpdated = [];
        let semaforos_unidos = [];
        let flag = []
        let flag1 = []
        let flag3 = false
        
        for (let i = 0; i < aux_datos_actuales.length; i++) {

            let paso_actual = devolverPaso(aux_datos_actuales[i].calculo);

            // if(aux_datos_actuales[i].modo ===  'Tiempo Fijo' ){
            // console.log("estamos en modo fijo")
            //primero debemos ver en que paso estamos y en que tiempo 
            let fase_actual;
            flag[i] = paso_actual
            if (flag1[i] !== flag[i]) {
                flag1[i] = paso_actual
                g1 = devolverColor2(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[0].colorDescripcion);
                g2 = devolverColor2(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[1].colorDescripcion);
                g3 = devolverColor2(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[2].colorDescripcion);
                g4 = devolverColor2(aux_datos_actuales[i].fases_pasos[paso_actual].grupos[3].colorDescripcion);

                fase_actual = aux_datos_actuales[i].fases_pasos[paso_actual].grupos[0].faseNum
                
                //console.log(fase_siguiente)


                //let fase_siguiente = aux_datos_actuales[i-1].fases_pasos[paso_actual].grupos[0].faseNum
                aux_datos_actuales[i]["fase_actual"] = `fase-${fase_actual}`
                aux_datos_actuales[i]["grupo_1"] = aux_datos_actuales[i].fases_pasos[paso_actual].grupos[0].colorDescripcion
                aux_datos_actuales[i]["grupo_2"] = aux_datos_actuales[i].fases_pasos[paso_actual].grupos[1].colorDescripcion
                aux_datos_actuales[i]["grupo_3"] = aux_datos_actuales[i].fases_pasos[paso_actual].grupos[2].colorDescripcion
                aux_datos_actuales[i]["grupo_4"] = aux_datos_actuales[i].fases_pasos[paso_actual].grupos[3].colorDescripcion
                dataUpdated = semaforos_temp[i].map((item) => {
                    if (item.grupo === "g1") {
                        item['color'] = g1;
                        item['fase_actual'] = `fase-${fase_actual}`
                    } else if (item.grupo === "g2") {
                        item['color'] = g2;
                        item['fase_actual'] = `fase-${fase_actual}`
                    } else if (item.grupo === "g3") {
                        item['color'] = g3;
                        item['fase_actual'] = `fase-${fase_actual}`
                    } else if (item.grupo === "g4") {
                        item['color'] = g4;
                        item['fase_actual'] = `fase-${fase_actual}`
                    }
                    return item
                })
                flag3 = true
                semaforos_unidos.push(dataUpdated)
            }
         
           //setControlers(aux_datos_actuales)

        }

        if (flag3) {
            let newData = recursionSemaforo(semaforos_unidos)
            newData.map((item)=>{
                let puntos_aux = item.points
                item["points"] = [puntos_aux[0].pos, puntos_aux[1].pos, puntos_aux[2].pos, puntos_aux[3].pos]
            })
            setControlers(aux_datos_actuales)
            
            setAreas(newData)
            flag3 = false
        }
    
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
    const devolverSegundosPaso = (horario_activo,horario_siguiente) => {
        let horas_1 = parseInt(horario_activo.horas)
        let minutos_1 = parseInt(horario_activo.minutos)
        let horas_2 = parseInt(horario_siguiente.horas)
        let minutos_2 = parseInt(horario_siguiente.minutos)
        let t_inicio = horas_1 * 3600 + minutos_1 * 60 + 5
        let t_final = horas_2 * 3600 + minutos_2 * 60 + 5
        let ciclo = 0
        let segundos_pasos = []
        let pasos_duracion = []
        let pas_activos = []
        if(tiempo_amarillo.current>0 && modoControlador.current === "Tiempo Fijo"){
             pas_activos = JSON.parse(JSON.stringify(datos_amarillo_aux.current))
             faseActual.current = datos_amarillo_aux.current
        }
        else if(modoControlador.current === "Destello"){
            pas_activos = JSON.parse(JSON.stringify(pasosDestello))
            faseActual.current = pasosDestello
        }
        else{
             pas_activos = JSON.parse(JSON.stringify(fases_pasos_aux.current))
             faseActual.current = fases_pasos_aux.current
        }
        for (let i = 0; i < pas_activos.length; i++) {
            let aux = pas_activos[i].duracion
            pasos_duracion.push(aux)
            ciclo += aux
        }

        let seguntos_totales = t_final - t_inicio
        // let desfase = seguntos_totales % ciclo
        
        let frequencia = parseInt(seguntos_totales / ciclo)
        // let index_periodicidad = 0
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
            for (let j1 = 0; j1 < pasos_duracion.length; j1++) {
                let aux_7 = pasos_duracion[j1]
                for (let k = 0; k < aux_7; k++) {
                    temp_i += 1
                    segundos_pasos[j1].valores.push(temp_i)
                }
            }
        }
        return segundos_pasos
    }
    const parametrosCorriendo = async () => {
        let datos_para_simular = []
        let controladores_aux = JSON.parse(JSON.stringify(controladores.current))
        let objNuevoDatos = {}
        for (let i = 0; i < controladores_aux.length; i++) {
            let datos_controlador = JSON.parse(JSON.stringify(controladores_aux[i]))
            let latitud = datos_controlador.latitud
            let longitud = datos_controlador.longitud
            let dia_ordinario = datos_controlador.horarios.dia_ordinario;
            let planes = datos_controlador.planes
            let parametros_operativos = datos_controlador.otros_parametros
            tiempo_amarillo.current = parseInt(parametros_operativos.tiempo_amarillo_vehicular)
            let hora_actual = new Date();
            let horas = hora_actual.getHours();
            let minutos = hora_actual.getMinutes();
            let nombre = datos_controlador.informacion.nombre;
            let aux;
            let aux2;
            let temp;
            let ref;
            let ultimo_horario = false;
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
                    if(i === 0){
                        nro_horario = dias_ordenados[0].nro
                        nro_horario_sig = dia_ordinario[0].nro
                        ultimo_horario = true
                    }else{
                        nro_horario = dias_ordenados[i].nro
                        nro_horario_sig = dias_ordenados[i - 1].nro
                        ultimo_horario = false
                    }
                   
                    break
                }
                if(i === 0){
                    nro_horario = dias_ordenados[0].nro
                    nro_horario_sig = dia_ordinario[0].nro
                    ultimo_horario = true
                }else{
                    nro_horario = dias_ordenados[0].nro
                    nro_horario_sig = dias_ordenados[i].nro
                    ultimo_horario = false
                }
                
            }
            let horario_activo = dias_ordenados.find(item => item.nro === nro_horario)
            let horario_siguiente = dias_ordenados.find(item => item.nro === nro_horario_sig)

            //setHorarioexec(horario_activo);
            let modo = returnModo(horario_activo.mod)
            modoControlador.current = modo
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
            fases_pasos_aux.current =fases_pasos
            // esta parte del codigo se encarga de animar los ciclos en amarillo
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
            let segundos_pasos = []
            if (ultimo_horario){
                const fecha = new Date()
                let horas_1 = parseInt(horario_siguiente.horas)
                console.log(horas_1)
                if(fecha.getHours() >= horas_1){
                
                    console.log("entra en este caso")
                    segundos_pasos = devolverSegundosPaso(horario_activo,{minutos:0,horas:24})
                }else{
                    console.log("entra en este caso2")
                    segundos_pasos = devolverSegundosPaso({minutos:0,horas:0},horario_siguiente)
                }
            }else{
               segundos_pasos = devolverSegundosPaso(horario_activo,horario_siguiente)
            }
           

            objNuevoDatos = {
                mac: datos_controlador.mac,
                horario_activo: horario_activo,
                horario_siguiente: horario_siguiente,
                fases_pasos: faseActual.current,
                modo: modo,
                pasos: pasos_habilitados,
                calculo: segundos_pasos,
                nombre: nombre,
                position: [latitud, longitud]
            }
            datos_para_simular.push(objNuevoDatos)

        }

        datosActuales.current = datos_para_simular
        console.log(datosActuales)
    
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
            <Grid container spacing={0}>
                <Grid item xs={12} md={10.5}>
                    <div >
                        <MapContainer center={centerMap} zoom={zoomMap} key={reloadMap} scrollWheelZoom={false} className={"leaflet-container-2"}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b08eb869c89646fa8accf539b81e80de" />
                                {areas.map((item, index) => (
                                    <FeatureGroup pathOptions={item.color}>
                                        <Popup>
                                            <p style={{ margin: 0, fontStyle: "italic" }}><strong>Area: </strong>{item.nombre} <strong>Grupo: </strong>{item.grupo}</p>
                                        </Popup>
                                        <Polygon positions={item.points} />
                                    </FeatureGroup>
                            ))}
                             {controlerIcon.map((item, index) => (
                                    <Marker position={item} key={index} icon={semaforo}>
                                        
                                    </Marker>
                                ))}
                            <Fab color="primary" variant="extended" sx={{ position: "absolute", bottom: 50, right: 90 }} disabled={!play} onClick={botonPause} >
                                <PauseCircleOutlineIcon sx={{ mr: 1 }} />
                                Pause
                            </Fab>
                            <Fab color="secondary" variant="extended" sx={{ position: "absolute", bottom: 50, right: 220 }} disabled={play} onClick={botonPlay} >
                                <PlayCircleOutlineIcon sx={{ mr: 1 }} />
                                Play
                            </Fab>
                            <Fab color="primary" sx={{ position: "absolute", bottom: 50, right: 20 }} aria-label="add" onClick={centrarMapa} >
                                <LocationSearchingIcon />
                            </Fab>
                            {/* <CardUniversal /> */}
                        </MapContainer>
                    </div>
                </Grid>
                <Grid item xs={12} md={1.5}>
                    <div style={{ width: "100%", height: "90vh", overflowY: "scroll", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h5 style={{ marginTop: 8, color: "#1976d2", fontSize: 25,textAlign:"center" }}>Controladores Activos</h5>
                        {controlers.map((item, index) => (
                            <div key={index} className='card-str-mu'>
                                <div className='titulo-card-mu'>
                                    <p className='title-c-mu'>{item.nombre.toLocaleUpperCase()}</p> 
                                        <div>
                                            <IconButton aria-label="delete" size="small" onClick={() => { localizarIntereseccion(item) }} >
                                                <LocationOnIcon fontSize="inherit" />
                                            </IconButton>
                                        </div>
                                </div>
                                <hr style={{ margin: 5 }} />
                                <div className='card-body'>
                                    <div className='contenedor-semaforo-mu'>
                                        <div className={item.grupo_1}>
                                            <p className='text-indicador'>G1</p>
                                        </div>
                                        <div className={item.grupo_2}>
                                            <p className='text-indicador'>G2</p>
                                        </div>
                                        <div className={item.grupo_3}>
                                            <p className='text-indicador' >G3</p>
                                        </div>
                                        <div className={item.grupo_4}>
                                            <p className='text-indicador' >G4</p>
                                        </div>
                                    </div>
                                    <div className='container-mu'>
                                        <div>
                                            <div style={{display:"flex",flexDirection:"row"}}>
                                                <strong style={{ color: "#1976d2" }}>Fase-exec: </strong><p style={{marginLeft:10,marginTop:0,marginBottom:0}}>{item.fase_actual}</p>
                                            </div>
                                        </div>
                                        {/* <div>
                                            <strong style={{ color: "#5D6D7E" }}>Next-Fase: </strong>
                                        </div> */}
                                    </div>
                                 {/* <div className='card-actions'>
                                        <Button variant="outlined" startIcon={<LocationOnIcon />} onClick={() => { localizarIntereseccion(item) }} >Localizar</Button>
                                    </div> */}
                                </div>
                            </div>
                        )

                        )}



                    </div>
                </Grid>
            </Grid>
            {/* </Container> */}

        </>
    );

}


const semaforo = new L.Icon({
    iconUrl: require('../assets/semaforo2.png'),
    iconRetinaUrl: require('../assets/semaforo2.png'),
    iconSize: [50, 60], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 60], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]

});

const destello = new L.Icon({
    iconUrl: require('../assets/destello.png'),
    iconRetinaUrl: require('../assets/destello.png'),
    iconSize: [50,50], // size of the icon
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
    iconSize: [50,50], // size of the icon
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
const controlador_img = new L.Icon({
    iconUrl: require('../assets/controler.png'),
    iconRetinaUrl: require('../assets/controler.png'),
    iconSize: [30, 30], // size of the icon
    shadowSize: [60, 64], // size of the shadow
    iconAnchor: [15, 30], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
});
let semaforos4 = [
    { nombre: "ricaurte" }, { nombre: "capulispamba" }, { nombre: "miraflores" }, { nombre: "centro historico" }, { nombre: "chordeleg" }, { nombre: "turi" }
]
let pasosDestello = [
    {
        duracion: 1,
        fase: 1,
        grupos: [
            { colorDescripcion: 'amarillo', faseNum: 1, id: 'g1_fase_1', grupoNum: 1, color: 0 },
            { colorDescripcion: 'amarillo', faseNum: 1, id: 'g2_fase_1', grupoNum: 2, color: 0 },
            { colorDescripcion: 'amarillo', faseNum: 1, id: 'g3_fase_1', grupoNum: 3, color: 0 },
            { colorDescripcion: 'amarillo', faseNum: 1, id: 'g4_fase_1', grupoNum: 4, color: 0 }],
        name: 'Paso 1'
    },
    {
        duracion: 1,
        fase: 2,
        grupos: [
            { colorDescripcion: 'apagado', faseNum: 2, id: 'g1_fase_2', grupoNum: 1, color: 3 },
            { colorDescripcion: 'apagado', faseNum: 2, id: 'g2_fase_2', grupoNum: 2, color: 3 },
            { colorDescripcion: 'apagado', faseNum: 2, id: 'g3_fase_2', grupoNum: 3, color: 3 },
            { colorDescripcion: 'apagado', faseNum: 2, id: 'g4_fase_2', grupoNum: 4, color: 3 }],
        name: 'Paso 2'
    }

]