import CardController from "../../components/CardController";
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { db } from "../../firebase/firebase-config";
import { updateDoc, doc } from "firebase/firestore";
import {
    getPlan1SW12, getPlan2SW12, getPlan3SW12, getPlan4SW12, getPlan5SW12,
    getPlan6SW12, getPlan7SW12, getPlan8SW12, getOperativeParamsSW12,
    postPlanesSW12, postOtrosParametrosSW12
} from '../../js/apiFunctionsSW12';

import { useSelector, useDispatch } from 'react-redux';
import { addPlan1, addPlan2, addPlan3, addPlan4, addPlan5, addPlan6, addPlan7, addPlan8, addParametros } from "../../features/controlers/controlerSlice";
import IconButton from '@mui/material/IconButton';
//mitze rodriguez
// import { updatePlanesSamplingTime, getCheckDataPlanes } from '../js/gestionSolicitudes';
import Swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
//fases 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function PlanesView() {
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [currentPlan, setCurrentPlan] = useState(planInicial)
    const [numPlan, setNumPlan] = useState(1)
    const [modalEditar, setModalEditar] = useState(false);
    const [currentPaso, setCurrentPaso] = useState({ duracion: 0, fase: 0, id: '' });
    //Variables de parametros Operativos del controlador
    const [destellarVerdePeatonal, setDestellarVerdePeatonal] = useState(0);
    const [destellarVerdeVehicular, setDestellarVerdeVehicular] = useState(0);
    const [tiempoAmarilloVehicular, setTiempoAmarilloVehicular] = useState(0);
    const [tiempoDestelloPrender, setTiempoDestelloPrender] = useState(0);
    const [tiempoMinimoVerde1, setTiempoMinimoVerde1] = useState(0);

    const [tiempoRojoPrender, setTiempoRojoPrender] = useState(0);
    const [tiempoTodoRojo, setTiempoTodoRojo] = useState(0);
    const [valorSincronizacion, setValorSincronizacion] = useState(1);
    //variables funcionales de animacion
    const [deshabilitar, setDeshabilitar] = useState(true);
    const [deshabilitar2, setDeshabilitar2] = useState(false);
    const [deshabilitar3, setDeshabilitar3] = useState(true);
    const [deshabilitar4, setDeshabilitar4] = useState(false);
    const [cambio, setCambio] = useState(false);
    const [dis, setDis] = useState('disabled');
    //esta variable de planes2 debe actualizarse con este formato que es mas adecuado
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const readData = async () => {
        let result = []
        try {
            setDeshabilitar(true)
            setDeshabilitar2(true)
            setDis('disabled')
            if (numPlan === 1) {
                result = await getPlan1SW12(controlerState.ip)
                updateFirebase('plan_1',result)
                dispatch(addPlan1(result))
            } else if (numPlan === 2) {
                result = await getPlan2SW12(controlerState.ip)
                updateFirebase('plan_2',result)
                dispatch(addPlan2(result))
            } else if (numPlan === 3) {
                result = await getPlan3SW12(controlerState.ip)
                updateFirebase('plan_3',result)
                dispatch(addPlan3(result))
            } else if (numPlan === 4) {
                result = await getPlan4SW12(controlerState.ip)
                updateFirebase('plan_4',result)
                dispatch(addPlan4(result))
            } else if (numPlan === 5) {
                result = await getPlan5SW12(controlerState.ip)
                updateFirebase('plan_5',result)
                dispatch(addPlan5(result))
            } else if (numPlan === 6) {
                result = await getPlan6SW12(controlerState.ip)
                updateFirebase('plan_6',result)
                dispatch(addPlan6(result))
            } else if (numPlan === 7) {
                result = await getPlan7SW12(controlerState.ip)
                updateFirebase('plan_7',result)
                dispatch(addPlan7(result))
            } else if (numPlan === 8) {
                result = await getPlan8SW12(controlerState.ip)
                updateFirebase('plan_8',result)
                dispatch(addPlan8(result))
            }

            setCurrentPlan(result)
            setDeshabilitar2(false)
            setDeshabilitar(false)
            setDis('habilited')
        } catch (error) {
            setDeshabilitar2(false)
        }

    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const abrirModalEditar = (data) => {
        setCurrentPaso(data);
        setModalEditar(true);
    }

    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }

    const leerOtrosParametrosApi = async () => {
        try {
            setDeshabilitar4(true)
            let datosObtenidos = await getOperativeParamsSW12(controlerState.ip);
            updateFirebase("otros_parametros",datosObtenidos);
            dispatch(addParametros(datosObtenidos));
            setTiempoDestelloPrender(parseInt(datosObtenidos.destello_al_encender));
            setDestellarVerdePeatonal(parseInt(datosObtenidos.destello_verde_peatonal));
            setDestellarVerdeVehicular(parseInt(datosObtenidos.destello_verde_vehicular));
            setTiempoMinimoVerde1(parseInt(datosObtenidos.min_verde));
            setTiempoAmarilloVehicular(parseInt(datosObtenidos.tiempo_amarillo_vehicular));
            setTiempoRojoPrender(parseInt(datosObtenidos.tiempo_en_rojo_al_encender));
            setTiempoTodoRojo(parseInt(datosObtenidos.tiempo_todo_rojo));
            setDeshabilitar3(false)
            setDeshabilitar4(false)
        } catch (e) {
            console.log(e);
            setDeshabilitar4(false)
        }
    }

    const cargarOtrosParametrosAPI = () => {
        let newParams = {
            destellar_verde_peatonal: destellarVerdePeatonal.toString(),
            destellar_verde_vehicular: destellarVerdeVehicular.toString(),
            tiempo_amarillo_vehicular: tiempoAmarilloVehicular.toString(),
            tiempo_destello_prender: tiempoDestelloPrender.toString(),
            tiempo_rojo_prender: tiempoRojoPrender.toString(),
            tiempo_todo_rojo: tiempoTodoRojo.toString(),
            time_min_green: tiempoMinimoVerde1.toString(),
            valor_sincronizacion: valorSincronizacion.toString()
        }
        let min_verde = parseInt(tiempoMinimoVerde1)
        let min1 = min_verde & 0xff
        let min2 = (min_verde >> 8) & 0xff
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
            text: 'Estos Cambios se guardaran en el Controlador',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeshabilitar4(true);
                setCambio(false);
                updateFirebase("otros_parametros",newParams);
                await postOtrosParametrosSW12({trama:params_data,ip:controlerState.ip});
                setDeshabilitar4(false);
            }
        })

    }
    const actualizarPaso = () => {
        let data_paso = JSON.parse(JSON.stringify(currentPaso))
        let plan = JSON.parse(JSON.stringify(currentPlan))
        data_paso.duracion = parseInt(data_paso.duracion)
        let plan_modify = plan.map((item) => {

            if (item.id === data_paso.id) {
                return data_paso;
            } else {
                return item;
            }

        })
        let temp = []
        plan_modify.forEach(element => {
            if (element.duracion > 0) {
                temp.push(element)
            }
        });

        for (let i = 0; i < 13; i++) {
            if (i > temp.length) {
                temp.push(paso_aux)
            }
        }
        let final_data = JSON.parse(JSON.stringify(temp))
        for (let i = 0; i < 12; i++) {
            final_data[i].id = `paso-${i}`
        }
        setModalEditar(false);
        setCurrentPlan(final_data);
        setCambio(true)
    }

    const handlePaso = (event) => {
        setCurrentPaso({
            ...currentPaso,
            [event.target.name]: event.target.value,
        });
    };




    const EliminarPlan = (_data) => {
        console.log(_data)
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Se Eliminara el siguiente plan',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                let planes = JSON.parse(JSON.stringify(currentPlan))
                let aux_data = JSON.parse(JSON.stringify(_data))
                let data_modify = []
                planes.forEach(element => {
                    if (element.id !== aux_data.id) {
                        data_modify.push(element)
                    }
                });
                data_modify.push({ id: 'paso-11', fase: 0, duracion: 0 })
                data_modify.forEach((item, index) => {
                    item.id = `paso-${index}`
                })
                setCurrentPlan(data_modify)
            }
        })

    }


    const handleNumPlan = (event) => {
        setDis('disabled')
        setDeshabilitar(true)
        setNumPlan(event.target.value);
    };
    const cargarCambios = () => {
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
                    setDeshabilitar2(true)
                    let data_plan = [numPlan - 1]
                   
                    for (let i = 0; i < 12; i++) {
                        data_plan.push(parseInt(currentPlan[i].fase))
                        data_plan.push(parseInt(currentPlan[i].duracion))
           
                    }
                    setCambio(false);
                    await postPlanesSW12({ trama:data_plan,ip:controlerState.ip });
                    setDeshabilitar2(false)
                }
            })
        } catch (e) {
            console.log(e)
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

                    <div className={`${dis}-table-p`}>
                        <TableContainer sx={{ maxHeight: 430 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            key={"num"}
                                            align={"left"} 
                                        >
                                            Nro
                                        </TableCell>
                                        <TableCell
                                            key={"fase"}
                                            align={"left"} 
                                        >
                                            Fase a ejecutar
                                        </TableCell>
                                        <TableCell
                                            key={"dura"}
                                            align={"center"}

                                        >
                                            Duracion
                                        </TableCell>

                                        <TableCell
                                            key={"acc"}
                                            align={"left"}

                                        >
                                            Acciones
                                        </TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentPlan
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((dato, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align={"left"}>
                                                        {dato.id}
                                                    </TableCell>
                                                    <TableCell align={"left"}>
                                                        <Chip label={'fase - ' + dato.fase} sx={{ width: 100 }} color={'anaranjado1'} variant="outlined" />
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        <Chip label={dato.duracion + 's'} sx={{ width: 100 }} color={'morado1'} variant="outlined" />
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton aria-label="delete" color="amarillo" onClick={() => { abrirModalEditar(dato) }} >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" color="rojo" onClick={() => { EliminarPlan(dato) }} >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={currentPlan.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
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
                            onChange={(event) => { setTiempoDestelloPrender(event.target.value) }}
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
                            onChange={(event) => { setDestellarVerdePeatonal(event.target.value) }}
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
                            onChange={(event) => { setDestellarVerdeVehicular(event.target.value) }}
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
                            onChange={(event) => { setValorSincronizacion(event.target.value) }}
                            value={valorSincronizacion} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} onClick={leerOtrosParametrosApi} >Leer Datos</Button>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} onClick={cargarOtrosParametrosAPI} disabled={deshabilitar3} >Cargar Cambios</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <div style={{ height: 40 }}>

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
            <CardController />

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




let paso_aux = { id: 'paso-4', fase: 0, duracion: 0 }