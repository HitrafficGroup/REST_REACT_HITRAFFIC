import React,{useState} from 'react';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../css/HorariosView.css';
export default function HorariosView(){
    const [horarios,setHorarios] = useState([
        	{hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
            {hora: '2022-01-01T00:00:00',modoOperativo: 'Tiempo Operativo',plan: 1,desfase:1},
    ]);
    const [operativos,setOperativos] =  useState([{fecha:'',tiempoeje:''}]);
    const [modalHorarios,setModalHorarios] =useState(false);

    const editarHorarios = () =>{
        setModalHorarios(true);
    }
    const aplicarLosCambios = () => {
        setModalHorarios(false);
    }

    return(
        <>
      <Container maxWidth="md">
                <h1>Horarios View</h1>
                <Grid container spacing={1}>
                <Grid item xs={12} >
                <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>Nro</Th>
                                    <Th className='home-t-th'>Hora de Inicio</Th>
                                    <Th className='home-t-th'>Modo Operativo</Th>
                                    <Th className='home-t-th'>Plan No.</Th>
                                    <Th className='home-t-th'>Desfase</Th>
                                    <Th className='home-t-th'>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {horarios.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {index+1}
                                        </Td>
                                        <Td >
                                            {dato.hora}
                                        </Td>
                                        <Td >
                                            {dato.modoOperativo}
                                        </Td>
                                        <Td >
                                            {dato.plan}
                                        </Td>
                                        <Td >
                                            {dato.desfase}
                                        </Td>
                                        <Td >
                                        <Button variant="contained" onClick={editarHorarios} color='crema'>Editar</Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained">Text</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained">Text</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Parametros Operativos del Controlador</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Definicion de Fin de Semana</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup  className='alinear'>
                            <FormControlLabel control={<Checkbox />} label="Lunes" />
                            <FormControlLabel control={<Checkbox />} label="Martes" />
                            <FormControlLabel control={<Checkbox />} label="Miercoles" />
                            <FormControlLabel control={<Checkbox />} label="Jueves" />
                            <FormControlLabel control={<Checkbox />} label="Viernes" />
                            <FormControlLabel control={<Checkbox />} label="Sabado" />
                            <FormControlLabel control={<Checkbox />} label="Domingo" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Definicion de dia Festivo</h3>
                    </Grid>
                    <Grid item xs={4}>
                        <h4>Definir dia especial: </h4>
                    </Grid>
                    <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Date desktop"
                                inputFormat="MM/DD/YYYY"
                                renderInput={(params) => <TextField {...params} />}
                                />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                    <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modo Operativo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Sentido"
                                >
                                    <MenuItem value={'Izquierda'}>Tiempo Fijo</MenuItem>
                                    <MenuItem value={'Derecha'}>Pulsante</MenuItem>
                                    <MenuItem value={'Giro Izquierda'}>Destello</MenuItem>
                                    <MenuItem value={'Giro Derecha'}>Giro Derecha</MenuItem>
                                    <MenuItem value={'Peatonal 1'}>Peatonal 1</MenuItem>
                                    <MenuItem value={'Peatonal 2'}>Peatonal 2</MenuItem>
                                </Select>
                            </FormControl>
                </Grid>
                <Grid item xs={4}>
                <Button variant="contained"  color='crema'>Crear</Button>
                </Grid>
                <Grid item xs={4}>
                <Button variant="contained" color='crema'>Borrar</Button>
                </Grid>
                <Grid item xs={12} >
                <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>Fecha</Th>
                                    <Th className='home-t-th'>Tiempo de Ejecucion</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {operativos.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td >
                                            {dato.fecha}
                                        </Td>
                                        <Td >
                                            {dato.tiempoeje}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        </Grid>
                    <Grid item xs={12} >
                        <div className='blank-box'>

                        </div>
                    </Grid>

                </Grid>
            </Container> 


            {/* se crea el modal */}
            <Modal isOpen={modalHorarios} >
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Basic example"
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                
                            />
                        </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modo Operativo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Sentido"
                                >
                                    <MenuItem value={'Izquierda'}>Tiempo Fijo</MenuItem>
                                    <MenuItem value={'Derecha'}>Pulsante</MenuItem>
                                    <MenuItem value={'Giro Izquierda'}>Destello</MenuItem>
                                    <MenuItem value={'Giro Derecha'}>Giro Derecha</MenuItem>
                                    <MenuItem value={'Peatonal 1'}>Peatonal 1</MenuItem>
                                    <MenuItem value={'Peatonal 2'}>Peatonal 2</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Plan</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                  
                                >
                                    <MenuItem value={'Amarillo'}>1</MenuItem>
                                    <MenuItem value={'Rojo'}>2</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Desfase</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                >
                                    <MenuItem value={'Amarillo'}>1</MenuItem>
                                    <MenuItem value={'Rojo'}>2</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" onClick={aplicarLosCambios} color='crema' >
                        Aplicar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
    
    }