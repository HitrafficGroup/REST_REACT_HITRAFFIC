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
import FormGroup from '@mui/material/FormGroup';
import { getHorariosFromRestApi, postHorariosFromRestApi } from '../js/apiFunctions'
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import '../css/HorariosView.css';
import CardController from '../components/CardController';

export default function HorariosView() {
    const [horarios, setHorarios] = useState(horariosPorDefecto);
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [operativos, setOperativos] = useState([{ fecha: '', tiempoeje: '' }]);
    const [modalHorarios, setModalHorarios] = useState(false);
    const [tipoDia, setTipoDia] = useState(' ');
    const [planSemaforo, setPlanSemaforo] = useState('1');
    const [modoSemaforo, setModoSemaforo] = useState(1);
    const [desfaseSemaforo,setDesfaseSemaforo] = useState('0');
    const [time1, setTime1] = useState(new Date());
    const [objHorarios, setObjHorarios] = useState(null);
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
        console.log(event.target.value);
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
            const result = await getHorariosFromRestApi(controlerState.mac, controlerState.ip)
            setObjHorarios(result)
            console.log(result);
            setHorarios(horariosPorDefecto)
            setTipoDia('');
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
    const formatearTipoDia = (data)=>{
        if(data === 'dia_ordinario'){
            return "0"
        }else if (data === 'fin_semana'){
            return "1"
        }else{
            return "2"
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
            newObject['hora'+(num+1)] = parseInt(horas, 16).toString()
            newObject['minuto'+(num+1)] = parseInt(minutos, 16).toString()
            newObject['desfase'+(num+1)] = data[num].desfase
            newObject['mod_plan'+(num+1)] = mod_plan
          

        }
        newObject['ip'] = controlerState.ip
        newObject['num_horario'] = formatearTipoDia(tipoDia)
       
        try {
            postHorariosFromRestApi(newObject);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <>
            <Container maxWidth="md">
                <h1>Horarios View</h1>
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
                        <Button variant="contained" color='verde2' onClick={leerHorariosFromRestApi} sx={{ height: '100%' }} fullWidth>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{ height: '100%' }} fullWidth onClick={cargarDatos} >Cargar Datos</Button>
                    </Grid>
                    <Grid item xs={12} >
                        <div className='h-scroller'>

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
                    </Grid>

                    <Grid item xs={12}>
                        <h3>Parametros Operativos del Controlador</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <h3>Definicion de Fin de Semana</h3>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup className='alinear'>
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
                                value={modoSemaforo}
                                label="Modo Operativo"
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
                    <Grid item xs={4}>
                        <Button variant="contained" color='crema'>Crear</Button>
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

const rojo = {
    desfase1: "0", desfase2: "0", desfase3: "0", desfase4: "0", desfase5: "0", desfase6: "0", desfase7: "0", desfase8: "0",
    desfase9: "0", desfase10: "0", desfase11: "0", desfase12: "0", desfase13: "0", desfase14: "0", desfase15: "0", desfase16: "0",
    hora1: "1",
    hora2: "9", hora3: "20", hora4: "24", hora5: "0", hora6: "0", hora7: "0", hora8: "0", hora9: "0", hora10: "0", hora11: "0", hora12: "0", hora13: "0",
    hora14: "0", hora15: "0", hora16: "0", ip: "192.168.0.178", mac: '00:14:97:F2:D1:39',
    minuto1: "32", minuto2: "0", minuto3: "0", minuto4: "5", minuto5: "0", minuto6: "0",
    minuto7: "0", minuto8: "0", minuto9: "0", minuto10: "0", minuto11: "0", minuto12: "0", minuto13: "0", minuto14: "0", minuto15: "0", minuto16: "0",
    mod_plan1: 130, mod_plan2: 130, mod_plan3: 130, mod_plan4: 130, mod_plan5: 0, mod_plan6: 0, mod_plan7: 0, mod_plan8: 0, mod_plan9: 0, mod_plan10: 0, mod_plan11: 0,
    mod_plan12: 0, mod_plan13: 0, mod_plan14: 0, mod_plan15: 0, mod_plan16: 0, num_horario: "0"
}

const destello = {
    desfase1: "0", desfase2: "0", desfase3: "0", desfase4: "0", desfase5: "0", desfase6: "0", desfase7: "0", desfase8: "0",
    desfase9: "0", desfase10: "0", desfase11: "0", desfase12: "0", desfase13: "0", desfase14: "0", desfase15: "0", desfase16: "0",
    hora1: "1",
    hora2: "9", hora3: "20", hora4: "24", hora5: "0", hora6: "0", hora7: "0", hora8: "0", hora9: "0", hora10: "0", hora11: "0", hora12: "0", hora13: "0",
    hora14: "0", hora15: "0", hora16: "0", ip: "192.168.0.178", mac: '00:14:97:F2:D1:39',
    minuto1: "32", minuto2: "0", minuto3: "0", minuto4: "5", minuto5: "0", minuto6: "0",
    minuto7: "0", minuto8: "0", minuto9: "0", minuto10: "0", minuto11: "0", minuto12: "0", minuto13: "0", minuto14: "0", minuto15: "0", minuto16: "0",
    mod_plan1: 99, mod_plan2: 99, mod_plan3: 99, mod_plan4: 99, mod_plan5: 0, mod_plan6: 0, mod_plan7: 0, mod_plan8: 0, mod_plan9: 0, mod_plan10: 0, mod_plan11: 0,
    mod_plan12: 0, mod_plan13: 0, mod_plan14: 0, mod_plan15: 0, mod_plan16: 0, num_horario: "0"
}

const fijo = {
    desfase1: "0", desfase2: "0", desfase3: "0", desfase4: "0", desfase5: "0", desfase6: "0", desfase7: "0", desfase8: "0",
    desfase9: "0", desfase10: "0", desfase11: "0", desfase12: "0", desfase13: "0", desfase14: "0", desfase15: "0", desfase16: "0",
    hora1: "1",
    hora2: "9", hora3: "20", hora4: "24", hora5: "0", hora6: "0", hora7: "0", hora8: "0", hora9: "0", hora10: "0", hora11: "0", hora12: "0", hora13: "0",
    hora14: "0", hora15: "0", hora16: "0", ip: "192.168.0.178", mac: '00:14:97:F2:D1:39',
    minuto1: "32", minuto2: "0", minuto3: "0", minuto4: "5", minuto5: "0", minuto6: "0",
    minuto7: "0", minuto8: "0", minuto9: "0", minuto10: "0", minuto11: "0", minuto12: "0", minuto13: "0", minuto14: "0", minuto15: "0", minuto16: "0",
    mod_plan1: 34, mod_plan2: 35, mod_plan3: 34, mod_plan4: 35, mod_plan5: 0, mod_plan6: 0, mod_plan7: 0, mod_plan8: 0, mod_plan9: 0, mod_plan10: 0, mod_plan11: 0,
    mod_plan12: 0, mod_plan13: 0, mod_plan14: 0, mod_plan15: 0, mod_plan16: 0, num_horario: "0"
}
const planes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const planes2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']