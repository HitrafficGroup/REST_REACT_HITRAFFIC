import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import '../css/GruposView.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import { getGruposControlador, getConflictoVerdesControlador } from '../js/apiFunctions'
import Collapse from '@mui/material/Collapse';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CardController from '../components/CardController';
import Swal from 'sweetalert2';
import Alert from '@mui/material/Alert';

export default function GruposView() {
    const controlerState = useSelector(state => state.controlers);
    const [grupos, setGrupos] = useState(gruposDefault);
    const [direccion, setDireccion] = useState('norte');
    const [sentido, setSentido] = useState('Derecha');
    const [destello, setDestello] = useState('Amarillo');
    const [modalGrupo, setModalGrupo] = useState(false);
    const [conflictg1g2, setConflictg1g2] = useState(false);
    const [conflictg1g3, setConflictg1g3] = useState(false);
    const [conflictg1g4, setConflictg1g4] = useState(false);
    const [conflictg2g3, setConflictg2g3] = useState(false);
    const [conflictg2g4, setConflictg2g4] = useState(false);
    const [conflictg3g4, setConflictg3g4] = useState(false);
    const [deshabilitar, setDeshabilitar] = useState(true);
    const [deshabilitar2, setDeshabilitar2] = useState(false);
    const [deshabilitar3, setDeshabilitar3] = useState(true);
    const [deshabilitar4, setDeshabilitar4] = useState(false);
    const [cambioGrupos, setCambioGrupos] = useState(false);
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [cambioConflictos, setCambioConflictos] = useState(false);
    const [currentGrupo, setCurrentGrupo] = useState(gruposDefault[0]);
    const abrirModalGrupo = (data) => {
        setCurrentGrupo(data);
        setDireccion(data.direccion)
        setSentido(data.sentido)
        setDestello(data.destello)
        console.log(data)
        setModalGrupo(true);
    }


    const handleChangeDireccion = (event) => {
        setDireccion(event.target.value);
    };
    const handleChangeSentido = (event) => {
        setSentido(event.target.value);
    };
    const handleChangeDestello = (event) => {
        setDestello(event.target.value);
    }
    const detectg1g2 = () => {
        setCambioConflictos(true);
        setConflictg1g2(!conflictg1g2)
    }
    const detectg1g3 = () => {
        setCambioConflictos(true);
        setConflictg1g3(!conflictg1g3)
    }
    const detectg1g4 = () => {
        setCambioConflictos(true);
        setConflictg1g4(!conflictg1g4)
    }
    const detectg2g3 = () => {
        setCambioConflictos(true);
        setConflictg2g3(!conflictg2g3)
    }
    const detectg2g4 = () => {
        setCambioConflictos(true);
        setConflictg2g4(!conflictg2g4)
    }
    const detectg3g4 = () => {
        setCambioConflictos(true);
        setConflictg3g4(!conflictg3g4)
    }
    const handleChange1 = (event) => {
        setCheck1(event.target.checked);
    };
    const handleChange2 = (event) => {
        setCheck2(event.target.checked);
    };
    const handleChange3 = (event) => {
        setCheck3(event.target.checked);
    };
    const leerGruposFromRestApi = async () => {
        setDeshabilitar2(true);
        setCambioGrupos(false);
        const response = await getGruposControlador(controlerState.mac, controlerState.ip)
        const responseFormat = []
        for (let i = 1; i < 5; i++) {
            let temp = response['grupo' + i]
            let newObject = {
                grupo: temp.grupoNum,
                direccion: temp.direccionDescripcion,
                sentido: temp.sentidoDescripcion,
                destello: temp.destelloDescripcion,
            }
            responseFormat.push(newObject);
        }
        setGrupos(responseFormat)
        setDeshabilitar(false)
        setDeshabilitar2(false);
    }
    const mapConflicts = (respuesta) => {
        const ch1 = respuesta[controlerState.mac]['check1']
        const ch2 = respuesta[controlerState.mac]['check2']
        const ch3 = respuesta[controlerState.mac]['check3']
        if (ch1 === "1") {
            setCheck1(true)
        } else {
            setCheck1(false)
        }

        if (ch2 === "1") {
            setCheck2(true)
        } else {
            setCheck2(false)
        }

        if (ch3 === "1") {
            setCheck3(true)
        } else {
            setCheck3(false)
        }

        for (let fila = 0; fila < 3; fila++) {
            let binario = respuesta[controlerState.mac][`fila${fila + 1}`]
            let grupo_fila = fila + 1

            for (let index_b = 0; index_b < binario.length; index_b++) {
                if (binario[index_b] == "1") {
                    caseVerify(grupo_fila, index_b, true)
                    console.log(index_b)
                } else {
                    caseVerify(grupo_fila, index_b, false)
                }

            }
        }
    }
    const caseVerify = (filas, columnas, val) => {
        if (filas === 1) {
            if (columnas === 0) {
                setConflictg1g4(val)
            }
            else if (columnas === 1) {
                setConflictg1g3(val)
            }
            else if (columnas === 2) {
                setConflictg1g2(val)
            }
        } else if (filas === 2) {
            if (columnas === 1) {
                setConflictg2g3(val)
            } else if (columnas === 0) {
                setConflictg2g4(val)
            }
        } else if (filas === 3) {
            if (columnas === 0) {
                setConflictg3g4(val)
            }

        }
    }
    const leerConflictosApi = async () => {
        setDeshabilitar4(true)
        setCambioConflictos(false)
        const response = await getConflictoVerdesControlador(controlerState.mac, controlerState.ip)
        mapConflicts(response)
        setDeshabilitar3(false)
        setDeshabilitar4(false)
    }
    const aplicarCambiosGrupos = () => {
        const newGrupo = currentGrupo
        newGrupo['destello'] = destello
        newGrupo['direccion'] = direccion
        newGrupo['sentido'] = sentido
        console.log(newGrupo)
        setModalGrupo(false)
        setCambioGrupos(true)
    }
    const cargarDatosGrupos = () => {
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Estos Cambios se guardaran en el Controlador',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    console.log(grupos)
                    setCambioGrupos(false)

                } catch (e) {
                    console.log(e);

                }

            }
        })
    }


    const cargarDatosConflictos = () => {
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Estos Cambios se guardaran en el Controlador',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    console.log('');

                } catch (e) {
                    console.log(e);

                }

            }
        })
    }


    return (<>
        <Container maxWidth="md">
            <div className='blank-space'>

            </div>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <h5>Configuracion de Grupos</h5>
                </Grid>
                <Grid item xs={12}>
                    <div className={deshabilitar ? 'disabled-grupos' : 'habilited-grupos'}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>

                                    <Th className='home-t-th'>Grupo</Th>
                                    <Th className='home-t-th'>Direccion</Th>
                                    <Th className='home-t-th'>Sentido</Th>
                                    <Th className='home-t-th'>Destello</Th>
                                    <Th className='home-t-th'>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {grupos.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {dato.grupo}
                                        </Td>
                                        <Td >
                                            {dato.direccion}
                                        </Td>
                                        <Td >
                                            {dato.sentido}
                                        </Td>
                                        <Td >
                                            {dato.destello}
                                        </Td>
                                        <Td >
                                            <Button variant="contained" color='advertencia' onClick={() => { abrirModalGrupo(dato) }} >Modificar</Button>
                                        </Td>

                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={cambioGrupos}>
                        <Alert
                            severity="warning"
                            sx={{ mb: 2, mt: 2 }}
                        >
                            Se han Generado Cambios en los grupos sin cargar al controlador
                        </Alert>
                    </Collapse>
                </Grid>

                <Grid item xs={3}>
                    <Button variant="contained" color='verde2' sx={{ height: '100%' }} onClick={leerGruposFromRestApi}>Leer Datos</Button>
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained" sx={{ height: '100%' }} onClick={cargarDatosGrupos} disabled={deshabilitar} >Cargar Cambios</Button>
                </Grid>
                <Grid item xs={12}>
                    <h5>Configuracion conflicto de Verdes</h5>
                </Grid>

                <Grid item xs={12}>
                    <div className={deshabilitar3 ? 'disabled-grupos' : 'habilited-grupos'}>
                        <table id="tabla_conflictos" className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">G1</th>
                                    <th scope="col">G2</th>
                                    <th scope="col">G3</th>
                                    <th scope="col">G4</th>
                                </tr>
                                <tr id="con_fila1" style={{ height: "5rem" }}>
                                    <td>G1</td>
                                    <td ></td>
                                    <td id="con_g1g2" onClick={detectg1g2} className={conflictg1g2 ? 'activated-conflict' : 'desactivated-conflict'} ></td>
                                    <td id="con_g1g3" onClick={detectg1g3} className={conflictg1g3 ? 'activated-conflict' : 'desactivated-conflict'}></td>
                                    <td id="con_g1g4" onClick={detectg1g4} className={conflictg1g4 ? 'activated-conflict' : 'desactivated-conflict'}></td>
                                </tr>
                                <tr id="con_fila2" style={{ height: "5rem" }}>
                                    <td>G2</td>
                                    <td></td>
                                    <td></td>
                                    <td id="con_g2g3" onClick={detectg2g3} className={conflictg2g3 ? 'activated-conflict' : 'desactivated-conflict'}  ></td>
                                    <td id="con_g2g4" onClick={detectg2g4} className={conflictg2g4 ? 'activated-conflict' : 'desactivated-conflict'}  ></td>
                                </tr>
                                <tr id="con_fila3" style={{ height: "5rem" }}>
                                    <td>G3</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td id="con_g3g4" onClick={detectg3g4} className={conflictg3g4 ? 'activated-conflict' : 'desactivated-conflict'}   ></td>
                                </tr>
                                <tr style={{ height: "5rem" }}>
                                    <td>G4</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <h5>Opciones de uso para salidas de controlador</h5>
                </Grid>
                <Grid item xs={12}>
                    <FormGroup>
                        <FormControlLabel control={<Switch disabled={deshabilitar3} value={check1} checked={check1} inputProps={{ 'aria-label': 'controlled' }} onChange={handleChange1} />} label="Activar Modo destello cuando haya conflicto de verdes" />
                        <FormControlLabel control={<Switch disabled={deshabilitar3} value={check2} checked={check2} inputProps={{ 'aria-label': 'controlled' }} onChange={handleChange2} />} label="Activar Modo destello cuando luz Roja y Verde se activen del mismo grupo" />
                        <FormControlLabel control={<Switch disabled={deshabilitar3} value={check3} checked={check3} inputProps={{ 'aria-label': 'controlled' }} onChange={handleChange3} />} label="Activar Modo destello cuando una salida de luz Roja falle" />
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={cambioConflictos}>
                        <Alert
                            severity="warning"
                            sx={{ mb: 2 }}
                        >
                            Se han Generado Cambios en los conflictos sin cargar al controlador
                        </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained" onClick={leerConflictosApi} disabled={deshabilitar4} color={'verde2'}>Leer Datos</Button>
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained" onClick={cargarDatosConflictos} disabled={deshabilitar3} >Cargar Cambios</Button>
                </Grid>
                <Grid item xs={12}>
                    <div className='blank-space'>

                    </div>
                </Grid>
            </Grid>
            {/* SE CREA MODAL PARA LA EDICION DE LOS PARAMETROS */}
            <Modal isOpen={modalGrupo} >
                <ModalHeader>
                    <div>
                        <h1>
                            Configuracion Grupo-{currentGrupo.grupo}
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Direccion</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={direccion}
                                    label="Direccion"
                                    onChange={handleChangeDireccion}
                                >
                                    <MenuItem value={'Norte'}>Norte</MenuItem>
                                    <MenuItem value={'Sur'}>Sur</MenuItem>
                                    <MenuItem value={'Este'}>Este</MenuItem>
                                    <MenuItem value={'Oeste'}>Oeste</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Sentido</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Sentido"
                                    onChange={handleChangeSentido}
                                    value={sentido}
                                >
                                    <MenuItem value={'Izquierda'}>Izquierda</MenuItem>
                                    <MenuItem value={'Derecha'}>Derecha</MenuItem>
                                    <MenuItem value={'Giro Izquierda'}>Giro Izquierda</MenuItem>
                                    <MenuItem value={'Giro Derecha'}>Giro Derecha</MenuItem>
                                    <MenuItem value={'Peatonal 1'}>Peatonal 1</MenuItem>
                                    <MenuItem value={'Peatonal 2'}>Peatonal 2</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                    onChange={handleChangeDestello}
                                    value={destello}
                                >
                                    <MenuItem value={'Amarillo'}>Amarillo</MenuItem>
                                    <MenuItem value={'Rojo'}>Rojo</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <div className='botones-modal-h'>

                        <Button variant="contained" sx={{ marginRight: 5 }} onClick={aplicarCambiosGrupos} color='verde2' >
                            Aplicar
                        </Button>
                        <Button variant="contained" onClick={() => { setModalGrupo(false) }} color='rojo' >
                            Cancelar
                        </Button>

                    </div>
                </ModalFooter>
            </Modal>
        </Container>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar4}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <div className='horarios-card'>
            <CardController />
        </div>
    </>);
}


const gruposDefault = [
    {
        grupo: 1,
        direccion: 'Norte',
        sentido: 'Izquierda',
        destello: 'Amarillo'
    },
    {
        grupo: 2,
        direccion: 'Norte',
        sentido: 'Izquierda',
        destello: 'Amarillo'
    },
    {
        grupo: 3,
        direccion: 'Norte',
        sentido: 'Izquierda',
        destello: 'Amarillo'
    },
    {
        grupo: 4,
        direccion: 'Norte',
        sentido: 'Izquierda',
        destello: 'Amarillo'
    }

]
//de los creadores de la mochila de albanil , llegaron los panuelos del ingeniero
//no me juzgen raza , no tenian las del goku en la farmacia