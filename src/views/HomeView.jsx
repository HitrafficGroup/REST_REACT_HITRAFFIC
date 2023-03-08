import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SaveIcon from '@mui/icons-material/Save';
import MapIcon from '@mui/icons-material/Map';
import { collection, updateDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import "../css/HomeView.css"
import CustomProgress from "../components/CustomProgress";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getIpsFromRestApi, getFirmwareVersion } from '../js/apiFunctions'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import Fab from '@mui/material/Fab';
import { setInitialStateController, setResumen, addIpsDisponibles, setPasosActivos, addCurrentControler, createNewController } from "../features/controlers/controlerSlice";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function PruebasView() {
    const [flagsimu, setFlagsimu] = useState(false);
    const todaInformacion = useRef({});
    const modoControlador = useRef('Tiempo Fijo');
    const [areas, setAreas] = useState([]);
    const navigate = useNavigate();
    const simulacion = useRef(false);
    const timer1 = useRef(0);
    const fases_pasos_aux = useRef([])
    const allInfo = useRef({});
    const faseActual = useRef(0);
    const calculoEjecucion = useRef([]);
    const tiempo_amarillo = useRef(0)
    const datos_amarillo_aux = useRef(0)
   

    const [pointsArea, setPointsArea] = useState([]);
    const [accionesUi, setAccionesUi] = useState(false);
    const center = [-2.898794750323891, -79.00108637169295]
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const [modalCrearSemaforo, setModalCrearSemaforo] = useState(false);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [reloadMap, setReloadMap] = useState(true);
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [indicadorData,setIndicadorData] = useState(initialData.resumen);


    //prueba semaforo
    const semaforos2 = useRef();


    const [newSemaforo, setNewSemaforo] = useState({
        nombre: "",
        position: [],
        rojo: 15,
        amarillo: 5,
        verde: 30,
        icon: {},
        grupo: '',
    });
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setPosition(marker.getLatLng())
                    setBtnAgregar(false);
                } else {
                    setBtnAgregar(true);
                }
            },
        }),
        [],
    )
    const handleNewSemaforo = (event) => {
        setNewSemaforo(
            {
                ...newSemaforo,
                [event.target.name]: event.target.value,
            }
        )
    }
    // const handleNewController = (event) => {
    //     setNewController(
    //         {
    //             ...newController,
    //             [event.target.name]: event.target.value,
    //         }
    //     )
    // }
    const Changeview = (referencia) => {
        navigate(referencia);
    }
  
   
    // const actualizarDatosControlador = async () => {
    //     setModalEditControlador(false);
    //     const ref = doc(db, "historial_controladores", `${controlerState.mac}`);
    //     await updateDoc(ref, {
    //         latitud: newController.latitud,
    //         longitud: newController.longitud,
    //         nombre: newController.nombre
    //     });
    //     dispatch(setInitialStateController(newController));

    // }
    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, [])
    const markerRef = useRef(null)


    /* funcion encargada  de cargar los datos del controlador seleccionado , estos
    datos nos serviran para poder llamar los planes , fases etc del controlador, la funcion
    se encarga de actualizar el reducer con la informacion del controlador actual */
    const seleccionarControlador = async (data) => {
        setAccionesUi(true)
        try {
            if (data.declarado) {
                simulacion.current = false;
                setFlagsimu(false);

                setPosition([data.latitud, data.longitud])
                dispatch(setInitialStateController(data));
                dispatch(addCurrentControler(data));
                
                setReloadMap(!reloadMap)
                let aux = await getFirmwareVersion(data.mac, data.ip);
                let firmware = aux[data.mac]
                let aux5 = controlerState.ips

                let controls = aux5.map(item => {
                    let dato = {}
                    if (item.mac === data.mac) {
                        dato = {
                            ip: item.ip,
                            latitud: item.latitud,
                            longitud: item.longitud,
                            mac: item.mac,
                            nombre: item.nombre,
                            seleccionado: true,
                            status: item.status,
                            declarado: item.declarado
                        }
                    } else {
                        dato = {
                            ip: item.ip,
                            latitud: item.latitud,
                            longitud: item.longitud,
                            mac: item.mac,
                            nombre: item.nombre,
                            seleccionado: false,
                            status: item.status,
                            declarado: item.declarado
                        }
                    }
                    return dato;
                })

                dispatch(addIpsDisponibles(controls));
                enviarVersionFirebase(data.mac, data.ip, firmware);

                let docRef = doc(db, "controladores", data.mac);
                console.log("Pedimos los datos de Firebase", docRef);
                let document = await getDoc(docRef);
                let gruposController = document.data().semaforos
                let areas_temp = JSON.parse(JSON.stringify(gruposController))
                areas_temp.map((item) => {
                    let puntos_aux = item.points
                    item.points = [puntos_aux[0].pos, puntos_aux[1].pos, puntos_aux[2].pos, puntos_aux[3].pos]
                    return null;
                })

                semaforos2.current = areas_temp
                setAreas(areas_temp)
                allInfo.current = document.data()
                console.log(controlerState.pasos_activos)
                todaInformacion.current = document.data()
                parametrosCorriendo();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Controlador Conectado',
                    showConfirmButton: false,
                    timer: 900
                })
            } else {
                Swal.fire({
                    title: 'Controlador Nuevo',
                    text: "Deseas declarar este nuevo controlador?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si'
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log(data)
                        dispatch(createNewController({
                            mac: data.mac,
                            ip: data.ip,
                        }));
                        Changeview("/david-diaz/declarar-controlador")
                    }
                })
            
            }
        } catch (error) {
            setAccionesUi(false)
        }
        setAccionesUi(false)

    }

    /* funcion para actualizar la variable version en firebase, dependiendo del controlador*/
    const enviarVersionFirebase = async (mac, ip, firmware) => {
        const ref = doc(db, "controladores", `${mac}`);
        await updateDoc(ref, {
            mac: mac,
            ip: ip,
            version: firmware
        });
    }
    /*funcion encargada  de devolvernos el estado en el que se encuentra tal semaforo*/
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
    const DraggableMarker = () => {
        return (
            <Marker
                icon={ubi}
                draggable={!flagsimu}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>

                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable ? 'Marker is draggable' : 'Click here to make marker draggable'}
                    </span>
                </Popup>
            </Marker>
        )
    }
    /*funcion Encargada de obtener los datos de las ips de los controladores y comparar si ya fueron delcarados
    antes en la base de datos de firebase*/
    const listarIps = async () => {
        try {
            console.log("entra a esta expresion")
            setAccionesUi(true);
            let items_db = []
            const querySnapshot = await getDocs(collection(db, "historial_controladores"));
            querySnapshot.forEach((doc) => {

                items_db.push(doc.data());
            });

            const doc = await getIpsFromRestApi();
            console.log(doc)
            const aux_ips = doc.Ips_disponibles;
            let ips = aux_ips.map(item=>({
                    ip:item.ip,
                    mac:item.mac,
                    status:"online",
            }))
            var controladores = ips.map(item => {
                let name = items_db.find(element => element.mac === item.mac)
                if (name === undefined) {
                    return ({
                        ip: item.ip,
                        mac: item.mac,
                        status: item.status,
                        nombre: "sin declararse aun",
                        latitud: -2.876428,
                        longitud: -78.965342,
                        seleccionado: false,
                        declarado: false
                    });
                } else {
                    return ({
                        ip: item.ip,
                        mac: item.mac,
                        status: item.status,
                        nombre: name.nombre,
                        latitud: name.latitud,
                        longitud: name.longitud,
                        seleccionado: false,
                        declarado: true
                    });
                }
            })

            dispatch(addIpsDisponibles(controladores));
            setAccionesUi(false)

        } catch (error) {
            setAccionesUi(false)

        }
    }
    /*
    esta funcion agrega y actualiza el semaforo que se selecciona en los grupos
    ,nos permite desplazar elsemaforo dentro del mapa actualizando su latitud y longitud
    */
    const agregarSemaforo = async () => {
        setAccionesUi(true)
        const docRef = doc(db, "controladores", controlerState.mac);
        let docsanp = await getDoc(docRef);
        let areas_aux = docsanp.data().semaforos

        let newpositions = pointsArea.map((item) => (
            {
                pos: item.position
            }
        ))
        console.log(newpositions)

        let newPolilyneFirebase = {
            rojo: 10,
            amarillo: 4,
            verde: 20,
            nombre: newSemaforo.nombre,
            grupo: newSemaforo.grupo,
            points: newpositions,
            color: devolverColor2(newSemaforo.grupo),
        }

        areas_aux.push(newPolilyneFirebase);
        const ref = doc(db, "controladores", controlerState.mac);
        await updateDoc(ref, {
            semaforos: areas_aux
        });
        let areas_temp = JSON.parse(JSON.stringify(areas_aux))
        areas_temp.map((item) => {
            let puntos_aux = item.points
            item.points = [puntos_aux[0].pos, puntos_aux[1].pos, puntos_aux[2].pos, puntos_aux[3].pos]
            return null;
        })
        console.log(areas_temp)
        semaforos2.current = areas_temp
        setAreas(areas_temp)
        setPointsArea([])
        setModalCrearSemaforo(false)
        setAccionesUi(false)
        setNewSemaforo({
            nombre:"",
            grupo:"",
        })

    }
    const devolverColor2 = (_grupo) => {
        if (_grupo === "g1") {
            return grupo_1
        } else if (_grupo === "g2") {
            return grupo_2
        } else if (_grupo === "g3") {
            return grupo_3
        } else {
            return grupo_4
        }
    }
    /*
        funcion para poder estructurar la informacion que deben mostrar los indicadores
    */
   const informacionDelIndicador = ()=>{
        let temp = JSON.parse(JSON.stringify(faseActual.current))
        let auxg1;
        let auxg2;
        let auxg3;
        let auxg4;
        let objg1 = { verde: 0, rojo: 0 }
        let objg2 = { verde: 0, rojo: 0 }
        let objg3 = { verde: 0, rojo: 0 }
        let objg4 = { verde: 0, rojo: 0 }
        
        for (let i1 = 0; i1 < temp.length; i1++) {
            auxg1 = temp[i1].grupos[0].color
            auxg2 = temp[i1].grupos[1].color
            auxg3 = temp[i1].grupos[2].color
            auxg4 = temp[i1].grupos[3].color
            if (auxg1 === 1) {
                objg1.verde = objg1.verde + temp[i1].duracion
            } else {
                objg1.rojo = objg1.rojo + temp[i1].duracion
            }
            if (auxg2 === 1) {
                objg2.verde = objg2.verde + temp[i1].duracion
            } else {
                objg2.rojo = objg2.rojo + temp[i1].duracion
            }
            if (auxg3 === 1) {
                objg3.verde = objg3.verde + temp[i1].duracion
            } else {
                objg3.rojo = objg3.rojo + temp[i1].duracion
            }
            if (auxg4 === 1) {
                objg4.verde = objg4.verde + temp[i1].duracion
            } else {
                objg4.rojo = objg4.rojo + temp[i1].duracion
            }
        }
        let ejemplo = indicadorData
        var newDataUpdate = ejemplo.map((item) => {
            if (item.grupo === 'g1') {
                item['rojo'] = objg1.rojo - tiempo_amarillo.current
                item['verde'] = objg1.verde 
                item['amarillo'] = tiempo_amarillo.current
                item['modo'] =  modoControlador.current
            } else if (item.grupo === 'g2') {
                item['rojo'] = objg2.rojo -tiempo_amarillo.current
                item['verde'] = objg2.verde
                item['amarillo'] = tiempo_amarillo.current
                item['modo'] =  modoControlador.current
            } else if (item.grupo === 'g3') {
                item['rojo'] = objg3.rojo -tiempo_amarillo.current
                item['verde'] = objg3.verde
                item['amarillo'] = tiempo_amarillo.current
                item['modo'] =  modoControlador.current
            } else {
                item['rojo'] = objg4.rojo -tiempo_amarillo.current
                item['verde'] = objg4.verde
                item['amarillo'] = tiempo_amarillo.current
                item['modo'] = modoControlador.current
            }
            item['icon'] = {}
            return item
        })
        setIndicadorData(newDataUpdate)
   }

    /* funcion encargada de actualizar el valor del useRef con la finalidad de permitir que se 
    inicie la simulacion debido a que maneja un valor booleano que activa una funcion en el hook
    useEffect */
    const iniciarSimulacion = () => {
        simulacion.current = !simulacion.current;
        if (simulacion.current) {

            parametrosCorriendo()
        }
        setFlagsimu(!flagsimu);
        setBtnAgregar(simulacion.current)

    }
    /*
        devolvercolor recibe como parametro el nombre del color y nos devuelve el icono leaflet
        paracolocarlo en el semaforo cada vez que cambia de paso , esta funcion es importante para actualizar
        la imagen del semaforo y que se realice la animacion
    */
    const devolverColor = (_data) => {
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

    /*
        debido a que determinamos el paso en el que estamos a partir de un arreglo con cada uno de los segundos 
    en los cuales debe estar activado ese paso , creamos una funcion de busqueda que a partir del segundo que recibe
    en el valor de referencia este lo buscara dentro de los arreglos que existe por cada paso del controlador y nos
    dira a que paso pertenece ese preciso segundo
    */
    const devolverPaso = () => {
        const referencia = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()
        let datos_interes = calculoEjecucion.current
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
    
    /* 
        funcion encargada de devolver los segundos en los cuales va estar activo cada paso
    */
    const devolverSegundosPaso = (horario_activo, horario_siguiente) => {
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
        if (tiempo_amarillo.current > 0 && modoControlador.current === "Tiempo Fijo") {
            pas_activos = JSON.parse(JSON.stringify(datos_amarillo_aux.current))
            faseActual.current = datos_amarillo_aux.current
        }
        else if (modoControlador.current === "Destello") {
            pas_activos = JSON.parse(JSON.stringify(pasosDestello))
            faseActual.current = pasosDestello
        }
        else {
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

    /* 
        Funcion encargada de cargar los datos necesarios para animar los semaforos
        del mapa.
     */
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
        let horario_siguiente = dias_ordenados.find(item => item.nro === nro_horario_sig)

      
        let modo = returnModo(horario_activo.mod)
       
        modoControlador.current = modo
        let plan_activo = horario_activo.plan
        let planname = `plan${plan_activo}`
        let plan_filter = planes.filter(_plan => _plan.numPlan === planname)
        let pasos = plan_filter[0].pasos
        var pasos_habilitados = pasos.filter((item) => {
            if (item.duracion > 0) {
                return item;
            }else{
                return null;
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
        fases_pasos_aux.current = fases_pasos
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
        let resumen = {
            horas: horario_activo.horas,
            minutos: horario_activo.minutos,
            plan: horario_activo.plan,
            pasos: fases_pasos,
            modo: modo,
        }
        dispatch(setResumen(resumen));



        timer1.current = 0

        dispatch(setPasosActivos(fases_pasos));
        // aqui haremos el calculo para los indicadores 
        
        //setPasosActivos(fases_pasos)

        let segundos_pasos = []
        if (ultimo_horario) {
            const fecha = new Date()
            let horas_1 = parseInt(horario_siguiente.horas)
            if (fecha.getHours() >= horas_1) {
                segundos_pasos = devolverSegundosPaso(horario_activo, { minutos: 0, horas: 24 })
            } else {
                segundos_pasos = devolverSegundosPaso({ minutos: 0, horas: 0, horario_siguiente })
            }
        } else {
            segundos_pasos = devolverSegundosPaso(horario_activo, horario_siguiente)
        }
        informacionDelIndicador()
        calculoEjecucion.current = segundos_pasos
        //setSemaforo()


    }
    const eliminarArea = async (_data) => {
        Swal.fire({
            title: 'Borrar Arear',
            text: "Deseas Borrar esta area?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setAccionesUi(true)
                let aux = JSON.parse(JSON.stringify(semaforos2.current))
                let semaforosActualizados = aux.filter(item => item.nombre !== _data.nombre)

                const ref = doc(db, "controladores", controlerState.mac);
                let areas_temp = JSON.parse(JSON.stringify(semaforosActualizados))
                areas_temp.map((item) => {
                    let puntos_aux = item.points
                    
                    item.points = puntos_aux.map((_item) => (
                        {
                            pos: _item
                        }
                    ))
                    return null;
                })

                await updateDoc(ref, {
                    semaforos: areas_temp
                });
                semaforos2.current = semaforosActualizados
                setAreas(semaforosActualizados)
                setAccionesUi(false)
            }
        })


    }
    /* esta  funcion se encarga de animar el mapa segun el paso en el que se encuentre*/

    const iniciarAnimacion = () => {
        let g1;
        let g2;
        let g3;
        let g4;
        let dataUpdated;
        let aux = semaforos2.current;
        console.log(aux)
        // console.log("hasta aqui llega el programa");

        let paso_actual = devolverPaso()
        g1 = devolverColor(faseActual.current[paso_actual].grupos[0].colorDescripcion);
        g2 = devolverColor(faseActual.current[paso_actual].grupos[1].colorDescripcion);
        g3 = devolverColor(faseActual.current[paso_actual].grupos[2].colorDescripcion);
        g4 = devolverColor(faseActual.current[paso_actual].grupos[3].colorDescripcion);
        aux = semaforos2.current
        dataUpdated = aux.map((item) => {
            if (item.grupo === "g1") {
                item['color'] = g1;
            } else if (item.grupo === "g2") {
                item['color'] = g2;
            } else if (item.grupo === "g3") {
                item['color'] = g3;
            } else if (item.grupo === "g4") {
                item['color'] = g4;
            }
            return item
        })
        console.log(dataUpdated)
        setAreas(dataUpdated);

    }
    // funcion que compara los datos almacenados en la store
    const verifyDataSemaforos = () => {
        console.log("existen datos")
    }
    const obtenerCoordenadas = () => {
        let puntos = JSON.parse(JSON.stringify(pointsArea))
        let data
        console.log(position)
        let newPoint = {
            icon: point,
            position: [position.lat, position.lng]
        }

        console.log(newPoint)
        if (puntos.length < 4) {
            puntos.push(newPoint)
            data = puntos.map(item => (
                {

                    icon: point,
                    position: item.position
                }
            ))
        } else {
            puntos.pop()
            puntos.push(newPoint)
            data = puntos.map(item => (
                {
                    icon: point,
                    position: item.position
                }))
        }
        setPointsArea(data)

    }

    const limpiarPuntos = () =>{
        setPointsArea([])
    }

    /* use effect es un hook que nos permite ejecutar nuestro temporizador en tiempo real
    como un sub procesos y de este modo generar las animaciones del semaforo
    */

    useEffect(() => {
        const interval = setInterval(() => {

            if (simulacion.current) {
                //cambiarSemaforo();
                iniciarAnimacion();
                timer1.current = timer1.current + 1;

            }

        }, 1000);

        verifyDataSemaforos()
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <Container maxWidth="md">
                <div className='titulos-home'>
                    <h4>Lista De Controladores</h4>
                </div>
                <Button variant="contained" disabled={accionesUi} endIcon={<CloudDownloadIcon />} onClick={listarIps} sx={{ marginBottom: 2 }}>
                    Listar Controladores
                </Button>
                <Grid container spacing={1}>

                    <Grid item xs={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Acciones</Th>
                                    <Th className='home-t-th'>Nombre</Th>
                                    <Th className='home-t-th'>Ip</Th>
                                    <Th className='home-t-th'>Mac</Th>
                                    <Th className='home-t-th'>status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {controlerState.ips.map((dato, index) => (
                                    <Tr className="tablas-focus" key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td >
                                            <Button variant="contained" disabled={accionesUi} color={dato.seleccionado ? 'verde2' : 'seleccion'} onClick={() => { seleccionarControlador(dato) }} >SELECCIONAR</Button>
                                        </Td>
                                        <Td >
                                            {dato.nombre}
                                        </Td>
                                        <Td >
                                            {dato.ip}
                                        </Td>
                                        <Td >
                                            {dato.mac}
                                        </Td>
                                        <Td >
                                            <FormControlLabel
                                                control={<IOSSwitch sx={{ m: 1 }} estado={dato.status} />}
                                                label={dato.status}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item md={12}>
                        <div className="h-controler-select">
                            <h5>Controlador Seleccionado: </h5>
                        </div>
                    </Grid>
                    {/* <Grid item xs={12} md={12}>
                                    <div className="info-controller-home">
                                        <h5 className="titulos-home-view">
                                        {controlerState.nombre}
                                        </h5>
                                        <h5 className="titulos-home-view">
                                        LAT {controlerState.latitud}
                                        </h5>
                                        <h5 className="titulos-home-view">
                                        LON {controlerState.longitud}
                                        </h5>
                                    </div>
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                        <TextField id="outlined" focused value={controlerState.nombre} label="Nombre" variant="outlined" aria-readonly={true} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined" focused value={controlerState.latitud} label="Latitud" variant="outlined" aria-readonly fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined" focused value={controlerState.longitud} label="Longitud" variant="outlined" aria-readonly fullWidth />
                    </Grid>


                    <Grid item md={12}>
                        <div className="h-controler-select">
                            <h5>Gestionar Semáforos:</h5>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined" focused value={position.lat} label="Latitud" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined" focused value={position.lng} label="Longitud" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="contained" startIcon={<SaveIcon />} disabled={btnAgregar} onClick={() => { obtenerCoordenadas() }} color="azulm" fullWidth sx={{ height: "100%" }}>GUARDAR</Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="contained"color='verde2' startIcon={<MapIcon />} disabled={btnAgregar} onClick={() => { setModalCrearSemaforo(true) }}  fullWidth sx={{ height: "100%" }}>CREAR</Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="contained" color='anaranjado1' disabled={btnAgregar}  fullWidth sx={{ height: "100%" }} onClick={limpiarPuntos} >LIMPIAR</Button>
                    </Grid>


                    <Grid item xs={12} md={12}>
                        <div className="map">
                            <MapContainer center={[controlerState.latitud, controlerState.longitud]} zoom={19} key={reloadMap} scrollWheelZoom={false} className='map-container leaflet-container-2'>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b08eb869c89646fa8accf539b81e80de"
                                />
                                <DraggableMarker />
                                {pointsArea.map((item, index) => (
                                    <Marker position={item.position} icon={item.icon}>
                                    </Marker>
                                ))}
                                {areas.map((item, index) => (
                                    <FeatureGroup pathOptions={item.color}>
                                        <Popup>
                                            <p style={{ margin: 0, fontStyle: "italic" }}><strong>Area: </strong>{item.nombre} <strong>Grupo: </strong>{item.grupo}</p>
                                            <Button color='rojo' sx={{ marginTop: 2 }} onClick={() => { eliminarArea(item) }} variant="contained">Eliminar</Button>
                                        </Popup>
                                        <Polygon positions={item.points} />
                                    </FeatureGroup>
                                ))}
                                <Fab color={simulacion.current ? "error":"success"} aria-label="add" sx={{ position: "absolute", bottom: 50, right: 30 }} onClick={iniciarSimulacion}>
                                    {simulacion.current ? <PauseCircleOutlineIcon/>:<PlayCircleOutlineIcon />}
                                </Fab>

                            </MapContainer>
                        </div>
                    </Grid>


                    <Grid item xs={12} md={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Paso</Th>
                                    <Th className='home-t-th'>Duración</Th>
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
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                               
                                    <Th className='home-t-th'>Grupo</Th>
                                    <Th className='home-t-th'>Indicador en Segundos</Th>

                                </Tr>
                            </Thead>
                            <Tbody>

                                {indicadorData.map((dato, index) => (
                                    <Tr className="tablas-focus" key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                
                                        <Td >
                                            {dato.grupo}
                                        </Td>
                                        <Td style={{marginBottom:10}}>
                                            <CustomProgress red={dato.rojo} yellow={dato.amarillo} green={dato.verde} modo={dato.modo} />
                                        </Td>



                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>

                    <Grid item xs={12}>
                        <div className="home-view-footer">

                        </div>
                    </Grid>
                </Grid>

            </Container>

            <Modal isOpen={modalCrearSemaforo} >
                <ModalHeader>
                    <div>
                        <h1>
                            Crear Semaforo
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined"
                                value={newSemaforo.nombre}
                                name='nombre'
                                onChange={handleNewSemaforo}
                                label="Nombre del Semaforo"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Grupos</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Grupos"
                                    name='grupo'
                                    value={newSemaforo.grupo}
                                    onChange={handleNewSemaforo}
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    <MenuItem value={'g1'}>Grupo 1</MenuItem>
                                    <MenuItem value={'g2'}>Grupo 2</MenuItem>
                                    <MenuItem value={'g3'}>Grupo 3</MenuItem>
                                    <MenuItem value={'g4'}>Grupo 4</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" onClick={agregarSemaforo} sx={{ backgroundColor: "#F0B27A", marginLeft: 1 }}>
                        Aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalCrearSemaforo(false) }} sx={{ backgroundColor: "red", marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            {/* <Modal isOpen={modalDeclararSemaforo} >
                <ModalHeader>
                    <div>
                        <h1>
                            Editar Semaforo
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined"
                                value={newController.nombre}
                                name='nombre'
                                onChange={handleNewController}
                                label="Nombre del Semaforo"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>

                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color='anaranjado1' onClick={actualizarDatosControlador} sx={{ marginLeft: 1 }}>
                        Aplicar
                    </Button>
                    <Button variant="contained" color='rojo' onClick={() => { setModalEditControlador(false) }} sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal> */}
            {/* <Modal isOpen={modalDeclararSemaforo} >
                <ModalHeader>
                    <div>
                        <h1>
                            Cambio de Latitud y Longitud
                        </h1>
                    </div>
                </ModalHeader>
            </Modal> */}
            {/* <Modal isOpen={modalDeclararSemaforo} >
                <ModalHeader>
                    <div>
                        <h1>
                            Editar Semaforo
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined"
                                value={newController.nombre}
                                name='nombre'
                                onChange={handleNewController}
                                label="Nombre del Semaforo"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined"
                                value={newController.latitud}
                                name='latitud'
                                type="number"
                                onChange={handleNewController}
                                label="Latitud"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined"
                                value={newController.longitud}
                                name='longitud'
                                type="number"
                                onChange={handleNewController}
                                label="Longitud"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color='anaranjado1' onClick={actualizarDatosControlador} sx={{ marginLeft: 1 }}>
                        Aplicar
                    </Button>
                    <Button variant="contained" color='rojo' onClick={() => { setModalEditControlador(false) }} sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal> */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={accionesUi}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CardController />
            <CardInformation />
        </div>
    );

}

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} checked={props.estado === 'online' ? true : false} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

const point = new L.Icon({
    iconUrl: require('../assets/point2.png'),
    iconRetinaUrl: require('../assets/point2.png'),
    iconSize: [8, 8], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [3, 4], // point of the icon which will correspond to marker's location
    shadowAnchor: [10, 100],  // the same for the shadow
    popupAnchor: [-3, -76]

});
const ubi = new L.Icon({
    iconUrl: require('../assets/ubica.png'),
    iconRetinaUrl: require('../assets/ubica.png'),
    iconSize: [20, 30], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [9, 30], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]

});

const semaforo = new L.Icon({
    iconUrl: require('../assets/semaforo3.png'),
    iconRetinaUrl: require('../assets/semaforo3.png'),
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]

});





const initialData = {
    conflictos_verdes: {},
    dias_especiales: {},
    entradas: {},
    fases: {},
    grupos: {},
    hora_controlador: {},
    horarios: {},
    ip: "",
    mac: "",
    otros_parametros: {},
    planes: {},
    version: {},
    resumen: [
        {
            nombre: "sin nombre",
            rojo: 10,
            amarillo: 4,
            verde: 20,
            grupo: "g1",
            position: [-2.8771059724090122, -78.96612703800203],
            icon: semaforo
        },
        {
            nombre: "sin nombre",
            rojo: 10,
            amarillo: 4,
            verde: 20,
            grupo: "g2",
            position: [-2.8773367771587526, -78.96582663059236],
            icon: semaforo
        },
        {
            nombre: "sin nombre",
            rojo: 10,
            amarillo: 4,
            verde: 20,
            grupo: "g3",
            position: [-2.877974763491086, -78.96494686603546],
            icon: semaforo
        },
        {
            nombre: "sin nombre",
            rojo: 10,
            amarillo: 4,
            verde: 20,
            grupo: "g4",
            position: [-2.876842450523782, -78.9654189348221],
            icon: semaforo
        }
    ]
}




//pasos modo destello
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
const grupo_1 = { color: 'purple' }
const grupo_2 = { color: 'blue' }
const grupo_3 = { color: 'black' }
const grupo_4 = { color: 'orange' }
