import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import React, { useState } from 'react';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import { updateDoc, doc } from "firebase/firestore";
import FormControlLabel from '@mui/material/FormControlLabel';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import FormGroup from '@mui/material/FormGroup';
import { getHorariosFromRestApi, postHorariosFromRestApi, getDiasEspecialesControlador, setDiasEspecialesControlador } from '../js/apiFunctions'
import Checkbox from '@mui/material/Checkbox';
import { getCheckDataHorarios, updateHorarioSamplingTime } from '../js/gestionSolicitudes';
import Autocomplete from '@mui/material/Autocomplete';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import '../css/HorariosView.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
export default function HorariosView() {
    const [horarios, setHorarios] = useState(horariosPorDefecto);
    const controlerState = useSelector(state => state.controlers);
    const [modalHorarios, setModalHorarios] = useState(false);
    const [tipoDia, setTipoDia] = useState('');
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
    const [claseDia, setClaseDia] = useState(1);
    const [tablaDias, setTablaDias] = useState([]);
    const [cambiosHorarios, setCambiosHorarios] = useState(false);
    const [value, setValue] = useState(null);
    const [currentDiaFestivo, setCurrentDiaFestivo] = useState();
    const [cambioDias, setCambioDias] = useState(false);
    const [currentHorario, setCurrentHorario] = useState(
        { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    );
    const editarHorarios = (data) => {
        console.log(data)
       
        let plan
        let respaldo_data = JSON.parse(JSON.stringify(data));
        setCurrentHorario(respaldo_data)
        if(respaldo_data.plan.toString()=== "0"){
            
                plan = "1"
        }else{
                plan = respaldo_data.plan.toString()
        }
        setPlanSemaforo(plan)
        setModoSemaforo(respaldo_data.mod)
        setDesfaseSemaforo(respaldo_data.desfase)
        let horas = respaldo_data.horas
        let minutos = respaldo_data.minutos
        let tiempo = new Date(`Nov 02 1999 ${horas}:${minutos} GMT-0500 (Ecuador Time)`)

        setTime1(tiempo)
        console.log(respaldo_data)
        setModalHorarios(true);
        

    }
    const ChangeLunes = (event) => {
        setClunes(event.target.checked);
        setCambioDias(true);
    };
    const ChangeMartes = (event) => {
        setCmartes(event.target.checked);
        setCambioDias(true);
    };
    const ChangeMiercoles = (event) => {
        setCmiercoles(event.target.checked);
        setCambioDias(true);
    };
    const ChangeJueves = (event) => {
        setCjueves(event.target.checked);
        setCambioDias(true);
    };
    const ChangeViernes = (event) => {
        setCviernes(event.target.checked);
        setCambioDias(true);
    };
    const ChangeSabado = (event) => {
        setCsabado(event.target.checked);
        setCambioDias(true);
    };
    const ChangeDomingo = (event) => {
        setCDomingo(event.target.checked);
        setCambioDias(true);
    };


    const handleTime1 = (newValue) => {

        let h = new Date(newValue.$d)
        let horas = h.getHours()
        horas = ("0" + horas).slice(-2);
        let minutos = h.getMinutes()
        minutos = ("0" + minutos).slice(-2);
        console.log(horas)
        console.log(minutos)
        setTime1(newValue)
        currentHorario['horas'] = horas
        currentHorario['minutos'] = minutos
    }
    const aplicarLosCambios = () => {
        let newObjectHorario;
        let horarios_dias= JSON.parse(JSON.stringify(objHorarios));
        let aux_horarios = JSON.parse(JSON.stringify(horarios));
        if(modoSemaforo !== 0){
             newObjectHorario = {
                plan:planSemaforo,
                mod:modoSemaforo,
                desfase:desfaseSemaforo,
                horas: currentHorario.horas,
                minutos:currentHorario.minutos,
                nro:currentHorario.nro,
    
            }
        }else{
           newObjectHorario = { 
            nro: currentHorario.nro, 
            horas: '00',
             minutos: '00', 
             mod: 0, 
             plan: 0, 
             desfase: "0" } 
        }
        let datos_actualizados = aux_horarios.map((item)=>{
            if(item.nro === currentHorario.nro){
                return newObjectHorario
            }else{
                return item
            }

        })
        horarios_dias['dia_ordinario'] = datos_actualizados
        setHorarios(datos_actualizados)
        setObjHorarios(horarios_dias)
        // console.log(temp);
        setModalHorarios(false);
        setCambiosHorarios(true);
    }

    const handleModoSemaforo = (event) => {
        console.log(event.target.value);
        setModoSemaforo(event.target.value);

    }
    const handleFaseSemaforo = (event) => {
        setDesfaseSemaforo(event.target.value);
    }
    const handleClaseDia = (event) => {

        setClaseDia(event.target.value);
    }
    const chargeHorario = (data) => {
        setTipoDia('dia_ordinario')
        setHorarios(data['dia_ordinario'])
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
    const crearDiaEspecial = () => {
        const dateObj = new Date(value);
        const mes = dateObj.toLocaleString("es-EC", { month: '2-digit' });
        const dia = dateObj.toLocaleString("es-EC", { day: '2-digit' });
        const newDiaObject = {
            mes: mes,
            dia: dia,
            descriptor_modo: ObtenerClaseDia(claseDia),
            valor_modo: claseDia
        }

        setTablaDias([...tablaDias, newDiaObject]);
        setCambioDias(true);

    }
    const ObtenerClaseDia = (data) => {
        if (data === 1) {
            return 'Dia Ordinario'
        } else if (data === 2) {
            return 'Fin de Semana'
        } else {
            return 'Dia Festivo'
        }
    }
    const leerHorariosFromRestApi = async () => {
        try {
            let result;
            setHabilitar2(true);
            let flag = await getCheckDataHorarios(controlerState.mac, "horarios",3)
            if (flag !== false) {
                result = flag

            } else {
                result = await getHorariosFromRestApi(controlerState.mac, controlerState.ip)
                cargarHorariosFirebase(result)
                await updateHorarioSamplingTime(controlerState.mac)
            }
            setObjHorarios(result)
            console.log(result);
            chargeHorario(result);

            setHabilitar1(false)
            setHabilitar2(false);
        } catch (e) {
            console.log(e);
            setHabilitar2(false);
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
    const cargarDiaFestivo = () => {
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
                    setDiafestivoFromrestApi();
                    setCambioDias(false);

                } catch (e) {
                    console.log(e);

                }

            }
        })

    }
    const cargarDiaFestivosFirebase = async (data) => {
        const ref = doc(db, "controladores", `${controlerState.mac}`);
        await updateDoc(ref, {
            dias_especiales: data
        });
    }
    const setDiafestivoFromrestApi = async () => {
        setDeshabilitar4(true);
        let dias = tablaDias
        let festivos = [cdomingo, clunes, cmartes, cmiercoles, cjueves, cviernes, csabado]
        let binario = ""
        for (let j = 0; j < festivos.length; j++) {
            if (festivos[j]) {
                binario = "1" + binario
            } else {
                binario = "0" + binario
            }
        }
        console.log(binario)
        let dato_entero = parseInt(binario, 2)
        console.log(dias)
        let newDiasFest = {}
        for (let i = 0; i < 16; i++) {
            try {
                newDiasFest[`dia` + (1 + i)] = parseInt(dias[i]['dia'], 16).toString();
                newDiasFest[`mes` + (1 + i)] = parseInt(dias[i]['mes'].toString(16), 16).toString();
                newDiasFest[`mod` + (1 + i)] = parseInt(dias[i]['valor_modo'].toString(16), 16).toString();
            } catch (error) {
                newDiasFest[`dia` + (1 + i)] = "0";
                newDiasFest[`mes` + (1 + i)] = "0";
                newDiasFest[`mod` + (1 + i)] = "0";
            }

        }
        newDiasFest['fines_semana'] = dato_entero.toString();
        newDiasFest['ip'] = controlerState.ip;
        newDiasFest['mac'] = controlerState.mac;

        let newDiasFirebase = {
            dia_festivo: tablaDias,
            fines_semana: [
                { dia: 'domingo', estado: cdomingo },
                { dia: 'lunes', estado: clunes },
                { dia: 'martes', estado: cmartes },
                { dia: 'miercoles', estado: cmiercoles },
                { dia: 'jueves', estado: cjueves },
                { dia: 'viernes', estado: cviernes },
                { dia: 'sabado', estado: csabado }
            ]
        }
        await setDiasEspecialesControlador(newDiasFest);
        cargarDiaFestivosFirebase(newDiasFirebase)
        setDeshabilitar4(false);
    }
    const removeHorario = (_data) => {

        Swal.fire({
            title: 'Deseas Quitar Horario ?',
            text: 'Estos Cambios se guardaran en el Controlador',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("se removera el siguiente dato", _data)
                let obj_horarios_new = Object.assign({}, objHorarios);
                let objeto_vacio = { nro: 17, horas: '00', minutos: '00', mod: 0, plan: 0, desfase: "0" }
                let aux_horarios  = JSON.parse(JSON.stringify(horarios));
                console.log("horarios sin modificar:", horarios)
                let filter_h = aux_horarios.filter((item) => item.nro !== _data.nro)
                filter_h.push(objeto_vacio)
                filter_h.forEach((i, index) => {
                    i.nro = index
                })
                console.log(filter_h)
                setHorarios(filter_h)
                obj_horarios_new['dia_ordinario'] = filter_h
                setObjHorarios(obj_horarios_new);
                console.log(filter_h)
                setCambiosHorarios(true)
            }
        })
    }
    const borrarDiaFestivo = (data) => {
        setCurrentDiaFestivo(data);
        let aux = tablaDias
        console.log(tablaDias)
        let newDatos = aux.filter((_data) => {
            if (_data.dia === data.dia && _data.mes === data.mes) {
                return null
            } else {
                return _data
            }
        });
        console.log(newDatos)
        setTablaDias(newDatos)
        setCambioDias(true);
    }

    const cargarHorariosFirebase = async (data) => {
        const ref = doc(db, "controladores", `${controlerState.mac}`);
        await updateDoc(ref, {
            horarios: data
        });
    }

    const cargarDatos = async () => {

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

                    cargarHorariosFromRestApi();
                    
                    setCambiosHorarios(false);
                } catch (e) {
                    console.log(e);

                }

            }
        })


    }
    const cargarHorariosFromRestApi = async () => {
        setHabilitar2(true);
        const data = JSON.parse(JSON.stringify(horarios))
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
        console.log(objHorarios)
        cargarHorariosFirebase(objHorarios)
        await postHorariosFromRestApi(newObject);
        setHabilitar2(false);
    }
    return (
        <>
            <Container maxWidth="md">
                <div className='titulos-horarios'>
                    <h4>Configuración de Horarios</h4>
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
                                <MenuItem value={''}>Escoja Una Opción</MenuItem>
                                <MenuItem value={'dia_ordinario'}>Día Ordinario</MenuItem>
                                <MenuItem value={'fin_semana'}>Fin De Semana</MenuItem>
                                <MenuItem value={'dia_festivo'}>Día Festivo</MenuItem>
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
                                            <Tr className="tablas-focus" key={index} >
                                                <Td>
                                                    {dato.nro}
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
                                                    <Button variant="contained" onClick={() => { removeHorario(dato) }} sx={{ marginLeft: 2 }} color='rojo'>QUITAR</Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={cambiosHorarios}>
                            <Alert
                                severity="warning"
                                sx={{ mb: 2 }}
                            >
                                Se han Generado Cambios en los Días Especiales sin cargar al controlador
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <h5>Parámetros Operativos del Controlador</h5>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Definición de Fin de Semana</p>
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
                        <p>Definición de día Festivo</p>
                    </Grid>
                    <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Escoga Fecha"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
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
                                <MenuItem value={0}></MenuItem>
                                <MenuItem value={1}>Día Ordinario</MenuItem>
                                <MenuItem value={2}>Fin de Semana</MenuItem>
                                <MenuItem value={3}>Día Festivo</MenuItem>
                            
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar3} onClick={crearDiaEspecial} color='primary'>Crear</Button>
                    </Grid>

                    <Grid item xs={12} >
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>Fecha</Th>
                                    <Th className='home-t-th'>Tiempo de Ejecución</Th>
                                    <></>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tablaDias.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td >
                                            {dato.mes}-{dato.dia}-{2022}
                                        </Td>
                                        <Td >
                                            {dato.descriptor_modo}
                                        </Td>
                                        <Td>
                                            <Button variant="contained" sx={{ height: '100%' }} disabled={deshabilitar3} onClick={() => { borrarDiaFestivo(dato) }} color='rojo'>Borrar</Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={cambioDias}>
                            <Alert
                                severity="warning"
                                sx={{ mb: 2 }}
                            >
                                Se han Generado Cambios en los Días Especiales sin cargar al controlador
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={4} >
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={LeerParamOperativos} color='verde2'>LEER DATOS</Button>
                    </Grid>
                    <Grid item xs={4} >
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={cargarDiaFestivo} disabled={deshabilitar3} >CARGAR DATOS</Button>
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
                            Configuración de Horarios
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Escoga Fecha"
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
                                    <MenuItem value={0}>Ninguno</MenuItem>
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
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar4}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={habilitar2}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CardController/>
            <CardInformation/>
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


const planes2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']