
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import CleaningServicesSharpIcon from '@mui/icons-material/CleaningServicesSharp';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { updateDoc, doc} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import TextField from '@mui/material/TextField';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import "../css/HomeView.css"
import "../css/SyncTimeView.css"
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import Fab from '@mui/material/Fab';
import  { setSemaforos } from "../features/controlers/controlerSlice";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css';
import '../css/beautifulCard.scss';
import Swal from 'sweetalert2';
import RelogActual from "../components/RelogActual";
import { getTimeHT200,PostTimeHT200,getWorkStateHT200 } from '../js/apiFunctionsHT200';
const InitialTime = {
    day: "00",
    hours: "00",
    date: "00",
    month: "00",
    minutes: "00",
    seconds: "00",
    zone: "00",
    year: "00"
}


export default function HomeView() {

    const controlerState = useSelector(state => state.controlerht200)
    const [tiempoController, setTiempoController] = useState(InitialTime)
    //const [fechaController, setFechaController] = useState('Datos de fecha aun no Cargados')
    const [fechaActual, setFechaActual] = useState(new Date().toLocaleString("es-EC", { dateStyle: 'full' }))
    const [flagsimu, setFlagsimu] = useState(false);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [deshabilitar2, setDeshabilitar2] = useState(false);
    const [areas, setAreas] = useState(controlerState.semaforos);
    const [btnPlay,setBtnPlay] = useState(false)
    const simulacion = useRef(false);
    const timer1 = useRef(0);
    const color_flag = useRef(""); // estas variables sirve para solo mandar a actualizar cuando se genere un cambio de fase

    const indice_grupos =  useRef(0);
    const datos_grupos = useRef([{amarillo:2,verde:15,rojo:10}])
    const [pointsArea, setPointsArea] = useState([]);
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState([controlerState.latitud, controlerState.longitud])
    const [modalCrearSemaforo, setModalCrearSemaforo] = useState(false);
    const [btnAgregar, setBtnAgregar] = useState(true);

    const dispatch = useDispatch();
   
    //banderas para los botones 
    const [botonCrear, setBotonCrear] = useState(true);

    //prueba semaforo
    const semaforos2 = useRef(controlerState.semaforos);
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


    const updateAreas =(__data)=>{
        let areas_temp = JSON.parse(JSON.stringify(areas))
        let dataUpdated = areas_temp.map((item) => {
            if (item.grupo === __data.grupo) {
                item['color'] = {color:__data.color};
            }else{
                item['color'] = {color:'red'}
            }
            return item
        })
      

        setAreas(dataUpdated);
    }
    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, [])
    const markerRef = useRef(null)


    

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


    /*
    esta funcion agrega y actualiza el semaforo que se selecciona en los grupos
    ,nos permite desplazar elsemaforo dentro del mapa actualizando su latitud y longitud
    */
    const agregarSemaforo = async () => {
        setDeshabilitar(true)
        let areas_temp = JSON.parse(JSON.stringify(areas))
        if (pointsArea.length === 4) {
            let newpositions = pointsArea.map((item) => (
                {
                    pos: item.position
                }
            ))


            let newArea = {
                rojo: 10,
                amarillo: 4,
                verde: 20,
                nombre: newSemaforo.nombre,
                grupo: newSemaforo.grupo,
                points: newpositions,
                color: devolverColor2(newSemaforo.grupo),
            }

            areas_temp.push(newArea);
            dispatch(setSemaforos(areas_temp));
            const ref = doc(db, "controladores", controlerState.id);
            await updateDoc(ref, {
                semaforos: areas_temp
            });
            setAreas(areas_temp)
            setPointsArea([])
            setModalCrearSemaforo(false)

            setNewSemaforo({
                nombre: "",
                grupo: "",
            })
            setDeshabilitar(false)
        } else {
            setDeshabilitar(false)
            Swal.fire({
                icon: 'error',
                title: 'Punos de Area Incompletos',
                showConfirmButton: false,
                timer: 900
            })
        }
        setDeshabilitar(false)

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
 



   
    const parametrosCorriendo = async() => {
        setBtnPlay(!btnPlay)
        setFlagsimu(!flagsimu);
        try {
            let data = await getWorkStateHT200(controlerState.ip)
            let splits_aux = controlerState.split.filter(item=> item.id === "split-"+data.split)[0].data
            let sequency_aux = controlerState.secuencias.filter(item=> item.id === "seq-"+data.seq)[0]
            let sequency_formated = []
            for(let j = 0; j<4 ;j++)
            if(sequency_aux[`ring${j+1}`].length > 0){
                let long = sequency_aux[`ring${j+1}`].length
                for(let i=0;i<long;i++){
                    if(i<long-1){
                        let fase = sequency_aux[`ring${j+1}`][i].value
                        let fase_sig = sequency_aux[`ring${j+1}`][i+1].value
                        let duracion = splits_aux.filter(temp=> temp.fase === fase)[0].tiempo
                        let aux_data = {
                            paso: i,
                            fase: sequency_aux[`ring${j+1}`][i].value,
                            fase_sig: fase_sig,
                            duracion:duracion,
                            amarillo:3,
                            rojo:2,
                            verde: duracion -5,
                            trama:generarCiclo({rojo:2,verde:duracion-5,amarillo:3})
                        }
                        sequency_formated.push(aux_data);
                    }else{
                        let fase = sequency_aux[`ring${j+1}`][i].value
                        let fase_sig = sequency_aux[`ring${j+1}`][0].value
                        let duracion = splits_aux.filter(temp=> temp.fase === fase)[0].tiempo
                        let aux_data = {
                            paso: i,
                            fase: sequency_aux[`ring${j+1}`][i].value,
                            fase_sig: fase_sig,
                            duracion:duracion,
                            amarillo:3,
                            rojo:2,
                            verde: duracion -5,
                            trama:generarCiclo({rojo:2,verde:duracion-5,amarillo:3})
                        }
                        sequency_formated.push(aux_data)
                    }
                    
                }
            }
            datos_grupos.current = sequency_formated
            let index = sequency_formated.findIndex(function(el){
                return el.fase === data.ring1_fase; // or el.nombre=='T NORTE';
            });
            let value_timer = sequency_formated[index].duracion - data.ring1_remain
            console.log(value_timer) 
            indice_grupos.current = index
            timer1.current = value_timer
            simulacion.current =   !simulacion.current
        
        } catch (error) {
       
        }
   
       
      
    }
    const generarCiclo = (__data)=>{
        let ciclo = []
        for(let i=0;i<__data.verde;i++){
            ciclo.push("green")
        }for(let i=0;i<__data.amarillo;i++){
            ciclo.push("yellow")
     
   
        } for(let i=0;i<__data.rojo;i++){
            ciclo.push("red")
        }
        return ciclo
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
                setDeshabilitar(true)
                let aux = JSON.parse(JSON.stringify(semaforos2.current))
                let semaforosActualizados = aux.filter(item => item.nombre !== _data.nombre)
                const ref = doc(db, "controladores", controlerState.mac);
                let areas_temp = JSON.parse(JSON.stringify(semaforosActualizados))
                areas_temp.map((item) => {
                    let puntos_aux = item.points
                    item.points = puntos_aux.map((_item) => (
                        { pos: _item }
                    ))
                    return null;
                })
                try {
                    await updateDoc(ref, {
                        semaforos: areas_temp
                    });
                } catch (error) {
                    setDeshabilitar(false)
                }

                semaforos2.current = semaforosActualizados
                setAreas(semaforosActualizados)
                setDeshabilitar(false)
            }
        })
    }
    /* esta  funcion se encarga de animar el mapa segun el paso en el que se encuentre*/

    
    // funcion que compara los datos almacenados en la store

    const obtenerCoordenadas = () => {
        let puntos = JSON.parse(JSON.stringify(pointsArea))
       
        let data;

        let newPoint = {
            icon: point,
            position: [position.lat, position.lng]
        }

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
        if (puntos.length === 4) {
            setBotonCrear(false)
        }
        setPointsArea(data)

    }


    const limpiarPuntos = () => {
        setBotonCrear(true);
        setPointsArea([])
    }
    const formatData = (_data) => {
        let data = _data.toString();
        if (data.length < 2) {
            data = "0" + data;
        }
        return data
    }

    /* 
        Logica para la actualizacion del horario
    */

    const obtenerTiempoFromRestApi = async () => {
        try {
            setDeshabilitar(true);
            const response = await getTimeHT200(controlerState.ip);        
            let data_formated={
                seconds: formatData(response['segundos']),
                minutes: formatData(response['minutos']),
                hours: formatData(response['hour']),
                month: formatData(response['mes']),
                date: formatData(response['dia']),
                year: formatData(response['year']),
            }
            setTiempoController(data_formated)
            const fechac = `${response.mes}-${response.dia}-${response.year}`
            const dateObj = new Date(fechac)
            const formatDate = dateObj.toLocaleString("es-EC", { dateStyle: 'full' });
            setFechaActual(formatDate);
            setDeshabilitar(false);
            setDeshabilitar2(false);
        } catch (e) {
            console.log(e)
            setDeshabilitar(false);
            setDeshabilitar2(false);
        }
    }

    const sincronizarTiempoFromRest = async () => {


        try {

            Swal.fire({
                title: 'Deseas Continuar ?',
                text: 'Estos Cambios se guardaran en el Controlador',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Si, actualizar!',
                showDenyButton: true,
                denyButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setDeshabilitar(true);
                    await PostTimeHT200({ ip:controlerState.ip });
                    setDeshabilitar(false);

                }
            })


        } catch (e) {

        }
    }
    /* use effect es un hook que nos permite ejecutar nuestro temporizador en tiempo real
    como un sub procesos y de este modo generar las animaciones del semaforo
    */
   

    useEffect(() => {
        const interval = setInterval(() => {
            
            if (simulacion.current) {
                //cambiarSemaforo();
                let grupo = datos_grupos.current[indice_grupos.current]
                timer1.current =  timer1.current+1;
                let color = grupo.trama[timer1.current]
                if(timer1.current <grupo.trama.length){
                   
                    if(color !== color_flag.current){
                        color_flag.current = color
                        updateAreas({grupo:`g${grupo.fase}`,color:color})
                    }
                    
                }else{
                    indice_grupos.current = indice_grupos.current+1
                    if(indice_grupos.current === 4){
                        indice_grupos.current = 0
                    }
                    timer1.current = 0
                    //console.log(g1_datos.current[timer1.current])
                }
                
                
            }

        }, 1000);

        // verifyDataSemaforos()
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <Container maxWidth="lg" sx={{ paddingTop: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <article className="information [ card ]">
                            <h2 className="title">Informacion del Controlador</h2>
                            <p className="info">Ip: {controlerState.ip} y Mac: {controlerState.mac}</p>
                            <dl className="details">
                                <div>
                                    <dt>Modelo</dt>
                                    <dd>{controlerState.modelo}</dd>
                                </div>
                                <div>
                                    <dt>canton</dt>
                                    <dd>{controlerState.canton}</dd>
                                </div>

                            </dl>
                            <dl className="details">
                                <div>
                                    <dt>Latitud</dt>
                                    <dd>{controlerState.latitud}</dd>
                                </div>
                                <div>
                                    <dt>Longitud</dt>
                                    <dd>{controlerState.longitud}</dd>
                                </div>

                            </dl>
                        </article>


                    </Grid>
                    <Grid item xs={12} md={8}>

                        <article className="information [ card ]">
                            <h2 className="title">Tiempo del Controlador</h2>
                            <div className='h-buttons'>
                                <Button variant="outlined" sx={{ margin: 0 }} onClick={obtenerTiempoFromRestApi} disabled={deshabilitar2} color='verde' >
                                    LEER
                                </Button>
                                <Button variant="outlined" sx={{ margin: 0 }} onClick={sincronizarTiempoFromRest} disabled={deshabilitar} color='primary' >
                                    CARGAR
                                </Button>
                            </div>

                            <dl className="details">
                                <div>
                                    <dt>Hora Actual</dt>
                                    <dd> <RelogActual /></dd>
                                </div>
                                <div>
                                    <dt>Fecha Actual</dt>
                                    <dd>{new Date().toLocaleString("es-EC", { dateStyle: 'full' }).toUpperCase()}</dd>
                                </div>

                            </dl>
                            <dl className="details">
                                <div>
                                    <dt>Hora Controlador</dt>
                                    <dd>{tiempoController.hours + ':' + tiempoController.minutes + ':' + tiempoController.seconds}</dd>
                                </div>
                                <div>
                                    <dt>Fecha Controlador</dt>
                                    <dd>{fechaActual.toUpperCase()}</dd>
                                </div>

                            </dl>
                        </article>
                    

                    </Grid>

                    <Grid item xs={12} md={12}>
                        <article className="information [ card ]">
                            <h2 className="title">Map de los semaforos</h2>

                            <div className="map">
                                <MapContainer center={[controlerState.latitud, controlerState.longitud]} zoom={19}  scrollWheelZoom={false} className='map-container leaflet-container-2'>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b08eb869c89646fa8accf539b81e80de"
                                    />
                                    <DraggableMarker  />
                                    {pointsArea.map((item, index) => (
                                        <Marker key={index} position={item.position} icon={item.icon}>
                                        </Marker>
                                    ))}
                                    {areas.map((item, index) => (
                                        <FeatureGroup key={index} pathOptions={item.color}>
                                            <Popup>
                                                <p style={{ margin: 0, fontStyle: "italic" }}><strong>Area: </strong>{item.nombre} <strong>Grupo: </strong>{item.grupo}</p>
                                                <Button color='rojo' sx={{ marginTop: 2 }} onClick={() => { eliminarArea(item) }} variant="contained">Eliminar</Button>
                                            </Popup>
                                            <Polygon positions={[item.points[0].pos, item.points[1].pos, item.points[2].pos, item.points[3].pos]} />
                                        </FeatureGroup>
                                    ))}
                                    <Fab color={btnPlay ? "error" : "success"} aria-label="add" sx={{ position: "absolute", bottom: 50, right: 30 }} onClick={parametrosCorriendo}>
                                        {btnPlay ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
                                    </Fab>
                                    <Fab color='verde2' disabled={btnAgregar} sx={{ position: "absolute", bottom: 150, right: 30 }} onClick={() => { obtenerCoordenadas() }} >
                                        <CheckSharpIcon />
                                    </Fab>
                                    <Fab variant="contained" color='anaranjado1' disabled={btnAgregar} sx={{ position: "absolute", bottom: 250, right: 30 }} onClick={limpiarPuntos}>
                                        <CleaningServicesSharpIcon />
                                    </Fab>
                                    <Fab  disabled={botonCrear} color="azulm" sx={{ position: "absolute", bottom: 350, right: 30 }} onClick={() => { setModalCrearSemaforo(true) }} >
                                        <SaveIcon />
                                    </Fab>
                                    <div  style={{ zIndex: 1070, position: "absolute", top: 30, left: 70,display: modalCrearSemaforo? 'none':'flex' }}>
                                        <p>
                                            <strong style={{ marginLeft: 5, marginRight: 5 }}>Longitud del semaforo:</strong>{position.lat} <strong style={{ marginLeft: 5, marginRight: 5 }}>Latitud del semaforo:</strong>{position.lng}
                                        </p>
                                    </div>
                                </MapContainer>
                            </div>
                        </article>
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
                    <Button variant="contained" onClick={agregarSemaforo} color="rojo" sx={{ marginLeft: 1 }}>
                        Aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalCrearSemaforo(false) }} color="azulm" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </div>
    );

}



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
