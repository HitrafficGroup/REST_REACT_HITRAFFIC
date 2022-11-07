import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Autocomplete from '@mui/material/Autocomplete';
import '../css/PlanesView.css'
import { useSelector, useDispatch } from 'react-redux';
import { addPlanes } from "../features/controlers/controlerSlice"
import { getPlanesFromRestApi } from '../js/apiFunctions'

export default function PlanesView() {
    const dispatch = useDispatch();
    const controlerState = useSelector(state => state.controlers)
    const [currentPlan, setCurrentPlan] = useState([
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
    ])
    const [selectPlan, setSelectPlan] = useState([]);
    const [planes, setPlanes] = useState([])

    const leerPlanesFromRestApis = async () => {

        try {
            const result = await getPlanesFromRestApi(controlerState.mac, controlerState.ip)
            console.log(result[controlerState.mac]);
            setPlanes(result[controlerState.mac]);
            dispatch(addPlanes(result));
        }
        catch (e) {
            console.log(e);
        }
    }
    const planSelectManager = (data) => {
        setSelectPlan(data);
        var nplan = currentPlan;
        nplan[0].fase = data.pasos[0]
        nplan[0].duracion = data.pasos[1]
        nplan[1].fase = data.pasos[2]
        nplan[1].duracion = data.pasos[3]
        nplan[2].fase = data.pasos[4]
        nplan[2].duracion = data.pasos[5]
        nplan[3].fase = data.pasos[6]
        nplan[3].duracion = data.pasos[7]

        nplan[4].fase = data.pasos[8]
        nplan[4].duracion = data.pasos[9]

        nplan[5].fase = data.pasos[10]
        nplan[5].duracion = data.pasos[11]

        nplan[6].fase = data.pasos[12]
        nplan[6].duracion = data.pasos[13]

        nplan[7].fase = data.pasos[14]
        nplan[7].duracion = data.pasos[15]

        nplan[8].fase = data.pasos[16]
        nplan[8].duracion = data.pasos[17]

        nplan[9].fase = data.pasos[18]
        nplan[9].duracion = data.pasos[19]

        nplan[10].fase = data.pasos[20]
        nplan[10].duracion = data.pasos[21]

        nplan[11].fase = data.pasos[22]
        nplan[11].duracion = data.pasos[23]
        console.log(nplan)
        setCurrentPlan(nplan);
    }

    return (
        <>
            <Container maxWidth="md">
                <h1>Planes</h1>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Autocomplete
                            onChange={(event, newValue) => { planSelectManager(newValue) }}
                            options={planes}
                            getOptionLabel={(option) => option.numPlan}
                            id="controllable-states-demo"

                            renderInput={(params) => <TextField {...params} label="Escoga Un Plan" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" fullWidth color='verde2' onClick={leerPlanesFromRestApis} sx={{ height: '100%' }} >Leer Datos</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" fullWidth sx={{ height: '100%' }} color="primary">Cargar Cambios</Button>
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={12}>
                        <div className='scroller'>

                            <Table >
                                <Thead>
                                    <Tr>

                                        <Th >Nro Paso</Th>
                                        <Th className='home-t-th'>Fase a ejecutar</Th>
                                        <Th className='home-t-th'>Duracion</Th>
                                        <Th className='home-t-th'>Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentPlan.map((dato, index) => (
                                        <Tr className="tr-planes" key={index} >
                                            <Td>
                                                {dato.name}
                                            </Td>
                                            <Td >
                                                <TextField
                                                    id="outlined-read-only-input"
                                                    label="Fase"
                                                    defaultValue={dato.fase}
                                                    value={dato.fase}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />


                                            </Td>
                                            <Td >
                                                <TextField
                                                    id="outlined-read-only-input"
                                                    label="Duracion"
                                                    defaultValue={dato.duracion}
                                                    value={dato.duracion}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />

                                            </Td>
                                            <Td >

                                                <Button variant="contained" color="crema">Editar</Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <h4>Parametros Operativos del Controlador</h4>
                    </Grid>
                    <Grid item xs={4}>

                        <TextField
                            id="outlined-number"
                            label="Tiempo de destello al prender (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo en rojo al prender (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>

                        <TextField
                            id="outlined-number"
                            label="Destellar luz verde peatonal (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Destellar luz verde vehicular (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo en amarillo vehicular (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label=" Tiempo de todo en rojo (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-number"
                            label="Tiempo minimo en verde (s)"
                            type="number"
                            value={0}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h4>Sincronizacion</h4>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Direccion"
                            >
                                <MenuItem value={'norte'}>Hitraffic</MenuItem>
                                <MenuItem value={'sur'}>Goia</MenuItem>
                                <MenuItem value={'este'}>Este</MenuItem>
                                <MenuItem value={'oeste'}>Oeste</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="outlined-basic" label="Retardo requerido para otros (s)" variant="outlined" fullWidth focused aria-readonly value={0} />
                    </Grid>
                    <Grid item xs={12}>
                        <div className='blank-box'>

                        </div>
                    </Grid>

                </Grid>
            </Container>
        </>
    );

}
