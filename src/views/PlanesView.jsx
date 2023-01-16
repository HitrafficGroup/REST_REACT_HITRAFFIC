import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import FormControl from '@mui/material/FormControl';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Autocomplete from '@mui/material/Autocomplete';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { db } from "../firebase/firebase-config";
import { collection, updateDoc, onSnapshot, doc,getDoc } from "firebase/firestore";
import '../css/PlanesView.css'
import { useSelector, useDispatch } from 'react-redux';
import { addPlanes } from "../features/controlers/controlerSlice";
//mitze rodriguez
import { updatePlanesSamplingTime,getCheckDataPlanes } from '../js/gestionSolicitudes';
import { getPlanesFromRestApi,setPlanesFromRestApi,getOtrosParametrosFromRestApi,setOtrosParametrosFromRestApi } from '../js/apiFunctions';
import Swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
export default function PlanesView() {
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [currentPlan, setCurrentPlan] = useState(planInicial)
    const [selectPlan, setSelectPlan] = useState("plan1");
    const [planes, setPlanes] = useState([])
    const [modalEditar, setModalEditar] = useState(false);
    const [faseSemaforo, setFaseSemaforo] = useState('1');
    const [tiempoSemaforo, setTiempoSemaforo] = useState(0);
    const [sincronizacionSemaforo, setSincronizacionSemaforo] = useState(0)
    const [currentPaso, setCurrentPaso] = useState(0);
    //Variables de parametros Operativos del controlador
    const [otrosParam,setOtrosParam] = useState(otrosParametros)
    const [destellarVerdePeatonal,setDestellarVerdePeatonal]= useState(0);
    const [destellarVerdeVehicular,setDestellarVerdeVehicular] = useState(0);
    const [tiempoAmarilloVehicular,setTiempoAmarilloVehicular] = useState(0);
    const [tiempoDestelloPrender,setTiempoDestelloPrender] = useState(0);
    const [tiempoMinimoVerde1,setTiempoMinimoVerde1] = useState(0);
    const [tiempoMinimoVerde2,setTiempoMinimoVerde2] = useState(0);
    const [tiempoRojoPrender,setTiempoRojoPrender] = useState(0);
    const [tiempoTodoRojo,setTiempoTodoRojo] = useState(0);
    const [valorSincronizacion,setValorSincronizacion]= useState(1);
    //variables funcionales de animacion
    const [deshabilitar, setDeshabilitar] = useState(true);
    const [deshabilitar2, setDeshabilitar2] = useState(false);
    const [deshabilitar3,setDeshabilitar3] = useState(true);
    const [deshabilitar4,setDeshabilitar4] = useState(false);
    const [cambio,setCambio] = useState(false)
    const [dis,setDis] = useState('disabled')
    //esta variable de planes2 debe actualizarse con este formato que es mas adecuado
    
    const leerPlanesFromRestApis = async () => {
        let planesControlador
        let plan_actual
        try {
            setDis('disabled')
            setDeshabilitar(true)
            setDeshabilitar2(true)
            let flag =  await getCheckDataPlanes(controlerState.mac,"planes",10)
            //eusart
            //usart
            if(flag !== false){
                planesControlador = flag
                
            }else{
                let result = await getPlanesFromRestApi(controlerState.mac, controlerState.ip)
                planesControlador = result[controlerState.mac].slice()
                console.log(planesControlador)
                await updatePlanesSamplingTime(controlerState.mac)
                await cargarPlanesFirebase(planesControlador)
            }
            plan_actual = planesControlador[0].pasos.slice()
            setPlanes(planesControlador)
            setCurrentPlan(plan_actual)

    
            //dispatch(addPlanes(planesControlador))

            setDis('habilited')
            setDeshabilitar2(false)
            setDeshabilitar(false)
        }
        catch (e) {
            console.log(e);
            setDeshabilitar2(false)
        }
    }

    const abrirModalEditar = (data) => {
        setFaseSemaforo(data.fase.toString());
        setTiempoSemaforo(data.duracion);
        setCurrentPaso(data);
        setModalEditar(true);
    }

    const planSelectManager = (name) => {
        
       let planselect = planes.filter(data => data.numPlan === name)
       setSelectPlan(name);
       setCurrentPlan(planselect[0].pasos);
       console.log(planselect);
    }
    const cargarPlanesFirebase = async(_planes) =>{
        const ref = doc(db, "controladores", `${controlerState.mac}`);
        console.log(_planes)
        await updateDoc(ref,{
            planes:_planes
        });
    }
    const leerOtrosParametrosApi = async () =>{
        try{
            setDeshabilitar4(true)
            
            var datosObtenidos = await getOtrosParametrosFromRestApi(controlerState.mac,controlerState.ip);
            var datosformateados = datosObtenidos[`${controlerState.mac}`];
            console.log(datosformateados)
            setDestellarVerdePeatonal(parseInt(datosformateados.destellar_verde_peatonal));
            setDestellarVerdeVehicular(parseInt(datosformateados.destellar_verde_vehicular));
            setTiempoAmarilloVehicular(parseInt(datosformateados.tiempo_amarillo_vehicular));
            setTiempoDestelloPrender(parseInt(datosformateados.tiempo_destello_prender));
            setTiempoMinimoVerde1(parseInt(datosformateados.tiempo_minimo_verde_1));
            setTiempoMinimoVerde2(parseInt(datosformateados.tiempo_minimo_verde_2));
            setTiempoRojoPrender(parseInt(datosformateados.tiempo_rojo_prender));
            setTiempoTodoRojo(parseInt(datosformateados.tiempo_todo_rojo));
            setValorSincronizacion(parseInt(datosformateados.valor_sincronizacion));
            setDeshabilitar3(false)
            setDeshabilitar4(false)
        }catch(e){
            console.log(e);
            setDeshabilitar4(false)
        }
    }
    const cargarOtrosParamFirebase = async(data) =>{
        const ref = doc(db, "controladores", `${controlerState.mac}`);
        await updateDoc(ref,{
            otros_parametros:data
        });
    }
    const cargarOtrosParametrosAPI= ()=>{
        let newParams = {
            destellar_verde_peatonal: destellarVerdePeatonal.toString(),
            destellar_verde_vehicular:destellarVerdeVehicular.toString(),
            ip: controlerState.ip,
            mac: controlerState.mac,
            tiempo_amarillo_vehicular:tiempoAmarilloVehicular.toString(),
            tiempo_destello_prender:tiempoDestelloPrender.toString(),
            tiempo_rojo_prender:tiempoRojoPrender.toString(),
            tiempo_todo_rojo:tiempoTodoRojo.toString(),
            time_min_green:tiempoMinimoVerde1.toString(),
            valor_sincronizacion:valorSincronizacion.toString()
        }


        Swal.fire({
            title: 'Deseas Continuar ?',
            text:  'Estos Cambios se guardaran en el Controlador',
            icon:  'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result)=>{
            if(result.isConfirmed){
               
                setCambio(false);
                setOtrosParametrosFromRestApi(newParams);
                cargarOtrosParamFirebase(newParams);
     
             
            }
        })        


        
       
    }
    const actualizarPaso = () => {
        const temp = currentPlan.map((item)=>{
            if(item.name ===  currentPaso.name){
                item['fase'] = parseInt(faseSemaforo);
                item['duracion'] = parseInt(tiempoSemaforo);
            }
            return item

        })
        const temp2 = planes.map((item)=>{
            if(item.numPlan === selectPlan){
                item.pasos = temp
            }
            return item
        })
        console.log(temp2)
        setCurrentPlan(temp);
        setCambio(true)
        setModalEditar(false);
    }
   const cargarCambios = () =>{
    try{

        Swal.fire({
            title: 'Deseas Continuar ?',
            text:  'Estos Cambios se guardaran en el Controlador',
            icon:  'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result)=>{
            if(result.isConfirmed){
                var newData = {}
                var j = 0
                for(let i = 0 ;i<12;i++){
                    newData['data'+j] = currentPlan[i].fase.toString()
                    newData['data'+(1+j)] = currentPlan[i].duracion.toString()
                    j += 2;
                }
                newData['ip'] = controlerState.ip
                newData['mac'] = controlerState.mac
                newData['num_plan'] = returnNumPlan(selectPlan)
                setCambio(false);
     
                setPlanesFromRestApi(newData);
                cargarPlanesFirebase(planes);
                
            }
        })        
    }catch(e){
        console.log(e)
    }
   }
   const returnNumPlan = (data) =>{
    for(let i = 1 ; i<16;i++){
        var condition = 'plan'+i
        if(data === condition){
            return i
        }
    }

   }

   
    return (
        <>
            <Container maxWidth="md">
                <div className='titulos-planes'>
                   <h4>Configuración de Planes</h4>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Autocomplete
                            onChange={(event, newValue) => { planSelectManager(newValue) }}
                            options={planes4}
                            value = {selectPlan}
                            id="controllable-states-demo"
                            renderInput={(params) => <TextField {...params} label="Escoga Un Plan" fullWidth />}
                            disabled={deshabilitar}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" fullWidth color='verde2' disabled={deshabilitar2} onClick={leerPlanesFromRestApis} sx={{ height: '100%' }} >Leer Datos</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar} onClick={cargarCambios} color="primary">Cargar Cambios</Button>
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={12}>
                        <div className={`scroller ${dis}-table-p`}>

                            <Table >
                                <Thead>
                                    <Tr>

                                        <Th>Nro Paso</Th>
                                        <Th className='home-t-th'>Fase a ejecutar</Th>
                                        <Th className='home-t-th'>Duracion</Th>
                                        <Th className='home-t-th'>Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentPlan.map((dato, index) => (
                                        <Tr className="tr-planes tablas-focus" key={index} >
                                            <Td>
                                                {dato.name}
                                            </Td>
                                            <Td >
                                                <Chip label={'fase - ' + dato.fase} sx={{ width: 100 }} color={'anaranjado1'} variant="outlined" />
                                            </Td>
                                            <Td >
                                                <Chip label={dato.duracion + 's'} sx={{ width: 100 }} color={'morado1'} variant="outlined" />
                                            </Td>
                                            <Td >
                                                <Button variant="contained" onClick={() => { abrirModalEditar(dato) }} color="crema">Editar</Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={cambio}>
                                <Alert
                                severity="warning"
                                sx={{ mb: 2 }}
                                >
                                Se han Generado Cambios en los planes sin cargar al controlador
                                </Alert>
                            </Collapse>
                            </Grid>
                    <Grid item xs={12}>
                        <h3>Parámetros Operativos del Controlador</h3>
                    </Grid>
                    
                    <Grid item xs={4}>

                        <TextField
                            id="outlined-number"
                            label="Tiempo de destello al prender (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => {setTiempoDestelloPrender(event.target.value) }}
                            value={tiempoDestelloPrender}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo en rojo al prender (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => { setTiempoRojoPrender(event.target.value) }}
                            value={tiempoRojoPrender}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>

                        <TextField
                            id="outlined-number"
                            label="Destellar luz verde peatonal (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => {setDestellarVerdePeatonal(event.target.value) }}
                            value={destellarVerdePeatonal}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Destellar luz verde vehicular (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => {setDestellarVerdeVehicular(event.target.value) }}
                            value={destellarVerdeVehicular}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo en amarillo vehicular (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => { setTiempoAmarilloVehicular(event.target.value) }}
                            value={tiempoAmarilloVehicular}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label=" Tiempo de todo en rojo (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => { setTiempoTodoRojo(event.target.value) }}
                            value={tiempoTodoRojo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo minimo en verde (s)"
                            disabled={deshabilitar3}
                            type="number"
                            onChange={(event) => { setTiempoMinimoVerde1(event.target.value) }}
                            value={tiempoMinimoVerde1}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h4>Sincronización</h4>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Direccion"
                                value={sincronizacionSemaforo}
                                disabled={deshabilitar3}
                                onChange={(event) => {setSincronizacionSemaforo(event.target.value) }}
                            >
                                <MenuItem value={0}>Hitraffic</MenuItem>
                                <MenuItem value={1}>Goia</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="outlined-basic" label="Retardo requerido para otros (s)" 
                        variant="outlined" 
                        fullWidth  
                        aria-readonly 
                        disabled={deshabilitar3}
                        onChange={(event) => {setValorSincronizacion(event.target.value) }}
                        value={valorSincronizacion} />
                    </Grid>
                    <Grid item xs={3}>
                    <Button variant="contained"  color='verde2' fullWidth sx={{height:'100%'}}   onClick={leerOtrosParametrosApi} >Leer Datos</Button>
                    </Grid>
                    <Grid item xs={3}>
                    <Button variant="contained" fullWidth sx={{height:'100%'}} onClick={cargarOtrosParametrosAPI} disabled={deshabilitar3} >Cargar Cambios</Button>
                    </Grid>
                  
                    <Grid item xs={12}>
                        <div className='blank-box'>

                        </div>
                    </Grid>

                </Grid>
            </Container>
           
            <Modal isOpen={modalEditar} >
                <ModalHeader>
                    <div>
                        <h1>
                            Ajustes del Plan
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Autocomplete
                                name='plan'
                                options={planes2}
                                value={faseSemaforo}
                                onChange={(event, newValue) => { setFaseSemaforo(newValue) }}
                                id="controllable-states-demo"
                                renderInput={(params) => <TextField {...params} label="Escoga una Fase" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="outlined-number"
                                label="Duracion en Segundos"
                                type="number"
                                value={tiempoSemaforo}
                                onChange={(event) => { setTiempoSemaforo(event.target.value) }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <div className='botones-modal-p'>
                        <Button variant="contained" color='verde' sx={{ marginRight: 5 }} onClick={actualizarPaso}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setModalEditar(false) }}>
                            Cancelar
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar4}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <CardController/>
        <CardInformation/>
        </>
    );

}

/* 
    variables iniciales y de prueba al momento de cargar la vista o verificar la funcionalidad de 
    alguna funcion.

*/

const planInicial = [
    { name: 'Paso 1', fase: 0, duracion: 0 },
    { name: 'Paso 2', fase: 0, duracion: 0 },
    { name: 'Paso 3', fase: 0, duracion: 0 },
    { name: 'Paso 4', fase: 0, duracion: 0 },
    { name: 'Paso 5', fase: 0, duracion: 0 },
    { name: 'Paso 6', fase: 0, duracion: 0 },
    { name: 'Paso 7', fase: 0, duracion: 0 },
    { name: 'Paso 8', fase: 0, duracion: 0 },
    { name: 'Paso 9', fase: 0, duracion: 0 },
    { name: 'Paso 10', fase: 0, duracion: 0 },
    { name: 'Paso 11', fase: 0, duracion: 0 },
    { name: 'Paso 12', fase: 0, duracion: 0 },
]
const selectorPlan =  { name: 'Paso 6', fase: 0, duracion: 0 }
const planes2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
const planes3 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
const planes4 = ["plan1","plan2","plan3","plan4","plan5","plan6","plan7","plan8","plan9","plan10","plan11","plan12"]
const selectPlanInicial ={
        numPlan: "plan1",
        pasos:  [5, 23, 6, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

const otrosParametros = {
    destellar_verde_peatonal:"0",
    destellar_verde_vehicular:"0",
    tiempo_amarillo_vehicular: "0",
    tiempo_destello_prender: "0",
    tiempo_minimo_verde_1: "0",
    tiempo_minimo_verde_2: "0",
    tiempo_rojo_prender: "0",
    tiempo_todo_rojo: "0",
    valor_sincronizacion: "0"
}


