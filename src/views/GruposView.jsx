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
const gruposDefault = [
    {
        grupo: 1,
        Direccion: 'Norte',
        Sentido: 'Izquierda',
        Destello: 'Amarillo'
    },
    {
        grupo: 2,
        Direccion: 'Norte',
        Sentido: 'Izquierda',
        Destello: 'Amarillo'
    },
    {
        grupo: 3,
        Direccion: 'Norte',
        Sentido: 'Izquierda',
        Destello: 'Amarillo'
    },
    {
        grupo: 4,
        Direccion: 'Norte',
        Sentido: 'Izquierda',
        Destello: 'Amarillo'
    }

]
export default function GruposView() {
    const [grupos, setGrupos] = useState(gruposDefault);
    const [direccion, setDireccion] = useState('norte');
    const [sentido, setSentido] = useState('Derecha');
    const [destello, setDestello] = useState('Amarillo');
    const [modalGrupo, setModalGrupo] = useState(false);
    const [conflictg1g2,setConflictg1g2] = useState(false);
    const [conflictg1g3,setConflictg1g3] = useState(false);
    const [conflictg1g4,setConflictg1g4] = useState(false);
    const [conflictg2g3,setConflictg2g3] = useState(false);
    const [conflictg2g4,setConflictg2g4] = useState(false);
    const [conflictg3g4,setConflictg3g4] = useState(false);
    const abrirModalGrupo = () => {
        setModalGrupo(true);
    }
    const guardarCambiosGrupo = () => {
        setModalGrupo(false);
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
    const detectg1g2 = () =>{
        console.log('se clickeo la g1 y g2')
        setConflictg1g2(!conflictg1g2)
    }
    const detectg1g3 = () =>{
        console.log('se clickeo la g1 y g3')
        setConflictg1g3(!conflictg1g3)
    }
    const detectg1g4 = () =>{
        console.log('se clickeo la g1 y g4')
        setConflictg1g4(!conflictg1g4)
    }
    // const detectg2g3 = () =>{
    //     console.log('se clickeo la g1 y g4')
    //     setConflictg1g4(!conflictg1g4)
    // }
    // const detectg2g4 = () =>{
    //     console.log('se clickeo la g1 y g4')
    //     setConflictg1g4(!conflictg1g4)
    // }
  
    return (<>
        <Container maxWidth="md">
            <h1>Grupos View</h1>
            <Grid container spacing={1}>
                <Grid item xs={12}>
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
                                        {dato.Direccion}
                                    </Td>
                                    <Td >
                                        {dato.Sentido}
                                    </Td>
                                    <Td >
                                        {dato.Destello}
                                    </Td>
                                    <Td >
                                        <Button variant="contained" color='advertencia' onClick={abrirModalGrupo} >Modificar</Button>
                                    </Td>

                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained">Leer Datos</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained">Cargar Cambios</Button>
                </Grid>
                <Grid item xs={12}>
                    <h5>Configuracion conflicto de Verdes</h5>
                </Grid>
            
                <Grid item xs={12}>
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
                                <td id="con_g1g2" onClick={detectg1g2} className={conflictg1g2 ? 'activated-conflict':'desactivated-conflict'} ></td>
                                <td id="con_g1g3" onClick={detectg1g3} className={conflictg1g3 ? 'activated-conflict':'desactivated-conflict'}></td>
                                <td id="con_g1g4" onClick={detectg1g4} className={conflictg1g4 ? 'activated-conflict':'desactivated-conflict'}></td>
                            </tr>
                            <tr id="con_fila2" style={{ height: "5rem" }}>
                                <td>G2</td>
                                <td></td>
                                <td></td>
                                <td id="con_g2g3"></td>
                                <td id="con_g2g4"></td>
                            </tr>
                            <tr id="con_fila3" style={{ height: "5rem" }}>
                                <td>G3</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td id="con_g3g4"></td>
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
                </Grid>
                <Grid item xs={12}>
                    <h5>Opciones de uso para salidas de controlador</h5>
                </Grid>
                <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked />} label="Activar Modo destello cuando haya conflicto de verdes" />
                    <FormControlLabel control={<Switch />} defaultChecked label="Activar Modo destello cuando luz Roja y Verde se activen del mismo grupo" />
                    <FormControlLabel control={<Switch />} label="Activar Modo destello cuando una salida de luz Roja falle" />
                    </FormGroup>
                </Grid>  
           
                    <Grid item xs={6}>
                        <Button variant="contained">Leer Datos</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained">Cargar Cambios</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <div className='blank-space'>

                        </div>
                    </Grid>
            </Grid>
            {/* SE CREA MODAL PARA LA EDICION DE LOS PARAMETROS */}
            <Modal isOpen={modalGrupo} >
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
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Direccion</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={direccion}
                                    label="Direccion"
                                    onChange={handleChangeDireccion}
                                >
                                    <MenuItem value={'norte'}>Norte</MenuItem>
                                    <MenuItem value={'sur'}>Sur</MenuItem>
                                    <MenuItem value={'este'}>Este</MenuItem>
                                    <MenuItem value={'oeste'}>Oeste</MenuItem>
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
                    <Button variant="contained" color='crema' onClick={guardarCambiosGrupo}>
                        Aplicar
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>


    </>);
}