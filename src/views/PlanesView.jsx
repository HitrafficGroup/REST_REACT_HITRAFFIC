import React, { useState,forwardRef } from 'react'
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
import '../css/PlanesView.css'
import { useSelector, useDispatch } from 'react-redux';
import { addPlanes } from "../features/controlers/controlerSlice"
import { getPlanesFromRestApi } from '../js/apiFunctions'

import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
export default function PlanesView() {
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [currentPlan, setCurrentPlan] = useState(planInicial)
    const [selectPlan, setSelectPlan] = useState("plan1");
    const [planes, setPlanes] = useState([])
    const [modalEditar, setModalEditar] = useState(false);
    const [faseSemaforo, setFaseSemaforo] = useState('1');
    const [tiempoSemaforo, setTiempoSemaforo] = useState(0);
    const [sincronizacionSemaforo, setSincronizacionSemaforo] = useState("1")
    const [currentPaso, setCurrentPaso] = useState(0);
    //Variables de parametros Operativos del controlador
    const [tdestello, setTdestello] = useState(0);
    const [trojoprender, setTrojoprender] = useState(0);
    const [tdestelloVpeatonal, setTdestelloVpeatonal] = useState(0);
    const [tdestelloVvehicular, setTdestelloVvehicular] = useState(0);
    const [taVehicular, setTaVehicular] = useState(0);
    const [ttodorojo, setTtodorojo] = useState(0);
    const [tminimoVerde, setTminimoVerde] = useState(0);
    //variables funcionales de animacion
    const [deshabilitar, setDeshabilitar] = useState(true);
    const [deshabilitar2, setDeshabilitar2] = useState(false);
    const [cambio,setCambio] = useState(false)
    const [dis,setDis] = useState('disabled')
    const leerPlanesFromRestApis = async () => {
        let planesControlador
        try {
            setDis('disabled')
            setDeshabilitar(true)
            setDeshabilitar2(true)
            let result = await getPlanesFromRestApi(controlerState.mac, controlerState.ip)
            planesControlador = result[controlerState.mac]
            console.log(planesControlador)
            setDis('habilited')
            setDeshabilitar2(false)
            setDeshabilitar(false)
        }
        catch (e) {
            console.log(e);
            setDeshabilitar(true)
            setDeshabilitar2(false)
        }
        setPlanes(planesControlador)
        console.log(planes)
        dispatch(addPlanes(planesControlador))
        planSelectManager(planesControlador[0].numPlan)
    }

    const abrirModalEditar = (data) => {
        setFaseSemaforo(data.fase.toString());
        setTiempoSemaforo(data.duracion);
        setCurrentPaso(data);
        setModalEditar(true);
    }

    const planSelectManager = (name) => {
        
        const aux = planes
        console.log(aux)
        const filtro = aux.filter(item => item.numPlan === name )
        const data = filtro[0]
        console.log(filtro)
        var nplan = currentPlan;
        
        nplan[0].fase = data.pasos[0]
        nplan[0].duracion = data.pasos[1]

        nplan[1].fase = data.pasos[2]
        nplan[1].duracion = data.pasos[3]
        nplan[2].fase = data.pasos[4]
        nplan[2].duracion = data.pasos[5]
        nplan[3].fase = data.pasos[6]
        nplan[3].duracion = data.pasos[7]

        nplan[4].fase = data.pasos[8]
        nplan[4].duracion = data.pasos[9]

        nplan[5].fase = data.pasos[10]
        nplan[5].duracion = data.pasos[11]

        nplan[6].fase = data.pasos[12]
        nplan[6].duracion = data.pasos[13]

        nplan[7].fase = data.pasos[14]
        nplan[7].duracion = data.pasos[15]

        nplan[8].fase = data.pasos[16]
        nplan[8].duracion = data.pasos[17]

        nplan[9].fase = data.pasos[18]
        nplan[9].duracion = data.pasos[19]

        nplan[10].fase = data.pasos[20]
        nplan[10].duracion = data.pasos[21]

        nplan[11].fase = data.pasos[22]
        nplan[11].duracion = data.pasos[23]
        console.log(nplan)
        setCurrentPlan(nplan);
        setSelectPlan(name)
    }
    const actualizarPaso = () => {
        const temp = currentPlan.map((item)=>{
            if(item.name ===  currentPaso.name){
                item['fase'] = parseInt(faseSemaforo);
                item['duracion'] = tiempoSemaforo;
            }
            return item

        })
        console.log(temp)
        setCurrentPlan(temp);
        setCambio(true)
        setModalEditar(false);
    }
   const cargarCambios = () =>{
    setCambio(false);
   }

    return (
        <>
            <Container maxWidth="md">
                <h1>Planes view</h1>
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
                                        <Tr className="tr-planes" key={index} >
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
                        <h4>Parametros Operativos del Controlador</h4>
                    </Grid>
                    <Grid item xs={4}>

                        <TextField
                            id="outlined-number"
                            label="Tiempo de destello al prender (s)"
                            type="number"
                            onChange={(event) => { setTdestello(event.target.value) }}
                            value={tdestello}
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
                            onChange={(event) => { setTrojoprender(event.target.value) }}
                            value={trojoprender}
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
                            onChange={(event) => { setTdestelloVpeatonal(event.target.value) }}
                            value={tdestelloVpeatonal}
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
                            onChange={(event) => { setTdestelloVvehicular(event.target.value) }}
                            value={tdestelloVvehicular}
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
                            onChange={(event) => { setTaVehicular(event.target.value) }}
                            value={taVehicular}
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
                            onChange={(event) => { setTtodorojo(event.target.value) }}
                            value={ttodorojo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo minimo en verde (s)"
                            type="number"
                            onChange={(event) => { setTminimoVerde(event.target.value) }}
                            value={tminimoVerde}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h4>Sincronizacion</h4>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Direccion"
                                value={sincronizacionSemaforo}
                                onChange={(event) => { setSincronizacionSemaforo(event.target.value) }}
                            >
                                <MenuItem value={'1'}>Hitraffic</MenuItem>
                                <MenuItem value={'2'}>Goia</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="outlined-basic" label="Retardo requerido para otros (s)" variant="outlined" fullWidth  aria-readonly value={0} />
                    </Grid>
                    <Grid item xs={12}>
                        <div className='blank-box'>

                        </div>
                    </Grid>

                </Grid>
            </Container>
           
            {/* <Modal isOpen={deshabilitar2} >
                <ModalHeader>
                    <div>
                        <h1>
                            Cargando ...
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div>

                    </div>
                </ModalBody>
        
            </Modal> */}
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




