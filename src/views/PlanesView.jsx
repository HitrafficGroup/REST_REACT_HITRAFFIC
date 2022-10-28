import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Input, Label } from 'reactstrap';
import '../css/PlanesView.css'
export default function PlanesView() {
    const [planes, setPlanes] = useState([
        { name: 'PLAN1', fase: 4, duracion: 16 },
        { name: 'PLAN2', fase: 1, duracion: 26 },
        { name: 'PLAN3', fase: 2, duracion: 16 },
        { name: 'PLAN4', fase: 1, duracion: 16 },
        { name: 'PLAN5', fase: 4, duracion: 26 },
        { name: 'PLAN6', fase: 1, duracion: 16 },
        { name: 'PLAN7', fase: 1, duracion: 0 },
        { name: 'PLAN8', fase: 4, duracion: 0 },
        { name: 'PLAN9', fase: 1, duracion: 0 },
        { name: 'PLAN10', fase: 1, duracion: 0 },
        { name: 'PLAN11', fase: 1, duracion: 0 },
        { name: 'PLAN12', fase: 1, duracion: 0 },
    ])
    return (
        <>
            <Container maxWidth="md">
                <h1>Planes</h1>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>

                                    <Th className='home-t-th'>Nro Paso</Th>
                                    <Th className='home-t-th'>Fase a ejecutar</Th>
                                    <Th className='home-t-th'>Duracion</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {planes.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {dato.name}
                                        </Td>
                                        <Td >
                                            <Input
                                                id="exampleNumber"
                                                name="number"
                                                placeholder="number placeholder"
                                                type="number"
                                                value={dato.fase}
                                            />


                                        </Td>
                                        <Td >
                                            <Input
                                                id="exampleNumber"
                                                name="number"
                                                placeholder="number placeholder"
                                                type="number"
                                                value={dato.duracion}
                                            />

                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color='primary' >Leer Datos</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained">Cargar Cambios</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <h4>Parametros Operativos del Controlador</h4>
                    </Grid>
                    <Grid item xs={12}>
                        <Label for="exampleNumber">
                            Tiempo de destello al prender (s)
                        </Label>
                        <Input
                            id="exampleNumber"
                            name="number"
                            placeholder="1 al 30"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Label for="exampleNumber">
                            Tiempo en rojo al prender (s)
                        </Label>
                        <Input
                            id="exampleNumber"
                            name="number"
                            placeholder="1 al 30"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Label for="exampleNumber">
                            Destellar luz verde peatonal (s)
                        </Label>
                        <Input
                            id="exampleNumber"
                            name="number"
                            placeholder="1 al 15"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Label for="exampleNumber">
                            Destellar luz verde vehicular (s)
                        </Label>
                        <Input
                            id="exampleNumber"
                            name="number"
                            placeholder="1 al 15"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <Label for="exampleNumber">
                        Tiempo en amarillo vehicular (s)
                        </Label>
                        <Input
                        id="exampleNumber"
                        name="number"
                        placeholder="number placeholder"
                        type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <Label for="exampleNumber">
                        Tiempo de todo en rojo (s)
                        </Label>
                        <Input
                        id="exampleNumber"
                        name="number"
                        placeholder="number placeholder"
                        type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Label for="exampleNumber">
                        Tiempo minimo en verde (s)
                        </Label>
                        <Input
                        id="exampleNumber"
                        name="number"
                        placeholder="number placeholder"
                        type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h4>Sincronizacion</h4>
                    </Grid>
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
                    <TextField id="outlined-basic" label="Retardo requerido para otros (s)" variant="outlined" fullWidth focused aria-readonly value={0}/>
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
