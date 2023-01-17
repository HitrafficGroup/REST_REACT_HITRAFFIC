import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import L from 'leaflet';
import { db } from "../firebase/firebase-config";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { setNameMenu } from '../features/menu/menuSlice';
import { reloadIps } from '../features/controlers/controlerSlice';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { doc, setDoc } from "firebase/firestore"; 
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Backdrop from '@mui/material/Backdrop';
import { useDispatch  } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
export default function DeclararControladorView() {
    const controlerState = useSelector(state => state.controlers)
    const [grupo,setGrupo] = useState("");
    const center = [-2.876428, -78.965342]
    const [position, setPosition] = useState(center);
    const [reloadMap,setReloadMap] = useState(false);
    const [latitud,setLatitud] = useState(-2.876428);
    const [longitud,setLongitud] = useState(-78.965342)
    const [flagCargando,setFlagCargando] = useState(false);
    const [draggable, setDraggable] = useState(false)
    const [nombreSemaforo,setNombreSemaforo] = useState("");
    const [nombreControlador,setNombreControlador]  = useState("");
    const [semaforos,setSemaforos] = useState(semaforosIniciales);
    const markerRef = useRef(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        dispatch(setNameMenu("Dashboard Hitraffic"))
        dispatch(reloadIps())
        navigate(referencia);
    }
    const declararControlador = async()=>{
        Swal.fire({
            title: 'Creacion de controlador',
            text: "Se va a crear el siguiente controlador",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
          }).then(async(result) => {
            if (result.isConfirmed) {
            let  ip = controlerState.nuevo_controlador.ip 
            console.log(controlerState.nuevo_controlador.ip)
            if(ip === "" || ip === undefined ){
 
                Swal.fire(
                    'Error No Ip',
                    'Salga de la ventana y vuelva a entrar ! ',
                    'error'
                    )
            }else{
                if(nombreControlador !== ""){

                    let resumen_aux =  JSON.parse(JSON.stringify(semaforos))   
                    let aux_1 = resumen_aux.map(function(element){
                        element.icon = {}
                        return element ;
                    }) 
                  
                    let parametrosIniciales = {
                        // parametros inicializados por defecto
                        resumen:aux_1,
                        t_fases:1667372400000,
                        t_horarios: 1667372400000,
                        t_peticion: 1667372400000,
                        t_planes: 1667372400000,
                        ip:ip,
                        mac:controlerState.nuevo_controlador.mac,
                        informacion:{
                            nombre:nombreControlador,
                            ubicacion:[latitud,longitud]
                        },
                        // parametros que se iran llenando conforme actualice el controlador
                        version: {},
                        conflictos_verdes:{},
                        dias_especiales:{},
                        entradas:{},
                        fases:{},
                        grupos:{},
                        hora_controlador:{},
                        horarios:{},
                        
                        otros_parametros:{},
                        planes:{},
    
                    }
                    let historialControladorData = {
                        nombre:nombreControlador,
                        latitud:latitud,
                        longitud:longitud,
                        mac:controlerState.nuevo_controlador.mac,
                    }
                    try {
                        setFlagCargando(true);
                        await setDoc(doc(db, "controladores",controlerState.nuevo_controlador.mac ), parametrosIniciales);
                        await setDoc(doc(db, "historial_controladores",controlerState.nuevo_controlador.mac ), historialControladorData);
                        Swal.fire(
                            'Exito',
                            'Controlador Declarado! ',
                            'success'
                            )
                        setFlagCargando(false);
                        Changeview('/david-diaz/home')
                    } catch (error) {
                        Swal.fire(
                            'Error',
                            `Error: ${error}`,
                            'error'
                            )
                            setFlagCargando(false);
                    }
                }else{
                      Swal.fire(
                        'Falta el Nombre',
                        'Llene el nombre del Controlador ! ',
                        'warning'
                        )
                }
            }
            }
          })
        }
        const encontrarUbicacion =()=>{
            let aux = [latitud,longitud]
            setPosition(aux)
            setReloadMap(!reloadMap)
        }
  
        const agregarSemaforo =()=>{
            
            let aux  = semaforos
            let newObjeto = {
                position: position,
                grupo:grupo,
                amarillo:4,
                rojo:10,
                verde:20,
                icon: semaforo,
                modo: "Tiempo Fijo",
                nombre: nombreSemaforo,
            }
            if(nombreSemaforo === ""){
                newObjeto.nombre = "Sin Nombre"
            }
            let newDatosModificados = aux.map(item=> {
                if(item.grupo === grupo){
                    return newObjeto
                }else{
                    return item
                }
            })
            //console.log(newDatosModificados)
            setSemaforos(newDatosModificados)
            
            

        }
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        console.log(marker.getLatLng())
                        let aux = [marker.getLatLng().lat,marker.getLatLng().lng]
                        
                        setPosition(aux)
                        
                    } else {
                        
                    }
                },
            }),
            [],
        )
        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)
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
                            {draggable ? 'Marker is draggable': 'Click here to make marker draggable'}
                        </span>
                    </Popup>
                </Marker>
            )
        }
    return (
        <>
            <Container maxWidth="md" >
                <div style={{marginBottom:10,marginTop:20}}>
                    <h4>Formulario de Declaracion de Nuevo Controlador</h4>
                    <p>
                        Llene el siguiente formulario para declarar el nuevo controlador dentro de la base de datos, los datos a
                        rellenar son los de nombre , latitud y longitud.
                    </p>
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined" value={controlerState.nuevo_controlador.ip}  fullWidth focused  label="Ip:" variant="outlined" aria-readonly={true}  />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined" value={controlerState.nuevo_controlador.mac} fullWidth focused  label="Mac" variant="outlined" aria-readonly={true}  />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined"  value={nombreControlador}  label="Nombre del Controlador"variant="outlined" onChange={(e)=>{setNombreControlador(e.target.value)}}  fullWidth   />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField id="outlined" value={latitud}  label="Latitud" variant="outlined"  onChange={(e)=>{setLatitud(e.target.value)}}   fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField id="outlined"  value={longitud} label="Longitud" variant="outlined"  onChange={(e)=>{setLongitud(e.target.value)}} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button variant="contained" startIcon={<LocationOnIcon/>} color="morado1" fullWidth sx={{ height: "100%" }} onClick={encontrarUbicacion}>GeoLocalizar</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    
                            <MapContainer center={position} zoom={19}  key={reloadMap} scrollWheelZoom={false} className='map-container'>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                     <DraggableMarker />
                                     {semaforos.map((item, index) => (
                                        <Marker position={item.position} key={index} icon={item.icon}>
                                            <Popup>
                                                Semaforo {item.nombre} - Grupo: {item.grupo}
                                            </Popup>
                                        </Marker>
                                        ))}
                            </MapContainer>

                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div>
                            <p>
                                <strong style={{marginLeft:5,marginRight:5}}>Longitud del semaforo:</strong>{position[0]} <strong style={{marginLeft:5,marginRight:5}}>Latitud del semaforo:</strong>{position[1]}
                            </p>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField id="outlined" value={nombreSemaforo} onChange={(e)=>{setNombreSemaforo(e.target.value)}} label="Nombre del semaforo" variant="outlined"  fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Grupos</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Grupos"
                                    name='grupo'
                                    value={grupo}
                                    onChange={(event,newValue)=>{setGrupo(event.target.value)}}
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    <MenuItem value={'g1'}>Grupo 1</MenuItem>
                                    <MenuItem value={'g2'}>Grupo 2</MenuItem>
                                    <MenuItem value={'g3'}>Grupo 3</MenuItem>
                                    <MenuItem value={'g4'}>Grupo 4</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button variant="contained" startIcon={<AddIcon/>} color="primary" fullWidth sx={{ height: "100%" }} onClick={agregarSemaforo} >AGREGAR</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div>
                            <p><strong>Semaforos Declarados:</strong></p>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Paso</Th>
                                    <Th className='home-t-th'>Duracion</Th>
                                    <Th className='home-t-th'>Latitud</Th>
                                    <Th className='home-t-th'>Longitud</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {semaforos.map((dato, index) => (
                                    <Tr className="tablas-focus" key={index} >
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
                                            {dato.position[0]}
                                        </Td>
                                        <Td >
                                            {dato.position[1]}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    <div style={{display:"flex",justifyContent:"center"}}>
                            <Button sx={{height:60}} variant="outlined" onClick={declararControlador}>CREAR CONTROLADOR</Button>
                        </div>
                    </Grid>
                </Grid>
                <div style={{height:100}}>

                </div>
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={flagCargando}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );

}
const ubi = new L.Icon({
    iconUrl: require('../assets/ubica.png'),
    iconRetinaUrl: require('../assets/ubica.png'),
    iconSize: [20, 30], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
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
const semaforosIniciales = [
    {
        nombre: "sin nombre",
        modo: "Tiempo Fijo",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g1",
        position:  [-2.877331224126658,-78.96603009964582],
        icon: semaforo
    },
    {
        nombre: "sin nombre",
        modo: "Tiempo Fijo",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g2",
        position:  [-2.877872982757359, -78.96525268979977],
        icon: semaforo
    },
    {
        nombre: "sin nombre",
        modo: "Tiempo Fijo",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g3",
        position: [-2.876865269460137,-78.96537600114729],
        icon: semaforo
    },
    {
        nombre: "sin nombre",
        modo: "Tiempo Fijo",
        rojo: 10,
        amarillo: 4,
        verde: 20,
        grupo: "g4",
        position:  [-2.8775672459352046, -78.9645128400452],
        icon: semaforo
    }

]