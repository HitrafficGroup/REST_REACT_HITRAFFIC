import React, { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LightModeIcon from '@mui/icons-material/LightMode';
import { db } from "../firebase/firebase-config";
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import { updateDoc, doc } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/basicSettings.scss';
import frameJson from "../js/ht200Frame.json";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { updateParamsHT200 } from "../features/controlerht200/controlerHT200Slice";
import { generatePhaseFrame,generateSeqFrame,generateSplitFrame,generatePatternFrame,generateActionFrame,generatePlanFrame, generateChannelFrame } from "../js/generateFrameApiHT200";
import {setBasicPlan } from "../js/apiFunctionsHT200";
import { useSelector, useDispatch } from 'react-redux';
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

export default function BasicSettingsHT200View() {
    const controlerState = useSelector(state => state.controlerht200);
    const [planesSemaforos, setPlanesSemaforos] = useState([initial_paso]);
    const [disabledFlag, setDisabledFlag] = useState(true);
    const [hora, setHora] = useState(0);
    const [minuto, setMinuto] = useState(0);
    const dispatch = useDispatch();
    const [ctdPlanes, setCtdPlanes] = useState(1);
    const [planificacion, setPlanificacion] = useState(controlerState.planificacion);
    const agregarPaso = () => {
        let pasos = JSON.parse(JSON.stringify(planesSemaforos))
        let aux = JSON.parse(JSON.stringify(initial_paso))
        if (pasos.length >= 1) {
            setDisabledFlag(false)
        }
        aux.id = pasos.length + 1
        pasos.push(aux)
        setPlanesSemaforos(pasos)
    }
    const handleGrupo = (target, data) => {
        let pasos = JSON.parse(JSON.stringify(planesSemaforos))
        let aux_data = JSON.parse(JSON.stringify(data))

        aux_data[`${target}`] = !aux_data[`${target}`]
        let pasos_modify = pasos.map((item) => {
            if (item.id === aux_data.id) {
                return aux_data
            } else {
                return item
            }
        })
        setPlanesSemaforos(pasos_modify)
    }
    const eliminarPlan = (data) => {
        let pasos = JSON.parse(JSON.stringify(planesSemaforos))
        let data_filter = pasos.filter(item => item.id !== data.id)
        if (data_filter.length < 2) {
            setDisabledFlag(true)
        }
        setPlanesSemaforos(data_filter)
    }

    const agregarPlan = async () => {
        
        let pasos = JSON.parse(JSON.stringify(planesSemaforos));

        let aux_planificacion = JSON.parse(JSON.stringify(planificacion));
        let data_filter = aux_planificacion.filter(item => item.id !== "prueba")
        let aux_plan = {
            id: 12,
            data: pasos,
            hora: hora,
            minuto: minuto
        }
    

        data_filter.push(aux_plan);
        data_filter.sort(function (a, b) {
            let a_aux = parseInt(a.hora)
            let a_aux2 = parseInt(a.minuto)
            let b_aux = parseInt(b.hora)
            let b_aux2 = parseInt(b.minuto)
            a = a_aux * 100 + a_aux2
            b = b_aux * 100 + b_aux2
            return a -b 
        })
        let modify_data = data_filter.map((item,index)=>{
            item.id = index+1
            return item
        })
        
        console.log(modify_data)
        setPlanificacion(modify_data);
        setPlanesSemaforos([initial_paso])
        setHora(0)
        setMinuto(0)
        setDisabledFlag(true)
    }


    const eliminarHorario = (__data) => {
       
        let aux_data = JSON.parse(JSON.stringify(planificacion))
        aux_data = aux_data.filter(item=> item.id !== __data.id)
        setPlanificacion(aux_data)

    }

    
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }

    const cargarDatos = async() => {
        // valores por defecto
        let data_aux = JSON.parse(JSON.stringify(planificacion))
        if(data_aux.length>0){

            let fases_aux = JSON.parse(JSON.stringify(frameJson.fases))
            let seq_aux = JSON.parse(JSON.stringify(frameJson.seq))
            let split_aux = JSON.parse(JSON.stringify(frameJson.split))
            let pattern_aux = JSON.parse(JSON.stringify(frameJson.pattern))
            let accion_aux = JSON.parse(JSON.stringify(frameJson.acciones))
            let plan_aux = JSON.parse(JSON.stringify(frameJson.plan))
            let channel_aux = JSON.parse(JSON.stringify(frameJson.channel))
            let canales_duracion_aux = {
                g1:0,
                g2:0,
                g3:0,
                g4:0,
                g15:0,
            }
            let tiempos_aux = []
           
    
                for (let j = 0; j < data_aux.length; j++) {
                    //modificamos las secuencias
                    let new_seq = seq_aux[j]
                    for (let i = 0; i < data_aux[j].data.length; i++) {
                        let temp_data = data_aux[j].data[i]
                       
                        if(temp_data.g1 === false && temp_data.g2 === false && temp_data.g3 === false && temp_data.g4 === false ){
                            new_seq.ring1[i].value = 15
                            new_seq.ring2[i].value = 15
                            new_seq.ring3[i].value = 15
                            new_seq.ring4[i].value = 15
                            canales_duracion_aux.g15 = temp_data.duracion
                        }else{
                            let aux_ring = 1
                            for(let x=0;x<4;x++){
                                if(temp_data[`g${x+1}`]=== true){
                                    new_seq['ring'+aux_ring][i].value = x + 1
                                    canales_duracion_aux['g'+(x+1)] =  temp_data.duracion
                                    aux_ring +=1
                                }
                            }
                        }
                       
                        
                    }
                    tiempos_aux.push(canales_duracion_aux)
                    //modificamos el split
                    let new_split = split_aux[j]
        
                    for (let i = 0; i < 4; i++) {
                        new_split.data[i].fase = i + 1
                        new_split.data[i].tiempo = tiempos_aux[j]['g'+(i+1)]
                        new_split.data[i].coord = 4
                    }
                    new_split.data[4].fase = 15
                    new_split.data[4].tiempo = tiempos_aux[j].g15
                    new_split.data[4].coord = 4
                }
                // modificamos pattern
                for (let i = 0; i < ctdPlanes; i++) {
                    pattern_aux[i].cycletime = 0;
                    pattern_aux[i].number = i + 1;
                    pattern_aux[i].offsettime = 0;
                    pattern_aux[i].sequencenumber = i + 1;
                    pattern_aux[i].splitnumber = i + 1;
                    pattern_aux[i].workmode = 1;
                }
                // modificamos accion
                for (let i = 0; i < ctdPlanes; i++) {
                    accion_aux[i].number = i + 1;
                    accion_aux[i].patron = i + 1;
                    accion_aux[i].auxiliary = 0;
                    accion_aux[i].special = 0;
                }
                //modificamos plan
                let new_plan = plan_aux[0]
                for (let i = 0; i < ctdPlanes; i++) {
                    new_plan.data[i].action = i + 1;
                    new_plan.data[i].hour = data_aux[i].hora;
                    new_plan.data[i].minute = data_aux[i].minuto;
                }
         
            // generamos las tramas
            let fases_frame = generatePhaseFrame(fases_aux);
            let seq_frame = generateSeqFrame(seq_aux);
            let split_frame = generateSplitFrame(split_aux);
            let pattern_frame = generatePatternFrame(pattern_aux);
            let action_frame = generateActionFrame(accion_aux);
            let plan_frame =  generatePlanFrame(plan_aux)
            let channel_frame = generateChannelFrame(channel_aux)
            // cargar Datos
            await setBasicPlan({
                fases:fases_frame,
                secuencias:seq_frame,
                split:split_frame,
                pattern:pattern_frame,
                accion:action_frame,
                plan:plan_frame,
                channel:channel_frame,
                ip:controlerState.ip
            })
            await updateFirebase('planificacion',data_aux)
            dispatch(updateParamsHT200({target:'planificacion',data:data_aux}))
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'No data',
                text: "no hay planes para cargar",
    
              })
        }

      

    }
   
    return (
        <>
            <Container maxWidth="lg" sx={{ paddingTop: 15 }}>
                <Grid container spacing={3}>
                   
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="outlined-number"
                            label="hora"
                            type="number"
                            size="small"
                            value={hora}
                            fullWidth
                            onChange={(event) => { setHora(parseInt(event.target.value)) }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="outlined-number"
                            label="minuto"
                            value={minuto}
                            onChange={(event) => { setMinuto(parseInt(event.target.value)) }}
                            type="number"
                            size="small"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button fullWidth variant="outlined" sx={{ height: '100%' }} disabled={disabledFlag} onClick={agregarPlan}>CREAR PLAN</Button>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button fullWidth variant="contained" onClick={cargarDatos}  >CARGAR DATOS</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}  >
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>

                                            <TableCell
                                                key={"channel"}
                                                align={"left"}
                                                style={{ minWidth: 40 }}
                                            >
                                                Paso
                                            </TableCell>

                                            <TableCell
                                                key={"source"}
                                                align={"center"}
                                                style={{ minWidth: 140 }}
                                            >
                                                Grupo 1
                                            </TableCell>
                                            <TableCell
                                                key={"type"}
                                                align={"center"}
                                                style={{ minWidth: 140 }}
                                            >
                                                Grupo 2
                                            </TableCell>
                                            <TableCell
                                                key={"flash"}
                                                align={"center"}
                                                style={{ minWidth: 140 }}
                                            >
                                                Grupo 3
                                            </TableCell>
                                            <TableCell
                                                key={"dim"}
                                                align={"center"}
                                                style={{ minWidth: 140 }}

                                            >
                                                Grupo 4
                                            </TableCell>
                                            <TableCell
                                                key={"orientation"}
                                                align={"center"}
                                                style={{ minWidth: 30 }}
                                            >
                                                Tiempo
                                            </TableCell>

                                            <TableCell
                                                key={"delete"}
                                                align={"center"}

                                            >
                                            </TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {planesSemaforos
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        <TableCell align={"left"}>
                                                            <div className="basic-paso">
                                                                <strong>{index + 1}</strong>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <Chip label={row.g1 ? "VERDE" : "ROJO"} color={row.g1 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} onClick={() => { handleGrupo('g1', row) }} />
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <Chip label={row.g2 ? "VERDE" : "ROJO"} color={row.g2 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} onClick={() => { handleGrupo('g2', row) }} />
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <Chip label={row.g3 ? "VERDE" : "ROJO"} color={row.g3 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} onClick={() => { handleGrupo('g3', row) }} />
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <Chip label={row.g4 ? "VERDE" : "ROJO"} color={row.g4 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} onClick={() => { handleGrupo('g4', row) }} />
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <TextField
                                                                id="outlined-number"
                                                                label="Tiempo"
                                                                type="number"
                                                               
                                                                sx={{ width: 100 }}
                                                                onChange={(event) => { row.duracion = parseInt(event.target.value) }}
                                                                size="small"
                                                                InputLabelProps={{
                                                                    shrink: true,

                                                                }}
                                                            />
                                                        </TableCell>


                                                        <TableCell align={"center"}>
                                                            <IconButton aria-label="delete" onClick={() => { eliminarPlan(row) }} color="rojo">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>

                                                );
                                            })}
                                        <TableRow hover role="checkbox" tabIndex={-1} key={"buttom"} >
                                            <TableCell colSpan={8} align={"center"}>
                                                <Button variant="outlined" endIcon={<AddIcon />} onClick={agregarPaso}  >AGREGAR PASO</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    {
                        planificacion.map(item => (
                            <Grid item xs={12} >
                                <Typography variant="h6" gutterBottom>
                                    Hora: {item.hora} Minuto: {item.minuto} {"              "}
                                    <Button variant="outlined" color="amarillo" endIcon={<DeleteIcon />} onClick={() => { eliminarHorario(item) }}  >ELIMINAR PLAN</Button>
                                </Typography>

                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">Paso</StyledTableCell>
                                                <StyledTableCell align="center">Grupo 1</StyledTableCell>
                                                <StyledTableCell align="center">Grupo 2</StyledTableCell>
                                                <StyledTableCell align="center">Grupo 3</StyledTableCell>
                                                <StyledTableCell align="center">Grupo 4</StyledTableCell>
                                                <StyledTableCell align="center">Duracion</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.data.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="center">
                                                        <div className="basic-paso">
                                                            <strong>{index + 1}</strong>
                                                        </div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Chip label={row.g1 ? "VERDE" : "ROJO"} color={row.g1 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Chip label={row.g2 ? "VERDE" : "ROJO"} color={row.g2 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Chip label={row.g3 ? "VERDE" : "ROJO"} color={row.g3 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Chip label={row.g4 ? "VERDE" : "ROJO"} color={row.g4 ? "verde" : "rojo"} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {row.duracion}
                                                    </StyledTableCell>

                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        ))
                    }

                </Grid>
                <div style={{ height: 40 }}>

                </div>
            </Container>
        </>
    )
}

let initial_paso = { g1: false, g2: false, g3: false, g4: false, duracion: 10, id: 1 }
