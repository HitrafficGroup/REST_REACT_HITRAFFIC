import React, { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LightModeIcon from '@mui/icons-material/LightMode';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/basicSettings.scss';

export default function BasicSettingsHT200View() {
    const [planesSemaforos, setPlanesSemaforos] = useState([initial_paso]);
    const [disabledFlag, setDisabledFlag] = useState(false);
    const agregarPaso = () => {
        let pasos = JSON.parse(JSON.stringify(planesSemaforos))
        let aux = JSON.parse(JSON.stringify(initial_paso))
        aux.id = pasos.length + 1
        pasos.push(aux)
        console.log(pasos)
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
        setPlanesSemaforos(data_filter)
    }
    return (
        <>
            <Container maxWidth="lg" sx={{ paddingTop: 15 }}>
            <Grid container spacing={1}>
                <Grid item md={3}>
                    <TextField
                        id="outlined-number"
                        label="hora"
                        type="number"
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={3}>
                    <TextField
                        id="outlined-number"
                        label="minuto"
                        type="number"
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={3}>
                <Button variant="outlined">CREAR PLAN</Button>
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
                </Grid>
             
            </Container>
        </>
    )
}
let initial_paso = { g1: false, g2: false, g3: false, g4: false, duracion: 0, hora: 0, minuto: 0, id: 1 }