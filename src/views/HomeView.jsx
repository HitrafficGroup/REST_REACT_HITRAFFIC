import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { collection, updateDoc, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import UpdateIcon from '@mui/icons-material/Update';
import "../css/HomeView.css"
import CustomProgress from "../components/CustomProgress";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getIpsFromRestApi, getFirmwareVersion } from '../js/apiFunctions'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialStateController,setResumen } from "../features/controlers/controlerSlice";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css';
import swal from 'sweetalert';


export default function HomeView() {
    const [controladores, setControladores] = useState([]);
    const [modalSemaforo, setModalSemaforo] = useState(false);
    const [flagsimu, setFlagsimu] = useState(false);
    const todaInformacion = useRef({});
    const modoControlador = useRef('Tiempo Fijo');
    const simulacion = useRef(false);
    const timer1 = useRef(0);
    const timer2 = useRef(0);
    const faseActual = useRef(0);
    const [pasoexec,setPasoexec] = useState();
    const [currentSemaforo, setCurrentSemaforo] = useState({});
    const [accionesUi, setAccionesUi] = useState(false);
    const center = [-2.876428, -78.965342]
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const [modalCrearSemaforo, setModalCrearSemaforo] = useState(false);
    const [semaforos, setSemaforos] = useState(initialData.resumen);
    const [semaforos3,setSemaforos3] = useState(initialData.resumen)
    const [currentControler, setCurrentControler] = useState({})
    const [pasosActivos, setPasosActivos] = useState([]);
    const [faseexec,setFaseexec] = useState("");
    const [horarioexec,setHorarioexec] = useState("");
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [modoexec,setModoexec] = useState("");
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [allData, setAllData] = useState({});
    const [deshabilitar,setDeshabilitar] = useState(true);

    //prueba semaforo
    const semaforos2 = useRef();
    

    const [newSemaforo, setNewSemaforo] = useState({
        nombre: "",
        position: [],
        rojo: 15,
        amarillo: 5,
        verde: 30,
        icon:{},
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
        setNewSemaforo({
            ...newSemaforo,
            [event.target.name]: event.target.value,
        })


    }
    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, [])
    const markerRef = useRef(null)

   
    const declararControlador = async (mac, ip) => {
        const ref = collection(db, "controladores");
        let datosFormat = initialData
        datosFormat.resumen = initialResumen
        await setDoc(doc(ref, mac), datosFormat);
    }
    const seleccionarControlador = async (data) => {
        try {
            
            simulacion.current = false;
            setFlagsimu(false);
            setCurrentControler(data);
            dispatch(setInitialStateController(data));
            let aux = await getFirmwareVersion(data.mac, data.ip);
            let firmware = aux[data.mac]
            enviarVersionFirebase(data.mac, data.ip, firmware);
            onSnapshot(doc(db, "controladores", `${data.mac}`), (doc) => {
                if (doc.exists()) {
                    let gruposController = doc.data().resumen
                    let aux = gruposController.map((item) => {
                        if (item.grupo === "g1") {
                            item['icon'] = semaforo;
                        }
                        else if (item.grupo === "g2") {
                            item['icon'] = semaforo;
                        }
                        else if (item.grupo === "g3") {
                            item['icon'] = semaforo;
                        } else {
                            item['icon'] = semaforo;
                        }
                        return item
                    })
                 
                    semaforos2.current = aux;
                    setSemaforos(aux);
                    setAllData(doc.data());
                    todaInformacion.current = doc.data()
                    parametrosCorriendo();
                } else {
                    declararControlador(data.mac, data.ip);
                 
                }
                //setSemaforos(doc.data().grupos)
            });
            swal({
                title: "Conectado!",
                text: "Controlador Seleccionado Con Exito",
                icon: "success",
    
            });
            const controls = controladores.map(item => {
                if (item.mac === data.mac) {
                    item['seleccionado'] = true
                } else {
                    item['seleccionado'] = false
                }
                return (item);
            })
            setControladores(controls)
            setDeshabilitar(false)
        } catch (error) {
            setDeshabilitar(false)
        }

    }
    const enviarVersionFirebase = async (mac, ip, firmware) => {
        const ref = doc(db, "controladores", `${mac}`);
        await updateDoc(ref, {
            mac: mac,
            ip: ip,
            version: firmware
        });
    }

    const returnModo = (data) =>{
        if(data === 1){
            return 'Tiempo Fijo'
        }
        else if(data === 2){
            return 'Pulsante'
        }
        else if(data === 3){
            return 'Destello'
        }
        else if(data === 4){
            return 'Todo en Rojo'
        }
        else{
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
                        {draggable
                            ? 'Marker is draggable'
                            : 'Click here to make marker draggable'}
                    </span>
                </Popup>
            </Marker>
        )
    }

    const listarIps = async () => {
        try {
            setAccionesUi(true);
            setControladores([]);
            const doc = await getIpsFromRestApi();
            const ips = doc.Ips_disponibles;
            var controladores = ips.map(item => {
                item['seleccionado'] = false
                return (item);
            })
            setControladores(controladores);
            setAccionesUi(false)
    
        } catch (error) {
            setAccionesUi(false)
            
        }
    }
    const agregarSemaforo = async () => {
        var data = newSemaforo;
        data['position'] = [position.lat,position.lng];
        const temp = semaforos
        var aux = temp.filter((item) => {
            return item.grupo !== data.grupo;
        })
        aux.push(data)
       

        var semaforosFormateados = aux.map(sema=>({
            nombre: sema.nombre,
            position:   sema.position,
            rojo: sema.rojo,
            amarillo: sema.amarillo,
            verde: sema.verde,
            icon:{},
            grupo: sema.grupo
        }))
  
        const ref = doc(db, "controladores", `${controlerState.mac}`);
        setAccionesUi(true)
        await updateDoc(ref, {
             resumen: semaforosFormateados
         });
         setAccionesUi(false)
        setNewSemaforo({
            nombre: "",
            position: [],
            rojo: 15,
            amarillo: 5,
            verde: 30,
            icon:{},
            grupo: '',
        })
        setModalCrearSemaforo(false);
    }
    
    const cerrarEditarSemaforo = () => {
        setModalSemaforo(false);
    }
 
    const iniciarSimulacion = () => {
        simulacion.current = !simulacion.current;
        if (simulacion.current) {

            parametrosCorriendo()
        }
        setFlagsimu(!flagsimu);
        setBtnAgregar(simulacion.current)

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

    const parametrosCorriendo = () => {
        
        let dia_ordinario = todaInformacion.current.horarios.dia_ordinario;
        let planes = todaInformacion.current.planes
        let hora_actual = new Date();
        let horas = hora_actual.getHours();
        let minutos = hora_actual.getMinutes();
        let aux;
        let aux2;
        let indice;
        let temp;
        let ref;
        
        for(let i=0;i<16;i++) {
             aux = parseInt(dia_ordinario[i].horas)
             aux2 = parseInt(dia_ordinario[i].minutos)
             temp = aux*100 + aux2
             ref = horas*100 + minutos
            if(horas === aux){
                indice = i
                break
            }
            else if (temp >= ref) {
                indice = i-1
                break
            }else if(temp!== 0 && temp > ref){
                
                indice = i
                break
                
            }else if(aux !== 0){
                indice = i
               
            }
        }


        setHorarioexec(dia_ordinario[indice]);
        let modo = returnModo(dia_ordinario[indice].mod)
        setModoexec(modo)
        modoControlador.current = modo
        let plan_activo = dia_ordinario[indice].plan
        let planname = `plan${plan_activo}`
        let plan_filter = planes.filter(_plan => _plan.numPlan === planname)
        let pasos = plan_filter[0].pasos
        var pasos_habilitados = pasos.filter((item) => {
            if (item.duracion > 0) {
                return item;
            }
        })
       
        let fases = todaInformacion.current.fases

        var pasos_temp = pasos_habilitados
        var fases_pasos = pasos_temp.map((item) =>{
            let aux2 = fases.find(_item => _item.faseNum === item.fase)
            let obj_mod = {
                duracion: item.duracion,
                fase: item.fase,
                grupos: item.grupos,
                name: item.name
            }
            let grupos_aux = aux2.grupos
     
            if(modo === 'Destello'){
                grupos_aux  = aux2.grupos.map(item=>{
                    item['colorDescripcion'] = 'amarillo'
                    return item
                })
                obj_mod['grupos'] = grupos_aux
            
            }else if(modo === 'Todo en Rojo'){
                grupos_aux  = aux2.grupos.map(item=>{
                    item['colorDescripcion'] = 'rojo'
                    return item
                })
                obj_mod['grupos'] = grupos_aux
            }
            else{
                
                obj_mod['grupos'] = grupos_aux
            }
            return obj_mod
            
    })
    
        let resumen ={
            horas: dia_ordinario[indice].horas,
            minutos: dia_ordinario[indice].minutos,
            plan: dia_ordinario[indice].plan,
            pasos:fases_pasos,
            modo: modo,
        }
        dispatch(setResumen(resumen));

        let auxg1;
        let auxg2;
        let auxg3;
        let auxg4;
        let objg1 = {verde:0,rojo:0}
        let objg2 = {verde:0,rojo:0}
        let objg3 = {verde:0,rojo:0}
        let objg4 = {verde:0,rojo:0}
        
        for(let i1 = 0 ;i1 < pasos_habilitados.length;i1++){
            auxg1 = fases_pasos[i1].grupos[0].color
            auxg2 = fases_pasos[i1].grupos[1].color
            auxg3 = fases_pasos[i1].grupos[2].color
            auxg4 = fases_pasos[i1].grupos[3].color
            if(auxg1 === 1){
                objg1.verde = objg1.verde + fases_pasos[i1].duracion
            }else{
                objg1.rojo = objg1.rojo + fases_pasos[i1].duracion 
            }
            if(auxg2 === 1){
                objg2.verde = objg2.verde + fases_pasos[i1].duracion
            }else{
                objg2.rojo = objg2.rojo + fases_pasos[i1].duracion 
            }
            if(auxg3 === 1){
                objg3.verde = objg3.verde + fases_pasos[i1].duracion
            }else{
                objg3.rojo = objg3.rojo + fases_pasos[i1].duracion 
            }
            if(auxg4 === 1){
                objg4.verde = objg4.verde + fases_pasos[i1].duracion
            }else{
                objg4.rojo = objg4.rojo + fases_pasos[i1].duracion 
            }
        }
        var ejemplo = semaforos2.current
        var newDataUpdate = ejemplo.map((item) =>{
            if(item.grupo === 'g1'){
                item['rojo'] = objg1.rojo
                item['verde'] = objg1.verde
            }else if(item.grupo === 'g2'){
                item['rojo'] = objg2.rojo
                item['verde'] = objg2.verde
            }else if(item.grupo === 'g3'){
                item['rojo'] = objg3.rojo
                item['verde'] = objg3.verde
            }else{
                item['rojo'] = objg4.rojo
                item['verde'] = objg4.verde
            }
           //item['icon'] = {}
            return item
        })
     
        setSemaforos3(newDataUpdate)

      
        timer1.current = 0
      
        setPasosActivos(fases_pasos)
        faseActual.current = fases_pasos

        //setSemaforo()
       

    }

    const iniciarAnimacion = () =>{
        let g1;
        let g2;
        let g3;
        let g4;
        let dataUpdated;
        let aux;
   
        if(modoControlador.current ===  'Destello' ){
            
            if(timer1.current > 1){
                g1 = amarillo
                g2 = amarillo
                g3 = amarillo
                g4 = amarillo
                timer1.current = 0
              
            }else{
                g1 = apagado
                g2 = apagado
                g3 = apagado
                g4 = apagado
          
            }
            setFaseexec(1)
            setPasoexec('Paso 2')
            aux = semaforos2.current
            dataUpdated = aux.map((item) => {
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
            setSemaforos(dataUpdated);
        }else if(modoControlador.current ===  'Todo en Rojo'){
            if(timer1.current > 1){
                g1 = rojo
                g2 = rojo
                g3 = rojo
                g4 = rojo
                timer1.current = 0
              
            }else{
                g1 = apagado
                g2 = apagado
                g3 = apagado
                g4 = apagado
          
            }
            setFaseexec(1)
            setPasoexec('Paso 2')
            aux = semaforos2.current
            dataUpdated = aux.map((item) => {
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
            setSemaforos(dataUpdated);

        }
        else{

            g1 = devolverColor(faseActual.current[timer2.current].grupos[0].colorDescripcion);
            g2 = devolverColor(faseActual.current[timer2.current].grupos[1].colorDescripcion);
            g3 = devolverColor(faseActual.current[timer2.current].grupos[2].colorDescripcion);
            g4 = devolverColor(faseActual.current[timer2.current].grupos[3].colorDescripcion);
            aux = semaforos2.current
            setFaseexec(faseActual.current[timer2.current].fase)
            setPasoexec(faseActual.current[timer2.current].name)
            dataUpdated = aux.map((item) => {
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
            setSemaforos(dataUpdated);
        
            if(timer1.current >= faseActual.current[timer2.current].duracion){
                timer2.current= timer2.current + 1
                if(timer2.current === faseActual.current.length){
                    timer2.current = 0
                }
                timer1.current = 0     
            }
        }
    }


    useEffect(() => {
        const interval = setInterval(() => {

            if (simulacion.current) {
                //cambiarSemaforo();
                iniciarAnimacion();
                timer1.current = timer1.current + 1;

            }

        }, 1000);

      
        return () => clearInterval(interval);
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
                                    <Th className='home-t-th'>Ip</Th>
                                    <Th className='home-t-th'>Mac</Th>
                                    <Th className='home-t-th'>status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {controladores.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td >
                                            <Button variant="contained" disabled={accionesUi} color={dato.seleccionado ? 'verde2' : 'seleccion'} onClick={() => { seleccionarControlador(dato) }} >SELECCIONAR</Button>
                                        </Td>
                                        <Td >
                                            {dato.ip}
                                        </Td>
                                        <Td >
                                            {dato.mac}
                                        </Td>
                                        <Td >
                                           <FormControlLabel
                                                control={<IOSSwitch sx={{ m: 1 }}  estado={dato.status} />}
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
           
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined" focused value={position.lat} label="Latitud" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="outlined" focused value={position.lng} label="Longitud" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button variant="contained" startIcon={<UpdateIcon />} disabled={btnAgregar} onClick={() => { setModalCrearSemaforo(true) }} color="azulm" fullWidth sx={{ height: "100%" }}>Agregar</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" disabled={deshabilitar} fullWidth sx={{height:"100%"}}  startIcon={flagsimu ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />} color={flagsimu ? 'verde' : 'morado1'} onClick={iniciarSimulacion}>Simular</Button>
                    </Grid>
                 

                    <Grid item xs={12} md={12}>
                        <div className="map">
                            <MapContainer center={position} zoom={19} scrollWheelZoom={false} className='map-container'>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <DraggableMarker />
                                {semaforos.map((item, index) => (

                                    <Marker position={item.position} key={index} icon={item.icon}>
                                        <Popup>
                                            Semaforo {item.nombre} - Grupo: {item.grupo}
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Alert severity="success">
                            <strong>Plan Activo:</strong>    {horarioexec.plan}    <strong>Horario:</strong>    {horarioexec.horas+':'+horarioexec.minutos}    <strong>Modo:</strong> {modoexec}
                        </Alert>
                    </Grid>
                    <Grid item xs={6}>
                        <Alert severity="info">
                            Se esta Ejecutando - <strong>Fase{faseexec} y {pasoexec}</strong> 
                        </Alert>
                    </Grid>
                    <Grid item xs={12} md={12}>
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
                                {pasosActivos.map((dato, index) => (
                                    <Tr key={index} >
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
                                                <Tr>
                                                    <Td> <Chip label={dato.grupos[0].colorDescripcion} sx={{width:70,marginRight:1}} color={dato.grupos[0].colorDescripcion} /></Td>
                                                    <Td> <Chip label={dato.grupos[1].colorDescripcion} sx={{width:70,marginRight:1}} color={dato.grupos[1].colorDescripcion} /></Td>
                                                    <Td> <Chip label={dato.grupos[2].colorDescripcion} sx={{width:70,marginRight:1}} color={dato.grupos[2].colorDescripcion} /></Td>
                                                    <Td> <Chip label={dato.grupos[3].colorDescripcion} sx={{width:70,marginRight:1}} color={dato.grupos[3].colorDescripcion} /></Td>
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
                                    <Th className='home-t-th'>Semaforo</Th>
                                    <Th className='home-t-th'>Grupo</Th>
                                    <Th className='home-t-th'>Indicador en Segundos</Th>
                                   
                                </Tr>
                            </Thead>
                            <Tbody>
                                
                            {semaforos3.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td >
                                            {dato.nombre}
                                        </Td>
                                        <Td >
                                            {dato.grupo}
                                        </Td>
                                        <Td >
                                            <CustomProgress red={dato.rojo} yellow={dato.amarillo} green={dato.verde} />
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
                <Modal isOpen={modalSemaforo} >
                    <ModalHeader>
                        <div>
                            <h1>
                                Ajustes del Semaforo
                            </h1>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField id="outlined" value={currentSemaforo.rojo} label="Tiempo en Rojo" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined" value={currentSemaforo.amarillo} label="Tiempo en Amarillo" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined" value={currentSemaforo.verde} label="Tiempo en Verde" variant="outlined" fullWidth />
                            </Grid>
                        </Grid>
                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" onClick={cerrarEditarSemaforo} sx={{ backgroundColor: "#F0B27A", marginLeft: 1 }}>
                            Aplicar
                        </Button>
                    </ModalFooter>
                </Modal>
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
                    <Button variant="contained" onClick={()=>{setModalCrearSemaforo(false)}} sx={{ backgroundColor: "red", marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={accionesUi}>
            <CircularProgress color="inherit" />
        </Backdrop>
        </div>
    );

}

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} checked={props.estado === 'online'? true:false}  />
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
const ubi = new L.Icon({
    iconUrl: require('../assets/ubica.png'),
    iconRetinaUrl: require('../assets/ubica.png'),
    iconSize: [20, 30], // size of the icon
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


const initialResumen =  [
    {
        nombre: "sin nombre",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g1",
        position: [-2.8771059724090122, -78.96612703800203],
        icon: {}
    },
    {
        nombre: "sin nombre",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g2",
        position: [-2.8773367771587526, -78.96582663059236],
        icon: {}
    },
    {
        nombre: "sin nombre",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g3",
        position: [-2.877974763491086, -78.96494686603546],
        icon: {}
    },
    {
        nombre: "sin nombre",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g4",
        position: [-2.876842450523782, -78.9654189348221],
        icon: {}
    }
]