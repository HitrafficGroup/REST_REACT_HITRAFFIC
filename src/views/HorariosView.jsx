import CardController from "../components/CardController";
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import { updateDoc, doc } from "firebase/firestore";
import FormControlLabel from '@mui/material/FormControlLabel';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { getOrdinaryScheduleSW12, getWeekendScheduleSW12, getFestivalScheduleSW12, getSpecialDaysSW12, postHorariosSW12, postDiasEspecialesSW12 } from '../js/apiFunctionsSW12';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { addOrdinarios, addFestivo, addFinSemana } from "../features/controlers/controlerSlice";
import { useSelector, useDispatch } from 'react-redux';
import '../css/HorariosView.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// select
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// tablas
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
export default function HorariosView() {
    const [horarios, setHorarios] = useState(horariosPorDefecto);
    const controlerState = useSelector(state => state.controlers);
    const [modalHorarios, setModalHorarios] = useState(false);
    const [tipoDia, setTipoDia] = useState(0);
    const [time1, setTime1] = useState(new Date());
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
    const [claseDia, setClaseDia] = useState(3);
    const [tablaDias, setTablaDias] = useState([]);
    const [cambiosHorarios, setCambiosHorarios] = useState(false);
    const [value, setValue] = useState(null);
    const [cambioDias, setCambioDias] = useState(false);
    const dispatch = useDispatch();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [currentHorario, setCurrentHorario] = useState(
        { horas: '00', minutos: '00', mod: 0, plan: 0, desfase: '0' },
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const editarHorarios = (__data) => {
        let respaldo_data = JSON.parse(JSON.stringify(__data));
        if(respaldo_data.plan === 0){
            respaldo_data.plan = 1
            respaldo_data.mod = 1
        }
        setCurrentHorario(respaldo_data)
        let horas = respaldo_data.horas
        let minutos = respaldo_data.minutos
        let tiempo = new Date(`Nov 02 1999 ${horas}:${minutos} GMT-0500 (Ecuador Time)`)
        setTime1(tiempo)
        setModalHorarios(true);
    }
    const handleHorario = (event) => {
        setCurrentHorario({
            ...currentHorario,
            [event.target.name]: event.target.value,
        });
    };
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
        setTime1(newValue)
        currentHorario['horas'] = horas
        currentHorario['minutos'] = minutos
    }
    const aplicarLosCambios = () => {
        let aux_horarios = JSON.parse(JSON.stringify(horarios));
        let horario = JSON.parse(JSON.stringify(currentHorario));
        horario.desfase = parseInt(horario.desfase)
        let horarios_modify = aux_horarios.map((item) => {
            if (item.id === horario.id) {
                return horario
            } else {
                return item;
            }
        })

        let data_aux = horarios_modify.filter(item => item.mod !== 0)
        data_aux.sort(function (a, b) {
            let a_aux = parseInt(a.horas)
            let a_aux2 = parseInt(a.minutos)
            let b_aux = parseInt(b.horas)
            let b_aux2 = parseInt(b.minutos)
            a = a_aux * 100 + a_aux2
            b = b_aux * 100 + b_aux2
            return a - b
        })
        let aux_order = JSON.parse(JSON.stringify(data_aux));
        let temp_order = []
        for (let i = 0; i < 16; i++) {
            if (i < aux_order.length) {
                temp_order.push(aux_order[i])
            } else {
                temp_order.push(horario_cero)
            }
        }

        let final_data = JSON.parse(JSON.stringify(temp_order));
        for (let i = 0; i < 12; i++) {
            final_data[i].id = `horario-${i}`
        }
        setHorarios(final_data)
        setModalHorarios(false)
    }


    const handleClaseDia = (event) => {

        setClaseDia(event.target.value);
    }

    const handleTipoDia = (event) => {
        setHabilitar1(true)
        setTipoDia(event.target.value);


    };
    const crearDiaEspecial = () => {

        let aux_horarios = JSON.parse(JSON.stringify(tablaDias));
        const dateObj = new Date(value);
        const mes = dateObj.toLocaleString("es-EC", { month: '2-digit' });
        const dia = dateObj.toLocaleString("es-EC", { day: '2-digit' });
        let num_id = tablaDias.length + 1
        const newDiaObject = {
            id: `date-${num_id}`,
            mes: mes,
            dia: dia,
            descriptor_modo: ObtenerClaseDia(claseDia),
            tipo: claseDia
        }
        aux_horarios.push(newDiaObject)
        setTablaDias(aux_horarios)
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
    const readData = async () => {
        let formated_data = [{}]
        let result = []
        setHabilitar2(true);
        try {
            if (tipoDia === 0) {
                result = await getOrdinaryScheduleSW12(controlerState.ip)
                formated_data = result.map(item => {
                    let mod = formatMod(item.modo)
                    let horario_formated = {
                        id: item.id,
                        horas: formatHour(item.hora),
                        minutos: formatMinute(item.minuto),
                        mod: mod[0],
                        mod_descriptor: mod[1],
                        plan: mod[2],
                        desfase: item.desfase
                    }

                    return horario_formated
                })
                updateFirebase('horario_ordinario', formated_data);
                dispatch(addOrdinarios(formated_data));
            } else if (tipoDia === 1) {
                result = await getWeekendScheduleSW12(controlerState.ip)
                formated_data = result.map(item => {
                    let mod = formatMod(item.modo)
                    let horario_formated = {
                        id: item.id,
                        horas: formatHour(item.hora),
                        minutos: formatMinute(item.minuto),
                        mod: mod[0],
                        mod_descriptor: mod[1],
                        plan: mod[2],
                        desfase: item.desfase
                    }

                    return horario_formated
                })
                updateFirebase('horario_finsemana', formated_data);
                dispatch(addFinSemana(formated_data));
            } else if (tipoDia === 2) {
                result = await getFestivalScheduleSW12(controlerState.ip)

                formated_data = result.map(item => {
                    let mod = formatMod(item.modo)
                    let horario_formated = {
                        id: item.id,
                        horas: formatHour(item.hora),
                        minutos: formatMinute(item.minuto),
                        mod: mod[0],
                        mod_descriptor: mod[1],
                        plan: mod[2],
                        desfase: item.desfase
                    }

                    return horario_formated
                })
                updateFirebase('horario_festivo', formated_data);
                dispatch(addFestivo(formated_data));
            }
            setHorarios(formated_data)


            setHabilitar1(false)
            setHabilitar2(false);
        } catch (e) {

            setHabilitar2(false);
        }
    }
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data
        await updateDoc(ref, aux_data);
    }
    const formatMod = (_data) => {
        let nombres = ["", "Tiempo Fijo", "Pulsante", "Destello", "Todo en Rojo", "Apagado"]
        let mod_plan = _data
        mod_plan = mod_plan.toString(2)
        let bits_faltantes = 8 - mod_plan.length
        for (let bit = 0; bit < bits_faltantes; bit++) {
            mod_plan = "0" + mod_plan
        }
        let mod = mod_plan.substring(0, 3)
        let plan = mod_plan.substring(3, 8)
        let mod_int = parseInt(mod, 2)
        let plan_int = parseInt(plan, 2)
        return [mod_int, nombres[mod_int], plan_int]
    }
    const formatHour = (hora) => {
        hora = hora.toString(16)
        if (hora.length < 2) {
            hora = "0" + hora
        }
        return hora
    }
    const formatMinute = (_data) => {
        let minutos = _data.toString(16)
        if (minutos.length < 2) {
            minutos = "0" + minutos
        }
        return minutos
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

    const LeerParamOperativos = async () => {
        try {
            setDeshabilitar4(true);
            const data = await getSpecialDaysSW12(controlerState.ip);
            updateFirebase('dias_especiales', data)
            setClunes(data['fines_semana'].lunes)
            setCmartes(data['fines_semana'].martes)
            setCmiercoles(data['fines_semana'].miercoles)
            setCjueves(data['fines_semana'].jueves)
            setCviernes(data['fines_semana'].viernes)
            setCsabado(data['fines_semana'].sabado)
            setCDomingo(data['fines_semana'].domingo)
            let dias = data['dias']
            let dias_modify = dias.map(item => {
                item.dia = formatData(item.dia)
                item.mes = formatData(item.mes)
                item.descriptor_modo = ObtenerClaseDia(item.tipo)
                return item
            })
            setTablaDias(dias_modify)
            setDeshabilitar3(false)
            setDeshabilitar4(false);
        } catch (error) {
            setDeshabilitar4(false);
            setDeshabilitar3(true);
        }
    }
    const formatData = (_data) => {
        let data = _data.toString(16)
        if (data.length < 2) {
            data = "0" + data
        }
        return data
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
                setDiafestivoFromrestApi();
                setCambioDias(false);
            }
        })

    }

    const setDiafestivoFromrestApi = async () => {
        setDeshabilitar4(true);
        let dias_festivos = JSON.parse(JSON.stringify(tablaDias))
        let data_dias = [3]

        for (let i = 0; i < 16; i++) {
            if (i < dias_festivos.length) {
                let aux_mes = parseInt(dias_festivos[i].mes, 16)
                let aux_dia = parseInt(dias_festivos[i].dia, 16)
                data_dias.push(aux_mes)
                data_dias.push(aux_dia)
                data_dias.push(dias_festivos[i].tipo)

            } else {
                data_dias.push(0)
                data_dias.push(0)
                data_dias.push(0)
            }
        }
        data_dias.push(65)
        await postDiasEspecialesSW12({trama: data_dias,ip:controlerState.ip});
        //cargarDiaFestivosFirebase(newDiasFirebase)
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
                let objeto_vacio = { id: '', horas: '00', minutos: '00', mod: 0, plan: 0, desfase: "0" }
                let aux_horarios = JSON.parse(JSON.stringify(horarios));

                let filter_h = aux_horarios.filter((item) => item.id !== _data.id)
                filter_h.push(objeto_vacio)
                filter_h.forEach((i, index) => {
                    i.id = `horario-${index}`
                })

                setHorarios(filter_h)
                setCambiosHorarios(true)
            }
        })
    }
    const borrarDiaFestivo = (data) => {

        let aux = tablaDias
        let newDatos = aux.filter((_data) => {
            if (_data.dia === data.dia && _data.mes === data.mes) {
                return null
            } else {
                return _data
            }
        });
        setTablaDias(newDatos)
        setCambioDias(true);
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
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    setHabilitar2(true);
                    const data = JSON.parse(JSON.stringify(horarios));
                    let datos_enviar = [tipoDia]
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
                        let aux_hora = parseInt(horas, 16)
                        let aux_minuto = parseInt(minutos, 16)
                        let desfase = data[num].desfase
                        datos_enviar.push(aux_hora)
                        datos_enviar.push(aux_minuto)
                        datos_enviar.push(mod_plan)
                        datos_enviar.push(desfase)
                    }
                    await postHorariosSW12({trama:datos_enviar,ip:controlerState.ip});
                    if (tipoDia === 0) {
                        updateFirebase('horario_ordinario', data);
                        dispatch(addOrdinarios(data));
                    } else if (tipoDia === 1) {
                        updateFirebase('horario_finsemana', data);
                        dispatch(addFinSemana(data));
                    } else {
                        updateFirebase('horario_festivo', data);
                        dispatch(addFestivo(data));
                    }
            
                    setHabilitar2(false);
                    setCambiosHorarios(false);
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
                    <h4>Configuración de Horarios</h4>
                </div>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tipoDia}
                                label="Tipo"
                                onChange={handleTipoDia}
                            >
                                <MenuItem value={0}>Día Ordinario</MenuItem>
                                <MenuItem value={1}>Fin De Semana</MenuItem>
                                <MenuItem value={2}>Día Festivo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' onClick={readData} sx={{ height: '100%' }} disabled={habilitar2} fullWidth>Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} fullWidth onClick={cargarDatos} disabled={habilitar1} >Cargar Datos</Button>
                    </Grid>
                    <Grid item xs={12} >
                        <div className={habilitar1 ? 'disabled-tabla-horarios' : 'habilited-tabla-horarios'}>
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
                                                align={"center"}
                                            >
                                                Hora De Inicio
                                            </TableCell>
                                            <TableCell
                                                key={"dura"}
                                                align={"center"}
                                            >
                                                Modo Operativo
                                            </TableCell>

                                            <TableCell
                                                key={"plan"}
                                                align={"left"}
                                            >
                                                Plan No.
                                            </TableCell>
                                            <TableCell
                                                key={"desfase"}
                                                align={"left"}
                                            >
                                                Desfase
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
                                        {horarios
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((dato, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        <TableCell align={"left"}>
                                                            {dato.id}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {dato.horas + ':' + dato.minutos}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {dato.mod ? modoFormat(dato.mod) : 'No especificado'}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {dato.plan}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {dato.desfase}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <div className="horarios-t-buttons">
                                                                <IconButton aria-label="delete"  color="rojo" onClick={() => { removeHorario(dato) }}>
                                                                    <DeleteIcon  />
                                                                </IconButton>
                                                                <IconButton aria-label="delete"  color="amarillo" onClick={() => { editarHorarios(dato) }}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </div>
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
                                count={horarios.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />

                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={cambiosHorarios}>
                            <Alert
                                severity="warning"
                                sx={{ mb: 2 }}
                            >
                                Se han Generado Cambios en {tipoDia} sin cargar al controlador
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
                    <Grid item md={4} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Escoga Fecha"
                                value={value}

                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} xs={12}>
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
                                <MenuItem value={1}>Día Ordinario</MenuItem>
                                <MenuItem value={2}>Fin de Semana</MenuItem>
                                <MenuItem value={3}>Día Festivo</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} disabled={deshabilitar3} onClick={crearDiaEspecial} color='primary'>Crear</Button>
                    </Grid>

                    <Grid item xs={12} >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Fecha</StyledTableCell>
                                        <StyledTableCell align="left">Modo</StyledTableCell>
                                        <StyledTableCell align="left">Acciones</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tablaDias.map((dato, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center"> {dato.mes}-{dato.dia}-{2023}</StyledTableCell>
                                            <StyledTableCell align="left"> {dato.descriptor_modo}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                <Button variant="contained" sx={{ height: '100%' }} disabled={deshabilitar3} onClick={() => { borrarDiaFestivo(dato) }} color='rojo'>Borrar</Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                    <Grid item md={4} xs={12} >
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={LeerParamOperativos} color='verde2'>LEER DATOS</Button>
                    </Grid>
                    <Grid item md={4} xs={12} >
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={cargarDiaFestivo} disabled={deshabilitar3} >CARGAR DATOS</Button>
                    </Grid>
                    <Grid item xs={12} >
                        <div style={{ height: 8 }}>

                        </div>
                    </Grid>

                </Grid>
            </Container>
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
                                    label="Horario"
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
                                    value={currentHorario.mod}
                                    label="Modo Operativo"
                                    name='mod'
                                    onChange={handleHorario}
                                >
                                    <MenuItem value={0}>Ninguno</MenuItem>
                                    <MenuItem value={1}>Tiempo Fijo</MenuItem>
                                    <MenuItem value={3}>Destello</MenuItem>
                                    <MenuItem value={4}>Todo en Rojo</MenuItem>
                                    <MenuItem value={5}>Apagado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Plan</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentHorario.plan}
                                    label="Plan"
                                    name='plan'
                                    onChange={handleHorario}
                                >
                                    <MenuItem value={0}>No Especificado</MenuItem>
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
                        <Grid item xs={12}>
                            <TextField id="outlined-number" label="Desfase" name='desfase' onChange={handleHorario} fullWidth value={currentHorario.desfase}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }} />
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
            <CardController />
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

let horario_cero = {
    desfase: 0,
    horas: '00',
    id: 'horario-0',
    minutos: '00',
    mod: 0,
    mod_descriptor: "",
    plan: 0,
}