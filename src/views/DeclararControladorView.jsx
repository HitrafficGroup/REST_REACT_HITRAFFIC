import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import L from 'leaflet';
import { db } from "../firebase/firebase-config";
// dependencias de la tabla
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { MapContainer, TileLayer, Marker, Popup,FeatureGroup,Polygon } from "react-leaflet";
//iconos
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
//dependencias para los select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// dependencias del mapa
import Fab from '@mui/material/Fab';


import { useNavigate } from 'react-router-dom';
import { setNameMenu } from '../features/menu/menuSlice';
import { reloadIps } from '../features/controlers/controlerSlice';

import Swal from 'sweetalert2';
import { doc, setDoc } from "firebase/firestore"; 

import Backdrop from '@mui/material/Backdrop';
import { useDispatch  } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { setCambiarIpControlador } from '../js/apiFunctions';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function DeclararControladorView() {
    const controlerState = useSelector(state => state.controlers)
    const center = [-2.876428, -78.965342];
    const [modalCrearSemaforo, setModalCrearSemaforo] = useState(false);
    const [position, setPosition] = useState(center);
    const [reloadMap,setReloadMap] = useState(false);
    const [latitud,setLatitud] = useState(-2.876428);
    const [longitud,setLongitud] = useState(-78.965342)
    const [model, setModel] = useState('');
    const [areas,setAreas] = useState([]);
    const [draggable, setDraggable] = useState(false)
    const [nombreControlador,setNombreControlador]  = useState("");
    const [ipControlador,setIpControlador] = useState("");
    const [macControlador,setMacControlador] = useState("");
    const [semaforos,setSemaforos] = useState(semaforosIniciales);
    const [pointsArea,setPointsArea] = useState([]);
    const [canton,setCanton] = useState('')
    //banderas para los botones 
    const [flagCargando,setFlagCargando] = useState(false);
    const [botonCrear,setBotonCrear] = useState(true);
    // variables para los semaforos
    const [newSemaforo, setNewSemaforo] = useState({
        nombre: "",
        position: [],
        rojo: 15,
        amarillo: 5,
        verde: 30,
        icon: {},
        grupo: '',
    });
    const markerRef = useRef(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Changeview = (referencia) => {
        dispatch(setNameMenu("Dashboard Hitraffic"))
        dispatch(reloadIps())
        navigate(referencia);
    }
    const limpiarPuntos = () =>{
        setBotonCrear(true);
        setPointsArea([])
    }
    const handleNewSemaforo = (event) => {
        setNewSemaforo(
            {
                ...newSemaforo,
                [event.target.name]: event.target.value,
            }
        )
    }
   
    const selectModel = (event) => {
        setModel(event.target.value);
    
    };


    const obtenerCoordenadas = () => {
        let puntos = JSON.parse(JSON.stringify(pointsArea))
        let data;

        let newPoint = {
            icon: point,
            position: [position[0], position[1]]
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
            setBotonCrear(true)
        } else {
            puntos.pop()
            puntos.push(newPoint)
            data = puntos.map(item => (
                {
                    icon: point,
                    position: item.position
                }))
            
        }
        if(puntos.length === 4){
            setBotonCrear(false)
        }
        setPointsArea(data)

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
    const agregarSemaforo = async () => {
        setAreas([])
        let areas_temp = JSON.parse(JSON.stringify(areas))
        let posiciones = pointsArea.map(item=> (item.position))
        let newArea = {
            rojo: 10,
            amarillo: 4,
            verde: 20,
            nombre: newSemaforo.nombre,
            grupo: newSemaforo.grupo,
            points: posiciones,
            color: devolverColor2(newSemaforo.grupo),
        }
        areas_temp.push(newArea)
        setAreas(areas_temp)
        setPointsArea([])
        setBotonCrear(true)
        setModalCrearSemaforo(false)
        setNewSemaforo({
            nombre:"",
            grupo:"",
        })

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
            let  ip = ipControlador
            if(ip === "" || ip === undefined ){
                Swal.fire(
                    'Error No Ip',
                    'Asigne la ip ',
                    'error'
                    )
            }else{
                if(nombreControlador !== ""){

                    let resumen_aux =  JSON.parse(JSON.stringify(semaforos))   
                    let aux_1 = resumen_aux.map(function(element){
                        element.icon = {}
                        return element ;
                    }) 
                    let areas_aux = JSON.parse(JSON.stringify(areas)) 
                    areas_aux.map((item) => {
                        let puntos_aux = item.points
                        item.points = puntos_aux.map((_item) => (
                            {
                                pos: _item
                            }
                        ))
                    })
                    console.log(areas_aux)
                    
                    let parametrosIniciales = {
                        // parametros inicializados por defecto
                        resumen:aux_1,
                        t_fases:1667372400000,
                        t_horarios: 1667372400000,
                        t_peticion: 1667372400000,
                        t_planes: 1667372400000,
                        ip:ipControlador,
                        mac:macControlador,
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
                        semaforos:areas_aux,
                        otros_parametros:{},
                        planes:{},
                        latitud: parseFloat(latitud),
                        longitud:parseFloat(longitud),
    
                    }
                    let historialControladorData = {
                        nombre:nombreControlador,
                        latitud:parseFloat(latitud),
                        longitud:parseFloat(longitud),
                        ip:ipControlador,
                        mac:macControlador,
                        canton:canton,
                        online:true,
                        ultima_conexion:'',
                        modelo:model,
                    }
                    console.log(historialControladorData)
                    try {
                        setFlagCargando(true);
                        await setDoc(doc(db, "controladores",macControlador ), parametrosIniciales);
                        await setDoc(doc(db, "historial_controladores",macControlador ), historialControladorData);
                        // if(controlerState.nuevo_controlador.ip !== ipControlador){
                        //     let jason_data = {
                        //         ip:controlerState.nuevo_controlador.ip,
                        //         nueva_ip:ipControlador,
                        //         mac:controlerState.nuevo_controlador.mac,
                        //     }
                        //     await setCambiarIpControlador(jason_data);
                        // }
                        Swal.fire(
                            'Exito',
                            'Controlador Declarado! ',
                            'success'
                            )
                        setFlagCargando(false);
                        Changeview('/equipos')
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
        const cerrarSesion = ()=>{
            navigate('/');
        }
        const encontrarUbicacion =()=>{
            let aux = [latitud,longitud]
            setPosition(aux)
            setReloadMap(!reloadMap)
        }
        const eliminarArea = async (_data) => {
            let aux = JSON.parse(JSON.stringify(areas))
            let semaforosActualizados = aux.filter(item => item.nombre !== _data.nombre)
            setAreas(semaforosActualizados)
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
    useEffect(() => {
       
    }, []);
    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#34495E" }}>

            <Toolbar>
            <Button variant="text" sx={{color:"white",marginRight:4}}  onClick={()=>{navigate('/equipos')}} endIcon={<ReplyAllOutlinedIcon/>} >Volver</Button>
            <Typography sx={{ display: { xs: 'none', md: 'flex' },flexGrow: 1 }} variant="h6" component="div">
                Registro de Nuevo Controlador
            </Typography>

            <Button variant="text" sx={{color:"white"}} onClick={cerrarSesion} endIcon={<LogoutIcon />} >Cerrar Sesion</Button>
            </Toolbar>
            </AppBar>
            <Container maxWidth="md" >
                <div style={{marginBottom:10,marginTop:20}}>
                    <h4>Formulario de Registro</h4>
            
                </div>
                <Grid container spacing={1}>

                    <Grid item xs={12} md={12}>
                        
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField id="outlined"  fullWidth onChange={(e) =>{setMacControlador(e.target.value)}} label="Mac" variant="outlined"  />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField id="outlined" value={ipControlador}  onChange={(e) =>{setIpControlador(e.target.value)}} fullWidth   label="Ip:" variant="outlined"  />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField id="outlined"  value={nombreControlador}  label="Nombre del Controlador"variant="outlined" onChange={(e)=>{setNombreControlador(e.target.value)}}  fullWidth   />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Modelo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={model}
                                label="Modelo"
                                onChange={selectModel}
                            >
                                <MenuItem value={"HT-200"}>HT-200</MenuItem>
                                <MenuItem value={"SW-12"}>SW-12</MenuItem>
                                <MenuItem value={"HT-216"}>HT-216</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined" value={latitud}  label="Latitud" variant="outlined"  onChange={(e)=>{setLatitud(e.target.value)}}   fullWidth />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined"  value={longitud} label="Longitud" variant="outlined"  onChange={(e)=>{setLongitud(e.target.value)}} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined" value={canton} fullWidth  onChange={(e) =>{setCanton(e.target.value)}}  label="Canton" variant="outlined"   />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <h4>Mapa del controlador</h4>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    
                    <MapContainer center={[position[0], position[1]]} zoom={19} key={reloadMap} scrollWheelZoom={false} className='map-container leaflet-container-2'>
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
                                <Fab onClick={encontrarUbicacion} color="oscuro" aria-label="add" sx={{ position: "absolute", top: 50, right: 30 }}>
                                    <MyLocationOutlinedIcon  />
                                </Fab>
                                <Fab    onClick={() => { obtenerCoordenadas() }} color="verde" aria-label="add" sx={{ position: "absolute", top: 130, right: 30 }}>
                                    <CheckOutlinedIcon  />
                                </Fab>
                                <Fab   onClick={limpiarPuntos}  color="rojo" aria-label="add" sx={{ position: "absolute", top: 210, right: 30 }}>
                                    <BackspaceOutlinedIcon  />
                                </Fab>
                                <Fab      disabled={botonCrear}  onClick={() => { setModalCrearSemaforo(true) }} color="oscuro" aria-label="add" sx={{ position: "absolute", top: 290, right: 30 }}>
                                    <SaveIcon  />
                                </Fab>

                               
                            <div  style={{ zIndex:1070 ,position: "absolute", top: 30, left: 70}}>
                                    <p>
                                        <strong style={{marginLeft:5,marginRight:5}}>Longitud del semaforo:</strong>{position[0]} <strong style={{marginLeft:5,marginRight:5}}>Latitud del semaforo:</strong>{position[1]}
                                    </p>
                                </div>
                            </MapContainer>
                    </Grid>
               
                    <Grid item xs={12} md={12}>
                    <div style={{display:"flex",justifyContent:"center"}}>
                            <Button sx={{height:60}} variant="outlined" onClick={declararControlador}>CREAR CONTROLADOR</Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
          
                         
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                <TableRow>
                                 
                                    <StyledTableCell align="left">#</StyledTableCell>
                                    <StyledTableCell align="left">Nombre</StyledTableCell>
                                    <StyledTableCell align="right">Grupo</StyledTableCell>
                               
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {areas.map((row,index) => (
                                    <StyledTableRow key={index}>
                                    <StyledTableCell align="left">{index+1}</StyledTableCell>
                                    <StyledTableCell align="left">{row.nombre}</StyledTableCell>
                                    <StyledTableCell align="left">{row.grupo}</StyledTableCell>

                                    </StyledTableRow>
                                ))}
                                </TableBody>
                            </Table>
                
                    </Grid>
                   
                </Grid>
                <div style={{height:100}}>

                </div>
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
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={flagCargando}>
                <CircularProgress color="inherit" />
            </Backdrop>
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

const grupo_1 = { color: 'purple' }
const grupo_2 = { color: 'blue' }
const grupo_3 = { color: 'black' }
const grupo_4 = { color: 'orange' }

//estilos para las tablas
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
  let initial_areas = [{nombre:'',grupo:''},{nombre:'',grupo:''},{nombre:'',grupo:''},{nombre:'',grupo:''}]