import React, { useState } from 'react';
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
import Swal from 'sweetalert2';
import FormGroup from '@mui/material/FormGroup';
import { getHorariosFromRestApi, postHorariosFromRestApi, getDiasEspecialesControlador } from '../js/apiFunctions'
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import '../css/HorariosView.css';
import CardController from '../components/CardController';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function HorariosView() {
    const [horarios, setHorarios] = useState(horariosPorDefecto);
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers);
    const [operativos, setOperativos] = useState([{ fecha: '', tiempoeje: '' }]);
    const [modalHorarios, setModalHorarios] = useState(false);
    const [tipoDia, setTipoDia] = useState(' ');
    const [planSemaforo, setPlanSemaforo] = useState('1');
    const [modoSemaforo, setModoSemaforo] = useState(1);
    const [desfaseSemaforo, setDesfaseSemaforo] = useState('0');
    const [time1, setTime1] = useState(new Date());
    const [objHorarios, setObjHorarios] = useState(null);
    const [habilitar1, setHabilitar1] = useState(true);
    const [habilitar2, setHabilitar2] = useState(false);
    const [deshabilitar3, setDeshabilitar3] = useState(true);
    const [deshabilitar4, setDeshabilitar4] = useState(false);
    const [clunes, setClunes] = useState(false);
    const [cmartes, setCmartes] = useState(false);
    const [cmiercoles, setCmiercoles] = useState(false);
    const [cjueves, setCjueves] = useState(false);
    const [cviernes, setCviernes] = useState(false);
    const [csabado, setCsabado] = useState(false);
    const [cdomingo, setCDomingo] = useState(false);
    const [claseDia,setClaseDia] = useState(1);
    const [tablaDias,setTablaDias] = useState([]);
    const [currentHorario, setCurrentHorario] = useState(
        { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    );
    const editarHorarios = (data) => {
        console.log(data)
        setCurrentHorario(data);
        setPlanSemaforo(data.plan.toString())
        setModoSemaforo(data.mod)
        setDesfaseSemaforo(data.desfase)
        let horas = data.horas
        let minutos = data.minutos
        let tiempo = new Date(`Nov 02 1999 ${horas}:${minutos} GMT-0500 (Ecuador Time)`)
        setTime1(tiempo)
        setModalHorarios(true);

    }
    const ChangeLunes = (event) => {
        setClunes(event.target.checked);
    };
    const ChangeMartes = (event) => {
        setCmartes(event.target.checked);
    };
    const ChangeMiercoles = (event) => {
        setCmiercoles(event.target.checked);
    };
    const ChangeJueves = (event) => {
        setCjueves(event.target.checked);
    };
    const ChangeViernes = (event) => {
        setCviernes(event.target.checked);
    };
    const ChangeSabado = (event) => {
        setCsabado(event.target.checked);
    };
    const ChangeDomingo = (event) => {
        setCDomingo(event.target.checked);
    };


    const handleTime1 = (newValue) => {
        setTime1(newValue)
        currentHorario['horas'] = newValue.$H.toString()
        currentHorario['minutos'] = newValue.$m.toString()
    }
    const aplicarLosCambios = () => {
        var temp = currentHorario
        temp['plan'] = parseInt(planSemaforo)
        temp['mod'] = modoSemaforo
        temp['desfase'] = desfaseSemaforo
        setCurrentHorario(temp)
        console.log(temp);
        setModalHorarios(false);
    }

    const handleModoSemaforo = (event) => {
        console.log(event.target.value);
        setModoSemaforo(event.target.value);

    }
    const handleFaseSemaforo = (event) => {
        setDesfaseSemaforo(event.target.value);
    }
    const handleClaseDia = (event) =>{
        
        setClaseDia(event.target.value);
    }

    const handleTipoDia = (event) => {
        if (objHorarios !== null) {
            setTipoDia(event.target.value);
            console.log(event.target.value);
            if (event.target.value === 'dia_ordinario') {
                console.log('selecciono dia ordinario');
                setHorarios(objHorarios[event.target.value])
            } else if (event.target.value === 'fin_semana') {
                console.log('selecciono fin de semana');
                setHorarios(objHorarios[event.target.value])
            } else if (event.target.value === 'dia_festivo') {
                console.log('selecciono dia festivo');
                setHorarios(objHorarios[event.target.value])
            } else {
                console.log('no selecciono nada');
                setHorarios(horariosPorDefecto)
            }
        } else {
            console.log("no data")
        }

    };
    const leerHorariosFromRestApi = async () => {
        try {
            setHabilitar2(true);

            const result = await getHorariosFromRestApi(controlerState.mac, controlerState.ip)
            setObjHorarios(result)
            console.log(result);
            setHorarios(horariosPorDefecto)
            setTipoDia('');
            setHabilitar1(false)
            setHabilitar2(false);
        } catch (e) {
            console.log(e);
        }
    }
    const modoFormat = (tipo) => {
        if (tipo === 1) {
            return 'tiempo Fijo'
        } else if (tipo === 2) {
            return 'Pulsante'
        }
        else if (tipo === 3) {
            return 'Destello'
        }
        else if (tipo === 4) {
            return 'Todo en Rojo'
        } else if (tipo === 5) {
            return 'Apagado'
        }
    }
    const formatearTipoDia = (data) => {
        if (data === 'dia_ordinario') {
            return "0"
        } else if (data === 'fin_semana') {
            return "1"
        } else {
            return "2"
        }
    }
    const LeerParamOperativos = async () => {
        try {
            setDeshabilitar4(true);
            const data = await getDiasEspecialesControlador(controlerState.mac, controlerState.ip);
            console.log(data);
            setClunes(data['fines_semana'][1].estado)
            setCmartes(data['fines_semana'][2].estado)
            setCmiercoles(data['fines_semana'][3].estado)
            setCjueves(data['fines_semana'][4].estado)
            setCviernes(data['fines_semana'][5].estado)
            setCsabado(data['fines_semana'][6].estado)
            setCDomingo(data['fines_semana'][0].estado)
            setTablaDias(data['dia_festivo'])
            setDeshabilitar3(false)
            setDeshabilitar4(false);
        } catch (error) {
            setDeshabilitar4(false);
            setDeshabilitar3(true);
        }
      
    }
    const cargarDatos = async () => {

        const data = horarios
        console.log(data)
        var newObject = {}
        for (let num = 0; num < 16; num++) {


            let mod = data[num].mod
            let plan = data[num].plan

            mod = parseInt(mod).toString(2)
            plan = parseInt(plan).toString(2)
            let bits_faltantes_mod = 3 - mod.length
            let bits_faltantes_plan = 5 - plan.length
            for (let bit = 0; bit < bits_faltantes_mod; bit++) {
                mod = "0" + mod
            }
            for (let bit = 0; bit < bits_faltantes_plan; bit++) {
                plan = "0" + plan
            }
            let mod_plan = mod + plan
            mod_plan = parseInt(mod_plan, 2)
            let horas = data[num].horas
            let minutos = data[num].minutos
            newObject['hora' + (num + 1)] = parseInt(horas, 16).toString()
            newObject['minuto' + (num + 1)] = parseInt(minutos, 16).toString()
            newObject['desfase' + (num + 1)] = data[num].desfase
            newObject['mod_plan' + (num + 1)] = mod_plan


        }
        newObject['ip'] = controlerState.ip
        newObject['num_horario'] = formatearTipoDia(tipoDia)



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
                    postHorariosFromRestApi(newObject);

                } catch (e) {
                    console.log(e);

                }

            }
        })


    }
    return (
        <>
            <Container maxWidth="md">
                <div className='titulos-horarios'>
                    <h5>Configuracion de Grupos</h5>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tipoDia}
                                label="Tipo"
                                onChange={handleTipoDia}
                            >
                                <MenuItem value={''}>Escoga Una Opcion</MenuItem>
                                <MenuItem value={'dia_ordinario'}>Dia Ordinario</MenuItem>
                                <MenuItem value={'fin_semana'}>Fin De Semana</MenuItem>
                                <MenuItem value={'dia_festivo'}>Dia Festivo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color='verde2' onClick={leerHorariosFromRestApi} sx={{ height: '100%' }} disabled={habilitar2} fullWidth>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{ height: '100%' }} fullWidth onClick={cargarDatos} disabled={habilitar1} >Cargar Datos</Button>
                    </Grid>
                    <Grid item xs={12} >
                        <div className={habilitar1 ? 'disabled-tabla-horarios' : 'habilited-tabla-horarios'}>
                            <div className='h-scroller '>
                                <Table className='home-t'>
                                    <Thead>
                                        <Tr>
                                            <Th className='home-t-th'>Nro</Th>
                                            <Th className='home-t-th'>Hora de Inicio 24h</Th>
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
                                                    {index + 1}
                                                </Td>
                                                <Td >
                                                    {dato.horas + ':' + dato.minutos}
                                                </Td>
                                                <Td >
                                                    {dato.mod ? modoFormat(dato.mod) : 'No especificado'}
                                                </Td>
                                                <Td >
                                                    {dato.plan}
                                                </Td>
                                                <Td >
                                                    {dato.desfase}
                                                </Td>
                                                <Td >
                                                    <Button variant="contained" onClick={() => { editarHorarios(dato) }} color='crema'>Editar</Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <h5>Parametros Operativos del Controlador</h5>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Definicion de Fin de Semana</p>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup className='alinear'>
                            <FormControlLabel control={<Checkbox checked={clunes} onChange={ChangeLunes} />} disabled={deshabilitar3} label="Lunes" />
                            <FormControlLabel control={<Checkbox checked={cmartes} onChange={ChangeMartes} />} disabled={deshabilitar3} label="Martes" />
                            <FormControlLabel control={<Checkbox checked={cmiercoles} onChange={ChangeMiercoles} />} disabled={deshabilitar3} label="Miercoles" />
                            <FormControlLabel control={<Checkbox checked={cjueves} onChange={ChangeJueves} />} disabled={deshabilitar3} label="Jueves" />
                            <FormControlLabel control={<Checkbox checked={cviernes} onChange={ChangeViernes} />} disabled={deshabilitar3} label="Viernes" />
                            <FormControlLabel control={<Checkbox checked={csabado} onChange={ChangeSabado} />} disabled={deshabilitar3} label="Sabado" />
                            <FormControlLabel control={<Checkbox checked={cdomingo} onChange={ChangeDomingo} />} disabled={deshabilitar3} label="Domingo" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Definicion de dia Festivo</p>
                    </Grid>
                    <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Date desktop"
                                disabled={deshabilitar3}
                                inputFormat="MM/DD/YYYY"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo de Dia</InputLabel>
                            <Select
                                disabled={deshabilitar3}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={claseDia}
                                label="Tipo de Dia"
                                onChange={handleClaseDia}
                            >
                                <MenuItem value={1}>Dia Ordinario</MenuItem>
                                <MenuItem value={2}>Fin de Semana</MenuItem>
                                <MenuItem value={3}>Dia Festivo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar3} color='advertencia'>Crear</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar3} color='rojo'>Borrar</Button>
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
                                {tablaDias.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td >
                                            {dato.mes}
                                        </Td>
                                        <Td >
                                            {dato.descriptor_modo}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item xs={4} >
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={LeerParamOperativos} color='verde2'>LEER DATOS</Button>
                    </Grid>
                    <Grid item xs={4} >
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar3} >CARGAR DATOS</Button>
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
                            Configuracion de Horarios
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
                                    value={time1}
                                    onChange={handleTime1}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modo Operativo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={modoSemaforo}
                                    label="Modo Operativo"
                                    name='mod'
                                    onChange={handleModoSemaforo}
                                >
                                    <MenuItem value={1}>Tiempo Fijo</MenuItem>
                                    <MenuItem value={2}>Pulsante</MenuItem>
                                    <MenuItem value={3}>Destello</MenuItem>
                                    <MenuItem value={4}>Todo en Rojo</MenuItem>
                                    <MenuItem value={5}>Apagado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                name='plan'
                                value={planSemaforo}
                                options={planes2}
                                onChange={(event, newValue) => { setPlanSemaforo(newValue) }}
                                id="controllable-states-demo"
                                renderInput={(params) => <TextField {...params} label="Escoga Un Plan" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-number"
                                label="Desfase"
                                name='desfase'
                                onChange={handleFaseSemaforo}
                                fullWidth
                                value={desfaseSemaforo}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <div className='botones-modal-h'>

                        <Button variant="contained" sx={{ marginRight: 5 }} onClick={aplicarLosCambios} color='verde2' >
                            Aplicar
                        </Button>
                        <Button variant="contained" onClick={() => { setModalHorarios(false) }} color='rojo' >
                            Cancelar
                        </Button>

                    </div>
                </ModalFooter>
            </Modal>
            <div className='horarios-card'>
                <CardController />
            </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar4}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={habilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    );

}
const horariosPorDefecto = [
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },

]


const planes2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']