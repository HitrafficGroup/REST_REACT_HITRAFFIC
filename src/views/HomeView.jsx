import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { collection, updateDoc, onSnapshot, doc,getDoc,setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import TextField from '@mui/material/TextField';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import UpdateIcon from '@mui/icons-material/Update';
import "../css/HomeView.css"
import CustomProgress from "../components/CustomProgress";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getIpsFromRestApi, getFirmwareVersion , getAllDataIp} from '../js/apiFunctions'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import { addFases, addPlanes, setInitialStateController } from "../features/controlers/controlerSlice";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
// dependencias del custom Map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css';
import swal from 'sweetalert';

export default function HomeView() {
    const [controladores, setControladores] = useState([]);
    const [modalSemaforo, setModalSemaforo] = useState(false);
    const [flagsimu,setFlagsimu] = useState(false);
    const simulacion = useRef(false);
    const tsimu = useRef(false);
    const timer1 = useRef(0);
    const timer2 = useRef(0);
    const faseActual = useRef(0);
    const [counter, setCounter] = useState(1);
    const [nombreSemaforo, setNombreSemaforo] = useState('');
    const [currentSemaforo, setCurrentSemaforo] = useState({});
    const [modal, setModal] = useState(false);
    const [accionesUi, setAccionesUi] = useState(false);
    const center = [-2.876428, -78.965342]
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const [modalCrearSemaforo, setModalCrearSemaforo] = useState(false);
    const [semaforos, setSemaforos] = useState([]);
    const [currentControler, setCurrentControler] = useState({})
    const [grupo1,setGrupo1] = useState(rojo);
    const [grupo2,setGrupo2] = useState(verde);
    const [grupo3,setGrupo3] = useState(amarillo);
    const [grupo4,setGrupo4] = useState(rojo);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [allData,setAllData] = useState({});
    const [temporizador,setTemporizador] = useState(0);
    //prueba semaforo
    const semaforos2 =  useRef();
   
    const [newSemaforo, setNewSemaforo] = useState({
        nombre: "",
        lat: 0,
        lng: 0,
        pos: [],
        rojo: 15,
        amarillo: 5,
        verde: 30,
        fase: 3,
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
  
    const toggle = () => setModal(!modal);
    const getAllDataController = async (mac) => {
        const docRef = doc(db, "controladores",`${mac}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setAllData(docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    const abrirSemaforoModal = (data) => {
        console.log(data);
        setCurrentSemaforo(data);
        setModalSemaforo(true);

    }
    const declararControlador = async(mac,ip) =>{
        const ref = collection(db, "controladores");
        await setDoc(doc(ref,mac),initialData);
    }
    const seleccionarControlador = async (data) => {
        simulacion.current = false;
        setFlagsimu(false);
        setCurrentControler(data);
        dispatch(setInitialStateController(data));
        let aux = await getFirmwareVersion(data.mac, data.ip);
        let firmware = aux[data.mac]
        enviarVersionFirebase(data.mac, data.ip, firmware);
        onSnapshot(doc(db, "controladores", `${data.mac}`), (doc) => {
            if(doc.exists()){
                let gruposController = doc.data().resumen
                let aux = gruposController.map((item) =>{
                    if(item.grupo === "g1"){
                        item['icon'] = semaforo;
                    }
                    else if(item.grupo === "g2"){
                        item['icon'] = semaforo;
                    }
                    else if(item.grupo === "g3"){
                        item['icon'] = semaforo;
                    }else{
                        item['icon'] = semaforo;
                    }
                    return item
                })
                console.log(aux);
                semaforos2.current = aux;
                setSemaforos(aux);
                setAllData(doc.data())
            }else{
                declararControlador(data.mac,data.ip);
                console.log('no existe')
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




    }
    const enviarVersionFirebase = async (mac, ip, firmware) => {
        const ref = doc(db, "controladores", `${mac}`);
        await updateDoc(ref, {
            mac: mac,
            ip: ip,
            version: firmware
        });
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
        setAccionesUi(true);
        setControladores([]);
        const doc = await getIpsFromRestApi();
        const ips = doc.data.Ips_disponibles;
        var controladores = ips.map(item => {
            item['seleccionado'] = false
            return (item);
        })

        setControladores(controladores);
        setAccionesUi(false)
    }
    const agregarSemaforo = async () => {
        var data = newSemaforo
        data['lat'] = position.lat;
        data['lng'] = position.lng;
        data['pos'] = [position.lat, position.lng]
        var aux = semaforos.filter((item) => {
            return item.grupo !== data.grupo;
        })
        aux.push(data)
        console.log(aux);
        const ref = doc(db, "controladores", `${currentControler.mac}`);

        // Set the "capital" field of the city 'DC'
        await updateDoc(ref, {
            grupos: aux
        });


        setModalCrearSemaforo(false);
    }
    const cerrarEditarSemaforo = () => {
        setModalSemaforo(false);
    }
    const cambiarSemaforo = () =>{
        
        let interval = Math.floor(Math.random() * 3);
        let g1 = rojo ;
        let g2 = verde ;
        let g3 =rojo ;
        let g4 =verde ;
        if(interval === 1){
            g1 = rojo;
            g2 = rojo;
            g3 = rojo;
            g4 = rojo;
        }else if(interval === 2){
            g1 = verde;
            g2 = verde;
            g3 = verde;
            g4 = verde;
        }else if(interval === 3){
            g1 = amarillo;
            g2 = amarillo;
            g3 = amarillo;
            g4 = amarillo;
        }else{
             g1 = verde;
             g2 = amarillo;
             g3 = verde;
             g4 = rojo;
        }
        let aux = semaforos2.current
       
        let dataUpdated = aux.map((item)=>{
            if(item.grupo === "g1"){
                item['icon'] = g1;
            }else if(item.grupo === "g2"){
                item['icon'] = g2;
            }else if(item.grupo === "g3"){
                item['icon'] = g3;
            }else if(item.grupo === "g4"){
                item['icon'] = g4;
            }
            return item
        })

        setSemaforos(dataUpdated);
        //setSemaforos(dataUpdated);
        
    }
    const iniciarSimulacion = () =>{
        simulacion.current = !simulacion.current;
        timer1.current = 0;
        setFlagsimu(!flagsimu);
        setBtnAgregar(simulacion.current)

    }
    
    const devolverColor = (_data) => {
        if(_data === "verde" ){
            return verde
        }else if(_data === "rojo" ){
            return rojo
        }else{
            return amarillo
        }

    }
   
    const pruebasimu = async()=>{
       
        let dia_ordinario = allData.horarios.dia_ordinario;
        let planes =  allData.planes
        let hora_actual = new Date();
        let horas =  hora_actual.getHours();
        let limsup ;
        let liminf ;
        let indice;
        let indice_requerido;
        dia_ordinario.map((item,index)=>{
            let aux =  parseInt(item.horas)
           
            if(aux >= horas){
                indice= index
            }
        })
        limsup = indice;
        liminf = indice-1;
        if(limsup === undefined){
            indice_requerido = liminf;
        }else{
            indice_requerido = limsup;
        }
        
        let plan_activo =  dia_ordinario[indice_requerido].plan
        let planname = `plan${plan_activo}`
        let plan_filter = planes.filter(_plan => _plan.numPlan === planname)
        let pasos = plan_filter[0].pasos
        let pasos_habilitados = pasos.filter((item) =>{
            if(item.duracion >0){
                return item;
            }
        })
        

        
        let fases = allData.fases
        let fases_pasos = pasos_habilitados.map(item =>{
            let aux2 = fases.filter(_item => _item.faseNum === item.fase);
            item['grupos'] = aux2[0].grupos
            return item
        })
    
        faseActual.current = fases_pasos
     
        //setSemaforo()
        
        let datosal = await getAllDataIp(controlerState.mac , controlerState.ip);
        let cutiempo = datosal[controlerState.mac].runtime[controlerState.mac].Tiempo_restante;
        let cufase = datosal[controlerState.mac].runtime[controlerState.mac].Fase_ejecucion;


        tsimu.current = cutiempo
        console.log(cutiempo)
        
    }
    const cambiarSemaforo2 = () =>{
        let g1 ;
        let g2 ;
        let g3 ;
        let g4 ;
        let dataUpdated ;
        let aux;
        let total_tiempo = faseActual.current[0].duracion + faseActual.current[1].duracion
        if(timer1.current >= faseActual.current[0].duracion && timer1.current <= total_tiempo){
            g1 = devolverColor(faseActual.current[1].grupos[0].colorDescripcion) ;
            g2 = devolverColor(faseActual.current[1].grupos[1].colorDescripcion) ;
            g3 = devolverColor(faseActual.current[1].grupos[2].colorDescripcion) ;
            g4 = devolverColor(faseActual.current[1].grupos[3].colorDescripcion) ;
            aux = semaforos2.current
       
            dataUpdated = aux.map((item)=>{
                if(item.grupo === "g1"){
                    item['icon'] = g1;
                }else if(item.grupo === "g2"){
                    item['icon'] = g2;
                }else if(item.grupo === "g3"){
                    item['icon'] = g3;
                }else if(item.grupo === "g4"){
                    item['icon'] = g4;
                }
                return item
            })
    
            setSemaforos(dataUpdated);
           

        }
        else if(timer1.current <= 2){
            
            g1 = devolverColor(faseActual.current[0].grupos[0].colorDescripcion) ;
            g2 = devolverColor(faseActual.current[0].grupos[1].colorDescripcion) ;
            g3 = devolverColor(faseActual.current[0].grupos[2].colorDescripcion) ;
            g4 = devolverColor(faseActual.current[0].grupos[3].colorDescripcion) ;
            aux = semaforos2.current
       
            dataUpdated = aux.map((item)=>{
                if(item.grupo === "g1"){
                    item['icon'] = g1;
                }else if(item.grupo === "g2"){
                    item['icon'] = g2;
                }else if(item.grupo === "g3"){
                    item['icon'] = g3;
                }else if(item.grupo === "g4"){
                    item['icon'] = g4;
                }
                return item
            })
    
            setSemaforos(dataUpdated);
            
        }else if(timer1.current >=41){
            timer1.current = 0;
            console.log("se reinicia el periodo")
        }
       
    }
    useEffect(() => {
        const interval = setInterval(() => {
           
            if(simulacion.current){
                //cambiarSemaforo();
                cambiarSemaforo2();
                timer1.current = timer1.current +1;

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
                                            {dato.status}
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
                    {/* <Grid item xs={12} md={8}>
                        <TextField id="outlined-basic" label="Tiempo Umbral de Cache" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4}  >
                        <Button variant="contained" startIcon={<UpdateIcon />} onClick={leerDatosFases} color="verde2" fullWidth sx={{ height: "100%" }}>ACTUALIZAR</Button>
                    </Grid> */}
                     <Grid item xs={6}>
                        <Button  variant="contained" startIcon={flagsimu ? <PauseCircleOutlineIcon/>:<PlayCircleOutlineIcon/>} color={flagsimu ? 'verde':'morado1'} onClick={iniciarSimulacion}>Visualizar Funcionamiento</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button  variant="contained"  onClick={pruebasimu}>prueba</Button>
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
                    <Grid item xs={12} md={4}>

                        <TextField id="outlined" focused value={position.lat} label="Latitud" variant="outlined" fullWidth />

                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField id="outlined" focused value={position.lng} label="Longitud" variant="outlined" fullWidth />

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" startIcon={<UpdateIcon />} disabled={btnAgregar} onClick={() => { setModalCrearSemaforo(true) }} color="azulm" fullWidth sx={{ height: "100%" }}>Agregar</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Semaforo</Th>
                                    <Th className='home-t-th'>Grupo</Th>
                                    <Th className='home-t-th'>Indicador en Segundos</Th>
                                    <Th className='home-t-th'>Editar</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {semaforos.map((dato, index) => (
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

                                        <Td >
                                            <Button variant="contained" sx={{ backgroundColor: "#F0B27A", marginLeft: 2 }} onClick={() => { abrirSemaforoModal(dato) }} >EDITAR</Button>
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
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>
                        Do Something
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
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
                                    <MenuItem value={'G1'}>Grupo 1</MenuItem>
                                    <MenuItem value={'G2'}>Grupo 2</MenuItem>
                                    <MenuItem value={'G3'}>Grupo 3</MenuItem>
                                    <MenuItem value={'G4'}>Grupo 4</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" onClick={agregarSemaforo} sx={{ backgroundColor: "#F0B27A", marginLeft: 1 }}>
                        Aplicar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );

}

const initialData = {
    conflictos_verdes:{},
    dias_especiales:{},
    entradas:{},
    fases:{},
    grupos:{},
    hora_controlador:{},
    horarios:{},
    ip:"",
    mac:"",
    otros_parametros:{},
    planes:{},
    version:{},
    resumen:[
        {
            nombre:"sin nombre",
            rojo:10,
            amarillo:4,
            verde:20,
            grupo:"g1",
            position:[-2.8771059724090122,-78.96612703800203],
            icon:{}
        },
        {
            nombre:"sin nombre",
            rojo:10,
            amarillo:4,
            verde:20,
            grupo:"g2",
            position:[-2.8773367771587526,-78.96582663059236],
            icon:{}
        },
        {
            nombre:"sin nombre",
            rojo:10,
            amarillo:4,
            verde:20,
            grupo:"g3",
            position:[-2.877974763491086,-78.96494686603546],
            icon:{}
        },
        {
            nombre:"sin nombre",
            rojo:10,
            amarillo:4,
            verde:20,
            grupo:"g4",
            position:[-2.876842450523782,-78.9654189348221],
            icon:{}
        }
    ]
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
const ubi = new L.Icon({
    iconUrl: require('../assets/ubica.png'),
    iconRetinaUrl: require('../assets/ubica.png'),
    iconSize: [20, 30], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]

});