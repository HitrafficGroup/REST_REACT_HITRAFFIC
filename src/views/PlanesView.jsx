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
import { getPlan1SW12,getPlan2SW12,getPlan3SW12,getPlan4SW12,getPlan5SW12,
    getPlan6SW12,getPlan7SW12,getPlan8SW12,getOperativeParamsSW12,
    postPlanesSW12,postOtrosParametrosSW12 } from '../js/apiFunctionsSW12';
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
    const [numPlan,setNumPlan] = useState(1)
    const [modalEditar, setModalEditar] = useState(false);
    const [faseSemaforo, setFaseSemaforo] = useState('1');
    const [tiempoSemaforo, setTiempoSemaforo] = useState(0);
    const [sincronizacionSemaforo, setSincronizacionSemaforo] = useState(0)
    const [currentPaso, setCurrentPaso] = useState({duracion:0,fase:0,id:''});
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
    
    const readData = async () => {
        let result = []
        try {
            setDeshabilitar(true)
            setDeshabilitar2(true)
            setDis('disabled')
            if(numPlan === 1){
                result = await getPlan1SW12()
            }else if(numPlan === 2){
                result = await getPlan2SW12()
            }else if(numPlan === 3){
                result = await getPlan3SW12()
            }else if(numPlan === 4){
                result = await getPlan4SW12()
            }else if(numPlan === 5){
                result = await getPlan5SW12()
            }else if(numPlan === 6){
                result = await getPlan6SW12()
            }else if(numPlan === 7){
                result = await getPlan7SW12()
            }else if(numPlan === 8){
                result = await getPlan8SW12()
            }
          
            
            setCurrentPlan(result)
            setDeshabilitar2(false)
            setDeshabilitar(false)
            setDis('habilited')
        } catch (error) {
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
            var datosObtenidos = await getOperativeParamsSW12();
            //var datosformateados = datosObtenidos[`${controlerState.mac}`];
            setTiempoDestelloPrender(parseInt(datosObtenidos.destello_al_encender));
            setDestellarVerdePeatonal(parseInt(datosObtenidos.destello_verde_peatonal));
            setDestellarVerdeVehicular(parseInt(datosObtenidos.destello_verde_vehicular));
            setTiempoMinimoVerde1(parseInt(datosObtenidos.min_verde));
            setTiempoAmarilloVehicular(parseInt(datosObtenidos.tiempo_amarillo_vehicular));
            setTiempoRojoPrender(parseInt(datosObtenidos.tiempo_en_rojo_al_encender));
            setTiempoTodoRojo(parseInt(datosObtenidos.tiempo_todo_rojo));
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
        let min_verde =  parseInt(tiempoMinimoVerde1)
        let min1 = min_verde & 0xff
        let min2 = (min_verde>>8)&0xff
        let params_data = [
            parseInt(tiempoDestelloPrender),
            parseInt(tiempoRojoPrender),
            parseInt(destellarVerdePeatonal),
            parseInt(destellarVerdeVehicular),
            parseInt(tiempoAmarilloVehicular),
            parseInt(tiempoTodoRojo),
            min1,
            min2,
            0
        ]

        Swal.fire({
            title: 'Deseas Continuar ?',
            text:  'Estos Cambios se guardaran en el Controlador',
            icon:  'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then(async (result)=>{
            if(result.isConfirmed){
                setDeshabilitar4(true)
                setCambio(false);
                console.log(params_data)
                await postOtrosParametrosSW12({'trama':params_data});
                //cargarOtrosParamFirebase(newParams);
                setDeshabilitar4(false)
             
            }
        })        
      
    }
    const actualizarPaso = () => {
        let  data_paso = JSON.parse(JSON.stringify(currentPaso))
        let plan = JSON.parse(JSON.stringify(currentPlan))
        data_paso.duracion = parseInt(data_paso.duracion)
        let plan_modify = plan.map((item)=>{

            if(item.id === data_paso.id){
                return data_paso;
            }else{
                return item;
            }

        })

        console.log(plan_modify)
        setModalEditar(false);
        setCurrentPlan(plan_modify);
        setCambio(true)
    }

    const handlePaso = (event) => {
        setCurrentPaso({
            ...currentPaso,
            [event.target.name]: event.target.value,
        });
    };




    const EliminarPlan = (_data) =>{
        let aux_data = JSON.parse(JSON.stringify(currentPlan))
        let data_modify = aux_data.map(item => {
            if(item.name === _data.name){
                item.duracion = 0
                item.fase = 0
            }
            return item
        })
        setCurrentPlan(data_modify)
    }


const handleNumPlan = (event) => {
        setDis('disabled')
        setDeshabilitar(true)
        setNumPlan(event.target.value);
    };
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
        }).then(async(result)=>{
            if(result.isConfirmed){
                setDeshabilitar2(true)
                let data_plan = [numPlan-1]
                var newData = {}
                var j = 0
                for(let i = 0 ;i<12;i++){
                    data_plan.push(parseInt(currentPlan[i].fase))
                    data_plan.push(parseInt(currentPlan[i].duracion))
                    newData['data'+j] = currentPlan[i].fase.toString()
                    newData['data'+(1+j)] = currentPlan[i].duracion.toString()
                    j += 2;
                }
                newData['ip'] = controlerState.ip
                newData['mac'] = controlerState.mac
                newData['num_plan'] = returnNumPlan(selectPlan)
                setCambio(false);
                console.log(data_plan)
                await postPlanesSW12({'trama':data_plan});
                //cargarPlanesFirebase(planes);
                setDeshabilitar2(false)
            }
        })        
    }catch(e){
        console.log(e)
    }
   }
   const returnNumPlan = (data) =>{
    console.log('nose que hace esta funcion:',data)
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
                    <Grid item md={6} xs={12} >
                    
                            <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Plan</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={numPlan}
                                label="Plan"
                                onChange={handleNumPlan}
                            >
                                <MenuItem value={1}>Plan 1</MenuItem>
                                <MenuItem value={2}>Plan 2</MenuItem>
                                <MenuItem value={3}>Plan 3</MenuItem>
                                <MenuItem value={4}>Plan 4</MenuItem>
                                <MenuItem value={5}>Plan 5</MenuItem>
                                <MenuItem value={6}>Plan 6</MenuItem>
                                <MenuItem value={7}>Plan 7</MenuItem>
                                <MenuItem value={8}>Plan 8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" fullWidth color='verde2' disabled={deshabilitar2} onClick={readData} sx={{ height: '100%' }} >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar} onClick={cargarCambios} color="primary">Cargar Cambios</Button>
                    </Grid>
                    
                    <Grid item md={6} xs={12}>

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
                                        <Tr  key={index} >
                                            <Td>
                                                {dato.id}
                                            </Td>
                                            <Td >
                                                <Chip label={'fase - ' + dato.fase} sx={{ width: 100 }} color={'anaranjado1'} variant="outlined" />
                                            </Td>
                                            <Td >
                                                <Chip label={dato.duracion + 's'} sx={{ width: 100 }} color={'morado1'} variant="outlined" />
                                            </Td>
                                            <Td >
                                                <Button variant="contained" onClick={() => { abrirModalEditar(dato) }} sx={{marginRight:2}} color="crema">Editar</Button>
                                                <Button variant="contained" onClick={() => { EliminarPlan(dato) }} color="rojo">Eliminar</Button>
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
                    
                    <Grid item md={4} xs={12}>

                        <TextField
                            id="outlined-number"
                            label="Tiempo de destello al prender (s)"
                            type="number"
                            disabled={deshabilitar3}
                            onChange={(event) => {setTiempoDestelloPrender(event.target.value) }}
                            fullWidth
                            value={tiempoDestelloPrender}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <TextField
                        fullWidth
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
                    <Grid item md={4} xs={12}>

                        <TextField
                            id="outlined-number"
                            label="Destellar luz verde peatonal (s)"
                            type="number"
                            fullWidth
                            disabled={deshabilitar3}
                            onChange={(event) => {setDestellarVerdePeatonal(event.target.value) }}
                            value={destellarVerdePeatonal}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <TextField
                            id="outlined-number"
                            label="Destellar luz verde vehicular (s)"
                            type="number"
                            fullWidth
                            disabled={deshabilitar3}
                            onChange={(event) => {setDestellarVerdeVehicular(event.target.value) }}
                            value={destellarVerdeVehicular}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo en amarillo vehicular (s)"
                            type="number"
                            fullWidth
                            disabled={deshabilitar3}
                            onChange={(event) => { setTiempoAmarilloVehicular(event.target.value) }}
                            value={tiempoAmarilloVehicular}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <TextField
                            id="outlined-number"
                            label=" Tiempo de todo en rojo (s)"
                            type="number"
                            fullWidth
                            disabled={deshabilitar3}
                            onChange={(event) => { setTiempoTodoRojo(event.target.value) }}
                            value={tiempoTodoRojo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo minimo en verde (s)"
                            disabled={deshabilitar3}
                            type="number"
                            fullWidth
                            onChange={(event) => { setTiempoMinimoVerde1(event.target.value) }}
                            value={tiempoMinimoVerde1}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    
                    <Grid item md={3} xs={12}>
                        <TextField id="outlined-basic" label="Retardo requerido para otros (s)" 
                        variant="outlined" 
                        fullWidth  
                        aria-readonly 
                        disabled={deshabilitar3}
                        onChange={(event) => {setValorSincronizacion(event.target.value) }}
                        value={valorSincronizacion} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Button variant="contained"  color='verde2'  sx={{height:'100%'}}   onClick={leerOtrosParametrosApi} >Leer Datos</Button>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Button variant="contained"  sx={{height:'100%'}} onClick={cargarOtrosParametrosAPI} disabled={deshabilitar3} >Cargar Cambios</Button>
                    </Grid>
                  
                    <Grid item xs={12}>
                        <div style={{height:40}}>

                        </div>
                    </Grid>

                </Grid>
            </Container>
           
            <Modal isOpen={modalEditar} >
                <ModalHeader>
                    <div>
                        <h5>
                            Ajustes del {currentPaso.id}
                        </h5>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Fase</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentPaso.fase}
                                label="Fase"
                                onChange={handlePaso}
                                name='fase'
                            >
                                <MenuItem value={0}></MenuItem>
                                <MenuItem value={1}>Fase 1</MenuItem>
                                <MenuItem value={2}>Fase 2</MenuItem>
                                <MenuItem value={3}>Fase 3</MenuItem>
                                <MenuItem value={4}>Fase 4</MenuItem>
                                <MenuItem value={5}>Fase 5</MenuItem>
                                <MenuItem value={6}>Fase 6</MenuItem>
                                <MenuItem value={7}>Fase 7</MenuItem>
                                <MenuItem value={8}>Fase 8</MenuItem>
                                <MenuItem value={9}>Fase 9</MenuItem>
                                <MenuItem value={10}>Fase 10</MenuItem>
                                <MenuItem value={11}>Fase 11</MenuItem>
                                <MenuItem value={12}>Fase 12</MenuItem>
                                <MenuItem value={13}>Fase 13</MenuItem>
                                <MenuItem value={14}>Fase 14</MenuItem>
                                <MenuItem value={15}>Fase 15</MenuItem>
                                <MenuItem value={16}>Fase 16</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="outlined-number"
                                label="Duracion en Segundos"
                                type="number"
                                value={currentPaso.duracion}
                                name='duracion'
                                onChange={handlePaso}
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

const planes2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']

const planes4 = ["plan1","plan2","plan3","plan4","plan5","plan6","plan7","plan8","plan9","plan10","plan11","plan12"]

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


