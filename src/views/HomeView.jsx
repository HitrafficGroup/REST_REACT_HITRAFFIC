import React, { useState, useMemo, useCallback, useRef,useEffect } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { collection, updateDoc, onSnapshot, doc } from "firebase/firestore";
import Grid from '@mui/material/Grid';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import TextField from '@mui/material/TextField';
import { db } from "../firebase/firebase-config";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import UpdateIcon from '@mui/icons-material/Update';
import "../css/HomeView.css"
import CustomProgress from "../components/CustomProgress";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getIpsFromRestApi,getFasesFromRestApi,getPlanesFromRestApi } from '../js/apiFunctions'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector,useDispatch } from 'react-redux';
import {addFases,addPlanes,setInitialStateController} from "../features/controlers/controlerSlice"
// dependencias del custom Map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css';
import swal from 'sweetalert';

export default function HomeView() {
    const [controladores, setControladores] = useState([]);
    const [modalSemaforo, setModalSemaforo] = useState(false);
    const [nombreSemaforo, setNombreSemaforo] = useState('');
    const [currentSemaforo, setCurrentSemaforo] = useState({});
    const [modal, setModal] = useState(false);
    const [accionesUi, setAccionesUi] = useState(false);
    const center = [-2.889889285482916, -78.96312349450281]
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const [modalCrearSemaforo, setModalCrearSemaforo] = useState(false);
    const [semaforos, setSemaforos] = useState([]);
    const [currentControler, setCurrentControler] = useState({})
    const [btnAgregar, setBtnAgregar] = useState(true);
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
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
                }else{
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
    const semaforo = new L.Icon({
        iconUrl: require('../assets/semaforo3.png'),
        iconRetinaUrl: require('../assets/semaforo3.png'),
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
    const toggle = () => setModal(!modal);
    
    const abrirSemaforoModal = (data) => {
        console.log(data);
        setCurrentSemaforo(data);
        setModalSemaforo(true);

    }

    const seleccionarControlador = (data) => {
        setCurrentControler(data);
        dispatch(setInitialStateController(data));
        onSnapshot(doc(db, "controladores", `${data.mac}`), (doc) => {
            if(doc.exists()){
                setSemaforos(doc.data().grupos)
            }else{
                console.log('no existe')
            }
            //setSemaforos(doc.data().grupos)
        });
        swal({
            title: "Felicidades!",
            text: "Controlador Seleccionado Con Exito",
            icon: "success",
    
          });
        const controls =  controladores.map(item =>{
            if(item.mac === data.mac){
                item['seleccionado'] = true
            }else{
                item['seleccionado'] = false
            }
            return(item);
        })
        

      
        
    }
   
    useEffect(() => {
        console.log(controlerState);
    }, [])




    const DraggableMarker = () => {



        return (
            <Marker
                icon={ubi}
                draggable={true}
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
        var controladores = ips.map(item =>{
            item['seleccionado'] = false
            return(item);
        })
     
        setControladores(controladores);
        setAccionesUi(false)
    }
    const agregarSemaforo = async() => {
        var data = newSemaforo
        data['lat'] = position.lat;
        data['lng'] = position.lng;
        data['pos'] = [position.lat,position.lng]
        var aux = semaforos.filter((item)=>{
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

    return (
        <div>
            <Container maxWidth="md">
                <h2>Lista De Controladores</h2>
                <Button variant="contained" disabled={accionesUi} endIcon={<CloudDownloadIcon />}  onClick={listarIps} sx={{ marginBottom: 2 }}>
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
                                            <Button variant="contained" disabled={accionesUi}  color={dato.seleccionado ? 'verde2':'seleccion'} onClick={() => { seleccionarControlador(dato) }} >SELECCIONAR</Button>
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
                    <Grid item xs={12} md={12}>
                        <div className="map">
                            <MapContainer center={position} zoom={19} scrollWheelZoom={false} className='map-container'>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <DraggableMarker />
                                {semaforos.map((item,index) =>(
                                    
                                    <Marker position={item.pos}  icon={semaforo}>
                                        <Popup>
                                            A pretty CSS3 popup. <br /> Easily customizable.
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

                        <TextField id="outlined" focused value={position.lng} label="Longitud" variant="outlined" fullWidth  />

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" startIcon={<UpdateIcon />} disabled={btnAgregar}  onClick={() => { setModalCrearSemaforo(true) }} color="azulm" fullWidth sx={{ height: "100%" }}>Agregar</Button>
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
